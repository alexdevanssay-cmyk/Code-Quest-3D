// Code Quest 3D: the page. A hash router (#/lesson/js-1 …) renders each view
// into <main>; the progress is saved after every action (store.js), and the
// adaptive engine (adaptive.js) decides what to recommend.

import { GLOSSARY, MODULES } from '../content/index.js';
import {
  BADGES, PASS, awardBadges, buildCourse, dueCount, examSet, finalSet, lessonQuiz, levelOf, moduleProgress,
  practiceSet, recommendations, record, reviewSet, sessionSkills, skillState, weakSkills,
} from './adaptive.js';
import { cloud, cloudConfigured, cloudErrorKey } from './cloud.js';
import { renderQuestion } from './quiz.js';
import { escapeHtml, richHtml } from './render.js';
import { emptyState, exportFile, importFile, load, save, today } from './store.js';
import { Sync } from './sync.js';
import { translator } from './ui.js';
import { mountFlow } from './widgets/flow.js';
import { mountJsonLab } from './widgets/jsonlab.js';
import { mountPlayground } from './widgets/playground.js';
import { mountTerminal } from './widgets/terminal.js';

const course = buildCourse(MODULES, GLOSSARY);
const glossary = new Map(GLOSSARY.map((g) => [g.id, g]));
let state = load();
let lang = state.lang || ((navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en');
let t = translator(lang);
let storageOk = true;
let session = null; // the quiz being taken
let account = null; // signed-in Firebase user
let api = null; // cloud() once loaded
let sync = null; // online copy of the progress
let syncState = { kind: cloudConfigured() ? 'loading' : 'off' };

const $ = (sel, root = document) => root.querySelector(sel);
const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.fr : v ?? '');
const view = () => $('#view');
const pct = (x) => Math.round(x * 100);
const moduleById = (id) => MODULES.find((m) => m.id === id);
const skillName = (id) => L(course.skills.get(id)?.name) || id;

function persist() {
  storageOk = save(state);
  sync?.changed();
  renderTopbar();
}

// ------------------------------------------------------------------ chrome

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', state.theme);
}

function renderChrome() {
  document.documentElement.lang = lang;
  document.title = `${t('app.name')} — ${t('app.tagline')}`;
  const nav = [
    ['home', '🏠', t('nav.home')],
    ['path', '🗺️', t('nav.path')],
    ['weak', '🔧', t('nav.weak')],
    ['review', '♻️', t('nav.review')],
    ['glossary', '📖', t('nav.glossary')],
    ['lab', '🧪', t('nav.lab')],
    ['progress', '📈', t('nav.progress')],
    ['account', '👤', t('nav.account')],
  ];
  $('#nav').innerHTML = nav.map(([r, icon, label]) => `<a href="#/${r}" data-route="${r}"><span class="nav-icon" aria-hidden="true">${icon}</span><span class="nav-label">${escapeHtml(label)}</span><span class="nav-badge" data-badge="${r}"></span></a>`).join('');
  $('#lang-btn').textContent = lang === 'fr' ? 'EN' : 'FR';
  $('#lang-btn').title = t('top.lang');
  $('#theme-btn').title = t('top.theme');
  $('#menu-btn').setAttribute('aria-label', t('nav.menu'));
  $('#brand-name').textContent = t('app.name');
  $('#footer').textContent = t('misc.footer');
  renderTopbar();
}

function renderTopbar() {
  const lv = levelOf(state.xp);
  $('#xp').innerHTML = `<span class="lvl" title="${escapeHtml(L(lv.rank))}">${escapeHtml(t('top.level'))} ${lv.level}</span><span class="xpbar"><i style="width:${pct(lv.progress)}%"></i></span><span class="xpnum">${state.xp} XP</span>`;
  const streak = state.streak.day === today() || state.streak.day === today(Date.now() - 86400000) ? state.streak.count : 0;
  $('#streak').innerHTML = `🔥 ${streak}`;
  $('#streak').title = `${streak} ${t('top.streak')}`;
  const weak = weakSkills(course, state).length;
  const due = dueCount(course, state);
  const set = (r, n) => { const b = document.querySelector(`[data-badge="${r}"]`); if (b) b.textContent = n ? String(n) : ''; };
  set('weak', weak);
  set('review', due);
  const acc = $('#account-btn');
  const icon = { off: '👤', loading: '👤', out: '👤', syncing: '⏳', synced: '☁️', offline: '📴', error: '⚠️' }[syncState.kind] || '👤';
  acc.textContent = icon;
  acc.title = account ? `${account.email || ''} — ${t(`acc.status.${syncState.kind}`)}` : t('nav.account');
  acc.classList.toggle('signed', !!account);
}

function toast(html, kind = '') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = html;
  $('#toasts').append(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3200);
}

function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7', '#f97316'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.6}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 3500);
}

function announceBadges(list) {
  for (const b of list) toast(`${b.icon} ${escapeHtml(t('quiz.newBadge', { name: L(b.name) }))}`, 'badge');
  if (list.length) persist();
}

// ------------------------------------------------------------------ rich content

let pop = null;
function showTerm(target) {
  const g = glossary.get(target.dataset.term);
  if (!g) return;
  state.glossarySeen[g.id] ||= Date.now();
  announceBadges(awardBadges(course, state));
  persist();
  pop ||= $('#term-pop');
  pop.innerHTML = `<strong>${escapeHtml(L(g.term))}</strong><p>${L(g.def)}</p>${g.example ? `<p class="muted"><em>${escapeHtml(t('glossary.example'))} :</em> ${L(g.example)}</p>` : ''}<a href="#/glossary?q=${encodeURIComponent(L(g.term))}">${escapeHtml(t('nav.glossary'))} →</a>`;
  pop.hidden = false;
  const r = target.getBoundingClientRect();
  const w = Math.min(340, window.innerWidth - 24);
  pop.style.width = `${w}px`;
  pop.style.left = `${Math.max(12, Math.min(window.innerWidth - w - 12, r.left + window.scrollX))}px`;
  pop.style.top = `${r.bottom + window.scrollY + 8}px`;
}

document.addEventListener('click', (e) => {
  const term = e.target.closest('.term[data-term]');
  if (term) {
    e.preventDefault();
    showTerm(term);
    return;
  }
  if (pop && !e.target.closest('#term-pop')) pop.hidden = true;
  const copy = e.target.closest('button.copy');
  if (copy) {
    const code = copy.closest('figure')?.querySelector('code')?.innerText || '';
    navigator.clipboard?.writeText(code).then(() => toast(escapeHtml(t('misc.copy'))));
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pop) pop.hidden = true;
  const term = e.target.closest?.('.term[data-term]');
  if (term && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showTerm(term); }
});

