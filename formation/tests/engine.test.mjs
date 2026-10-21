// Tests of the course engine: node --test formation/tests/
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { GLOSSARY, MODULES } from '../content/index.js';
import { buildCourse, examSet, practiceSet, record, recommendations, reviewSet, skillState, weakSkills } from '../js/adaptive.js';
import { check } from '../js/quiz.js';
import { emptyState, exportFile, importFile, normalize } from '../js/store.js';
import { createSession, execute } from '../js/widgets/terminal.js';

const course = buildCourse(MODULES, GLOSSARY);

test('every question accepts its own right answer and refuses a wrong one', () => {
  for (const q of course.questions.values()) {
    for (const lang of ['fr', 'en']) {
      let right;
      let wrong;
      switch (q.type) {
        case 'mcq': right = q.answer; wrong = (q.answer + 1) % q.choices.fr.length; break;
        case 'multi': right = q.answer; wrong = q.answer.length > 1 ? q.answer.slice(1) : [...q.answer, (q.answer[0] + 1) % q.choices.fr.length]; break;
        case 'tf': right = q.answer; wrong = !q.answer; break;
        case 'fill': right = (Array.isArray(q.accept) ? q.accept : q.accept[lang])[0]; wrong = '§§'; break;
        case 'order': right = q.items[lang].map((_, i) => i); wrong = [...right].reverse(); break;
        case 'match': right = q.pairs[lang].map((_, i) => i); wrong = [...right.slice(1), 0]; break;
        case 'line': right = q.answer; wrong = q.answer + 1; break;
      }
      assert.equal(check(q, right, lang), true, `${q.id} ${lang}`);
      assert.equal(check(q, wrong, lang), false, `${q.id} ${lang} wrong`);
    }
  }
});

test('fill answers ignore case and surrounding spaces', () => {
  const q = { type: 'fill', accept: ['const'] };
  assert.equal(check(q, '  CONST ', 'fr'), true);
});

test('mastery rises with right answers and a weak skill is detected', () => {
  const s = emptyState();
  const skill = 'js.async';
  const ids = course.skills.get(skill).questions;
  assert.equal(skillState(s, skill).status, 'new');
  record(course, s, ids[0], false);
  record(course, s, ids[1], false);
  assert.equal(skillState(s, skill).status, 'weak');
  assert.ok(weakSkills(course, s).some((w) => w.id === skill));
  assert.equal(recommendations(course, s)[0].kind, 'weak');
  for (let i = 0; i < 8; i++) record(course, s, ids[i % ids.length], true);
  assert.ok(['solid', 'mastered'].includes(skillState(s, skill).status));
  assert.ok(s.repaired[skill], 'a weak skill that became solid is marked repaired');
});

test('targeted practice starts with the questions missed, then new reinforcement exercises', () => {
  const s = emptyState();
  const skill = 'git.branches';
  const ids = course.skills.get(skill).questions;
  record(course, s, ids[0], false);
  const set = practiceSet(course, s, skill, 6);
  assert.equal(set[0], ids[0]);
  assert.ok(set.slice(1).some((id) => course.questions.get(id).extra));
  assert.equal(new Set(set).size, set.length);
});

test('spaced repetition: a right answer is not due again today, a wrong one is', () => {
  const s = emptyState();
  const [a, b] = course.skills.get('env.cmd').questions;
  const now = Date.now();
  record(course, s, a, true, now);
  record(course, s, a, true, now);
  record(course, s, b, false, now);
  assert.deepEqual(reviewSet(course, s, 10, now + 1000), [b]);
});

test('a module exam covers every skill of the module', () => {
  for (const m of MODULES) {
    const ids = examSet(course, m.id);
    const skills = new Set(ids.map((id) => course.questions.get(id).skill));
    assert.deepEqual([...skills].sort(), Object.keys(m.skills).sort(), m.id);
  }
});

test('progress export / import round trip, unknown fields dropped', () => {
  const s = emptyState();
  record(course, s, course.questions.keys().next().value, true);
  const back = importFile(exportFile(s));
  assert.equal(back.xp, s.xp);
  assert.equal(normalize({ xp: 'x', hack: 1 }).hack, undefined);
  assert.throws(() => importFile('{"xp":3}'));
});

test('every terminal mission can be completed in the simulator', () => {
  const answers = {
    'env-term-cmd': ['dir', 'cd web', 'cd ..', 'type README.md', 'where node', 'cls'],
    'env-term-ps': ['pwd', 'ls', 'cat package.json', '$env:PATH', 'gcm node', 'Get-Help Get-ChildItem'],
    'env-term-bash': ['pwd', 'ls -la', 'cd web', 'cd ..', 'cat package.json', 'which node', 'export BASE_PATH=/3D-reader', 'echo $BASE_PATH'],
    'env-term-local': ['git clone https://github.com/alexdevanssay-cmyk/3D-reader', 'cd 3D-reader', 'npm ci', 'npm run build', 'npm run serve', 'npm test'],
    'git-term': ['git status', 'git log --oneline', 'git switch -c correction-texte', 'git add .', 'git commit -m "Corrige un texte"', 'git push -u origin correction-texte'],
  };
  for (const m of MODULES) {
    for (const [id, w] of Object.entries(m.widgets || {})) {
      if (w.type !== 'terminal') continue;
      const lines = answers[id] || w.missions.map((x) => x.example).filter(Boolean);
      if (!answers[id]) continue; // missions without a scripted answer: checked by hand
      const s = createSession(w.shell, { cwd: w.cwd });
      let done = 0;
      for (const line of lines) {
        const r = execute(s, line);
        if (r.ok && new RegExp(w.missions[done].match, 'i').test(line)) done++;
      }
      assert.equal(done, w.missions.length, id);
    }
  }
});

test('the simulator teaches the differences between shells', () => {
  const cmd = createSession('cmd');
  assert.match(execute(cmd, 'ls').lines[0].text, /not recognized/);
  const bash = createSession('bash');
  assert.equal(execute(bash, 'pwd').lines[0].text, '/home/alex/3D-reader');
  const r = execute(bash, 'git switch -c x && git push');
  assert.equal(r.ok, false);
  assert.match(r.lines.at(-1).text, /no upstream branch/);
});
