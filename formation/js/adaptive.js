// The adaptive engine: what the learner masters, what is weak, what to do next.
//
// Every question tests one skill. Each answer moves the mastery of its skill
// (an exponential moving average: recent answers count more), and places the
// question in a Leitner box (spaced repetition: a question answered right comes
// back later and later, a question missed comes back at once).
//
// Pure functions of (course, state): the tests run them in Node.

import { addXp } from './store.js';

const PRIOR = 0.5; // mastery of a skill never tested
const RATE = 0.3; // weight of the latest answer
const HISTORY = 20; // answers kept per skill
const DAY = 86400000;
/** Days before a question of box i comes back (box 0: never answered). */
export const INTERVALS = [0, 0, 1, 3, 7, 16, 35];
export const PASS = 0.8; // an exam passed (and a skill solid) from 80 %

export function buildCourse(modules, glossary = []) {
  const course = { modules, glossary, questions: new Map(), lessons: new Map(), skills: new Map() };
  for (const m of modules) {
    for (const [id, name] of Object.entries(m.skills)) course.skills.set(id, { id, name, module: m, lessons: [], questions: [] });
    for (const l of m.lessons) {
      course.lessons.set(l.id, { ...l, module: m });
      for (const s of l.skills) course.skills.get(s)?.lessons.push(l.id);
    }
    for (const q of m.questions) {
      course.questions.set(q.id, { ...q, module: m });
      course.skills.get(q.skill)?.questions.push(q.id);
    }
  }
  return course;
}

/** Mastery (0..1), number of answers and status of a skill. */
export function skillState(state, skillId) {
  const hist = state.skills[skillId] || [];
  let m = PRIOR;
  for (const ok of hist) m += RATE * (ok - m);
  const n = hist.length;
  let status;
  if (!n) status = 'new';
  else if (m < 0.6) status = 'weak';
  else if (m < PASS || n < 3) status = 'fragile';
  else if (m >= 0.9 && n >= 5) status = 'mastered';
  else status = 'solid';
  return { mastery: m, n, status };
}

/** Skills to work on: weak or fragile ones answered at least twice, weakest first. */
export function weakSkills(course, state) {
  const out = [];
  for (const id of course.skills.keys()) {
    const s = skillState(state, id);
    if (s.n >= 2 && (s.status === 'weak' || s.status === 'fragile')) out.push({ id, ...s });
  }
  return out.sort((a, b) => a.mastery - b.mastery);
}

/**
 * Records an answer: question box and due date, skill history, xp, and the
 * "repaired" mark of a skill that was weak and is now solid. Returns the xp won.
 */
export function record(course, state, qid, ok, now = Date.now()) {
  const q = course.questions.get(qid);
  if (!q) return 0;
  const e = (state.q[qid] ||= { n: 0, ok: 0, box: 0, due: 0, last: 0, lastOk: null });
  e.n++;
  if (ok) e.ok++;
  e.box = ok ? Math.min(INTERVALS.length - 1, e.box + 1) : 1;
  e.due = now + INTERVALS[e.box] * DAY;
  e.last = now;
  e.lastOk = ok;
  const hist = (state.skills[q.skill] ||= []);
  hist.push(ok ? 1 : 0);
  if (hist.length > HISTORY) hist.splice(0, hist.length - HISTORY);
  const after = skillState(state, q.skill).status;
  if (after === 'weak') state.wasWeak[q.skill] ||= now;
  if (state.wasWeak[q.skill] && !state.repaired[q.skill] && (after === 'solid' || after === 'mastered')) state.repaired[q.skill] = now;
  const xp = ok ? 5 + 5 * q.level : 1;
  addXp(state, xp, now);
  return xp;
}

// ------------------------------------------------------------------ selections