/** Lesson HTML with its code blocks, sandboxes, terminals and diagrams. */
function mountRich(el, src, module) {
  const { html, runs } = richHtml(src || '');
  el.innerHTML = html;
  el.querySelectorAll('[data-run]').forEach((d) => mountPlayground(d, runs[+d.dataset.run].code, t));
  el.querySelectorAll('.term[data-term]').forEach((s) => { s.tabIndex = 0; s.setAttribute('role', 'button'); });
  el.querySelectorAll('[data-widget]').forEach((d) => {
    const id = d.dataset.widget;
    const w = module?.widgets?.[id];
    if (!w) return;
    if (w.type === 'terminal') {
      mountTerminal(d, {
        ...w, lang, t, done: state.terminal[id] || 0,
        onMission: (n) => {
          if (n > (state.terminal[id] || 0)) {
            state.terminal[id] = n;
            state.xp += 5;
            toast('+5 XP ⌨️');
            announceBadges(awardBadges(course, state));
            persist();
          }
        },
      });
    } else if (w.type === 'flow') mountFlow(d, w, { lang, t });
    else if (w.type === 'jsonlab') {
      mountJsonLab(d, {
        ...w, lang, t, done: state.terminal[id] || 0,
        onMission: (n) => {
          if (n <= (state.terminal[id] || 0)) return;
          const gained = 5 * (n - (state.terminal[id] || 0));
          state.terminal[id] = n;
          state.xp += gained;
          toast(`+${gained} XP 🗂️`);
          announceBadges(awardBadges(course, state));
          persist();
        },
      });
    }
  });
  el.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
}

// ------------------------------------------------------------------ views

function viewHome() {
  const recs = recommendations(course, state);
  const answered = Object.values(state.q);
  const n = answered.reduce((s, e) => s + e.n, 0);
  const ok = answered.reduce((s, e) => s + e.ok, 0);
  const lessonsDone = Object.values(state.lessons).filter((l) => l.done).length;
  const passed = MODULES.filter((m) => moduleProgress(state, m).passed).length;
  const lv = levelOf(state.xp);
  const recHtml = recs.length ? recs.map(recCard).join('') : `<div class="card rec done">✨ ${escapeHtml(t('rec.done'))}</div>`;
  view().innerHTML = `
    <section class="hero">
      <div>
        <h1>${state.name ? escapeHtml(t('home.hello', { name: state.name })) : escapeHtml(t('home.helloAnon'))}</h1>
        <p class="lead">${escapeHtml(t('home.intro'))}</p>
        ${lessonsDone ? '' : `<a class="btn big" href="#/lesson/${MODULES[0].lessons[0].id}">🚀 ${escapeHtml(t('home.start'))}</a>`}
      </div>
      <div class="hero-badge"><div class="ring" style="--p:${pct(lv.progress)}"><span>${lv.level}</span></div><div class="rank">${escapeHtml(L(lv.rank))}</div><div class="muted small">${state.xp} XP</div></div>
    </section>
    <section><h2>${escapeHtml(t('home.next'))}</h2><div class="recs">${recHtml}</div></section>
    <section><h2>${escapeHtml(t('home.stats'))}</h2>
      <div class="stats">
        <div class="stat"><b>${lessonsDone}</b><span>${escapeHtml(t('home.lessons'))}</span></div>
        <div class="stat"><b>${passed}/${MODULES.length}</b><span>${escapeHtml(t('home.exams'))}</span></div>
        <div class="stat"><b>${n}</b><span>${escapeHtml(t('home.answers'))}</span></div>
        <div class="stat"><b>${n ? pct(ok / n) : 0} %</b><span>${escapeHtml(t('home.accuracy'))}</span></div>
      </div>
    </section>
    <section class="grid2">
      <div class="card"><h3>${escapeHtml(t('home.howto'))}</h3><ul class="plain">${[1, 2, 3, 4, 5].map((i) => `<li>${escapeHtml(t(`home.howto${i}`))}</li>`).join('')}</ul>
        <form class="name-form" id="name-form"><label>${escapeHtml(t('home.name'))} <input name="name" maxlength="30" value="${escapeHtml(state.name)}"></label><button class="btn small">${escapeHtml(t('home.nameSave'))}</button></form>
      </div>
      <div class="card"><h3>${escapeHtml(t('home.badges'))}</h3>${badgesHtml()}</div>
    </section>
    ${storageOk ? '' : `<p class="warn-box">${escapeHtml(t('progress.storage'))}</p>`}`;
  $('#name-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.name = new FormData(e.target).get('name').trim();
    persist();
    viewHome();
  });
}

function recCard(r) {
  if (r.kind === 'weak') {
    const lessonId = course.skills.get(r.skill)?.lessons[0];
    return `<div class="card rec weak"><div class="rec-icon">🔧</div><div><b>${escapeHtml(t('rec.weak', { skill: skillName(r.skill) }))}</b><div class="muted small">${escapeHtml(t('rec.weakSub', { pct: pct(r.mastery) }))}</div>
      <div class="rec-actions">${lessonId ? `<a class="btn small ghost" href="#/lesson/${lessonId}?deep=1">${escapeHtml(t('weak.lesson'))}</a>` : ''}<a class="btn small" href="#/quiz/practice/${r.skill}">${escapeHtml(t('weak.practice'))}</a></div></div></div>`;
  }
  if (r.kind === 'review') return `<a class="card rec review" href="#/quiz/review"><div class="rec-icon">♻️</div><div><b>${escapeHtml(t('rec.review', { n: r.count }))}</b><div class="muted small">${escapeHtml(t('rec.reviewSub'))}</div></div></a>`;
  if (r.kind === 'lesson') {
    const l = course.lessons.get(r.lesson);
    return `<a class="card rec lesson" href="#/lesson/${l.id}" style="--accent:${l.module.color}"><div class="rec-icon">${l.module.icon}</div><div><b>${escapeHtml(t('rec.lesson', { title: L(l.title) }))}</b><div class="muted small">${escapeHtml(L(l.module.title))} · ${escapeHtml(t('lesson.minutes', { n: l.minutes || 10 }))}</div></div></a>`;
  }
  if (r.kind === 'exam') {
    const m = moduleById(r.module);
    return `<a class="card rec exam" href="#/quiz/exam/${m.id}" style="--accent:${m.color}"><div class="rec-icon">🏅</div><div><b>${escapeHtml(t('rec.exam', { title: L(m.title) }))}</b><div class="muted small">${escapeHtml(r.tried ? t('rec.examRetry', { pct: pct(r.best) }) : t('rec.examSub'))}</div></div></a>`;
  }
  return `<a class="card rec final" href="#/quiz/final"><div class="rec-icon">👑</div><div><b>${escapeHtml(t('rec.final'))}</b><div class="muted small">${escapeHtml(t('rec.finalSub'))}</div></div></a>`;
}

