// Online backup: merging two progress states, and the sync with a fake backend.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { GLOSSARY, MODULES } from '../content/index.js';
import { buildCourse, record } from '../js/adaptive.js';
import { emptyState } from '../js/store.js';
import { Sync, mergeStates } from '../js/sync.js';

const course = buildCourse(MODULES, GLOSSARY);
const ids = [...course.questions.keys()];

function fakeBackend() {
  const docs = new Map();
  return {
    docs,
    fail: false,
    async getProgress(uid) { if (this.fail) throw Object.assign(new Error('unavailable'), { code: 'unavailable' }); return docs.get(uid) ?? null; },
    async setProgress(uid, data, updatedAt) { if (this.fail) throw Object.assign(new Error('unavailable'), { code: 'unavailable' }); docs.set(uid, { data, updatedAt }); },
  };
}

function harness(backend, initial = emptyState()) {
  let state = initial;
  const statuses = [];
  const sync = new Sync({ backend, course, getState: () => state, setState: (s) => { state = s; }, status: (k) => statuses.push(k), delay: 5 });
  return { sync, get state() { return state; }, set state(s) { state = s; }, statuses };
}

test('merge keeps the work of both sides', () => {
  const a = emptyState();
  const b = emptyState();
  record(course, a, ids[0], true, 1000);
  record(course, b, ids[0], false, 2000); // answered later on the other device
  record(course, b, ids[1], true, 2000);
  a.lessons['js-1'] = { done: 500 };
  b.lessons['git-1'] = { done: 700 };
  a.exams.js = [{ score: 8, total: 10, ts: 10 }];
  b.exams.js = [{ score: 8, total: 10, ts: 10 }, { score: 9, total: 10, ts: 20 }];
  b.badges.exam = 30;
  a.terminal['git-term'] = 2;
  b.terminal['git-term'] = 5;
  const m = mergeStates(course, a, b);
  assert.equal(m.q[ids[0]].lastOk, false, 'latest answer wins');
  assert.ok(m.q[ids[1]]);
  assert.deepEqual(Object.keys(m.lessons).sort(), ['git-1', 'js-1']);
  assert.equal(m.exams.js.length, 2, 'same exam counted once');
  assert.equal(m.badges.exam, 30);
  assert.equal(m.terminal['git-term'], 5);
  assert.equal(m.xp, Math.max(a.xp, b.xp));
  const skill = course.questions.get(ids[0]).skill;
  assert.deepEqual(m.skills[skill], b.skills[skill], 'skill history of the side that answered last');
});

test('first sign-in on a new account sends this browser’s progress', async () => {
  const backend = fakeBackend();
  const local = emptyState();
  record(course, local, ids[0], true);
  const h = harness(backend, local);
  assert.equal(await h.sync.start('u1'), 'pushed');
  assert.equal(JSON.parse(backend.docs.get('u1').data).xp, local.xp);
  assert.equal(h.statuses.at(-1), 'synced');
});

test('sign-in on an empty browser loads the account, keeping the language of this browser', async () => {
  const backend = fakeBackend();
  const cloud = emptyState();
  record(course, cloud, ids[3], true);
  cloud.lang = 'en';
  backend.docs.set('u1', { data: JSON.stringify(cloud), updatedAt: 1 });
  const local = emptyState();
  local.lang = 'fr';
  const h = harness(backend, local);
  assert.equal(await h.sync.start('u1'), 'pulled');
  assert.ok(h.state.q[ids[3]]);
  assert.equal(h.state.lang, 'fr');
});

test('progress on both sides is merged and sent back', async () => {
  const backend = fakeBackend();
  const cloud = emptyState();
  record(course, cloud, ids[5], true);
  backend.docs.set('u1', { data: JSON.stringify(cloud), updatedAt: 1 });
  const local = emptyState();
  record(course, local, ids[6], true);
  const h = harness(backend, local);
  assert.equal(await h.sync.start('u1'), 'merged');
  const saved = JSON.parse(backend.docs.get('u1').data);
  assert.ok(saved.q[ids[5]] && saved.q[ids[6]]);
});

test('changes are grouped and sent; offline they wait and are sent on flush', async () => {
  const backend = fakeBackend();
  const h = harness(backend);
  await h.sync.start('u1');
  record(course, h.state, ids[0], true);
  h.sync.changed();
  h.sync.changed();
  await new Promise((r) => setTimeout(r, 30));
  assert.ok(JSON.parse(backend.docs.get('u1').data).q[ids[0]]);
  backend.fail = true;
  record(course, h.state, ids[1], true);
  h.sync.changed();
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(h.statuses.at(-1), 'offline');
  assert.equal(h.sync.pending, true);
  backend.fail = false;
  await h.sync.flush();
  assert.ok(JSON.parse(backend.docs.get('u1').data).q[ids[1]]);
  assert.equal(h.statuses.at(-1), 'synced');
});

test('nothing is sent after sign-out', async () => {
  const backend = fakeBackend();
  const h = harness(backend);
  await h.sync.start('u1');
  h.sync.stop();
  record(course, h.state, ids[2], true);
  h.sync.changed();
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(JSON.parse(backend.docs.get('u1').data).q[ids[2]], undefined);
});
