// Online backup of the progress: merging two progress states, and keeping the
// account copy in step with this browser.
//
// The storage service is a "backend" object (see cloud.js for Firebase):
//   getProgress(uid) -> { data: string (JSON), updatedAt: ms } | null
//   setProgress(uid, data: string, updatedAt: ms)
// so the logic here runs in Node with a fake backend (tests/sync.test.mjs).

import { normalize } from './store.js';

const minTs = (a, b) => (a && b ? Math.min(a, b) : a || b);

function unionTs(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = minTs(out[k], v);
  return out;
}

/**
 * The union of two progress states (this browser and the account): every
 * lesson, exam and badge of either, for each question its latest answer, for
 * each skill the history of the side that answered it last.
 */
export function mergeStates(course, a, b) {
  a = normalize(a);
  b = normalize(b);
  const out = normalize(a);
  out.q = { ...a.q };
  for (const [id, e] of Object.entries(b.q)) if (!out.q[id] || (e.last || 0) > (out.q[id].last || 0)) out.q[id] = e;
  const lastOn = (s, skill) => Math.max(0, ...(course.skills.get(skill)?.questions || []).map((id) => s.q[id]?.last || 0));
  out.skills = {};
  for (const skill of new Set([...Object.keys(a.skills), ...Object.keys(b.skills)])) {
    out.skills[skill] = (lastOn(b, skill) > lastOn(a, skill) ? b.skills[skill] : a.skills[skill]) || b.skills[skill] || [];
  }
  out.lessons = {};
  for (const id of new Set([...Object.keys(a.lessons), ...Object.keys(b.lessons)])) {
    const x = a.lessons[id] || {};
    const y = b.lessons[id] || {};
    out.lessons[id] = {};
    if (x.done || y.done) out.lessons[id].done = minTs(x.done, y.done);
    if (x.deep || y.deep) out.lessons[id].deep = minTs(x.deep, y.deep);
  }
  out.exams = {};
  for (const id of new Set([...Object.keys(a.exams), ...Object.keys(b.exams)])) {
    const seen = new Map();
    for (const e of [...(a.exams[id] || []), ...(b.exams[id] || [])]) seen.set(`${e.ts}/${e.score}/${e.total}`, e);
    out.exams[id] = [...seen.values()].sort((x, y) => x.ts - y.ts);
  }
  out.badges = unionTs(a.badges, b.badges);
  out.glossarySeen = unionTs(a.glossarySeen, b.glossarySeen);
  out.wasWeak = unionTs(a.wasWeak, b.wasWeak);
  out.repaired = unionTs(a.repaired, b.repaired);
  out.terminal = { ...a.terminal };
  for (const [k, v] of Object.entries(b.terminal)) out.terminal[k] = Math.max(out.terminal[k] || 0, v);
  out.days = { ...a.days };
  for (const [k, v] of Object.entries(b.days)) out.days[k] = Math.max(out.days[k] || 0, v);
  // The xp of the two copies overlap (both may hold the same answers): the larger one.
  out.xp = Math.max(a.xp, b.xp);
  const later = (b.streak.day || '') > (a.streak.day || '') ? b.streak : a.streak;
  out.streak = { ...later, best: Math.max(a.streak.best, b.streak.best) };
  out.name = a.name || b.name;
  out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
  return out;
}

/** Has anything been done in this state? */
export const hasProgress = (s) => s.xp > 0 || Object.keys(s.q).length > 0 || Object.keys(s.lessons).length > 0;

/**
 * Keeps the account copy in step: on sign-in, merges the account copy and
 * this browser; then every change is sent (grouped, `delay` ms after the last
 * one). status(kind, info) reports 'syncing' | 'synced' | 'offline' | 'error'.
 */
export class Sync {
  constructor({ backend, course, getState, setState, status = () => {}, delay = 2000 }) {
    Object.assign(this, { backend, course, getState, setState, status, delay });
    this.uid = null;
    this.timer = null;
    this.pending = false;
    this.lastSync = 0;
    this.seen = null; // updatedAt of the account copy last read or written
  }