function badgesHtml() {
  return `<div class="badges">${BADGES.map((b) => `<div class="badge ${state.badges[b.id] ? 'on' : ''}" title="${escapeHtml(L(b.desc))}"><span>${b.icon}</span><small>${escapeHtml(L(b.name))}</small></div>`).join('')}</div>`;
}

function viewPath() {
  view().innerHTML = `
    <h1>${escapeHtml(t('path.title'))}</h1><p class="lead">${escapeHtml(t('path.intro'))}</p>
    <ol class="path">${MODULES.map((m, i) => {
      const p = moduleProgress(state, m);
      const full = p.done === p.total;
      return `<li class="path-step ${p.passed ? 'passed' : full ? 'full' : p.done ? 'started' : ''}" style="--accent:${m.color}">
        <a href="#/module/${m.id}" class="path-card">
          <span class="path-num">${p.passed ? '✔' : i + 1}</span>
          <span class="path-icon">${m.icon}</span>
          <span class="path-text"><b>${escapeHtml(L(m.title))}</b><span class="muted small">${escapeHtml(L(m.summary))}</span>
            <span class="meter"><i style="width:${pct(p.done / p.total)}%"></i></span>
            <span class="small">${escapeHtml(t('path.lessons', { done: p.done, total: p.total }))} · ${p.passed ? `🏅 ${escapeHtml(t('path.passed', { pct: pct(p.best) }))}` : p.tried ? `${escapeHtml(t('path.exam'))} ${pct(p.best)} %` : ''}</span></span>
        </a></li>`;
    }).join('')}
      <li class="path-step final"><a href="#/quiz/final" class="path-card"><span class="path-num">👑</span><span class="path-icon">🎓</span><span class="path-text"><b>${escapeHtml(t('path.final'))}</b><span class="muted small">${escapeHtml(t('path.finalSub'))}</span></span></a></li>
    </ol>`;
}

function skillChip(id) {
  const s = skillState(state, id);
  return `<span class="chip status-${s.status}" title="${escapeHtml(t(`status.${s.status}`))}${s.n ? ` · ${pct(s.mastery)} %` : ''}">${escapeHtml(skillName(id))}${s.n ? ` <b>${pct(s.mastery)}%</b>` : ''}</span>`;
}

function viewModule(id) {
  const m = moduleById(id);
  if (!m) return notFound();
  const p = moduleProgress(state, m);
  const exams = state.exams[m.id] || [];
  view().innerHTML = `
    <nav class="crumbs"><a href="#/path">${escapeHtml(t('nav.path'))}</a> › ${escapeHtml(L(m.title))}</nav>
    <header class="module-head" style="--accent:${m.color}"><span class="module-icon">${m.icon}</span><div><h1>${escapeHtml(L(m.title))}</h1><p class="lead">${escapeHtml(L(m.summary))}</p></div></header>
    <section><h2>${escapeHtml(t('module.lessons'))}</h2>
      <ol class="lesson-list">${m.lessons.map((l) => {
        const done = state.lessons[l.id]?.done;
        const weak = l.skills.some((s) => ['weak', 'fragile'].includes(skillState(state, s).status) && skillState(state, s).n >= 2);
        return `<li class="${done ? 'done' : ''}"><a href="#/lesson/${l.id}"><span class="ls-check">${done ? '✔' : '○'}</span><span class="ls-title">${escapeHtml(L(l.title))}</span>${weak ? '<span class="chip status-weak">🔧</span>' : ''}<span class="muted small">${escapeHtml(t('lesson.minutes', { n: l.minutes || 10 }))}</span></a></li>`;
      }).join('')}</ol>
    </section>
    <section><h2>${escapeHtml(t('module.skills'))}</h2>
      <div class="skill-rows">${Object.keys(m.skills).map((s) => skillRow(s)).join('')}</div>
    </section>
    <section class="card exam-card" style="--accent:${m.color}">
      <div><h3>🏅 ${escapeHtml(t('module.exam'))}</h3><p class="muted">${escapeHtml(t('module.examSub', { n: examSet(course, m.id).length }))}${exams.length ? ` · ${escapeHtml(t('path.exam'))} : ${exams.slice(-3).map((e) => `${pct(e.score / e.total)} %`).join(', ')}` : ''}</p></div>
      <a class="btn" href="#/quiz/exam/${m.id}">${p.passed ? '🔁 ' : ''}${escapeHtml(t('module.exam'))}</a>
    </section>`;
}

function skillRow(id) {
  const s = skillState(state, id);
  const lessonId = course.skills.get(id)?.lessons[0];
  return `<div class="skill-row status-${s.status}">
    <div class="skill-name"><b>${escapeHtml(skillName(id))}</b><span class="muted small">${escapeHtml(t(`status.${s.status}`))}${s.n ? ` · ${escapeHtml(t('weak.answers', { n: s.n }))}` : ''}</span></div>
    <div class="meter"><i style="width:${s.n ? pct(s.mastery) : 0}%"></i><span class="pass-mark" style="left:${pct(PASS)}%"></span></div>
    <div class="skill-actions">${lessonId ? `<a class="btn small ghost" href="#/lesson/${lessonId}?deep=1" title="${escapeHtml(t('weak.lesson'))}">🧩</a>` : ''}<a class="btn small ghost" href="#/quiz/practice/${id}" title="${escapeHtml(t('weak.practice'))}">🎯</a></div>
  </div>`;
}

