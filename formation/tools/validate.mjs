// Checks the content modules (formation/content/*.js) against CONTENT_SPEC.md.
//   node formation/tools/validate.mjs [module-id ...]
// Exits non-zero on an error; warnings are printed but do not fail.
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const only = process.argv.slice(2);
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const TYPES = ['mcq', 'multi', 'tf', 'fill', 'order', 'match', 'line'];
const LANGS = ['js', 'py', 'cpp', 'bash', 'ps', 'cmd', 'json', 'yaml', 'html', 'css', 'text', 'diff'];
const TAGS = new Set(['h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'kbd', 'a', 'div', 'span', 'details', 'summary', 'b', 'i', 'sup', 'sub']);
const VOID = new Set(['br']);
const CONFIDENTIAL = /(groupe-sab|\\\\[a-z0-9-]+\\|historique_cycles|parametres_chiffrage|READER3D_ACCESS_CODE\s*=\s*\S|gsk_[A-Za-z0-9]{10,}|sk-[A-Za-z0-9]{20,})/i;

let glossary = new Set();
try {
  glossary = new Set((await import(pathToFileURL(join(dir, 'glossary.js')))).default.map((g) => g.id));
} catch (e) {
  warn('glossary.js', `not loaded (${e.message})`);
}

function bi(where, v, { html = false } = {}) {
  if (!v || typeof v !== 'object') return err(where, 'expected { fr, en }');
  for (const l of ['fr', 'en']) {
    if (typeof v[l] !== 'string' || !v[l].trim()) err(where, `missing ${l}`);
    else if (html) checkHtml(`${where}.${l}`, v[l]);
  }
}

function biList(where, v, n) {
  if (!v || !Array.isArray(v.fr) || !Array.isArray(v.en)) return err(where, 'expected { fr: [], en: [] }');
  if (v.fr.length !== v.en.length) err(where, `fr has ${v.fr.length} items, en ${v.en.length}`);
  if (n && v.fr.length < n) err(where, `at least ${n} items`);
}

function checkHtml(where, s) {
  if (CONFIDENTIAL.test(s)) err(where, 'looks like confidential data');
  // Code fences are raw: check their info strings, then drop them.
  const fence = /~~~([^\n]*)\n([\s\S]*?)\n~~~/g;
  let m;
  while ((m = fence.exec(s))) {
    const lang = m[1].trim().split(/\s+/)[0];
    if (!LANGS.includes(lang)) err(where, `code fence language "${lang}"`);
  }
  const rest = s.replace(fence, '');
  if (rest.includes('~~~')) err(where, 'unclosed ~~~ fence (a fence needs its own lines)');
  const stack = [];
  const tag = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
  while ((m = tag.exec(rest))) {
    const name = m[1].toLowerCase();
    if (!TAGS.has(name)) { err(where, `tag <${name}> not allowed (escape < as &lt;)`); continue; }
    if (VOID.has(name) || m[0].endsWith('/>')) continue;
    if (m[0][1] === '/') {
      const top = stack.pop();
      if (top !== name) { err(where, `</${name}> closes <${top}>`); return; }
    } else stack.push(name);
    const term = /data-term="([^"]+)"/.exec(m[2]);
    if (term && glossary.size && !glossary.has(term[1])) warn(where, `glossary term "${term[1]}" not in glossary.js`);
  }
  if (stack.length) err(where, `unclosed <${stack.join('>, <')}>`);
}

import { jsonMission } from '../js/widgets/jsonlab-check.js';

