// Progress of the learner, kept in this browser (localStorage) and exportable
// as a JSON file (backup, or to move to another computer).
//
// GitHub Pages only serves files: there is no server to keep the progress, so
// it lives on the learner's machine. Clearing the browser data erases it,
// hence the export / import buttons of the Progress page.

const KEY = 'codequest3d.progress.v1';
export const VERSION = 1;

export function emptyState() {
  return {
    version: VERSION,
    lang: null, // null: chosen from the browser language on first visit
    theme: 'auto',
    name: '',
    xp: 0,
    streak: { day: null, count: 0, best: 0 },
    days: {}, // 'YYYY-MM-DD' -> xp earned that day
    lessons: {}, // lesson id -> { done: ts, deep: ts }
    q: {}, // question id -> { n, ok, box, due, last, lastOk }
    skills: {}, // skill id -> [1, 0, 1, …] (latest results, oldest first)
    exams: {}, // module id -> [{ score, total, ts }]
    badges: {}, // badge id -> ts
    terminal: {}, // widget id -> missions done
    glossarySeen: {}, // glossary id -> ts
    wasWeak: {}, // skill id -> ts (it has been weak)
    repaired: {}, // skill id -> ts (was weak, became solid)
  };
}

/** A state read from storage or a file: every field present, unknown fields dropped. */
export function normalize(raw) {
  const base = emptyState();
  if (!raw || typeof raw !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (raw[k] === undefined) continue;
    const isObj = base[k] !== null && typeof base[k] === 'object';
    if (isObj && (typeof raw[k] !== 'object' || raw[k] === null || Array.isArray(raw[k]))) continue;
    base[k] = isObj ? { ...base[k], ...raw[k] } : raw[k];
  }
  if (typeof base.xp !== 'number' || !Number.isFinite(base.xp)) base.xp = 0;
  return base;
}

export function load(storage = globalThis.localStorage) {
  try {
    return normalize(JSON.parse(storage?.getItem(KEY) || 'null'));
  } catch {
    return emptyState();
  }
}

export function save(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false; // private mode, storage full: the session still works
  }
}

export function today(now = Date.now()) {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Adds xp and keeps the streak of consecutive days of activity. */
export function addXp(state, amount, now = Date.now()) {
  const day = today(now);
  state.xp += amount;
  state.days[day] = (state.days[day] || 0) + amount;
  const s = state.streak;
  if (s.day !== day) {
    const yesterday = today(now - 86400000);
    s.count = s.day === yesterday ? s.count + 1 : 1;
    s.day = day;
    s.best = Math.max(s.best, s.count);
  }
}

export function exportFile(state) {
  return JSON.stringify({ app: 'codequest3d', exported: new Date().toISOString(), ...state }, null, 1);
}

export function importFile(text) {
  const raw = JSON.parse(text);
  if (raw?.app !== 'codequest3d') throw new Error('not a Code Quest progress file');
  return normalize(raw);
}
