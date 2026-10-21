// Module 1 — Bienvenue : la carte de 3D Reader.
export default {
  id: 'start',
  order: 1,
  icon: '🧭',
  color: '#2f80ed',
  title: { fr: 'Bienvenue : la carte de 3D Reader', en: 'Welcome: the map of 3D Reader' },
  summary: {
    fr: 'Comprendre ce qu’est un programme, une appli web, et qui fait quoi dans 3D Reader, avant de plonger dans le code.',
    en: 'Understand what a program and a web app are, and who does what in 3D Reader, before diving into the code.',
  },
  skills: {
    'start.app': { fr: 'Programme, appli web, front et back', en: 'Program, web app, front end and back end' },
    'start.map': { fr: 'La carte de 3D Reader', en: 'The map of 3D Reader' },
    'start.reading': { fr: 'Méthode pour lire du code', en: 'A method to read code' },
    'start.vocab': { fr: 'Vocabulaire de base', en: 'Basic vocabulary' },
  },
  widgets: {
    'start-flow-open': {
      type: 'flow',
      actors: [
        { fr: 'Utilisateur', en: 'User' },
        { fr: 'Page (app.js)', en: 'Page (app.js)' },
        { fr: 'client.js', en: 'client.js' },
        { fr: 'Worker (worker.js)', en: 'Worker (worker.js)' },
        { fr: 'OpenCascade (WebAssembly)', en: 'OpenCascade (WebAssembly)' },
      ],
      steps: [
        {
          from: 0, to: 1,
          label: { fr: 'Ouvre piece.step', en: 'Opens part.step' },
          detail: {
            fr: 'Tu cliques sur <strong>Ouvrir un fichier…</strong> ou tu glisses le fichier dans la page. <code>app.js</code> reçoit un objet <code>File</code> : le contenu du fichier, encore jamais envoyé sur Internet.',
            en: 'You click <strong>Open file…</strong> or drop the file on the page. <code>app.js</code> receives a <code>File</code> object: the content of the file, never sent over the Internet.',
          },
        },
        {
          from: 1, to: 2,
          label: { fr: 'analyser(fichier)', en: 'analyse(file)' },
          detail: {
            fr: '<code>app.js</code> ne calcule rien lui-même : il appelle une fonction de <code>web/engine/client.js</code>, le « guichet » du moteur. Le client regarde l’extension (<code>.step</code> → CAO).',
            en: '<code>app.js</code> computes nothing itself: it calls a function of <code>web/engine/client.js</code>, the engine’s “front desk”. The client looks at the extension (<code>.step</code> → CAD).',
          },
        },
        {
          from: 2, to: 3,
          label: { fr: 'postMessage({type:"analyze"})', en: 'postMessage({type:"analyze"})' },
          detail: {
            fr: 'Le client envoie un <em>message</em> au Worker, un second fil d’exécution du navigateur. Ainsi la page ne gèle pas pendant le calcul : tu peux encore faire tourner la vue.',
            en: 'The client sends a <em>message</em> to the Worker, a second thread of the browser. So the page does not freeze during the computation: you can still rotate the view.',
          },
        },
        {
          from: 3, to: 4,
          label: { fr: 'Lire le STEP, volume exact', en: 'Read the STEP, exact volume' },
          detail: {
            fr: 'Le Worker charge OpenCascade, une bibliothèque C++ de CAO compilée en <strong>WebAssembly</strong>. Elle lit les vraies surfaces (plans, cylindres, NURBS) et intègre le volume exact avec <code>BRepGProp</code>.',
            en: 'The Worker loads OpenCascade, a C++ CAD library compiled to <strong>WebAssembly</strong>. It reads the true surfaces (planes, cylinders, NURBS) and integrates the exact volume with <code>BRepGProp</code>.',
          },
        },
        {
          from: 4, to: 3,
          label: { fr: 'Corps, volumes, maillage', en: 'Bodies, volumes, mesh' },
          detail: {
            fr: 'OpenCascade rend les corps : nom, volume, aire, centre de gravité, et un maillage de triangles pour l’affichage.',
            en: 'OpenCascade returns the bodies: name, volume, area, centre of mass, and a triangle mesh for display.',
          },
        },
        {
          from: 3, to: 2,
          label: { fr: 'postMessage({type:"result"})', en: 'postMessage({type:"result"})' },
          detail: {
            fr: 'Le Worker renvoie un message « result ». Le client retrouve la demande d’origine grâce à son numéro (<code>id</code>) et calcule les enveloppes (<code>summary.js</code>).',
            en: 'The Worker posts a “result” message. The client finds the original request thanks to its number (<code>id</code>) and computes the envelopes (<code>summary.js</code>).',
          },
        },
        {
          from: 2, to: 1,
          label: { fr: 'Résultat JSON', en: 'JSON result' },
          detail: {
            fr: 'La page reçoit un objet <code>result</code> : <code>summary.volume</code>, <code>bodies</code>… Elle remplit les cartes (volume, masse, encombrement).',
            en: 'The page receives a <code>result</code> object: <code>summary.volume</code>, <code>bodies</code>… It fills the cards (volume, mass, envelope).',
          },
        },
        {
          from: 1, to: 0,
          label: { fr: 'Affichage 3D (three.js)', en: '3D display (three.js)' },
          detail: {
            fr: 'Avec la bibliothèque <strong>three.js</strong>, la page dessine les triangles dans la vue 3D. Tu vois ta pièce et ses chiffres.',
            en: 'With the <strong>three.js</strong> library, the page draws the triangles in the 3D view. You see your part and its figures.',
          },
        },
      ],
    },
  },
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'start-1',
      title: { fr: 'Programme, appli web, fichier source', en: 'Program, web app, source file' },
      skills: ['start.app'],
      minutes: 8,
      body: {
        fr: `
<h3>Un programme, c’est une recette</h3>
<p>Un <strong>programme</strong> est une suite d’instructions qu’un ordinateur exécute <em>exactement</em> dans l’ordre, sans jamais deviner ce que tu voulais dire. C’est une gamme de fabrication extrêmement pointilleuse : « prendre le fichier, lire les triangles, additionner les petits volumes, afficher le total ».</p>
<p>Ces instructions sont écrites dans un <strong>langage de programmation</strong> (Python, JavaScript, C++…) et rangées dans des <strong>fichiers source</strong> : de simples fichiers texte, que tu peux ouvrir avec le Bloc-notes. Leur extension dit le langage : <code>.py</code> pour Python, <code>.js</code> ou <code>.mjs</code> pour JavaScript, <code>.cpp</code> et <code>.h</code> pour C++, <code>.html</code> pour la structure d’une page, <code>.css</code> pour son apparence.</p>

<div class="callout analogy">Une fonderie a des plans (le <em>quoi</em>) et des gammes (le <em>comment</em>). Un fichier source, c’est une gamme écrite pour une machine très obéissante et totalement dépourvue de bon sens.</div>

<h3>Une appli web</h3>
<p>Une <strong>application web</strong> est un programme qui tourne dans ton <strong>navigateur</strong> (Chrome, Edge, Firefox). Tu tapes une adresse, le navigateur télécharge des fichiers (HTML, CSS, JavaScript), puis il les exécute chez toi. 3D Reader est une appli web : son adresse publique est <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>.</p>
<p>Le navigateur sait lire trois langages :</p>
<ul>
  <li><strong>HTML</strong> : le squelette (titres, boutons, cartes) ;</li>
  <li><strong>CSS</strong> : l’habillage (couleurs, tailles, disposition) ;</li>
  <li><strong>JavaScript</strong> : le comportement (que se passe-t-il quand je clique ?).</li>
</ul>
<p>Il sait aussi exécuter du <span class="term" data-term="wasm">WebAssembly</span>, un format binaire très rapide produit à partir de langages comme C++. C’est ainsi que 3D Reader fait tourner OpenCascade, une énorme bibliothèque de CAO écrite en C++, directement dans ta page.</p>

~~~html title="web/index.html (début)"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>3D Reader</title>
  <link rel="stylesheet" href="style.css">
~~~

<h3>Front et back</h3>
<p>On sépare souvent une appli en deux côtés :</p>
<ul>
  <li>le <span class="term" data-term="frontend">front-end</span> (« le devant ») : ce qui tourne chez l’utilisateur, dans le navigateur ;</li>
  <li>le <span class="term" data-term="backend">back-end</span> (« l’arrière ») : ce qui tourne sur un <span class="term" data-term="client-serveur">serveur</span>, un ordinateur distant qui répond aux demandes.</li>
</ul>
<p>Originalité de 3D Reader : presque tout est côté front. Le calcul du volume, de l’épaisseur, du plan de joint se fait <em>dans ton navigateur</em>. Le back-end n’intervient que pour deux choses facultatives : un serveur Python pour usage local, et une petite passerelle sur Vercel qui relaie les questions de la page IA vers un modèle de langage.</p>

<div class="callout project">Dans <code>web/engine/client.js</code>, le premier commentaire le dit : « Files are read and analysed in a Web Worker: OpenCascade (WebAssembly) for CAD files, plain JavaScript readers for meshes. » Le fichier STEP ne quitte jamais ton ordinateur : c’est aussi une question de confidentialité.</div>

<h3>Du texte au résultat</h3>
<p>Entre le fichier texte et l’exécution, il y a toujours un <strong>moteur</strong> qui lit les instructions : l’interpréteur Python, le moteur JavaScript du navigateur (V8 dans Chrome), ou un compilateur qui traduit le C++ en code machine (ou en WebAssembly). On verra ces moteurs en détail dans le module « Environnements ».</p>
<div class="callout tip">Retiens la chaîne : <strong>fichier source</strong> (texte) → <strong>moteur</strong> (le lit ou le traduit) → <strong>exécution</strong> (le résultat à l’écran).</div>
`,
        en: `
<h3>A program is a recipe</h3>
<p>A <strong>program</strong> is a list of instructions that a computer executes <em>exactly</em> in order, without ever guessing what you meant. It is an extremely fussy routing sheet: “take the file, read the triangles, add up the small volumes, show the total”.</p>
<p>These instructions are written in a <strong>programming language</strong> (Python, JavaScript, C++…) and stored in <strong>source files</strong>: plain text files you could open with Notepad. Their extension tells the language: <code>.py</code> for Python, <code>.js</code> or <code>.mjs</code> for JavaScript, <code>.cpp</code> and <code>.h</code> for C++, <code>.html</code> for the structure of a page, <code>.css</code> for its look.</p>

<div class="callout analogy">A foundry has drawings (the <em>what</em>) and routing sheets (the <em>how</em>). A source file is a routing sheet written for a very obedient machine with no common sense at all.</div>

<h3>A web app</h3>
<p>A <strong>web application</strong> is a program that runs in your <strong>browser</strong> (Chrome, Edge, Firefox). You type an address, the browser downloads files (HTML, CSS, JavaScript), then runs them on your computer. 3D Reader is a web app: its public address is <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>.</p>
<p>The browser reads three languages:</p>
<ul>
  <li><strong>HTML</strong>: the skeleton (titles, buttons, cards);</li>
  <li><strong>CSS</strong>: the look (colours, sizes, layout);</li>
  <li><strong>JavaScript</strong>: the behaviour (what happens when I click?).</li>
</ul>
<p>It can also run <span class="term" data-term="wasm">WebAssembly</span>, a very fast binary format produced from languages such as C++. That is how 3D Reader runs OpenCascade, a huge CAD library written in C++, right inside your page.</p>

~~~html title="web/index.html (beginning)"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>3D Reader</title>
  <link rel="stylesheet" href="style.css">
~~~

<h3>Front end and back end</h3>
<p>An app is often split into two sides:</p>
<ul>
  <li>the <span class="term" data-term="frontend">front end</span>: what runs on the user’s side, in the browser;</li>
  <li>the <span class="term" data-term="backend">back end</span>: what runs on a <span class="term" data-term="client-serveur">server</span>, a remote computer that answers requests.</li>
</ul>
<p>What is special about 3D Reader: almost everything is front end. The volume, the wall thickness, the parting line are computed <em>in your browser</em>. The back end is only used for two optional things: a Python server for local use, and a small gateway on Vercel that relays the questions of the AI page to a language model.</p>

<div class="callout project">In <code>web/engine/client.js</code>, the first comment says it: “Files are read and analysed in a Web Worker: OpenCascade (WebAssembly) for CAD files, plain JavaScript readers for meshes.” The STEP file never leaves your computer: it is also a matter of confidentiality.</div>

<h3>From text to result</h3>
<p>Between the text file and the execution there is always an <strong>engine</strong> that reads the instructions: the Python interpreter, the JavaScript engine of the browser (V8 in Chrome), or a compiler that translates C++ into machine code (or into WebAssembly). We will see these engines in detail in the “Environments” module.</p>
<div class="callout tip">Remember the chain: <strong>source file</strong> (text) → <strong>engine</strong> (reads or translates it) → <strong>execution</strong> (the result on screen).</div>
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : le restaurant</h3>
<p>Imagine un restaurant.</p>
<ul>
  <li>La <strong>salle</strong>, avec ses tables, son menu et le serveur qui prend ta commande, c’est le <strong>front-end</strong> : ce que le client voit et touche.</li>
  <li>La <strong>cuisine</strong>, que le client ne voit jamais, c’est le <strong>back-end</strong>.</li>
  <li>Les <strong>recettes</strong> écrites sur des fiches, ce sont les <strong>fichiers source</strong>.</li>
  <li>Le <strong>cuisinier</strong> qui lit la fiche et la suit à la lettre, c’est le <strong>moteur</strong> (interpréteur ou programme compilé).</li>
</ul>
<p>3D Reader est un restaurant un peu spécial : il te livre les fiches et les ustensiles, et c’est <em>ton</em> navigateur qui cuisine sur place. La cuisine distante ne sert presque jamais.</p>

<h3>Pas à pas : ce qui arrive quand tu tapes l’adresse</h3>
~~~text
 Toi                 Internet                GitHub Pages
  |  adresse tapée  ------------------------>  |
  |  <--- index.html, style.css, app.js ----  |
  |  (le navigateur les exécute chez toi)      |
~~~
<ol>
  <li>Le navigateur demande la page à GitHub Pages (un hébergeur de fichiers).</li>
  <li>Il reçoit <code>index.html</code>, qui dit « charge aussi <code>style.css</code> et <code>app.js</code> ».</li>
  <li>Il affiche le squelette, applique l’habillage, puis exécute le JavaScript.</li>
  <li>Quand tu ouvres un fichier STEP, tout le calcul se fait sur <em>ton</em> processeur.</li>
</ol>

<h3>Les erreurs classiques de débutant</h3>
<ul>
  <li>« Java et JavaScript, c’est pareil » : non, deux langages sans rapport, malgré le nom.</li>
  <li>« Le HTML est un langage de programmation » : c’est plutôt un langage de <em>description</em> ; il ne prend pas de décisions, il n’a ni condition ni boucle.</li>
  <li>« Une appli web tourne forcément sur un serveur » : 3D Reader prouve le contraire.</li>
</ul>
<div class="callout tip">Ouvre n’importe quel fichier <code>.js</code> du dépôt dans le Bloc-notes : ce n’est que du texte. Il n’y a rien de magique, juste beaucoup de petites instructions.</div>
`,
        en: `
<h3>Put differently: the restaurant</h3>
<p>Picture a restaurant.</p>
<ul>
  <li>The <strong>dining room</strong>, with its tables, its menu and the waiter taking your order, is the <strong>front end</strong>: what the customer sees and touches.</li>
  <li>The <strong>kitchen</strong>, which the customer never sees, is the <strong>back end</strong>.</li>
  <li>The <strong>recipes</strong> written on cards are the <strong>source files</strong>.</li>
  <li>The <strong>cook</strong> who reads the card and follows it to the letter is the <strong>engine</strong> (interpreter or compiled program).</li>
</ul>
<p>3D Reader is a slightly odd restaurant: it hands you the cards and the utensils, and <em>your</em> browser cooks on the spot. The remote kitchen is almost never used.</p>

<h3>Step by step: what happens when you type the address</h3>
~~~text
 You                 Internet                GitHub Pages
  |  address typed  ------------------------>  |
  |  <--- index.html, style.css, app.js ----  |
  |  (the browser runs them on your computer)  |
~~~
<ol>
  <li>The browser asks GitHub Pages (a file host) for the page.</li>
  <li>It receives <code>index.html</code>, which says “also load <code>style.css</code> and <code>app.js</code>”.</li>
  <li>It shows the skeleton, applies the look, then runs the JavaScript.</li>
  <li>When you open a STEP file, all the computation happens on <em>your</em> processor.</li>
</ol>

<h3>Classic beginner mistakes</h3>
<ul>
  <li>“Java and JavaScript are the same”: no, two unrelated languages despite the name.</li>
  <li>“HTML is a programming language”: it is rather a <em>description</em> language; it makes no decisions, it has no conditions and no loops.</li>
  <li>“A web app always runs on a server”: 3D Reader proves otherwise.</li>
</ul>
<div class="callout tip">Open any <code>.js</code> file of the repository in Notepad: it is only text. Nothing magic, just lots of small instructions.</div>
`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'start-2',
      title: { fr: 'La carte de 3D Reader : qui fait quoi', en: 'The map of 3D Reader: who does what' },
      skills: ['start.map'],
      minutes: 12,
      body: {
        fr: `
<h3>Le plan de l’usine</h3>
<p>Avant d’ouvrir un fichier de code, il faut savoir <em>où</em> on est. Voici les grands ateliers du dépôt 3D Reader :</p>
<table>
  <thead><tr><th>Dossier / fichier</th><th>Rôle</th><th>Langage</th></tr></thead>
  <tbody>
    <tr><td><code>web/index.html</code>, <code>web/style.css</code></td><td>squelette et habillage de la page</td><td>HTML, CSS</td></tr>
    <tr><td><code>web/app.js</code></td><td>chef d’orchestre de l’interface : boutons, cartes, vue 3D three.js (≈ 10 000 lignes !)</td><td>JavaScript</td></tr>
    <tr><td><code>web/i18n.js</code></td><td>les textes en français et en anglais</td><td>JavaScript</td></tr>
    <tr><td><code>web/engine/</code></td><td>le moteur de calcul : <code>client.js</code> (guichet), <code>worker.js</code> (atelier en arrière-plan), <code>cad.js</code> (lecture CAO), <code>meshanalysis.js</code>, <code>summary.js</code> (enveloppes), <code>thickness.js</code>, <code>parting.js</code> (plan de joint), <code>gating.js</code>, <code>slides.js</code>…</td><td>JavaScript</td></tr>
    <tr><td><code>web/vendor/opencascade/</code></td><td>OpenCascade compilé en WebAssembly (généré au build)</td><td>C++ → wasm</td></tr>
    <tr><td><code>web/chiffrage/</code></td><td>la page de chiffrage (devis, outillage, noyaux)</td><td>JavaScript</td></tr>
    <tr><td><code>reader3d/</code></td><td>le moteur Python de <em>référence</em> et un serveur FastAPI optionnel</td><td>Python</td></tr>
    <tr><td><code>api/ai.js</code></td><td>la passerelle IA, une fonction qui tourne sur Vercel et parle à Groq</td><td>JavaScript (Node)</td></tr>
    <tr><td><code>tests/</code></td><td>tests unitaires (<code>tests/js</code>), de bout en bout (<code>tests/e2e</code>), Python</td><td>JS, Python</td></tr>
    <tr><td><code>.github/workflows/</code></td><td>les robots de GitHub : CI (<code>ci.yml</code>) et publication (<code>pages.yml</code>)</td><td>YAML</td></tr>
  </tbody>
</table>

<h3>Le voyage d’un fichier STEP</h3>
<p>Clique sur les étapes du diagramme pour suivre ce qui se passe quand tu ouvres une pièce :</p>
<div data-widget="start-flow-open"></div>

<p>Point clé : <code>worker.js</code> tourne dans un <span class="term" data-term="web-worker">Web Worker</span>, un second fil de travail. Le fil principal garde l’interface fluide pendant que le Worker mouline. Les deux ne partagent pas leurs variables : ils s’envoient des <strong>messages</strong>.</p>

~~~js title="web/engine/worker.js"
import { loadOcct } from './occt.js';    //«1»
import { analyzeCad } from './cad.js';
// ...
self.onmessage = async (event) => {       //«2»
  const msg = event.data;
  if (msg.type === 'preload') {           //«3»
    await occt();
    postMessage({ type: 'ready', engine: 'cad' });
    return;
  }
~~~
<ol class="notes">
  <li>Le Worker importe les outils dont il a besoin : le chargeur d’OpenCascade et le lecteur CAO.</li>
  <li><code>onmessage</code> : « quand un message arrive, fais ceci ».</li>
  <li>Selon le <code>type</code> du message, il fait un travail différent, puis répond avec <code>postMessage</code>.</li>
</ol>

<h3>Les acteurs en dehors du navigateur</h3>
<ul>
  <li><strong>GitHub</strong> garde le code (le <span class="term" data-term="repo">dépôt</span>) et son historique.</li>
  <li><strong>GitHub Actions</strong> lance la <span class="term" data-term="ci">CI</span> à chaque envoi : tests Python, tests du moteur JS, construction du site, tests de bout en bout dans Chromium.</li>
  <li><strong>GitHub Pages</strong> publie le site, mais seulement quand la CI de <code>main</code> est verte.</li>
  <li><strong>Vercel</strong> héberge <code>api/ai.js</code> : la clé de l’API Groq y reste cachée, jamais dans la page.</li>
  <li><strong>Groq</strong> fait tourner le modèle de langage qui répond aux questions de la page IA.</li>
</ul>

<div class="callout project">Le moteur Python <code>reader3d/</code> est la <em>référence</em> : le moteur JS doit retrouver les mêmes volumes. Les tests le vérifient, grâce aux « fixtures » générées par <code>tests/make_fixtures.py</code>.</div>
`,
        en: `
<h3>The factory floor plan</h3>
<p>Before opening a code file, you need to know <em>where</em> you are. Here are the main workshops of the 3D Reader repository:</p>
<table>
  <thead><tr><th>Folder / file</th><th>Role</th><th>Language</th></tr></thead>
  <tbody>
    <tr><td><code>web/index.html</code>, <code>web/style.css</code></td><td>skeleton and look of the page</td><td>HTML, CSS</td></tr>
    <tr><td><code>web/app.js</code></td><td>conductor of the interface: buttons, cards, three.js 3D view (≈ 10,000 lines!)</td><td>JavaScript</td></tr>
    <tr><td><code>web/i18n.js</code></td><td>the texts in French and English</td><td>JavaScript</td></tr>
    <tr><td><code>web/engine/</code></td><td>the computing engine: <code>client.js</code> (front desk), <code>worker.js</code> (background workshop), <code>cad.js</code> (CAD reading), <code>meshanalysis.js</code>, <code>summary.js</code> (envelopes), <code>thickness.js</code>, <code>parting.js</code> (parting line), <code>gating.js</code>, <code>slides.js</code>…</td><td>JavaScript</td></tr>
    <tr><td><code>web/vendor/opencascade/</code></td><td>OpenCascade compiled to WebAssembly (generated by the build)</td><td>C++ → wasm</td></tr>
    <tr><td><code>web/chiffrage/</code></td><td>the costing page (quote, tooling, cores)</td><td>JavaScript</td></tr>
    <tr><td><code>reader3d/</code></td><td>the <em>reference</em> Python engine and an optional FastAPI server</td><td>Python</td></tr>
    <tr><td><code>api/ai.js</code></td><td>the AI gateway, a function running on Vercel that talks to Groq</td><td>JavaScript (Node)</td></tr>
    <tr><td><code>tests/</code></td><td>unit tests (<code>tests/js</code>), end-to-end tests (<code>tests/e2e</code>), Python</td><td>JS, Python</td></tr>
    <tr><td><code>.github/workflows/</code></td><td>GitHub’s robots: CI (<code>ci.yml</code>) and publishing (<code>pages.yml</code>)</td><td>YAML</td></tr>
  </tbody>
</table>

<h3>The journey of a STEP file</h3>
<p>Click the steps of the diagram to follow what happens when you open a part:</p>
<div data-widget="start-flow-open"></div>

<p>Key point: <code>worker.js</code> runs in a <span class="term" data-term="web-worker">Web Worker</span>, a second thread. The main thread keeps the interface smooth while the Worker crunches. The two do not share their variables: they send each other <strong>messages</strong>.</p>

~~~js title="web/engine/worker.js"
import { loadOcct } from './occt.js';    //«1»
import { analyzeCad } from './cad.js';
// ...
self.onmessage = async (event) => {       //«2»
  const msg = event.data;
  if (msg.type === 'preload') {           //«3»
    await occt();
    postMessage({ type: 'ready', engine: 'cad' });
    return;
  }
~~~
<ol class="notes">
  <li>The Worker imports the tools it needs: the OpenCascade loader and the CAD reader.</li>
  <li><code>onmessage</code>: “when a message arrives, do this”.</li>
  <li>Depending on the message <code>type</code>, it does a different job, then answers with <code>postMessage</code>.</li>
</ol>

<h3>The players outside the browser</h3>
<ul>
  <li><strong>GitHub</strong> keeps the code (the <span class="term" data-term="repo">repository</span>) and its history.</li>
  <li><strong>GitHub Actions</strong> runs the <span class="term" data-term="ci">CI</span> on every push: Python tests, JS engine tests, building the site, end-to-end tests in Chromium.</li>
  <li><strong>GitHub Pages</strong> publishes the site, but only when the CI of <code>main</code> is green.</li>
  <li><strong>Vercel</strong> hosts <code>api/ai.js</code>: the Groq API key stays hidden there, never in the page.</li>
  <li><strong>Groq</strong> runs the language model that answers the questions of the AI page.</li>
</ul>

<div class="callout project">The Python engine <code>reader3d/</code> is the <em>reference</em>: the JS engine must find the same volumes. The tests check it, thanks to the “fixtures” generated by <code>tests/make_fixtures.py</code>.</div>
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : la fonderie</h3>
<p>Compare 3D Reader à ton usine :</p>
<table>
  <thead><tr><th>Dans la fonderie</th><th>Dans 3D Reader</th></tr></thead>
  <tbody>
    <tr><td>L’accueil, qui reçoit la demande du client</td><td><code>app.js</code> (l’interface)</td></tr>
    <tr><td>Le bureau des méthodes qui transmet l’ordre de fabrication</td><td><code>client.js</code></td></tr>
    <tr><td>L’atelier, dans un bâtiment séparé, pour ne pas gêner l’accueil</td><td><code>worker.js</code> (le Web Worker)</td></tr>
    <tr><td>La machine spéciale achetée à un fournisseur</td><td>OpenCascade (C++ en WebAssembly)</td></tr>
    <tr><td>Le contrôle qualité avant expédition</td><td>les tests et la CI</td></tr>
    <tr><td>Le quai d’expédition</td><td>GitHub Pages</td></tr>
    <tr><td>L’expert extérieur qu’on appelle au téléphone</td><td>Groq, via la passerelle Vercel</td></tr>
  </tbody>
</table>

<h3>Pourquoi un atelier séparé (le Worker) ?</h3>
<p>JavaScript, dans une page, n’a qu’un seul fil principal. S’il passe 20 secondes à lire un gros STEP, plus rien ne répond : les boutons, la souris, l’affichage. C’est comme si l’hôtesse d’accueil partait couler une pièce : plus personne au téléphone. En envoyant le travail au Worker, l’accueil reste disponible.</p>
~~~text
 fil principal :  [clic] [affiche "Lecture 30 %"] [tourne la vue] [affiche résultat]
 Worker       :        [====== lecture STEP + volume exact ======]
~~~

<h3>Le trajet en 4 phrases</h3>
<ol>
  <li>La page reçoit le fichier.</li>
  <li>Le client l’emballe dans un message et l’envoie au Worker.</li>
  <li>Le Worker fait calculer OpenCascade, puis renvoie le résultat par message.</li>
  <li>La page affiche les chiffres et la 3D (three.js).</li>
</ol>
<div class="callout warn">Erreur fréquente : croire que le fichier part sur un serveur. Non : sur GitHub Pages, aucun calcul ne se fait à distance. Seule la page IA envoie un <em>résumé</em> (pas le fichier) à Vercel, puis à Groq.</div>
`,
        en: `
<h3>Put differently: the foundry</h3>
<p>Compare 3D Reader to your plant:</p>
<table>
  <thead><tr><th>In the foundry</th><th>In 3D Reader</th></tr></thead>
  <tbody>
    <tr><td>Reception, which takes the customer’s request</td><td><code>app.js</code> (the interface)</td></tr>
    <tr><td>The methods office that passes on the work order</td><td><code>client.js</code></td></tr>
    <tr><td>The workshop, in a separate building so as not to disturb reception</td><td><code>worker.js</code> (the Web Worker)</td></tr>
    <tr><td>The special machine bought from a supplier</td><td>OpenCascade (C++ as WebAssembly)</td></tr>
    <tr><td>Quality control before shipping</td><td>the tests and the CI</td></tr>
    <tr><td>The shipping dock</td><td>GitHub Pages</td></tr>
    <tr><td>The outside expert you call on the phone</td><td>Groq, through the Vercel gateway</td></tr>
  </tbody>
</table>

<h3>Why a separate workshop (the Worker)?</h3>
<p>JavaScript, in a page, has a single main thread. If it spends 20 seconds reading a big STEP, nothing responds anymore: buttons, mouse, display. It is as if the receptionist went off to pour a casting: nobody answers the phone. By sending the job to the Worker, reception stays available.</p>
~~~text
 main thread :  [click] [shows "Reading 30 %"] [rotates view] [shows result]
 Worker      :        [====== STEP reading + exact volume ======]
~~~

<h3>The journey in 4 sentences</h3>
<ol>
  <li>The page receives the file.</li>
  <li>The client wraps it in a message and sends it to the Worker.</li>
  <li>The Worker has OpenCascade compute, then sends the result back by message.</li>
  <li>The page shows the figures and the 3D (three.js).</li>
</ol>
<div class="callout warn">Common mistake: believing the file goes to a server. No: on GitHub Pages no computation happens remotely. Only the AI page sends a <em>summary</em> (not the file) to Vercel, then to Groq.</div>
`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'start-3',
      title: { fr: 'Lire du code sans paniquer', en: 'Reading code without panicking' },
      skills: ['start.reading'],
      minutes: 10,
      body: {
        fr: `
<h3>Personne ne lit 10 000 lignes d’un coup</h3>
<p><code>web/app.js</code> fait plus de 10 000 lignes. Même son auteur ne les a pas en tête. Lire du code, c’est comme lire un plan d’ensemble : on cherche la zone qui nous intéresse, on ignore le reste. Voici une méthode en 6 gestes.</p>

<h4>1. Lis d’abord les commentaires</h4>
<p>Les lignes qui commencent par <code>//</code> (JS, C++) ou <code>#</code> (Python) sont des <span class="term" data-term="commentaire">commentaires</span> : la machine les ignore, ils sont écrits pour toi. Dans 3D Reader, chaque fichier commence par un paragraphe qui dit son rôle.</p>

~~~js title="web/engine/units.js"
// Length units of mesh files, mirroring reader3d/mesh.py.
//
// All results of the engine are expressed in millimetres; a mesh file is
// scaled by the factor of its source unit when it is read.
~~~

<h4>2. Fais confiance aux noms</h4>
<p>Un bon nom raconte une histoire : <code>unitFactor</code> donne un facteur d’unité, <code>largestBody</code> le plus gros corps, <code>releaseMemory</code> libère la mémoire. Les mots en anglais sont des indices précieux.</p>

<h4>3. Cherche les entrées et la sortie</h4>
<p>Pour une fonction, pose trois questions : <em>qu’est-ce qui entre</em> (les paramètres entre parenthèses), <em>qu’est-ce qui sort</em> (après <code>return</code>), <em>que peut-il mal se passer</em> (les <code>throw</code>).</p>

~~~js title="web/engine/units.js"
export function unitFactor(unit) {                            //«1»
  if (!Object.prototype.hasOwnProperty.call(UNITS, unit)) {   //«2»
    throw new Error(\`Unknown unit '\${unit}'\`);             //«3»
  }
  return UNITS[unit];                                         //«4»
}
~~~
<ol class="notes">
  <li>Entrée : <code>unit</code>, par exemple <code>"cm"</code>.</li>
  <li>Vérification : l’unité est-elle dans la table <code>UNITS</code> ? Pas besoin de comprendre chaque mot : « si l’unité n’existe pas… ».</li>
  <li>… alors erreur, avec un message clair.</li>
  <li>Sortie : le facteur vers les millimètres (<code>10</code> pour <code>"cm"</code>).</li>
</ol>

<h4>4. Suis un appel, un seul</h4>
<p>Quand tu vois <code>summarize(bodies)</code>, cherche où <code>summarize</code> est défini : la ligne <code>import { summarize } from './summary.js'</code> te dit dans quel fichier aller. Suis le fil comme on suit une tuyauterie, pas toute l’usine.</p>

<h4>5. Cherche, cherche, cherche</h4>
<ul>
  <li><kbd>Ctrl</kbd> + <kbd>F</kbd> dans un fichier ;</li>
  <li><kbd>Ctrl</kbd> + <kbd>Maj</kbd> + <kbd>F</kbd> dans VS Code pour tout le projet ;</li>
  <li>sur GitHub, la touche <kbd>T</kbd> pour trouver un fichier, <kbd>/</kbd> pour la recherche de code ;</li>
  <li>demande à Claude Code : « où est calculé le volume d’un maillage ? ».</li>
</ul>

<h4>6. Accepte de ne pas tout comprendre</h4>
<p>Comprendre 70 % d’une fonction suffit souvent pour savoir ce qu’elle fait. Note les mots inconnus, consulte le glossaire, et avance.</p>
<div class="callout tip">Lis en trois passes : <strong>le titre</strong> (nom + commentaire), <strong>le squelette</strong> (if, boucles, return), puis <strong>les détails</strong> seulement si nécessaire.</div>
`,
        en: `
<h3>Nobody reads 10,000 lines at once</h3>
<p><code>web/app.js</code> is more than 10,000 lines long. Even its author does not keep them all in mind. Reading code is like reading a general arrangement drawing: you look for the area you care about and ignore the rest. Here is a method in 6 moves.</p>

<h4>1. Read the comments first</h4>
<p>Lines starting with <code>//</code> (JS, C++) or <code>#</code> (Python) are <span class="term" data-term="commentaire">comments</span>: the machine ignores them, they are written for you. In 3D Reader, each file begins with a paragraph that states its role.</p>

~~~js title="web/engine/units.js"
// Length units of mesh files, mirroring reader3d/mesh.py.
//
// All results of the engine are expressed in millimetres; a mesh file is
// scaled by the factor of its source unit when it is read.
~~~

<h4>2. Trust the names</h4>
<p>A good name tells a story: <code>unitFactor</code> gives a unit factor, <code>largestBody</code> the largest body, <code>releaseMemory</code> frees memory. The English words are precious clues.</p>

<h4>3. Look for the inputs and the output</h4>
<p>For a function, ask three questions: <em>what goes in</em> (the parameters in parentheses), <em>what comes out</em> (after <code>return</code>), <em>what can go wrong</em> (the <code>throw</code>s).</p>

~~~js title="web/engine/units.js"
export function unitFactor(unit) {                            //«1»
  if (!Object.prototype.hasOwnProperty.call(UNITS, unit)) {   //«2»
    throw new Error(\`Unknown unit '\${unit}'\`);             //«3»
  }
  return UNITS[unit];                                         //«4»
}
~~~
<ol class="notes">
  <li>Input: <code>unit</code>, for example <code>"cm"</code>.</li>
  <li>Check: is the unit in the <code>UNITS</code> table? No need to understand every word: “if the unit does not exist…”.</li>
  <li>… then an error, with a clear message.</li>
  <li>Output: the factor to millimetres (<code>10</code> for <code>"cm"</code>).</li>
</ol>

<h4>4. Follow one call, just one</h4>
<p>When you see <code>summarize(bodies)</code>, look for where <code>summarize</code> is defined: the line <code>import { summarize } from './summary.js'</code> tells you which file to go to. Follow the thread like a pipe, not the whole plant.</p>

<h4>5. Search, search, search</h4>
<ul>
  <li><kbd>Ctrl</kbd> + <kbd>F</kbd> inside a file;</li>
  <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> in VS Code for the whole project;</li>
  <li>on GitHub, the <kbd>T</kbd> key to find a file, <kbd>/</kbd> for code search;</li>
  <li>ask Claude Code: “where is the volume of a mesh computed?”.</li>
</ul>

<h4>6. Accept not understanding everything</h4>
<p>Understanding 70 % of a function is often enough to know what it does. Note the unknown words, check the glossary, and move on.</p>
<div class="callout tip">Read in three passes: <strong>the title</strong> (name + comment), <strong>the skeleton</strong> (ifs, loops, return), then <strong>the details</strong> only if needed.</div>
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : lire un plan de pièce</h3>
<p>Quand on te tend un plan de carter de 40 cotes, tu ne commences pas par la tolérance du trou M6. Tu regardes d’abord le cartouche (titre, matière), puis la forme générale, puis les détails qui te concernent. Le code se lit pareil :</p>
<table>
  <thead><tr><th>Plan</th><th>Code</th></tr></thead>
  <tbody>
    <tr><td>Cartouche</td><td>commentaire en tête du fichier, nom de la fonction</td></tr>
    <tr><td>Vues principales</td><td>squelette : <code>if</code>, boucles, <code>return</code></td></tr>
    <tr><td>Cotes de détail</td><td>calculs précis à l’intérieur</td></tr>
    <tr><td>Renvoi « voir plan n° … »</td><td><code>import … from './autre-fichier.js'</code></td></tr>
  </tbody>
</table>

<h3>Exercice mental, ligne à ligne</h3>
<p>Traduisons en français courant :</p>
~~~js
export function unitFactor(unit) {     // « voici une recette publique appelée unitFactor, elle prend une unité »
  if (!UNITS[unit]) {                  // « si l'unité n'est pas dans la table… »
    throw new Error('Unknown unit');   // « … arrête tout et signale le problème »
  }
  return UNITS[unit];                  // « sinon, rends le facteur trouvé dans la table »
}
~~~
<p>Tu viens de lire une vraie fonction de 3D Reader (légèrement simplifiée). Les accolades <code>{ }</code> sont juste des parenthèses de bloc, comme l’indentation en Python.</p>

<h3>Les pièges qui font paniquer</h3>
<ul>
  <li><strong>Les symboles bizarres</strong> (<code>?.</code>, <code>??</code>, <code>=&gt;</code>) : ce sont des raccourcis. Le module JavaScript les explique un par un.</li>
  <li><strong>Les mots inconnus</strong> : regarde le glossaire ou demande « que veut dire X dans ce fichier ? ».</li>
  <li><strong>La longueur</strong> : replie les fonctions dans l’éditeur (petite flèche à gauche des lignes) pour ne voir que leurs titres.</li>
</ul>
<div class="callout analogy">Lire du code, c’est comme apprendre à lire une radio de pièce : au début tout est gris ; après quelques dizaines, tu repères les retassures en un coup d’œil.</div>
`,
        en: `
<h3>Put differently: reading a part drawing</h3>
<p>When someone hands you a housing drawing with 40 dimensions, you do not start with the tolerance of the M6 hole. You look first at the title block (title, material), then the overall shape, then the details that concern you. Code is read the same way:</p>
<table>
  <thead><tr><th>Drawing</th><th>Code</th></tr></thead>
  <tbody>
    <tr><td>Title block</td><td>comment at the top of the file, function name</td></tr>
    <tr><td>Main views</td><td>skeleton: <code>if</code>s, loops, <code>return</code></td></tr>
    <tr><td>Detail dimensions</td><td>precise computations inside</td></tr>
    <tr><td>“See drawing no. …” reference</td><td><code>import … from './other-file.js'</code></td></tr>
  </tbody>
</table>

<h3>Mental exercise, line by line</h3>
<p>Let us translate into plain English:</p>
~~~js
export function unitFactor(unit) {     // "here is a public recipe called unitFactor, it takes a unit"
  if (!UNITS[unit]) {                  // "if the unit is not in the table..."
    throw new Error('Unknown unit');   // "... stop everything and report the problem"
  }
  return UNITS[unit];                  // "otherwise, give back the factor found in the table"
}
~~~
<p>You have just read a real 3D Reader function (slightly simplified). Braces <code>{ }</code> are just block brackets, like indentation in Python.</p>

<h3>The traps that cause panic</h3>
<ul>
  <li><strong>Strange symbols</strong> (<code>?.</code>, <code>??</code>, <code>=&gt;</code>): these are shortcuts. The JavaScript module explains them one by one.</li>
  <li><strong>Unknown words</strong>: check the glossary or ask “what does X mean in this file?”.</li>
  <li><strong>Length</strong>: fold the functions in the editor (little arrow to the left of the lines) to see only their titles.</li>
</ul>
<div class="callout analogy">Reading code is like learning to read a casting X-ray: at first everything is grey; after a few dozen, you spot shrinkage at a glance.</div>
`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'start-4',
      title: { fr: 'Le vocabulaire de base', en: 'The basic vocabulary' },
      skills: ['start.vocab'],
      minutes: 10,
      body: {
        fr: `
<h3>Les mots que tu vas entendre partout</h3>
<p>Le monde du code a son jargon, comme la fonderie a ses « masselottes », « noyaux » et « plans de joint ». Voici les dix premiers mots à maîtriser.</p>

<h4>Bibliothèque (library)</h4>
<p>Du code écrit par d’autres, prêt à l’emploi, qu’on appelle depuis son programme. <strong>three.js</strong> est une bibliothèque d’affichage 3D ; <strong>OpenCascade</strong> une bibliothèque de géométrie CAO ; <strong>numpy</strong> une bibliothèque de calcul en Python. C’est toi qui décides quand l’appeler.</p>

<h4>Framework</h4>
<p>Un cadre plus large qui impose une organisation, et qui <em>t’</em>appelle. <strong>FastAPI</strong>, dans <code>reader3d/server.py</code>, est un framework : tu décris « quand on demande <code>/api/analyze</code>, exécute cette fonction », et c’est FastAPI qui décide quand l’appeler.</p>
<div class="callout analogy">Une bibliothèque, c’est une caisse à outils : tu prends le marteau quand tu veux. Un framework, c’est une chaîne de production : tu viens poser ta pièce au bon poste, au bon moment.</div>

<h4>API</h4>
<p>Une <span class="term" data-term="api">API</span> (interface de programmation) est le « mode d’emploi » officiel pour parler à un programme : quelles fonctions appeler, quels paramètres donner, ce qu’on reçoit. <code>unitFactor(unit)</code> fait partie de l’API du module <code>units.js</code>. <code>POST /api/ai</code> est l’API web de la passerelle IA.</p>

<h4>Moteur (engine)</h4>
<p>Le programme qui fait le gros du travail. Dans 3D Reader, « le moteur » désigne <code>web/engine/</code> (le calcul), mais on parle aussi du « moteur JavaScript » du navigateur (V8) qui exécute le code.</p>

<h4>Dépendance</h4>
<p>Une bibliothèque dont ton projet a besoin pour fonctionner. Elles sont listées dans <code>package.json</code> (JavaScript) et <code>requirements.txt</code> (Python).</p>

~~~json title="package.json (extrait)"
"devDependencies": {
  "opencascade.js": "2.0.0-beta.b5ff984",
  "playwright": "^1.56.1",
  "three": "0.180.0"
}
~~~

<h4>Version</h4>
<p>Un numéro du type <code>0.180.0</code> : <em>majeure.mineure.correctif</em> (c’est le <span class="term" data-term="semver">versionnage sémantique</span>). Le <code>^</code> devant <code>1.56.1</code> veut dire « 1.56.1 ou plus récent, tant que la majeure reste 1 ». Figer une version évite les surprises.</p>

<h4>Compiler ou interpréter</h4>
<ul>
  <li><strong>Compiler</strong> : traduire <em>tout</em> le programme à l’avance en code machine (ou en WebAssembly). C’est le cas du C++ : OpenCascade est compilé une fois, puis livré.</li>
  <li><strong>Interpréter</strong> : lire et exécuter le programme au fur et à mesure. C’est (en gros) le cas de Python et de JavaScript.</li>
</ul>
<p>En réalité les moteurs modernes mélangent les deux (V8 compile le JavaScript « juste à temps »), mais l’idée reste : C++ = traduit à l’avance, rapide ; Python/JS = souple, prêt tout de suite.</p>

<h4>Build</h4>
<p>L’étape qui prépare le site avant publication. <code>npm run build</code> lance <code>scripts/build-web.mjs</code>, qui copie three.js et OpenCascade dans <code>vendor/</code> et produit le dossier <code>dist/</code> publié sur GitHub Pages.</p>
`,
        en: `
<h3>Words you will hear everywhere</h3>
<p>The coding world has its jargon, just as the foundry has its “risers”, “cores” and “parting lines”. Here are the first ten words to master.</p>

<h4>Library</h4>
<p>Code written by others, ready to use, that you call from your program. <strong>three.js</strong> is a 3D display library; <strong>OpenCascade</strong> a CAD geometry library; <strong>numpy</strong> a Python computing library. You decide when to call it.</p>

<h4>Framework</h4>
<p>A broader structure that imposes an organisation, and that calls <em>you</em>. <strong>FastAPI</strong>, in <code>reader3d/server.py</code>, is a framework: you describe “when someone asks for <code>/api/analyze</code>, run this function”, and FastAPI decides when to call it.</p>
<div class="callout analogy">A library is a toolbox: you take the hammer when you want. A framework is a production line: you bring your part to the right station at the right moment.</div>

<h4>API</h4>
<p>An <span class="term" data-term="api">API</span> (application programming interface) is the official “user manual” to talk to a program: which functions to call, which parameters to give, what you get back. <code>unitFactor(unit)</code> is part of the API of the <code>units.js</code> module. <code>POST /api/ai</code> is the web API of the AI gateway.</p>

<h4>Engine</h4>
<p>The program that does the heavy work. In 3D Reader, “the engine” means <code>web/engine/</code> (the computation), but people also speak of the browser’s “JavaScript engine” (V8) that runs the code.</p>

<h4>Dependency</h4>
<p>A library your project needs in order to work. They are listed in <code>package.json</code> (JavaScript) and <code>requirements.txt</code> (Python).</p>

~~~json title="package.json (excerpt)"
"devDependencies": {
  "opencascade.js": "2.0.0-beta.b5ff984",
  "playwright": "^1.56.1",
  "three": "0.180.0"
}
~~~

<h4>Version</h4>
<p>A number like <code>0.180.0</code>: <em>major.minor.patch</em> (this is <span class="term" data-term="semver">semantic versioning</span>). The <code>^</code> before <code>1.56.1</code> means “1.56.1 or newer, as long as the major stays 1”. Pinning a version avoids surprises.</p>

<h4>Compile or interpret</h4>
<ul>
  <li><strong>Compile</strong>: translate the <em>whole</em> program in advance into machine code (or WebAssembly). That is the case of C++: OpenCascade is compiled once, then shipped.</li>
  <li><strong>Interpret</strong>: read and run the program as you go. That is (roughly) the case of Python and JavaScript.</li>
</ul>
<p>In reality modern engines mix both (V8 compiles JavaScript “just in time”), but the idea stays: C++ = translated in advance, fast; Python/JS = flexible, ready at once.</p>

<h4>Build</h4>
<p>The step that prepares the site before publishing. <code>npm run build</code> runs <code>scripts/build-web.mjs</code>, which copies three.js and OpenCascade into <code>vendor/</code> and produces the <code>dist/</code> folder published on GitHub Pages.</p>
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : le vocabulaire en images</h3>
<table>
  <thead><tr><th>Mot</th><th>Image de la vie courante</th><th>Exemple 3D Reader</th></tr></thead>
  <tbody>
    <tr><td>Bibliothèque</td><td>une caisse à outils empruntée</td><td>three.js, OpenCascade</td></tr>
    <tr><td>Framework</td><td>une chaîne de montage où tu viens te brancher</td><td>FastAPI</td></tr>
    <tr><td>API</td><td>le menu d’un restaurant : ce que tu peux commander et comment</td><td><code>unitFactor(unit)</code>, <code>POST /api/ai</code></td></tr>
    <tr><td>Moteur</td><td>le moteur d’une voiture : invisible, il fait tout avancer</td><td><code>web/engine/</code>, V8</td></tr>
    <tr><td>Dépendance</td><td>un fournisseur sans qui la production s’arrête</td><td><code>three</code> dans <code>package.json</code></td></tr>
    <tr><td>Version</td><td>l’indice de révision d’un plan (A, B, C…)</td><td><code>three 0.180.0</code></td></tr>
    <tr><td>Compiler</td><td>traduire tout un livre avant de le publier</td><td>OpenCascade C++ → wasm</td></tr>
    <tr><td>Interpréter</td><td>un interprète qui traduit phrase par phrase en direct</td><td>Python, JavaScript</td></tr>
    <tr><td>Build</td><td>préparer la palette avant l’expédition</td><td><code>npm run build</code> → <code>dist/</code></td></tr>
  </tbody>
</table>

<h3>Lire un numéro de version</h3>
~~~text
   1 . 56 . 1
   |    |   +-- correctif : on a réparé un bug, rien ne change pour toi
   |    +------ mineure   : nouvelles fonctions, l'ancien marche encore
   +----------- majeure   : changements qui peuvent tout casser
~~~
<p>Comme l’indice d’un plan : passer de l’indice B à C peut changer une cote ; passer d’une famille de pièce à une autre (la majeure) change tout.</p>

<h3>Erreurs classiques</h3>
<ul>
  <li>Confondre <strong>API</strong> et <strong>application</strong> : l’API est la porte d’entrée, pas le bâtiment.</li>
  <li>Croire qu’une bibliothèque « s’installe sur l’ordinateur » comme un logiciel : en JavaScript elle va dans le dossier <code>node_modules/</code> du projet, avec <code>npm install</code>.</li>
  <li>Penser que compilé = mieux : c’est plus rapide, mais plus long à préparer et moins souple.</li>
</ul>
`,
        en: `
<h3>Put differently: the vocabulary in pictures</h3>
<table>
  <thead><tr><th>Word</th><th>Everyday image</th><th>3D Reader example</th></tr></thead>
  <tbody>
    <tr><td>Library</td><td>a borrowed toolbox</td><td>three.js, OpenCascade</td></tr>
    <tr><td>Framework</td><td>an assembly line you plug yourself into</td><td>FastAPI</td></tr>
    <tr><td>API</td><td>a restaurant menu: what you can order and how</td><td><code>unitFactor(unit)</code>, <code>POST /api/ai</code></td></tr>
    <tr><td>Engine</td><td>a car engine: invisible, it moves everything</td><td><code>web/engine/</code>, V8</td></tr>
    <tr><td>Dependency</td><td>a supplier without whom production stops</td><td><code>three</code> in <code>package.json</code></td></tr>
    <tr><td>Version</td><td>the revision letter of a drawing (A, B, C…)</td><td><code>three 0.180.0</code></td></tr>
    <tr><td>Compile</td><td>translating a whole book before publishing it</td><td>OpenCascade C++ → wasm</td></tr>
    <tr><td>Interpret</td><td>an interpreter translating sentence by sentence, live</td><td>Python, JavaScript</td></tr>
    <tr><td>Build</td><td>preparing the pallet before shipping</td><td><code>npm run build</code> → <code>dist/</code></td></tr>
  </tbody>
</table>

<h3>Reading a version number</h3>
~~~text
   1 . 56 . 1
   |    |   +-- patch : a bug was fixed, nothing changes for you
   |    +------ minor : new functions, the old ones still work
   +----------- major : changes that may break everything
~~~
<p>Like a drawing revision: going from revision B to C may change a dimension; going from one part family to another (the major) changes everything.</p>

<h3>Classic mistakes</h3>
<ul>
  <li>Mixing up <strong>API</strong> and <strong>application</strong>: the API is the front door, not the building.</li>
  <li>Believing a library “installs on the computer” like software: in JavaScript it goes into the project’s <code>node_modules/</code> folder, with <code>npm install</code>.</li>
  <li>Thinking compiled = better: it is faster, but longer to prepare and less flexible.</li>
</ul>
`,
      },
    },
  ],
  questions: [
    // ---------------------------------------------------------- lesson start-1
    {
      id: 'start-q1', skill: 'start.app', lesson: 'start-1', level: 1, type: 'mcq',
      prompt: { fr: 'Qu’est-ce qu’un fichier source ?', en: 'What is a source file?' },
      choices: {
        fr: ['Un fichier texte contenant des instructions dans un langage de programmation', 'Un fichier binaire illisible', 'Le fichier STEP de la pièce', 'Une image de l’interface'],
        en: ['A text file containing instructions in a programming language', 'An unreadable binary file', 'The STEP file of the part', 'A picture of the interface'],
      },
      answer: 0,
      explain: {
        fr: 'Un fichier source est du simple texte (<code>.js</code>, <code>.py</code>, <code>.cpp</code>…) qu’un moteur lit ou traduit. Tu peux l’ouvrir avec le Bloc-notes.',
        en: 'A source file is plain text (<code>.js</code>, <code>.py</code>, <code>.cpp</code>…) that an engine reads or translates. You can open it with Notepad.',
      },
    },
    {
      id: 'start-q2', skill: 'start.app', lesson: 'start-1', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque langage du navigateur à son rôle.', en: 'Match each browser language with its role.' },
      pairs: {
        fr: [['HTML', 'le squelette de la page'], ['CSS', 'l’habillage (couleurs, disposition)'], ['JavaScript', 'le comportement (réagir aux clics)'], ['WebAssembly', 'du code compilé très rapide (ex. C++)']],
        en: [['HTML', 'the skeleton of the page'], ['CSS', 'the look (colours, layout)'], ['JavaScript', 'the behaviour (reacting to clicks)'], ['WebAssembly', 'very fast compiled code (e.g. C++)']],
      },
      explain: {
        fr: 'HTML structure, CSS décore, JavaScript agit. WebAssembly permet d’exécuter du code compilé, comme OpenCascade, dans la page.',
        en: 'HTML structures, CSS decorates, JavaScript acts. WebAssembly lets the page run compiled code, such as OpenCascade.',
      },
    },
    {
      id: 'start-q3', skill: 'start.app', lesson: 'start-1', level: 2, type: 'tf',
      prompt: { fr: 'Sur GitHub Pages, le fichier STEP est envoyé à un serveur qui calcule le volume.', en: 'On GitHub Pages, the STEP file is sent to a server that computes the volume.' },
      answer: false,
      explain: {
        fr: 'Faux : GitHub Pages ne fait qu’héberger des fichiers. Le calcul tourne dans ton navigateur (Worker + OpenCascade en WebAssembly) ; le fichier ne quitte pas ton ordinateur.',
        en: 'False: GitHub Pages only hosts files. The computation runs in your browser (Worker + OpenCascade as WebAssembly); the file never leaves your computer.',
      },
    },
    {
      id: 'start-q4', skill: 'start.app', lesson: 'start-1', level: 1, type: 'mcq',
      prompt: { fr: 'Le <em>back-end</em>, c’est…', en: 'The <em>back end</em> is…' },
      choices: {
        fr: ['ce qui tourne sur un serveur distant', 'la partie arrière de l’écran', 'le CSS', 'le dernier fichier du projet'],
        en: ['what runs on a remote server', 'the back of the screen', 'the CSS', 'the last file of the project'],
      },
      answer: 0,
      explain: {
        fr: 'Front-end = chez l’utilisateur (navigateur) ; back-end = sur un serveur. Dans 3D Reader, le back-end se limite au serveur Python optionnel et à la passerelle IA Vercel.',
        en: 'Front end = on the user’s side (browser); back end = on a server. In 3D Reader the back end is just the optional Python server and the Vercel AI gateway.',
      },
    },
    // ---------------------------------------------------------- lesson start-2
    {
      id: 'start-q5', skill: 'start.map', lesson: 'start-2', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque fichier à son rôle dans 3D Reader.', en: 'Match each file with its role in 3D Reader.' },
      pairs: {
        fr: [['web/app.js', 'l’interface et la vue 3D'], ['web/engine/worker.js', 'les calculs en arrière-plan'], ['api/ai.js', 'la passerelle IA sur Vercel'], ['.github/workflows/ci.yml', 'les tests automatiques sur GitHub'], ['reader3d/', 'le moteur Python de référence']],
        en: [['web/app.js', 'the interface and the 3D view'], ['web/engine/worker.js', 'background computations'], ['api/ai.js', 'the AI gateway on Vercel'], ['.github/workflows/ci.yml', 'automatic tests on GitHub'], ['reader3d/', 'the reference Python engine']],
      },
      explain: {
        fr: 'Chaque dossier est un atelier : l’interface (<code>app.js</code>), le calcul (<code>web/engine</code>), l’IA (<code>api</code>), la qualité (<code>.github/workflows</code>, <code>tests</code>), la référence (<code>reader3d</code>).',
        en: 'Each folder is a workshop: the interface (<code>app.js</code>), computation (<code>web/engine</code>), AI (<code>api</code>), quality (<code>.github/workflows</code>, <code>tests</code>), the reference (<code>reader3d</code>).',
      },
    },
    {
      id: 'start-q6', skill: 'start.map', lesson: 'start-2', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre le voyage d’un fichier STEP.', en: 'Put the journey of a STEP file in order.' },
      items: {
        fr: ['La page (app.js) reçoit le fichier', 'client.js envoie un message au Worker', 'Le Worker fait calculer OpenCascade (WebAssembly)', 'Le Worker renvoie le résultat par message', 'three.js affiche la pièce'],
        en: ['The page (app.js) receives the file', 'client.js sends a message to the Worker', 'The Worker has OpenCascade (WebAssembly) compute', 'The Worker sends the result back by message', 'three.js displays the part'],
      },
      explain: {
        fr: 'Page → client → Worker → OpenCascade → Worker → client → page → affichage. Les allers-retours se font par messages (<code>postMessage</code>).',
        en: 'Page → client → Worker → OpenCascade → Worker → client → page → display. The round trips are messages (<code>postMessage</code>).',
      },
    },
    {
      id: 'start-q7', skill: 'start.map', lesson: 'start-2', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi les calculs lourds tournent-ils dans un Web Worker ?', en: 'Why do heavy computations run in a Web Worker?' },
      choices: {
        fr: ['Pour que l’interface ne gèle pas pendant le calcul', 'Parce que le Worker est sur un serveur', 'Pour que les calculs soient exacts', 'Parce que three.js l’exige'],
        en: ['So the interface does not freeze during the computation', 'Because the Worker is on a server', 'So the computations are exact', 'Because three.js requires it'],
      },
      answer: 0,
      explain: {
        fr: 'Le Worker est un second fil d’exécution <em>dans ton navigateur</em>. Le fil principal reste libre pour l’interface (boutons, rotation de la vue).',
        en: 'The Worker is a second thread <em>in your browser</em>. The main thread stays free for the interface (buttons, rotating the view).',
      },
    },
    {
      id: 'start-q8', skill: 'start.map', lesson: 'start-2', level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne où le Worker <strong>répond</strong> à la page.', en: 'Click the line where the Worker <strong>answers</strong> the page.' },
      code: "self.onmessage = async (event) => {\n  const msg = event.data;\n  if (msg.type === 'preload') {\n    await occt();\n    postMessage({ type: 'ready', engine: 'cad' });\n    return;\n  }",
      lang: 'js',
      answer: 4,
      explain: {
        fr: '<code>postMessage(...)</code> envoie un message au fil principal. <code>onmessage</code>, à l’inverse, <em>reçoit</em> les messages.',
        en: '<code>postMessage(...)</code> sends a message to the main thread. <code>onmessage</code>, conversely, <em>receives</em> messages.',
      },
    },
    // ---------------------------------------------------------- lesson start-3
    {
      id: 'start-q9', skill: 'start.reading', lesson: 'start-3', level: 1, type: 'mcq',
      prompt: { fr: 'Par quoi commencer pour comprendre un fichier inconnu ?', en: 'What should you start with to understand an unknown file?' },
      choices: {
        fr: ['Le commentaire en tête et les noms des fonctions', 'La ligne la plus longue', 'La dernière ligne', 'Tout lire dans l’ordre sans s’arrêter'],
        en: ['The header comment and the function names', 'The longest line', 'The last line', 'Read everything in order without stopping'],
      },
      answer: 0,
      explain: {
        fr: 'Comme le cartouche d’un plan : le commentaire d’en-tête et les noms donnent le rôle général avant les détails.',
        en: 'Like a drawing’s title block: the header comment and the names give the overall role before the details.',
      },
    },
    {
      id: 'start-q10', skill: 'start.reading', lesson: 'start-3', level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui donne la <strong>sortie</strong> de la fonction.', en: 'Click the line that gives the <strong>output</strong> of the function.' },
      code: "export function unitFactor(unit) {\n  if (!Object.prototype.hasOwnProperty.call(UNITS, unit)) {\n    throw new Error(`Unknown unit '${unit}'`);\n  }\n  return UNITS[unit];\n}",
      lang: 'js',
      answer: 4,
      explain: {
        fr: 'La sortie suit <code>return</code>. La ligne <code>throw</code> est la sortie « en cas de problème » : une erreur, pas un résultat.',
        en: 'The output follows <code>return</code>. The <code>throw</code> line is the “something went wrong” exit: an error, not a result.',
      },
    },
    {
      id: 'start-q11', skill: 'start.reading', lesson: 'start-3', level: 1, type: 'fill',
      prompt: { fr: 'En JavaScript et en C++, un commentaire sur une ligne commence par quels deux caractères ?', en: 'In JavaScript and C++, a one-line comment starts with which two characters?' },
      accept: ['//'],
      explain: {
        fr: '<code>//</code> en JS et C++, <code>#</code> en Python. Tout ce qui suit sur la ligne est ignoré par la machine.',
        en: '<code>//</code> in JS and C++, <code>#</code> in Python. Everything after it on the line is ignored by the machine.',
      },
    },
    {
      id: 'start-q12', skill: 'start.reading', lesson: 'start-3', level: 2, type: 'mcq',
      prompt: { fr: 'Tu lis <code>summarize(bodies)</code> dans <code>client.js</code>. Comment savoir où est défini <code>summarize</code> ?', en: 'You read <code>summarize(bodies)</code> in <code>client.js</code>. How do you find where <code>summarize</code> is defined?' },
      choices: {
        fr: ['Regarder la ligne <code>import { summarize } from \'./summary.js\'</code> en haut du fichier', 'Deviner', 'Relire tout <code>app.js</code>', 'Ce n’est défini nulle part'],
        en: ['Look at the line <code>import { summarize } from \'./summary.js\'</code> at the top of the file', 'Guess', 'Re-read all of <code>app.js</code>', 'It is defined nowhere'],
      },
      answer: 0,
      explain: {
        fr: 'Les <code>import</code> sont des renvois « voir fichier … ». Ici, la définition est dans <code>web/engine/summary.js</code>.',
        en: '<code>import</code>s are “see file …” references. Here the definition is in <code>web/engine/summary.js</code>.',
      },
    },
    // ---------------------------------------------------------- lesson start-4
    {
      id: 'start-q13', skill: 'start.vocab', lesson: 'start-4', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque mot à sa définition.', en: 'Match each word with its definition.' },
      pairs: {
        fr: [['Bibliothèque', 'du code prêt à l’emploi que tu appelles'], ['Framework', 'un cadre qui t’appelle et impose une organisation'], ['API', 'le mode d’emploi pour parler à un programme'], ['Dépendance', 'une bibliothèque dont le projet a besoin']],
        en: [['Library', 'ready-made code that you call'], ['Framework', 'a structure that calls you and imposes an organisation'], ['API', 'the user manual to talk to a program'], ['Dependency', 'a library the project needs']],
      },
      explain: {
        fr: 'Bibliothèque = caisse à outils ; framework = chaîne de montage ; API = menu du restaurant ; dépendance = fournisseur indispensable.',
        en: 'Library = toolbox; framework = assembly line; API = restaurant menu; dependency = essential supplier.',
      },
    },
    {
      id: 'start-q14', skill: 'start.vocab', lesson: 'start-4', level: 2, type: 'mcq',
      prompt: { fr: 'Dans la version <code>0.180.0</code> de three.js, que représente <code>180</code> ?', en: 'In version <code>0.180.0</code> of three.js, what does <code>180</code> stand for?' },
      choices: {
        fr: ['La version mineure', 'La version majeure', 'Le correctif', 'L’année de sortie'],
        en: ['The minor version', 'The major version', 'The patch', 'The release year'],
      },
      answer: 0,
      explain: {
        fr: 'Format <em>majeure.mineure.correctif</em> : 0 = majeure, 180 = mineure, 0 = correctif.',
        en: 'Format <em>major.minor.patch</em>: 0 = major, 180 = minor, 0 = patch.',
      },
    },
    {
      id: 'start-q15', skill: 'start.vocab', lesson: 'start-4', level: 2, type: 'tf',
      prompt: { fr: 'Le C++ d’OpenCascade est compilé à l’avance (en WebAssembly), alors que le JavaScript de 3D Reader est lu par le moteur du navigateur au chargement.', en: 'OpenCascade’s C++ is compiled in advance (to WebAssembly), whereas 3D Reader’s JavaScript is read by the browser engine when it loads.' },
      answer: true,
      explain: {
        fr: 'Vrai. Le C++ est traduit une fois pour toutes ; le JavaScript est livré en texte et le moteur V8 le compile « juste à temps ».',
        en: 'True. The C++ is translated once and for all; the JavaScript is shipped as text and the V8 engine compiles it “just in time”.',
      },
    },
    {
      id: 'start-q16', skill: 'start.vocab', lesson: 'start-4', level: 1, type: 'mcq',
      prompt: { fr: 'Dans quel fichier sont listées les dépendances JavaScript de 3D Reader ?', en: 'In which file are 3D Reader’s JavaScript dependencies listed?' },
      choices: {
        fr: ['package.json', 'requirements.txt', 'index.html', 'README.md'],
        en: ['package.json', 'requirements.txt', 'index.html', 'README.md'],
      },
      answer: 0,
      explain: {
        fr: '<code>package.json</code> pour JavaScript (npm), <code>requirements.txt</code> pour Python (pip).',
        en: '<code>package.json</code> for JavaScript (npm), <code>requirements.txt</code> for Python (pip).',
      },
    },
    // ---------------------------------------------------------- extra: start.app
    {
      id: 'start-q17', skill: 'start.app', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Dans l’analogie du restaurant, le navigateur de l’utilisateur est…', en: 'In the restaurant analogy, the user’s browser is…' },
      choices: {
        fr: ['la salle, où le client voit et touche', 'la cuisine cachée', 'le fournisseur de légumes', 'la facture'],
        en: ['the dining room, where the customer sees and touches', 'the hidden kitchen', 'the vegetable supplier', 'the bill'],
      },
      answer: 0,
      explain: {
        fr: 'La salle = front-end (le navigateur). La cuisine = back-end (le serveur). Dans 3D Reader, c’est même la salle qui cuisine !',
        en: 'Dining room = front end (the browser). Kitchen = back end (the server). In 3D Reader, the dining room even does the cooking!',
      },
    },
    {
      id: 'start-q18', skill: 'start.app', extra: true, level: 2, type: 'multi',
      prompt: { fr: 'Quels fichiers le navigateur télécharge-t-il pour afficher 3D Reader ? (plusieurs réponses)', en: 'Which files does the browser download to show 3D Reader? (several answers)' },
      choices: {
        fr: ['index.html', 'style.css', 'app.js', 'reader3d/server.py'],
        en: ['index.html', 'style.css', 'app.js', 'reader3d/server.py'],
      },
      answer: [0, 1, 2],
      explain: {
        fr: 'Le navigateur lit HTML, CSS et JavaScript. <code>server.py</code> est du Python : il tourne sur un serveur, jamais dans le navigateur.',
        en: 'The browser reads HTML, CSS and JavaScript. <code>server.py</code> is Python: it runs on a server, never in the browser.',
      },
    },
    {
      id: 'start-q19', skill: 'start.app', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi le calcul dans le navigateur est-il un atout pour une fonderie ?', en: 'Why is computing in the browser an advantage for a foundry?' },
      choices: {
        fr: ['Les plans des clients ne quittent pas l’ordinateur', 'C’est toujours plus rapide qu’un serveur', 'Cela évite d’écrire du code', 'Le navigateur corrige les erreurs de CAO'],
        en: ['Customer drawings never leave the computer', 'It is always faster than a server', 'It avoids writing code', 'The browser fixes CAD errors'],
      },
      answer: 0,
      explain: {
        fr: 'Confidentialité : le fichier STEP d’un client reste sur le poste. Ce n’est pas forcément plus rapide, mais rien n’est téléversé.',
        en: 'Confidentiality: a customer’s STEP file stays on the computer. It is not necessarily faster, but nothing is uploaded.',
      },
    },
    // ---------------------------------------------------------- extra: start.map
    {
      id: 'start-q20', skill: 'start.map', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Où est gardée la clé de l’API Groq ?', en: 'Where is the Groq API key kept?' },
      choices: {
        fr: ['Dans les variables d’environnement de Vercel', 'Dans app.js', 'Dans index.html', 'Dans le README'],
        en: ['In Vercel’s environment variables', 'In app.js', 'In index.html', 'In the README'],
      },
      answer: 0,
      explain: {
        fr: 'Tout ce qui est dans la page est visible par n’importe qui. La clé reste côté serveur, dans Vercel ; <code>api/ai.js</code> la lit et relaie les questions.',
        en: 'Anything in the page is visible to anyone. The key stays server side, in Vercel; <code>api/ai.js</code> reads it and relays the questions.',
      },
    },
    {
      id: 'start-q21', skill: 'start.map', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'GitHub Pages publie le site seulement si la CI de <code>main</code> est passée au vert.', en: 'GitHub Pages publishes the site only if the CI of <code>main</code> passed (green).' },
      answer: true,
      explain: {
        fr: 'Vrai : <code>pages.yml</code> se déclenche après <code>ci.yml</code> et ne publie qu’un commit dont les tests sont verts.',
        en: 'True: <code>pages.yml</code> runs after <code>ci.yml</code> and only publishes a commit whose tests are green.',
      },
    },
    {
      id: 'start-q22', skill: 'start.map', extra: true, level: 3, type: 'match',
      prompt: { fr: 'Associe chaque acteur de la fonderie à son équivalent 3D Reader.', en: 'Match each foundry player with its 3D Reader equivalent.' },
      pairs: {
        fr: [['L’accueil', 'app.js'], ['L’atelier séparé', 'worker.js'], ['La machine du fournisseur', 'OpenCascade'], ['Le contrôle qualité', 'les tests et la CI'], ['Le quai d’expédition', 'GitHub Pages']],
        en: [['Reception', 'app.js'], ['The separate workshop', 'worker.js'], ['The supplier’s machine', 'OpenCascade'], ['Quality control', 'the tests and the CI'], ['The shipping dock', 'GitHub Pages']],
      },
      explain: {
        fr: 'Garder cette carte en tête aide à savoir dans quel fichier chercher quand quelque chose ne va pas.',
        en: 'Keeping this map in mind helps you know which file to look in when something goes wrong.',
      },
    },
    // ---------------------------------------------------------- extra: start.reading
    {
      id: 'start-q23', skill: 'start.reading', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Sur GitHub, quelle touche ouvre la recherche de fichier par nom ?', en: 'On GitHub, which key opens the find-file-by-name search?' },
      choices: { fr: ['T', 'F5', 'Échap', 'Q'], en: ['T', 'F5', 'Esc', 'Q'] },
      answer: 0,
      explain: {
        fr: 'Dans un dépôt GitHub, <kbd>T</kbd> lance le « file finder » ; <kbd>/</kbd> place le curseur dans la recherche.',
        en: 'In a GitHub repository, <kbd>T</kbd> opens the file finder; <kbd>/</kbd> puts the cursor in search.',
      },
    },
    {
      id: 'start-q24', skill: 'start.reading', extra: true, level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre les trois passes de lecture d’une fonction.', en: 'Put the three reading passes of a function in order.' },
      items: {
        fr: ['Le titre : nom et commentaire', 'Le squelette : if, boucles, return', 'Les détails des calculs, si nécessaire'],
        en: ['The title: name and comment', 'The skeleton: ifs, loops, return', 'The details of the computations, if needed'],
      },
      explain: {
        fr: 'Du général au particulier, comme pour un plan : cartouche, vues, cotes.',
        en: 'From general to particular, as with a drawing: title block, views, dimensions.',
      },
    },
    {
      id: 'start-q25', skill: 'start.reading', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que fait cette fonction, en une phrase ?', en: 'What does this function do, in one sentence?' },
      code: "/** Factor to millimetres of a user-selected unit. */\nexport function unitFactor(unit) {\n  if (!(unit in UNITS)) throw new Error('Unknown unit');\n  return UNITS[unit];\n}",
      lang: 'js',
      choices: {
        fr: ['Elle donne le facteur de conversion d’une unité vers les millimètres', 'Elle affiche la pièce', 'Elle convertit un fichier STEP en STL', 'Elle supprime une unité'],
        en: ['It gives the conversion factor from a unit to millimetres', 'It displays the part', 'It converts a STEP file to STL', 'It deletes a unit'],
      },
      answer: 0,
      explain: {
        fr: 'Le commentaire <code>/** … */</code> et le nom suffisent presque : facteur (<em>factor</em>) vers les millimètres. Pas besoin de tout décortiquer.',
        en: 'The <code>/** … */</code> comment and the name almost suffice: factor to millimetres. No need to dissect everything.',
      },
    },
    // ---------------------------------------------------------- extra: start.vocab
    {
      id: 'start-q26', skill: 'start.vocab', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Java et JavaScript sont le même langage.', en: 'Java and JavaScript are the same language.' },
      answer: false,
      explain: {
        fr: 'Faux : deux langages différents. Le nom « JavaScript » est un choix marketing des années 1990.',
        en: 'False: two different languages. The name “JavaScript” was a 1990s marketing choice.',
      },
    },
    {
      id: 'start-q27', skill: 'start.vocab', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Dans <code>"playwright": "^1.56.1"</code>, que signifie le <code>^</code> ?', en: 'In <code>"playwright": "^1.56.1"</code>, what does the <code>^</code> mean?' },
      choices: {
        fr: ['1.56.1 ou plus récent, sans changer de version majeure', 'Exactement 1.56.1', 'N’importe quelle version', 'Une version bêta'],
        en: ['1.56.1 or newer, without changing the major version', 'Exactly 1.56.1', 'Any version', 'A beta version'],
      },
      answer: 0,
      explain: {
        fr: 'Le <code>^</code> autorise les mises à jour mineures et correctifs. Sans symbole (comme <code>"three": "0.180.0"</code>), la version est figée.',
        en: 'The <code>^</code> allows minor and patch updates. With no symbol (like <code>"three": "0.180.0"</code>), the version is pinned.',
      },
    },
    {
      id: 'start-q28', skill: 'start.vocab', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Quelle commande npm prépare le site (dossier <code>dist/</code>) avant publication ? (écris la commande complète)', en: 'Which npm command prepares the site (<code>dist/</code> folder) before publishing? (write the full command)' },
      accept: ['npm run build'],
      explain: {
        fr: '<code>npm run build</code> exécute le script <code>build</code> de <code>package.json</code>, soit <code>node scripts/build-web.mjs</code>.',
        en: '<code>npm run build</code> runs the <code>build</code> script of <code>package.json</code>, i.e. <code>node scripts/build-web.mjs</code>.',
      },
    },
    // ---------------------------------------------------------- exam
    {
      id: 'start-q29', skill: 'start.app', level: 2, type: 'mcq',
      prompt: { fr: 'Quelle partie de 3D Reader fait partie du back-end ?', en: 'Which part of 3D Reader belongs to the back end?' },
      choices: {
        fr: ['api/ai.js, exécuté sur Vercel', 'web/app.js', 'web/style.css', 'web/engine/worker.js'],
        en: ['api/ai.js, running on Vercel', 'web/app.js', 'web/style.css', 'web/engine/worker.js'],
      },
      answer: 0,
      explain: {
        fr: '<code>api/ai.js</code> est une fonction serveur (Node sur Vercel). Le Worker, lui, tourne dans le navigateur : c’est du front-end.',
        en: '<code>api/ai.js</code> is a server function (Node on Vercel). The Worker runs in the browser: it is front end.',
      },
    },
    {
      id: 'start-q30', skill: 'start.map', level: 2, type: 'mcq',
      prompt: { fr: 'Quel est le rôle du moteur Python <code>reader3d/</code> ?', en: 'What is the role of the Python engine <code>reader3d/</code>?' },
      choices: {
        fr: ['Servir de référence : le moteur JS doit retrouver ses résultats', 'Afficher la vue 3D', 'Publier le site', 'Stocker la clé Groq'],
        en: ['Be the reference: the JS engine must reproduce its results', 'Display the 3D view', 'Publish the site', 'Store the Groq key'],
      },
      answer: 0,
      explain: {
        fr: 'Le moteur Python est la référence ; <code>tests/make_fixtures.py</code> produit ses résultats et les tests JS comparent.',
        en: 'The Python engine is the reference; <code>tests/make_fixtures.py</code> produces its results and the JS tests compare.',
      },
    },
    {
      id: 'start-q31', skill: 'start.map', level: 3, type: 'multi',
      prompt: { fr: 'Lesquels de ces services sont <strong>extérieurs</strong> au navigateur ? (plusieurs réponses)', en: 'Which of these services are <strong>outside</strong> the browser? (several answers)' },
      choices: {
        fr: ['GitHub Actions', 'Vercel', 'Groq', 'Le Web Worker'],
        en: ['GitHub Actions', 'Vercel', 'Groq', 'The Web Worker'],
      },
      answer: [0, 1, 2],
      explain: {
        fr: 'GitHub Actions (CI), Vercel (passerelle) et Groq (modèle IA) sont des services distants. Le Worker est un fil du navigateur.',
        en: 'GitHub Actions (CI), Vercel (gateway) and Groq (AI model) are remote services. The Worker is a browser thread.',
      },
    },
    {
      id: 'start-q32', skill: 'start.reading', level: 2, type: 'tf',
      prompt: { fr: 'Pour comprendre ce que fait une fonction, il faut obligatoirement comprendre chaque ligne.', en: 'To understand what a function does, you must understand every single line.' },
      answer: false,
      explain: {
        fr: 'Faux : nom, commentaire, entrées et sortie suffisent souvent. On creuse les détails seulement quand c’est utile.',
        en: 'False: name, comment, inputs and output are often enough. You dig into details only when useful.',
      },
    },
    {
      id: 'start-q33', skill: 'start.reading', level: 3, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui indique <strong>dans quel fichier</strong> se trouve <code>largestBody</code>.', en: 'Click the line that says <strong>which file</strong> <code>largestBody</code> lives in.' },
      code: "import * as THREE from \"three\";\nimport { applyToPage, language, t } from \"./i18n.js\";\nimport { largestBody, summarize } from \"./engine/summary.js\";\nimport { buildSemantic3D } from \"./engine/semantic.js\";",
      lang: 'js',
      answer: 2,
      explain: {
        fr: '<code>largestBody</code> est importé de <code>./engine/summary.js</code> : c’est là qu’il faut aller lire sa définition.',
        en: '<code>largestBody</code> is imported from <code>./engine/summary.js</code>: that is where to read its definition.',
      },
    },
    {
      id: 'start-q34', skill: 'start.vocab', level: 2, type: 'mcq',
      prompt: { fr: 'FastAPI, dans <code>reader3d/server.py</code>, est plutôt…', en: 'FastAPI, in <code>reader3d/server.py</code>, is rather…' },
      choices: {
        fr: ['un framework : il appelle tes fonctions quand une requête arrive', 'une base de données', 'un format de fichier 3D', 'un navigateur'],
        en: ['a framework: it calls your functions when a request arrives', 'a database', 'a 3D file format', 'a browser'],
      },
      answer: 0,
      explain: {
        fr: 'Un framework inverse le contrôle : tu déclares « pour telle adresse, cette fonction », et c’est lui qui l’appelle.',
        en: 'A framework inverts control: you declare “for this address, this function”, and it is the one calling it.',
      },
    },
    {
      id: 'start-q35', skill: 'start.vocab', level: 1, type: 'match',
      prompt: { fr: 'Associe le terme à l’image.', en: 'Match the term with the image.' },
      pairs: {
        fr: [['Compiler', 'traduire tout le livre avant de le publier'], ['Interpréter', 'traduire phrase par phrase en direct'], ['Build', 'préparer la palette avant expédition']],
        en: [['Compile', 'translate the whole book before publishing it'], ['Interpret', 'translate sentence by sentence, live'], ['Build', 'prepare the pallet before shipping']],
      },
      explain: {
        fr: 'Compiler = à l’avance ; interpréter = au fil de l’eau ; build = assembler le livrable.',
        en: 'Compile = in advance; interpret = as you go; build = assemble the deliverable.',
      },
    },
    {
      id: 'start-q36', skill: 'start.app', level: 1, type: 'fill',
      prompt: { fr: 'Quelle extension de fichier utilise Python ? (avec le point)', en: 'Which file extension does Python use? (with the dot)' },
      accept: ['.py'],
      explain: {
        fr: '<code>.py</code> pour Python, <code>.js</code>/<code>.mjs</code> pour JavaScript, <code>.cpp</code>/<code>.h</code> pour C++.',
        en: '<code>.py</code> for Python, <code>.js</code>/<code>.mjs</code> for JavaScript, <code>.cpp</code>/<code>.h</code> for C++.',
      },
    },
  ],
};
