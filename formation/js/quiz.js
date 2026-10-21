// One question on the screen: its form by type, checking the answer, and the
// explanation. A session (list of questions) is driven by app.js.

import { codeBlock, escapeHtml, highlight } from './render.js';

const L = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.fr : v);

function shuffled(n, rand = Math.random) {
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // Never show an ordering question already in order.
  if (n > 1 && idx.every((v, i) => v === i)) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}

export const normalizeAnswer = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[;.]$/, '').replace(/[’`]/g, "'");

/** Is the learner's answer right? `given` depends on the type (see each form). */
export function check(q, given, lang) {
  switch (q.type) {
    case 'mcq': return given === q.answer;
    case 'multi': {
      const want = [...q.answer].sort().join();
      return [...given].sort().join() === want;
    }
    case 'tf': return given === q.answer;
    case 'fill': {
      const acc = Array.isArray(q.accept) ? q.accept : [...(q.accept[lang] || []), ...(q.accept.fr || []), ...(q.accept.en || [])];
      return acc.some((a) => normalizeAnswer(a) === normalizeAnswer(given));
    }
    case 'order': return given.every((v, i) => v === i);
    case 'match': return given.every((v, i) => v === i);
    case 'line': return given === q.answer;
    default: return false;
  }
}

/**
 * Renders question `q` into `el`. Calls onAnswer(ok) once the learner has
 * validated; the explanation is then shown, and the caller adds "Next".
 */
export function renderQuestion(el, q, { lang, t, onAnswer, rand = Math.random }) {
  const prompt = L(q.prompt, lang);
  el.innerHTML = `
    <div class="q-head"><span class="q-type">${escapeHtml(t(`qtype.${q.type}`))}</span><span class="q-level" title="${escapeHtml(t('q.level'))}">${'★'.repeat(q.level)}${'☆'.repeat(3 - q.level)}</span></div>
    <div class="q-prompt">${prompt}</div>
    ${q.code && q.type !== 'line' && q.type !== 'fill' ? codeBlock(q.code, q.lang || 'text') : ''}
    <div class="q-body"></div>
    ${q.hint ? `<details class="q-hint"><summary>💡 ${escapeHtml(t('q.hint'))}</summary>${L(q.hint, lang)}</details>` : ''}
    <div class="q-actions"><button type="button" class="btn q-check" disabled>${escapeHtml(t('q.check'))}</button></div>
    <div class="q-feedback" aria-live="polite"></div>`;
  const body = el.querySelector('.q-body');
  const btn = el.querySelector('.q-check');
  let getAnswer = () => null;
  let lock = () => {};
  const ready = (on = true) => { btn.disabled = !on; };

  if (q.type === 'mcq' || q.type === 'multi') {
    const choices = L(q.choices, lang);
    const order = shuffled(choices.length, rand);
    const multi = q.type === 'multi';
    body.innerHTML = `${multi ? `<p class="muted small">${escapeHtml(t('q.several'))}</p>` : ''}<div class="choices">${order.map((i) => `<button type="button" class="choice" data-i="${i}" aria-pressed="false"><span class="box">${multi ? '☐' : '○'}</span><span>${choices[i]}</span></button>`).join('')}</div>`;
    const btns = [...body.querySelectorAll('.choice')];
    btns.forEach((b) => b.addEventListener('click', () => {
      if (b.disabled) return;
      if (!multi) btns.forEach((x) => { x.classList.remove('picked'); x.setAttribute('aria-pressed', 'false'); x.querySelector('.box').textContent = '○'; });
      const on = !b.classList.contains('picked') || !multi;
      b.classList.toggle('picked', on);
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('.box').textContent = on ? (multi ? '☑' : '●') : multi ? '☐' : '○';
      ready(btns.some((x) => x.classList.contains('picked')));
    }));
    getAnswer = () => {
      const picked = btns.filter((x) => x.classList.contains('picked')).map((x) => +x.dataset.i);
      return multi ? picked : picked[0];
    };
    lock = (ok) => {
      const right = multi ? q.answer : [q.answer];
      btns.forEach((b) => {
        b.disabled = true;
        const i = +b.dataset.i;
        if (right.includes(i)) b.classList.add('right');
        else if (b.classList.contains('picked')) b.classList.add('wrong');
      });
    };
  } else if (q.type === 'tf') {
    body.innerHTML = `<div class="choices tf"><button type="button" class="choice" data-v="true">✔ ${escapeHtml(t('q.true'))}</button><button type="button" class="choice" data-v="false">✘ ${escapeHtml(t('q.false'))}</button></div>`;
    const btns = [...body.querySelectorAll('.choice')];
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.remove('picked'));
      b.classList.add('picked');
      ready();
    }));
    getAnswer = () => body.querySelector('.picked')?.dataset.v === 'true';
    lock = () => btns.forEach((b) => {
      b.disabled = true;
      if ((b.dataset.v === 'true') === q.answer) b.classList.add('right');
      else if (b.classList.contains('picked')) b.classList.add('wrong');
    });
  } else if (q.type === 'fill') {
    const code = q.code || '';
    const input = `<input type="text" class="fill-input" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="${escapeHtml(t('q.answer'))}">`;
    if (code.includes('____')) {
      const [a, ...rest] = code.split('____');
      body.innerHTML = `<figure class="code"><pre><code>${highlight(a, q.lang || 'text')}${input}${highlight(rest.join('____'), q.lang || 'text')}</code></pre></figure>`;
    } else {
      body.innerHTML = `${code ? codeBlock(code, q.lang || 'text') : ''}<div class="fill-line">${input}</div>`;
    }
    const field = body.querySelector('input');
    field.addEventListener('input', () => ready(field.value.trim().length > 0));
    field.addEventListener('keydown', (e) => { if (e.key === 'Enter' && field.value.trim()) btn.click(); });
    setTimeout(() => field.focus({ preventScroll: true }), 50);
    getAnswer = () => field.value;
    lock = (ok) => {
      field.disabled = true;
      field.classList.add(ok ? 'right' : 'wrong');
      if (!ok) {
        const acc = Array.isArray(q.accept) ? q.accept : q.accept[lang] || q.accept.fr;
        field.insertAdjacentHTML('afterend', ` <span class="expected">→ <code>${escapeHtml(acc[0])}</code></span>`);
      }
    };
  } else if (q.type === 'order') {
    const items = L(q.items, lang);
    let order = shuffled(items.length, rand);
    const draw = () => {
      body.innerHTML = `<p class="muted small">${escapeHtml(t('q.orderHelp'))}</p><ol class="order-list">${order.map((i, k) => `<li data-i="${i}" draggable="true"><span class="grip">⠿</span><span class="txt">${items[i]}</span><span class="moves"><button type="button" class="mv up" aria-label="${escapeHtml(t('q.up'))}" ${k === 0 ? 'disabled' : ''}>▲</button><button type="button" class="mv down" aria-label="${escapeHtml(t('q.down'))}" ${k === order.length - 1 ? 'disabled' : ''}>▼</button></span></li>`).join('')}</ol>`;
      const lis = [...body.querySelectorAll('li')];
      lis.forEach((li, k) => {
        li.querySelector('.up').addEventListener('click', () => { [order[k - 1], order[k]] = [order[k], order[k - 1]]; draw(); body.querySelectorAll('li')[k - 1]?.querySelector('.up, .down')?.focus(); });
        li.querySelector('.down').addEventListener('click', () => { [order[k + 1], order[k]] = [order[k], order[k + 1]]; draw(); body.querySelectorAll('li')[k + 1]?.querySelector('.down, .up')?.focus(); });
        li.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(k)); li.classList.add('dragging'); });
        li.addEventListener('dragend', () => li.classList.remove('dragging'));
        li.addEventListener('dragover', (e) => e.preventDefault());
        li.addEventListener('drop', (e) => {
          e.preventDefault();
          const from = +e.dataTransfer.getData('text/plain');
          const [x] = order.splice(from, 1);
          order.splice(k, 0, x);
          draw();
        });
      });
      ready();
    };
    draw();
    getAnswer = () => order;
    lock = () => {
      body.querySelectorAll('li').forEach((li, k) => {
        li.draggable = false;
        li.querySelectorAll('button').forEach((b) => (b.disabled = true));
        li.classList.add(+li.dataset.i === k ? 'right' : 'wrong');
        if (+li.dataset.i !== k) li.insertAdjacentHTML('beforeend', `<span class="should">#${+li.dataset.i + 1}</span>`);
      });
    };
  } else if (q.type === 'match') {
    const pairs = L(q.pairs, lang);
    const right = shuffled(pairs.length, rand);
    body.innerHTML = `<p class="muted small">${escapeHtml(t('q.matchHelp'))}</p><div class="match">${pairs.map((p, i) => `<div class="match-row"><span class="match-left">${p[0]}</span><select data-i="${i}" aria-label="${escapeHtml(t('q.answer'))}"><option value="">—</option>${right.map((j) => `<option value="${j}">${escapeHtml(String(pairs[j][1]).replace(/<[^>]+>/g, ''))}</option>`).join('')}</select></div>`).join('')}</div>`;
    const sels = [...body.querySelectorAll('select')];
    sels.forEach((s) => s.addEventListener('change', () => ready(sels.every((x) => x.value !== ''))));
    getAnswer = () => sels.map((s) => +s.value);
    lock = () => sels.forEach((s, i) => {
      s.disabled = true;
      const ok = +s.value === i;
      s.classList.add(ok ? 'right' : 'wrong');
      if (!ok) s.insertAdjacentHTML('afterend', `<span class="expected">→ ${pairs[i][1]}</span>`);
    });
  } else if (q.type === 'line') {
    const lines = q.code.split('\n');
    body.innerHTML = `<p class="muted small">${escapeHtml(t('q.lineHelp'))}</p><figure class="code lines"><pre><code>${lines.map((l, i) => `<button type="button" class="code-line" data-i="${i}"><span class="ln">${i + 1}</span>${highlight(l, q.lang || 'text') || ' '}</button>`).join('')}</code></pre></figure>`;
    const btns = [...body.querySelectorAll('.code-line')];
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.remove('picked'));
      b.classList.add('picked');
      ready();
    }));
    getAnswer = () => +(body.querySelector('.picked')?.dataset.i ?? -1);
    lock = () => btns.forEach((b) => {
      b.disabled = true;
      if (+b.dataset.i === q.answer) b.classList.add('right');
      else if (b.classList.contains('picked')) b.classList.add('wrong');
    });
  }

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const ok = check(q, getAnswer(), lang);
    lock(ok);
    btn.remove();
    el.querySelector('.q-hint')?.removeAttribute('open');
    const fb = el.querySelector('.q-feedback');
    fb.className = `q-feedback ${ok ? 'ok' : 'ko'}`;
    fb.innerHTML = `<div class="fb-title">${ok ? `🎉 ${escapeHtml(t('q.right'))}` : `🤔 ${escapeHtml(t('q.wrong'))}`}</div><div class="fb-explain">${L(q.explain, lang)}</div>`;
    onAnswer(ok);
  }, { once: false });
}