  /** Signs in `uid`: returns 'pulled' | 'pushed' | 'merged' | 'same'. */
  async start(uid) {
    this.uid = uid;
    this.status('syncing');
    try {
      const remote = await this.backend.getProgress(uid);
      const local = this.getState();
      let outcome;
      if (!remote) outcome = 'pushed';
      else {
        const cloud = normalize(JSON.parse(remote.data));
        if (!hasProgress(local)) {
          this.setState({ ...cloud, lang: local.lang, theme: local.theme });
          outcome = 'pulled';
        } else if (same(cloud, local)) {
          outcome = 'same';
        } else {
          this.adopt(mergeStates(this.course, local, cloud));
          outcome = 'merged';
        }
        this.seen = remote.updatedAt;
      }
      if (outcome !== 'same' && outcome !== 'pulled') await this.push();
      else {
        this.lastSync = Date.now();
        this.status('synced', { at: this.lastSync });
      }
      return outcome;
    } catch (err) {
      this.status(isOffline(err) ? 'offline' : 'error', { message: err.message });
      this.pending = true;
      throw err;
    }
  }

  /** Takes a merged state, keeping this browser's language and theme. */
  adopt(merged) {
    const local = this.getState();
    merged.lang = local.lang;
    merged.theme = local.theme;
    this.setState(merged);
  }

  /**
   * Merges into this browser what another device sent since the last
   * exchange. Returns true when the state changed.
   */
  async pull() {
    if (!this.uid) return false;
    const uid = this.uid;
    const remote = await this.backend.getProgress(uid);
    if (uid !== this.uid || !remote || remote.updatedAt === this.seen) return false;
    this.seen = remote.updatedAt;
    const local = this.getState();
    const cloud = normalize(JSON.parse(remote.data));
    if (same(cloud, local)) return false;
    this.adopt(mergeStates(this.course, local, cloud));
    return true;
  }

  /** Coming back to the page: fetch the other devices' progress. */
  async refresh() {
    if (!this.uid) return;
    try {
      if (await this.pull()) await this.push();
    } catch (err) {
      this.status(isOffline(err) ? 'offline' : 'error', { message: err.message });
    }
  }

  stop() {
    clearTimeout(this.timer);
    this.uid = null;
    this.seen = null;
    this.pending = false;
  }

  /** A change was saved locally: send it a little later. */
  changed() {
    if (!this.uid) return;
    this.pending = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.push().catch(() => {}), this.delay);
  }

  /**
   * Sends the current state now, merged first with what another device may
   * have sent meanwhile (so two open devices never erase each other's work).
   */
  async push() {
    if (!this.uid) return;
    clearTimeout(this.timer);
    const uid = this.uid;
    this.status('syncing');
    try {
      await this.pull();
      if (uid !== this.uid) return;
      const state = this.getState();
      const updatedAt = Math.max(state.updatedAt || 0, (this.seen || 0) + 1);
      await this.backend.setProgress(uid, JSON.stringify(state), updatedAt);
      this.seen = updatedAt;
      if (uid !== this.uid) return;
      this.pending = false;
      this.lastSync = Date.now();
      this.status('synced', { at: this.lastSync });
    } catch (err) {
      this.pending = true;
      this.status(isOffline(err) ? 'offline' : 'error', { message: err.message });
      throw err;
    }
  }

  /** Back online, or the page is being left: send what is waiting. */
  flush() {
    if (this.pending && this.uid) return this.push().catch(() => {});
    return Promise.resolve();
  }
}

const same = (a, b) => JSON.stringify({ ...a, lang: 0, theme: 0, updatedAt: 0 }) === JSON.stringify({ ...b, lang: 0, theme: 0, updatedAt: 0 });

function isOffline(err) {
  return (typeof navigator !== 'undefined' && navigator.onLine === false) || /network|offline|unavailable/i.test(`${err?.code} ${err?.message}`);
}
