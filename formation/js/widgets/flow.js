// Animated sequence diagram: who sends which message to whom, step by step.
// Actors are columns; each step is an arrow from one column to another, with
// an explanation shown under the diagram.

import { escapeHtml } from '../render.js';

const ICONS = ['🧑', '🖥️', '⚙️', '☁️', '🤖', '🗄️', '📦', '🔧'];

export function mountFlow(el, { actors, steps }, { lang, t }) {
  const L = (v) => (v && typeof v === 'object' ? v[lang] ?? v.fr : v || '');
  let current = -1;
  let timer = null;
  el.className = 'flow-widget';
  const cols = actors.length;
  el.innerHTML = `
    <div class="flow-stage" style="--cols:${cols}">
      <div class="flow-actors">${actors.map((a, i) => `<div class="flow-actor" data-i="${i}"><span class="flow-icon">${L(a.icon) || ICONS[i % ICONS.length]}</span><span>${escapeHtml(L(a))}</span></div>`).join('')}</div>
      <div class="flow-lanes">${actors.map(() => '<i></i>').join('')}</div>
      <ol class="flow-steps">${steps.map((s, i) => {
        const a = Math.min(s.from, s.to);
        const b = Math.max(s.from, s.to);
        const self = s.from === s.to;
        return `<li class="flow-step ${s.to < s.from ? 'back' : ''} ${self ? 'self' : ''}" data-i="${i}" style="--a:${a};--b:${b}" tabindex="0">
          <span class="flow-arrow"><span class="flow-label">${i + 1}. ${escapeHtml(L(s.label))}</span><span class="flow-dot"></span></span></li>`;
      }).join('')}</ol>
    </div>
    <div class="flow-detail" aria-live="polite"></div>
    <div class="flow-controls">
      <button type="button" class="btn small ghost flow-prev">◀ ${escapeHtml(t('flow.prev'))}</button>
      <button type="button" class="btn small flow-play">▶ ${escapeHtml(t('flow.play'))}</button>
      <button type="button" class="btn small ghost flow-next">${escapeHtml(t('flow.next'))} ▶</button>
      <span class="flow-count muted"></span>
    </div>`;
  const items = [...el.querySelectorAll('.flow-step')];
  const detail = el.querySelector('.flow-detail');
  const count = el.querySelector('.flow-count');
  const show = (i) => {
    current = Math.max(-1, Math.min(steps.length - 1, i));
    items.forEach((li, k) => {
      li.classList.toggle('seen', k < current);
      li.classList.toggle('active', k === current);
      li.classList.toggle('future', k > current);
    });
    el.querySelectorAll('.flow-actor').forEach((a) => {
      const s = steps[current];
      a.classList.toggle('speaking', !!s && +a.dataset.i === s.from);
      a.classList.toggle('listening', !!s && +a.dataset.i === s.to);
    });
    const s = steps[current];
    detail.innerHTML = s ? `<strong>${current + 1}. ${escapeHtml(L(s.label))}</strong>${s.detail ? `<div>${L(s.detail)}</div>` : ''}` : `<span class="muted">${escapeHtml(t('flow.start'))}</span>`;
    count.textContent = `${current + 1} / ${steps.length}`;
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
    el.querySelector('.flow-play').textContent = `▶ ${t('flow.play')}`;
  };
  el.querySelector('.flow-prev').addEventListener('click', () => { stop(); show(current - 1); });
  el.querySelector('.flow-next').addEventListener('click', () => { stop(); show(current + 1); });
  el.querySelector('.flow-play').addEventListener('click', (e) => {
    if (timer) return stop();
    if (current >= steps.length - 1) show(-1);
    e.currentTarget.textContent = `⏸ ${t('flow.pause')}`;
    show(current + 1);
    timer = setInterval(() => {
      if (current >= steps.length - 1 || !el.isConnected) return stop();
      show(current + 1);
    }, 2600);
  });
  items.forEach((li, k) => {
    li.addEventListener('click', () => { stop(); show(k); });
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); show(k); } });
  });
  show(-1);
}
