// JSON lab: the learner edits JSON, sees at once whether it is valid (with a
// plain-words message at the right line and column), its tree, and missions.
//
// The parser below follows the JSON grammar (RFC 8259) strictly, like
// JSON.parse, but names the usual beginner mistakes instead of the browser's
// terse "Unexpected token" (trailing comma, single quotes, comments…).

import { escapeHtml, highlight } from '../render.js';
import { jsonMission, typeOf } from './jsonlab-check.js';

const MESSAGES = {
  fr: {
    empty: 'Le texte est vide : un JSON contient au moins une valeur, souvent un objet { }.',
    end: 'Le texte s’arrête trop tôt : il manque probablement une fermeture } ou ].',
    extra: 'Il y a du texte après la fin du JSON : un fichier JSON ne contient qu’une seule valeur (souvent un seul objet).',
    trailing: 'Virgule de trop avant la fermeture : en JSON, pas de virgule après le dernier élément.',
    single: 'Guillemets simples : en JSON, les textes et les clés s’écrivent entre guillemets doubles " ".',
    unquoted: 'Clé sans guillemets : en JSON, chaque clé s’écrit entre guillemets doubles, par exemple "volume".',
    comment: 'Commentaire interdit : JSON n’accepte ni // ni /* */.',
    comma: 'Il manque une virgule entre deux éléments.',
    colon: 'Il manque les deux-points : entre la clé et sa valeur.',
    key: 'Une clé (texte entre guillemets doubles) est attendue ici.',
    value: 'Valeur attendue ici : un texte "…", un nombre, true, false, null, un objet { } ou un tableau [ ].',
    word: 'Mot inconnu : JSON ne connaît que true, false et null (en minuscules), pas undefined, NaN ou True.',
    number: 'Nombre mal écrit : pas de zéro devant (007), pas de + devant, un chiffre avant et après le point (0.5).',
    escape: 'Échappement invalide après \\ : seuls \\" \\\\ \\/ \\b \\f \\n \\r \\t et \\uXXXX existent.',
    control: 'Retour à la ligne dans un texte : il faut écrire \\n à la place.',
    unclosed: 'Texte jamais refermé : il manque le guillemet " de fin.',
    duplicate: 'Attention : la clé "{key}" apparaît deux fois dans le même objet (valide, mais seule la dernière compte).',
    ok: 'JSON valide ✔',
    at: 'ligne {line}, colonne {col}',
  },
  en: {
    empty: 'The text is empty: a JSON holds at least one value, often an object { }.',
    end: 'The text stops too early: a closing } or ] is probably missing.',
    extra: 'There is text after the end of the JSON: a JSON file holds a single value (often a single object).',
    trailing: 'Extra comma before the closing bracket: in JSON there is no comma after the last item.',
    single: 'Single quotes: in JSON, texts and keys are written between double quotes " ".',
    unquoted: 'Key without quotes: in JSON every key is written between double quotes, e.g. "volume".',
    comment: 'Comments are not allowed: JSON accepts neither // nor /* */.',
    comma: 'A comma is missing between two items.',
    colon: 'The colon : between the key and its value is missing.',
    key: 'A key (text between double quotes) is expected here.',
    value: 'A value is expected here: a text "…", a number, true, false, null, an object { } or an array [ ].',
    word: 'Unknown word: JSON only knows true, false and null (lower case), not undefined, NaN or True.',
    number: 'Badly written number: no leading zero (007), no leading +, a digit before and after the point (0.5).',
    escape: 'Invalid escape after \\: only \\" \\\\ \\/ \\b \\f \\n \\r \\t and \\uXXXX exist.',
    control: 'Line break inside a text: write \\n instead.',
    unclosed: 'Text never closed: the ending " is missing.',
    duplicate: 'Note: the key "{key}" appears twice in the same object (valid, but only the last one counts).',
    ok: 'Valid JSON ✔',
    at: 'line {line}, column {col}',
  },
};

class JsonError extends Error {
  constructor(code, pos) {
    super(code);
    this.code = code;
    this.pos = pos;
  }
}