function viewLesson(id, params) {
  const l = course.lessons.get(id);
  if (!l) return notFound();
  const m = l.module;
  const idx = m.lessons.findIndex((x) => x.id === id);
  const prev = m.lessons[idx - 1];
  const next = m.lessons[idx + 1];
  const weak = l.skills.some((s) => { const st = skillState(state, s); return st.n >= 2 && (st.status === 'weak' || st.status === 'fragile'); });
  let deep = params.get('deep') === '1' || weak;
  const quiz = lessonQuiz(course, id);
  const done = state.lessons[id]?.done;
  view().innerHTML = `
    <nav class="crumbs"><a href="#/path">${escapeHtml(t('nav.path'))}</a> › <a href="#/module/${m.id}">${m.icon} ${escapeHtml(L(m.title))}</a> › ${idx + 1}/${m.lessons.length}</nav>
    <article class="lesson" style="--accent:${m.color}">
      <header class="lesson-head"><h1>${escapeHtml(L(l.title))}</h1>
        <div class="lesson-meta"><span class="muted">⏱ ${escapeHtml(t('lesson.minutes', { n: l.minutes || 10 }))}</span>${l.skills.map(skillChip).join('')}${done ? `<span class="chip done">${escapeHtml(t('lesson.done'))}</span>` : ''}</div>
        <div class="deep-toggle"><button type="button" class="btn ghost" id="deep-btn"></button></div>
      </header>
      <div id="deep-banner"></div>
      <div class="lesson-body" id="lesson-body"></div>
      <section class="lesson-quiz card">
        <h2>🎯 ${escapeHtml(t('lesson.quiz'))}</h2>
        ${quiz.length ? `<a class="btn big" href="#/quiz/lesson/${id}">${escapeHtml(t('lesson.quizStart', { n: quiz.length }))}</a>` : `<button class="btn" id="mark-done">${escapeHtml(t('lesson.markDone'))}</button>`}
      </section>
      <nav class="lesson-nav">
        ${prev ? `<a class="btn ghost" href="#/lesson/${prev.id}">← ${escapeHtml(L(prev.title))}</a>` : `<a class="btn ghost" href="#/module/${m.id}">← ${escapeHtml(t('lesson.back'))}</a>`}
        ${next ? `<a class="btn ghost" href="#/lesson/${next.id}">${escapeHtml(L(next.title))} →</a>` : `<a class="btn ghost" href="#/quiz/exam/${m.id}">🏅 ${escapeHtml(t('module.exam'))} →</a>`}
      </nav>
    </article>`;
  const draw = () => {
    $('#deep-btn').textContent = deep ? `📘 ${t('lesson.deepHide')}` : t('lesson.deep');
    $('#deep-banner').innerHTML = deep ? `<div class="callout analogy deep-banner"><b>🧩 ${escapeHtml(t('lesson.deepTitle'))}</b>${weak ? `<br>${escapeHtml(t('lesson.deepRecommended'))}` : ''}</div>` : '';
    mountRich($('#lesson-body'), L(deep ? l.deep : l.body), m);
    if (deep) {
      (state.lessons[id] ||= {}).deep = Date.now();
      announceBadges(awardBadges(course, state));
      persist();
    }
  };
  $('#deep-btn').addEventListener('click', () => {
    deep = !deep;
    draw();
    $('#lesson-body').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#mark-done')?.addEventListener('click', () => {
    finishLesson(id);
    viewLesson(id, params);
  });
  draw();
}

function finishLesson(id) {
  const first = !state.lessons[id]?.done;
  (state.lessons[id] ||= {}).done ||= Date.now();
  if (first) {
    state.xp += 20;
    toast('+20 XP 📘');
  }
  announceBadges(awardBadges(course, state));
  persist();
}

// ------------------------------------------------------------------ quiz sessions

function startSession(kind, arg) {
  let ids = [];
  let title = '';
  let back = '#/home';
  if (kind === 'lesson') {
    const l = course.lessons.get(arg);
    if (!l) return notFound();
    ids = lessonQuiz(course, arg);
    title = t('quiz.lessonQuiz', { title: L(l.title) });
    back = `#/lesson/${arg}`;
  } else if (kind === 'exam') {
    const m = moduleById(arg);
    if (!m) return notFound();
    ids = examSet(course, arg);
    title = t('quiz.exam', { title: L(m.title) });
    back = `#/module/${arg}`;
  } else if (kind === 'final') {
    ids = finalSet(course);
    title = t('quiz.finalExam');
    back = '#/path';
  } else if (kind === 'practice') {
    if (!course.skills.has(arg)) return notFound();
    ids = practiceSet(course, state, arg);
    title = t('quiz.practiceTitle', { skill: skillName(arg) });
    back = '#/weak';
  } else if (kind === 'review') {
    ids = reviewSet(course, state);
    title = t('quiz.reviewTitle');
    back = '#/review';
  } else if (kind === 'mixed') {
    ids = weakSkills(course, state).slice(0, 3).flatMap((w) => practiceSet(course, state, w.id, 3));
    title = t('review.mixed');
    back = '#/weak';
  }
  session = { kind, arg, ids, i: 0, results: [], xp: 0, title, back, key: `${kind}/${arg ?? ''}` };
  if (!ids.length) {
    view().innerHTML = `<div class="card center"><p>${escapeHtml(t('quiz.empty'))}</p><a class="btn" href="${back}">←</a></div>`;
    return;
  }
  drawQuestion();
}