function shuffle(list, rand = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function lessonQuiz(course, lessonId, rand) {
  const l = course.lessons.get(lessonId);
  return shuffle(l.module.questions.filter((q) => q.lesson === lessonId).map((q) => q.id), rand);
}

/**
 * Targeted exercises on one skill: the questions missed last time first, then
 * the reinforcement exercises never seen (easiest first while the skill is
 * weak), then those due, then the rest, least recently seen first.
 */
export function practiceSet(course, state, skillId, n = 6, rand = Math.random, now = Date.now()) {
  const ids = course.skills.get(skillId)?.questions || [];
  const { mastery } = skillState(state, skillId);
  const groups = [[], [], [], [], []];
  for (const id of ids) {
    const q = course.questions.get(id);
    const e = state.q[id];
    if (e?.lastOk === false) groups[0].push(id);
    else if (!e && q.extra) groups[1].push(id);
    else if (!e) groups[2].push(id);
    else if (e.due <= now) groups[3].push(id);
    else groups[4].push(id);
  }
  const level = (id) => course.questions.get(id).level;
  groups[1] = shuffle(groups[1], rand).sort((a, b) => (mastery < 0.6 ? level(a) - level(b) : level(b) - level(a)));
  groups[2] = shuffle(groups[2], rand).sort((a, b) => level(a) - level(b));
  groups[4].sort((a, b) => state.q[a].last - state.q[b].last);
  return [...shuffle(groups[0], rand), ...groups[1], ...groups[2], ...shuffle(groups[3], rand), ...groups[4]].slice(0, n);
}

/** Questions due for review (spaced repetition), weakest skills first. */
export function reviewSet(course, state, n = 10, now = Date.now(), rand = Math.random) {
  const due = Object.entries(state.q)
    .filter(([id, e]) => course.questions.has(id) && e.due <= now)
    .map(([id]) => ({ id, m: skillState(state, course.questions.get(id).skill).mastery, r: rand() }));
  due.sort((a, b) => a.m - b.m || a.r - b.r);
  return due.slice(0, n).map((d) => d.id);
}

export function dueCount(course, state, now = Date.now()) {
  return Object.entries(state.q).filter(([id, e]) => course.questions.has(id) && e.due <= now).length;
}

/**
 * A module exam: every skill of the module at least once, then the rest of
 * the exam questions, mixed levels. Lesson questions fill in if too few.
 */
export function examSet(course, moduleId, n = 10, rand = Math.random) {
  const m = course.modules.find((x) => x.id === moduleId);
  const pool = shuffle(m.questions.filter((q) => !q.lesson && !q.extra), rand);
  const fill = shuffle(m.questions.filter((q) => q.lesson), rand);
  const picked = [];
  for (const s of Object.keys(m.skills)) {
    const q = pool.find((x) => x.skill === s && !picked.includes(x)) || fill.find((x) => x.skill === s && !picked.includes(x));
    if (q) picked.push(q);
  }
  for (const q of [...pool, ...fill]) {
    if (picked.length >= n) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return shuffle(picked.slice(0, Math.max(n, Object.keys(m.skills).length)), rand).map((q) => q.id);
}

/** Final exam: a few questions of every module. */
export function finalSet(course, perModule = 3, rand = Math.random) {
  return shuffle(course.modules.flatMap((m) => examSet(course, m.id, perModule, rand).slice(0, perModule)), rand);
}

// ------------------------------------------------------------------ progress

export function moduleProgress(state, m) {
  const done = m.lessons.filter((l) => state.lessons[l.id]?.done).length;
  const exams = state.exams[m.id] || [];
  const best = exams.reduce((b, e) => Math.max(b, e.score / e.total), 0);
  return { done, total: m.lessons.length, best, passed: best >= PASS, tried: exams.length > 0 };
}

/** Skills a session tested, with the share of right answers, weakest first. */
export function sessionSkills(course, results) {
  const by = new Map();
  for (const r of results) {
    const s = course.questions.get(r.id).skill;
    const e = by.get(s) || { id: s, ok: 0, n: 0 };
    e.n++;
    if (r.ok) e.ok++;
    by.set(s, e);
  }
  return [...by.values()].sort((a, b) => a.ok / a.n - b.ok / b.n);
}

/** What to do next, most useful first: { kind, ... } for the home page. */
export function recommendations(course, state, now = Date.now()) {
  const recs = [];
  const weak = weakSkills(course, state);
  for (const w of weak.slice(0, 3)) recs.push({ kind: 'weak', skill: w.id, mastery: w.mastery, status: w.status });
  const due = dueCount(course, state, now);
  if (due >= 3) recs.push({ kind: 'review', count: due });
  for (const m of course.modules) {
    const p = moduleProgress(state, m);
    const next = m.lessons.find((l) => !state.lessons[l.id]?.done);
    if (next) {
      recs.push({ kind: 'lesson', lesson: next.id, module: m.id });
      break;
    }
    if (!p.passed) {
      recs.push({ kind: 'exam', module: m.id, best: p.best, tried: p.tried });
      break;
    }
  }
  if (course.modules.every((m) => moduleProgress(state, m).passed) && !state.exams.final?.some((e) => e.score / e.total >= PASS)) recs.push({ kind: 'final' });
  return recs;
}

// ------------------------------------------------------------------ levels & badges

const RANKS = [
  { fr: 'Apprenti·e', en: 'Apprentice' },
  { fr: 'Noyauteur·se', en: 'Core maker' },
  { fr: 'Mouleur·se', en: 'Moulder' },
  { fr: 'Couleur·se', en: 'Pourer' },
  { fr: 'Fondeur·se', en: 'Founder' },
  { fr: 'Outilleur·se', en: 'Toolmaker' },
  { fr: 'Maître fondeur·se', en: 'Master founder' },
  { fr: 'Grand·e maître du code', en: 'Grand master of code' },
];

/** Level from xp: level n needs 60·n·(n−1)/2 … i.e. 60, 180, 360, 600 xp. */
export function levelOf(xp) {
  let level = 1;
  while (xp >= 30 * level * (level + 1)) level++;
  const from = 30 * (level - 1) * level;
  const to = 30 * level * (level + 1);
  return { level, from, to, progress: (xp - from) / (to - from), rank: RANKS[Math.min(RANKS.length - 1, Math.floor((level - 1) / 2))] };
}

export const BADGES = [
  { id: 'first-lesson', icon: '🎓', name: { fr: 'Première coulée', en: 'First pour' }, desc: { fr: 'Terminer une leçon', en: 'Finish a lesson' } },
  { id: 'ten-lessons', icon: '📚', name: { fr: 'Rat de bibliothèque', en: 'Bookworm' }, desc: { fr: 'Terminer 10 leçons', en: 'Finish 10 lessons' } },
  { id: 'all-lessons', icon: '🏛️', name: { fr: 'Encyclopédie', en: 'Encyclopedia' }, desc: { fr: 'Terminer toutes les leçons', en: 'Finish every lesson' } },
  { id: 'perfect', icon: '💎', name: { fr: 'Pièce sans défaut', en: 'Flawless casting' }, desc: { fr: 'Un quiz sans faute (≥ 3 questions)', en: 'A quiz with no mistake (≥ 3 questions)' } },
  { id: 'exam', icon: '🏅', name: { fr: 'Contrôle réussi', en: 'Inspection passed' }, desc: { fr: 'Réussir un examen de module (≥ 80 %)', en: 'Pass a module exam (≥ 80%)' } },
  { id: 'five-exams', icon: '🥇', name: { fr: 'Série validée', en: 'Batch approved' }, desc: { fr: 'Réussir 5 examens de module', en: 'Pass 5 module exams' } },
  { id: 'final', icon: '👑', name: { fr: 'Maître du code', en: 'Code master' }, desc: { fr: "Réussir l'examen final", en: 'Pass the final exam' } },
  { id: 'repair', icon: '🔧', name: { fr: 'Retouche réussie', en: 'Successful rework' }, desc: { fr: 'Transformer un point faible en point fort', en: 'Turn a weak point into a strength' } },
  { id: 'deep', icon: '🔍', name: { fr: 'Curieux·se', en: 'Curious mind' }, desc: { fr: 'Lire une leçon approfondie', en: 'Read a detailed lesson' } },
  { id: 'streak3', icon: '🔥', name: { fr: 'Four allumé', en: 'Furnace lit' }, desc: { fr: '3 jours de suite', en: '3 days in a row' } },
  { id: 'streak7', icon: '🌋', name: { fr: 'Four à pleine chauffe', en: 'Furnace at full heat' }, desc: { fr: '7 jours de suite', en: '7 days in a row' } },
  { id: 'terminal', icon: '⌨️', name: { fr: 'Main sur le clavier', en: 'Hands on the keyboard' }, desc: { fr: 'Réussir toutes les missions d’un terminal', en: 'Complete every mission of a terminal' } },
  { id: 'glossary', icon: '📖', name: { fr: 'Polyglotte du jargon', en: 'Jargon polyglot' }, desc: { fr: 'Consulter 30 mots du glossaire', en: 'Look up 30 glossary words' } },
  { id: 'review', icon: '♻️', name: { fr: 'Entretien préventif', en: 'Preventive maintenance' }, desc: { fr: 'Faire une séance de révision', en: 'Do a review session' } },
];

/** Badges newly earned (and marks them in the state). */
export function awardBadges(course, state, { perfect = false, review = false } = {}, now = Date.now()) {
  const lessonsDone = Object.values(state.lessons).filter((l) => l.done).length;
  const passedExams = course.modules.filter((m) => moduleProgress(state, m).passed).length;
  const terminals = course.modules.flatMap((m) => Object.entries(m.widgets || {}).filter(([, w]) => w.type === 'terminal' || w.type === 'jsonlab').map(([id, w]) => [id, w]));
  const conditions = {
    'first-lesson': lessonsDone >= 1,
    'ten-lessons': lessonsDone >= 10,
    'all-lessons': lessonsDone >= course.lessons.size,
    perfect,
    exam: passedExams >= 1,
    'five-exams': passedExams >= 5,
    final: (state.exams.final || []).some((e) => e.score / e.total >= PASS),
    repair: Object.keys(state.repaired).length > 0,
    deep: Object.values(state.lessons).some((l) => l.deep),
    streak3: state.streak.best >= 3,
    streak7: state.streak.best >= 7,
    terminal: terminals.some(([id, w]) => (state.terminal[id] || 0) >= (w.missions?.length || Infinity)),
    glossary: Object.keys(state.glossarySeen).length >= 30,
    review,
  };
  const earned = [];
  for (const b of BADGES) {
    if (conditions[b.id] && !state.badges[b.id]) {
      state.badges[b.id] = now;
      earned.push(b);
    }
  }
  return earned;
}
