// JavaScript sandbox of the lessons: the learner edits the code and runs it.
//
// The code runs in a throwaway Web Worker (built from a Blob), so an endless
// loop cannot freeze the page: the worker is stopped after a few seconds.
// console.log / warn / error are sent back and shown under the editor.

import { escapeHtml, highlight } from '../render.js';

const TIMEOUT_MS = 3000;

const RUNNER = `
const fmt = (v) => {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (typeof v === 'function') return v.toString().split('\\n')[0] + (v.toString().includes('\\n') ? ' …' : '');
  if (ArrayBuffer.isView(v)) return v.constructor.name + '(' + v.length + ') [' + Array.from(v).join(', ') + ']';
  if (v instanceof Map) return 'Map(' + v.size + ') {' + [...v].map(([k, x]) => fmt(k) + ' => ' + fmt(x)).join(', ') + '}';
  if (v instanceof Set) return 'Set(' + v.size + ') {' + [...v].map(fmt).join(', ') + '}';
  if (v === undefined) return 'undefined';
  try { return JSON.stringify(v, null, 1).replace(/\\n\\s*/g, ' '); } catch { return String(v); }
};
for (const level of ['log', 'info', 'warn', 'error']) {
  console[level] = (...args) => postMessage({ level, text: args.map(fmt).join(' ') });
}
self.onmessage = async ({ data }) => {
  try {
    const AsyncFunction = (async () => {}).constructor;
    await new AsyncFunction(data)();
    postMessage({ done: true });
  } catch (err) {
    postMessage({ level: 'error', text: (err && err.name ? err.name + ': ' + err.message : String(err)) });
    postMessage({ done: true });
  }
};`;

let runnerUrl = null;

export function mountPlayground(el, code, t) {
  el.className = 'playground';
  el.innerHTML = `
    <div class="pg-head"><span>🧪 ${escapeHtml(t('pg.title'))}</span>
      <span class="pg-actions">
        <button type="button" class="btn small ghost pg-reset">${escapeHtml(t('pg.reset'))}</button>
        <button type="button" class="btn small pg-run">▶ ${escapeHtml(t('pg.run'))}</button>
      </span></div>
    <div class="pg-editor"><pre class="pg-hl" aria-hidden="true"><code></code></pre><textarea spellcheck="false" autocapitalize="off" aria-label="${escapeHtml(t('pg.title'))}"></textarea></div>
    <div class="pg-out" aria-live="polite"><span class="muted">${escapeHtml(t('pg.hint'))}</span></div>`;
  const ta = el.querySelector('textarea');
  const hl = el.querySelector('.pg-hl code');
  const out = el.querySelector('.pg-out');
  const sync = () => {
    hl.innerHTML = highlight(ta.value, 'js') + '\n';
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };
  ta.value = code;
  requestAnimationFrame(sync);
  ta.addEventListener('input', sync);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b } = ta;
      ta.setRangeText('  ', a, b, 'end');
      sync();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  });
  el.querySelector('.pg-reset').addEventListener('click', () => {
    ta.value = code;
    sync();
    out.innerHTML = `<span class="muted">${escapeHtml(t('pg.hint'))}</span>`;
  });
  const run = () => {
    out.innerHTML = '';
    runnerUrl ||= URL.createObjectURL(new Blob([RUNNER], { type: 'text/javascript' }));
    const worker = new Worker(runnerUrl);
    let lines = 0;
    const timer = setTimeout(() => {
      worker.terminate();
      print('error', t('pg.timeout'));
    }, TIMEOUT_MS);
    const print = (level, text) => {
      lines++;
      const div = document.createElement('div');
      div.className = `pg-line ${level}`;
      div.textContent = text;
      out.append(div);
    };
    worker.onmessage = ({ data }) => {
      if (data.done) {
        clearTimeout(timer);
        worker.terminate();
        if (!lines) print('muted', t('pg.nothing'));
        return;
      }
      if (lines < 200) print(data.level, data.text);
    };
    worker.postMessage(ta.value);
  };
  el.querySelector('.pg-run').addEventListener('click', run);
}