const files = readdirSync(dir).filter((f) => f.endsWith('.js') && !['index.js', 'glossary.js'].includes(f));
const seenQ = new Set();
const seenL = new Set();
for (const f of files) {
  const id = f.replace(/\.js$/, '');
  if (only.length && !only.includes(id)) continue;
  let mod;
  try {
    mod = (await import(pathToFileURL(join(dir, f)))).default;
  } catch (e) {
    err(f, `does not load: ${e.message}`);
    continue;
  }
  const W = `${f}`;
  if (mod.id !== id) err(W, `id "${mod.id}" should be "${id}" (file name)`);
  for (const k of ['order', 'icon', 'color']) if (mod[k] == null) err(W, `missing ${k}`);
  bi(`${W}.title`, mod.title);
  bi(`${W}.summary`, mod.summary);
  const skills = Object.keys(mod.skills || {});
  if (!skills.length) err(W, 'no skills');
  for (const s of skills) {
    if (!s.startsWith(`${id}.`)) err(W, `skill "${s}" should start with "${id}."`);
    bi(`${W}.skills.${s}`, mod.skills[s]);
  }
  const widgets = mod.widgets || {};
  for (const [wid, w] of Object.entries(widgets)) {
    const WW = `${W}.widgets.${wid}`;
    if (w.type === 'terminal') {
      if (!['powershell', 'cmd', 'bash'].includes(w.shell)) err(WW, 'shell');
      if (w.intro) bi(`${WW}.intro`, w.intro);
      for (const [i, ms] of (w.missions || []).entries()) {
        try { new RegExp(ms.match, 'i'); } catch { err(`${WW}.missions[${i}]`, 'bad regexp'); }
        bi(`${WW}.missions[${i}]`, ms);
      }
    } else if (w.type === 'flow') {
      (w.actors || []).forEach((a, i) => bi(`${WW}.actors[${i}]`, a));
      for (const [i, st] of (w.steps || []).entries()) {
        if (!(st.from in w.actors) || !(st.to in w.actors)) err(`${WW}.steps[${i}]`, 'from/to');
        bi(`${WW}.steps[${i}].label`, st.label);
        if (st.detail) bi(`${WW}.steps[${i}].detail`, st.detail, { html: true });
      }
    } else if (w.type === 'jsonlab') {
      if (typeof w.initial !== 'string') err(WW, 'initial must be a string');
      if (w.intro) bi(`${WW}.intro`, w.intro);
      for (const [i, ms] of (w.missions || []).entries()) {
        bi(`${WW}.missions[${i}]`, ms);
        if (ms.type && !['object', 'array', 'string', 'number', 'boolean', 'null'].includes(ms.type)) err(`${WW}.missions[${i}]`, 'type');
        if (ms.path != null && typeof ms.path !== 'string') err(`${WW}.missions[${i}]`, 'path must be a string');
      }
      if (w.solution != null) {
        let v;
        try { v = JSON.parse(w.solution); } catch (e) { err(WW, `solution is not valid JSON: ${e.message}`); }
        if (v !== undefined) for (const [i, ms] of (w.missions || []).entries()) if (!jsonMission(ms, v)) err(`${WW}.missions[${i}]`, 'not met by the solution');
      }
    } else err(WW, `unknown widget type ${w.type}`);
  }
  const usedWidgets = new Set();
  const lessons = mod.lessons || [];
  if (!lessons.length) err(W, 'no lessons');
  for (const l of lessons) {
    const L = `${W}.${l.id}`;
    if (!/^[a-z0-9]+-\d+$/.test(l.id || '') || !l.id.startsWith(`${id}-`)) err(L, 'lesson id');
    if (seenL.has(l.id)) err(L, 'duplicate lesson id');
    seenL.add(l.id);
    bi(`${L}.title`, l.title);
    bi(`${L}.body`, l.body, { html: true });
    bi(`${L}.deep`, l.deep, { html: true });
    if (!l.skills?.length) err(L, 'no skills');
    for (const s of l.skills || []) if (!skills.includes(s)) err(L, `unknown skill ${s}`);
    for (const lang of ['fr', 'en']) for (const m of `${l.body?.[lang]}${l.deep?.[lang]}`.matchAll(/data-widget="([^"]+)"/g)) {
      usedWidgets.add(m[1]);
      if (!widgets[m[1]]) err(L, `widget "${m[1]}" not declared`);
    }
  }
  for (const w of Object.keys(widgets)) if (!usedWidgets.has(w)) warn(W, `widget ${w} never placed`);
  const qs = mod.questions || [];
  const perLesson = {};
  const extraPerSkill = {};
  let exam = 0;
  const types = new Set();
  for (const q of qs) {
    const Q = `${W}.${q.id}`;
    if (seenQ.has(q.id)) err(Q, 'duplicate question id');
    seenQ.add(q.id);
    if (!q.id?.startsWith(`${id}-q`)) err(Q, 'question id should be "<module>-q<n>"');
    if (!skills.includes(q.skill)) err(Q, `unknown skill ${q.skill}`);
    if (q.lesson && !lessons.some((l) => l.id === q.lesson)) err(Q, `unknown lesson ${q.lesson}`);
    if (![1, 2, 3].includes(q.level)) err(Q, 'level 1..3');
    if (!TYPES.includes(q.type)) { err(Q, `type ${q.type}`); continue; }
    types.add(q.type);
    bi(`${Q}.prompt`, q.prompt, { html: true });
    bi(`${Q}.explain`, q.explain, { html: true });
    if (q.hint) bi(`${Q}.hint`, q.hint, { html: true });
    if (q.code != null && typeof q.code !== 'string') err(Q, 'code must be a string');
    if (q.code && !LANGS.includes(q.lang)) err(Q, `lang "${q.lang}"`);
    if (q.lesson) perLesson[q.lesson] = (perLesson[q.lesson] || 0) + 1;
    else if (q.extra) extraPerSkill[q.skill] = (extraPerSkill[q.skill] || 0) + 1;
    else exam++;
    switch (q.type) {
      case 'mcq':
        biList(`${Q}.choices`, q.choices, 2);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.choices?.fr?.length ?? 0)) err(Q, 'answer index');
        break;
      case 'multi':
        biList(`${Q}.choices`, q.choices, 3);
        if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((a) => a < 0 || a >= (q.choices?.fr?.length ?? 0))) err(Q, 'answer indices');
        break;
      case 'tf':
        if (typeof q.answer !== 'boolean') err(Q, 'answer true/false');
        break;
      case 'fill': {
        const acc = Array.isArray(q.accept) ? { fr: q.accept, en: q.accept } : q.accept;
        if (!acc?.fr?.length || !acc?.en?.length) err(Q, 'accept');
        break;
      }
      case 'order':
        biList(`${Q}.items`, q.items, 3);
        break;
      case 'match':
        biList(`${Q}.pairs`, q.pairs, 3);
        for (const l of ['fr', 'en']) for (const p of q.pairs?.[l] || []) if (!Array.isArray(p) || p.length !== 2) err(Q, 'pairs must be [left, right]');
        break;
      case 'line':
        if (!q.code) err(Q, 'line needs code');
        else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.code.split('\n').length) err(Q, 'answer line index');
        break;
    }
  }
  for (const l of lessons) if ((perLesson[l.id] || 0) < 3) warn(W, `lesson ${l.id} has ${perLesson[l.id] || 0} quiz questions (want ≥ 3)`);
  for (const s of skills) if ((extraPerSkill[s] || 0) < 3) warn(W, `skill ${s} has ${extraPerSkill[s] || 0} extra questions (want ≥ 3)`);
  if (exam < 8) warn(W, `${exam} exam questions (want ≥ 8)`);
  if (types.size < 5) warn(W, `${types.size} question types (want ≥ 5)`);
  console.log(`${f}: ${lessons.length} lessons, ${qs.length} questions (${exam} exam), ${skills.length} skills`);
}

for (const w of warnings) console.log(`warning ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `${errors.length} error(s)` : 'OK');
process.exit(errors.length ? 1 : 0);
