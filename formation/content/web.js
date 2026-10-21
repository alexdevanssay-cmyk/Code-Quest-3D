// Module « Le navigateur, moteur de l'appli » — voir formation/CONTENT_SPEC.md
export default {
  id: 'web',
  order: 4,
  icon: '🌐',
  color: '#2f6fed',
  title: { fr: "Le navigateur, moteur de l'appli", en: 'The browser, engine of the app' },
  summary: {
    fr: "Comment une simple page web (HTML, CSS, JavaScript) devient une vraie application 3D qui calcule des volumes sans serveur : DOM, stockage, Web Workers, WebAssembly et three.js.",
    en: 'How a plain web page (HTML, CSS, JavaScript) becomes a real 3D application that computes volumes with no server: DOM, storage, Web Workers, WebAssembly and three.js.',
  },
  skills: {
    'web.layers': { fr: 'Les trois couches HTML / CSS / JS', en: 'The three layers HTML / CSS / JS' },
    'web.dom': { fr: 'Le DOM et les événements', en: 'The DOM and events' },
    'web.storage': { fr: 'Mémoriser dans le navigateur', en: 'Storing data in the browser' },
    'web.workers': { fr: 'Web Workers et messages', en: 'Web Workers and messages' },
    'web.wasm': { fr: 'WebAssembly', en: 'WebAssembly' },
    'web.three': { fr: 'La 3D avec three.js', en: '3D with three.js' },
    'web.devtools': { fr: 'Modules, build et outils de développement', en: 'Modules, build and developer tools' },
  },
  widgets: {
    'web-flow-worker': {
      type: 'flow',
      actors: [
        { fr: 'Page (app.js)', en: 'Page (app.js)' },
        { fr: 'client.js (fil principal)', en: 'client.js (main thread)' },
        { fr: 'worker.js (travailleur)', en: 'worker.js (worker)' },
      ],
      steps: [
        { from: 0, to: 1, label: { fr: 'analyser(fichier)', en: 'analyse(file)' }, detail: { fr: "L'utilisateur ouvre un STEP. <code>app.js</code> appelle l'API de <code>client.js</code>, qui renvoie une <em>promesse</em> (« je te répondrai plus tard »).", en: 'The user opens a STEP file. <code>app.js</code> calls the API of <code>client.js</code>, which returns a <em>promise</em> ("I will answer later").' } },
        { from: 1, to: 2, label: { fr: "postMessage({ type: 'analyze', id: 7, bytes })", en: "postMessage({ type: 'analyze', id: 7, bytes })" }, detail: { fr: "Le client range la promesse dans <code>pending</code> sous le numéro 7, puis envoie le message. Les octets du fichier sont <strong>transférés</strong> (pas copiés).", en: 'The client stores the promise in <code>pending</code> under number 7, then posts the message. The file bytes are <strong>transferred</strong> (not copied).' } },
        { from: 2, to: 1, label: { fr: "{ type: 'progress', id: 7, percent: 40 }", en: "{ type: 'progress', id: 7, percent: 40 }" }, detail: { fr: "Pendant qu'OpenCascade travaille, le worker envoie des nouvelles. La page met à jour la barre de progression : elle n'est jamais gelée.", en: 'While OpenCascade works, the worker sends news. The page updates the progress bar: it never freezes.' } },
        { from: 2, to: 1, label: { fr: "{ type: 'result', id: 7, result }", en: "{ type: 'result', id: 7, result }" }, detail: { fr: "Fini ! Le client retrouve la tâche 7 dans <code>pending</code>, la supprime et appelle <code>resolve(result)</code>.", en: 'Done! The client finds job 7 in <code>pending</code>, deletes it and calls <code>resolve(result)</code>.' } },
        { from: 1, to: 0, label: { fr: 'promesse tenue → affichage 3D', en: 'promise resolved → 3D display' }, detail: { fr: "<code>app.js</code> reçoit les corps, volumes et maillages et construit la scène three.js.", en: '<code>app.js</code> receives the bodies, volumes and meshes and builds the three.js scene.' } },
        { from: 2, to: 1, label: { fr: "{ type: 'error', fatal: true }", en: "{ type: 'error', fatal: true }" }, detail: { fr: "Si le C++ plante (mémoire pleine…), le worker le signale comme <em>fatal</em> : le client rejette les tâches en attente et <strong>redémarre</strong> un worker neuf.", en: 'If the C++ crashes (memory full…), the worker flags it as <em>fatal</em>: the client rejects the waiting jobs and <strong>restarts</strong> a fresh worker.' } },
      ],
    },
  },
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'web-1',
      title: { fr: 'Les trois couches : HTML, CSS, JavaScript', en: 'The three layers: HTML, CSS, JavaScript' },
      skills: ['web.layers'],
      minutes: 10,
      body: {
        fr: `<p>Une page web, c'est comme une pièce de fonderie qu'on fabrique en trois étapes : on définit la <strong>forme</strong>, puis la <strong>finition</strong>, puis on lui donne une <strong>fonction</strong>. Dans le navigateur, ces trois étapes ont chacune leur langage.</p>
<table>
<thead><tr><th>Couche</th><th>Langage</th><th>Rôle</th><th>Fichier dans 3D Reader</th></tr></thead>
<tbody>
<tr><td>Structure</td><td><span class="term" data-term="html">HTML</span></td><td>Ce qu'il y a sur la page : boutons, titres, onglets</td><td><code>web/index.html</code></td></tr>
<tr><td>Style</td><td><span class="term" data-term="css">CSS</span></td><td>À quoi ça ressemble : couleurs, tailles, positions</td><td><code>web/style.css</code></td></tr>
<tr><td>Comportement</td><td>JavaScript</td><td>Ce que ça fait quand on clique, calcule, charge</td><td><code>web/app.js</code>, <code>web/engine/*.js</code></td></tr>
</tbody>
</table>
<h3>HTML : des balises qui s'emboîtent</h3>
<p>Le HTML est fait de <strong>balises</strong> : <code>&lt;button&gt;</code> ouvre un bouton, <code>&lt;/button&gt;</code> le ferme. À l'intérieur de la balise ouvrante, on met des <strong>attributs</strong> (<code>nom="valeur"</code>) qui précisent l'élément. Voici un vrai onglet de 3D Reader :</p>
~~~html title="web/index.html"
<button type="button" role="tab" class="tab active" data-page="viewer" data-i18n="tab.viewer">3D analysis</button>
~~~
<ul>
<li><code>class="tab active"</code> : deux <strong>classes</strong>, des étiquettes que le CSS et le JS utilisent pour retrouver l'élément.</li>
<li><code>data-page="viewer"</code> : un attribut <code>data-…</code> personnalisé. Le JS le lit pour savoir quelle page afficher.</li>
<li><code>data-i18n="tab.viewer"</code> : la <strong>clé de traduction</strong>. Le texte « 3D analysis » sera remplacé par « Analyse 3D » en français.</li>
</ul>
<div class="callout project">Dans <code>web/i18n.js</code>, une fonction parcourt tous les éléments qui ont <code>data-i18n</code> et remplace leur texte : <code>for (const el of root.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);</code>. Le HTML ne contient donc qu'une version, et le JS traduit.</div>
<h3>CSS : des règles « sélecteur → propriétés »</h3>
<p>Une règle CSS dit : « pour tous les éléments qui correspondent à ce <strong>sélecteur</strong>, applique ces propriétés ».</p>
~~~css
.tab { padding: 6px 12px; }          /* «1» */
.tab.active { color: var(--accent); } /* «2» */
#viewport { background: var(--viewport); } /* «3» */
~~~
<ol class="notes">
<li><code>.tab</code> : le point veut dire « classe ». Tous les onglets reçoivent ce rembourrage.</li>
<li><code>.tab.active</code> : seulement les onglets qui ont <em>aussi</em> la classe <code>active</code>.</li>
<li><code>#viewport</code> : le dièse veut dire « identifiant » (<code>id="viewport"</code>), unique sur la page.</li>
</ol>
<h3>Les variables CSS</h3>
<p>3D Reader définit ses couleurs une seule fois, comme des constantes, dans <code>:root</code> (la racine de la page). On les réutilise avec <code>var(--nom)</code>. Pour le thème sombre, on redéfinit juste les valeurs :</p>
~~~css title="web/style.css"
:root {
  --bg: #f4f5f7;
  --accent: #2f6fed;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #14171d; --accent: #5b8cff; }
}
~~~
<div class="callout tip">Pour changer toute une couleur de l'appli, on modifie <strong>une ligne</strong> : c'est tout l'intérêt des variables CSS.</div>
<h3>JavaScript : la couche qui agit</h3>
<p>Le JavaScript est chargé par une balise <code>&lt;script type="module" src="app.js"&gt;</code>. Il lit la page, réagit aux clics, lance les calculs et modifie l'affichage. C'est lui qui fait de la page une <em>application</em>. On le détaille dans les leçons suivantes.</p>
<div class="callout warn">Erreur classique : oublier de fermer une balise (<code>&lt;div&gt;</code> sans <code>&lt;/div&gt;</code>). Le navigateur ne plante pas, il « devine » — et la mise en page part de travers sans message d'erreur.</div>`,
        en: `<p>A web page is like a foundry part made in three steps: you define the <strong>shape</strong>, then the <strong>finish</strong>, then you give it a <strong>function</strong>. In the browser, each of these steps has its own language.</p>
<table>
<thead><tr><th>Layer</th><th>Language</th><th>Role</th><th>File in 3D Reader</th></tr></thead>
<tbody>
<tr><td>Structure</td><td><span class="term" data-term="html">HTML</span></td><td>What is on the page: buttons, titles, tabs</td><td><code>web/index.html</code></td></tr>
<tr><td>Style</td><td><span class="term" data-term="css">CSS</span></td><td>What it looks like: colours, sizes, positions</td><td><code>web/style.css</code></td></tr>
<tr><td>Behaviour</td><td>JavaScript</td><td>What it does when you click, compute, load</td><td><code>web/app.js</code>, <code>web/engine/*.js</code></td></tr>
</tbody>
</table>
<h3>HTML: nested tags</h3>
<p>HTML is made of <strong>tags</strong>: <code>&lt;button&gt;</code> opens a button, <code>&lt;/button&gt;</code> closes it. Inside the opening tag you put <strong>attributes</strong> (<code>name="value"</code>) that describe the element. Here is a real tab of 3D Reader:</p>
~~~html title="web/index.html"
<button type="button" role="tab" class="tab active" data-page="viewer" data-i18n="tab.viewer">3D analysis</button>
~~~
<ul>
<li><code>class="tab active"</code>: two <strong>classes</strong>, labels that CSS and JS use to find the element.</li>
<li><code>data-page="viewer"</code>: a custom <code>data-…</code> attribute. The JS reads it to know which page to show.</li>
<li><code>data-i18n="tab.viewer"</code>: the <strong>translation key</strong>. The text "3D analysis" is replaced by "Analyse 3D" in French.</li>
</ul>
<div class="callout project">In <code>web/i18n.js</code>, a function walks through every element that has <code>data-i18n</code> and replaces its text: <code>for (const el of root.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);</code>. So the HTML holds a single version, and the JS translates it.</div>
<h3>CSS: "selector → properties" rules</h3>
<p>A CSS rule says: "for every element matching this <strong>selector</strong>, apply these properties".</p>
~~~css
.tab { padding: 6px 12px; }          /* «1» */
.tab.active { color: var(--accent); } /* «2» */
#viewport { background: var(--viewport); } /* «3» */
~~~
<ol class="notes">
<li><code>.tab</code>: the dot means "class". Every tab gets this padding.</li>
<li><code>.tab.active</code>: only the tabs that <em>also</em> have the class <code>active</code>.</li>
<li><code>#viewport</code>: the hash means "identifier" (<code>id="viewport"</code>), unique on the page.</li>
</ol>
<h3>CSS variables</h3>
<p>3D Reader defines its colours once, like constants, in <code>:root</code> (the root of the page). They are reused with <code>var(--name)</code>. For the dark theme, only the values are redefined:</p>
~~~css title="web/style.css"
:root {
  --bg: #f4f5f7;
  --accent: #2f6fed;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #14171d; --accent: #5b8cff; }
}
~~~
<div class="callout tip">To change a colour across the whole app you edit <strong>one line</strong>: that is the whole point of CSS variables.</div>
<h3>JavaScript: the layer that acts</h3>
<p>JavaScript is loaded by a tag <code>&lt;script type="module" src="app.js"&gt;</code>. It reads the page, reacts to clicks, starts computations and changes the display. It is what turns the page into an <em>application</em>. The next lessons go into it.</p>
<div class="callout warn">Classic mistake: forgetting to close a tag (<code>&lt;div&gt;</code> without <code>&lt;/div&gt;</code>). The browser does not crash, it "guesses" — and the layout goes wrong with no error message.</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Imagine une <strong>maison</strong>. Le HTML, ce sont les murs et les pièces (où est la porte, où est la fenêtre). Le CSS, c'est la décoration (peinture, papier peint, taille des meubles). Le JavaScript, c'est l'électricité et la plomberie : quand tu appuies sur l'interrupteur, la lumière s'allume.</div>
<h3>Pas à pas : un bouton de A à Z</h3>
<p><strong>Étape 1 — HTML : le bouton existe.</strong></p>
~~~html
<button id="ouvrir" class="gros">Ouvrir un fichier</button>
~~~
<p>Le navigateur affiche un bouton gris, banal. Il a un <em>nom unique</em> (<code>id="ouvrir"</code>) et une <em>étiquette</em> (<code>class="gros"</code>).</p>
<p><strong>Étape 2 — CSS : le bouton est joli.</strong></p>
~~~css
.gros { font-size: 20px; background: var(--accent); color: white; }
~~~
<p>Lis-le comme une phrase : « tout ce qui porte l'étiquette <em>gros</em> : texte de 20 pixels, fond couleur d'accent, texte blanc ».</p>
<p><strong>Étape 3 — JS : le bouton fait quelque chose.</strong></p>
~~~js
document.querySelector('#ouvrir').addEventListener('click', () => alert('Choisis ton STEP !'));
~~~
<h3>Les trois symboles à retenir dans les sélecteurs</h3>
<table>
<thead><tr><th>Écrit</th><th>Se lit</th><th>Trouve</th></tr></thead>
<tbody>
<tr><td><code>button</code></td><td>« tous les boutons »</td><td>par type de balise</td></tr>
<tr><td><code>.tab</code></td><td>« tout ce qui a l'étiquette tab »</td><td>par classe (plusieurs possibles)</td></tr>
<tr><td><code>#viewport</code></td><td>« celui qui s'appelle viewport »</td><td>par id (un seul)</td></tr>
<tr><td><code>[data-i18n]</code></td><td>« tout ce qui a l'attribut data-i18n »</td><td>par attribut</td></tr>
</tbody>
</table>
<h3>Pourquoi <code>data-i18n</code> ?</h3>
<p>Au lieu d'écrire deux pages (une française, une anglaise), on écrit une page avec des <em>clés</em>. C'est comme une étiquette de pièce avec une référence (« TAB-VIEWER ») : un dictionnaire fait la traduction (« Analyse 3D » ou « 3D analysis ») selon la langue choisie.</p>
<div class="callout warn">Les erreurs de débutant : confondre <code>.</code> et <code>#</code> ; mettre une espace dans un nom de classe en croyant que c'est un seul nom (<code>class="tab active"</code>, c'est <em>deux</em> classes) ; oublier le point-virgule entre deux propriétés CSS.</div>`,
        en: `<div class="callout analogy">Picture a <strong>house</strong>. HTML is the walls and rooms (where the door is, where the window is). CSS is the decoration (paint, wallpaper, furniture size). JavaScript is the wiring and plumbing: when you press the switch, the light turns on.</div>
<h3>Step by step: a button from A to Z</h3>
<p><strong>Step 1 — HTML: the button exists.</strong></p>
~~~html
<button id="open" class="big">Open a file</button>
~~~
<p>The browser shows a plain grey button. It has a <em>unique name</em> (<code>id="open"</code>) and a <em>label</em> (<code>class="big"</code>).</p>
<p><strong>Step 2 — CSS: the button looks nice.</strong></p>
~~~css
.big { font-size: 20px; background: var(--accent); color: white; }
~~~
<p>Read it as a sentence: "everything labelled <em>big</em>: 20-pixel text, accent-coloured background, white text".</p>
<p><strong>Step 3 — JS: the button does something.</strong></p>
~~~js
document.querySelector('#open').addEventListener('click', () => alert('Pick your STEP!'));
~~~
<h3>The three symbols to remember in selectors</h3>
<table>
<thead><tr><th>Written</th><th>Read as</th><th>Finds</th></tr></thead>
<tbody>
<tr><td><code>button</code></td><td>"all buttons"</td><td>by tag type</td></tr>
<tr><td><code>.tab</code></td><td>"everything labelled tab"</td><td>by class (several possible)</td></tr>
<tr><td><code>#viewport</code></td><td>"the one called viewport"</td><td>by id (only one)</td></tr>
<tr><td><code>[data-i18n]</code></td><td>"everything with the data-i18n attribute"</td><td>by attribute</td></tr>
</tbody>
</table>
<h3>Why <code>data-i18n</code>?</h3>
<p>Instead of writing two pages (one French, one English), you write one page with <em>keys</em>. It is like a part label with a reference ("TAB-VIEWER"): a dictionary does the translation ("Analyse 3D" or "3D analysis") depending on the chosen language.</p>
<div class="callout warn">Beginner mistakes: mixing up <code>.</code> and <code>#</code>; putting a space in a class name thinking it is one name (<code>class="tab active"</code> is <em>two</em> classes); forgetting the semicolon between two CSS properties.</div>`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'web-2',
      title: { fr: 'Le DOM et les événements', en: 'The DOM and events' },
      skills: ['web.dom'],
      minutes: 12,
      body: {
        fr: `<p>Quand le navigateur lit le HTML, il construit en mémoire un <strong>arbre d'objets</strong> : le <span class="term" data-term="dom">DOM</span> (<em>Document Object Model</em>). Chaque balise devient un objet que JavaScript peut lire et modifier. Changer le DOM, c'est changer ce qu'on voit à l'écran, instantanément.</p>
~~~text
document
 └─ html
     ├─ head  (titre, style.css, import map)
     └─ body
         ├─ header.topbar
         │    ├─ button#brand  "3D Reader"
         │    └─ button.tab   "Analyse 3D"
         └─ div#viewport      (la vue 3D)
~~~
<h3>Trouver un élément</h3>
~~~js
const vue = document.querySelector('#viewport');      // «1»
const onglets = document.querySelectorAll('.tab');     // «2»
const $ = (id) => document.getElementById(id);         // «3»
~~~
<ol class="notes">
<li><code>querySelector</code> prend un sélecteur CSS et renvoie le <em>premier</em> élément trouvé (ou <code>null</code>).</li>
<li><code>querySelectorAll</code> les renvoie <em>tous</em>, dans une liste qu'on parcourt avec <code>for…of</code>.</li>
<li>3D Reader se fait un raccourci <code>$</code> : <code>const viewport = $("viewport");</code> dans <code>app.js</code>.</li>
</ol>
<h3>Réagir : les événements</h3>
<p>Le navigateur prévient le code quand il se passe quelque chose : clic, touche, souris, fichier déposé… On s'abonne avec <code>addEventListener(nom, fonction)</code>. La fonction (un <em>écouteur</em>) sera appelée plus tard, à chaque fois.</p>
~~~js run
// Simulation sans page : on crée un "bouton" en mémoire
const bouton = new EventTarget();
let clics = 0;
bouton.addEventListener('click', () => {
  clics++;
  console.log('Clic numéro', clics);
});
bouton.dispatchEvent(new Event('click'));
bouton.dispatchEvent(new Event('click'));
~~~
<h3>Créer et modifier des éléments</h3>
~~~js
const li = document.createElement('li');   // un nouvel élément, pas encore affiché
li.textContent = 'Corps 1 : 152 cm³';      // son texte
li.classList.add('body-row');              // une classe
liste.appendChild(li);                     // maintenant il apparaît
~~~
<h3><code>textContent</code> ou <code>innerHTML</code> ? (sécurité)</h3>
<ul>
<li><code>el.textContent = texte</code> : le texte est affiché <strong>tel quel</strong>. Un <code>&lt;b&gt;</code> reste écrit « &lt;b&gt; ».</li>
<li><code>el.innerHTML = texte</code> : le texte est <strong>interprété comme du HTML</strong>. Pratique pour du gras… mais dangereux si le texte vient de l'extérieur.</li>
</ul>
<div class="callout warn">Un nom de pièce dans un fichier STEP est écrit par quelqu'un d'autre. S'il contenait <code>&lt;img src=x onerror="…"&gt;</code> et qu'on l'affichait avec <code>innerHTML</code>, du code étranger s'exécuterait : c'est une faille <strong>XSS</strong>. Règle : les données venues d'un fichier ou d'un utilisateur passent par <code>textContent</code>. <code>innerHTML</code> seulement pour nos propres textes (comme les traductions <code>data-i18n-html</code>).</div>
<h3>Ses propres événements : <code>CustomEvent</code></h3>
<p>Un module peut aussi <em>crier</em> un événement que d'autres écoutent, sans se connaître. Quand l'analyse 3D est à jour, 3D Reader prévient le reste de l'appli (la page Chiffrage, par exemple) :</p>
~~~js title="web/app.js"
document.dispatchEvent(new CustomEvent("reader3d-part"));        // l'annonce
document.addEventListener("reader3d-part", () => gatingPublished++); // quelqu'un écoute
~~~
<div class="callout project">C'est un système « radio » : l'analyse émet sur la fréquence <code>reader3d-part</code>, le chiffrage est branché dessus. On peut ajouter un nouvel auditeur sans toucher à l'émetteur.</div>`,
        en: `<p>When the browser reads the HTML, it builds a <strong>tree of objects</strong> in memory: the <span class="term" data-term="dom">DOM</span> (<em>Document Object Model</em>). Each tag becomes an object that JavaScript can read and change. Changing the DOM means changing what you see on screen, instantly.</p>
~~~text
document
 └─ html
     ├─ head  (title, style.css, import map)
     └─ body
         ├─ header.topbar
         │    ├─ button#brand  "3D Reader"
         │    └─ button.tab   "3D analysis"
         └─ div#viewport      (the 3D view)
~~~
<h3>Finding an element</h3>
~~~js
const view = document.querySelector('#viewport');      // «1»
const tabs = document.querySelectorAll('.tab');        // «2»
const $ = (id) => document.getElementById(id);         // «3»
~~~
<ol class="notes">
<li><code>querySelector</code> takes a CSS selector and returns the <em>first</em> element found (or <code>null</code>).</li>
<li><code>querySelectorAll</code> returns <em>all</em> of them, in a list you walk with <code>for…of</code>.</li>
<li>3D Reader makes itself a shortcut <code>$</code>: <code>const viewport = $("viewport");</code> in <code>app.js</code>.</li>
</ol>
<h3>Reacting: events</h3>
<p>The browser tells the code when something happens: click, key, mouse, dropped file… You subscribe with <code>addEventListener(name, function)</code>. The function (a <em>listener</em>) will be called later, every time.</p>
~~~js run
// Simulation without a page: we create a "button" in memory
const button = new EventTarget();
let clicks = 0;
button.addEventListener('click', () => {
  clicks++;
  console.log('Click number', clicks);
});
button.dispatchEvent(new Event('click'));
button.dispatchEvent(new Event('click'));
~~~
<h3>Creating and changing elements</h3>
~~~js
const li = document.createElement('li');   // a new element, not shown yet
li.textContent = 'Body 1: 152 cm³';        // its text
li.classList.add('body-row');              // a class
list.appendChild(li);                      // now it appears
~~~
<h3><code>textContent</code> or <code>innerHTML</code>? (security)</h3>
<ul>
<li><code>el.textContent = text</code>: the text is shown <strong>as is</strong>. A <code>&lt;b&gt;</code> stays written as "&lt;b&gt;".</li>
<li><code>el.innerHTML = text</code>: the text is <strong>interpreted as HTML</strong>. Handy for bold… but dangerous if the text comes from outside.</li>
</ul>
<div class="callout warn">A part name in a STEP file is written by someone else. If it contained <code>&lt;img src=x onerror="…"&gt;</code> and we showed it with <code>innerHTML</code>, foreign code would run: that is an <strong>XSS</strong> flaw. Rule: data from a file or a user goes through <code>textContent</code>. <code>innerHTML</code> only for our own texts (like the <code>data-i18n-html</code> translations).</div>
<h3>Your own events: <code>CustomEvent</code></h3>
<p>A module can also <em>shout</em> an event that others listen to, without knowing each other. When the 3D analysis is up to date, 3D Reader tells the rest of the app (the Costing page, for example):</p>
~~~js title="web/app.js"
document.dispatchEvent(new CustomEvent("reader3d-part"));        // the announcement
document.addEventListener("reader3d-part", () => gatingPublished++); // someone listens
~~~
<div class="callout project">It is a "radio" system: the analysis broadcasts on the <code>reader3d-part</code> frequency, the costing is tuned in. A new listener can be added without touching the broadcaster.</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Le DOM, c'est l'<strong>arbre de construction</strong> d'un assemblage dans SolidWorks : un assemblage contient des sous-assemblages, qui contiennent des pièces. Cliquer sur une ligne de l'arbre sélectionne la pièce ; la modifier change le modèle 3D. Ici, l'« assemblage », c'est la page.</div>
<h3>Le DOM en trois verbes</h3>
<ol>
<li><strong>Trouver</strong> : <code>document.querySelector('.tab')</code> — « donne-moi le premier onglet ».</li>
<li><strong>Changer</strong> : <code>el.textContent = 'Bonjour'</code>, <code>el.classList.add('active')</code>, <code>el.hidden = true</code>.</li>
<li><strong>Écouter</strong> : <code>el.addEventListener('click', maFonction)</code>.</li>
</ol>
<h3>Un écouteur, c'est une sonnette</h3>
<p>Tu installes une sonnette (<code>addEventListener</code>) et tu dis ce qu'il faut faire quand on sonne (la fonction). Tu ne restes pas derrière la porte à attendre : tu continues ta vie, et la sonnette te prévient. Le code fonctionne pareil : il ne « boucle » pas pour surveiller le bouton.</p>
~~~js
bouton.addEventListener('click', ouvrirFichier);   // juste le NOM de la fonction
bouton.addEventListener('click', ouvrirFichier()); // ❌ l'appelle tout de suite, une seule fois !
~~~
<div class="callout warn">Erreur n°1 des débutants : mettre des parenthèses. <code>ouvrirFichier()</code> exécute la fonction <em>maintenant</em> et donne son résultat à la sonnette, au lieu de lui donner la fonction elle-même.</div>
<h3><code>textContent</code> vs <code>innerHTML</code> en image</h3>
<p>Imagine que quelqu'un t'envoie un nom de pièce : <code>&lt;b&gt;Carter&lt;/b&gt;</code>.</p>
<ul>
<li>Avec <code>textContent</code>, tu <strong>photocopies l'étiquette</strong> : on lit littéralement « &lt;b&gt;Carter&lt;/b&gt; ». Sans risque.</li>
<li>Avec <code>innerHTML</code>, tu <strong>suis les instructions écrites sur l'étiquette</strong> : « Carter » s'affiche en gras. Si l'étiquette disait « ouvre la porte à un inconnu », tu le ferais aussi !</li>
</ul>
<h3>L'événement personnalisé, c'est l'interphone de l'atelier</h3>
<p><code>dispatchEvent(new CustomEvent("reader3d-part"))</code>, c'est annoncer au micro « la pièce est prête ». Le chiffrage, qui écoute, se met au travail. Celui qui annonce n'a pas besoin de savoir qui écoute.</p>`,
        en: `<div class="callout analogy">The DOM is like the <strong>feature tree</strong> of an assembly in SolidWorks: an assembly contains sub-assemblies, which contain parts. Clicking a line of the tree selects the part; changing it changes the 3D model. Here, the "assembly" is the page.</div>
<h3>The DOM in three verbs</h3>
<ol>
<li><strong>Find</strong>: <code>document.querySelector('.tab')</code> — "give me the first tab".</li>
<li><strong>Change</strong>: <code>el.textContent = 'Hello'</code>, <code>el.classList.add('active')</code>, <code>el.hidden = true</code>.</li>
<li><strong>Listen</strong>: <code>el.addEventListener('click', myFunction)</code>.</li>
</ol>
<h3>A listener is a doorbell</h3>
<p>You install a doorbell (<code>addEventListener</code>) and say what to do when it rings (the function). You do not stand behind the door waiting: you carry on, and the bell lets you know. Code works the same: it does not "loop" to watch the button.</p>
~~~js
button.addEventListener('click', openFile);   // just the NAME of the function
button.addEventListener('click', openFile()); // ❌ calls it right away, only once!
~~~
<div class="callout warn">Beginner mistake #1: adding parentheses. <code>openFile()</code> runs the function <em>now</em> and gives its result to the doorbell, instead of giving it the function itself.</div>
<h3><code>textContent</code> vs <code>innerHTML</code> as a picture</h3>
<p>Imagine someone sends you a part name: <code>&lt;b&gt;Housing&lt;/b&gt;</code>.</p>
<ul>
<li>With <code>textContent</code>, you <strong>photocopy the label</strong>: you literally read "&lt;b&gt;Housing&lt;/b&gt;". No risk.</li>
<li>With <code>innerHTML</code>, you <strong>follow the instructions written on the label</strong>: "Housing" shows in bold. If the label said "open the door to a stranger", you would do that too!</li>
</ul>
<h3>The custom event is the workshop intercom</h3>
<p><code>dispatchEvent(new CustomEvent("reader3d-part"))</code> is announcing on the intercom "the part is ready". The costing, which listens, gets to work. The announcer does not need to know who is listening.</p>`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'web-3',
      title: { fr: 'Mémoriser dans le navigateur', en: 'Storing data in the browser' },
      skills: ['web.storage'],
      minutes: 11,
      body: {
        fr: `<p>3D Reader est hébergé sur GitHub Pages : <strong>pas de base de données sur un serveur</strong>. Pourtant, il se souvient de tes réglages, de tes conversations IA, de tes résultats d'analyse. Tout est rangé… <strong>dans ton navigateur, sur ta machine</strong>.</p>
<table>
<thead><tr><th>Rangement</th><th>Contient</th><th>Durée de vie</th><th>Exemple dans 3D Reader</th></tr></thead>
<tbody>
<tr><td><span class="term" data-term="localstorage">localStorage</span></td><td>des textes courts (clé → valeur)</td><td>jusqu'à ce qu'on l'efface</td><td>réglages d'épaisseur, plan de joint</td></tr>
<tr><td><code>sessionStorage</code></td><td>pareil</td><td>le temps de l'onglet</td><td>« la page a déjà été rechargée une fois »</td></tr>
<tr><td><span class="term" data-term="indexeddb">IndexedDB</span></td><td>de gros objets, des milliers d'entrées</td><td>jusqu'à ce qu'on l'efface</td><td>historique des conversations IA, cache des résultats</td></tr>
<tr><td>Cache / <span class="term" data-term="service-worker">Service Worker</span></td><td>des réponses réseau, des fichiers</td><td>géré par le site</td><td><code>coi-sw.js</code> (ajoute des en-têtes)</td></tr>
<tr><td>Cookies</td><td>de petits textes envoyés au serveur à chaque requête</td><td>date d'expiration</td><td>non utilisés par l'appli</td></tr>
</tbody>
</table>
<h3>localStorage : le carnet de notes</h3>
<p>Il ne stocke que du <strong>texte</strong>. Pour ranger un objet, on le transforme en texte <span class="term" data-term="json">JSON</span> avec <code>JSON.stringify</code>, et on le relit avec <code>JSON.parse</code> :</p>
~~~js title="web/app.js (simplifié)"
localStorage.setItem(MARKINGS_KEY, JSON.stringify(thick.markings)); // «1»
const saved = JSON.parse(localStorage.getItem(MARKINGS_KEY));       // «2»
const v = parseFloat(localStorage.getItem(FLOOR_KEY));              // «3»
~~~
<ol class="notes">
<li>Écrire : la clé (un nom) et la valeur (un texte).</li>
<li>Lire : <code>getItem</code> renvoie le texte, ou <code>null</code> si la clé n'existe pas. <code>JSON.parse(null)</code> donne <code>null</code> : pas de plantage.</li>
<li>Un nombre revient en texte (<code>"2.5"</code>) : il faut le reconvertir.</li>
</ol>
~~~js run
// Un faux localStorage pour s'entraîner (le vrai a les mêmes méthodes)
const store = new Map();
const ls = { setItem: (k, v) => store.set(k, String(v)), getItem: (k) => store.get(k) ?? null };
ls.setItem('reglages', JSON.stringify({ densite: 2.7, unite: 'mm' }));
console.log(typeof ls.getItem('reglages'), ls.getItem('reglages'));
const r = JSON.parse(ls.getItem('reglages'));
console.log('Densité :', r.densite);
console.log('Clé absente :', ls.getItem('rien'));
~~~
<h3>IndexedDB : l'entrepôt</h3>
<p>Pour de gros volumes (des conversations entières, des maillages), on utilise IndexedDB, une vraie petite base de données. Son API est plus verbeuse et <strong>asynchrone</strong> : on ouvre la base, puis on attend <code>onsuccess</code>.</p>
~~~js title="web/ai-history.js"
const req = indexedDB.open(DB_NAME, 1);
req.onupgradeneeded = () => { /* créer les "tables" la première fois */ };
req.onsuccess = () => resolve(req.result);
req.onerror = () => reject(req.error);
~~~
<h3>Service Worker : le portier</h3>
<p>Un <em>service worker</em> est un petit script qui s'installe entre la page et le réseau et peut <strong>modifier chaque réponse</strong>. Dans 3D Reader, <code>coi-sw.js</code> ajoute deux en-têtes que GitHub Pages ne sait pas envoyer, pour que le calcul d'épaisseur puisse utiliser tous les cœurs du processeur :</p>
~~~js title="web/coi-sw.js"
headers.set("Cross-Origin-Opener-Policy", "same-origin");
headers.set("Cross-Origin-Embedder-Policy", "require-corp");
~~~
<div class="callout info">Tout ce stockage est <strong>par site et par navigateur</strong> : ouvrir 3D Reader dans Firefox ne retrouve pas ce qui est dans Chrome ; « Effacer les données du site » vide tout. Les données ne partent pas sur Internet toutes seules.</div>
<div class="callout warn">En navigation privée, ou si le stockage est bloqué, <code>localStorage</code> peut lancer une erreur. 3D Reader l'entoure de <code>try { … } catch {}</code> (voir <code>sessionStorage.getItem("coi-reload")</code> dans <code>index.html</code>).</div>`,
        en: `<p>3D Reader is hosted on GitHub Pages: <strong>no database on a server</strong>. Yet it remembers your settings, your AI conversations, your analysis results. Everything is stored… <strong>in your browser, on your machine</strong>.</p>
<table>
<thead><tr><th>Storage</th><th>Holds</th><th>Lifetime</th><th>Example in 3D Reader</th></tr></thead>
<tbody>
<tr><td><span class="term" data-term="localstorage">localStorage</span></td><td>short texts (key → value)</td><td>until it is cleared</td><td>thickness settings, parting plane</td></tr>
<tr><td><code>sessionStorage</code></td><td>same</td><td>as long as the tab</td><td>"the page was already reloaded once"</td></tr>
<tr><td><span class="term" data-term="indexeddb">IndexedDB</span></td><td>big objects, thousands of entries</td><td>until it is cleared</td><td>AI conversation history, results cache</td></tr>
<tr><td>Cache / <span class="term" data-term="service-worker">Service Worker</span></td><td>network responses, files</td><td>managed by the site</td><td><code>coi-sw.js</code> (adds headers)</td></tr>
<tr><td>Cookies</td><td>small texts sent to the server with every request</td><td>expiry date</td><td>not used by the app</td></tr>
</tbody>
</table>
<h3>localStorage: the notebook</h3>
<p>It stores only <strong>text</strong>. To store an object, you turn it into <span class="term" data-term="json">JSON</span> text with <code>JSON.stringify</code>, and read it back with <code>JSON.parse</code>:</p>
~~~js title="web/app.js (simplified)"
localStorage.setItem(MARKINGS_KEY, JSON.stringify(thick.markings)); // «1»
const saved = JSON.parse(localStorage.getItem(MARKINGS_KEY));       // «2»
const v = parseFloat(localStorage.getItem(FLOOR_KEY));              // «3»
~~~
<ol class="notes">
<li>Write: the key (a name) and the value (a text).</li>
<li>Read: <code>getItem</code> returns the text, or <code>null</code> if the key does not exist. <code>JSON.parse(null)</code> gives <code>null</code>: no crash.</li>
<li>A number comes back as text (<code>"2.5"</code>): it must be converted again.</li>
</ol>
~~~js run
// A fake localStorage to practise (the real one has the same methods)
const store = new Map();
const ls = { setItem: (k, v) => store.set(k, String(v)), getItem: (k) => store.get(k) ?? null };
ls.setItem('settings', JSON.stringify({ density: 2.7, unit: 'mm' }));
console.log(typeof ls.getItem('settings'), ls.getItem('settings'));
const s = JSON.parse(ls.getItem('settings'));
console.log('Density:', s.density);
console.log('Missing key:', ls.getItem('nothing'));
~~~
<h3>IndexedDB: the warehouse</h3>
<p>For large volumes (whole conversations, meshes), you use IndexedDB, a real small database. Its API is wordier and <strong>asynchronous</strong>: you open the database, then wait for <code>onsuccess</code>.</p>
~~~js title="web/ai-history.js"
const req = indexedDB.open(DB_NAME, 1);
req.onupgradeneeded = () => { /* create the "tables" the first time */ };
req.onsuccess = () => resolve(req.result);
req.onerror = () => reject(req.error);
~~~
<h3>Service Worker: the doorman</h3>
<p>A <em>service worker</em> is a small script that sits between the page and the network and can <strong>change every response</strong>. In 3D Reader, <code>coi-sw.js</code> adds two headers that GitHub Pages cannot send, so the thickness computation can use every core of the processor:</p>
~~~js title="web/coi-sw.js"
headers.set("Cross-Origin-Opener-Policy", "same-origin");
headers.set("Cross-Origin-Embedder-Policy", "require-corp");
~~~
<div class="callout info">All this storage is <strong>per site and per browser</strong>: opening 3D Reader in Firefox does not find what is in Chrome; "Clear site data" wipes it all. The data does not go onto the Internet by itself.</div>
<div class="callout warn">In private browsing, or when storage is blocked, <code>localStorage</code> can throw an error. 3D Reader wraps it in <code>try { … } catch {}</code> (see <code>sessionStorage.getItem("coi-reload")</code> in <code>index.html</code>).</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Ton navigateur a plusieurs <strong>rangements</strong>, comme un atelier :<br>• <strong>localStorage</strong> = le tableau blanc au mur : on y note des petites choses, ça reste jusqu'à ce qu'on efface.<br>• <strong>sessionStorage</strong> = un post-it sur ton poste : jeté quand tu fermes l'onglet.<br>• <strong>IndexedDB</strong> = l'armoire à archives : on y range des dossiers entiers.<br>• <strong>Service Worker</strong> = le magasinier à l'entrée : il voit passer tout ce qui arrive et peut coller une étiquette dessus.<br>• <strong>Cookies</strong> = le badge que tu montres à chaque fois que tu entres chez le serveur.</div>
<h3>Le piège n°1 : tout est du texte</h3>
<p>Le tableau blanc ne connaît que l'écriture. Si tu ranges le nombre <code>2.7</code>, tu relis <code>"2.7"</code> (avec des guillemets : c'est un texte). Si tu ranges un objet sans le convertir, tu relis… <code>"[object Object]"</code> — l'information est perdue !</p>
~~~js
localStorage.setItem('a', { x: 1 });   // ❌ stocke "[object Object]"
localStorage.setItem('a', JSON.stringify({ x: 1 })); // ✅ stocke '{"x":1}'
JSON.parse(localStorage.getItem('a')).x;           // 1
~~~
<p>Retiens le duo : <strong>stringify pour ranger, parse pour ressortir</strong>.</p>
<h3>Le piège n°2 : « mes données ont disparu ! »</h3>
<ul>
<li>Autre navigateur (Edge ↔ Chrome) → autre atelier, autres rangements.</li>
<li>Autre adresse (le site local <code>localhost</code> ↔ la version GitHub Pages) → autre atelier aussi.</li>
<li>Nettoyage des données de navigation → tableau blanc effacé.</li>
</ul>
<p>C'est pour ça qu'une appli sérieuse propose souvent un bouton « exporter / importer » vers un fichier.</p>
<h3>Et la confidentialité ?</h3>
<p>Ces rangements restent <strong>sur le PC</strong>. Personne sur Internet ne les lit, sauf si le code de la page les envoie volontairement (par exemple une question à l'IA). Mais quelqu'un qui utilise ta session Windows peut les voir avec F12.</p>`,
        en: `<div class="callout analogy">Your browser has several <strong>storage places</strong>, like a workshop:<br>• <strong>localStorage</strong> = the whiteboard on the wall: you jot small things, they stay until erased.<br>• <strong>sessionStorage</strong> = a sticky note on your workstation: thrown away when you close the tab.<br>• <strong>IndexedDB</strong> = the archive cabinet: you file whole folders.<br>• <strong>Service Worker</strong> = the storekeeper at the entrance: sees everything arriving and can stick a label on it.<br>• <strong>Cookies</strong> = the badge you show every time you enter the server's building.</div>
<h3>Trap #1: everything is text</h3>
<p>The whiteboard only knows writing. If you store the number <code>2.7</code>, you read back <code>"2.7"</code> (with quotes: it is text). If you store an object without converting it, you read back… <code>"[object Object]"</code> — the information is lost!</p>
~~~js
localStorage.setItem('a', { x: 1 });   // ❌ stores "[object Object]"
localStorage.setItem('a', JSON.stringify({ x: 1 })); // ✅ stores '{"x":1}'
JSON.parse(localStorage.getItem('a')).x;           // 1
~~~
<p>Remember the pair: <strong>stringify to store, parse to take out</strong>.</p>
<h3>Trap #2: "my data is gone!"</h3>
<ul>
<li>Another browser (Edge ↔ Chrome) → another workshop, other storage.</li>
<li>Another address (the local site <code>localhost</code> ↔ the GitHub Pages version) → another workshop too.</li>
<li>Clearing browsing data → whiteboard wiped.</li>
</ul>
<p>That is why a serious app often offers an "export / import" button to a file.</p>
<h3>What about privacy?</h3>
<p>This storage stays <strong>on the PC</strong>. Nobody on the Internet reads it, unless the page's code deliberately sends it (for example a question to the AI). But someone using your Windows session can see it with F12.</p>`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'web-4',
      title: { fr: "Web Workers : calculer sans geler l'écran", en: 'Web Workers: computing without freezing the screen' },
      skills: ['web.workers'],
      minutes: 13,
      body: {
        fr: `<p>Le JavaScript d'une page tourne sur un seul <strong>fil d'exécution</strong> : le <em>fil principal</em>. C'est lui qui dessine l'écran, fait tourner la 3D, répond aux clics. Si on lui demande de lire un STEP de 50 Mo pendant 20 secondes, il ne fait <strong>rien d'autre</strong> pendant 20 secondes : la page est gelée, la souris ne fait plus rien, le navigateur propose « Quitter la page ».</p>
<p>La solution : un <span class="term" data-term="web-worker">Web Worker</span>, un deuxième fil qui travaille <strong>en parallèle</strong>, dans son coin. Il n'a pas accès au DOM (il ne peut pas toucher à l'écran) ; il communique uniquement par <strong>messages</strong>.</p>
<h3>Créer le worker et lui parler</h3>
~~~js title="web/engine/client.js"
worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }); //«1»
worker.onmessage = ({ data }) => {                                                //«2»
  const job = data.id != null ? pending.get(data.id) : null;                      //«3»
  if (data.type === 'progress') job?.onProgress?.(data);
  else if (data.type === 'result') { pending.delete(data.id); job?.resolve(data.result); }
};
~~~
<ol class="notes">
<li>On lance le worker à partir du fichier <code>worker.js</code>, en tant que module ES.</li>
<li><code>onmessage</code> : la boîte aux lettres du client. Chaque message du worker y arrive.</li>
<li>Chaque demande porte un numéro (<code>id</code>). Le client garde dans <code>pending</code> (une <code>Map</code>) les promesses en attente, pour savoir à quelle demande correspond chaque réponse.</li>
</ol>
<h3>Côté worker</h3>
~~~js title="web/engine/worker.js (simplifié)"
self.onmessage = async (event) => {
  const msg = event.data;
  if (msg.type !== 'analyze') return;
  const oc = await occt();                       // charge OpenCascade (une fois)
  const result = analyzeCad(oc, new Uint8Array(msg.bytes), msg.name, { … });
  postMessage({ type: 'result', id: msg.id, result }, transferables(result.bodies));
};
~~~
<p>Dans le worker, <code>self</code> désigne le worker lui-même, et <code>postMessage</code> envoie vers la page.</p>
<h3>Le dialogue complet</h3>
<div data-widget="web-flow-worker"></div>
<h3>Copier ou transférer ?</h3>
<p>Par défaut, un message est <strong>copié</strong> (on dit « cloné »). Pour un maillage de 2 millions de triangles, copier des centaines de Mo coûte cher. Le deuxième argument de <code>postMessage</code> liste les <strong>objets transférables</strong> (des <code>ArrayBuffer</code>) : leur mémoire <em>change de propriétaire</em> au lieu d'être recopiée. C'est instantané, mais l'envoyeur ne peut plus s'en servir.</p>
~~~js title="web/engine/worker.js"
function transferables(bodies) {
  const list = [];
  for (const b of bodies) {
    if (b.mesh?.positions?.buffer) list.push(b.mesh.positions.buffer);
    if (b.mesh?.indices?.buffer) list.push(b.mesh.indices.buffer);
  }
  return [...new Set(list)];
}
~~~
<h3>Quand ça casse : l'erreur fatale</h3>
<p>Si OpenCascade plante (fichier corrompu, mémoire pleine), le worker répond <code>{ type: 'error', fatal: true }</code>. Le client rejette alors toutes les tâches en attente et en démarre un neuf (<code>resetWorker()</code>) : l'appli survit à un crash du moteur.</p>
<div class="callout info">3D Reader a plusieurs workers : <code>worker.js</code> (analyse), <code>thickworker.js</code> (épaisseurs, un par cœur), <code>partworker.js</code> (plan de joint), <code>slideworker.js</code> (tiroirs), <code>feedworker.js</code> (alimentation).</div>`,
        en: `<p>A page's JavaScript runs on a single <strong>thread</strong>: the <em>main thread</em>. It draws the screen, spins the 3D view, answers clicks. If you ask it to read a 50 MB STEP for 20 seconds, it does <strong>nothing else</strong> for 20 seconds: the page is frozen, the mouse does nothing, the browser offers "Leave page".</p>
<p>The solution: a <span class="term" data-term="web-worker">Web Worker</span>, a second thread working <strong>in parallel</strong>, on its own. It has no access to the DOM (it cannot touch the screen); it communicates only through <strong>messages</strong>.</p>
<h3>Creating the worker and talking to it</h3>
~~~js title="web/engine/client.js"
worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }); //«1»
worker.onmessage = ({ data }) => {                                                //«2»
  const job = data.id != null ? pending.get(data.id) : null;                      //«3»
  if (data.type === 'progress') job?.onProgress?.(data);
  else if (data.type === 'result') { pending.delete(data.id); job?.resolve(data.result); }
};
~~~
<ol class="notes">
<li>The worker is started from the file <code>worker.js</code>, as an ES module.</li>
<li><code>onmessage</code>: the client's mailbox. Every message from the worker arrives there.</li>
<li>Each request carries a number (<code>id</code>). The client keeps in <code>pending</code> (a <code>Map</code>) the waiting promises, to know which request each answer belongs to.</li>
</ol>
<h3>On the worker side</h3>
~~~js title="web/engine/worker.js (simplified)"
self.onmessage = async (event) => {
  const msg = event.data;
  if (msg.type !== 'analyze') return;
  const oc = await occt();                       // loads OpenCascade (once)
  const result = analyzeCad(oc, new Uint8Array(msg.bytes), msg.name, { … });
  postMessage({ type: 'result', id: msg.id, result }, transferables(result.bodies));
};
~~~
<p>In the worker, <code>self</code> means the worker itself, and <code>postMessage</code> sends to the page.</p>
<h3>The whole dialogue</h3>
<div data-widget="web-flow-worker"></div>
<h3>Copy or transfer?</h3>
<p>By default a message is <strong>copied</strong> ("cloned"). For a 2-million-triangle mesh, copying hundreds of MB is expensive. The second argument of <code>postMessage</code> lists the <strong>transferable objects</strong> (<code>ArrayBuffer</code>s): their memory <em>changes owner</em> instead of being copied. It is instant, but the sender can no longer use it.</p>
~~~js title="web/engine/worker.js"
function transferables(bodies) {
  const list = [];
  for (const b of bodies) {
    if (b.mesh?.positions?.buffer) list.push(b.mesh.positions.buffer);
    if (b.mesh?.indices?.buffer) list.push(b.mesh.indices.buffer);
  }
  return [...new Set(list)];
}
~~~
<h3>When it breaks: the fatal error</h3>
<p>If OpenCascade crashes (corrupt file, memory full), the worker answers <code>{ type: 'error', fatal: true }</code>. The client then rejects every waiting job and starts a fresh one (<code>resetWorker()</code>): the app survives an engine crash.</p>
<div class="callout info">3D Reader has several workers: <code>worker.js</code> (analysis), <code>thickworker.js</code> (thickness, one per core), <code>partworker.js</code> (parting line), <code>slideworker.js</code> (slides), <code>feedworker.js</code> (feeding).</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Le fil principal, c'est <strong>l'accueil d'un restaurant</strong> : il reçoit les clients, prend les commandes, apporte les plats. Si le serveur de l'accueil part en cuisine pour mijoter un bœuf bourguignon pendant 3 heures, plus personne n'est accueilli ! Le Web Worker, c'est <strong>le cuisinier</strong> : il travaille en cuisine (en parallèle), et communique avec la salle uniquement par le <strong>passe-plat</strong> (les messages).</div>
<h3>Les règles du passe-plat</h3>
<ol>
<li>Le cuisinier <strong>ne va jamais en salle</strong> : un worker ne touche pas au DOM (pas de <code>document</code>).</li>
<li>Tout passe par des <strong>bons de commande</strong> : <code>postMessage({ type: 'analyze', id: 7, … })</code>.</li>
<li>Chaque bon a un <strong>numéro</strong> (<code>id</code>) pour que la salle sache quelle table servir quand le plat revient.</li>
<li>Le cuisinier peut envoyer des nouvelles (« le plat sera prêt dans 5 min ») : ce sont les messages <code>progress</code>.</li>
</ol>
<h3>Transférer = donner la casserole</h3>
<p>Copier un message, c'est photocopier une recette : chacun garde la sienne. Transférer un <code>ArrayBuffer</code>, c'est <strong>passer la casserole elle-même</strong> par le passe-plat : très rapide (rien à recopier), mais le cuisinier ne l'a plus. Pour des maillages de plusieurs centaines de Mo, ça change tout.</p>
<h3>Petite expérience mentale</h3>
~~~js
// Sans worker : l'écran gèle pendant la boucle
for (let i = 0; i < 5e9; i++) {}   // ⏳ rien ne bouge
// Avec worker : la page envoie, reste fluide, et reçoit plus tard
worker.postMessage({ type: 'analyze', id: 1, bytes });
worker.onmessage = (e) => afficher(e.data.result);
~~~
<h3>Le cuisinier qui s'évanouit</h3>
<p>Si OpenCascade plante, c'est comme un cuisinier qui fait un malaise : on ne peut plus lui confier de commandes. Le client (la salle) prévient les tables en attente (« désolé, recommandez ») et <strong>embauche un nouveau cuisinier</strong> : un nouveau worker.</p>`,
        en: `<div class="callout analogy">The main thread is <strong>the front desk of a restaurant</strong>: it welcomes customers, takes orders, brings dishes. If the front-desk waiter goes to the kitchen to simmer a beef stew for 3 hours, nobody gets welcomed any more! The Web Worker is <strong>the cook</strong>: they work in the kitchen (in parallel), and talk to the dining room only through the <strong>serving hatch</strong> (messages).</div>
<h3>The rules of the hatch</h3>
<ol>
<li>The cook <strong>never goes into the dining room</strong>: a worker does not touch the DOM (no <code>document</code>).</li>
<li>Everything goes through <strong>order slips</strong>: <code>postMessage({ type: 'analyze', id: 7, … })</code>.</li>
<li>Each slip has a <strong>number</strong> (<code>id</code>) so the dining room knows which table to serve when the dish comes back.</li>
<li>The cook can send news ("ready in 5 min"): those are the <code>progress</code> messages.</li>
</ol>
<h3>Transferring = handing over the pan</h3>
<p>Copying a message is photocopying a recipe: everyone keeps theirs. Transferring an <code>ArrayBuffer</code> is <strong>passing the pan itself</strong> through the hatch: very fast (nothing to copy), but the cook no longer has it. For meshes of several hundred MB, it changes everything.</p>
<h3>Small thought experiment</h3>
~~~js
// Without a worker: the screen freezes during the loop
for (let i = 0; i < 5e9; i++) {}   // ⏳ nothing moves
// With a worker: the page sends, stays smooth, and receives later
worker.postMessage({ type: 'analyze', id: 1, bytes });
worker.onmessage = (e) => show(e.data.result);
~~~
<h3>The cook who faints</h3>
<p>If OpenCascade crashes, it is like a cook who passes out: you can no longer give them orders. The client (the dining room) warns the waiting tables ("sorry, please order again") and <strong>hires a new cook</strong>: a new worker.</p>`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'web-5',
      title: { fr: 'WebAssembly : du C++ dans le navigateur', en: 'WebAssembly: C++ in the browser' },
      skills: ['web.wasm'],
      minutes: 11,
      body: {
        fr: `<p>Lire un fichier STEP et calculer un volume exact, c'est le travail d'<strong>OpenCascade</strong>, une énorme bibliothèque écrite en <strong>C++</strong> (des millions de lignes). Réécrire tout ça en JavaScript ? Impossible. La solution : <span class="term" data-term="wasm">WebAssembly</span> (abrégé <em>wasm</em>).</p>
<h3>Qu'est-ce que c'est ?</h3>
<p>WebAssembly est un <strong>format binaire</strong> que tous les navigateurs modernes savent exécuter, presque aussi vite que du programme natif. On prend du code C++, on le <strong>compile</strong> avec un outil (<span class="term" data-term="emscripten">Emscripten</span>) non pas pour Windows ou Linux, mais pour « la machine wasm ». Résultat pour 3D Reader :</p>
<ul>
<li><code>opencascade.full.wasm</code> : le code machine (≈ 50 Mo, ≈ 14 Mo compressé en <code>.gz</code>) ;</li>
<li><code>opencascade.full.js</code> : la « colle » JavaScript qui le charge et expose les classes C++ (<code>oc.STEPCAFControl_Reader_1</code>…).</li>
</ul>
~~~text
 C++ (OpenCascade)  ──Emscripten──►  .wasm + colle .js  ──navigateur──►  oc.BRepGProp…
   (sources)            (compilation)       (fichiers publiés)          (appelable en JS)
~~~
<h3>Le chargement, étape par étape</h3>
<p>Dans <code>web/engine/occt.js</code> : on télécharge le <code>.wasm.gz</code> en suivant la progression, on le décompresse à la volée, puis on instancie le module.</p>
~~~js title="web/engine/occt.js"
return new Uint8Array(await new Response(stream.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
~~~
<p>Lis de l'intérieur vers l'extérieur : le flux téléchargé (<code>stream</code>) passe dans un décompresseur gzip (<code>pipeThrough</code>), on récupère tous les octets (<code>arrayBuffer()</code>) et on les range dans un tableau d'octets (<code>Uint8Array</code>).</p>
<div class="callout tip">Le navigateur met le fichier en cache : les 14 Mo ne sont téléchargés qu'une fois. Et le chargement n'a lieu que si on ouvre un fichier CAO : un STL n'en a pas besoin (il est lu en JavaScript pur).</div>
<h3>La mémoire wasm : un grand tableau qui ne rétrécit pas</h3>
<p>Le C++ ne voit pas la mémoire du JavaScript. Il a son propre <strong>tas</strong> (<span class="term" data-term="heap">heap</span>) : un immense tableau d'octets (jusqu'à 4 Gio). Il peut <strong>grandir</strong> quand OpenCascade en a besoin, mais ne <strong>rétrécit jamais</strong>. Après un gros fichier, la mémoire reste prise.</p>
~~~js title="web/engine/worker.js"
const HEAP_MAX = 4294901760;
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
~~~
<p>D'où la fonction <code>releaseMemory()</code> de <code>client.js</code> : quand rien n'est en cours, elle <strong>arrête le worker et en relance un neuf</strong>. C'est la seule façon de rendre la mémoire au système. OpenCascade sera rechargé depuis le cache au prochain fichier CAO.</p>
<h3>Les objets C++ à libérer à la main</h3>
<p>En JavaScript, un ramasse-miettes libère seul les objets inutilisés. Les objets C++ créés depuis JS (<code>new oc.TDF_LabelSequence_1()</code>) vivent dans le tas wasm : il faut appeler <code>.delete()</code> quand on a fini, sinon ils s'accumulent (fuite mémoire).</p>
<div class="callout warn">Une exception lancée dans le C++ remonte parfois comme un simple nombre ! <code>worker.js</code> la traduit : <code>if (typeof err === 'number') return \`OpenCascade internal error (\${err})\`;</code></div>`,
        en: `<p>Reading a STEP file and computing an exact volume is the job of <strong>OpenCascade</strong>, a huge library written in <strong>C++</strong> (millions of lines). Rewriting all that in JavaScript? Impossible. The solution: <span class="term" data-term="wasm">WebAssembly</span> (<em>wasm</em> for short).</p>
<h3>What is it?</h3>
<p>WebAssembly is a <strong>binary format</strong> that every modern browser can run, almost as fast as a native program. You take C++ code and <strong>compile</strong> it with a tool (<span class="term" data-term="emscripten">Emscripten</span>) not for Windows or Linux, but for "the wasm machine". The result for 3D Reader:</p>
<ul>
<li><code>opencascade.full.wasm</code>: the machine code (≈ 50 MB, ≈ 14 MB gzip-compressed as <code>.gz</code>);</li>
<li><code>opencascade.full.js</code>: the JavaScript "glue" that loads it and exposes the C++ classes (<code>oc.STEPCAFControl_Reader_1</code>…).</li>
</ul>
~~~text
 C++ (OpenCascade)  ──Emscripten──►  .wasm + .js glue  ──browser──►  oc.BRepGProp…
   (sources)            (compiling)      (published files)        (callable from JS)
~~~
<h3>Loading, step by step</h3>
<p>In <code>web/engine/occt.js</code>: the <code>.wasm.gz</code> is downloaded with progress, decompressed on the fly, then the module is instantiated.</p>
~~~js title="web/engine/occt.js"
return new Uint8Array(await new Response(stream.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
~~~
<p>Read it inside out: the downloaded stream (<code>stream</code>) goes through a gzip decompressor (<code>pipeThrough</code>), all the bytes are collected (<code>arrayBuffer()</code>) and put into a byte array (<code>Uint8Array</code>).</p>
<div class="callout tip">The browser caches the file: the 14 MB are downloaded only once. And loading only happens when you open a CAD file: an STL does not need it (it is read in plain JavaScript).</div>
<h3>Wasm memory: a big array that never shrinks</h3>
<p>The C++ cannot see JavaScript's memory. It has its own <strong>heap</strong> (<span class="term" data-term="heap">heap</span>): a huge byte array (up to 4 GiB). It can <strong>grow</strong> when OpenCascade needs it, but <strong>never shrinks</strong>. After a big file, the memory stays taken.</p>
~~~js title="web/engine/worker.js"
const HEAP_MAX = 4294901760;
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
~~~
<p>Hence the <code>releaseMemory()</code> function in <code>client.js</code>: when nothing is running, it <strong>stops the worker and starts a fresh one</strong>. That is the only way to give the memory back to the system. OpenCascade is reloaded from the cache with the next CAD file.</p>
<h3>C++ objects to free by hand</h3>
<p>In JavaScript, a garbage collector frees unused objects by itself. C++ objects created from JS (<code>new oc.TDF_LabelSequence_1()</code>) live in the wasm heap: you must call <code>.delete()</code> when done, otherwise they pile up (memory leak).</p>
<div class="callout warn">An exception thrown in the C++ sometimes comes up as a bare number! <code>worker.js</code> translates it: <code>if (typeof err === 'number') return \`OpenCascade internal error (\${err})\`;</code></div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Tu as une <strong>machine-outil allemande</strong> géniale (OpenCascade, en C++), mais ton atelier (le navigateur) n'accepte que des machines au format « web ». WebAssembly, c'est un <strong>adaptateur universel</strong> : on reconditionne la machine une fois (compilation avec Emscripten), et elle tourne dans n'importe quel atelier web, presque à pleine vitesse. Le fichier <code>.js</code> de « colle », c'est le <strong>pupitre de commande</strong> traduit en français : des boutons JavaScript qui pilotent la machine.</div>
<h3>Pourquoi compresser en .gz ?</h3>
<p>50 Mo, c'est comme livrer la machine montée dans un camion. En <code>.gz</code>, elle arrive en kit (14 Mo) et <code>DecompressionStream</code> la remonte pendant le déchargement, sans attendre que tout le camion soit vide.</p>
<h3>La mémoire : un bac de rétention</h3>
<p>Le tas wasm, c'est un <strong>bac</strong> où la machine pose ses pièces de travail. Si elle a besoin de plus de place, on lui met un bac plus grand. Mais on ne peut <strong>jamais</strong> lui reprendre un bac plus petit tant qu'elle tourne. La seule façon de récupérer de la place : <strong>éteindre la machine et en rallumer une neuve</strong> (c'est <code>releaseMemory()</code> : on redémarre le worker).</p>
<table>
<thead><tr><th></th><th>JavaScript</th><th>C++ / wasm</th></tr></thead>
<tbody>
<tr><td>Qui range les objets inutiles ?</td><td>le ramasse-miettes, tout seul</td><td>toi : <code>obj.delete()</code></td></tr>
<tr><td>La mémoire se libère ?</td><td>oui, petit à petit</td><td>le tas ne rétrécit jamais</td></tr>
<tr><td>Erreur</td><td>un objet <code>Error</code> avec message</td><td>parfois juste un nombre</td></tr>
</tbody>
</table>
<h3>Et pourquoi pas un serveur ?</h3>
<p>3D Reader a aussi un serveur Python (FastAPI) qui fait le même calcul. Mais GitHub Pages ne peut pas exécuter Python : il ne sert que des fichiers. Avec WebAssembly, <strong>ton propre PC fait le calcul</strong> — et le fichier de la pièce ne quitte jamais ta machine. Bonus confidentialité !</p>`,
        en: `<div class="callout analogy">You have a brilliant <strong>German machine tool</strong> (OpenCascade, in C++), but your workshop (the browser) only accepts "web" format machines. WebAssembly is a <strong>universal adapter</strong>: the machine is reconditioned once (compiled with Emscripten), and it runs in any web workshop, almost at full speed. The <code>.js</code> "glue" file is the <strong>control panel</strong> translated into your language: JavaScript buttons that drive the machine.</div>
<h3>Why compress to .gz?</h3>
<p>50 MB is like delivering the machine fully assembled in a lorry. As <code>.gz</code> it arrives as a kit (14 MB) and <code>DecompressionStream</code> reassembles it while unloading, without waiting for the whole lorry to be empty.</p>
<h3>Memory: a work tray</h3>
<p>The wasm heap is a <strong>tray</strong> where the machine puts its work pieces. If it needs more room, it gets a bigger tray. But you can <strong>never</strong> give it a smaller tray while it runs. The only way to get the room back: <strong>switch the machine off and start a fresh one</strong> (that is <code>releaseMemory()</code>: the worker is restarted).</p>
<table>
<thead><tr><th></th><th>JavaScript</th><th>C++ / wasm</th></tr></thead>
<tbody>
<tr><td>Who tidies unused objects?</td><td>the garbage collector, by itself</td><td>you: <code>obj.delete()</code></td></tr>
<tr><td>Is memory released?</td><td>yes, little by little</td><td>the heap never shrinks</td></tr>
<tr><td>Error</td><td>an <code>Error</code> object with a message</td><td>sometimes just a number</td></tr>
</tbody>
</table>
<h3>Why not a server?</h3>
<p>3D Reader also has a Python server (FastAPI) doing the same computation. But GitHub Pages cannot run Python: it only serves files. With WebAssembly, <strong>your own PC does the computing</strong> — and the part file never leaves your machine. Privacy bonus!</p>`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'web-6',
      title: { fr: 'three.js : afficher la pièce en 3D', en: 'three.js: showing the part in 3D' },
      skills: ['web.three'],
      minutes: 13,
      body: {
        fr: `<p><strong>three.js</strong> est la bibliothèque JavaScript qui dessine la vue 3D de 3D Reader. Elle s'appuie sur <strong>WebGL</strong>, qui fait travailler la carte graphique. Pour afficher quoi que ce soit, il faut toujours les mêmes ingrédients, comme sur un plateau de tournage.</p>
<table>
<thead><tr><th>Ingrédient</th><th>Rôle</th><th>Dans <code>web/app.js</code></th></tr></thead>
<tbody>
<tr><td>Scène</td><td>le plateau : contient tout ce qui existe</td><td><code>new THREE.Scene()</code></td></tr>
<tr><td>Caméra</td><td>le point de vue</td><td><code>ViewCamera</code> (perspective ou orthographique)</td></tr>
<tr><td>Lumières</td><td>sans elles, tout est noir</td><td><code>HemisphereLight</code>, <code>DirectionalLight</code></td></tr>
<tr><td>Maillages</td><td>les objets : géométrie + matériau</td><td><code>new THREE.Mesh(geom, mat)</code></td></tr>
<tr><td>Rendu</td><td>la caméra qui filme, 60 fois par seconde</td><td><code>new THREE.WebGLRenderer(…)</code></td></tr>
<tr><td>Contrôles</td><td>tourner / zoomer à la souris</td><td><code>TrackballControls</code></td></tr>
</tbody>
</table>
<h3>Un maillage = des points + des triangles</h3>
<p>Toute surface affichée est découpée en <strong>triangles</strong> (c'est la « tessellation »). Un <span class="term" data-term="mesh">maillage</span> se décrit avec deux tableaux :</p>
<ul>
<li><code>positions</code> : les coordonnées x, y, z de chaque sommet, à la suite (<code>Float32Array</code>) ;</li>
<li><code>indices</code> : pour chaque triangle, les numéros de ses 3 sommets (<code>Uint32Array</code>).</li>
</ul>
~~~js run
// Un carré de 10 mm = 4 sommets, 2 triangles
const positions = new Float32Array([
  0, 0, 0,    // sommet 0
  10, 0, 0,   // sommet 1
  10, 10, 0,  // sommet 2
  0, 10, 0,   // sommet 3
]);
const indices = new Uint32Array([0, 1, 2,   0, 2, 3]);
console.log('Sommets :', positions.length / 3);
console.log('Triangles :', indices.length / 3);
// Les sommets partagés (0 et 2) ne sont stockés qu'une fois : c'est l'intérêt des indices
~~~
<h3>Le vrai code : construire un corps</h3>
~~~js title="web/app.js (buildModel, simplifié)"
const geom = new THREE.BufferGeometry();
geom.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //«1»
geom.setIndex(new THREE.BufferAttribute(indices, 1));                   //«2»
geom.computeVertexNormals();                                            //«3»
const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.55, side: THREE.DoubleSide }); //«4»
modelGroup.add(new THREE.Mesh(geom, mat));                              //«5»
~~~
<ol class="notes">
<li>Les positions, lues 3 par 3 (x, y, z).</li>
<li>Les indices, lus 1 par 1.</li>
<li>Calcule les <strong>normales</strong> (la direction « vers l'extérieur » de chaque point), nécessaires à l'éclairage.</li>
<li>Le matériau : couleur, aspect métallique, rugosité. <code>DoubleSide</code> permet de voir l'intérieur quand on coupe la pièce.</li>
<li>Le maillage est ajouté au groupe du modèle, donc à la scène.</li>
</ol>
<h3>Perspective ou orthographique ?</h3>
<ul>
<li><strong>Perspective</strong> : comme l'œil, les objets lointains sont plus petits. Vue « Iso » et « Coulée ».</li>
<li><strong>Orthographique</strong> : comme sur un plan, les arêtes parallèles restent parallèles, sans déformation. Vues Face / Dessus / Droite, comme dans SolidWorks.</li>
</ul>
<div class="callout project">3D Reader utilise <strong>une seule</strong> caméra (<code>class ViewCamera extends THREE.PerspectiveCamera</code>) dont on bascule la projection, au lieu d'échanger deux caméras : les contrôles, le lancer de rayons (clic sur une face) et la lampe frontale restent attachés au même objet.</div>
<div class="callout info">Le maillage d'affichage est une <em>approximation</em>. Pour un STEP, le volume exact vient d'OpenCascade (B-rep), pas des triangles : c'est pour ça que changer la « qualité d'affichage » ne change pas le volume calculé.</div>`,
        en: `<p><strong>three.js</strong> is the JavaScript library that draws 3D Reader's 3D view. It relies on <strong>WebGL</strong>, which puts the graphics card to work. To show anything you always need the same ingredients, like on a film set.</p>
<table>
<thead><tr><th>Ingredient</th><th>Role</th><th>In <code>web/app.js</code></th></tr></thead>
<tbody>
<tr><td>Scene</td><td>the set: holds everything that exists</td><td><code>new THREE.Scene()</code></td></tr>
<tr><td>Camera</td><td>the point of view</td><td><code>ViewCamera</code> (perspective or orthographic)</td></tr>
<tr><td>Lights</td><td>without them, everything is black</td><td><code>HemisphereLight</code>, <code>DirectionalLight</code></td></tr>
<tr><td>Meshes</td><td>the objects: geometry + material</td><td><code>new THREE.Mesh(geom, mat)</code></td></tr>
<tr><td>Renderer</td><td>the camera that films, 60 times a second</td><td><code>new THREE.WebGLRenderer(…)</code></td></tr>
<tr><td>Controls</td><td>rotate / zoom with the mouse</td><td><code>TrackballControls</code></td></tr>
</tbody>
</table>
<h3>A mesh = points + triangles</h3>
<p>Every surface shown is cut into <strong>triangles</strong> ("tessellation"). A <span class="term" data-term="mesh">mesh</span> is described by two arrays:</p>
<ul>
<li><code>positions</code>: the x, y, z coordinates of each vertex, one after the other (<code>Float32Array</code>);</li>
<li><code>indices</code>: for each triangle, the numbers of its 3 vertices (<code>Uint32Array</code>).</li>
</ul>
~~~js run
// A 10 mm square = 4 vertices, 2 triangles
const positions = new Float32Array([
  0, 0, 0,    // vertex 0
  10, 0, 0,   // vertex 1
  10, 10, 0,  // vertex 2
  0, 10, 0,   // vertex 3
]);
const indices = new Uint32Array([0, 1, 2,   0, 2, 3]);
console.log('Vertices:', positions.length / 3);
console.log('Triangles:', indices.length / 3);
// Shared vertices (0 and 2) are stored only once: that is the point of indices
~~~
<h3>The real code: building a body</h3>
~~~js title="web/app.js (buildModel, simplified)"
const geom = new THREE.BufferGeometry();
geom.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //«1»
geom.setIndex(new THREE.BufferAttribute(indices, 1));                   //«2»
geom.computeVertexNormals();                                            //«3»
const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.55, side: THREE.DoubleSide }); //«4»
modelGroup.add(new THREE.Mesh(geom, mat));                              //«5»
~~~
<ol class="notes">
<li>The positions, read 3 by 3 (x, y, z).</li>
<li>The indices, read 1 by 1.</li>
<li>Computes the <strong>normals</strong> (the "outward" direction at each point), needed for lighting.</li>
<li>The material: colour, metallic look, roughness. <code>DoubleSide</code> lets you see inside when the part is sectioned.</li>
<li>The mesh is added to the model group, hence to the scene.</li>
</ol>
<h3>Perspective or orthographic?</h3>
<ul>
<li><strong>Perspective</strong>: like the eye, far objects look smaller. "Iso" and "Casting" views.</li>
<li><strong>Orthographic</strong>: like on a drawing, parallel edges stay parallel, no distortion. Front / Top / Right views, as in SolidWorks.</li>
</ul>
<div class="callout project">3D Reader uses <strong>one</strong> camera (<code>class ViewCamera extends THREE.PerspectiveCamera</code>) whose projection is switched, instead of swapping two cameras: the controls, the raycaster (clicking a face) and the headlight stay attached to the same object.</div>
<div class="callout info">The display mesh is an <em>approximation</em>. For a STEP file, the exact volume comes from OpenCascade (B-rep), not from the triangles: that is why changing the "display quality" does not change the computed volume.</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">three.js, c'est un <strong>studio photo</strong>. Tu poses ta pièce sur la table (la <em>scène</em>), tu installes des projecteurs (les <em>lumières</em>), tu choisis ton appareil et ton objectif (la <em>caméra</em>), et le photographe (le <em>renderer</em>) prend 60 photos par seconde. Les <em>contrôles</em>, c'est toi qui tournes autour de la table avec l'appareil.</div>
<h3>Le maillage, comme un patron en papier</h3>
<p>Imagine que tu dois fabriquer une boîte en carton avec <strong>uniquement des triangles</strong>. Tu numérotes les coins de la boîte (0, 1, 2…) et tu notes leurs coordonnées : c'est le tableau <code>positions</code>. Puis tu fais la liste des triangles à découper, en citant les numéros de coins : « triangle A = coins 0, 1, 2 » : c'est le tableau <code>indices</code>.</p>
~~~text
 3 ─────── 2        positions : 0=(0,0)  1=(10,0)  2=(10,10)  3=(0,10)
 │      ╱  │        indices   : [0,1,2]  [0,2,3]
 │    ╱    │
 │  ╱      │        → 4 coins, 2 triangles, un carré
 0 ─────── 1
~~~
<p>Une pièce de fonderie, c'est la même chose avec des centaines de milliers de triangles.</p>
<h3>Lire <code>new THREE.BufferAttribute(positions, 3)</code></h3>
<p>« Voici un long tableau de nombres ; lis-les <strong>par groupes de 3</strong> (x, y, z) ». Pour les indices, le <code>1</code> veut dire « un nombre à la fois ».</p>
<h3>Le matériau, c'est la peinture</h3>
<ul>
<li><code>color</code> : la teinte (celle du fichier CAO si elle existe).</li>
<li><code>metalness</code> / <code>roughness</code> : brillant comme de l'alu poli, ou mat comme du sable.</li>
<li>Pas de lumière ? Tout est noir, même avec une belle couleur. Les débutants l'oublient souvent !</li>
</ul>
<h3>Perspective vs orthographique, au bureau d'études</h3>
<p>La <strong>perspective</strong>, c'est une photo : les rails de chemin de fer se rejoignent au loin. L'<strong>orthographique</strong>, c'est un plan coté : un cylindre vu de face est un rectangle parfait, on peut y mesurer des longueurs. C'est pour ça que les vues Face/Dessus/Droite sont orthographiques.</p>`,
        en: `<div class="callout analogy">three.js is a <strong>photo studio</strong>. You put your part on the table (the <em>scene</em>), set up spotlights (the <em>lights</em>), choose your camera and lens (the <em>camera</em>), and the photographer (the <em>renderer</em>) takes 60 pictures a second. The <em>controls</em> are you walking around the table with the camera.</div>
<h3>The mesh, like a paper pattern</h3>
<p>Imagine you must make a cardboard box with <strong>only triangles</strong>. You number the corners of the box (0, 1, 2…) and write down their coordinates: that is the <code>positions</code> array. Then you list the triangles to cut, quoting the corner numbers: "triangle A = corners 0, 1, 2": that is the <code>indices</code> array.</p>
~~~text
 3 ─────── 2        positions: 0=(0,0)  1=(10,0)  2=(10,10)  3=(0,10)
 │      ╱  │        indices  : [0,1,2]  [0,2,3]
 │    ╱    │
 │  ╱      │        → 4 corners, 2 triangles, a square
 0 ─────── 1
~~~
<p>A cast part is the same thing with hundreds of thousands of triangles.</p>
<h3>Reading <code>new THREE.BufferAttribute(positions, 3)</code></h3>
<p>"Here is a long array of numbers; read them <strong>in groups of 3</strong> (x, y, z)". For the indices, the <code>1</code> means "one number at a time".</p>
<h3>The material is the paint</h3>
<ul>
<li><code>color</code>: the hue (the CAD file's one if it exists).</li>
<li><code>metalness</code> / <code>roughness</code>: shiny like polished aluminium, or matte like sand.</li>
<li>No light? Everything is black, even with a nice colour. Beginners often forget it!</li>
</ul>
<h3>Perspective vs orthographic, in the design office</h3>
<p><strong>Perspective</strong> is a photo: railway tracks meet in the distance. <strong>Orthographic</strong> is a dimensioned drawing: a cylinder seen from the front is a perfect rectangle, you can measure lengths on it. That is why the Front/Top/Right views are orthographic.</p>`,
      },
    },
    // ------------------------------------------------------------------ 7
    {
      id: 'web-7',
      title: { fr: 'Modules, build statique et outils F12', en: 'Modules, static build and F12 tools' },
      skills: ['web.devtools'],
      minutes: 12,
      body: {
        fr: `<h3>Les modules ES : découper le code en fichiers</h3>
<p>3D Reader compte des dizaines de fichiers JavaScript. Chacun est un <span class="term" data-term="module">module</span> : il <strong>exporte</strong> ce qu'il partage, et <strong>importe</strong> ce dont il a besoin.</p>
~~~js title="web/app.js"
import * as THREE from "three";                                         //«1»
import { TrackballControls } from "three/addons/controls/TrackballControls.js"; //«2»
import { applyToPage, setLanguage, t } from "./i18n.js";                //«3»
~~~
<ol class="notes">
<li>Tout three.js, rangé sous le nom <code>THREE</code>. <code>"three"</code> est un <strong>spécificateur nu</strong> (pas un chemin).</li>
<li>Un module complémentaire (<em>addon</em>) de three.js.</li>
<li>Un chemin relatif (<code>./</code>) : un fichier voisin de l'appli.</li>
</ol>
<h3>L'import map : l'annuaire des noms</h3>
<p>Le navigateur ne sait pas ce qu'est <code>"three"</code>. L'<strong>import map</strong> de <code>index.html</code> le lui dit :</p>
~~~html title="web/index.html"
<script type="importmap">
  {
    "imports": {
      "three": "./vendor/three/three.module.js",
      "three/addons/": "./vendor/three/addons/"
    }
  }
</script>
~~~
<div class="callout warn">Les import maps <strong>ne s'appliquent pas dans les Web Workers</strong>. C'est pourquoi <code>worker.js</code> n'importe jamais <code>"three"</code> : le calcul des enveloppes (qui utilise three) est fait sur le fil principal, dans <code>client.js</code>.</div>
<h3>Pas de bundler : le build statique</h3>
<p>Beaucoup de projets passent leur code dans un <em>bundler</em> (Webpack, Vite) qui fusionne tout en un fichier. 3D Reader, non : les modules sont servis tels quels. Le « build » (<code>npm run build</code>, script <code>scripts/build-web.mjs</code>) fait seulement :</p>
<ol>
<li>copier three.js et OpenCascade dans <code>web/vendor/</code> (le wasm compressé en gzip) ;</li>
<li>copier <code>web/</code> dans <code>dist/</code> et ajouter les fichiers que GitHub Pages attend (<code>404.html</code>, <code>.nojekyll</code>…).</li>
</ol>
<p>Le dossier <code>dist/</code> est un site <strong>statique</strong> : uniquement des fichiers, aucun programme côté serveur. GitHub Pages le publie.</p>
<h3>Les outils de développement (F12)</h3>
<p>Appuie sur <kbd>F12</kbd> (ou <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>I</kbd>) dans 3D Reader. Les <span class="term" data-term="devtools">DevTools</span> s'ouvrent :</p>
<table>
<thead><tr><th>Onglet</th><th>Pour quoi faire</th></tr></thead>
<tbody>
<tr><td><strong>Elements</strong></td><td>voir le DOM en direct, modifier un style pour essayer</td></tr>
<tr><td><strong>Console</strong></td><td>lire les erreurs (en rouge), les <code>console.log</code>, taper du JS (<code>reader3d.part()</code>)</td></tr>
<tr><td><strong>Network / Réseau</strong></td><td>voir chaque fichier téléchargé (le <code>.wasm.gz</code>, les appels à <code>/api/ai</code>), leur taille, leur code HTTP</td></tr>
<tr><td><strong>Application</strong></td><td>regarder localStorage, IndexedDB, le service worker ; tout effacer</td></tr>
<tr><td><strong>Sources</strong></td><td>lire le code, poser un point d'arrêt pour l'exécuter pas à pas</td></tr>
<tr><td><strong>Performance / Memory</strong></td><td>trouver ce qui est lent ou ce qui consomme la mémoire</td></tr>
</tbody>
</table>
<div class="callout tip">Quand quelque chose « ne marche pas », le premier réflexe : <strong>F12 → Console</strong>. Le message rouge et le nom de fichier:ligne te disent souvent exactement où chercher — et c'est ce qu'il faut copier à Claude Code.</div>`,
        en: `<h3>ES modules: splitting code into files</h3>
<p>3D Reader has dozens of JavaScript files. Each one is a <span class="term" data-term="module">module</span>: it <strong>exports</strong> what it shares and <strong>imports</strong> what it needs.</p>
~~~js title="web/app.js"
import * as THREE from "three";                                         //«1»
import { TrackballControls } from "three/addons/controls/TrackballControls.js"; //«2»
import { applyToPage, setLanguage, t } from "./i18n.js";                //«3»
~~~
<ol class="notes">
<li>All of three.js, stored under the name <code>THREE</code>. <code>"three"</code> is a <strong>bare specifier</strong> (not a path).</li>
<li>An add-on module of three.js.</li>
<li>A relative path (<code>./</code>): a neighbouring file of the app.</li>
</ol>
<h3>The import map: the directory of names</h3>
<p>The browser does not know what <code>"three"</code> is. The <strong>import map</strong> in <code>index.html</code> tells it:</p>
~~~html title="web/index.html"
<script type="importmap">
  {
    "imports": {
      "three": "./vendor/three/three.module.js",
      "three/addons/": "./vendor/three/addons/"
    }
  }
</script>
~~~
<div class="callout warn">Import maps <strong>do not apply inside Web Workers</strong>. That is why <code>worker.js</code> never imports <code>"three"</code>: the envelope computation (which uses three) is done on the main thread, in <code>client.js</code>.</div>
<h3>No bundler: the static build</h3>
<p>Many projects run their code through a <em>bundler</em> (Webpack, Vite) that merges everything into one file. Not 3D Reader: the modules are served as they are. The "build" (<code>npm run build</code>, script <code>scripts/build-web.mjs</code>) only:</p>
<ol>
<li>copies three.js and OpenCascade into <code>web/vendor/</code> (the wasm gzip-compressed);</li>
<li>copies <code>web/</code> into <code>dist/</code> and adds the files GitHub Pages expects (<code>404.html</code>, <code>.nojekyll</code>…).</li>
</ol>
<p>The <code>dist/</code> folder is a <strong>static</strong> site: files only, no program on the server side. GitHub Pages publishes it.</p>
<h3>Developer tools (F12)</h3>
<p>Press <kbd>F12</kbd> (or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>) in 3D Reader. The <span class="term" data-term="devtools">DevTools</span> open:</p>
<table>
<thead><tr><th>Tab</th><th>What for</th></tr></thead>
<tbody>
<tr><td><strong>Elements</strong></td><td>see the live DOM, change a style to try things</td></tr>
<tr><td><strong>Console</strong></td><td>read errors (in red), the <code>console.log</code>s, type JS (<code>reader3d.part()</code>)</td></tr>
<tr><td><strong>Network</strong></td><td>see each downloaded file (the <code>.wasm.gz</code>, the calls to <code>/api/ai</code>), their size, their HTTP code</td></tr>
<tr><td><strong>Application</strong></td><td>look at localStorage, IndexedDB, the service worker; clear everything</td></tr>
<tr><td><strong>Sources</strong></td><td>read the code, set a breakpoint to run it step by step</td></tr>
<tr><td><strong>Performance / Memory</strong></td><td>find what is slow or what uses memory</td></tr>
</tbody>
</table>
<div class="callout tip">When something "does not work", the first reflex: <strong>F12 → Console</strong>. The red message and the file:line name often tell you exactly where to look — and that is what to copy to Claude Code.</div>`,
      },
      deep: {
        fr: `<div class="callout analogy">Les modules, ce sont les <strong>services d'une usine</strong> : la fonderie, l'usinage, le contrôle. Chaque service a ses outils à lui et <strong>livre</strong> certaines choses aux autres (<code>export</code>). Un service qui a besoin d'une pièce la <strong>commande</strong> à un autre (<code>import</code>). L'import map, c'est <strong>l'annuaire interne</strong> : quand quelqu'un demande « le service three », l'annuaire répond « bâtiment vendor/three, bureau three.module.js ».</div>
<h3>Lire une ligne d'import</h3>
~~~js
import { t, setLanguage } from "./i18n.js";
//       ^^^^^^^^^^^^^^^^        ^^^^^^^^^^
//       ce que je prends        chez qui (fichier voisin)
~~~
<ul>
<li>Avec des accolades : je prends <strong>certaines choses nommées</strong>.</li>
<li><code>import * as THREE</code> : je prends <strong>tout</strong>, rangé dans une boîte appelée THREE (on écrit ensuite <code>THREE.Scene</code>).</li>
<li>Chemin qui commence par <code>./</code> ou <code>../</code> : un fichier du projet. Sinon (<code>"three"</code>) : un nom à chercher dans l'annuaire.</li>
</ul>
<h3>Le build, c'est la mise en carton</h3>
<p>Avant d'expédier le site, <code>npm run build</code> met dans un carton (<code>dist/</code>) tout ce dont le client aura besoin, y compris les bibliothèques extérieures. GitHub Pages n'est qu'un <strong>entrepôt de cartons</strong> : il distribue les fichiers, il n'exécute rien.</p>
<h3>F12, le tableau de bord du mécanicien</h3>
<p>C'est comme brancher la valise de diagnostic sur une voiture :</p>
<ul>
<li><strong>Console</strong> = les voyants d'alerte (erreurs rouges, avertissements jaunes).</li>
<li><strong>Réseau</strong> = le compteur de ce qui entre et sort (quel fichier, combien de Mo, réponse 200 OK ou 404 introuvable).</li>
<li><strong>Application</strong> = la boîte à gants (ce que le site a rangé sur ta machine).</li>
<li><strong>Elements</strong> = la carrosserie démontable : tu peux changer une couleur pour voir, sans rien casser (tout revient en rechargeant).</li>
</ul>
<div class="callout tip">Rien de ce que tu fais dans F12 n'est enregistré dans le code : un rechargement (F5) remet tout comme avant. Tu peux expérimenter sans peur.</div>`,
        en: `<div class="callout analogy">Modules are the <strong>departments of a plant</strong>: foundry, machining, inspection. Each department has its own tools and <strong>delivers</strong> some things to the others (<code>export</code>). A department that needs a part <strong>orders</strong> it from another (<code>import</code>). The import map is the <strong>internal directory</strong>: when someone asks for "the three department", the directory answers "building vendor/three, office three.module.js".</div>
<h3>Reading an import line</h3>
~~~js
import { t, setLanguage } from "./i18n.js";
//       ^^^^^^^^^^^^^^^^        ^^^^^^^^^^
//       what I take             from whom (neighbour file)
~~~
<ul>
<li>With braces: I take <strong>some named things</strong>.</li>
<li><code>import * as THREE</code>: I take <strong>everything</strong>, stored in a box called THREE (then you write <code>THREE.Scene</code>).</li>
<li>Path starting with <code>./</code> or <code>../</code>: a project file. Otherwise (<code>"three"</code>): a name to look up in the directory.</li>
</ul>
<h3>The build is the packing</h3>
<p>Before shipping the site, <code>npm run build</code> puts into a box (<code>dist/</code>) everything the client will need, including the outside libraries. GitHub Pages is only a <strong>box warehouse</strong>: it hands out the files, it runs nothing.</p>
<h3>F12, the mechanic's dashboard</h3>
<p>It is like plugging the diagnostic case into a car:</p>
<ul>
<li><strong>Console</strong> = the warning lights (red errors, yellow warnings).</li>
<li><strong>Network</strong> = the meter of what comes in and out (which file, how many MB, answer 200 OK or 404 not found).</li>
<li><strong>Application</strong> = the glovebox (what the site stored on your machine).</li>
<li><strong>Elements</strong> = removable bodywork: you can change a colour to see, without breaking anything (everything comes back on reload).</li>
</ul>
<div class="callout tip">Nothing you do in F12 is saved in the code: a reload (F5) puts everything back. You can experiment without fear.</div>`,
      },
    },
  ],
  questions: [
    // ---------------------------------------------------------------- web-1 quiz
    {
      id: 'web-q1', skill: 'web.layers', lesson: 'web-1', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque couche à son rôle.', en: 'Match each layer with its role.' },
      pairs: {
        fr: [['HTML', 'la structure (ce qu’il y a sur la page)'], ['CSS', 'le style (à quoi ça ressemble)'], ['JavaScript', 'le comportement (ce que ça fait)']],
        en: [['HTML', 'the structure (what is on the page)'], ['CSS', 'the style (what it looks like)'], ['JavaScript', 'the behaviour (what it does)']],
      },
      explain: { fr: 'Forme, finition, fonction : HTML décrit les éléments, CSS les habille, JS les fait agir.', en: 'Shape, finish, function: HTML describes the elements, CSS dresses them, JS makes them act.' },
    },
    {
      id: 'web-q2', skill: 'web.layers', lesson: 'web-1', level: 1, type: 'mcq',
      prompt: { fr: 'Dans un sélecteur CSS, que désigne <code>.tab</code> ?', en: 'In a CSS selector, what does <code>.tab</code> mean?' },
      choices: {
        fr: ['Les éléments qui ont la classe « tab »', 'L’élément dont l’id est « tab »', 'Toutes les balises &lt;tab&gt;', 'Le fichier tab.css'],
        en: ['Elements with the class "tab"', 'The element whose id is "tab"', 'All &lt;tab&gt; tags', 'The file tab.css'],
      },
      answer: 0,
      explain: { fr: 'Le point = classe ; le dièse <code>#</code> = id ; un nom seul = type de balise.', en: 'Dot = class; hash <code>#</code> = id; a bare name = tag type.' },
    },
    {
      id: 'web-q3', skill: 'web.layers', lesson: 'web-1', level: 2, type: 'fill',
      prompt: { fr: 'Complète pour utiliser la variable CSS de couleur d’accent.', en: 'Fill in to use the accent colour CSS variable.' },
      code: '.tab.active { color: ____(--accent); }', lang: 'css',
      accept: ['var'],
      explain: { fr: '<code>var(--accent)</code> lit la variable définie dans <code>:root</code>. Changer sa valeur change toute l’appli.', en: '<code>var(--accent)</code> reads the variable defined in <code>:root</code>. Changing its value changes the whole app.' },
    },
    {
      id: 'web-q4', skill: 'web.layers', lesson: 'web-1', level: 2, type: 'tf',
      prompt: { fr: 'L’attribut <code>data-i18n="tab.viewer"</code> contient le texte français de l’onglet.', en: 'The attribute <code>data-i18n="tab.viewer"</code> contains the French text of the tab.' },
      answer: false,
      explain: { fr: 'Il contient une <strong>clé</strong>. <code>i18n.js</code> cherche cette clé dans le dictionnaire de la langue choisie et remplace le texte.', en: 'It holds a <strong>key</strong>. <code>i18n.js</code> looks the key up in the chosen language’s dictionary and replaces the text.' },
    },
    // ---------------------------------------------------------------- web-2 quiz
    {
      id: 'web-q5', skill: 'web.dom', lesson: 'web-2', level: 1, type: 'mcq',
      prompt: { fr: 'Que renvoie <code>document.querySelector(\'.tab\')</code> ?', en: 'What does <code>document.querySelector(\'.tab\')</code> return?' },
      choices: {
        fr: ['Le premier élément de classe « tab » (ou null)', 'Tous les onglets', 'Le texte de l’onglet', 'Une erreur s’il y en a plusieurs'],
        en: ['The first element with class "tab" (or null)', 'All the tabs', 'The tab text', 'An error if there are several'],
      },
      answer: 0,
      explain: { fr: '<code>querySelector</code> = le premier ; <code>querySelectorAll</code> = tous.', en: '<code>querySelector</code> = the first one; <code>querySelectorAll</code> = all of them.' },
    },
    {
      id: 'web-q6', skill: 'web.dom', lesson: 'web-2', level: 2, type: 'line',
      prompt: { fr: 'Quelle ligne est <strong>dangereuse</strong> si <code>nom</code> vient d’un fichier STEP ?', en: 'Which line is <strong>dangerous</strong> if <code>name</code> comes from a STEP file?' },
      code: "const li = document.createElement('li');\nli.classList.add('body-row');\nli.innerHTML = nom;\nliste.appendChild(li);",
      lang: 'js', answer: 2,
      explain: { fr: '<code>innerHTML</code> interprète le texte comme du HTML : un nom piégé pourrait exécuter du code (XSS). Il faut <code>textContent</code>.', en: '<code>innerHTML</code> interprets the text as HTML: a booby-trapped name could run code (XSS). Use <code>textContent</code>.' },
    },
    {
      id: 'web-q7', skill: 'web.dom', lesson: 'web-2', level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert <code>document.dispatchEvent(new CustomEvent("reader3d-part"))</code> ?', en: 'What is <code>document.dispatchEvent(new CustomEvent("reader3d-part"))</code> for?' },
      choices: {
        fr: ['Annoncer que la pièce analysée est prête, à qui écoute', 'Envoyer la pièce au serveur', 'Créer un nouvel onglet', 'Sauvegarder la pièce dans localStorage'],
        en: ['Announce that the analysed part is ready, to whoever listens', 'Send the part to the server', 'Create a new tab', 'Save the part in localStorage'],
      },
      answer: 0,
      explain: { fr: 'Un événement personnalisé est une annonce ; les modules qui ont fait <code>addEventListener("reader3d-part", …)</code> réagissent (la page Chiffrage, par exemple).', en: 'A custom event is an announcement; modules that did <code>addEventListener("reader3d-part", …)</code> react (the Costing page, for example).' },
    },
    {
      id: 'web-q8', skill: 'web.dom', lesson: 'web-2', level: 1, type: 'fill',
      prompt: { fr: 'Complète pour réagir au clic.', en: 'Fill in to react to the click.' },
      code: "bouton.____('click', ouvrirFichier);", lang: 'js',
      accept: ['addEventListener'],
      explain: { fr: '<code>addEventListener(événement, fonction)</code> installe un écouteur, appelé à chaque clic.', en: '<code>addEventListener(event, function)</code> installs a listener, called on every click.' },
    },
    // ---------------------------------------------------------------- web-3 quiz
    {
      id: 'web-q9', skill: 'web.storage', lesson: 'web-3', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque stockage à son usage typique.', en: 'Match each storage with its typical use.' },
      pairs: {
        fr: [['localStorage', 'petits réglages qui restent'], ['sessionStorage', 'info valable le temps de l’onglet'], ['IndexedDB', 'gros volumes : conversations, résultats'], ['Service Worker', 'intercepter et modifier les réponses réseau']],
        en: [['localStorage', 'small settings that stay'], ['sessionStorage', 'info valid while the tab is open'], ['IndexedDB', 'large volumes: conversations, results'], ['Service Worker', 'intercept and change network responses']],
      },
      explain: { fr: 'Chaque rangement a sa taille et sa durée de vie : on choisit selon le besoin.', en: 'Each storage has its size and lifetime: you choose according to the need.' },
    },
    {
      id: 'web-q10', skill: 'web.storage', lesson: 'web-3', level: 2, type: 'mcq',
      prompt: { fr: 'Que contient <code>localStorage.getItem(\'a\')</code> après <code>localStorage.setItem(\'a\', 2.5)</code> ?', en: 'What does <code>localStorage.getItem(\'a\')</code> hold after <code>localStorage.setItem(\'a\', 2.5)</code>?' },
      choices: { fr: ['Le texte "2.5"', 'Le nombre 2.5', 'null', 'undefined'], en: ['The text "2.5"', 'The number 2.5', 'null', 'undefined'] },
      answer: 0,
      explain: { fr: 'localStorage ne stocke que des textes. Il faut <code>parseFloat</code> (ou <code>JSON.parse</code>) pour retrouver un nombre.', en: 'localStorage only stores text. You need <code>parseFloat</code> (or <code>JSON.parse</code>) to get a number back.' },
    },
    {
      id: 'web-q11', skill: 'web.storage', lesson: 'web-3', level: 2, type: 'tf',
      prompt: { fr: 'Les réglages enregistrés dans localStorage par 3D Reader sont envoyés automatiquement sur GitHub.', en: 'The settings saved in localStorage by 3D Reader are automatically sent to GitHub.' },
      answer: false,
      explain: { fr: 'Ils restent dans le navigateur, sur ta machine. GitHub Pages ne fait que servir des fichiers ; il ne reçoit rien.', en: 'They stay in the browser, on your machine. GitHub Pages only serves files; it receives nothing.' },
    },
    {
      id: 'web-q12', skill: 'web.storage', lesson: 'web-3', level: 2, type: 'fill',
      prompt: { fr: 'Complète pour ranger un objet dans localStorage.', en: 'Fill in to store an object in localStorage.' },
      code: "localStorage.setItem('reglages', JSON.____(reglages));", lang: 'js',
      accept: ['stringify'],
      explain: { fr: '<code>JSON.stringify</code> transforme l’objet en texte ; <code>JSON.parse</code> fait l’inverse à la lecture.', en: '<code>JSON.stringify</code> turns the object into text; <code>JSON.parse</code> does the reverse when reading.' },
    },
    // ---------------------------------------------------------------- web-4 quiz
    {
      id: 'web-q13', skill: 'web.workers', lesson: 'web-4', level: 1, type: 'mcq',
      prompt: { fr: 'Pourquoi 3D Reader lit-il les fichiers STEP dans un Web Worker ?', en: 'Why does 3D Reader read STEP files in a Web Worker?' },
      choices: {
        fr: ['Pour que l’interface ne gèle pas pendant le calcul', 'Parce que le worker a accès à plus de couleurs', 'Pour envoyer le fichier à un serveur', 'Parce que les workers sont plus précis'],
        en: ['So the interface does not freeze during the computation', 'Because the worker has access to more colours', 'To send the file to a server', 'Because workers are more accurate'],
      },
      answer: 0,
      explain: { fr: 'Le fil principal dessine l’écran ; un long calcul dessus bloquerait tout. Le worker calcule en parallèle.', en: 'The main thread draws the screen; a long computation on it would block everything. The worker computes in parallel.' },
    },
    {
      id: 'web-q14', skill: 'web.workers', lesson: 'web-4', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre le dialogue d’une analyse.', en: 'Put the analysis dialogue in order.' },
      items: {
        fr: ['La page range la promesse dans pending (id 7)', 'postMessage({ type: \'analyze\', id: 7 })', 'Le worker envoie des messages progress', 'Le worker envoie { type: \'result\', id: 7 }', 'Le client appelle resolve(result)'],
        en: ['The page stores the promise in pending (id 7)', 'postMessage({ type: \'analyze\', id: 7 })', 'The worker sends progress messages', 'The worker sends { type: \'result\', id: 7 }', 'The client calls resolve(result)'],
      },
      explain: { fr: 'Le numéro <code>id</code> relie la réponse à la demande ; la promesse n’est tenue qu’au message <code>result</code>.', en: 'The <code>id</code> number links the answer to the request; the promise is only resolved on the <code>result</code> message.' },
    },
    {
      id: 'web-q15', skill: 'web.workers', lesson: 'web-4', level: 2, type: 'tf',
      prompt: { fr: 'Un Web Worker peut modifier directement le DOM (par exemple <code>document.querySelector</code>).', en: 'A Web Worker can change the DOM directly (for example <code>document.querySelector</code>).' },
      answer: false,
      explain: { fr: 'Le worker n’a pas de <code>document</code>. Il envoie un message ; c’est la page qui met à jour l’affichage.', en: 'The worker has no <code>document</code>. It sends a message; the page updates the display.' },
    },
    {
      id: 'web-q16', skill: 'web.workers', lesson: 'web-4', level: 3, type: 'mcq',
      prompt: { fr: 'Que se passe-t-il quand un <code>ArrayBuffer</code> est passé dans la liste des transférables de <code>postMessage</code> ?', en: 'What happens when an <code>ArrayBuffer</code> is given in the transferables list of <code>postMessage</code>?' },
      choices: {
        fr: ['Sa mémoire change de propriétaire sans copie ; l’envoyeur ne peut plus l’utiliser', 'Il est copié deux fois pour plus de sûreté', 'Il est compressé en gzip', 'Il est enregistré dans IndexedDB'],
        en: ['Its memory changes owner without copying; the sender can no longer use it', 'It is copied twice for safety', 'It is gzip-compressed', 'It is saved in IndexedDB'],
      },
      answer: 0,
      explain: { fr: 'Transférer évite de recopier des centaines de Mo de maillage : c’est instantané, mais le buffer d’origine devient vide.', en: 'Transferring avoids copying hundreds of MB of mesh: it is instant, but the original buffer becomes empty.' },
    },
    // ---------------------------------------------------------------- web-5 quiz
    {
      id: 'web-q17', skill: 'web.wasm', lesson: 'web-5', level: 1, type: 'mcq',
      prompt: { fr: 'Qu’est-ce que <code>opencascade.full.wasm</code> ?', en: 'What is <code>opencascade.full.wasm</code>?' },
      choices: {
        fr: ['Le code C++ d’OpenCascade compilé en WebAssembly', 'Un fichier STEP d’exemple', 'Une feuille de style', 'Une base de données'],
        en: ['OpenCascade’s C++ code compiled to WebAssembly', 'A sample STEP file', 'A style sheet', 'A database'],
      },
      answer: 0,
      explain: { fr: 'Emscripten a compilé le C++ en binaire wasm ; la « colle » <code>opencascade.full.js</code> l’expose à JavaScript.', en: 'Emscripten compiled the C++ to a wasm binary; the <code>opencascade.full.js</code> "glue" exposes it to JavaScript.' },
    },
    {
      id: 'web-q18', skill: 'web.wasm', lesson: 'web-5', level: 2, type: 'tf',
      prompt: { fr: 'Le tas (heap) WebAssembly d’OpenCascade rétrécit tout seul après l’analyse d’un gros fichier.', en: 'OpenCascade’s WebAssembly heap shrinks by itself after analysing a big file.' },
      answer: false,
      explain: { fr: 'Le tas ne fait que grandir. Pour rendre la mémoire, <code>releaseMemory()</code> redémarre le worker.', en: 'The heap only grows. To give memory back, <code>releaseMemory()</code> restarts the worker.' },
    },
    {
      id: 'web-q19', skill: 'web.wasm', lesson: 'web-5', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre la mise à disposition d’OpenCascade dans le navigateur.', en: 'Put in order how OpenCascade becomes available in the browser.' },
      items: {
        fr: ['Écrire le code en C++', 'Compiler avec Emscripten en .wasm + colle .js', 'Compresser le .wasm en .gz (build)', 'Télécharger et décompresser avec DecompressionStream', 'Instancier le module et appeler oc.… depuis JS'],
        en: ['Write the code in C++', 'Compile with Emscripten to .wasm + .js glue', 'Compress the .wasm to .gz (build)', 'Download and decompress with DecompressionStream', 'Instantiate the module and call oc.… from JS'],
      },
      explain: { fr: 'De la source C++ à l’appel JavaScript, en passant par la compilation, la compression et le chargement.', en: 'From the C++ source to the JavaScript call, through compiling, compression and loading.' },
    },
    {
      id: 'web-q20', skill: 'web.wasm', lesson: 'web-5', level: 2, type: 'fill',
      prompt: { fr: 'Quelle méthode faut-il appeler pour libérer un objet C++ créé depuis JS (<code>new oc.TDF_LabelSequence_1()</code>) ?', en: 'Which method must be called to free a C++ object created from JS (<code>new oc.TDF_LabelSequence_1()</code>)?' },
      code: 'seq.____();', lang: 'js',
      accept: ['delete'],
      explain: { fr: 'Le ramasse-miettes JS ne voit pas le tas wasm : sans <code>.delete()</code>, l’objet reste en mémoire (fuite).', en: 'The JS garbage collector does not see the wasm heap: without <code>.delete()</code>, the object stays in memory (leak).' },
    },
    // ---------------------------------------------------------------- web-6 quiz
    {
      id: 'web-q21', skill: 'web.three', lesson: 'web-6', level: 1, type: 'multi',
      prompt: { fr: 'Quels ingrédients faut-il pour afficher une pièce avec three.js ? (plusieurs réponses)', en: 'Which ingredients are needed to show a part with three.js? (several answers)' },
      choices: {
        fr: ['Une scène', 'Une caméra', 'Un renderer', 'Une base IndexedDB', 'De la lumière (avec un matériau standard)'],
        en: ['A scene', 'A camera', 'A renderer', 'An IndexedDB database', 'Light (with a standard material)'],
      },
      answer: [0, 1, 2, 4],
      explain: { fr: 'Scène + caméra + renderer, et des lumières pour que <code>MeshStandardMaterial</code> ne soit pas noir. IndexedDB n’a rien à voir avec l’affichage.', en: 'Scene + camera + renderer, and lights so that <code>MeshStandardMaterial</code> is not black. IndexedDB has nothing to do with display.' },
    },
    {
      id: 'web-q22', skill: 'web.three', lesson: 'web-6', level: 2, type: 'mcq',
      prompt: { fr: 'Un maillage a <code>indices.length === 300</code>. Combien de triangles ?', en: 'A mesh has <code>indices.length === 300</code>. How many triangles?' },
      choices: { fr: ['100', '300', '900', '150'], en: ['100', '300', '900', '150'] },
      answer: 0,
      explain: { fr: 'Chaque triangle cite 3 sommets : 300 / 3 = 100 triangles.', en: 'Each triangle names 3 vertices: 300 / 3 = 100 triangles.' },
    },
    {
      id: 'web-q23', skill: 'web.three', lesson: 'web-6', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi les vues Face / Dessus / Droite sont-elles orthographiques ?', en: 'Why are the Front / Top / Right views orthographic?' },
      choices: {
        fr: ['Pour voir la pièce comme sur un plan, sans déformation de perspective', 'Parce que c’est plus rapide à calculer', 'Pour avoir plus de couleurs', 'Parce que three.js n’a pas de perspective'],
        en: ['To see the part as on a drawing, without perspective distortion', 'Because it is faster to compute', 'To get more colours', 'Because three.js has no perspective'],
      },
      answer: 0,
      explain: { fr: 'En orthographique, les arêtes parallèles restent parallèles et une face vue de profil est une ligne, comme dans SolidWorks.', en: 'In orthographic, parallel edges stay parallel and a face seen edge-on is a line, as in SolidWorks.' },
    },
    {
      id: 'web-q24', skill: 'web.three', lesson: 'web-6', level: 3, type: 'line',
      prompt: { fr: 'Quelle ligne calcule ce qu’il faut pour un bon éclairage des faces ?', en: 'Which line computes what is needed for proper face lighting?' },
      code: 'const geom = new THREE.BufferGeometry();\ngeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));\ngeom.setIndex(new THREE.BufferAttribute(indices, 1));\ngeom.computeVertexNormals();\nconst mesh = new THREE.Mesh(geom, mat);',
      lang: 'js', answer: 3,
      explain: { fr: 'Les normales disent dans quelle direction regarde la surface en chaque point ; la lumière en dépend.', en: 'Normals say which way the surface faces at each point; lighting depends on them.' },
    },
    // ---------------------------------------------------------------- web-7 quiz
    {
      id: 'web-q25', skill: 'web.devtools', lesson: 'web-7', level: 1, type: 'match',
      prompt: { fr: 'Associe l’onglet des DevTools (F12) à son usage.', en: 'Match the DevTools tab (F12) with its use.' },
      pairs: {
        fr: [['Console', 'lire les erreurs rouges et les console.log'], ['Network / Réseau', 'voir les fichiers téléchargés et les codes HTTP'], ['Application', 'inspecter localStorage et IndexedDB'], ['Elements', 'voir et modifier le DOM en direct']],
        en: [['Console', 'read red errors and console.logs'], ['Network', 'see downloaded files and HTTP codes'], ['Application', 'inspect localStorage and IndexedDB'], ['Elements', 'see and change the live DOM']],
      },
      explain: { fr: 'Ce sont les quatre onglets les plus utiles pour comprendre ce que fait une page.', en: 'These are the four most useful tabs to understand what a page does.' },
    },
    {
      id: 'web-q26', skill: 'web.devtools', lesson: 'web-7', level: 2, type: 'mcq',
      prompt: { fr: 'Que fait l’import map de <code>index.html</code> ?', en: 'What does the import map in <code>index.html</code> do?' },
      choices: {
        fr: ['Elle dit au navigateur quel fichier correspond au nom « three »', 'Elle télécharge les cartes géographiques', 'Elle fusionne tous les fichiers JS en un seul', 'Elle traduit l’interface'],
        en: ['It tells the browser which file the name "three" stands for', 'It downloads geographic maps', 'It merges all JS files into one', 'It translates the interface'],
      },
      answer: 0,
      explain: { fr: 'Un spécificateur nu comme <code>"three"</code> n’est pas un chemin : l’import map fait la correspondance avec <code>./vendor/three/three.module.js</code>.', en: 'A bare specifier like <code>"three"</code> is not a path: the import map maps it to <code>./vendor/three/three.module.js</code>.' },
    },
    {
      id: 'web-q27', skill: 'web.devtools', lesson: 'web-7', level: 2, type: 'tf',
      prompt: { fr: 'Le dossier <code>dist/</code> produit par <code>npm run build</code> contient un programme serveur que GitHub Pages exécute.', en: 'The <code>dist/</code> folder produced by <code>npm run build</code> contains a server program that GitHub Pages runs.' },
      answer: false,
      explain: { fr: 'C’est un site statique : GitHub Pages distribue les fichiers, tout le calcul se fait dans le navigateur du visiteur.', en: 'It is a static site: GitHub Pages hands out the files, all computing happens in the visitor’s browser.' },
    },
    // ---------------------------------------------------------------- extras: web.layers
    {
      id: 'web-q28', skill: 'web.layers', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Combien de classes porte <code>&lt;button class="tab active"&gt;</code> ?', en: 'How many classes does <code>&lt;button class="tab active"&gt;</code> carry?' },
      choices: { fr: ['2', '1', '0', '3'], en: ['2', '1', '0', '3'] },
      answer: 0,
      explain: { fr: 'L’espace sépare les classes : « tab » et « active ».', en: 'The space separates classes: "tab" and "active".' },
    },
    {
      id: 'web-q29', skill: 'web.layers', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Quelle ligne cible l’élément d’identifiant <code>viewport</code> ?', en: 'Which line targets the element whose id is <code>viewport</code>?' },
      code: '.viewport { background: var(--bg); }\nviewport { background: var(--bg); }\n#viewport { background: var(--viewport); }\n[viewport] { background: none; }',
      lang: 'css', answer: 2,
      explain: { fr: '<code>#</code> = id. <code>.viewport</code> serait une classe, <code>viewport</code> une balise, <code>[viewport]</code> un attribut.', en: '<code>#</code> = id. <code>.viewport</code> would be a class, <code>viewport</code> a tag, <code>[viewport]</code> an attribute.' },
    },
    {
      id: 'web-q30', skill: 'web.layers', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Dans 3D Reader, comment le thème sombre change-t-il les couleurs ?', en: 'In 3D Reader, how does the dark theme change the colours?' },
      choices: {
        fr: ['Il redéfinit les variables CSS de <code>:root</code> dans <code>@media (prefers-color-scheme: dark)</code>', 'Il charge une deuxième page HTML', 'Le JavaScript repeint chaque élément un par un', 'Il inverse l’écran'],
        en: ['It redefines the <code>:root</code> CSS variables inside <code>@media (prefers-color-scheme: dark)</code>', 'It loads a second HTML page', 'JavaScript repaints every element one by one', 'It inverts the screen'],
      },
      answer: 0,
      explain: { fr: 'Toutes les règles utilisent <code>var(--…)</code> : il suffit de changer les valeurs des variables.', en: 'Every rule uses <code>var(--…)</code>: changing the variable values is enough.' },
    },
    {
      id: 'web-q31', skill: 'web.layers', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Quel attribut HTML (sans valeur) 3D Reader met-il sur un élément pour que <code>i18n.js</code> en remplace le texte ? Tape son nom.', en: 'Which HTML attribute (no value) does 3D Reader put on an element so <code>i18n.js</code> replaces its text? Type its name.' },
      accept: ['data-i18n'],
      explain: { fr: '<code>data-i18n</code> (texte), <code>data-i18n-title</code> (infobulle), <code>data-i18n-html</code> (HTML).', en: '<code>data-i18n</code> (text), <code>data-i18n-title</code> (tooltip), <code>data-i18n-html</code> (HTML).' },
    },
    // ---------------------------------------------------------------- extras: web.dom
    {
      id: 'web-q32', skill: 'web.dom', extra: true, level: 1, type: 'tf',
      prompt: { fr: '<code>bouton.addEventListener(\'click\', ouvrir())</code> appelle <code>ouvrir</code> à chaque clic.', en: '<code>button.addEventListener(\'click\', open())</code> calls <code>open</code> on every click.' },
      answer: false,
      explain: { fr: 'Les parenthèses exécutent <code>ouvrir</code> tout de suite, une fois. Il faut passer la fonction elle-même : <code>ouvrir</code>.', en: 'The parentheses run <code>open</code> right away, once. Pass the function itself: <code>open</code>.' },
    },
    {
      id: 'web-q33', skill: 'web.dom', extra: true, level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre pour ajouter une ligne à une liste.', en: 'Put in order to add a row to a list.' },
      items: {
        fr: ["const li = document.createElement('li');", "li.textContent = 'Corps 1';", "li.classList.add('body-row');", 'liste.appendChild(li);'],
        en: ["const li = document.createElement('li');", "li.textContent = 'Body 1';", "li.classList.add('body-row');", 'list.appendChild(li);'],
      },
      explain: { fr: 'On crée, on remplit, on décore, puis on accroche dans la page : c’est seulement là qu’il devient visible.', en: 'Create, fill, decorate, then attach to the page: only then does it become visible.' },
    },
    {
      id: 'web-q34', skill: 'web.dom', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Qu’affiche <code>el.textContent = "&lt;b&gt;Carter&lt;/b&gt;"</code> ?', en: 'What does <code>el.textContent = "&lt;b&gt;Housing&lt;/b&gt;"</code> show?' },
      choices: {
        fr: ['Littéralement « &lt;b&gt;Carter&lt;/b&gt; »', '« Carter » en gras', 'Rien', 'Une erreur'],
        en: ['Literally "&lt;b&gt;Housing&lt;/b&gt;"', '"Housing" in bold', 'Nothing', 'An error'],
      },
      answer: 0,
      explain: { fr: '<code>textContent</code> n’interprète pas le HTML : c’est ce qui le rend sûr pour des données extérieures.', en: '<code>textContent</code> does not interpret HTML: that is what makes it safe for outside data.' },
    },
    {
      id: 'web-q35', skill: 'web.dom', extra: true, level: 3, type: 'multi',
      prompt: { fr: 'Quels textes peut-on afficher sans risque avec <code>innerHTML</code> ? (plusieurs réponses)', en: 'Which texts can safely be shown with <code>innerHTML</code>? (several answers)' },
      choices: {
        fr: ['Nos propres traductions (data-i18n-html)', 'Le nom d’une pièce lu dans un STEP', 'Un message tapé par l’utilisateur', 'Un texte fixe écrit dans app.js'],
        en: ['Our own translations (data-i18n-html)', 'A part name read from a STEP', 'A message typed by the user', 'A fixed text written in app.js'],
      },
      answer: [0, 3],
      explain: { fr: 'Seuls les textes écrits par les développeurs sont sûrs. Tout ce qui vient d’un fichier ou d’un utilisateur → <code>textContent</code>.', en: 'Only texts written by the developers are safe. Anything from a file or a user → <code>textContent</code>.' },
    },
    // ---------------------------------------------------------------- extras: web.storage
    {
      id: 'web-q36', skill: 'web.storage', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Tu ouvres 3D Reader dans Edge alors que tu l’utilisais dans Chrome. Tes réglages…', en: 'You open 3D Reader in Edge while you used it in Chrome. Your settings…' },
      choices: {
        fr: ['ne sont pas là : chaque navigateur a son propre stockage', 'sont là, synchronisés par GitHub', 'sont là, car le site les garde', 'sont effacés de Chrome'],
        en: ['are not there: each browser has its own storage', 'are there, synced by GitHub', 'are there, because the site keeps them', 'are erased from Chrome'],
      },
      answer: 0,
      explain: { fr: 'localStorage et IndexedDB sont propres à un navigateur et à une adresse de site.', en: 'localStorage and IndexedDB belong to one browser and one site address.' },
    },
    {
      id: 'web-q37', skill: 'web.storage', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Quelle ligne perd l’information ?', en: 'Which line loses the information?' },
      code: "const r = { densite: 2.7 };\nlocalStorage.setItem('ok', JSON.stringify(r));\nlocalStorage.setItem('ko', r);\nconst back = JSON.parse(localStorage.getItem('ok'));",
      lang: 'js', answer: 2,
      explain: { fr: 'Ranger un objet sans <code>JSON.stringify</code> stocke le texte « [object Object] ».', en: 'Storing an object without <code>JSON.stringify</code> stores the text "[object Object]".' },
    },
    {
      id: 'web-q38', skill: 'web.storage', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que fait le service worker <code>coi-sw.js</code> de 3D Reader ?', en: 'What does 3D Reader’s service worker <code>coi-sw.js</code> do?' },
      choices: {
        fr: ['Il ajoute deux en-têtes aux réponses du site pour permettre le calcul multi-cœurs', 'Il met tout le site en cache hors ligne', 'Il envoie les fichiers STEP au serveur', 'Il stocke les mots de passe'],
        en: ['It adds two headers to the site’s responses to allow multi-core computing', 'It caches the whole site offline', 'It sends STEP files to the server', 'It stores passwords'],
      },
      answer: 0,
      explain: { fr: 'GitHub Pages ne sait pas envoyer COOP/COEP ; le service worker les ajoute, ce qui autorise <code>SharedArrayBuffer</code>. Son commentaire précise qu’il ne met rien en cache.', en: 'GitHub Pages cannot send COOP/COEP; the service worker adds them, which enables <code>SharedArrayBuffer</code>. Its comment says it caches nothing.' },
    },
    {
      id: 'web-q39', skill: 'web.storage', extra: true, level: 3, type: 'tf',
      prompt: { fr: 'L’API IndexedDB est asynchrone : on attend un événement <code>onsuccess</code> pour obtenir le résultat.', en: 'The IndexedDB API is asynchronous: you wait for an <code>onsuccess</code> event to get the result.' },
      answer: true,
      explain: { fr: '<code>ai-history.js</code> enveloppe ces requêtes dans des promesses : <code>req.onsuccess = () =&gt; resolve(req.result)</code>.', en: '<code>ai-history.js</code> wraps these requests in promises: <code>req.onsuccess = () =&gt; resolve(req.result)</code>.' },
    },
    // ---------------------------------------------------------------- extras: web.workers
    {
      id: 'web-q40', skill: 'web.workers', extra: true, level: 1, type: 'fill',
      prompt: { fr: 'Quelle fonction le worker appelle-t-il pour envoyer un message à la page ?', en: 'Which function does the worker call to send a message to the page?' },
      code: "____({ type: 'result', id: msg.id, result });", lang: 'js',
      accept: ['postMessage'],
      explain: { fr: '<code>postMessage</code> envoie ; <code>onmessage</code> reçoit. Dans les deux sens.', en: '<code>postMessage</code> sends; <code>onmessage</code> receives. Both ways.' },
    },
    {
      id: 'web-q41', skill: 'web.workers', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert la <code>Map</code> <code>pending</code> dans <code>client.js</code> ?', en: 'What is the <code>pending</code> <code>Map</code> in <code>client.js</code> for?' },
      choices: {
        fr: ['Retrouver la promesse de chaque demande grâce à son id quand la réponse arrive', 'Stocker les fichiers téléchargés', 'Compter les clics', 'Garder les traductions'],
        en: ['Find each request’s promise by its id when the answer arrives', 'Store downloaded files', 'Count clicks', 'Keep translations'],
      },
      answer: 0,
      explain: { fr: 'Plusieurs demandes peuvent être en cours : l’id fait le lien entre question et réponse.', en: 'Several requests can be in flight: the id links question and answer.' },
    },
    {
      id: 'web-q42', skill: 'web.workers', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Le worker répond <code>{ type: \'error\', fatal: true }</code>. Que fait le client ?', en: 'The worker answers <code>{ type: \'error\', fatal: true }</code>. What does the client do?' },
      choices: {
        fr: ['Il rejette les tâches en attente et redémarre un worker neuf', 'Il recharge toute la page', 'Il ignore l’erreur', 'Il envoie l’erreur à GitHub'],
        en: ['It rejects the waiting jobs and restarts a fresh worker', 'It reloads the whole page', 'It ignores the error', 'It sends the error to GitHub'],
      },
      answer: 0,
      explain: { fr: 'Un crash WebAssembly peut laisser le module inutilisable : on repart d’un worker propre (<code>resetWorker()</code>).', en: 'A WebAssembly crash can leave the module unusable: start again from a clean worker (<code>resetWorker()</code>).' },
    },
    // ---------------------------------------------------------------- extras: web.wasm
    {
      id: 'web-q43', skill: 'web.wasm', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Ouvrir un fichier STL nécessite de télécharger OpenCascade (wasm).', en: 'Opening an STL file requires downloading OpenCascade (wasm).' },
      answer: false,
      explain: { fr: 'Les maillages (STL, OBJ…) sont lus en JavaScript pur. OpenCascade ne sert qu’aux fichiers CAO (STEP, IGES, BREP).', en: 'Meshes (STL, OBJ…) are read in plain JavaScript. OpenCascade is only for CAD files (STEP, IGES, BREP).' },
    },
    {
      id: 'web-q44', skill: 'web.wasm', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi 3D Reader calcule-t-il en WebAssembly plutôt qu’avec son serveur Python sur GitHub Pages ?', en: 'Why does 3D Reader compute in WebAssembly rather than with its Python server on GitHub Pages?' },
      choices: {
        fr: ['GitHub Pages ne peut pas exécuter de Python : il ne sert que des fichiers', 'Python est interdit dans les navigateurs depuis 2020', 'Le wasm donne un volume différent', 'Pour que le fichier soit envoyé à GitHub'],
        en: ['GitHub Pages cannot run Python: it only serves files', 'Python has been banned from browsers since 2020', 'Wasm gives a different volume', 'So the file is sent to GitHub'],
      },
      answer: 0,
      explain: { fr: 'Site statique = pas de serveur de calcul. Bonus : la pièce ne quitte pas la machine.', en: 'Static site = no compute server. Bonus: the part never leaves the machine.' },
    },
    {
      id: 'web-q45', skill: 'web.wasm', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Quelle ligne décompresse le fichier gzip téléchargé ?', en: 'Which line decompresses the downloaded gzip file?' },
      code: "const response = await fetch(url);\nconst stream = response.body;\nconst bytes = new Uint8Array(await new Response(stream.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());\nconst oc = await factory({ wasmBinary: bytes });",
      lang: 'js', answer: 2,
      explain: { fr: '<code>pipeThrough(new DecompressionStream(\'gzip\'))</code> décompresse pendant le téléchargement.', en: '<code>pipeThrough(new DecompressionStream(\'gzip\'))</code> decompresses while downloading.' },
    },
    // ---------------------------------------------------------------- extras: web.three
    {
      id: 'web-q46', skill: 'web.three', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Un tableau <code>positions</code> contient 12 nombres. Combien de sommets ?', en: 'A <code>positions</code> array holds 12 numbers. How many vertices?' },
      choices: { fr: ['4', '12', '3', '36'], en: ['4', '12', '3', '36'] },
      answer: 0,
      explain: { fr: 'x, y, z par sommet : 12 / 3 = 4 sommets.', en: 'x, y, z per vertex: 12 / 3 = 4 vertices.' },
    },
    {
      id: 'web-q47', skill: 'web.three', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Passer la qualité d’affichage de « normale » à « fine » change le volume exact calculé pour un STEP.', en: 'Switching display quality from "normal" to "fine" changes the exact volume computed for a STEP.' },
      answer: false,
      explain: { fr: 'Le volume exact vient du B-rep (OpenCascade). Seule la tessellation d’affichage change.', en: 'The exact volume comes from the B-rep (OpenCascade). Only the display tessellation changes.' },
    },
    {
      id: 'web-q48', skill: 'web.three', extra: true, level: 2, type: 'match',
      prompt: { fr: 'Associe chaque élément three.js à son équivalent dans un studio photo.', en: 'Match each three.js element with its photo-studio equivalent.' },
      pairs: {
        fr: [['Scene', 'la table où l’on pose la pièce'], ['Camera', 'l’appareil photo et son objectif'], ['Light', 'les projecteurs'], ['Renderer', 'le photographe qui déclenche 60 fois/s']],
        en: [['Scene', 'the table the part sits on'], ['Camera', 'the camera and its lens'], ['Light', 'the spotlights'], ['Renderer', 'the photographer shooting 60 times/s']],
      },
      explain: { fr: 'Sans l’un d’eux, pas d’image (ou une image noire).', en: 'Without any one of them, no picture (or a black one).' },
    },
    // ---------------------------------------------------------------- extras: web.devtools
    {
      id: 'web-q49', skill: 'web.devtools', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Un bouton ne fait rien. Premier réflexe ?', en: 'A button does nothing. First reflex?' },
      choices: {
        fr: ['F12 → Console : lire le message d’erreur rouge', 'Réinstaller Windows', 'Effacer le dépôt GitHub', 'Changer de navigateur sans regarder'],
        en: ['F12 → Console: read the red error message', 'Reinstall Windows', 'Delete the GitHub repository', 'Switch browser without looking'],
      },
      answer: 0,
      explain: { fr: 'Le message et le « fichier:ligne » indiquent où chercher — c’est l’info à donner à Claude Code.', en: 'The message and the "file:line" point where to look — that is the info to give Claude Code.' },
    },
    {
      id: 'web-q50', skill: 'web.devtools', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Les import maps s’appliquent aussi à l’intérieur des Web Workers.', en: 'Import maps also apply inside Web Workers.' },
      answer: false,
      explain: { fr: 'C’est pourquoi <code>worker.js</code> n’importe pas <code>"three"</code>, et que les enveloppes sont calculées dans <code>client.js</code>.', en: 'That is why <code>worker.js</code> does not import <code>"three"</code>, and envelopes are computed in <code>client.js</code>.' },
    },
    {
      id: 'web-q51', skill: 'web.devtools', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Quelle ligne importe un fichier du projet (et non une bibliothèque via l’import map) ?', en: 'Which line imports a project file (not a library through the import map)?' },
      code: 'import * as THREE from "three";\nimport { TrackballControls } from "three/addons/controls/TrackballControls.js";\nimport { t, setLanguage } from "./i18n.js";',
      lang: 'js', answer: 2,
      explain: { fr: 'Un chemin qui commence par <code>./</code> désigne un fichier voisin. Les deux autres passent par l’import map.', en: 'A path starting with <code>./</code> names a neighbouring file. The other two go through the import map.' },
    },
    // ---------------------------------------------------------------- exam questions
    {
      id: 'web-q52', skill: 'web.layers', level: 2, type: 'mcq',
      prompt: { fr: 'Quel fichier de 3D Reader contient les couleurs et la mise en page ?', en: 'Which 3D Reader file holds the colours and layout?' },
      choices: { fr: ['web/style.css', 'web/index.html', 'web/engine/worker.js', 'package.json'], en: ['web/style.css', 'web/index.html', 'web/engine/worker.js', 'package.json'] },
      answer: 0,
      explain: { fr: 'Le CSS est la couche de style.', en: 'CSS is the style layer.' },
    },
    {
      id: 'web-q53', skill: 'web.dom', level: 2, type: 'mcq',
      prompt: { fr: 'Qu’est-ce que le DOM ?', en: 'What is the DOM?' },
      choices: {
        fr: ['L’arbre d’objets que le navigateur construit à partir du HTML, modifiable en JS', 'Un serveur de fichiers', 'Le format des fichiers STEP', 'Le nom du dossier dist/'],
        en: ['The tree of objects the browser builds from the HTML, changeable from JS', 'A file server', 'The STEP file format', 'The name of the dist/ folder'],
      },
      answer: 0,
      explain: { fr: 'Modifier le DOM change l’affichage immédiatement.', en: 'Changing the DOM changes the display immediately.' },
    },
    {
      id: 'web-q54', skill: 'web.storage', level: 2, type: 'multi',
      prompt: { fr: 'Lesquels restent après la fermeture du navigateur ? (plusieurs réponses)', en: 'Which remain after closing the browser? (several answers)' },
      choices: { fr: ['localStorage', 'sessionStorage', 'IndexedDB', 'Une variable JavaScript'], en: ['localStorage', 'sessionStorage', 'IndexedDB', 'A JavaScript variable'] },
      answer: [0, 2],
      explain: { fr: 'sessionStorage dure le temps de l’onglet ; une variable disparaît au rechargement.', en: 'sessionStorage lasts as long as the tab; a variable disappears on reload.' },
    },
    {
      id: 'web-q55', skill: 'web.workers', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque worker de 3D Reader à son travail.', en: 'Match each 3D Reader worker with its job.' },
      pairs: {
        fr: [['worker.js', 'analyse des fichiers (OpenCascade, maillages)'], ['thickworker.js', 'épaisseurs de paroi'], ['partworker.js', 'plan de joint'], ['slideworker.js', 'tiroirs']],
        en: [['worker.js', 'file analysis (OpenCascade, meshes)'], ['thickworker.js', 'wall thickness'], ['partworker.js', 'parting line'], ['slideworker.js', 'slides']],
      },
      explain: { fr: 'Chaque calcul lourd a son travailleur, pour garder l’interface fluide.', en: 'Each heavy computation has its own worker, to keep the interface smooth.' },
    },
    {
      id: 'web-q56', skill: 'web.workers', level: 3, type: 'line',
      prompt: { fr: 'Quelle ligne crée le travailleur ?', en: 'Which line creates the worker?' },
      code: "let worker = null;\nconst pending = new Map();\nworker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });\nworker.onmessage = ({ data }) => { /* … */ };",
      lang: 'js', answer: 2,
      explain: { fr: '<code>new Worker(url, { type: \'module\' })</code> démarre un nouveau fil qui exécute <code>worker.js</code>.', en: '<code>new Worker(url, { type: \'module\' })</code> starts a new thread running <code>worker.js</code>.' },
    },
    {
      id: 'web-q57', skill: 'web.wasm', level: 2, type: 'mcq',
      prompt: { fr: 'Quel outil compile le C++ d’OpenCascade en WebAssembly ?', en: 'Which tool compiles OpenCascade’s C++ to WebAssembly?' },
      choices: { fr: ['Emscripten', 'three.js', 'Playwright', 'npm'], en: ['Emscripten', 'three.js', 'Playwright', 'npm'] },
      answer: 0,
      explain: { fr: 'Emscripten produit le .wasm et sa colle .js (paquet npm <code>opencascade.js</code>).', en: 'Emscripten produces the .wasm and its .js glue (npm package <code>opencascade.js</code>).' },
    },
    {
      id: 'web-q58', skill: 'web.wasm', level: 3, type: 'mcq',
      prompt: { fr: 'Que fait <code>releaseMemory()</code> dans <code>client.js</code> ?', en: 'What does <code>releaseMemory()</code> in <code>client.js</code> do?' },
      choices: {
        fr: ['Redémarre le worker (si rien n’est en cours) pour rendre la mémoire wasm au système', 'Vide localStorage', 'Supprime le fichier ouvert du disque', 'Réduit la qualité d’affichage'],
        en: ['Restarts the worker (when nothing is running) to give the wasm memory back to the system', 'Empties localStorage', 'Deletes the opened file from disk', 'Lowers the display quality'],
      },
      answer: 0,
      explain: { fr: 'Le tas wasm ne rétrécit jamais : seul un worker neuf repart avec peu de mémoire.', en: 'The wasm heap never shrinks: only a fresh worker starts with little memory.' },
    },
    {
      id: 'web-q59', skill: 'web.three', level: 2, type: 'fill',
      prompt: { fr: 'Complète : les indices de triangles sont stockés dans un tableau typé d’entiers non signés 32 bits.', en: 'Fill in: triangle indices are stored in a typed array of unsigned 32-bit integers.' },
      code: 'const indices = new ____([0, 1, 2, 0, 2, 3]);', lang: 'js',
      accept: ['Uint32Array'],
      explain: { fr: '<code>Uint32Array</code> pour les indices, <code>Float32Array</code> pour les positions.', en: '<code>Uint32Array</code> for indices, <code>Float32Array</code> for positions.' },
    },
    {
      id: 'web-q60', skill: 'web.devtools', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre le chemin du code jusqu’au visiteur.', en: 'Put in order the path of the code to the visitor.' },
      items: {
        fr: ['Écrire les modules dans web/', 'npm run build copie vendor/ et web/ dans dist/', 'GitHub Pages publie dist/', 'Le navigateur du visiteur télécharge et exécute les modules'],
        en: ['Write the modules in web/', 'npm run build copies vendor/ and web/ into dist/', 'GitHub Pages publishes dist/', 'The visitor’s browser downloads and runs the modules'],
      },
      explain: { fr: 'Pas de bundler, pas de serveur de calcul : un build qui copie, un hébergeur qui distribue, un navigateur qui calcule.', en: 'No bundler, no compute server: a build that copies, a host that hands out, a browser that computes.' },
    },
  ],
};