/** Parses JSON text: { ok: true, value, warnings } or { ok: false, code, pos, line, col }. */
export function parseJson(text) {
  let i = 0;
  const warnings = [];
  const ws = () => {
    while (i < text.length) {
      const c = text[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') i++;
      else if (c === '/' && (text[i + 1] === '/' || text[i + 1] === '*')) throw new JsonError('comment', i);
      else if (c === '﻿' && i === 0) i++;
      else break;
    }
  };
  const fail = (code, pos = i) => { throw new JsonError(code, pos); };
  const string = () => {
    if (text[i] === "'") fail('single');
    const start = i++;
    let out = '';
    while (true) {
      if (i >= text.length) fail('unclosed', start);
      const c = text[i];
      if (c === '"') { i++; return out; }
      if (c === '\n' || c === '\r') fail('control');
      if (c < ' ') fail('control');
      if (c === '\\') {
        const e = text[i + 1];
        const map = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
        if (e in map) { out += map[e]; i += 2; continue; }
        if (e === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) { out += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16)); i += 6; continue; }
        fail('escape');
      }
      out += c;
      i++;
    }
  };
  const number = () => {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!m || /^[\w.]/.test(text.slice(i + m[0].length))) fail('number');
    i += m[0].length;
    return Number(m[0]);
  };
  const value = () => {
    ws();
    if (i >= text.length) fail('end');
    const c = text[i];
    if (c === '{') return object();
    if (c === '[') return array();
    if (c === '"' || c === "'") return string();
    if (c === '-' || (c >= '0' && c <= '9')) return number();
    if (c === '+' || c === '.') fail('number');
    const w = /^[A-Za-z_$][\w$]*/.exec(text.slice(i));
    if (w) {
      if (w[0] === 'true') { i += 4; return true; }
      if (w[0] === 'false') { i += 5; return false; }
      if (w[0] === 'null') { i += 4; return null; }
      fail('word');
    }
    fail('value');
  };
  const object = () => {
    i++;
    const out = {};
    ws();
    if (text[i] === '}') { i++; return out; }
    while (true) {
      ws();
      if (i >= text.length) fail('end');
      if (text[i] === '}') fail('trailing', i);
      if (text[i] === "'") fail('single');
      if (text[i] !== '"') fail(/^[A-Za-z_$]/.test(text[i]) ? 'unquoted' : 'key');
      const keyPos = i;
      const key = string();
      if (Object.prototype.hasOwnProperty.call(out, key)) warnings.push({ code: 'duplicate', key, pos: keyPos });
      ws();
      if (text[i] !== ':') fail(i >= text.length ? 'end' : 'colon');
      i++;
      out[key] = value();
      ws();
      if (text[i] === ',') {
        const comma = i++;
        ws();
        if (text[i] === '}') fail('trailing', comma);
        continue;
      }
      if (text[i] === '}') { i++; return out; }
      fail(i >= text.length ? 'end' : 'comma');
    }
  };
  const array = () => {
    i++;
    const out = [];
    ws();
    if (text[i] === ']') { i++; return out; }
    while (true) {
      ws();
      if (text[i] === ']') fail('trailing', i);
      out.push(value());
      ws();
      if (text[i] === ',') {
        const comma = i++;
        ws();
        if (text[i] === ']') fail('trailing', comma);
        continue;
      }
      if (text[i] === ']') { i++; return out; }
      fail(i >= text.length ? 'end' : 'comma');
    }
  };
  try {
    ws();
    if (i >= text.length) throw new JsonError('empty', 0);
    const v = value();
    ws();
    if (i < text.length) fail('extra');
    return { ok: true, value: v, warnings: warnings.map((w) => ({ ...w, ...lineCol(text, w.pos) })) };
  } catch (e) {
    if (!(e instanceof JsonError)) throw e;
    return { ok: false, code: e.code, pos: e.pos, ...lineCol(text, e.pos) };
  }
}

function lineCol(text, pos) {
  const before = text.slice(0, pos).split('\n');
  return { line: before.length, col: before.at(-1).length + 1 };
}

export function jsonMessage(r, lang) {
  const M = MESSAGES[lang] || MESSAGES.fr;
  if (r.ok) return M.ok;
  return `${M.at.replace('{line}', r.line).replace('{col}', r.col)} — ${M[r.code]}`;
}

function tree(v, key, lang, depth = 0) {
  const k = key == null ? '' : `<span class="jt-key">${escapeHtml(typeof key === 'number' ? `[${key}]` : key)}</span><span class="jt-colon">:</span> `;
  const t = typeOf(v);
  if (t === 'object' || t === 'array') {
    const entries = t === 'array' ? v.map((x, i) => [i, x]) : Object.entries(v);
    const label = t === 'array' ? (lang === 'fr' ? `tableau (${entries.length})` : `array (${entries.length})`) : lang === 'fr' ? `objet (${entries.length} clé${entries.length > 1 ? 's' : ''})` : `object (${entries.length} key${entries.length === 1 ? '' : 's'})`;
    return `<details ${depth < 2 ? 'open' : ''}><summary>${k}<span class="jt-type jt-${t}">${t === 'array' ? '[ ]' : '{ }'} ${escapeHtml(label)}</span></summary><div class="jt-kids">${entries.map(([a, b]) => tree(b, a, lang, depth + 1)).join('')}</div></details>`;
  }
  const shown = t === 'string' ? `"${v}"` : String(v);
  return `<div class="jt-leaf">${k}<span class="jt-val jt-${t}">${escapeHtml(shown)}</span> <span class="jt-type">${t}</span></div>`;
}