function drawQuestion() {
  const s = session;
  const q = course.questions.get(s.ids[s.i]);
  view().innerHTML = `
    <div class="quiz" style="--accent:${q.module.color}">
      <header class="quiz-head"><div><div class="muted small">${escapeHtml(s.title)}</div><div class="quiz-progress-label">${escapeHtml(t('quiz.progress', { i: s.i + 1, n: s.ids.length }))} · <span class="muted">${escapeHtml(skillName(q.skill))}</span></div></div>
        <button type="button" class="btn small ghost" id="quit">✕ ${escapeHtml(t('quiz.quit'))}</button></header>
      <div class="quiz-bar"><i style="width:${pct(s.i / s.ids.length)}%"></i></div>
      <div class="question card" id="question"></div>
      <div class="quiz-next" id="next"></div>
    </div>`;
  $('#quit').addEventListener('click', () => {
    if (!s.results.length || confirm(t('quiz.quitConfirm'))) {
      session = null;
      location.hash = s.back;
    }
  });
  renderQuestion($('#question'), q, {
    lang, t,
    onAnswer: (ok) => {
      const xp = record(course, state, q.id, ok);
      s.xp += xp;
      s.results.push({ id: q.id, ok });
      persist();
      if (ok) toast(`+${xp} XP`, 'ok');
      const last = s.i === s.ids.length - 1;
      $('#next').innerHTML = `<button type="button" class="btn big" id="next-btn">${escapeHtml(last ? t('quiz.finish') : t('quiz.next'))}</button>`;
      const btn = $('#next-btn');
      btn.focus({ preventScroll: true });
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      btn.addEventListener('click', () => {
        if (last) finishSession();
        else {
          s.i++;
          drawQuestion();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    },
  });
}

function finishSession() {
  const s = session;
  const ok = s.results.filter((r) => r.ok).length;
  const n = s.results.length;
  const score = ok / n;
  if (s.kind === 'lesson') finishLesson(s.arg);
  if (s.kind === 'exam' || s.kind === 'final') {
    const key = s.kind === 'final' ? 'final' : s.arg;
    (state.exams[key] ||= []).push({ score: ok, total: n, ts: Date.now() });
    if (score >= PASS) {
      state.xp += 50;
      s.xp += 50;
    }
  }
  const badges = awardBadges(course, state, { perfect: ok === n && n >= 3, review: s.kind === 'review' });
  persist();
  if (score >= PASS) confetti();
  const skills = sessionSkills(course, s.results);
  const toWork = skills.filter((x) => x.ok < x.n || ['weak', 'fragile'].includes(skillState(state, x.id).status));
  const verdict = ok === n ? t('quiz.perfect') : score >= PASS ? t('quiz.good') : score >= 0.5 ? t('quiz.medium') : t('quiz.low');
  const examLine = s.kind === 'exam' || s.kind === 'final' ? `<p class="exam-verdict ${score >= PASS ? 'ok' : 'ko'}">${escapeHtml(score >= PASS ? t('quiz.examPassed') : t('quiz.examFailed'))}</p>` : '';
  view().innerHTML = `
    <div class="result card">
      <h1>${escapeHtml(t('quiz.result'))}</h1>
      <div class="score-ring ${score >= PASS ? 'ok' : score >= 0.5 ? 'mid' : 'ko'}" style="--p:${pct(score)}"><span>${pct(score)}%</span></div>
      <p class="big-text">${escapeHtml(t('quiz.score', { ok, n }))} · <b>${escapeHtml(t('quiz.xp', { xp: s.xp }))}</b></p>
      <p>${escapeHtml(verdict)}</p>
      ${examLine}
      ${badges.map((b) => `<p class="new-badge">${b.icon} ${escapeHtml(t('quiz.newBadge', { name: L(b.name) }))}</p>`).join('')}
      <h2>${escapeHtml(t('quiz.bySkill'))}</h2>
      <div class="skill-results">${skills.map((x) => `<div class="sk ${x.ok === x.n ? 'ok' : x.ok === 0 ? 'ko' : 'mid'}"><span>${escapeHtml(skillName(x.id))}</span><b>${x.ok}/${x.n}</b></div>`).join('')}</div>
      ${toWork.length ? `<h2>🔧 ${escapeHtml(t('quiz.toWork'))}</h2><div class="to-work">${toWork.map((x) => {
        const lessonId = course.skills.get(x.id)?.lessons[0];
        return `<div class="card rec weak"><div><b>${escapeHtml(skillName(x.id))}</b> <span class="muted small">${escapeHtml(t('weak.mastery'))} ${pct(skillState(state, x.id).mastery)} %</span>
          <div class="rec-actions">${lessonId ? `<a class="btn small ghost" href="#/lesson/${lessonId}?deep=1">🧩 ${escapeHtml(t('quiz.deepLesson'))}</a>` : ''}<a class="btn small" href="#/quiz/practice/${x.id}">🎯 ${escapeHtml(t('quiz.practice'))}</a></div></div></div>`;
      }).join('')}</div>` : ''}
      <div class="result-actions">
        <button class="btn ghost" id="retry">🔁 ${escapeHtml(t('quiz.retry'))}</button>
        <a class="btn ghost" href="${s.back}">${escapeHtml(s.kind === 'lesson' ? t('quiz.backLesson') : s.kind === 'exam' ? t('quiz.backModule') : '←')}</a>
        ${s.kind === 'lesson' ? nextLessonLink(s.arg) : `<a class="btn" href="#/home">${escapeHtml(t('quiz.home'))}</a>`}
      </div>
    </div>`;
  $('#retry').addEventListener('click', () => startSession(s.kind, s.arg));
  session = null;
}

function nextLessonLink(id) {
  const l = course.lessons.get(id);
  const idx = l.module.lessons.findIndex((x) => x.id === id);
  const next = l.module.lessons[idx + 1];
  if (next) return `<a class="btn" href="#/lesson/${next.id}">${escapeHtml(t('lesson.next'))} →</a>`;
  return `<a class="btn" href="#/quiz/exam/${l.module.id}">🏅 ${escapeHtml(t('module.exam'))}</a>`;
}

// ------------------------------------------------------------------ other views

function viewWeak() {
  const weak = weakSkills(course, state);
  view().innerHTML = `
    <h1>🔧 ${escapeHtml(t('weak.title'))}</h1><p class="lead">${escapeHtml(t('weak.intro'))}</p>
    ${weak.length ? `<div class="recs">${weak.map((w) => recCard({ kind: 'weak', skill: w.id, mastery: w.mastery })).join('')}</div>
      <p><a class="btn" href="#/quiz/mixed">🎲 ${escapeHtml(t('review.mixed'))}</a></p>` : `<div class="card center">${escapeHtml(t('weak.none'))}</div>`}
    <h2>${escapeHtml(t('weak.all'))}</h2>
    ${MODULES.map((m) => `<details class="card module-skills" ${weak.some((w) => w.id.startsWith(`${m.id}.`)) ? 'open' : ''}><summary>${m.icon} ${escapeHtml(L(m.title))}</summary><div class="skill-rows">${Object.keys(m.skills).map(skillRow).join('')}</div></details>`).join('')}`;
}

function viewReview() {
  const due = dueCount(course, state);
  const weak = weakSkills(course, state);
  view().innerHTML = `
    <h1>♻️ ${escapeHtml(t('review.title'))}</h1><p class="lead">${escapeHtml(t('review.intro'))}</p>
    <div class="card center">${due ? `<a class="btn big" href="#/quiz/review">${escapeHtml(t('review.start', { n: Math.min(10, due) }))}</a>` : `<p>${escapeHtml(t('review.none'))}</p>`}
    ${weak.length ? `<p><a class="btn ghost" href="#/quiz/mixed">🎲 ${escapeHtml(t('review.mixed'))}</a></p>` : ''}</div>
    <div class="boxes">${[1, 2, 3, 4, 5, 6].map((b) => {
      const n = Object.entries(state.q).filter(([id, e]) => course.questions.has(id) && e.box === b).length;
      return `<div class="box-col"><div class="box-n">${n}</div><div class="muted small">${b === 1 ? '0 j' : `${[0, 0, 1, 3, 7, 16, 35][b]} j`}</div></div>`;
    }).join('')}</div>`;
}

function viewGlossary(params) {
  const cats = [...new Set(GLOSSARY.map((g) => g.cat))];
  let cat = params.get('cat') || '';
  let q = params.get('q') || '';
  view().innerHTML = `
    <h1>📖 ${escapeHtml(t('glossary.title'))}</h1><p class="lead">${escapeHtml(t('glossary.intro'))}</p>
    <div class="glossary-tools"><input type="search" id="g-search" placeholder="${escapeHtml(t('glossary.search'))}" value="${escapeHtml(q)}" aria-label="${escapeHtml(t('glossary.search'))}">
      <div class="chips" id="g-cats"><button class="chip ${cat ? '' : 'on'}" data-cat="">${escapeHtml(t('glossary.all'))}</button>${cats.map((c) => `<button class="chip ${cat === c ? 'on' : ''}" data-cat="${c}">${escapeHtml(t(`cat.${c}`))}</button>`).join('')}</div></div>
    <p class="muted small" id="g-count"></p>
    <div class="glossary" id="g-list"></div>`;
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const draw = () => {
    const nq = norm(q);
    const list = GLOSSARY.filter((g) => (!cat || g.cat === cat) && (!nq || norm(`${g.term.fr} ${g.term.en} ${g.id}`).includes(nq) || norm(L(g.def)).includes(nq)))
      .sort((a, b) => L(a.term).localeCompare(L(b.term), lang));
    $('#g-count').textContent = t('glossary.count', { n: list.length });
    $('#g-list').innerHTML = list.map((g) => `<article class="gloss card" id="g-${g.id}"><h3>${escapeHtml(L(g.term))}${g.term.fr !== g.term.en ? ` <span class="muted small">(${escapeHtml(lang === 'fr' ? g.term.en : g.term.fr)})</span>` : ''}</h3><span class="chip">${escapeHtml(t(`cat.${g.cat}`))}</span><p>${L(g.def)}</p>${g.example ? `<p class="muted"><em>${escapeHtml(t('glossary.example'))} :</em> ${L(g.example)}</p>` : ''}</article>`).join('');
    if (list.length <= 3) {
      for (const g of list) state.glossarySeen[g.id] ||= Date.now();
      announceBadges(awardBadges(course, state));
      persist();
    }
  };
  $('#g-search').addEventListener('input', (e) => { q = e.target.value; draw(); });
  $('#g-cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    $('#g-cats').querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
    draw();
  });
  $('#g-list').addEventListener('click', (e) => {
    const card = e.target.closest('.gloss');
    if (!card) return;
    state.glossarySeen[card.id.slice(2)] ||= Date.now();
    announceBadges(awardBadges(course, state));
    persist();
  });
  draw();
}

const CHEATS = [
  ['📂', { fr: 'Lister le dossier', en: 'List the folder' }, 'dir', 'Get-ChildItem (ls, dir)', 'ls'],
  ['🚪', { fr: 'Entrer dans un dossier', en: 'Enter a folder' }, 'cd web', 'Set-Location web (cd web)', 'cd web'],
  ['⬆️', { fr: 'Remonter d’un niveau', en: 'Go up one level' }, 'cd ..', 'cd ..', 'cd ..'],
  ['📍', { fr: 'Où suis-je ?', en: 'Where am I?' }, 'cd', 'Get-Location (pwd)', 'pwd'],
  ['📄', { fr: 'Afficher un fichier', en: 'Show a file' }, 'type README.md', 'Get-Content README.md (cat)', 'cat README.md'],
  ['📁', { fr: 'Créer un dossier', en: 'Create a folder' }, 'mkdir essais', 'New-Item -ItemType Directory essais (mkdir)', 'mkdir essais'],
  ['🧹', { fr: 'Effacer l’écran', en: 'Clear the screen' }, 'cls', 'Clear-Host (cls)', 'clear'],
  ['🔑', { fr: 'Lire une variable', en: 'Read a variable' }, 'echo %PATH%', '$env:PATH', 'echo $PATH'],
  ['✏️', { fr: 'Définir une variable', en: 'Set a variable' }, 'set NOM=valeur', '$env:NOM = "valeur"', 'export NOM=valeur'],
  ['🔎', { fr: 'Où est ce programme ?', en: 'Where is this program?' }, 'where node', 'Get-Command node', 'which node'],
  ['❓', { fr: 'Aide', en: 'Help' }, 'help dir', 'Get-Help Get-ChildItem', 'man ls'],
];

function viewLab(params) {
  const shell = ['cmd', 'powershell', 'bash'].includes(params.get('shell')) ? params.get('shell') : 'powershell';
  view().innerHTML = `
    <h1>🧪 ${escapeHtml(t('lab.title'))}</h1><p class="lead">${escapeHtml(t('lab.intro'))}</p>
    <section><h2>⌨️ ${escapeHtml(t('lab.terminal'))}</h2><p class="muted">${escapeHtml(t('lab.terminalSub'))}</p>
      <div class="tabs">${['cmd', 'powershell', 'bash'].map((s) => `<a class="tab ${s === shell ? 'on' : ''}" href="#/lab?shell=${s}">${{ cmd: 'cmd', powershell: 'PowerShell', bash: 'bash' }[s]}</a>`).join('')}</div>
      <div id="lab-term"></div></section>
    <section><h2>📋 ${escapeHtml(t('lab.cheats'))}</h2>
      <div class="table-wrap"><table class="cheats"><thead><tr><th></th><th>cmd</th><th>PowerShell</th><th>bash</th></tr></thead><tbody>
      ${CHEATS.map(([i, what, c, p, b]) => `<tr><th>${i} ${escapeHtml(L(what))}</th><td><code>${escapeHtml(c)}</code></td><td><code>${escapeHtml(p)}</code></td><td><code>${escapeHtml(b)}</code></td></tr>`).join('')}
      </tbody></table></div></section>
    <section><h2>🟨 ${escapeHtml(t('lab.js'))}</h2><p class="muted">${escapeHtml(t('lab.jsSub'))}</p><div id="lab-js"></div></section>`;
  mountTerminal($('#lab-term'), { shell, lang, t });
  mountPlayground($('#lab-js'), lang === 'fr'
    ? "// Essaie : modifie les valeurs puis clique sur Exécuter\nconst pieces = [\n  { nom: 'carter', volume: 1250 },\n  { nom: 'support', volume: 430 },\n];\nconst total = pieces.reduce((somme, p) => somme + p.volume, 0);\nconsole.log(`Volume total : ${total} cm³`);\nconsole.log(pieces.map((p) => p.nom.toUpperCase()));"
    : "// Try: change the values then click Run\nconst parts = [\n  { name: 'housing', volume: 1250 },\n  { name: 'bracket', volume: 430 },\n];\nconst total = parts.reduce((sum, p) => sum + p.volume, 0);\nconsole.log(`Total volume: ${total} cm³`);\nconsole.log(parts.map((p) => p.name.toUpperCase()));", t);
}

function viewProgress() {
  const lv = levelOf(state.xp);
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = today(Date.now() - i * 86400000);
    days.push([d, state.days[d] || 0]);
  }
  const maxDay = Math.max(1, ...days.map((d) => d[1]));
  const exams = Object.entries(state.exams).flatMap(([k, list]) => list.map((e) => ({ k, ...e }))).sort((a, b) => b.ts - a.ts).slice(0, 12);
  view().innerHTML = `
    <h1>📈 ${escapeHtml(t('progress.title'))}</h1>
    <section class="card level-card"><div class="ring" style="--p:${pct(lv.progress)}"><span>${lv.level}</span></div>
      <div><h2>${escapeHtml(t('progress.level', { n: lv.level, rank: L(lv.rank) }))}</h2><p>${escapeHtml(t('progress.xp', { xp: state.xp }))} · <span class="muted">${escapeHtml(t('progress.toNext', { n: lv.to - state.xp }))}</span></p></div></section>
    <section><h2>${escapeHtml(t('progress.activity'))}</h2><div class="heat">${days.map(([d, x]) => `<i title="${d} : ${x} XP" style="--v:${x ? 0.25 + 0.75 * (x / maxDay) : 0}"></i>`).join('')}</div></section>
    <section><h2>${escapeHtml(t('progress.skills'))}</h2>${MODULES.map((m) => `<details class="card module-skills"><summary>${m.icon} ${escapeHtml(L(m.title))} <span class="muted small">${moduleProgress(state, m).done}/${m.lessons.length}</span></summary><div class="skill-rows">${Object.keys(m.skills).map(skillRow).join('')}</div></details>`).join('')}</section>
    <section><h2>${escapeHtml(t('progress.exams'))}</h2>${exams.length ? `<ul class="plain exams">${exams.map((e) => `<li>${e.score / e.total >= PASS ? '🏅' : '•'} <b>${escapeHtml(e.k === 'final' ? t('path.final') : L(moduleById(e.k)?.title))}</b> — ${pct(e.score / e.total)} % <span class="muted small">${new Date(e.ts).toLocaleDateString(lang)}</span></li>`).join('')}</ul>` : `<p class="muted">${escapeHtml(t('progress.noExam'))}</p>`}</section>
    <section><h2>${escapeHtml(t('home.badges'))}</h2>${badgesHtml()}</section>
    <section class="card"><h2>💾 ${escapeHtml(t('progress.save'))}</h2><p>${escapeHtml(t('progress.saveIntro'))}</p>
      <div class="row"><button class="btn" id="export">${escapeHtml(t('progress.export'))}</button>
      <label class="btn ghost">${escapeHtml(t('progress.import'))}<input type="file" id="import" accept=".json,application/json" hidden></label>
      <button class="btn danger" id="reset">${escapeHtml(t('progress.reset'))}</button></div></section>`;
  $('#export').addEventListener('click', () => {
    const blob = new Blob([exportFile(state)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `code-quest-3d-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#import').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state = importFile(await file.text());
      state.lang = lang;
      persist();
      toast(escapeHtml(t('progress.imported')), 'ok');
      viewProgress();
    } catch (err) {
      toast(escapeHtml(t('progress.importError', { msg: err.message })), 'ko');
    }
  });
  $('#reset').addEventListener('click', () => {
    if (!confirm(t('progress.resetConfirm'))) return;
    state = emptyState();
    state.lang = lang;
    persist();
    viewProgress();
  });
}

// ------------------------------------------------------------------ account

function accountError(err) {
  return t(cloudErrorKey(err));
}

function viewAccount() {
  const box = (html) => { view().innerHTML = `<h1>👤 ${escapeHtml(t('acc.title'))}</h1>${html}`; };
  if (!cloudConfigured()) {
    box(`<div class="card"><p>${escapeHtml(t('acc.off'))}</p><p class="muted small">${escapeHtml(t('acc.offAdmin'))}</p><a class="btn ghost" href="#/progress">💾 ${escapeHtml(t('progress.save'))}</a></div>`);
    return;
  }
  if (!api) {
    box(`<div class="card center">${syncState.kind === 'error' ? `<p class="warn-box">${escapeHtml(t('acc.err.network'))}</p><button class="btn" id="acc-retry">${escapeHtml(t('acc.retry'))}</button>` : `<p class="muted">${escapeHtml(t('misc.loading'))}</p>`}</div>`);
    $('#acc-retry')?.addEventListener('click', () => { startCloud(); viewAccount(); });
    return;
  }
  if (account) {
    const st = syncState;
    const when = st.at ? new Date(st.at).toLocaleString(lang) : '';
    box(`<div class="card account-card">
        <p class="acc-who">✅ ${escapeHtml(t('acc.signedAs'))} <b>${escapeHtml(account.email || account.displayName || '')}</b></p>
        <p class="acc-sync status-${st.kind}">${escapeHtml(t(`acc.status.${st.kind}`))}${when && st.kind === 'synced' ? ` · ${escapeHtml(when)}` : ''}${st.kind === 'error' && st.message ? `<br><span class="small">${escapeHtml(st.message)}</span>` : ''}</p>
        <p class="muted">${escapeHtml(t('acc.howSync'))}</p>
        <div class="row"><button class="btn" id="acc-sync">☁️ ${escapeHtml(t('acc.syncNow'))}</button><button class="btn ghost" id="acc-out">${escapeHtml(t('acc.signOut'))}</button></div>
      </div>
      <details class="card danger-zone"><summary>${escapeHtml(t('acc.delete'))}</summary><p>${escapeHtml(t('acc.deleteText'))}</p><button class="btn danger" id="acc-del">${escapeHtml(t('acc.deleteBtn'))}</button></details>`);
    $('#acc-sync').addEventListener('click', () => sync.push().then(() => toast(escapeHtml(t('acc.status.synced')), 'ok')).catch((e) => toast(escapeHtml(accountError(e)), 'ko')).finally(() => viewAccount()));
    $('#acc-out').addEventListener('click', async () => {
      await sync.flush();
      const keep = confirm(t('acc.signOutKeep'));
      await api.signOut();
      if (!keep) {
        state = emptyState();
        state.lang = lang;
        storageOk = save(state);
        renderTopbar();
      }
      viewAccount();
    });
    $('#acc-del').addEventListener('click', async () => {
      if (!confirm(t('acc.deleteConfirm'))) return;
      try {
        sync.stop();
        await api.deleteAccount();
        toast(escapeHtml(t('acc.deleted')), 'ok');
      } catch (e) {
        toast(escapeHtml(accountError(e)), 'ko');
        if (api.user()) sync.start(api.user().uid).catch(() => {});
      }
      viewAccount();
    });
    return;
  }
  box(`<p class="lead">${escapeHtml(t('acc.intro'))}</p>
    <div class="card account-form">
      <div class="tabs"><button type="button" class="tab on" data-mode="in">${escapeHtml(t('acc.signIn'))}</button><button type="button" class="tab" data-mode="up">${escapeHtml(t('acc.signUp'))}</button></div>
      <form id="acc-form" novalidate>
        <label>${escapeHtml(t('acc.email'))}<input type="email" name="email" autocomplete="email" required></label>
        <label>${escapeHtml(t('acc.password'))}<input type="password" name="password" autocomplete="current-password" minlength="6" required></label>
        <p class="muted small acc-pw-hint" hidden>${escapeHtml(t('acc.pwHint'))}</p>
        <p class="acc-msg" aria-live="polite"></p>
        <div class="row"><button class="btn" id="acc-submit">${escapeHtml(t('acc.signIn'))}</button><button type="button" class="btn ghost" id="acc-reset">${escapeHtml(t('acc.forgot'))}</button></div>
      </form>
      <div class="acc-or"><span>${escapeHtml(t('acc.or'))}</span></div>
      <button type="button" class="btn ghost google" id="acc-google">${escapeHtml(t('acc.google'))}</button>
      <p class="muted small">${escapeHtml(t('acc.privacy'))}</p>
    </div>`);
  let mode = 'in';
  const form = $('#acc-form');
  const msg = form.querySelector('.acc-msg');
  const say = (text, ok = false) => { msg.textContent = text; msg.className = `acc-msg ${ok ? 'ok' : 'ko'}`; };
  view().querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    view().querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('on', x === b));
    $('#acc-submit').textContent = t(mode === 'in' ? 'acc.signIn' : 'acc.signUp');
    form.password.autocomplete = mode === 'in' ? 'current-password' : 'new-password';
    form.querySelector('.acc-pw-hint').hidden = mode === 'in';
    $('#acc-reset').hidden = mode === 'up';
    say('');
  }));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!email || !password) return say(t('acc.err.fill'));
    $('#acc-submit').disabled = true;
    try {
      if (mode === 'up') await api.signUp(email, password);
      else await api.signIn(email, password);
    } catch (err) {
      say(accountError(err));
    } finally {
      const b = $('#acc-submit');
      if (b) b.disabled = false;
    }
  });
  $('#acc-reset').addEventListener('click', async () => {
    const email = form.email.value.trim();
    if (!email) return say(t('acc.err.email'));
    try {
      await api.resetPassword(email);
      say(t('acc.resetSent'), true);
    } catch (err) {
      say(accountError(err));
    }
  });
  $('#acc-google').addEventListener('click', async () => {
    try {
      await api.signInGoogle();
    } catch (err) {
      say(accountError(err));
    }
  });
}

function setSync(kind, info = {}) {
  syncState = { kind, ...info };
  renderTopbar();
  if (location.hash.startsWith('#/account')) {
    const el = view().querySelector('.acc-sync');
    if (el) viewAccount();
  }
}

function startCloud() {
  if (!cloudConfigured()) return;
  setSync('loading');
  cloud().then((c) => {
    api = c;
    sync = new Sync({
      backend: c.backend,
      course,
      getState: () => state,
      setState: (s) => {
        state = s;
        lang = state.lang || lang;
        t = translator(lang);
        storageOk = save(state);
        renderChrome();
        if (!session) route();
      },
      status: setSync,
    });
    c.onUser(async (u) => {
      const was = account;
      account = u;
      if (!u) {
        sync.stop();
        setSync('out');
        if (location.hash.startsWith('#/account')) viewAccount();
        return;
      }
      if (was?.uid === u.uid) return;
      if (location.hash.startsWith('#/account')) viewAccount();
      try {
        const outcome = await sync.start(u.uid);
        if (outcome === 'merged') toast(`☁️ ${escapeHtml(t('acc.merged'))}`, 'ok');
        else if (outcome === 'pulled') toast(`☁️ ${escapeHtml(t('acc.pulled'))}`, 'ok');
        else if (outcome === 'pushed') toast(`☁️ ${escapeHtml(t('acc.pushed'))}`, 'ok');
      } catch (err) {
        toast(escapeHtml(accountError(err)), 'ko');
      }
      if (location.hash.startsWith('#/account')) viewAccount();
    });
  }).catch(() => {
    setSync('error');
    if (location.hash.startsWith('#/account')) viewAccount();
  });
}

function notFound() {
  view().innerHTML = `<div class="card center"><p>${escapeHtml(t('misc.notFound'))}</p><a class="btn" href="#/home">${escapeHtml(t('nav.home'))}</a></div>`;
}

// ------------------------------------------------------------------ router

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  const [a, b, c] = path.split('/');
  document.querySelectorAll('#nav a').forEach((x) => x.classList.toggle('on', x.dataset.route === (a || 'home') || (a === 'module' || a === 'lesson') && x.dataset.route === 'path'));
  document.body.classList.remove('nav-open');
  if (pop) pop.hidden = true;
  if (session && !(a === 'quiz' && session.key === `${b}/${c ?? ''}`)) session = null;
  switch (a || 'home') {
    case 'home': viewHome(); break;
    case 'path': viewPath(); break;
    case 'module': viewModule(b); break;
    case 'lesson': viewLesson(b, params); break;
    case 'quiz': startSession(b, c); break;
    case 'weak': viewWeak(); break;
    case 'review': viewReview(); break;
    case 'glossary': viewGlossary(params); break;
    case 'lab': viewLab(params); break;
    case 'progress': viewProgress(); break;
    case 'account': viewAccount(); break;
    default: notFound();
  }
  if (!(a === 'quiz')) window.scrollTo(0, 0);
  view().focus({ preventScroll: true });
}

$('#lang-btn').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  state.lang = lang;
  t = translator(lang);
  persist();
  renderChrome();
  if (session) drawQuestion();
  else route();
});
$('#theme-btn').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
  state.theme = dark ? 'light' : 'dark';
  applyTheme();
  persist();
});
$('#menu-btn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
window.addEventListener('hashchange', route);
window.addEventListener('online', () => sync?.flush());
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') sync?.flush();
  else sync?.refresh();
});
window.addEventListener('storage', (e) => { if (e.key?.startsWith('codequest3d')) { state = load(); renderTopbar(); } });

applyTheme();
renderChrome();
announceBadges(awardBadges(course, state));
route();
startCloud();
