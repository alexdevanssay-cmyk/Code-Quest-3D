// Rich text of the lessons: light HTML plus ~~~ code fences (see CONTENT_SPEC.md),
// and a small syntax highlighter (no library: the site has no build step).

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const KEYWORDS = {
  js: 'const let var function return if else for while do of in new class extends super this import export default from async await try catch finally throw typeof instanceof switch case break continue null undefined true false yield static get set delete void',
  py: 'def return if elif else for while in not and or is import from as class try except finally raise with lambda None True False pass break continue yield async await global nonlocal assert del',
  cpp: 'int double float char bool void auto const constexpr return if else for while do class struct public private protected virtual override new delete namespace using include template typename static true false nullptr this std unsigned long short sizeof operator try catch throw enum',
  bash: 'if then else fi for do done while case esac function in export echo cd ls pwd cat mkdir rm cp mv git npm npx node python pip sudo source',
  ps: 'function param if else elseif foreach for while return try catch finally throw switch in begin process end',
  cmd: 'echo set if else for in do goto call exit dir cd cls type copy del md mkdir rem where',
  yaml: 'true false null on',
  json: 'true false null',
};

const COMMENT = {
  js: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y,
  cpp: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y,
  css: /\/\*[\s\S]*?\*\//y,
  py: /#[^\n]*/y,
  bash: /#[^\n]*/y,
  ps: /#[^\n]*/y,
  yaml: /#[^\n]*/y,
  cmd: /(?:rem\b|::)[^\n]*/iy,
  html: /<!--[\s\S]*?-->/y,
};

const STRING = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y;
const NUMBER = /\b(?:0x[\da-f]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?)n?\b/iy;
const WORD = /[A-Za-z_$][\w$]*/y;
const MARKER = /«(\d+)»/y;

/** Highlighted HTML of a piece of code. «n» markers become numbered badges. */
export function highlight(code, lang = 'text') {
  if (lang === 'diff') {
    return code.split('\n').map((line) => {
      const cls = line.startsWith('+') ? 'tok-add' : line.startsWith('-') ? 'tok-del' : line.startsWith('@@') ? 'tok-meta' : '';
      return cls ? `<span class="${cls}">${escapeHtml(line)}</span>` : escapeHtml(line);
    }).join('\n');
  }
  const kw = new Set((KEYWORDS[lang] || '').split(' ').filter(Boolean));
  const comment = COMMENT[lang];
  const plain = lang === 'text';
  let out = '';
  let i = 0;
  const at = (re) => {
    re.lastIndex = i;
    const m = re.exec(code);
    return m && m.index === i ? m[0] : null;
  };
  while (i < code.length) {
    let m;
    if ((m = at(MARKER))) {
      out += `<span class="marker">${m.slice(1, -1)}</span>`;
    } else if (plain) {
      const next = code.indexOf('«', i + 1);
      m = code.slice(i, next < 0 ? code.length : next);
      out += escapeHtml(m);
    } else if (comment && (m = at(comment))) {
      out += `<span class="tok-com">${highlightMarkers(m)}</span>`;
    } else if (lang === 'html' && (m = at(/<\/?[a-zA-Z][\w-]*|\/?>/y))) {
      out += `<span class="tok-kw">${escapeHtml(m)}</span>`;
    } else if (lang !== 'cmd' && (m = at(STRING))) {
      out += `<span class="tok-str">${escapeHtml(m)}</span>`;
    } else if (lang === 'ps' && (m = at(/\$[\w:]+/y))) {
      out += `<span class="tok-var">${escapeHtml(m)}</span>`;
    } else if (lang === 'cmd' && (m = at(/%\w+%/y))) {
      out += `<span class="tok-var">${escapeHtml(m)}</span>`;
    } else if (lang === 'cpp' && (m = at(/#\s*\w+/y))) {
      out += `<span class="tok-kw">${escapeHtml(m)}</span>`;
    } else if (lang === 'py' && (m = at(/@[\w.]+/y))) {
      out += `<span class="tok-fn">${escapeHtml(m)}</span>`;
    } else if ((m = at(NUMBER))) {
      out += `<span class="tok-num">${m}</span>`;
    } else if (lang === 'yaml' && (m = at(/[A-Za-z_][\w-]*(?=\s*:)/y))) {
      out += `<span class="tok-type">${escapeHtml(m)}</span>`;
    } else if (lang === 'ps' && (m = at(/[A-Z][a-z]+-[A-Z]\w*/y))) {
      out += `<span class="tok-fn">${escapeHtml(m)}</span>`;
    } else if ((m = at(WORD))) {
      const after = /^\s*\(/.test(code.slice(i + m.length));
      const lower = lang === 'ps' || lang === 'cmd' ? m.toLowerCase() : m;
      if (kw.has(lower)) out += `<span class="tok-kw">${escapeHtml(m)}</span>`;
      else if (after) out += `<span class="tok-fn">${escapeHtml(m)}</span>`;
      else if (lang === 'yaml' && /^\s*:/.test(code.slice(i + m.length))) out += `<span class="tok-type">${escapeHtml(m)}</span>`;
      else if (/^[A-Z]/.test(m) && lang !== 'yaml') out += `<span class="tok-type">${escapeHtml(m)}</span>`;
      else out += escapeHtml(m);
    } else {
      m = code[i];
      out += escapeHtml(m);
    }
    i += m.length;
  }
  return out;
}

function highlightMarkers(s) {
  return escapeHtml(s).replace(/«(\d+)»/g, '<span class="marker">$1</span>');
}

const LANG_LABEL = { js: 'JavaScript', py: 'Python', cpp: 'C++', bash: 'bash', ps: 'PowerShell', cmd: 'cmd', json: 'JSON', yaml: 'YAML', html: 'HTML', css: 'CSS', text: '', diff: 'diff' };

/** Splits a lesson body into HTML parts and code blocks { lang, run, title, code }. */
export function parseFences(src) {
  const parts = [];
  const re = /~~~([^\n]*)\n([\s\S]*?)\n~~~/g;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    parts.push({ html: src.slice(last, m.index) });
    const info = m[1].trim();
    const lang = info.split(/\s+/)[0] || 'text';
    const title = /title="([^"]*)"/.exec(info)?.[1] || '';
    parts.push({ code: m[2], lang, run: /\brun\b/.test(info.replace(/title="[^"]*"/, '')), title });
    last = re.lastIndex;
  }
  parts.push({ html: src.slice(last) });
  return parts;
}

/** HTML of a static code block. */
export function codeBlock(code, lang, title = '') {
  const label = title || LANG_LABEL[lang] || '';
  return `<figure class="code" data-lang="${escapeHtml(lang)}">${label ? `<figcaption><span>${escapeHtml(label)}</span><button class="copy" type="button" aria-label="copy">⧉</button></figcaption>` : ''}<pre><code>${highlight(code, lang)}</code></pre></figure>`;
}

/**
 * Rich HTML of a lesson body; code blocks to run are left as placeholders
 * `<div data-run="i">` (the page turns them into sandboxes, see widgets/playground.js).
 */
export function richHtml(src) {
  const runs = [];
  const html = parseFences(src).map((p) => {
    if (p.html != null) return p.html;
    if (p.run && p.lang === 'js') {
      runs.push(p);
      return `<div data-run="${runs.length - 1}"></div>`;
    }
    return codeBlock(p.code, p.lang, p.title);
  }).join('');
  return { html, runs };
}