/**
 * Mounts a JSON lab in `el`. onMission(doneCount) is called when the number of
 * missions met grows past `done`.
 */
export function mountJsonLab(el, { intro, initial = '', missions = [], solution, done = 0, onMission, lang, t }) {
  const L = (v) => (v && typeof v === 'object' ? v[lang] ?? v.fr : v || '');
  let best = done;
  let helped = false; // solution shown: no reward for the missions it meets
  el.className = 'jsonlab';
  el.innerHTML = `
    ${intro ? `<p class="term-intro">${L(intro)}</p>` : ''}
    ${missions.length ? '<ol class="missions"></ol>' : ''}
    <div class="jl-grid">
      <div class="jl-edit">
        <div class="pg-head"><span>🗂️ ${escapeHtml(t('json.editor'))}</span><span class="pg-actions">
          <button type="button" class="btn small ghost jl-reset">${escapeHtml(t('pg.reset'))}</button>
          ${solution ? `<button type="button" class="btn small ghost jl-sol">${escapeHtml(t('json.solution'))}</button>` : ''}
          <button type="button" class="btn small jl-format">${escapeHtml(t('json.format'))}</button></span></div>
        <div class="pg-editor"><pre class="pg-hl" aria-hidden="true"><code></code></pre><textarea spellcheck="false" autocapitalize="off" aria-label="${escapeHtml(t('json.editor'))}"></textarea></div>
        <div class="jl-status" aria-live="polite"></div>
      </div>
      <div class="jl-tree"><div class="jl-tree-title">${escapeHtml(t('json.tree'))}</div><div class="jl-tree-body"></div></div>
    </div>`;
  const ta = el.querySelector('textarea');
  const hl = el.querySelector('.pg-hl code');
  const status = el.querySelector('.jl-status');
  const treeBody = el.querySelector('.jl-tree-body');
  const list = el.querySelector('.missions');
  let timer = null;
  let first = true; // missions the starting text already meets are not a reward
  const update = () => {
    const text = ta.value;
    const r = parseJson(text);
    // Highlight, with the line of the error marked.
    const lines = highlight(text, 'json').split('\n');
    if (!r.ok && lines[r.line - 1] != null) lines[r.line - 1] = `<span class="jl-errline">${lines[r.line - 1] || ' '}</span>`;
    hl.innerHTML = `${lines.join('\n')}\n`;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    status.className = `jl-status ${r.ok ? 'ok' : 'ko'}`;
    status.innerHTML = escapeHtml(jsonMessage(r, lang)) + (r.ok ? r.warnings.map((w) => `<div class="jl-warn">⚠ ${escapeHtml((MESSAGES[lang] || MESSAGES.fr).duplicate.replace('{key}', w.key))}</div>`).join('') : '');
    if (r.ok) treeBody.innerHTML = tree(r.value, null, lang);
    else treeBody.innerHTML = `<p class="muted small">${escapeHtml(t('json.treeWait'))}</p>`;
    if (list) {
      const met = missions.map((m) => r.ok && jsonMission(m, r.value));
      const n = met.filter(Boolean).length;
      list.innerHTML = missions.map((m, i) => `<li class="${met[i] ? 'done' : ''}">${met[i] ? '✅' : '⬜'} ${L(m)}</li>`).join('') + (n === missions.length ? `<li class="all-done">🎉 ${escapeHtml(t('term.allDone'))}</li>` : '');
      if (first) best = Math.max(best, n);
      first = false;
      if (n > best && !helped) {
        best = n;
        onMission?.(n);
      }
    }
  };
  const schedule = () => { clearTimeout(timer); timer = setTimeout(update, 120); };
  ta.value = initial;
  ta.addEventListener('input', schedule);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
      schedule();
    }
  });
  el.querySelector('.jl-reset').addEventListener('click', () => { ta.value = initial; update(); });
  el.querySelector('.jl-format').addEventListener('click', () => {
    const r = parseJson(ta.value);
    if (r.ok) { ta.value = JSON.stringify(r.value, null, 2); update(); }
    else status.classList.add('shake'), setTimeout(() => status.classList.remove('shake'), 400);
  });
  el.querySelector('.jl-sol')?.addEventListener('click', () => {
    if (!confirm(t('json.solutionConfirm'))) return;
    helped = true;
    ta.value = solution;
    update();
  });
  requestAnimationFrame(update);
}
