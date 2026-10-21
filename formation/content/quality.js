// Module 10 — Tests, qualité et travail avec Claude Code.
export default {
  id: 'quality',
  order: 10,
  icon: '🧪',
  color: '#2e9e6b',
  title: { fr: 'Tests, qualité et travail avec Claude Code', en: 'Tests, quality and working with Claude Code' },
  summary: {
    fr: 'Comprendre les tests unitaires et de bout en bout, lire une CI rouge, relire un diff et piloter Claude Code proprement et en toute confidentialité.',
    en: 'Understand unit and end-to-end tests, read a red CI run, review a diff and steer Claude Code cleanly and confidentially.',
  },
  skills: {
    'quality.why': { fr: 'Pourquoi et quoi tester', en: 'Why and what to test' },
    'quality.unit': { fr: 'Lire un test unitaire (node:test, pytest)', en: 'Reading a unit test (node:test, pytest)' },
    'quality.e2e': { fr: 'Tests de bout en bout (Playwright)', en: 'End-to-end tests (Playwright)' },
    'quality.ci': { fr: 'CI rouge / verte et tests instables', en: 'Red / green CI and flaky tests' },
    'quality.review': { fr: 'Relecture de code et diff', en: 'Code review and diffs' },
    'quality.claude': { fr: 'Travailler avec Claude Code', en: 'Working with Claude Code' },
  },
  widgets: {
    'quality-term-tests': {
      type: 'terminal',
      shell: 'bash',
      intro: {
        fr: 'Tu es dans le dépôt 3D-reader. Lance les tests comme le fait la CI, dans l’ordre.',
        en: 'You are in the 3D-reader repository. Run the tests the way CI does, in order.',
      },
      missions: [
        { match: '^git status\\b', fr: 'Vérifie d’abord l’état du dépôt (quelle branche, fichiers modifiés ?).', en: 'First check the state of the repository (which branch, modified files?).' },
        { match: '^npm ci\\b|^npm install\\b', fr: 'Installe les dépendances exactes du projet (comme la CI : npm ci).', en: 'Install the exact dependencies of the project (like CI: npm ci).' },
        { match: '^npm test\\b|^npm run test\\b', fr: 'Lance les tests unitaires du moteur JS.', en: 'Run the unit tests of the JS engine.' },
        { match: '^npm run build\\b', fr: 'Construis le site statique (dist/).', en: 'Build the static site (dist/).' },
        { match: '^pytest\\b', fr: 'Lance aussi les tests Python du moteur de référence.', en: 'Also run the Python tests of the reference engine.' },
      ],
    },
    'quality-flow-ci': {
      type: 'flow',
      actors: [
        { fr: 'Toi / Claude', en: 'You / Claude' },
        { fr: 'GitHub', en: 'GitHub' },
        { fr: 'Runner CI', en: 'CI runner' },
        { fr: 'GitHub Pages', en: 'GitHub Pages' },
      ],
      steps: [
        { from: 0, to: 1, label: { fr: 'git push (branche)', en: 'git push (branch)' }, detail: { fr: 'Les commits partent sur GitHub. L’événement <code>push</code> déclenche le workflow <code>ci.yml</code>.', en: 'The commits go to GitHub. The <code>push</code> event triggers the <code>ci.yml</code> workflow.' } },
        { from: 1, to: 2, label: { fr: 'Lance le job « test »', en: 'Starts the "test" job' }, detail: { fr: 'Une machine Ubuntu neuve est prêtée : elle récupère le code (<code>actions/checkout</code>), installe Python et Node.', en: 'A fresh Ubuntu machine is lent: it fetches the code (<code>actions/checkout</code>), installs Python and Node.' } },
        { from: 2, to: 2, label: { fr: 'pytest → npm test → build → e2e', en: 'pytest → npm test → build → e2e' }, detail: { fr: 'Chaque étape doit réussir. Au premier échec, le job s’arrête et devient <strong>rouge</strong>.', en: 'Every step must succeed. At the first failure the job stops and turns <strong>red</strong>.' } },
        { from: 2, to: 1, label: { fr: 'Résultat ✔ ou ✘', en: 'Result ✔ or ✘' }, detail: { fr: 'La coche verte ou la croix rouge s’affiche à côté du commit et dans la PR.', en: 'The green tick or red cross shows next to the commit and in the PR.' } },
        { from: 1, to: 3, label: { fr: 'Si main est verte : déploiement', en: 'If main is green: deploy' }, detail: { fr: '<code>pages.yml</code> ne publie un commit de main que si la CI est passée dessus : un code cassé n’est jamais mis en ligne.', en: '<code>pages.yml</code> only publishes a commit of main once CI passed on it: broken code is never put online.' } },
      ],
    },
  },
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'quality-1',
      title: { fr: 'Pourquoi tester ? Le contrôle qualité du code', en: 'Why test? Quality control for code' },
      skills: ['quality.why'],
      minutes: 9,
      body: {
        fr: `<h3>Un test, c’est un contrôle qualité automatique</h3>
<p>En fonderie, tu ne livres pas une pièce sans la contrôler : cotes au pied à coulisse, contrôle tridimensionnel, radiographie pour les porosités. En programmation, c’est pareil : un <span class="term" data-term="test-unitaire">test</span> est un petit programme qui vérifie qu’un autre programme donne le bon résultat.</p>
<p>La différence ? Le contrôle est <strong>automatique</strong> et <strong>répétable</strong>. On l’écrit une fois, puis la machine le relance des centaines de fois, à chaque modification. 3D Reader en compte plus de 790 côté moteur JavaScript !</p>
<div class="callout analogy">Imagine un gabarit de contrôle posé à côté de la ligne de production : chaque pièce passe dedans. Si une cote dérive, l’alarme sonne tout de suite, pas trois semaines plus tard chez le client.</div>
<h3>Les trois ingrédients d’un test</h3>
<ol>
<li><strong>Préparer</strong> : on fabrique une entrée connue (par exemple un cube de 10 × 20 × 30 mm).</li>
<li><strong>Agir</strong> : on appelle la fonction à vérifier (calculer le volume).</li>
<li><strong>Vérifier</strong> : une <span class="term" data-term="assertion">assertion</span> compare le résultat obtenu avec le résultat attendu (6000 mm³).</li>
</ol>
~~~js run
// Une fonction à tester
function volumePave(l, w, h) {
  return l * w * h;
}
// Un mini-test « fait main »
const obtenu = volumePave(10, 20, 30);
const attendu = 6000;
if (obtenu === attendu) console.log('✔ test réussi');
else console.log('✘ échec : obtenu', obtenu, 'attendu', attendu);
~~~
<h3>Qu’est-ce qu’on teste ?</h3>
<ul>
<li><strong>Le cas normal</strong> : une pièce ordinaire, des valeurs habituelles.</li>
<li><strong>Les <span class="term" data-term="cas-limite">cas limites</span></strong> : liste vide, volume nul, maillage ouvert, fichier en mètres au lieu de millimètres, 2 millions de triangles… C’est là que les bugs se cachent.</li>
<li><strong>Les erreurs attendues</strong> : un fichier vide doit produire un message clair, pas un plantage.</li>
<li><strong>Les <span class="term" data-term="regression">régressions</span></strong> : chaque bug corrigé reçoit son test, pour qu’il ne revienne jamais.</li>
</ul>
<div class="callout project">Dans 3D Reader, le moteur Python (<code>reader3d/</code>) est la <strong>référence</strong>. Un script (<code>tests/make_fixtures.py</code>) fabrique des pièces dont on connaît le volume exact (un bloc percé, une sphère, un tore) et note les résultats Python. Les tests JS vérifient ensuite que le moteur du navigateur trouve <em>les mêmes chiffres</em>.</div>
<h3>Les familles de tests</h3>
<table><thead><tr><th>Type</th><th>Ce qu’il vérifie</th><th>Vitesse</th></tr></thead>
<tbody>
<tr><td>Unitaire</td><td>une fonction seule (ex. <code>summarize</code>)</td><td>millisecondes</td></tr>
<tr><td>Intégration</td><td>plusieurs morceaux ensemble (serveur + analyse)</td><td>secondes</td></tr>
<tr><td>Bout en bout (e2e)</td><td>le site complet dans un vrai navigateur</td><td>dizaines de secondes</td></tr>
</tbody></table>
<div class="callout tip">Un test qui passe ne prouve pas que tout est parfait : il prouve que <em>ce cas-là</em> marche. Plus les cas sont variés, plus la confiance est grande — comme un plan de contrôle bien conçu.</div>
<div class="callout warn">Données confidentielles : les tests de 3D Reader utilisent uniquement des <strong>données synthétiques</strong> (pièces inventées, valeurs fictives), jamais les classeurs de chiffrage réels.</div>`,
        en: `<h3>A test is automatic quality control</h3>
<p>In a foundry you never ship a casting without checking it: dimensions with a caliper, CMM inspection, X-ray for porosity. Programming is the same: a <span class="term" data-term="test-unitaire">test</span> is a small program that checks that another program gives the right result.</p>
<p>The difference? The check is <strong>automatic</strong> and <strong>repeatable</strong>. You write it once, then the machine runs it hundreds of times, after every change. 3D Reader has more than 790 of them for its JavaScript engine!</p>
<div class="callout analogy">Picture an inspection gauge next to the production line: every part goes through it. If a dimension drifts, the alarm rings right away, not three weeks later at the customer's.</div>
<h3>The three ingredients of a test</h3>
<ol>
<li><strong>Arrange</strong>: build a known input (for example a 10 × 20 × 30 mm box).</li>
<li><strong>Act</strong>: call the function under test (compute the volume).</li>
<li><strong>Assert</strong>: an <span class="term" data-term="assertion">assertion</span> compares the actual result with the expected one (6000 mm³).</li>
</ol>
~~~js run
// A function to test
function boxVolume(l, w, h) {
  return l * w * h;
}
// A home-made mini test
const actual = boxVolume(10, 20, 30);
const expected = 6000;
if (actual === expected) console.log('✔ test passed');
else console.log('✘ failure: got', actual, 'expected', expected);
~~~
<h3>What do we test?</h3>
<ul>
<li><strong>The normal case</strong>: an ordinary part, usual values.</li>
<li><strong><span class="term" data-term="cas-limite">Edge cases</span></strong>: empty list, zero volume, open mesh, file in metres instead of millimetres, 2 million triangles… That is where bugs hide.</li>
<li><strong>Expected errors</strong>: an empty file must give a clear message, not a crash.</li>
<li><strong><span class="term" data-term="regression">Regressions</span></strong>: every fixed bug gets its test, so it never comes back.</li>
</ul>
<div class="callout project">In 3D Reader the Python engine (<code>reader3d/</code>) is the <strong>reference</strong>. A script (<code>tests/make_fixtures.py</code>) builds parts whose exact volume is known (a holed block, a sphere, a torus) and records the Python results. The JS tests then check that the browser engine finds <em>the same figures</em>.</div>
<h3>Families of tests</h3>
<table><thead><tr><th>Kind</th><th>What it checks</th><th>Speed</th></tr></thead>
<tbody>
<tr><td>Unit</td><td>one function alone (e.g. <code>summarize</code>)</td><td>milliseconds</td></tr>
<tr><td>Integration</td><td>several pieces together (server + analysis)</td><td>seconds</td></tr>
<tr><td>End-to-end (e2e)</td><td>the whole site in a real browser</td><td>tens of seconds</td></tr>
</tbody></table>
<div class="callout tip">A passing test does not prove everything is perfect: it proves that <em>this case</em> works. The more varied the cases, the greater the confidence — like a well-designed inspection plan.</div>
<div class="callout warn">Confidential data: the tests of 3D Reader only use <strong>synthetic data</strong> (made-up parts, fictitious values), never the real costing workbooks.</div>`,
      },
      deep: {
        fr: `<h3>Autrement dit : le test, c’est la recette du gâteau… et la balance</h3>
<p>Tu fais un gâteau. Tu sais qu’il doit peser environ 800 g. Après la cuisson, tu le poses sur la balance : 810 g, c’est bon ; 300 g, il y a un problème (oubli de farine ?). La balance ne fait pas le gâteau : elle <strong>vérifie</strong>.</p>
<p>Un test, c’est cette balance, mais pour une fonction du programme.</p>
~~~text
 ENTRÉE connue  ──►  FONCTION  ──►  RÉSULTAT obtenu
                                       │
                 RÉSULTAT attendu ─────┤  comparer
                                       ▼
                               ✔ pareil  /  ✘ différent
~~~
<h3>Pas à pas, sur un exemple</h3>
<ol>
<li>Je choisis une pièce dont je <em>connais</em> la réponse : un cube de 10 mm de côté → 1000 mm³.</li>
<li>Je donne ce cube au programme.</li>
<li>Le programme répond 1000 ? ✔. Il répond 999,7 ? Peut-être acceptable (arrondis) : on fixe une <strong>tolérance</strong>, comme une tolérance de cote ± 0,1.</li>
<li>Il répond 0 ou plante ? ✘ : on a trouvé un bug <em>avant</em> l’utilisateur.</li>
</ol>
<h3>Pourquoi on aime les cas « bizarres »</h3>
<p>Un contrôleur expérimenté ne mesure pas seulement la cote facile : il va voir l’angle vif, la zone de retassure, la paroi mince. Pour un programme, les zones à risque sont :</p>
<ul>
<li>« rien du tout » (liste vide, fichier vide) ;</li>
<li>« énorme » (2 millions de triangles) ;</li>
<li>« mauvaise unité » (mètres, pouces) ;</li>
<li>« forme cassée » (maillage avec un trou).</li>
</ul>
<h3>Les erreurs classiques du débutant</h3>
<ul>
<li>Tester seulement le cas qui marche.</li>
<li>Comparer deux nombres à virgule avec une égalité stricte (0,1 + 0,2 ne vaut pas exactement 0,3 pour un ordinateur !).</li>
<li>Supprimer un test qui échoue « pour avancer » : c’est comme débrancher l’alarme incendie parce qu’elle sonne.</li>
</ul>
~~~js run
console.log(0.1 + 0.2);            // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);    // false !
// D'où les tolérances dans les tests :
console.log(Math.abs((0.1 + 0.2) - 0.3) <= 1e-12); // true
~~~`,
        en: `<h3>In other words: the test is the cake recipe… and the scales</h3>
<p>You bake a cake. You know it should weigh about 800 g. After baking you put it on the scales: 810 g, fine; 300 g, something is wrong (forgot the flour?). The scales do not bake the cake: they <strong>check</strong> it.</p>
<p>A test is those scales, for one function of the program.</p>
~~~text
 KNOWN INPUT  ──►  FUNCTION  ──►  ACTUAL result
                                     │
              EXPECTED result ───────┤  compare
                                     ▼
                             ✔ same  /  ✘ different
~~~
<h3>Step by step, on an example</h3>
<ol>
<li>I pick a part whose answer I <em>know</em>: a 10 mm cube → 1000 mm³.</li>
<li>I give this cube to the program.</li>
<li>It answers 1000? ✔. It answers 999.7? Maybe acceptable (rounding): we set a <strong>tolerance</strong>, like a dimensional tolerance ± 0.1.</li>
<li>It answers 0 or crashes? ✘: we found a bug <em>before</em> the user did.</li>
</ol>
<h3>Why we love "weird" cases</h3>
<p>An experienced inspector does not only measure the easy dimension: they look at the sharp corner, the shrinkage zone, the thin wall. For a program the risky zones are:</p>
<ul>
<li>"nothing at all" (empty list, empty file);</li>
<li>"huge" (2 million triangles);</li>
<li>"wrong unit" (metres, inches);</li>
<li>"broken shape" (a mesh with a hole).</li>
</ul>
<h3>Classic beginner mistakes</h3>
<ul>
<li>Testing only the case that works.</li>
<li>Comparing two decimal numbers with strict equality (0.1 + 0.2 is not exactly 0.3 for a computer!).</li>
<li>Deleting a failing test "to move on": like unplugging the fire alarm because it rings.</li>
</ul>
~~~js run
console.log(0.1 + 0.2);            // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);    // false!
// Hence the tolerances in tests:
console.log(Math.abs((0.1 + 0.2) - 0.3) <= 1e-12); // true
~~~`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'quality-2',
      title: { fr: 'Lire un test unitaire : node:test et pytest', en: 'Reading a unit test: node:test and pytest' },
      skills: ['quality.unit'],
      minutes: 12,
      body: {
        fr: `<h3>Un vrai test de 3D Reader</h3>
<p>Voici un test (raccourci) du fichier <code>tests/js/summary.test.mjs</code>. Il vérifie la fonction <code>summarize</code>, qui fait les totaux d’un fichier 3D.</p>
~~~js title="tests/js/summary.test.mjs"
import assert from 'node:assert/strict';            //«1»
import { test } from 'node:test';                    //«2»
import { summarize } from '../../web/engine/summary.js'; //«3»
import { approx } from './helpers.mjs';              //«4»

test('totals follow model.py summarize', () => {     //«5»
  const a = boxBody([10, 20, 30], rotation(0, 0, 0), [0, 0, 0], 'a');
  const b = boxBody([2, 2, 2], rotation(0, 0, 0), [20, 0, 0], 'b');
  const s = summarize([a, b]);                        //«6»
  assert.equal(s.bodies, 2);                          //«7»
  approx(s.volume, 6008, 1e-12, 0, 'volume');         //«8»
});

test('an empty body list is an error', () => {
  assert.throws(() => summarize([]), /No geometry found in file/); //«9»
});
~~~
<ol class="notes">
<li><code>assert</code> : la boîte à outils de vérification de Node. La version <code>strict</code> compare sans conversion bizarre (<code>1</code> n’est pas égal à <code>'1'</code>).</li>
<li><code>test</code> : la fonction qui déclare un test. Elle vient de <code>node:test</code>, le lanceur de tests intégré à Node (pas besoin d’installer Jest ou Mocha).</li>
<li>On importe la fonction à tester depuis le vrai code du site.</li>
<li><code>approx</code> : une aide maison (dans <code>helpers.mjs</code>) qui compare deux nombres avec une tolérance.</li>
<li><code>test('nom lisible', () =&gt; { … })</code> : un nom qui dit ce qui est attendu, puis le corps du test (une fonction fléchée).</li>
<li><strong>Agir</strong> : on appelle <code>summarize</code> sur deux pavés synthétiques (10×20×30 et 2×2×2).</li>
<li><strong>Vérifier</strong> : il doit y avoir 2 corps.</li>
<li>Volume attendu : 6000 + 8 = 6008 mm³, à une erreur relative de 10⁻¹² près.</li>
<li><code>assert.throws</code> vérifie qu’une erreur est bien levée, avec un message qui correspond à l’expression régulière.</li>
</ol>
<h3>L’aide <code>approx</code> : la tolérance</h3>
~~~js title="tests/js/helpers.mjs"
export function approx(actual, expected, rel, abs = 0, message = '') {
  const tol = Math.max(rel * Math.abs(expected), abs);
  assert.ok(Math.abs(actual - expected) <= tol,
    message + ': ' + actual + ' != ' + expected);
}
~~~
<p>La tolérance est la plus grande des deux : relative (<code>rel</code> × valeur attendue) ou absolue (<code>abs</code>). C’est exactement l’idée d’une tolérance de cote.</p>
<h3>Les <span class="term" data-term="fixture">fixtures</span></h3>
<p>Une fixture, c’est une donnée de test préparée à l’avance : ici des fichiers STEP/STL générés par Python, et un fichier <code>expected.json</code> avec les résultats de référence. <code>helpers.mjs</code> fournit <code>loadExpected()</code> et <code>fixtureBytes(name)</code> pour les lire.</p>
<h3>Le même esprit en Python : pytest</h3>
~~~py title="tests/test_volume.py"
def test_step_exact_volume_of_curved_part(tmp_path):
    r = analyze_file(write_step(holed_block(), tmp_path / "block.step"))
    s = r["summary"]
    # Exact B-rep volume: not affected by the tessellation of the hole.
    assert s["volume"] == pytest.approx(HOLED_VOLUME, rel=1e-9)
    assert s["bbox"]["size"] == pytest.approx([100, 60, 20], abs=1e-6)
~~~
<ul>
<li>pytest trouve tout seul les fonctions dont le nom commence par <code>test_</code>.</li>
<li><code>tmp_path</code> est une fixture fournie par pytest : un dossier temporaire neuf pour chaque test.</li>
<li>Le mot-clé <code>assert</code> + <code>pytest.approx</code> remplacent <code>approx</code> du JS.</li>
</ul>
<h3>Lancer les tests</h3>
~~~bash
npm test                              # tous les tests JS (node --test tests/js/*.test.mjs)
node --test tests/js/summary.test.mjs # un seul fichier
pytest                                # tous les tests Python
pytest -k step                        # seulement ceux dont le nom contient "step"
~~~
<div data-widget="quality-term-tests"></div>
<div class="callout tip">Lis le <strong>nom</strong> du test en premier : dans 3D Reader, il est écrit comme une phrase (« an empty body list is an error »). Il te dit la règle métier vérifiée, avant même de lire le code.</div>`,
        en: `<h3>A real 3D Reader test</h3>
<p>Here is a (shortened) test from <code>tests/js/summary.test.mjs</code>. It checks the <code>summarize</code> function, which computes the totals of a 3D file.</p>
~~~js title="tests/js/summary.test.mjs"
import assert from 'node:assert/strict';            //«1»
import { test } from 'node:test';                    //«2»
import { summarize } from '../../web/engine/summary.js'; //«3»
import { approx } from './helpers.mjs';              //«4»

test('totals follow model.py summarize', () => {     //«5»
  const a = boxBody([10, 20, 30], rotation(0, 0, 0), [0, 0, 0], 'a');
  const b = boxBody([2, 2, 2], rotation(0, 0, 0), [20, 0, 0], 'b');
  const s = summarize([a, b]);                        //«6»
  assert.equal(s.bodies, 2);                          //«7»
  approx(s.volume, 6008, 1e-12, 0, 'volume');         //«8»
});

test('an empty body list is an error', () => {
  assert.throws(() => summarize([]), /No geometry found in file/); //«9»
});
~~~
<ol class="notes">
<li><code>assert</code>: Node's checking toolbox. The <code>strict</code> version compares without odd conversions (<code>1</code> is not equal to <code>'1'</code>).</li>
<li><code>test</code>: the function that declares a test. It comes from <code>node:test</code>, the test runner built into Node (no need to install Jest or Mocha).</li>
<li>We import the function under test from the real site code.</li>
<li><code>approx</code>: a home-made helper (in <code>helpers.mjs</code>) that compares two numbers with a tolerance.</li>
<li><code>test('readable name', () =&gt; { … })</code>: a name that says what is expected, then the test body (an arrow function).</li>
<li><strong>Act</strong>: call <code>summarize</code> on two synthetic boxes (10×20×30 and 2×2×2).</li>
<li><strong>Assert</strong>: there must be 2 bodies.</li>
<li>Expected volume: 6000 + 8 = 6008 mm³, within a relative error of 10⁻¹².</li>
<li><code>assert.throws</code> checks that an error is indeed thrown, with a message matching the regular expression.</li>
</ol>
<h3>The <code>approx</code> helper: tolerance</h3>
~~~js title="tests/js/helpers.mjs"
export function approx(actual, expected, rel, abs = 0, message = '') {
  const tol = Math.max(rel * Math.abs(expected), abs);
  assert.ok(Math.abs(actual - expected) <= tol,
    message + ': ' + actual + ' != ' + expected);
}
~~~
<p>The tolerance is the larger of two: relative (<code>rel</code> × expected value) or absolute (<code>abs</code>). Exactly the idea of a dimensional tolerance.</p>
<h3><span class="term" data-term="fixture">Fixtures</span></h3>
<p>A fixture is test data prepared in advance: here STEP/STL files generated by Python, and an <code>expected.json</code> file with the reference results. <code>helpers.mjs</code> provides <code>loadExpected()</code> and <code>fixtureBytes(name)</code> to read them.</p>
<h3>The same spirit in Python: pytest</h3>
~~~py title="tests/test_volume.py"
def test_step_exact_volume_of_curved_part(tmp_path):
    r = analyze_file(write_step(holed_block(), tmp_path / "block.step"))
    s = r["summary"]
    # Exact B-rep volume: not affected by the tessellation of the hole.
    assert s["volume"] == pytest.approx(HOLED_VOLUME, rel=1e-9)
    assert s["bbox"]["size"] == pytest.approx([100, 60, 20], abs=1e-6)
~~~
<ul>
<li>pytest finds by itself the functions whose name starts with <code>test_</code>.</li>
<li><code>tmp_path</code> is a fixture provided by pytest: a fresh temporary folder for each test.</li>
<li>The <code>assert</code> keyword + <code>pytest.approx</code> replace the JS <code>approx</code>.</li>
</ul>
<h3>Running the tests</h3>
~~~bash
npm test                              # all JS tests (node --test tests/js/*.test.mjs)
node --test tests/js/summary.test.mjs # a single file
pytest                                # all Python tests
pytest -k step                        # only those whose name contains "step"
~~~
<div data-widget="quality-term-tests"></div>
<div class="callout tip">Read the test <strong>name</strong> first: in 3D Reader it is written as a sentence ("an empty body list is an error"). It tells you the business rule being checked, before you even read the code.</div>`,
      },
      deep: {
        fr: `<h3>Un test, c’est une fiche de contrôle</h3>
<p>Imagine une fiche de contrôle papier :</p>
~~~text
FICHE : « totaux d'un fichier à 2 pavés »
  Pièce fournie : pavé 10x20x30 + pavé 2x2x2
  Mesure        : volume total
  Attendu       : 6008 mm³   tolérance : quasi nulle
  Résultat      : ______   ✔ / ✘
~~~
<p>Le code d’un test, c’est exactement cette fiche, écrite pour que l’ordinateur la remplisse seul.</p>
<table><thead><tr><th>Sur la fiche</th><th>Dans le code</th></tr></thead><tbody>
<tr><td>Titre de la fiche</td><td><code>test('totals follow…', …)</code></td></tr>
<tr><td>Pièce fournie</td><td><code>const a = boxBody(…)</code></td></tr>
<tr><td>Faire la mesure</td><td><code>const s = summarize([a, b])</code></td></tr>
<tr><td>Comparer à l’attendu</td><td><code>assert.equal(…)</code> / <code>approx(…)</code></td></tr>
<tr><td>Tolérance</td><td><code>1e-12</code> (relative) ou <code>abs</code></td></tr>
</tbody></table>
<h3>Lire un <code>assert</code> à voix haute</h3>
<ul>
<li><code>assert.equal(s.bodies, 2)</code> → « je certifie que le nombre de corps vaut 2 ».</li>
<li><code>assert.ok(x)</code> → « je certifie que x est vrai ».</li>
<li><code>assert.throws(f, /message/)</code> → « je certifie que f proteste avec ce message ».</li>
<li><code>assert.deepEqual(a, b)</code> → « je certifie que ces deux listes/objets ont le même contenu ».</li>
</ul>
<p>Si la certification est fausse, le test s’arrête et affiche <strong>ce qui était attendu</strong> et <strong>ce qui a été obtenu</strong>.</p>
<h3>Que veut dire <code>1e-12</code> ?</h3>
<p>C’est l’écriture scientifique : 1 × 10⁻¹², soit 0,000000000001. Une tolérance relative de 1e-12 sur 6008 mm³ autorise un écart de 0,000000006 mm³ : autant dire « exactement », à l’erreur d’arrondi près.</p>
~~~js run
const tol = (rel, attendu) => rel * Math.abs(attendu);
console.log('tolérance pour 6008 :', tol(1e-12, 6008));
console.log('tolérance 1 % pour 6008 :', tol(0.01, 6008));
~~~
<h3>Données synthétiques ?</h3>
<p>« Synthétique » = inventé exprès pour le test. Un pavé de 10×20×30, c’est inventé, mais on connaît sa réponse par calcul mental. C’est parfait pour un test, et ça ne contient aucun secret de l’entreprise.</p>`,
        en: `<h3>A test is an inspection sheet</h3>
<p>Picture a paper inspection sheet:</p>
~~~text
SHEET: "totals of a file with 2 boxes"
  Part supplied : box 10x20x30 + box 2x2x2
  Measure       : total volume
  Expected      : 6008 mm³   tolerance: almost none
  Result        : ______   ✔ / ✘
~~~
<p>The code of a test is exactly that sheet, written so the computer fills it in alone.</p>
<table><thead><tr><th>On the sheet</th><th>In the code</th></tr></thead><tbody>
<tr><td>Sheet title</td><td><code>test('totals follow…', …)</code></td></tr>
<tr><td>Part supplied</td><td><code>const a = boxBody(…)</code></td></tr>
<tr><td>Take the measurement</td><td><code>const s = summarize([a, b])</code></td></tr>
<tr><td>Compare with expected</td><td><code>assert.equal(…)</code> / <code>approx(…)</code></td></tr>
<tr><td>Tolerance</td><td><code>1e-12</code> (relative) or <code>abs</code></td></tr>
</tbody></table>
<h3>Reading an <code>assert</code> out loud</h3>
<ul>
<li><code>assert.equal(s.bodies, 2)</code> → "I certify the number of bodies is 2".</li>
<li><code>assert.ok(x)</code> → "I certify that x is true".</li>
<li><code>assert.throws(f, /message/)</code> → "I certify that f complains with this message".</li>
<li><code>assert.deepEqual(a, b)</code> → "I certify these two lists/objects have the same content".</li>
</ul>
<p>If the certification is false, the test stops and shows <strong>what was expected</strong> and <strong>what was obtained</strong>.</p>
<h3>What does <code>1e-12</code> mean?</h3>
<p>Scientific notation: 1 × 10⁻¹², i.e. 0.000000000001. A relative tolerance of 1e-12 on 6008 mm³ allows a gap of 0.000000006 mm³: practically "exactly", up to rounding error.</p>
~~~js run
const tol = (rel, expected) => rel * Math.abs(expected);
console.log('tolerance for 6008:', tol(1e-12, 6008));
console.log('1 % tolerance for 6008:', tol(0.01, 6008));
~~~
<h3>Synthetic data?</h3>
<p>"Synthetic" = made up on purpose for the test. A 10×20×30 box is made up, but we know its answer by mental arithmetic. Perfect for a test, and it contains no company secret.</p>`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'quality-3',
      title: { fr: 'Tests de bout en bout avec Playwright', en: 'End-to-end tests with Playwright' },
      skills: ['quality.e2e'],
      minutes: 10,
      body: {
        fr: `<h3>Tester comme un vrai visiteur</h3>
<p>Les tests unitaires vérifient des fonctions isolées. Mais si le bouton « Ouvrir » est cassé, ou si le site ne charge pas sur GitHub Pages, aucun test unitaire ne le verra. D’où les tests <span class="term" data-term="e2e">de bout en bout</span> (<em>end-to-end</em>, e2e) : un robot ouvre <strong>un vrai navigateur</strong>, charge le site construit et clique comme un humain.</p>
<p>3D Reader utilise <span class="term" data-term="playwright">Playwright</span> avec Chromium (le moteur de Chrome) en mode <span class="term" data-term="headless">sans tête</span> (<em>headless</em>) : le navigateur tourne sans fenêtre visible, ce qui marche sur un serveur de CI.</p>
~~~js title="tests/e2e/site.test.mjs (simplifié)"
browser = await chromium.launch();                      //«1»
context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto(url);                                   //«2»
await page.setInputFiles('#file-input', fixturePath('box.stl')); //«3»
await page.waitForSelector('#viewport canvas', { state: 'attached', timeout: 30_000 }); //«4»
await page.click('[data-view="front"]');                //«5»
const text = await page.locator('#total-volume').textContent(); //«6»
approx(parseFloat(text), expected.volume, 1e-6, 0, 'volume affiché'); //«7»
~~~
<ol class="notes">
<li>Démarrer Chromium. <code>newContext</code> = une fenêtre de navigation privée, avec une langue et une taille d’écran fixées (pour des résultats identiques partout).</li>
<li>Aller à l’adresse du site (servi en local par <code>scripts/serve.mjs</code>).</li>
<li>Choisir un fichier dans le champ <code>&lt;input type="file"&gt;</code>, exactement comme un visiteur.</li>
<li><strong>Attendre</strong> que la vue 3D (un <code>canvas</code>) soit là. On attend toujours un <em>état</em>, avec un délai maximal.</li>
<li>Cliquer sur le bouton de vue de face (trouvé par un <span class="term" data-term="selecteur-css">sélecteur CSS</span>).</li>
<li>Lire le texte affiché dans la carte du volume total.</li>
<li>Comparer avec le résultat de référence Python.</li>
</ol>
<h3>Les 4 verbes d’un test e2e</h3>
<table><thead><tr><th>Verbe</th><th>Playwright</th></tr></thead><tbody>
<tr><td>Aller</td><td><code>page.goto(url)</code></td></tr>
<tr><td>Agir</td><td><code>page.click()</code>, <code>page.fill()</code>, <code>page.setInputFiles()</code></td></tr>
<tr><td>Attendre</td><td><code>page.waitForSelector()</code>, <code>page.waitForFunction()</code></td></tr>
<tr><td>Vérifier</td><td><code>locator().textContent()</code> + <code>assert</code></td></tr>
</tbody></table>
<h3>Pourquoi c’est lent</h3>
<ul>
<li>Il faut <strong>construire</strong> le site (<code>npm run build</code>) puis le servir.</li>
<li>Le navigateur démarre, télécharge et compile OpenCascade en WebAssembly (13 Mo à télécharger, ~48 Mo compilés) : le test prévoit jusqu’à 240 s pour un fichier CAO sur la CI.</li>
<li>Le rendu 3D tourne sans carte graphique (rendu logiciel SwiftShader).</li>
</ul>
<p>Pour gagner du temps, les fichiers e2e tournent <strong>en parallèle</strong> (plusieurs fichiers de test à la fois). Contrepartie : si la machine est très chargée, un test chronométré peut dépasser son délai.</p>
~~~bash
npm run build && npm run test:e2e        # tout le e2e, comme la CI
node --test tests/e2e/parting.test.mjs   # un seul fichier
~~~
<div class="callout warn"><code>page.waitForTimeout(500)</code> (attendre 500 ms « au cas où ») est un dernier recours : sur une machine lente, 500 ms peut ne pas suffire. Mieux vaut attendre une condition précise (« le texte se termine par mm³ »).</div>
<div class="callout project">Le e2e de 3D Reader couvre la page entière : volumes, plan de joint, tiroirs, alimentation, chiffrage, coupe, vues orthogonales, mise en page… 105 tests. C’est le dernier filet avant la mise en ligne.</div>`,
        en: `<h3>Testing like a real visitor</h3>
<p>Unit tests check isolated functions. But if the "Open" button is broken, or the site does not load on GitHub Pages, no unit test will notice. Hence <span class="term" data-term="e2e">end-to-end</span> (e2e) tests: a robot opens <strong>a real browser</strong>, loads the built site and clicks like a human.</p>
<p>3D Reader uses <span class="term" data-term="playwright">Playwright</span> with Chromium (Chrome's engine) in <span class="term" data-term="headless">headless</span> mode: the browser runs without a visible window, which works on a CI server.</p>
~~~js title="tests/e2e/site.test.mjs (simplified)"
browser = await chromium.launch();                      //«1»
context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto(url);                                   //«2»
await page.setInputFiles('#file-input', fixturePath('box.stl')); //«3»
await page.waitForSelector('#viewport canvas', { state: 'attached', timeout: 30_000 }); //«4»
await page.click('[data-view="front"]');                //«5»
const text = await page.locator('#total-volume').textContent(); //«6»
approx(parseFloat(text), expected.volume, 1e-6, 0, 'displayed volume'); //«7»
~~~
<ol class="notes">
<li>Start Chromium. <code>newContext</code> = a private browsing window, with a fixed language and screen size (for identical results everywhere).</li>
<li>Go to the address of the site (served locally by <code>scripts/serve.mjs</code>).</li>
<li>Pick a file in the <code>&lt;input type="file"&gt;</code> field, exactly like a visitor.</li>
<li><strong>Wait</strong> for the 3D view (a <code>canvas</code>) to be there. We always wait for a <em>state</em>, with a maximum delay.</li>
<li>Click the front view button (found with a <span class="term" data-term="selecteur-css">CSS selector</span>).</li>
<li>Read the text shown in the total volume card.</li>
<li>Compare with the Python reference result.</li>
</ol>
<h3>The 4 verbs of an e2e test</h3>
<table><thead><tr><th>Verb</th><th>Playwright</th></tr></thead><tbody>
<tr><td>Go</td><td><code>page.goto(url)</code></td></tr>
<tr><td>Act</td><td><code>page.click()</code>, <code>page.fill()</code>, <code>page.setInputFiles()</code></td></tr>
<tr><td>Wait</td><td><code>page.waitForSelector()</code>, <code>page.waitForFunction()</code></td></tr>
<tr><td>Check</td><td><code>locator().textContent()</code> + <code>assert</code></td></tr>
</tbody></table>
<h3>Why it is slow</h3>
<ul>
<li>The site must be <strong>built</strong> (<code>npm run build</code>) then served.</li>
<li>The browser starts, downloads and compiles OpenCascade to WebAssembly (13 MB download, ~48 MB compiled): the test allows up to 240 s for a CAD file on CI.</li>
<li>3D rendering runs without a graphics card (SwiftShader software rendering).</li>
</ul>
<p>To save time, e2e files run <strong>in parallel</strong> (several test files at once). The price: on a heavily loaded machine, a timed test may exceed its delay.</p>
~~~bash
npm run build && npm run test:e2e        # the whole e2e, like CI
node --test tests/e2e/parting.test.mjs   # a single file
~~~
<div class="callout warn"><code>page.waitForTimeout(500)</code> (wait 500 ms "just in case") is a last resort: on a slow machine 500 ms may not be enough. Better wait for a precise condition ("the text ends with mm³").</div>
<div class="callout project">The 3D Reader e2e covers the whole page: volumes, parting line, slides, gating, costing, section, orthographic views, layout… 105 tests. It is the last safety net before going online.</div>`,
      },
      deep: {
        fr: `<h3>Le robot testeur, comme un stagiaire très obéissant</h3>
<p>Imagine un stagiaire à qui tu donnes une feuille d’instructions :</p>
~~~text
1. Ouvre Chrome et va sur le site.
2. Clique sur « Ouvrir un fichier », choisis box.stl.
3. ATTENDS que la pièce apparaisse (pas plus de 30 s).
4. Clique sur « Face ».
5. Lis le volume affiché. Est-ce 6000 mm³ ? Note OK ou PAS OK.
~~~
<p>Playwright, c’est ce stagiaire, mais en code, infatigable, et qui fait la même chose à chaque fois. « Sans tête » veut juste dire qu’il travaille l’écran éteint : le navigateur existe, mais personne ne le regarde.</p>
<h3>Pourquoi « attendre » est le mot le plus important</h3>
<p>Un humain voit que la page charge et patiente naturellement. Un robot, lui, va trop vite : s’il lit le volume <em>avant</em> la fin du calcul, il lit une case vide et croit à une erreur. Toutes les instructions « attendre » (<code>waitFor…</code>) servent à se synchroniser avec la page.</p>
<ul>
<li>✔ Bonne attente : « attends que le texte du volume se termine par mm³ ».</li>
<li>✘ Mauvaise attente : « attends 2 secondes ». Sur une machine lente, 2 s ne suffisent pas → test qui échoue au hasard.</li>
</ul>
<h3>Unitaire vs bout en bout, en image</h3>
~~~text
Unitaire       : tester la vis seule sur l'établi        (rapide, précis)
Bout en bout   : démarrer la voiture et faire le tour    (lent, complet)
~~~
<p>On a besoin des deux : beaucoup de tests unitaires (rapides, ils trouvent vite <em>où</em> est le problème), et quelques e2e (ils prouvent que <em>l’ensemble</em> fonctionne pour un vrai visiteur).</p>`,
        en: `<h3>The robot tester, like a very obedient intern</h3>
<p>Imagine an intern you give an instruction sheet to:</p>
~~~text
1. Open Chrome and go to the site.
2. Click "Open file", choose box.stl.
3. WAIT for the part to appear (no more than 30 s).
4. Click "Front".
5. Read the displayed volume. Is it 6000 mm³? Write OK or NOT OK.
~~~
<p>Playwright is that intern, but in code, tireless, doing the same thing every time. "Headless" just means it works with the screen off: the browser exists, but nobody is watching it.</p>
<h3>Why "wait" is the most important word</h3>
<p>A human sees the page loading and naturally waits. A robot goes too fast: if it reads the volume <em>before</em> the computation ends, it reads an empty box and believes there is an error. All the "wait" instructions (<code>waitFor…</code>) are there to synchronise with the page.</p>
<ul>
<li>✔ Good wait: "wait until the volume text ends with mm³".</li>
<li>✘ Bad wait: "wait 2 seconds". On a slow machine 2 s is not enough → a test that fails at random.</li>
</ul>
<h3>Unit vs end-to-end, as a picture</h3>
~~~text
Unit         : test the screw alone on the workbench    (fast, precise)
End-to-end   : start the car and drive around the block (slow, complete)
~~~
<p>We need both: many unit tests (fast, they quickly find <em>where</em> the problem is), and a few e2e tests (they prove that <em>the whole</em> works for a real visitor).</p>`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'quality-4',
      title: { fr: 'La CI rouge ou verte : lire un échec', en: 'Red or green CI: reading a failure' },
      skills: ['quality.ci'],
      minutes: 11,
      body: {
        fr: `<h3>La CI, l’inspecteur qui ne dort jamais</h3>
<p>La <span class="term" data-term="ci">CI</span> (intégration continue) relance <strong>tous</strong> les tests à chaque <span class="term" data-term="push">push</span>, sur une machine neuve de GitHub. Résultat : une coche verte ✔ ou une croix rouge ✘ à côté du commit et dans la <span class="term" data-term="pull-request">pull request</span>.</p>
<div data-widget="quality-flow-ci"></div>
<p>Pour 3D Reader (<code>.github/workflows/ci.yml</code>), les étapes sont : générer les fixtures Python → <code>pytest</code> → <code>npm test</code> → <code>npm run build</code> → installer Chromium → <code>npm run test:e2e</code>. Et <code>pages.yml</code> ne publie le site que si la CI de <code>main</code> est verte.</p>
<h3>Lire un message d’échec</h3>
<p>Quand un test échoue, Node affiche quelque chose comme :</p>
~~~text
not ok 3 - totals follow model.py summarize
  ---
  error: 'volume: 6000 != 6008 (diff 8, tol 6.008e-9)'
  expected: true
  actual: false
  stack: |-
    approx (tests/js/helpers.mjs:36:10)
    TestContext.<anonymous> (tests/js/summary.test.mjs:95:3)
  ...
# tests 791
# pass 790
# fail 1
~~~
<p>On lit dans cet ordre :</p>
<ol>
<li><strong>Quel test ?</strong> → <code>totals follow model.py summarize</code>.</li>
<li><strong>Attendu vs obtenu</strong> → on attendait 6008, on a eu 6000 : il manque les 8 mm³ du petit pavé. Un corps a été oublié !</li>
<li><strong>La <span class="term" data-term="stack-trace">pile d’appels</span></strong> (<em>stack</em>) → les lignes <code>fichier:ligne:colonne</code>, de la plus profonde à la plus haute. Ici, <code>summary.test.mjs</code> ligne 95.</li>
<li><strong>Le bilan</strong> → 790 réussis, 1 échec.</li>
</ol>
<div class="callout tip">Sur GitHub : onglet <strong>Actions</strong> → le run rouge → le job <em>test</em> → l’étape rouge (ex. « Browser engine tests ») → déplier le journal. Cherche <code>not ok</code> ou <code>Error</code>.</div>
<h3>Reproduire en local</h3>
<p>Avant de corriger, on reproduit l’échec sur sa propre machine, avec la même commande que la CI :</p>
~~~bash
node --test tests/js/summary.test.mjs
~~~
<p>Si ça échoue aussi chez toi : bonne nouvelle, tu peux enquêter. Si ça passe chez toi mais pas sur la CI : différence d’environnement (version de Node, fichier non commité, machine plus lente…).</p>
<h3>Le test <span class="term" data-term="flaky">instable</span> (flaky)</h3>
<p>Un test <em>flaky</em> passe parfois et échoue parfois, sans changement de code. Exemple réel de 3D Reader : « résumé de 2 millions de triangles en moins de 10 s » échoue quand la machine est chargée par plusieurs agents, et passe quand il tourne seul.</p>
<div class="callout warn"><strong>« Flaky » n’est pas une cause racine.</strong> Dire « c’est un flake » n’explique rien : il faut trouver <em>pourquoi</em> (machine surchargée, attente trop courte, ordre aléatoire, dépendance au réseau…) et rendre le test robuste. On peut relancer <strong>une fois</strong> pour confirmer ; un deuxième échec est un vrai échec.</div>
<h3>Les interdits</h3>
<ul>
<li>❌ Désactiver ou supprimer un test pour avoir du vert (<code>test.skip</code>) : c’est débrancher l’alarme.</li>
<li>❌ Pousser un commit vide pour « relancer » la CI.</li>
<li>❌ Modifier l’attendu pour qu’il colle au résultat faux.</li>
<li>✔ Corriger le code, ou rendre le test robuste, puis pousser.</li>
</ul>`,
        en: `<h3>CI, the inspector who never sleeps</h3>
<p><span class="term" data-term="ci">CI</span> (continuous integration) reruns <strong>all</strong> the tests on every <span class="term" data-term="push">push</span>, on a fresh GitHub machine. Result: a green tick ✔ or a red cross ✘ next to the commit and in the <span class="term" data-term="pull-request">pull request</span>.</p>
<div data-widget="quality-flow-ci"></div>
<p>For 3D Reader (<code>.github/workflows/ci.yml</code>) the steps are: generate the Python fixtures → <code>pytest</code> → <code>npm test</code> → <code>npm run build</code> → install Chromium → <code>npm run test:e2e</code>. And <code>pages.yml</code> only publishes the site if CI on <code>main</code> is green.</p>
<h3>Reading a failure message</h3>
<p>When a test fails, Node prints something like:</p>
~~~text
not ok 3 - totals follow model.py summarize
  ---
  error: 'volume: 6000 != 6008 (diff 8, tol 6.008e-9)'
  expected: true
  actual: false
  stack: |-
    approx (tests/js/helpers.mjs:36:10)
    TestContext.<anonymous> (tests/js/summary.test.mjs:95:3)
  ...
# tests 791
# pass 790
# fail 1
~~~
<p>Read it in this order:</p>
<ol>
<li><strong>Which test?</strong> → <code>totals follow model.py summarize</code>.</li>
<li><strong>Expected vs actual</strong> → we expected 6008, we got 6000: the 8 mm³ of the small box are missing. A body was forgotten!</li>
<li><strong>The <span class="term" data-term="stack-trace">stack trace</span></strong> → the <code>file:line:column</code> lines, from the deepest to the highest. Here <code>summary.test.mjs</code> line 95.</li>
<li><strong>The tally</strong> → 790 passed, 1 failed.</li>
</ol>
<div class="callout tip">On GitHub: <strong>Actions</strong> tab → the red run → the <em>test</em> job → the red step (e.g. "Browser engine tests") → expand the log. Look for <code>not ok</code> or <code>Error</code>.</div>
<h3>Reproduce locally</h3>
<p>Before fixing, reproduce the failure on your own machine, with the same command as CI:</p>
~~~bash
node --test tests/js/summary.test.mjs
~~~
<p>If it fails for you too: good news, you can investigate. If it passes for you but not on CI: an environment difference (Node version, uncommitted file, slower machine…).</p>
<h3>The <span class="term" data-term="flaky">flaky</span> test</h3>
<p>A flaky test sometimes passes and sometimes fails, without any code change. A real 3D Reader example: "summary of 2 million triangles in under 10 s" fails when the machine is loaded by several agents, and passes when run alone.</p>
<div class="callout warn"><strong>"Flaky" is not a root cause.</strong> Saying "it's a flake" explains nothing: you must find <em>why</em> (overloaded machine, wait too short, random order, network dependency…) and make the test robust. You may rerun <strong>once</strong> to confirm; a second failure is a real failure.</div>
<h3>The forbidden moves</h3>
<ul>
<li>❌ Disabling or deleting a test to get green (<code>test.skip</code>): unplugging the alarm.</li>
<li>❌ Pushing an empty commit to "rerun" CI.</li>
<li>❌ Changing the expected value so it matches the wrong result.</li>
<li>✔ Fix the code, or make the test robust, then push.</li>
</ul>`,
      },
      deep: {
        fr: `<h3>La CI comme le contrôle final en sortie d’atelier</h3>
<p>Chaque fois que tu envoies du code (push), c’est comme si tu déposais un lot de pièces au contrôle final. Le contrôleur (la CI) passe <em>toutes</em> les gammes de contrôle, une par une :</p>
~~~text
Lot reçu (push)
 ├─ Contrôle 1 : tests Python ........ ✔
 ├─ Contrôle 2 : tests JS ............ ✘  ← arrêt ici
 ├─ Contrôle 3 : construction du site  (non fait)
 └─ Contrôle 4 : tests navigateur .... (non fait)
Verdict : LOT REFUSÉ (rouge)
~~~
<p>Rouge ne veut pas dire « tout est cassé » : ça veut dire « au moins un contrôle a échoué ». On regarde lequel.</p>
<h3>Le message d’erreur, comme un rapport de non-conformité</h3>
<table><thead><tr><th>Rapport de NC</th><th>Message de test</th></tr></thead><tbody>
<tr><td>Référence pièce</td><td>nom du test</td></tr>
<tr><td>Cote nominale</td><td><code>expected</code> (attendu)</td></tr>
<tr><td>Cote mesurée</td><td><code>actual</code> (obtenu)</td></tr>
<tr><td>Poste de fabrication</td><td>la pile d’appels : <code>fichier:ligne</code></td></tr>
</tbody></table>
<h3>L’instable, comme une mesure qui dépend de la température</h3>
<p>Une pièce mesurée tantôt bonne, tantôt mauvaise, sans changement de fabrication ? Tu ne dirais pas « c’est le hasard » : tu chercherais la cause (température de l’atelier, gabarit mal serré…). Pour un test flaky, c’est pareil : machine trop chargée, attente trop courte, ordre des tests qui change. On cherche, on corrige.</p>
<h3>Méthode en 5 étapes</h3>
<ol>
<li>Ouvrir le run rouge, trouver l’étape rouge.</li>
<li>Trouver la première ligne <code>not ok</code> / <code>Error</code>.</li>
<li>Noter attendu, obtenu, fichier:ligne.</li>
<li>Relancer la même commande en local.</li>
<li>Corriger la cause, ajouter/garder le test, repousser. Jamais <code>skip</code>.</li>
</ol>`,
        en: `<h3>CI as the final inspection at the workshop exit</h3>
<p>Every time you send code (push), it is like dropping a batch of parts at final inspection. The inspector (CI) runs <em>all</em> the inspection routines, one by one:</p>
~~~text
Batch received (push)
 ├─ Check 1: Python tests ........ ✔
 ├─ Check 2: JS tests ............ ✘  ← stops here
 ├─ Check 3: build the site      (not done)
 └─ Check 4: browser tests ..... (not done)
Verdict: BATCH REJECTED (red)
~~~
<p>Red does not mean "everything is broken": it means "at least one check failed". You look at which one.</p>
<h3>The error message as a non-conformity report</h3>
<table><thead><tr><th>NC report</th><th>Test message</th></tr></thead><tbody>
<tr><td>Part reference</td><td>test name</td></tr>
<tr><td>Nominal dimension</td><td><code>expected</code></td></tr>
<tr><td>Measured dimension</td><td><code>actual</code></td></tr>
<tr><td>Workstation</td><td>the stack trace: <code>file:line</code></td></tr>
</tbody></table>
<h3>Flaky, like a measurement that depends on temperature</h3>
<p>A part measured sometimes good, sometimes bad, with no change in manufacturing? You would not say "it's chance": you would look for the cause (workshop temperature, loose fixture…). Same for a flaky test: overloaded machine, wait too short, test order that changes. Investigate, fix.</p>
<h3>Method in 5 steps</h3>
<ol>
<li>Open the red run, find the red step.</li>
<li>Find the first <code>not ok</code> / <code>Error</code> line.</li>
<li>Write down expected, actual, file:line.</li>
<li>Rerun the same command locally.</li>
<li>Fix the cause, add/keep the test, push again. Never <code>skip</code>.</li>
</ol>`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'quality-5',
      title: { fr: 'Relecture de code : lire un diff', en: 'Code review: reading a diff' },
      skills: ['quality.review'],
      minutes: 10,
      body: {
        fr: `<h3>Le <span class="term" data-term="diff">diff</span> : ce qui a changé</h3>
<p>Un diff montre les différences entre deux versions d’un fichier. Sur GitHub, c’est l’onglet <strong>Files changed</strong> d’une pull request.</p>
~~~diff
--- a/web/engine/summary.js
+++ b/web/engine/summary.js
@@ -120,7 +120,7 @@ export function summarize(bodies) {
   let volume = 0;
-  for (let i = 1; i < bodies.length; i++) {
+  for (let i = 0; i < bodies.length; i++) {
     if (bodies[i].volume != null) volume += bodies[i].volume;
   }
~~~
<ul>
<li>Lignes en <code>-</code> (rouge) : supprimées. Lignes en <code>+</code> (vert) : ajoutées. Sans signe : contexte inchangé.</li>
<li><code>@@ -120,7 +120,7 @@</code> : l’emplacement, « à partir de la ligne 120, 7 lignes avant / 7 lignes après ».</li>
<li>Ici, la boucle commençait à <code>i = 1</code> : le premier corps était oublié ! Le correctif la fait partir de 0.</li>
</ul>
<h3>La <span class="term" data-term="review">revue</span> de code</h3>
<p>Avant de fusionner, quelqu’un d’autre relit. Dans le projet 3D Reader, la méthode est stricte :</p>
<ol>
<li>Un agent écrit le chantier.</li>
<li>Un <strong>autre</strong> agent, indépendant et en lecture seule, relit (il n’a pas écrit le code, donc pas d’angle mort).</li>
<li>Chaque défaut relevé est <strong>vérifié</strong> : est-il réel ? Peut-on le reproduire ?</li>
<li>Chaque défaut <strong>confirmé</strong> est corrigé <strong>avec un test</strong> qui l’aurait attrapé.</li>
<li>On relance toute la suite (unitaires, build, e2e) pour éviter les <span class="term" data-term="regression">régressions</span>.</li>
</ol>
<div class="callout info">Une <strong>régression</strong> : quelque chose qui marchait avant et ne marche plus après une modification. C’est l’ennemi n°1 d’une appli qui grossit (3D Reader : plus de 40 000 lignes de JS).</div>
<h3>Que chercher en relisant ?</h3>
<ul>
<li><strong>Exactitude</strong> : le calcul est-il juste, y compris aux cas limites (liste vide, 0, <code>null</code>) ?</li>
<li><strong>Effets de bord</strong> : la modification casse-t-elle autre chose ailleurs ?</li>
<li><strong>Tests</strong> : le changement est-il couvert par un test ?</li>
<li><strong>Lisibilité</strong> : les noms sont-ils clairs, les commentaires à jour ?</li>
<li><strong>Sécurité / confidentialité</strong> : aucune clé, aucune donnée client dans le diff ?</li>
</ul>
<h3>Le vocabulaire des revues sur GitHub</h3>
<table><thead><tr><th>Terme</th><th>Sens</th></tr></thead><tbody>
<tr><td><span class="term" data-term="lgtm">LGTM</span></td><td>« Looks good to me » : ça me va.</td></tr>
<tr><td><span class="term" data-term="nit">nit</span></td><td>Détail mineur (une faute, un nom), non bloquant.</td></tr>
<tr><td>Request changes</td><td>Changements demandés : bloquant.</td></tr>
<tr><td>Approve</td><td>Approbation formelle de la PR.</td></tr>
<tr><td>Resolve conversation</td><td>Marquer un commentaire comme traité.</td></tr>
</tbody></table>
<div class="callout project">Dans 3D Reader, c’est toi qui <strong>fusionnes</strong> les PR. Claude prépare, teste, fait relire ; la décision finale de mettre dans <code>main</code> (et donc en ligne) t’appartient.</div>`,
        en: `<h3>The <span class="term" data-term="diff">diff</span>: what changed</h3>
<p>A diff shows the differences between two versions of a file. On GitHub it is the <strong>Files changed</strong> tab of a pull request.</p>
~~~diff
--- a/web/engine/summary.js
+++ b/web/engine/summary.js
@@ -120,7 +120,7 @@ export function summarize(bodies) {
   let volume = 0;
-  for (let i = 1; i < bodies.length; i++) {
+  for (let i = 0; i < bodies.length; i++) {
     if (bodies[i].volume != null) volume += bodies[i].volume;
   }
~~~
<ul>
<li><code>-</code> lines (red): removed. <code>+</code> lines (green): added. No sign: unchanged context.</li>
<li><code>@@ -120,7 +120,7 @@</code>: the location, "from line 120, 7 lines before / 7 lines after".</li>
<li>Here the loop started at <code>i = 1</code>: the first body was forgotten! The fix makes it start at 0.</li>
</ul>
<h3>Code <span class="term" data-term="review">review</span></h3>
<p>Before merging, someone else reads it. In the 3D Reader project the method is strict:</p>
<ol>
<li>One agent writes the work.</li>
<li>A <strong>different</strong>, independent, read-only agent reviews it (it did not write the code, so no blind spot).</li>
<li>Each reported defect is <strong>verified</strong>: is it real? Can it be reproduced?</li>
<li>Each <strong>confirmed</strong> defect is fixed <strong>with a test</strong> that would have caught it.</li>
<li>The whole suite is rerun (unit, build, e2e) to avoid <span class="term" data-term="regression">regressions</span>.</li>
</ol>
<div class="callout info">A <strong>regression</strong>: something that worked before and no longer works after a change. Enemy no. 1 of a growing app (3D Reader: more than 40,000 lines of JS).</div>
<h3>What to look for when reviewing?</h3>
<ul>
<li><strong>Correctness</strong>: is the computation right, including edge cases (empty list, 0, <code>null</code>)?</li>
<li><strong>Side effects</strong>: does the change break something elsewhere?</li>
<li><strong>Tests</strong>: is the change covered by a test?</li>
<li><strong>Readability</strong>: are names clear, comments up to date?</li>
<li><strong>Security / confidentiality</strong>: no key, no customer data in the diff?</li>
</ul>
<h3>Review vocabulary on GitHub</h3>
<table><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>
<tr><td><span class="term" data-term="lgtm">LGTM</span></td><td>"Looks good to me".</td></tr>
<tr><td><span class="term" data-term="nit">nit</span></td><td>Minor detail (a typo, a name), not blocking.</td></tr>
<tr><td>Request changes</td><td>Changes requested: blocking.</td></tr>
<tr><td>Approve</td><td>Formal approval of the PR.</td></tr>
<tr><td>Resolve conversation</td><td>Mark a comment as handled.</td></tr>
</tbody></table>
<div class="callout project">In 3D Reader, <strong>you</strong> merge the PRs. Claude prepares, tests, gets it reviewed; the final decision to put it in <code>main</code> (and therefore online) is yours.</div>`,
      },
      deep: {
        fr: `<h3>Le diff, comme la révision d’un plan</h3>
<p>Quand un plan passe de l’indice A à l’indice B, on ne relit pas tout le plan : on regarde le <strong>cartouche de révision</strong> et les zones entourées. Le diff, c’est ça : seulement ce qui a bougé.</p>
~~~text
  ligne inchangée          (contexte, pour se repérer)
- ancienne ligne           (barrée, en rouge)
+ nouvelle ligne           (ajoutée, en vert)
~~~
<p>Une ligne <em>modifiée</em> apparaît donc comme une ligne <code>-</code> suivie d’une ligne <code>+</code>.</p>
<h3>Pourquoi un relecteur différent ?</h3>
<p>Quand tu relis ta propre lettre, tu lis ce que tu <em>voulais</em> écrire, pas ce qui est écrit. Un collègue voit tout de suite la faute. Pour le code, pareil : l’auteur a un angle mort. D’où un relecteur indépendant.</p>
<h3>« Défaut confirmé + un test », pourquoi ?</h3>
<ul>
<li><strong>Confirmé</strong> : un relecteur peut se tromper. On vérifie avant de toucher au code.</li>
<li><strong>Un test</strong> : le test garde la mémoire du bug. Si un jour quelqu’un réintroduit l’erreur, la CI devient rouge immédiatement.</li>
</ul>
<p>C’est la logique d’une action corrective qualité : on corrige la pièce, et on ajoute un point de contrôle pour que la dérive ne revienne pas.</p>
<h3>Petit exercice de lecture</h3>
~~~diff
-  const marge = 5;
+  const marge = 0;
~~~
<p>Question de relecteur : « Pourquoi passer la marge à 0 ? Est-ce voulu ? Quel test le vérifie ? ». Une bonne revue pose des <em>questions</em>, elle ne fait pas que dire « OK ».</p>`,
        en: `<h3>The diff, like a drawing revision</h3>
<p>When a drawing goes from revision A to revision B, you do not reread the whole drawing: you look at the <strong>revision block</strong> and the clouded areas. A diff is that: only what moved.</p>
~~~text
  unchanged line           (context, to find your way)
- old line                 (struck out, in red)
+ new line                 (added, in green)
~~~
<p>So a <em>modified</em> line shows up as a <code>-</code> line followed by a <code>+</code> line.</p>
<h3>Why a different reviewer?</h3>
<p>When you reread your own letter, you read what you <em>meant</em> to write, not what is written. A colleague spots the typo at once. Same for code: the author has a blind spot. Hence an independent reviewer.</p>
<h3>"Confirmed defect + one test", why?</h3>
<ul>
<li><strong>Confirmed</strong>: a reviewer can be wrong. Check before touching the code.</li>
<li><strong>One test</strong>: the test remembers the bug. If someone reintroduces the error one day, CI turns red at once.</li>
</ul>
<p>It is the logic of a quality corrective action: fix the part, and add an inspection point so the drift does not come back.</p>
<h3>Small reading exercise</h3>
~~~diff
-  const margin = 5;
+  const margin = 0;
~~~
<p>Reviewer's question: "Why set the margin to 0? Is it intended? Which test checks it?". A good review asks <em>questions</em>, it does not just say "OK".</p>`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'quality-6',
      title: { fr: 'Travailler avec Claude Code', en: 'Working with Claude Code' },
      skills: ['quality.claude'],
      minutes: 13,
      body: {
        fr: `<h3>Claude Code, un collègue développeur… qu’il faut bien briefer</h3>
<p>Claude Code est un <span class="term" data-term="agent">agent</span> : il lit le code, lance des commandes (tests, git), modifie des fichiers et pousse sur GitHub. Il travaille dans une <strong>session</strong>, souvent dans un conteneur dans le cloud, sur une copie fraîche du dépôt.</p>
<h3>Le prompt clair en 4 parties</h3>
<table><thead><tr><th>Partie</th><th>Exemple pour 3D Reader</th></tr></thead><tbody>
<tr><td><strong>Contexte</strong></td><td>« Dans la carte Plan de joint (web/engine/parting.js)… »</td></tr>
<tr><td><strong>Objectif</strong></td><td>« …la ligne doit suivre la surface libre, pas le plan moyen. »</td></tr>
<tr><td><strong>Contraintes</strong></td><td>« Ne change pas le chiffrage. Données synthétiques uniquement. »</td></tr>
<tr><td><strong>Critère de fin</strong></td><td>« Fini quand un test le prouve et que npm test + e2e sont verts. »</td></tr>
</tbody></table>
<div class="callout tip">Un critère de fin vérifiable (« les tests passent », « la carte affiche X ») évite le flou du « ça devrait marcher ».</div>
<h3>Branches, PR et qui décide</h3>
<ul>
<li>Claude travaille sur une <span class="term" data-term="branch">branche</span> dédiée, nommée par exemple <code>claude/3d-reader-uxw782</code>. Jamais directement sur <code>main</code>.</li>
<li>Il ouvre une <span class="term" data-term="pull-request">pull request</span> vers <code>main</code> (quand tu le demandes), suit la CI, répond aux revues.</li>
<li><strong>Toi</strong>, tu relis et tu fusionnes. La fusion met le code en ligne via GitHub Pages.</li>
</ul>
<h3>Agents et <span class="term" data-term="worktree">worktrees</span></h3>
<p>Pour un gros travail, Claude peut lancer plusieurs <strong>sous-agents</strong>, chacun sur un chantier (plan de joint, alimentation, tiroirs…). Chaque agent travaille dans un <em>worktree</em> : un deuxième dossier de travail du même dépôt, sur sa propre branche, pour ne pas se marcher sur les pieds. Puis un agent relecteur vérifie, et on fusionne (<code>git merge --no-ff</code>, qui garde la trace de la branche).</p>
<h3>La fenêtre de contexte et le fichier de reprise</h3>
<p>Claude a une mémoire de travail limitée : la <span class="term" data-term="context-window">fenêtre de contexte</span>. Une longue session finit par être résumée (compactée). Pour reprendre proprement dans une nouvelle session, on écrit un <strong>fichier de reprise</strong> (<em>handoff</em>) : règles, décisions, état des branches, liste des tâches en attente. La nouvelle session le lit en premier.</p>
<p>L’<strong>effort</strong> se règle aussi : bas pour le mécanique (fusionner, lancer les tests), élevé pour l’algorithmique et les relectures.</p>
<h3>Confidentialité : les règles d’or</h3>
<div class="callout warn"><ul>
<li>Ne <strong>jamais committer</strong> les classeurs de chiffrage (.xlsm/.xlsx), les données clients, les fichiers téléversés, les vrais chiffres.</li>
<li>Ne <strong>jamais coller une clé d’API</strong> dans le chat : elle va dans les variables d’environnement (Vercel, secrets GitHub).</li>
<li>Les valeurs par défaut du code sont neutres, les tests utilisent des données synthétiques.</li>
<li>Un dépôt public = tout le monde peut lire chaque commit, <em>même supprimé ensuite</em> (l’historique garde tout).</li>
</ul></div>
<h3>Vérifier ce que l’agent a fait</h3>
<ol>
<li>Lire le <strong>résumé</strong> de fin… puis vérifier, car un résumé n’est pas une preuve.</li>
<li>Regarder la PR : onglet <em>Files changed</em> (le diff), quels fichiers ont bougé ?</li>
<li>Regarder la CI : verte sur le <strong>dernier</strong> commit ?</li>
<li>Tester soi-même l’appli (en ligne ou en local) sur un cas connu.</li>
<li>En cas de doute, demander : « montre-moi le test qui prouve ceci ».</li>
</ol>`,
        en: `<h3>Claude Code, a developer colleague… who needs a good brief</h3>
<p>Claude Code is an <span class="term" data-term="agent">agent</span>: it reads code, runs commands (tests, git), edits files and pushes to GitHub. It works in a <strong>session</strong>, often in a cloud container, on a fresh copy of the repository.</p>
<h3>The clear prompt in 4 parts</h3>
<table><thead><tr><th>Part</th><th>Example for 3D Reader</th></tr></thead><tbody>
<tr><td><strong>Context</strong></td><td>"In the Parting line card (web/engine/parting.js)…"</td></tr>
<tr><td><strong>Goal</strong></td><td>"…the line must follow the free surface, not the mean plane."</td></tr>
<tr><td><strong>Constraints</strong></td><td>"Do not change the costing. Synthetic data only."</td></tr>
<tr><td><strong>Done criterion</strong></td><td>"Done when a test proves it and npm test + e2e are green."</td></tr>
</tbody></table>
<div class="callout tip">A checkable done criterion ("tests pass", "the card shows X") avoids the vagueness of "it should work".</div>
<h3>Branches, PRs and who decides</h3>
<ul>
<li>Claude works on a dedicated <span class="term" data-term="branch">branch</span>, named for example <code>claude/3d-reader-uxw782</code>. Never directly on <code>main</code>.</li>
<li>It opens a <span class="term" data-term="pull-request">pull request</span> to <code>main</code> (when you ask), follows CI, answers reviews.</li>
<li><strong>You</strong> review and merge. The merge puts the code online via GitHub Pages.</li>
</ul>
<h3>Agents and <span class="term" data-term="worktree">worktrees</span></h3>
<p>For a big job, Claude can start several <strong>sub-agents</strong>, each on one work item (parting line, gating, slides…). Each agent works in a <em>worktree</em>: a second working folder of the same repository, on its own branch, so they do not step on each other. Then a reviewer agent checks, and the work is merged (<code>git merge --no-ff</code>, which keeps a trace of the branch).</p>
<h3>The context window and the handoff file</h3>
<p>Claude has a limited working memory: the <span class="term" data-term="context-window">context window</span>. A long session is eventually summarised (compacted). To resume cleanly in a new session, you write a <strong>handoff file</strong>: rules, decisions, state of the branches, list of pending tasks. The new session reads it first.</p>
<p><strong>Effort</strong> can be tuned too: low for mechanical steps (merging, running tests), high for algorithms and reviews.</p>
<h3>Confidentiality: the golden rules</h3>
<div class="callout warn"><ul>
<li><strong>Never commit</strong> the costing workbooks (.xlsm/.xlsx), customer data, uploaded files, real figures.</li>
<li><strong>Never paste an API key</strong> in the chat: it goes into environment variables (Vercel, GitHub secrets).</li>
<li>Code defaults are neutral, tests use synthetic data.</li>
<li>A public repository = everyone can read every commit, <em>even if deleted later</em> (history keeps everything).</li>
</ul></div>
<h3>Checking what the agent did</h3>
<ol>
<li>Read the final <strong>summary</strong>… then check, because a summary is not proof.</li>
<li>Look at the PR: <em>Files changed</em> tab (the diff), which files moved?</li>
<li>Look at CI: green on the <strong>latest</strong> commit?</li>
<li>Try the app yourself (online or locally) on a known case.</li>
<li>When in doubt, ask: "show me the test that proves this".</li>
</ol>`,
      },
      deep: {
        fr: `<h3>Claude Code, comme un sous-traitant très rapide</h3>
<p>Tu confies un usinage à un sous-traitant. Pour que ça se passe bien, tu lui donnes :</p>
<ul>
<li>un <strong>plan</strong> (le contexte : quelle pièce, quel fichier) ;</li>
<li>un <strong>cahier des charges</strong> (l’objectif) ;</li>
<li>des <strong>contraintes</strong> (matière, tolérances, ne pas toucher à telle face) ;</li>
<li>un <strong>critère de réception</strong> (le contrôle qui dira « pièce bonne »).</li>
</ul>
<p>Et à la livraison, tu <strong>contrôles à réception</strong> : tu ne crois pas le bon de livraison sur parole. Avec Claude, c’est exactement pareil : diff, CI verte, essai réel.</p>
<h3>La branche, c’est l’établi séparé</h3>
~~~text
main ────●────●──────────────●  (la version en ligne, propre)
               \            /
 claude/…       ●───●───●──    (l'établi de Claude ; fusion par TOI)
~~~
<p>Claude bricole sur son établi ; rien n’arrive dans la vitrine (<code>main</code>, le site en ligne) tant que tu n’as pas fusionné.</p>
<h3>La fenêtre de contexte, c’est le bureau de Claude</h3>
<p>Son bureau a une taille limitée. Quand il est plein, Claude range (résume) les vieux papiers. Le fichier de reprise, c’est le « dossier de passation » qu’on laisse pour la personne suivante : où on en est, ce qui est décidé, ce qui reste à faire.</p>
<h3>Le secret, c’est comme un plan client confidentiel</h3>
<p>Tu n’enverrais pas un plan client confidentiel par la poste sans enveloppe. Un commit sur un dépôt public, c’est une carte postale : tout le monde peut la lire, et elle reste dans l’historique même si on la « supprime » ensuite. Donc : classeurs de chiffrage, données clients, clés d’API → jamais dans un commit, jamais dans le chat.</p>`,
        en: `<h3>Claude Code, like a very fast subcontractor</h3>
<p>You hand a machining job to a subcontractor. For it to go well, you give them:</p>
<ul>
<li>a <strong>drawing</strong> (the context: which part, which file);</li>
<li>a <strong>specification</strong> (the goal);</li>
<li><strong>constraints</strong> (material, tolerances, do not touch this face);</li>
<li>an <strong>acceptance criterion</strong> (the inspection that will say "good part").</li>
</ul>
<p>And on delivery you do <strong>incoming inspection</strong>: you do not take the delivery note at its word. With Claude it is exactly the same: diff, green CI, real try-out.</p>
<h3>The branch is the separate workbench</h3>
~~~text
main ────●────●──────────────●  (the online version, clean)
               \            /
 claude/…       ●───●───●──    (Claude's workbench; merged by YOU)
~~~
<p>Claude tinkers on its workbench; nothing reaches the shop window (<code>main</code>, the online site) until you have merged.</p>
<h3>The context window is Claude's desk</h3>
<p>The desk has a limited size. When it is full, Claude tidies up (summarises) old papers. The handoff file is the "handover folder" you leave for the next person: where we are, what was decided, what remains.</p>
<h3>Secrets are like a confidential customer drawing</h3>
<p>You would not mail a confidential customer drawing without an envelope. A commit on a public repository is a postcard: everyone can read it, and it stays in the history even if "deleted" later. So: costing workbooks, customer data, API keys → never in a commit, never in the chat.</p>`,
      },
    },
  ],
  questions: [
    // ---------------------------------------------------------------- lesson 1 (why)
    {
      id: 'quality-q1', skill: 'quality.why', lesson: 'quality-1', level: 1, type: 'order',
      prompt: { fr: 'Remets dans l’ordre les trois étapes d’un test.', en: 'Put the three steps of a test in order.' },
      items: { fr: ['Préparer une entrée connue', 'Appeler la fonction à vérifier', 'Comparer obtenu et attendu (assertion)'], en: ['Arrange a known input', 'Call the function under test', 'Compare actual and expected (assertion)'] },
      explain: { fr: 'Préparer → Agir → Vérifier (en anglais <em>Arrange, Act, Assert</em>). Sans entrée connue, on ne peut pas savoir quel résultat attendre.', en: 'Arrange → Act → Assert. Without a known input you cannot know which result to expect.' },
    },
    {
      id: 'quality-q2', skill: 'quality.why', lesson: 'quality-1', level: 1, type: 'multi',
      prompt: { fr: 'Lesquels sont des <strong>cas limites</strong> utiles à tester pour un calcul de volume ?', en: 'Which are useful <strong>edge cases</strong> to test for a volume computation?' },
      choices: { fr: ['Une liste de corps vide', 'Un maillage ouvert (avec un trou)', 'Un fichier en mètres au lieu de mm', 'Un cube ordinaire de 10 mm'], en: ['An empty body list', 'An open mesh (with a hole)', 'A file in metres instead of mm', 'An ordinary 10 mm cube'] },
      answer: [0, 1, 2],
      explain: { fr: 'Le cube ordinaire est le cas <em>normal</em>. Les cas limites sont aux extrémités : vide, cassé, mauvaise unité, énorme. C’est là que se cachent les bugs.', en: 'The ordinary cube is the <em>normal</em> case. Edge cases sit at the extremes: empty, broken, wrong unit, huge. That is where bugs hide.' },
    },
    {
      id: 'quality-q3', skill: 'quality.why', lesson: 'quality-1', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi les tests de 3D Reader utilisent-ils des données <strong>synthétiques</strong> ?', en: 'Why do the 3D Reader tests use <strong>synthetic</strong> data?' },
      choices: { fr: ['Parce qu’on connaît leur résultat exact et qu’elles ne contiennent aucun secret', 'Parce que les vraies pièces sont trop petites', 'Parce que Node ne sait pas lire de vrais fichiers', 'Pour que les tests soient plus lents'], en: ['Because their exact result is known and they contain no secret', 'Because real parts are too small', 'Because Node cannot read real files', 'To make the tests slower'] },
      answer: 0,
      explain: { fr: 'Un pavé de 10×20×30 a un volume connu (6000 mm³) : parfait pour vérifier. Et le dépôt est public : jamais de vraies données de chiffrage ou de clients.', en: 'A 10×20×30 box has a known volume (6000 mm³): perfect for checking. And the repository is public: never real costing or customer data.' },
    },
    {
      id: 'quality-q4', skill: 'quality.why', lesson: 'quality-1', level: 2, type: 'tf',
      prompt: { fr: 'Un test qui passe prouve que le programme n’a <strong>aucun</strong> bug.', en: 'A passing test proves the program has <strong>no</strong> bug at all.' },
      answer: false,
      explain: { fr: 'Il prouve seulement que <em>ce cas</em> fonctionne. D’où l’intérêt de tester beaucoup de cas variés, comme un plan de contrôle complet.', en: 'It only proves that <em>this case</em> works. Hence testing many varied cases, like a complete inspection plan.' },
    },
    // ---------------------------------------------------------------- lesson 2 (unit)
    {
      id: 'quality-q5', skill: 'quality.unit', lesson: 'quality-2', level: 1, type: 'fill',
      prompt: { fr: 'Complète l’import du lanceur de tests intégré à Node.', en: 'Complete the import of the test runner built into Node.' },
      code: "import { test } from '____';", lang: 'js',
      accept: ['node:test'],
      explain: { fr: '<code>node:test</code> est le module de test fourni avec Node. Le préfixe <code>node:</code> signale un module intégré (pas besoin de npm install).', en: '<code>node:test</code> is the test module shipped with Node. The <code>node:</code> prefix marks a built-in module (no npm install needed).' },
    },
    {
      id: 'quality-q6', skill: 'quality.unit', lesson: 'quality-2', level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui <strong>vérifie</strong> le résultat (l’assertion).', en: 'Click the line that <strong>checks</strong> the result (the assertion).' },
      code: "test('two boxes', () => {\n  const a = boxBody([10, 20, 30]);\n  const b = boxBody([2, 2, 2]);\n  const s = summarize([a, b]);\n  approx(s.volume, 6008, 1e-12, 0, 'volume');\n});",
      lang: 'js', answer: 4,
      explain: { fr: '<code>approx(...)</code> compare le volume obtenu à 6008 avec une tolérance. Les lignes précédentes préparent et agissent.', en: '<code>approx(...)</code> compares the actual volume with 6008 within a tolerance. The lines before arrange and act.' },
    },
    {
      id: 'quality-q7', skill: 'quality.unit', lesson: 'quality-2', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque outil à son rôle.', en: 'Match each tool with its role.' },
      pairs: {
        fr: [['assert.equal', 'vérifier une égalité stricte'], ['assert.throws', 'vérifier qu’une erreur est levée'], ['approx', 'comparer avec une tolérance'], ['tmp_path (pytest)', 'dossier temporaire neuf par test']],
        en: [['assert.equal', 'check a strict equality'], ['assert.throws', 'check that an error is thrown'], ['approx', 'compare within a tolerance'], ['tmp_path (pytest)', 'fresh temporary folder per test']],
      },
      explain: { fr: 'Ces quatre outils couvrent la plupart des tests de 3D Reader, en JS comme en Python.', en: 'These four tools cover most 3D Reader tests, in JS as in Python.' },
    },
    {
      id: 'quality-q8', skill: 'quality.unit', lesson: 'quality-2', level: 1, type: 'mcq',
      prompt: { fr: 'Comment pytest trouve-t-il les tests à lancer ?', en: 'How does pytest find the tests to run?' },
      choices: { fr: ['Les fonctions dont le nom commence par test_', 'Les fonctions marquées en rouge', 'Il faut les lister dans package.json', 'Il lance toutes les fonctions du projet'], en: ['Functions whose name starts with test_', 'Functions marked in red', 'They must be listed in package.json', 'It runs every function of the project'] },
      answer: 0,
      explain: { fr: 'Convention de pytest : fichiers <code>test_*.py</code>, fonctions <code>test_*</code>. Rien d’autre à déclarer.', en: 'pytest convention: <code>test_*.py</code> files, <code>test_*</code> functions. Nothing else to declare.' },
    },
    // ---------------------------------------------------------------- lesson 3 (e2e)
    {
      id: 'quality-q9', skill: 'quality.e2e', lesson: 'quality-3', level: 1, type: 'mcq',
      prompt: { fr: 'Que veut dire un navigateur « sans tête » (headless) ?', en: 'What does a "headless" browser mean?' },
      choices: { fr: ['Il tourne sans fenêtre visible', 'Il n’a pas de moteur JavaScript', 'Il n’affiche que le texte', 'Il ne peut pas cliquer'], en: ['It runs without a visible window', 'It has no JavaScript engine', 'It only shows text', 'It cannot click'] },
      answer: 0,
      explain: { fr: 'Le navigateur est complet (JS, rendu, clics), mais sans écran : idéal pour un serveur de CI.', en: 'The browser is complete (JS, rendering, clicks) but has no screen: ideal for a CI server.' },
    },
    {
      id: 'quality-q10', skill: 'quality.e2e', lesson: 'quality-3', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre un test e2e d’ouverture de fichier.', en: 'Put an e2e file-opening test in order.' },
      items: { fr: ['page.goto(url)', "page.setInputFiles('#file-input', …)", "page.waitForSelector('#viewport canvas')", "lire #total-volume et comparer"], en: ['page.goto(url)', "page.setInputFiles('#file-input', …)", "page.waitForSelector('#viewport canvas')", 'read #total-volume and compare'] },
      explain: { fr: 'Aller → Agir → Attendre → Vérifier. Sauter l’attente ferait lire une valeur pas encore calculée.', en: 'Go → Act → Wait → Check. Skipping the wait would read a value not yet computed.' },
    },
    {
      id: 'quality-q11', skill: 'quality.e2e', lesson: 'quality-3', level: 2, type: 'multi',
      prompt: { fr: 'Pourquoi les tests e2e de 3D Reader sont-ils lents ?', en: 'Why are the 3D Reader e2e tests slow?' },
      choices: { fr: ['Il faut construire puis servir le site', 'OpenCascade (WebAssembly) doit être téléchargé et compilé', 'Le rendu 3D se fait sans carte graphique', 'Node.js est interdit sur la CI'], en: ['The site must be built then served', 'OpenCascade (WebAssembly) must be downloaded and compiled', '3D rendering runs without a graphics card', 'Node.js is forbidden on CI'] },
      answer: [0, 1, 2],
      explain: { fr: 'Construction, chargement du moteur CAO (jusqu’à 240 s prévues pour un fichier CAO sur la CI) et rendu logiciel. Node, lui, est bien utilisé.', en: 'Build, loading the CAD engine (up to 240 s allowed for a CAD file on CI) and software rendering. Node is very much used.' },
    },
    {
      id: 'quality-q12', skill: 'quality.e2e', lesson: 'quality-3', level: 3, type: 'tf',
      prompt: { fr: '<code>await page.waitForTimeout(2000)</code> est la meilleure façon d’attendre la fin d’un calcul.', en: '<code>await page.waitForTimeout(2000)</code> is the best way to wait for a computation to end.' },
      answer: false,
      explain: { fr: 'Une durée fixe est trop longue sur une machine rapide et trop courte sur une machine lente (→ test instable). On attend une <em>condition</em> : <code>waitForFunction</code>, <code>waitForSelector</code>.', en: 'A fixed delay is too long on a fast machine and too short on a slow one (→ flaky test). Wait for a <em>condition</em>: <code>waitForFunction</code>, <code>waitForSelector</code>.' },
    },
    // ---------------------------------------------------------------- lesson 4 (ci)
    {
      id: 'quality-q13', skill: 'quality.ci', lesson: 'quality-4', level: 1, type: 'mcq',
      prompt: { fr: 'Dans un message d’échec, que montrent <code>expected</code> et <code>actual</code> ?', en: 'In a failure message, what do <code>expected</code> and <code>actual</code> show?' },
      choices: { fr: ['La valeur attendue et la valeur obtenue', 'La date et l’heure du test', 'Le nom de l’auteur et du relecteur', 'La version de Node et de Python'], en: ['The expected value and the actual value', 'The date and time of the test', 'The author and reviewer names', 'The Node and Python versions'] },
      answer: 0,
      explain: { fr: 'C’est le cœur du diagnostic : l’écart entre ce qu’on voulait et ce qu’on a eu oriente vers la cause.', en: 'This is the heart of the diagnosis: the gap between what was wanted and what was obtained points to the cause.' },
    },
    {
      id: 'quality-q14', skill: 'quality.ci', lesson: 'quality-4', level: 2, type: 'multi',
      prompt: { fr: 'La CI est rouge à cause d’un test. Quelles actions sont <strong>acceptables</strong> ?', en: 'CI is red because of a test. Which actions are <strong>acceptable</strong>?' },
      choices: { fr: ['Reproduire l’échec en local avec la même commande', 'Corriger le code puis pousser', 'Ajouter test.skip pour avoir du vert', 'Pousser un commit vide pour relancer', 'Rendre robuste un test qui dépend d’une attente fixe'], en: ['Reproduce the failure locally with the same command', 'Fix the code then push', 'Add test.skip to get green', 'Push an empty commit to rerun', 'Make robust a test that depends on a fixed wait'] },
      answer: [0, 1, 4],
      explain: { fr: 'Désactiver un test ou relancer à vide cache le problème au lieu de le régler.', en: 'Disabling a test or rerunning empty hides the problem instead of solving it.' },
    },
    {
      id: 'quality-q15', skill: 'quality.ci', lesson: 'quality-4', level: 2, type: 'line',
      prompt: { fr: 'Dans ce journal, clique sur la ligne qui indique <strong>où</strong> l’assertion du test a échoué.', en: 'In this log, click the line that tells <strong>where</strong> the test assertion failed.' },
      code: "not ok 3 - totals follow model.py summarize\n  error: 'volume: 6000 != 6008'\n  stack: |-\n    approx (tests/js/helpers.mjs:36:10)\n    TestContext.<anonymous> (tests/js/summary.test.mjs:95:3)\n# fail 1",
      lang: 'text', answer: 4,
      explain: { fr: 'La pile montre <code>approx</code> (l’outil), puis l’endroit du test qui l’a appelé : <code>summary.test.mjs:95</code>. C’est là qu’on va lire.', en: 'The stack shows <code>approx</code> (the tool), then the place in the test that called it: <code>summary.test.mjs:95</code>. That is where you go and read.' },
    },
    {
      id: 'quality-q16', skill: 'quality.ci', lesson: 'quality-4', level: 3, type: 'mcq',
      prompt: { fr: 'Un test de durée échoue sur la CI, puis passe quand on le relance seul. Quelle est la bonne conclusion ?', en: 'A timing test fails on CI, then passes when rerun alone. What is the right conclusion?' },
      choices: { fr: ['« Flaky » ne suffit pas : chercher la cause (machine chargée ?) et rendre le test robuste', 'C’est un flake, on l’ignore pour toujours', 'Il faut supprimer le test', 'Le code est forcément correct'], en: ['"Flaky" is not enough: find the cause (loaded machine?) and make the test robust', 'It is a flake, ignore it forever', 'The test must be deleted', 'The code is necessarily correct'] },
      answer: 0,
      explain: { fr: '« Flaky » n’est pas une cause racine. Dans 3D Reader, ces tests échouent quand plusieurs agents chargent la machine : la cause est connue et documentée.', en: '"Flaky" is not a root cause. In 3D Reader these tests fail when several agents load the machine: the cause is known and documented.' },
    },
    // ---------------------------------------------------------------- lesson 5 (review)
    {
      id: 'quality-q17', skill: 'quality.review', lesson: 'quality-5', level: 1, type: 'mcq',
      prompt: { fr: 'Dans un diff, que signifie une ligne qui commence par <code>+</code> ?', en: 'In a diff, what does a line starting with <code>+</code> mean?' },
      choices: { fr: ['Ligne ajoutée', 'Ligne supprimée', 'Ligne inchangée', 'Ligne commentée'], en: ['Added line', 'Removed line', 'Unchanged line', 'Commented line'] },
      answer: 0,
      explain: { fr: '<code>+</code> = ajouté (vert), <code>-</code> = supprimé (rouge), sans signe = contexte.', en: '<code>+</code> = added (green), <code>-</code> = removed (red), no sign = context.' },
    },
    {
      id: 'quality-q18', skill: 'quality.review', lesson: 'quality-5', level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne du diff qui <strong>corrige</strong> le bug (le premier corps oublié).', en: 'Click the diff line that <strong>fixes</strong> the bug (the forgotten first body).' },
      code: "@@ -120,7 +120,7 @@\n   let volume = 0;\n-  for (let i = 1; i < bodies.length; i++) {\n+  for (let i = 0; i < bodies.length; i++) {\n     if (bodies[i].volume != null) volume += bodies[i].volume;\n   }",
      lang: 'diff', answer: 3,
      explain: { fr: 'La ligne <code>+</code> fait démarrer la boucle à 0 : le premier élément d’un tableau JS a l’indice 0.', en: 'The <code>+</code> line starts the loop at 0: the first element of a JS array has index 0.' },
    },
    {
      id: 'quality-q19', skill: 'quality.review', lesson: 'quality-5', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque terme de revue à son sens.', en: 'Match each review term with its meaning.' },
      pairs: {
        fr: [['LGTM', 'ça me va'], ['nit', 'détail mineur, non bloquant'], ['Request changes', 'changements demandés, bloquant'], ['Régression', 'ce qui marchait ne marche plus']],
        en: [['LGTM', 'looks good to me'], ['nit', 'minor detail, not blocking'], ['Request changes', 'changes requested, blocking'], ['Regression', 'what worked no longer works']],
      },
      explain: { fr: 'Le jargon des revues GitHub : à connaître pour suivre une PR.', en: 'GitHub review jargon: needed to follow a PR.' },
    },
    {
      id: 'quality-q20', skill: 'quality.review', lesson: 'quality-5', level: 2, type: 'tf',
      prompt: { fr: 'Dans la méthode de 3D Reader, chaque défaut <strong>confirmé</strong> par la relecture est corrigé avec un test qui l’aurait détecté.', en: 'In the 3D Reader method, every defect <strong>confirmed</strong> by review is fixed with a test that would have caught it.' },
      answer: true,
      explain: { fr: 'Le test garde la mémoire du bug : s’il revient, la CI devient rouge.', en: 'The test remembers the bug: if it comes back, CI turns red.' },
    },
    // ---------------------------------------------------------------- lesson 6 (claude)
    {
      id: 'quality-q21', skill: 'quality.claude', lesson: 'quality-6', level: 1, type: 'order',
      prompt: { fr: 'Range les 4 parties d’un prompt clair dans l’ordre conseillé.', en: 'Put the 4 parts of a clear prompt in the advised order.' },
      items: { fr: ['Contexte', 'Objectif', 'Contraintes', 'Critère de fin'], en: ['Context', 'Goal', 'Constraints', 'Done criterion'] },
      explain: { fr: 'D’abord où on est, puis ce qu’on veut, les limites, et comment on saura que c’est fini.', en: 'First where we are, then what we want, the limits, and how we will know it is done.' },
    },
    {
      id: 'quality-q22', skill: 'quality.claude', lesson: 'quality-6', level: 1, type: 'multi',
      prompt: { fr: 'Qu’est-ce qui ne doit <strong>jamais</strong> être committé dans le dépôt 3D Reader ?', en: 'What must <strong>never</strong> be committed in the 3D Reader repository?' },
      choices: { fr: ['Les classeurs de chiffrage .xlsm/.xlsx', 'Une clé d’API', 'Les données clients et fichiers téléversés', 'Un test sur un pavé synthétique'], en: ['The .xlsm/.xlsx costing workbooks', 'An API key', 'Customer data and uploaded files', 'A test on a synthetic box'] },
      answer: [0, 1, 2],
      explain: { fr: 'Le dépôt est public et garde tout l’historique. Les données synthétiques, elles, sont faites pour être publiées.', en: 'The repository is public and keeps the whole history. Synthetic data, on the other hand, is made to be published.' },
    },
    {
      id: 'quality-q23', skill: 'quality.claude', lesson: 'quality-6', level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert un fichier de reprise (handoff) ?', en: 'What is a handoff file for?' },
      choices: { fr: ['Reprendre le travail dans une nouvelle session : règles, décisions, état, tâches en attente', 'Stocker les clés d’API', 'Remplacer les tests', 'Publier le site sur GitHub Pages'], en: ['Resume work in a new session: rules, decisions, state, pending tasks', 'Store API keys', 'Replace the tests', 'Publish the site on GitHub Pages'] },
      answer: 0,
      explain: { fr: 'La fenêtre de contexte d’une session est limitée ; le fichier de reprise transmet l’essentiel à la suivante.', en: 'A session’s context window is limited; the handoff file passes the essentials on to the next one.' },
    },
    {
      id: 'quality-q24', skill: 'quality.claude', lesson: 'quality-6', level: 2, type: 'tf',
      prompt: { fr: 'Dans le projet 3D Reader, c’est l’utilisateur (et non Claude) qui fusionne les pull requests dans main.', en: 'In the 3D Reader project, the user (not Claude) merges the pull requests into main.' },
      answer: true,
      explain: { fr: 'Claude prépare, teste et fait relire ; la fusion, qui met en ligne, reste ta décision.', en: 'Claude prepares, tests and gets it reviewed; the merge, which puts it online, stays your decision.' },
    },
    // ---------------------------------------------------------------- exam questions
    {
      id: 'quality-q25', skill: 'quality.why', level: 2, type: 'mcq',
      prompt: { fr: 'Un bug est corrigé. Que faut-il ajouter pour qu’il ne revienne jamais ?', en: 'A bug is fixed. What should be added so it never comes back?' },
      choices: { fr: ['Un test de non-régression', 'Un commentaire « ne pas toucher »', 'Un commit vide', 'Une nouvelle branche main'], en: ['A regression test', 'A "do not touch" comment', 'An empty commit', 'A new main branch'] },
      answer: 0,
      explain: { fr: 'Le test de non-régression échoue si le bug réapparaît : la CI alerte immédiatement.', en: 'The regression test fails if the bug reappears: CI alerts immediately.' },
    },
    {
      id: 'quality-q26', skill: 'quality.unit', level: 2, type: 'fill',
      prompt: { fr: 'Quelle commande npm lance tous les tests unitaires JS du projet ?', en: 'Which npm command runs all the JS unit tests of the project?' },
      accept: ['npm test', 'npm run test', 'npm t'],
      explain: { fr: '<code>npm test</code> exécute le script <code>"test": "node --test tests/js/*.test.mjs"</code> de <code>package.json</code>.', en: '<code>npm test</code> runs the <code>"test": "node --test tests/js/*.test.mjs"</code> script of <code>package.json</code>.' },
    },
    {
      id: 'quality-q27', skill: 'quality.unit', level: 3, type: 'mcq',
      prompt: { fr: 'Avec <code>approx(actual, 6000, 0.01)</code>, quelle valeur passe ?', en: 'With <code>approx(actual, 6000, 0.01)</code>, which value passes?' },
      code: 'tol = max(rel * |expected|, abs)', lang: 'text',
      choices: { fr: ['6050', '6100', '5900', '6061'], en: ['6050', '6100', '5900', '6061'] },
      answer: 0,
      explain: { fr: 'Tolérance = 0,01 × 6000 = 60. Seul 6050 est à moins de 60 de 6000.', en: 'Tolerance = 0.01 × 6000 = 60. Only 6050 is within 60 of 6000.' },
    },
    {
      id: 'quality-q28', skill: 'quality.e2e', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque appel Playwright à son verbe.', en: 'Match each Playwright call with its verb.' },
      pairs: {
        fr: [['page.goto', 'aller'], ['page.click', 'agir'], ['page.waitForSelector', 'attendre'], ['locator().textContent + assert', 'vérifier']],
        en: [['page.goto', 'go'], ['page.click', 'act'], ['page.waitForSelector', 'wait'], ['locator().textContent + assert', 'check']],
      },
      explain: { fr: 'Aller, agir, attendre, vérifier : la structure de presque tous les tests e2e.', en: 'Go, act, wait, check: the structure of nearly every e2e test.' },
    },
    {
      id: 'quality-q29', skill: 'quality.ci', level: 2, type: 'tf',
      prompt: { fr: 'Le workflow <code>pages.yml</code> de 3D Reader publie un commit de main même si la CI a échoué dessus.', en: 'The 3D Reader <code>pages.yml</code> workflow publishes a commit of main even when CI failed on it.' },
      answer: false,
      explain: { fr: 'Il attend que la CI (<code>ci.yml</code>) ait réussi sur ce commit : un code qui casse les tests n’est jamais publié.', en: 'It waits for CI (<code>ci.yml</code>) to succeed on that commit: code that breaks the tests is never published.' },
    },
    {
      id: 'quality-q30', skill: 'quality.ci', level: 1, type: 'order',
      prompt: { fr: 'Remets dans l’ordre les étapes de la CI de 3D Reader.', en: 'Put the steps of the 3D Reader CI in order.' },
      items: { fr: ['pytest (moteur Python)', 'npm test (moteur JS)', 'npm run build (site statique)', 'npm run test:e2e (navigateur)'], en: ['pytest (Python engine)', 'npm test (JS engine)', 'npm run build (static site)', 'npm run test:e2e (browser)'] },
      explain: { fr: 'Du plus rapide et plus ciblé au plus lent et plus complet : le e2e a besoin du site construit.', en: 'From fastest and most targeted to slowest and most complete: e2e needs the built site.' },
    },
    {
      id: 'quality-q31', skill: 'quality.review', level: 3, type: 'multi',
      prompt: { fr: 'Que doit vérifier un bon relecteur dans une PR ?', en: 'What should a good reviewer check in a PR?' },
      choices: { fr: ['Les cas limites (vide, null, 0)', 'Qu’un test couvre le changement', 'Qu’aucune clé ni donnée client n’est dans le diff', 'Que la PR contient beaucoup de lignes'], en: ['Edge cases (empty, null, 0)', 'That a test covers the change', 'That no key or customer data is in the diff', 'That the PR has many lines'] },
      answer: [0, 1, 2],
      explain: { fr: 'La taille n’est pas une qualité. Exactitude, tests et confidentialité, si.', en: 'Size is not a quality. Correctness, tests and confidentiality are.' },
    },
    {
      id: 'quality-q32', skill: 'quality.claude', level: 2, type: 'mcq',
      prompt: { fr: 'Claude annonce « tout est fait, les tests passent ». Quelle est la meilleure réaction ?', en: 'Claude says "all done, tests pass". What is the best reaction?' },
      choices: { fr: ['Vérifier le diff, la CI du dernier commit et essayer l’appli', 'Fusionner tout de suite sans regarder', 'Supprimer la branche', 'Lui redemander la même chose'], en: ['Check the diff, the CI of the latest commit and try the app', 'Merge immediately without looking', 'Delete the branch', 'Ask it the same thing again'] },
      answer: 0,
      explain: { fr: 'Un résumé n’est pas une preuve : contrôle à réception, comme pour un sous-traitant.', en: 'A summary is not proof: incoming inspection, as with a subcontractor.' },
    },
    {
      id: 'quality-q33', skill: 'quality.claude', level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi chaque sous-agent travaille-t-il dans son propre <strong>worktree</strong> ?', en: 'Why does each sub-agent work in its own <strong>worktree</strong>?' },
      choices: { fr: ['Pour avoir un dossier et une branche à lui, sans écraser le travail des autres', 'Pour aller plus vite sur Internet', 'Parce que GitHub l’exige pour toute PR', 'Pour cacher le code à l’utilisateur'], en: ['To have its own folder and branch, without overwriting the others’ work', 'To go faster on the Internet', 'Because GitHub requires it for every PR', 'To hide the code from the user'] },
      answer: 0,
      explain: { fr: 'Un worktree est un deuxième dossier de travail du même dépôt : chantiers parallèles, puis fusion contrôlée.', en: 'A worktree is a second working folder of the same repository: parallel work items, then a controlled merge.' },
    },
    // ---------------------------------------------------------------- extra (remediation)
    {
      id: 'quality-q34', skill: 'quality.why', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un test est un programme qui vérifie automatiquement qu’un autre programme donne le bon résultat.', en: 'A test is a program that automatically checks that another program gives the right result.' },
      answer: true,
      explain: { fr: 'C’est un gabarit de contrôle automatique et répétable.', en: 'It is an automatic, repeatable inspection gauge.' },
    },
    {
      id: 'quality-q35', skill: 'quality.why', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi <code>0.1 + 0.2 === 0.3</code> vaut <code>false</code> en JavaScript ?', en: 'Why is <code>0.1 + 0.2 === 0.3</code> <code>false</code> in JavaScript?' },
      choices: { fr: ['Les nombres à virgule sont stockés de façon approchée en binaire', 'JavaScript ne sait pas additionner', 'Il faut écrire 0,1 avec une virgule', '=== ne marche que pour les textes'], en: ['Decimal numbers are stored approximately in binary', 'JavaScript cannot add', 'You must write 0,1 with a comma', '=== only works for text'] },
      answer: 0,
      explain: { fr: 'D’où les tolérances (<code>approx</code>, <code>pytest.approx</code>) pour comparer des nombres réels.', en: 'Hence tolerances (<code>approx</code>, <code>pytest.approx</code>) to compare real numbers.' },
    },
    {
      id: 'quality-q36', skill: 'quality.why', extra: true, level: 3, type: 'match',
      prompt: { fr: 'Associe chaque famille de test à ce qu’elle vérifie.', en: 'Match each test family with what it checks.' },
      pairs: {
        fr: [['Unitaire', 'une fonction seule'], ['Intégration', 'plusieurs morceaux ensemble'], ['Bout en bout', 'le site complet dans un navigateur']],
        en: [['Unit', 'one function alone'], ['Integration', 'several pieces together'], ['End-to-end', 'the whole site in a browser']],
      },
      explain: { fr: 'Comme vérifier la vis, puis le sous-ensemble, puis faire rouler la voiture.', en: 'Like checking the screw, then the subassembly, then driving the car.' },
    },
    {
      id: 'quality-q37', skill: 'quality.unit', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que fait <code>assert.equal(s.bodies, 2)</code> ?', en: 'What does <code>assert.equal(s.bodies, 2)</code> do?' },
      choices: { fr: ['Il vérifie que s.bodies vaut 2, sinon le test échoue', 'Il met s.bodies à 2', 'Il affiche 2 à l’écran', 'Il crée deux corps'], en: ['It checks that s.bodies equals 2, otherwise the test fails', 'It sets s.bodies to 2', 'It prints 2 on screen', 'It creates two bodies'] },
      answer: 0,
      explain: { fr: 'Une assertion ne modifie rien : elle certifie, ou elle fait échouer le test.', en: 'An assertion changes nothing: it certifies, or it fails the test.' },
    },
    {
      id: 'quality-q38', skill: 'quality.unit', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'Complète pour vérifier qu’une liste vide provoque une erreur.', en: 'Complete to check that an empty list throws an error.' },
      code: "assert.____(() => summarize([]), /No geometry found in file/);", lang: 'js',
      accept: ['throws'],
      explain: { fr: '<code>assert.throws(fonction, motif)</code> appelle la fonction et vérifie qu’elle lève une erreur dont le message correspond.', en: '<code>assert.throws(fn, pattern)</code> calls the function and checks it throws an error whose message matches.' },
    },
    {
      id: 'quality-q39', skill: 'quality.unit', extra: true, level: 3, type: 'tf',
      prompt: { fr: 'Une <strong>fixture</strong> est une donnée de test préparée à l’avance (fichier, résultat de référence, dossier temporaire).', en: 'A <strong>fixture</strong> is test data prepared in advance (file, reference result, temporary folder).' },
      answer: true,
      explain: { fr: 'Dans 3D Reader : les fichiers générés par <code>make_fixtures.py</code> et <code>expected.json</code> ; en pytest, <code>tmp_path</code>.', en: 'In 3D Reader: the files generated by <code>make_fixtures.py</code> and <code>expected.json</code>; in pytest, <code>tmp_path</code>.' },
    },
    {
      id: 'quality-q40', skill: 'quality.e2e', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un test e2e utilise un vrai navigateur pour ouvrir le site et cliquer comme un visiteur.', en: 'An e2e test uses a real browser to open the site and click like a visitor.' },
      answer: true,
      explain: { fr: 'Playwright pilote Chromium, sans fenêtre, sur la CI.', en: 'Playwright drives Chromium, without a window, on CI.' },
    },
    {
      id: 'quality-q41', skill: 'quality.e2e', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'Complète pour aller à l’adresse du site dans Playwright.', en: 'Complete to go to the site address in Playwright.' },
      code: 'await page.____(url);', lang: 'js',
      accept: ['goto'],
      explain: { fr: '<code>page.goto(url)</code> charge la page, comme taper l’adresse dans la barre du navigateur.', en: '<code>page.goto(url)</code> loads the page, like typing the address in the browser bar.' },
    },
    {
      id: 'quality-q42', skill: 'quality.e2e', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Les fichiers e2e tournent en parallèle. Quel est le risque ?', en: 'The e2e files run in parallel. What is the risk?' },
      choices: { fr: ['Sur une machine très chargée, un test chronométré peut dépasser son délai', 'Les tests se mélangent les fichiers STEP', 'Le site est publié deux fois', 'Aucun risque'], en: ['On a heavily loaded machine, a timed test may exceed its delay', 'The tests mix up the STEP files', 'The site is published twice', 'No risk'] },
      answer: 0,
      explain: { fr: 'Le parallélisme fait gagner du temps mais partage le processeur : les délais deviennent plus serrés.', en: 'Parallelism saves time but shares the CPU: timeouts get tighter.' },
    },
    {
      id: 'quality-q43', skill: 'quality.ci', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie une croix rouge à côté d’un commit sur GitHub ?', en: 'What does a red cross next to a commit on GitHub mean?' },
      choices: { fr: ['Au moins une étape de la CI a échoué', 'Le commit est supprimé', 'Le site est hors ligne', 'Le commit n’a pas d’auteur'], en: ['At least one CI step failed', 'The commit is deleted', 'The site is offline', 'The commit has no author'] },
      answer: 0,
      explain: { fr: 'On ouvre le run dans l’onglet Actions pour voir quelle étape est rouge.', en: 'Open the run in the Actions tab to see which step is red.' },
    },
    {
      id: 'quality-q44', skill: 'quality.ci', extra: true, level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre la méthode face à une CI rouge.', en: 'Put in order the method for a red CI.' },
      items: { fr: ['Ouvrir le run et trouver l’étape rouge', 'Trouver la première ligne « not ok » / Error', 'Noter attendu, obtenu, fichier:ligne', 'Reproduire en local', 'Corriger la cause et repousser'], en: ['Open the run and find the red step', 'Find the first "not ok" / Error line', 'Write down expected, actual, file:line', 'Reproduce locally', 'Fix the cause and push again'] },
      explain: { fr: 'Diagnostiquer avant de corriger, comme pour une non-conformité.', en: 'Diagnose before fixing, as for a non-conformity.' },
    },
    {
      id: 'quality-q45', skill: 'quality.ci', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Le test passe chez toi mais échoue sur la CI. Quelle piste est la plus probable ?', en: 'The test passes on your machine but fails on CI. Which lead is most likely?' },
      choices: { fr: ['Une différence d’environnement (fichier non commité, version de Node, machine plus lente)', 'GitHub est en panne pour toujours', 'Le test est forcément faux', 'Il faut changer de langage'], en: ['An environment difference (uncommitted file, Node version, slower machine)', 'GitHub is down forever', 'The test is necessarily wrong', 'You must change language'] },
      answer: 0,
      explain: { fr: 'La CI part d’une machine neuve avec seulement ce qui est commité : un oubli de <code>git add</code> est un grand classique.', en: 'CI starts from a fresh machine with only what is committed: a forgotten <code>git add</code> is a classic.' },
    },
    {
      id: 'quality-q46', skill: 'quality.review', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie le commentaire de revue « nit: typo dans le nom » ?', en: 'What does the review comment "nit: typo in the name" mean?' },
      choices: { fr: ['Un détail mineur, non bloquant', 'Un défaut de sécurité grave', 'Une demande de supprimer la PR', 'Une approbation'], en: ['A minor, non-blocking detail', 'A serious security flaw', 'A request to delete the PR', 'An approval'] },
      answer: 0,
      explain: { fr: '« nit » vient de <em>nitpick</em> : chipoter. Utile, mais pas bloquant.', en: '"nit" comes from <em>nitpick</em>. Useful, but not blocking.' },
    },
    {
      id: 'quality-q47', skill: 'quality.review', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Une ligne modifiée apparaît dans un diff comme une ligne <code>-</code> suivie d’une ligne <code>+</code>.', en: 'A modified line appears in a diff as a <code>-</code> line followed by a <code>+</code> line.' },
      answer: true,
      explain: { fr: 'Git ne « modifie » pas : il retire l’ancienne version et ajoute la nouvelle.', en: 'Git does not "modify": it removes the old version and adds the new one.' },
    },
    {
      id: 'quality-q48', skill: 'quality.review', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi la relecture est-elle confiée à un agent <strong>différent</strong> de l’auteur ?', en: 'Why is the review given to an agent <strong>different</strong> from the author?' },
      choices: { fr: ['L’auteur a un angle mort : il lit ce qu’il voulait écrire', 'Pour diviser le coût par deux', 'Parce que l’auteur n’a pas le droit de lire', 'Pour que la PR soit plus longue'], en: ['The author has a blind spot: they read what they meant to write', 'To halve the cost', 'Because the author is not allowed to read', 'To make the PR longer'] },
      answer: 0,
      explain: { fr: 'Comme relire sa propre lettre : un regard neuf voit ce que l’auteur ne voit plus.', en: 'Like rereading your own letter: a fresh eye sees what the author no longer sees.' },
    },
    {
      id: 'quality-q49', skill: 'quality.claude', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Où doit aller une clé d’API (Groq, OpenAI…) ?', en: 'Where should an API key (Groq, OpenAI…) go?' },
      choices: { fr: ['Dans les variables d’environnement (Vercel, secrets GitHub)', 'Dans le chat avec Claude', 'Dans un commit du dépôt', 'Dans le README'], en: ['In environment variables (Vercel, GitHub secrets)', 'In the chat with Claude', 'In a commit of the repository', 'In the README'] },
      answer: 0,
      explain: { fr: 'La clé reste sur le serveur ; la page ne la voit jamais. Le chat et le dépôt ne sont pas des coffres-forts.', en: 'The key stays on the server; the page never sees it. Neither the chat nor the repository is a safe.' },
    },
    {
      id: 'quality-q50', skill: 'quality.claude', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Ce prompt est presque bon. Clique sur la ligne qui donne le <strong>critère de fin</strong>.', en: 'This prompt is almost good. Click the line giving the <strong>done criterion</strong>.' },
      code: "Contexte : carte Tiroirs (web/engine/slides.js).\nObjectif : afficher la course maximale de chaque tiroir.\nContraintes : ne pas toucher au chiffrage ; données synthétiques.\nFini quand : un test unitaire le vérifie et npm test + e2e sont verts.",
      lang: 'text', answer: 3,
      explain: { fr: 'Un critère de fin vérifiable : un test + une CI verte. Sans lui, « fini » reste flou.', en: 'A checkable done criterion: a test + green CI. Without it, "done" stays vague.' },
    },
    {
      id: 'quality-q51', skill: 'quality.claude', extra: true, level: 3, type: 'tf',
      prompt: { fr: 'Supprimer un fichier confidentiel dans un nouveau commit suffit à l’effacer d’un dépôt public.', en: 'Deleting a confidential file in a new commit is enough to erase it from a public repository.' },
      answer: false,
      explain: { fr: 'L’historique garde l’ancien commit : n’importe qui peut encore le lire. Il ne faut jamais le committer au départ.', en: 'History keeps the old commit: anyone can still read it. It must never be committed in the first place.' },
    },
  ],
};
