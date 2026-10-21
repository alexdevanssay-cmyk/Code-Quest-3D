// Module « Lire du JavaScript moderne » — formation 3D Reader.
// Format : formation/CONTENT_SPEC.md. Extraits : dépôt public alexdevanssay-cmyk/3D-reader.

const L1 = {
  id: 'js-1',
  title: { fr: 'La syntaxe de base : const, let, fonctions et gabarits', en: 'Basic syntax: const, let, functions and templates' },
  skills: ['js.syntax'],
  minutes: 10,
  body: {
    fr: `
<h3>Bienvenue dans la langue du navigateur</h3>
<p>JavaScript (souvent abrégé <strong>JS</strong>) est le seul langage que tous les navigateurs comprennent nativement. Toute la page de 3D Reader — les boutons, la vue 3D, le chiffrage — est écrite en JS. Bonne nouvelle : si tu connais un peu de Python ou de C++, tu as déjà 70 % des réflexes. Il reste à apprendre les <em>mots</em> et la <em>ponctuation</em> propres à JS.</p>

<h3>1. Ranger une valeur : <code>const</code>, <code>let</code> (et l'ancien <code>var</code>)</h3>
<p>Une <span class="term" data-term="variable">variable</span> est une boîte étiquetée. En JS on la déclare avec un mot-clé :</p>
<ul>
  <li><code>const</code> : la boîte est <strong>scellée</strong>, on ne peut plus la réassigner. C'est le choix par défaut dans 3D Reader.</li>
  <li><code>let</code> : la boîte peut recevoir une nouvelle valeur plus tard (compteurs, état qui change).</li>
  <li><code>var</code> : l'ancienne façon (avant 2015). Elle a des règles de portée bizarres ; on ne l'écrit plus, mais tu la croiseras dans du vieux code.</li>
</ul>
~~~js title="web/engine/client.js"
let worker = null;              //«1»
let nextId = 1;                 //«2»
const pending = new Map();      //«3»
export const CAD_EXTENSIONS = ['.step', '.stp', '.p21', '.iges', '.igs', '.brep', '.brp']; //«4»
~~~
<ol class="notes">
  <li><code>let</code> car le worker (le moteur de calcul en arrière-plan) sera créé plus tard, puis éventuellement redémarré : la valeur change.</li>
  <li>Un compteur qui augmente à chaque demande : forcément <code>let</code>.</li>
  <li><code>const</code> : on garde toujours <em>la même</em> table, même si on y ajoute des éléments. <code>const</code> interdit de changer d'étiquette, pas de modifier le contenu !</li>
  <li>Une liste fixe d'extensions de fichiers CAO, partagée avec les autres fichiers (<code>export</code>, voir leçon 4).</li>
</ol>
<div class="callout warn"><strong>Piège classique :</strong> <code>const t = [1, 2]; t.push(3);</code> fonctionne ! <code>const</code> protège la variable, pas l'intérieur du tableau.</div>

<h3>2. Les fonctions : classiques et fléchées</h3>
<p>Une <span class="term" data-term="fonction">fonction</span> est une recette réutilisable. JS propose deux écritures principales :</p>
<div class="compare">
~~~py title="Python"
def extension_of(name):
    i = name.rfind('.')
    return '' if i < 0 else name[i:].lower()
~~~
~~~js title="JS : function"
function extensionOf(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
}
~~~
~~~js title="JS : fléchée"
const extensionOf = (name) => {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
};
~~~
</div>
<p>La fonction <code>extensionOf</code> existe vraiment dans <code>client.js</code>. La forme <strong>fléchée</strong> <code>(x) =&gt; …</code> est très utilisée pour les petites fonctions passées en paramètre. Si le corps tient en une expression, on peut même supprimer les accolades et le <code>return</code> :</p>
~~~js title="web/engine/worker.js"
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
~~~
<p>Ici <code>heapSize</code> est une fonction sans paramètre <code>()</code> qui <em>renvoie directement</em> la taille de la mémoire du moteur OpenCascade. (Les signes <code>?.</code> et <code>??</code> sont expliqués en leçon 3.)</p>

<h3>3. Les chaînes gabarits (template strings)</h3>
<p>Avec les accents graves <kbd>\`</kbd> (AltGr+7 sur un clavier français), on insère des valeurs dans un texte avec <code>\${…}</code>, comme les f-strings de Python :</p>
~~~js run
const fichier = 'carter.step';
const volume = 1234.5678;
console.log(\`Le volume de \${fichier} est \${volume.toFixed(1)} mm³\`);
// En Python : f"Le volume de {fichier} est {volume:.1f} mm³"
~~~

<h3>4. Les commentaires et la JSDoc</h3>
<p><code>//</code> commente la fin d'une ligne, <code>/* … */</code> un bloc. Les blocs qui commencent par <code>/**</code> sont de la <strong>JSDoc</strong> : une documentation que l'éditeur (VS Code) affiche au survol de la fonction.</p>
~~~js title="web/engine/client.js"
/** Called with {heap, heap_max} (bytes) whenever the worker reports its memory. */
export function onMemory(fn) {
  memoryListeners.add(fn);
}
~~~
<div class="callout tip"><strong>Méthode de lecture :</strong> dans 3D Reader, lis toujours le commentaire <code>/** … */</code> au-dessus d'une fonction avant son code. Il dit <em>ce qu'elle fait</em> ; le code dit <em>comment</em>.</div>
<div class="callout project">Les points-virgules <code>;</code> terminent les instructions. JS sait souvent les deviner, mais 3D Reader les écrit partout : c'est plus sûr.</div>
`,
    en: `
<h3>Welcome to the browser's language</h3>
<p>JavaScript (<strong>JS</strong>) is the only language every browser understands natively. The whole 3D Reader page — the buttons, the 3D view, the costing — is written in JS. Good news: if you know a little Python or C++, you already have 70% of the reflexes. What is left is learning JS's own <em>words</em> and <em>punctuation</em>.</p>

<h3>1. Storing a value: <code>const</code>, <code>let</code> (and the old <code>var</code>)</h3>
<p>A <span class="term" data-term="variable">variable</span> is a labelled box. In JS you declare it with a keyword:</p>
<ul>
  <li><code>const</code>: the box is <strong>sealed</strong>, it cannot be reassigned. The default choice in 3D Reader.</li>
  <li><code>let</code>: the box can get a new value later (counters, changing state).</li>
  <li><code>var</code>: the old way (before 2015). It has odd scoping rules; nobody writes it any more, but you will meet it in old code.</li>
</ul>
~~~js title="web/engine/client.js"
let worker = null;              //«1»
let nextId = 1;                 //«2»
const pending = new Map();      //«3»
export const CAD_EXTENSIONS = ['.step', '.stp', '.p21', '.iges', '.igs', '.brep', '.brp']; //«4»
~~~
<ol class="notes">
  <li><code>let</code> because the worker (the background computing engine) is created later, then maybe restarted: the value changes.</li>
  <li>A counter that grows with every request: necessarily <code>let</code>.</li>
  <li><code>const</code>: we always keep <em>the same</em> table, even if we add entries to it. <code>const</code> forbids changing the label, not modifying the content!</li>
  <li>A fixed list of CAD file extensions, shared with other files (<code>export</code>, see lesson 4).</li>
</ol>
<div class="callout warn"><strong>Classic trap:</strong> <code>const t = [1, 2]; t.push(3);</code> works! <code>const</code> protects the variable, not the inside of the array.</div>

<h3>2. Functions: classic and arrow</h3>
<p>A <span class="term" data-term="fonction">function</span> is a reusable recipe. JS has two main ways to write one:</p>
<div class="compare">
~~~py title="Python"
def extension_of(name):
    i = name.rfind('.')
    return '' if i < 0 else name[i:].lower()
~~~
~~~js title="JS: function"
function extensionOf(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
}
~~~
~~~js title="JS: arrow"
const extensionOf = (name) => {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
};
~~~
</div>
<p>The function <code>extensionOf</code> really exists in <code>client.js</code>. The <strong>arrow</strong> form <code>(x) =&gt; …</code> is used a lot for small functions passed as arguments. When the body is a single expression, you can even drop the braces and the <code>return</code>:</p>
~~~js title="web/engine/worker.js"
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
~~~
<p>Here <code>heapSize</code> is a function with no parameter <code>()</code> that <em>directly returns</em> the memory size of the OpenCascade engine. (The <code>?.</code> and <code>??</code> signs are explained in lesson 3.)</p>

<h3>3. Template strings</h3>
<p>With backticks <kbd>\`</kbd>, you insert values into a text with <code>\${…}</code>, like Python f-strings:</p>
~~~js run
const file = 'housing.step';
const volume = 1234.5678;
console.log(\`The volume of \${file} is \${volume.toFixed(1)} mm³\`);
// In Python: f"The volume of {file} is {volume:.1f} mm³"
~~~

<h3>4. Comments and JSDoc</h3>
<p><code>//</code> comments the rest of a line, <code>/* … */</code> a block. Blocks starting with <code>/**</code> are <strong>JSDoc</strong>: documentation that the editor (VS Code) shows when you hover the function.</p>
~~~js title="web/engine/client.js"
/** Called with {heap, heap_max} (bytes) whenever the worker reports its memory. */
export function onMemory(fn) {
  memoryListeners.add(fn);
}
~~~
<div class="callout tip"><strong>Reading method:</strong> in 3D Reader, always read the <code>/** … */</code> comment above a function before its code. It says <em>what it does</em>; the code says <em>how</em>.</div>
<div class="callout project">Semicolons <code>;</code> end statements. JS can often guess them, but 3D Reader writes them everywhere: it is safer.</div>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : l'atelier et ses bacs</h3>
<div class="callout analogy">Imagine l'atelier de la fonderie. Chaque bac porte une étiquette.
<ul>
<li><code>const</code> = un bac <strong>vissé au sol</strong> avec une étiquette gravée. Tu peux mettre ou retirer des pièces dedans, mais tu ne peux pas remplacer le bac par un autre.</li>
<li><code>let</code> = un bac <strong>sur roulettes</strong> avec une étiquette au feutre : tu peux l'échanger contre un autre bac à tout moment.</li>
<li><code>var</code> = un vieux bac dont l'étiquette se décolle et apparaît parfois dans le mauvais atelier. On l'évite.</li>
</ul></div>
<h4>Pas à pas : lire une ligne</h4>
<p><code>const pending = new Map();</code> se lit de gauche à droite :</p>
<ol>
<li><code>const</code> → « je crée un bac vissé »</li>
<li><code>pending</code> → « son étiquette est <em>pending</em> (en attente) »</li>
<li><code>=</code> → « je mets dedans… »</li>
<li><code>new Map()</code> → « …une table de correspondance toute neuve, vide »</li>
<li><code>;</code> → « fin de la phrase »</li>
</ol>
<h4>La fonction fléchée, c'est une machine à une entrée</h4>
~~~text
  (nom)   =>   nom.toUpperCase()
  entrée  flèche  ce qui ressort
~~~
<p>La flèche <code>=&gt;</code> se lit « donne ». <code>(x) =&gt; x * 2</code> : « x donne x fois deux ». C'est exactement une fonction <code>def double(x): return x * 2</code>, sans nom et en une ligne.</p>
~~~js run
// Les trois écritures font la même chose :
function double1(x) { return x * 2; }
const double2 = (x) => { return x * 2; };
const double3 = (x) => x * 2;
console.log(double1(21), double2(21), double3(21));
~~~
<h4>Erreurs fréquentes</h4>
<ul>
<li>Utiliser des guillemets <code>'…'</code> au lieu des accents graves <code>\`…\`</code> : <code>'\${x}'</code> affiche littéralement <em>\${x}</em>.</li>
<li>Réassigner un <code>const</code> : <code>TypeError: Assignment to constant variable.</code></li>
<li>Oublier le <code>return</code> dans une fonction fléchée avec accolades : elle renvoie <code>undefined</code>.</li>
</ul>
~~~js run
const avecAccolades = (x) => { x * 2 };   // pas de return !
console.log(avecAccolades(5));            // undefined
const x = 3;
console.log('x vaut \${x}');               // guillemets simples : pas de remplacement
console.log(\`x vaut \${x}\`);              // accents graves : 3
~~~
`,
    en: `
<h3>In other words: the workshop and its bins</h3>
<div class="callout analogy">Picture the foundry workshop. Every bin has a label.
<ul>
<li><code>const</code> = a bin <strong>bolted to the floor</strong> with an engraved label. You can put parts in or take them out, but you cannot swap the bin for another.</li>
<li><code>let</code> = a bin <strong>on wheels</strong> with a marker label: you can swap it for another bin any time.</li>
<li><code>var</code> = an old bin whose label peels off and sometimes shows up in the wrong workshop. Avoid it.</li>
</ul></div>
<h4>Step by step: reading a line</h4>
<p><code>const pending = new Map();</code> reads left to right:</p>
<ol>
<li><code>const</code> → "I create a bolted bin"</li>
<li><code>pending</code> → "its label is <em>pending</em>"</li>
<li><code>=</code> → "I put into it…"</li>
<li><code>new Map()</code> → "…a brand-new, empty lookup table"</li>
<li><code>;</code> → "end of the sentence"</li>
</ol>
<h4>An arrow function is a one-input machine</h4>
~~~text
  (name)  =>   name.toUpperCase()
  input   arrow   what comes out
~~~
<p>The arrow <code>=&gt;</code> reads "gives". <code>(x) =&gt; x * 2</code>: "x gives x times two". It is exactly <code>def double(x): return x * 2</code>, nameless and on one line.</p>
~~~js run
// All three do the same thing:
function double1(x) { return x * 2; }
const double2 = (x) => { return x * 2; };
const double3 = (x) => x * 2;
console.log(double1(21), double2(21), double3(21));
~~~
<h4>Common mistakes</h4>
<ul>
<li>Using quotes <code>'…'</code> instead of backticks <code>\`…\`</code>: <code>'\${x}'</code> prints <em>\${x}</em> literally.</li>
<li>Reassigning a <code>const</code>: <code>TypeError: Assignment to constant variable.</code></li>
<li>Forgetting <code>return</code> in an arrow function with braces: it returns <code>undefined</code>.</li>
</ul>
~~~js run
const withBraces = (x) => { x * 2 };   // no return!
console.log(withBraces(5));            // undefined
const x = 3;
console.log('x is \${x}');              // single quotes: no replacement
console.log(\`x is \${x}\`);             // backticks: 3
~~~
`,
  },
};

const L2 = {
  id: 'js-2',
  title: { fr: 'Objets, tableaux, Map et Set', en: 'Objects, arrays, Map and Set' },
  skills: ['js.collections'],
  minutes: 12,
  body: {
    fr: `
<h3>Les deux briques de toutes les données</h3>
<p>En JS, presque tout est rangé dans deux structures :</p>
<ul>
<li>le <span class="term" data-term="tableau">tableau</span> <code>[ … ]</code> : une liste ordonnée (comme la <code>list</code> de Python) ;</li>
<li>l'<span class="term" data-term="objet">objet</span> <code>{ clé: valeur }</code> : une fiche avec des champs nommés (comme le <code>dict</code> de Python ou une <code>struct</code> C++).</li>
</ul>
~~~js title="Le « contrat de résultat » de 3D Reader (simplifié)"
const result = {
  file: 'carter.step',               //«1»
  kind: 'cad',
  summary: { volume: 152000, bodies: 3 },  //«2»
  bodies: [                          //«3»
    { name: 'Corps 1', volume: 150000, closed: true },
    { name: 'Corps 2', volume: 2000, closed: false },
  ],
};
console.log(result.summary.volume);  //«4»
console.log(result.bodies[0].name);  //«5»
console.log(result['kind']);         //«6»
~~~
<ol class="notes">
<li>Une clé, deux-points, une valeur, une virgule.</li>
<li>Un objet peut contenir un autre objet…</li>
<li>…ou un tableau d'objets : c'est la liste des corps du fichier CAO.</li>
<li>Le point <code>.</code> descend dans les champs : « le volume du résumé du résultat ».</li>
<li>Les crochets avec un nombre : l'élément n° 0 (on compte à partir de 0 !).</li>
<li>Les crochets avec un texte : utile quand le nom de la clé est dans une variable, ex. <code>STRINGS[lang][key]</code> dans <code>i18n.js</code>.</li>
</ol>

<h3>Les méthodes des tableaux : la vraie puissance</h3>
<p>Plutôt que des boucles <code>for</code>, le JS moderne enchaîne des <strong>méthodes</strong> qui prennent une petite fonction fléchée :</p>
<table>
<thead><tr><th>Méthode</th><th>Ce qu'elle fait</th><th>Renvoie</th></tr></thead>
<tbody>
<tr><td><code>map(f)</code></td><td>transforme chaque élément</td><td>un nouveau tableau de même longueur</td></tr>
<tr><td><code>filter(f)</code></td><td>garde les éléments où <code>f</code> est vrai</td><td>un tableau plus court</td></tr>
<tr><td><code>reduce(f, départ)</code></td><td>cumule tout en une valeur (somme…)</td><td>une seule valeur</td></tr>
<tr><td><code>forEach(f)</code></td><td>fait quelque chose pour chaque élément</td><td>rien (<code>undefined</code>)</td></tr>
<tr><td><code>find(f)</code></td><td>le premier élément où <code>f</code> est vrai</td><td>un élément ou <code>undefined</code></td></tr>
<tr><td><code>some(f)</code> / <code>every(f)</code></td><td>au moins un / tous vrais ?</td><td><code>true</code> ou <code>false</code></td></tr>
</tbody></table>
~~~js run
const bodies = [
  { name: 'Corps 1', volume: 150000, closed: true },
  { name: 'Corps 2', volume: 2000, closed: false },
  { name: 'Corps 3', volume: 800, closed: true },
];
const noms = bodies.map((b) => b.name);
const fermes = bodies.filter((b) => b.closed);
const total = bodies.reduce((somme, b) => somme + b.volume, 0);
const ouvert = bodies.find((b) => !b.closed);
console.log(noms);
console.log(fermes.length, 'corps fermés');
console.log('Volume total :', total);
console.log('Premier corps ouvert :', ouvert.name);
console.log('Un corps ouvert ?', bodies.some((b) => !b.closed));
~~~
<p>Dans <code>worker.js</code>, le nombre total de triangles est calculé exactement ainsi :</p>
~~~js title="web/engine/worker.js"
const total = Math.max(1, msg.bodies.reduce((n, b) => n + (b ? b.indices.length : 0), 0));
~~~

<h3><code>Map</code> et <code>Set</code> : les collections spécialisées</h3>
<ul>
<li><code>Map</code> : une table clé → valeur, où la clé peut être n'importe quoi (un nombre, un objet…). Méthodes <code>set</code>, <code>get</code>, <code>has</code>, <code>delete</code>, <code>size</code>.</li>
<li><code>Set</code> : un ensemble <strong>sans doublons</strong>. Méthodes <code>add</code>, <code>has</code>, <code>delete</code>.</li>
</ul>
~~~js title="web/engine/client.js"
const pending = new Map(); // id -> { resolve, reject, onProgress }   «1»
const listeners = new Set(); // CAD engine loading listeners (preload) «2»
// …
pending.set(id, { resolve, reject, onProgress });                    //«3»
const job = data.id != null ? pending.get(data.id) : null;          //«4»
pending.delete(data.id);                                             //«5»
~~~
<ol class="notes">
<li>Chaque demande envoyée au worker reçoit un numéro ; la <code>Map</code> retient « qui attend la réponse n° 7 ».</li>
<li>Les « écouteurs » à prévenir quand le moteur CAO est chargé : un <code>Set</code> évite d'inscrire deux fois le même.</li>
<li>On range la demande sous son numéro.</li>
<li>La réponse arrive avec son numéro : on retrouve la demande.</li>
<li>Réponse traitée : on la retire de la liste d'attente.</li>
</ol>
<div class="callout tip">Astuce : <code>[...new Set(liste)]</code> supprime les doublons d'un tableau. <code>worker.js</code> l'utilise dans <code>transferables()</code>.</div>
`,
    en: `
<h3>The two building blocks of all data</h3>
<p>In JS, almost everything is stored in two structures:</p>
<ul>
<li>the <span class="term" data-term="tableau">array</span> <code>[ … ]</code>: an ordered list (like Python's <code>list</code>);</li>
<li>the <span class="term" data-term="objet">object</span> <code>{ key: value }</code>: a record with named fields (like a Python <code>dict</code> or a C++ <code>struct</code>).</li>
</ul>
~~~js title="3D Reader's result contract (simplified)"
const result = {
  file: 'housing.step',              //«1»
  kind: 'cad',
  summary: { volume: 152000, bodies: 3 },  //«2»
  bodies: [                          //«3»
    { name: 'Body 1', volume: 150000, closed: true },
    { name: 'Body 2', volume: 2000, closed: false },
  ],
};
console.log(result.summary.volume);  //«4»
console.log(result.bodies[0].name);  //«5»
console.log(result['kind']);         //«6»
~~~
<ol class="notes">
<li>A key, a colon, a value, a comma.</li>
<li>An object can hold another object…</li>
<li>…or an array of objects: the list of bodies in the CAD file.</li>
<li>The dot <code>.</code> goes down into the fields: "the volume of the summary of the result".</li>
<li>Brackets with a number: element no. 0 (counting starts at 0!).</li>
<li>Brackets with a text: handy when the key name is in a variable, e.g. <code>STRINGS[lang][key]</code> in <code>i18n.js</code>.</li>
</ol>

<h3>Array methods: the real power</h3>
<p>Rather than <code>for</code> loops, modern JS chains <strong>methods</strong> that take a small arrow function:</p>
<table>
<thead><tr><th>Method</th><th>What it does</th><th>Returns</th></tr></thead>
<tbody>
<tr><td><code>map(f)</code></td><td>transforms every element</td><td>a new array of the same length</td></tr>
<tr><td><code>filter(f)</code></td><td>keeps the elements where <code>f</code> is true</td><td>a shorter array</td></tr>
<tr><td><code>reduce(f, start)</code></td><td>accumulates everything into one value (sum…)</td><td>a single value</td></tr>
<tr><td><code>forEach(f)</code></td><td>does something for each element</td><td>nothing (<code>undefined</code>)</td></tr>
<tr><td><code>find(f)</code></td><td>the first element where <code>f</code> is true</td><td>an element or <code>undefined</code></td></tr>
<tr><td><code>some(f)</code> / <code>every(f)</code></td><td>at least one / all true?</td><td><code>true</code> or <code>false</code></td></tr>
</tbody></table>
~~~js run
const bodies = [
  { name: 'Body 1', volume: 150000, closed: true },
  { name: 'Body 2', volume: 2000, closed: false },
  { name: 'Body 3', volume: 800, closed: true },
];
const names = bodies.map((b) => b.name);
const closed = bodies.filter((b) => b.closed);
const total = bodies.reduce((sum, b) => sum + b.volume, 0);
const open = bodies.find((b) => !b.closed);
console.log(names);
console.log(closed.length, 'closed bodies');
console.log('Total volume:', total);
console.log('First open body:', open.name);
console.log('Any open body?', bodies.some((b) => !b.closed));
~~~
<p>In <code>worker.js</code>, the total number of triangle indices is computed exactly like this:</p>
~~~js title="web/engine/worker.js"
const total = Math.max(1, msg.bodies.reduce((n, b) => n + (b ? b.indices.length : 0), 0));
~~~

<h3><code>Map</code> and <code>Set</code>: specialised collections</h3>
<ul>
<li><code>Map</code>: a key → value table where the key can be anything (a number, an object…). Methods <code>set</code>, <code>get</code>, <code>has</code>, <code>delete</code>, <code>size</code>.</li>
<li><code>Set</code>: a collection <strong>without duplicates</strong>. Methods <code>add</code>, <code>has</code>, <code>delete</code>.</li>
</ul>
~~~js title="web/engine/client.js"
const pending = new Map(); // id -> { resolve, reject, onProgress }   «1»
const listeners = new Set(); // CAD engine loading listeners (preload) «2»
// …
pending.set(id, { resolve, reject, onProgress });                    //«3»
const job = data.id != null ? pending.get(data.id) : null;          //«4»
pending.delete(data.id);                                             //«5»
~~~
<ol class="notes">
<li>Every request sent to the worker gets a number; the <code>Map</code> remembers "who is waiting for answer no. 7".</li>
<li>The "listeners" to notify when the CAD engine is loaded: a <code>Set</code> avoids registering the same one twice.</li>
<li>The request is stored under its number.</li>
<li>The answer arrives with its number: we find the request again.</li>
<li>Answer handled: it is removed from the waiting list.</li>
</ol>
<div class="callout tip">Tip: <code>[...new Set(list)]</code> removes duplicates from an array. <code>worker.js</code> uses it in <code>transferables()</code>.</div>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : le classeur, la fiche et le tapis roulant</h3>
<div class="callout analogy">
<ul>
<li>Un <strong>objet</strong>, c'est une <em>fiche article</em> : « Nom : Corps 1 — Volume : 150 000 — Fermé : oui ». On lit un champ par son nom : <code>fiche.volume</code>.</li>
<li>Un <strong>tableau</strong>, c'est une <em>pile de fiches numérotées</em> à partir de 0. On prend la fiche n° 2 avec <code>pile[2]</code>.</li>
<li>Une <strong>Map</strong>, c'est le <em>casier des bons de commande</em> : chaque casier porte un numéro, on y glisse le bon, on le retire quand la commande est livrée.</li>
<li>Un <strong>Set</strong>, c'est la <em>liste des présents</em> à une réunion : impossible d'être noté deux fois.</li>
</ul></div>
<h4>Les méthodes = des postes sur un tapis roulant</h4>
~~~text
 [ C1, C2, C3 ]  →  filter(fermé ?)  →  [ C1, C3 ]  →  map(volume)  →  [150000, 800]  →  reduce(+)  →  150800
     pièces           contrôle qualité        pièces OK        on mesure         mesures         on cumule     total
~~~
<p>Chaque poste reçoit le résultat du précédent. C'est pour ça qu'on peut <strong>enchaîner</strong> : <code>bodies.filter(…).map(…).reduce(…)</code>.</p>
~~~js run
const bodies = [
  { name: 'C1', volume: 150000, closed: true },
  { name: 'C2', volume: 2000, closed: false },
  { name: 'C3', volume: 800, closed: true },
];
const total = bodies
  .filter((b) => b.closed)        // contrôle qualité
  .map((b) => b.volume)           // mesure
  .reduce((s, v) => s + v, 0);    // cumul, en partant de 0
console.log(total);
~~~
<h4><code>reduce</code> décortiqué</h4>
<p><code>reduce((s, v) =&gt; s + v, 0)</code> : « je pars de 0 (le <em>cumul</em> <code>s</code>), et pour chaque valeur <code>v</code>, le nouveau cumul vaut <code>s + v</code> ».</p>
<table><thead><tr><th>Tour</th><th>s (avant)</th><th>v</th><th>s + v</th></tr></thead>
<tbody><tr><td>1</td><td>0</td><td>150000</td><td>150000</td></tr><tr><td>2</td><td>150000</td><td>800</td><td>150800</td></tr></tbody></table>
<h4>Erreurs fréquentes</h4>
<ul>
<li><code>bodies[3]</code> sur un tableau de 3 éléments → <code>undefined</code> (les indices vont de 0 à 2).</li>
<li>Confondre <code>map</code> (renvoie un tableau) et <code>forEach</code> (ne renvoie rien).</li>
<li>Une <code>Map</code> se lit avec <code>.get(clé)</code>, pas avec <code>map[clé]</code>.</li>
</ul>
~~~js run
const casier = new Map();
casier.set(7, 'analyse de carter.step');
console.log(casier.get(7));     // la bonne façon
console.log(casier[7]);         // undefined : piège !
console.log(casier.size, casier.has(7));
~~~
`,
    en: `
<h3>In other words: the file card, the stack and the conveyor belt</h3>
<div class="callout analogy">
<ul>
<li>An <strong>object</strong> is an <em>item card</em>: "Name: Body 1 — Volume: 150,000 — Closed: yes". You read a field by its name: <code>card.volume</code>.</li>
<li>An <strong>array</strong> is a <em>stack of cards numbered</em> from 0. You take card no. 2 with <code>stack[2]</code>.</li>
<li>A <strong>Map</strong> is the <em>order-form pigeonholes</em>: each hole has a number, you slip the form in, and remove it once the order is delivered.</li>
<li>A <strong>Set</strong> is the <em>attendance list</em> of a meeting: you cannot be listed twice.</li>
</ul></div>
<h4>Methods = stations on a conveyor belt</h4>
~~~text
 [ B1, B2, B3 ]  →  filter(closed?)  →  [ B1, B3 ]  →  map(volume)  →  [150000, 800]  →  reduce(+)  →  150800
     parts           quality check        good parts      measuring        measures       adding up      total
~~~
<p>Every station gets the output of the previous one. That is why you can <strong>chain</strong>: <code>bodies.filter(…).map(…).reduce(…)</code>.</p>
~~~js run
const bodies = [
  { name: 'B1', volume: 150000, closed: true },
  { name: 'B2', volume: 2000, closed: false },
  { name: 'B3', volume: 800, closed: true },
];
const total = bodies
  .filter((b) => b.closed)        // quality check
  .map((b) => b.volume)           // measuring
  .reduce((s, v) => s + v, 0);    // adding up, starting from 0
console.log(total);
~~~
<h4><code>reduce</code> taken apart</h4>
<p><code>reduce((s, v) =&gt; s + v, 0)</code>: "I start from 0 (the <em>running total</em> <code>s</code>), and for every value <code>v</code>, the new total is <code>s + v</code>".</p>
<table><thead><tr><th>Round</th><th>s (before)</th><th>v</th><th>s + v</th></tr></thead>
<tbody><tr><td>1</td><td>0</td><td>150000</td><td>150000</td></tr><tr><td>2</td><td>150000</td><td>800</td><td>150800</td></tr></tbody></table>
<h4>Common mistakes</h4>
<ul>
<li><code>bodies[3]</code> on a 3-element array → <code>undefined</code> (indices go from 0 to 2).</li>
<li>Mixing up <code>map</code> (returns an array) and <code>forEach</code> (returns nothing).</li>
<li>A <code>Map</code> is read with <code>.get(key)</code>, not with <code>map[key]</code>.</li>
</ul>
~~~js run
const holes = new Map();
holes.set(7, 'analysis of housing.step');
console.log(holes.get(7));     // the right way
console.log(holes[7]);         // undefined: trap!
console.log(holes.size, holes.has(7));
~~~
`,
  },
};

const L3 = {
  id: 'js-3',
  title: { fr: 'Les raccourcis modernes : { }, ..., ?., ?? et ? :', en: 'Modern shortcuts: { }, ..., ?., ?? and ? :' },
  skills: ['js.modern'],
  minutes: 12,
  body: {
    fr: `
<h3>Pourquoi le code de 3D Reader a l'air « codé »</h3>
<p>Le JS moderne utilise beaucoup de petits symboles qui raccourcissent l'écriture. Une fois qu'on les connaît, une ligne comme <code>worker.onmessage = ({ data }) =&gt; { … }</code> devient limpide. Passons-les en revue.</p>

<h3>1. La déstructuration : déballer un objet ou un tableau</h3>
<p>Au lieu de sortir les champs un par un, on les « déballe » d'un coup :</p>
~~~js run
const body = { name: 'Corps 1', volume: 150000, closed: true };
// Sans déstructuration
const n1 = body.name;
const v1 = body.volume;
// Avec déstructuration : même résultat
const { name, volume } = body;
console.log(name, volume);
// Tableaux : on déballe par position
const [x, y, z] = [10, 20, 30];
console.log(z);
~~~
<p>On peut aussi déstructurer <strong>directement dans les paramètres</strong> d'une fonction. C'est ce que fait <code>client.js</code> quand un message arrive du worker :</p>
~~~js title="web/engine/client.js"
worker.onmessage = ({ data }) => {   //«1»
  const job = data.id != null ? pending.get(data.id) : null;  //«2»
  if (data.memory) memoryListeners.forEach((fn) => fn(data.memory)); //«3»
~~~
<ol class="notes">
<li>Le navigateur appelle cette fonction avec un « événement » qui contient beaucoup de champs. <code>({ data })</code> veut dire : « de cet événement, je ne garde que <code>data</code> ».</li>
<li>Le ternaire <code>condition ? siVrai : siFaux</code> (voir plus bas).</li>
<li>Un <code>if</code> sur une seule ligne, sans accolades.</li>
</ol>
<p>Et dans <code>worker.js</code> : <code>const [wasmBinary, factory] = await Promise.all([…])</code> déballe les deux résultats d'un coup.</p>

<h3>2. Le spread <code>...</code> : étaler</h3>
<p>Les trois points « étalent » le contenu d'un objet ou d'un tableau dans un autre :</p>
~~~js run
const message = { type: 'analyze', name: 'carter.step' };
const avecId = { ...message, id: 7 };       // copie + un champ en plus
console.log(avecId);
const cao = ['.step', '.stp'];
const maillages = ['.stl', '.obj'];
console.log([...cao, ...maillages]);        // fusion de tableaux
~~~
<p>Dans <code>client.js</code>, chaque demande au worker est envoyée avec <code>postMessage({ ...message, id }, transfer)</code> : « le message, plus son numéro ». Et <code>SUPPORTED_EXTENSIONS = [...CAD_EXTENSIONS, ...MESH_EXTENSIONS]</code> réunit les deux listes d'extensions.</p>
<div class="callout info"><code>{ id }</code> tout seul est un raccourci pour <code>{ id: id }</code> : un champ qui porte le même nom que la variable.</div>

<h3>3. Le chaînage optionnel <code>?.</code> : « si ça existe »</h3>
<p><code>a?.b</code> lit <code>a.b</code>, mais si <code>a</code> vaut <code>null</code> ou <code>undefined</code>, renvoie <code>undefined</code> <strong>au lieu de planter</strong>.</p>
~~~js title="web/engine/client.js"
job?.onProgress?.(data);   //«1»
worker?.terminate();       //«2»
~~~
<ol class="notes">
<li>« S'il y a une demande, et si elle a une fonction <code>onProgress</code>, appelle-la. » Sans <code>?.</code> il faudrait deux <code>if</code>.</li>
<li>« S'il y a un worker, arrête-le. »</li>
</ol>

<h3>4. <code>??</code> et <code>||</code> : la valeur de secours</h3>
<ul>
<li><code>a ?? b</code> : <code>a</code>, sauf si <code>a</code> est <code>null</code>/<code>undefined</code> → alors <code>b</code>.</li>
<li><code>a || b</code> : <code>a</code>, sauf si <code>a</code> est « faux » (<code>0</code>, <code>''</code>, <code>false</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>) → alors <code>b</code>.</li>
</ul>
~~~js title="web/i18n.js"
const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
~~~
<p>Traduction : « le texte dans la langue choisie, sinon en anglais, sinon la clé elle-même ». C'est une cascade de secours.</p>
~~~js run
const epaisseur = 0;
console.log(epaisseur || 5);   // 5  : || considère 0 comme « rien »
console.log(epaisseur ?? 5);   // 0  : ?? ne remplace que null/undefined
~~~
<div class="callout warn">Pour une valeur numérique qui peut légitimement valoir 0 (une épaisseur, un nombre de noyaux…), préfère <code>??</code>.</div>

<h3>5. Le ternaire <code>? :</code> : un if/else en une expression</h3>
~~~js title="web/engine/client.js"
return i < 0 ? '' : name.slice(i).toLowerCase();
~~~
<p>« Si <code>i &lt; 0</code>, renvoie un texte vide, sinon l'extension en minuscules. » Équivalent Python : <code>'' if i &lt; 0 else …</code>.</p>
`,
    en: `
<h3>Why 3D Reader's code looks "coded"</h3>
<p>Modern JS uses many small symbols that shorten writing. Once you know them, a line like <code>worker.onmessage = ({ data }) =&gt; { … }</code> becomes crystal clear. Let's go through them.</p>

<h3>1. Destructuring: unpacking an object or an array</h3>
<p>Instead of taking the fields out one by one, you "unpack" them at once:</p>
~~~js run
const body = { name: 'Body 1', volume: 150000, closed: true };
// Without destructuring
const n1 = body.name;
const v1 = body.volume;
// With destructuring: same result
const { name, volume } = body;
console.log(name, volume);
// Arrays: unpacked by position
const [x, y, z] = [10, 20, 30];
console.log(z);
~~~
<p>You can also destructure <strong>right in the parameters</strong> of a function. That is what <code>client.js</code> does when a message arrives from the worker:</p>
~~~js title="web/engine/client.js"
worker.onmessage = ({ data }) => {   //«1»
  const job = data.id != null ? pending.get(data.id) : null;  //«2»
  if (data.memory) memoryListeners.forEach((fn) => fn(data.memory)); //«3»
~~~
<ol class="notes">
<li>The browser calls this function with an "event" that has many fields. <code>({ data })</code> means: "from this event, I only keep <code>data</code>".</li>
<li>The ternary <code>condition ? ifTrue : ifFalse</code> (see below).</li>
<li>A one-line <code>if</code>, without braces.</li>
</ol>
<p>And in <code>worker.js</code>: <code>const [wasmBinary, factory] = await Promise.all([…])</code> unpacks both results at once.</p>

<h3>2. Spread <code>...</code>: spreading out</h3>
<p>The three dots "spread" the content of an object or array into another one:</p>
~~~js run
const message = { type: 'analyze', name: 'housing.step' };
const withId = { ...message, id: 7 };       // copy + one more field
console.log(withId);
const cad = ['.step', '.stp'];
const meshes = ['.stl', '.obj'];
console.log([...cad, ...meshes]);           // merging arrays
~~~
<p>In <code>client.js</code>, every request to the worker is sent with <code>postMessage({ ...message, id }, transfer)</code>: "the message, plus its number". And <code>SUPPORTED_EXTENSIONS = [...CAD_EXTENSIONS, ...MESH_EXTENSIONS]</code> joins both extension lists.</p>
<div class="callout info"><code>{ id }</code> alone is a shortcut for <code>{ id: id }</code>: a field named like the variable.</div>

<h3>3. Optional chaining <code>?.</code>: "if it exists"</h3>
<p><code>a?.b</code> reads <code>a.b</code>, but if <code>a</code> is <code>null</code> or <code>undefined</code>, it returns <code>undefined</code> <strong>instead of crashing</strong>.</p>
~~~js title="web/engine/client.js"
job?.onProgress?.(data);   //«1»
worker?.terminate();       //«2»
~~~
<ol class="notes">
<li>"If there is a request, and if it has an <code>onProgress</code> function, call it." Without <code>?.</code> you would need two <code>if</code>s.</li>
<li>"If there is a worker, stop it."</li>
</ol>

<h3>4. <code>??</code> and <code>||</code>: the fallback value</h3>
<ul>
<li><code>a ?? b</code>: <code>a</code>, unless <code>a</code> is <code>null</code>/<code>undefined</code> → then <code>b</code>.</li>
<li><code>a || b</code>: <code>a</code>, unless <code>a</code> is "falsy" (<code>0</code>, <code>''</code>, <code>false</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>) → then <code>b</code>.</li>
</ul>
~~~js title="web/i18n.js"
const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
~~~
<p>Translation: "the text in the chosen language, else in English, else the key itself". A cascade of fallbacks.</p>
~~~js run
const thickness = 0;
console.log(thickness || 5);   // 5 : || treats 0 as "nothing"
console.log(thickness ?? 5);   // 0 : ?? only replaces null/undefined
~~~
<div class="callout warn">For a number that may legitimately be 0 (a thickness, a number of cores…), prefer <code>??</code>.</div>

<h3>5. The ternary <code>? :</code>: an if/else as an expression</h3>
~~~js title="web/engine/client.js"
return i < 0 ? '' : name.slice(i).toLowerCase();
~~~
<p>"If <code>i &lt; 0</code>, return an empty text, else the extension in lower case." Python equivalent: <code>'' if i &lt; 0 else …</code>.</p>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : un petit dictionnaire des symboles</h3>
<p>Garde ce tableau sous la main : chaque symbole se lit comme une petite phrase.</p>
<table>
<thead><tr><th>Symbole</th><th>Se lit…</th><th>Exemple</th></tr></thead>
<tbody>
<tr><td><code>{ a, b } = obj</code></td><td>« je sors a et b de la boîte obj »</td><td><code>const { name } = body</code></td></tr>
<tr><td><code>[a, b] = tab</code></td><td>« je prends le 1er et le 2e »</td><td><code>const [x, y] = point</code></td></tr>
<tr><td><code>...obj</code></td><td>« tout le contenu de obj, étalé ici »</td><td><code>{ ...msg, id }</code></td></tr>
<tr><td><code>a?.b</code></td><td>« b de a, si a existe »</td><td><code>job?.resolve(r)</code></td></tr>
<tr><td><code>a ?? b</code></td><td>« a, ou à défaut b »</td><td><code>x ?? 0</code></td></tr>
<tr><td><code>c ? a : b</code></td><td>« si c alors a sinon b »</td><td><code>ok ? 'vert' : 'rouge'</code></td></tr>
</tbody></table>
<div class="callout analogy"><strong>La déstructuration</strong>, c'est ouvrir un colis et poser directement sur l'établi les deux pièces dont tu as besoin, en laissant le carton de côté.<br>
<strong>Le spread</strong>, c'est vider un carton dans un autre carton, puis ajouter une pièce par-dessus.<br>
<strong>Le <code>?.</code></strong>, c'est « regarde dans le tiroir — <em>s'il y a un tiroir</em> ». Sans lui, chercher dans un tiroir qui n'existe pas fait tout planter (<code>TypeError: Cannot read properties of undefined</code>).<br>
<strong>Le <code>??</code></strong>, c'est la pièce de rechange : on la prend seulement si l'originale manque.</div>
<h4>Décortiquer une ligne réelle</h4>
<p><code>const heapSize = () =&gt; occtModule?.HEAPU8?.length ?? 0;</code></p>
<ol>
<li><code>occtModule?.</code> : le moteur OpenCascade est-il chargé ? Sinon → <code>undefined</code>.</li>
<li><code>HEAPU8?.</code> : a-t-il une mémoire ? Sinon → <code>undefined</code>.</li>
<li><code>.length</code> : sa taille en octets.</li>
<li><code>?? 0</code> : si on a obtenu <code>undefined</code> en route, on renvoie 0.</li>
</ol>
~~~js run
const occtModule = null;   // le moteur n'est pas encore chargé
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
console.log(heapSize());   // 0, et pas de plantage

const config = { units: { length: 'mm' } };
console.log(config.units?.length);        // 'mm'
console.log(config.colors?.background);   // undefined (pas d'erreur)
~~~
<h4>|| contre ?? en un coup d'œil</h4>
~~~js run
for (const v of [0, '', null, undefined, 12]) {
  console.log(String(v).padEnd(10), '|| →', v || 'défaut', '   ?? →', v ?? 'défaut');
}
~~~
`,
    en: `
<h3>In other words: a small dictionary of symbols</h3>
<p>Keep this table at hand: each symbol reads like a short sentence.</p>
<table>
<thead><tr><th>Symbol</th><th>Reads…</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>{ a, b } = obj</code></td><td>"I take a and b out of box obj"</td><td><code>const { name } = body</code></td></tr>
<tr><td><code>[a, b] = arr</code></td><td>"I take the 1st and the 2nd"</td><td><code>const [x, y] = point</code></td></tr>
<tr><td><code>...obj</code></td><td>"all of obj's content, spread here"</td><td><code>{ ...msg, id }</code></td></tr>
<tr><td><code>a?.b</code></td><td>"b of a, if a exists"</td><td><code>job?.resolve(r)</code></td></tr>
<tr><td><code>a ?? b</code></td><td>"a, or failing that b"</td><td><code>x ?? 0</code></td></tr>
<tr><td><code>c ? a : b</code></td><td>"if c then a else b"</td><td><code>ok ? 'green' : 'red'</code></td></tr>
</tbody></table>
<div class="callout analogy"><strong>Destructuring</strong> is opening a parcel and putting the two parts you need straight on the workbench, leaving the box aside.<br>
<strong>Spread</strong> is emptying one box into another, then adding a part on top.<br>
<strong><code>?.</code></strong> is "look in the drawer — <em>if there is a drawer</em>". Without it, searching a drawer that does not exist crashes everything (<code>TypeError: Cannot read properties of undefined</code>).<br>
<strong><code>??</code></strong> is the spare part: you only take it if the original is missing.</div>
<h4>Taking a real line apart</h4>
<p><code>const heapSize = () =&gt; occtModule?.HEAPU8?.length ?? 0;</code></p>
<ol>
<li><code>occtModule?.</code>: is the OpenCascade engine loaded? If not → <code>undefined</code>.</li>
<li><code>HEAPU8?.</code>: does it have a memory? If not → <code>undefined</code>.</li>
<li><code>.length</code>: its size in bytes.</li>
<li><code>?? 0</code>: if we got <code>undefined</code> along the way, return 0.</li>
</ol>
~~~js run
const occtModule = null;   // the engine is not loaded yet
const heapSize = () => occtModule?.HEAPU8?.length ?? 0;
console.log(heapSize());   // 0, and no crash

const config = { units: { length: 'mm' } };
console.log(config.units?.length);        // 'mm'
console.log(config.colors?.background);   // undefined (no error)
~~~
<h4>|| versus ?? at a glance</h4>
~~~js run
for (const v of [0, '', null, undefined, 12]) {
  console.log(String(v).padEnd(10), '|| →', v || 'default', '   ?? →', v ?? 'default');
}
~~~
`,
  },
};

const L4 = {
  id: 'js-4',
  title: { fr: 'Les modules : import et export', en: 'Modules: import and export' },
  skills: ['js.modules'],
  minutes: 10,
  body: {
    fr: `
<h3>Un programme découpé en fichiers</h3>
<p>3D Reader compte des dizaines de fichiers JS : <code>app.js</code> (la page), <code>engine/client.js</code>, <code>engine/worker.js</code>, <code>engine/parting.js</code> (le plan de joint), <code>chiffrage/model.js</code>… Chaque fichier est un <span class="term" data-term="module">module</span> : il garde ses variables pour lui, sauf celles qu'il <strong>exporte</strong>. Les autres fichiers les <strong>importent</strong>.</p>
<div class="compare">
~~~py title="Python"
from summary import summarize
import numpy as np
~~~
~~~js title="JavaScript"
import { summarize } from './summary.js';
import * as THREE from 'three';
~~~
~~~cpp title="C++"
#include "summary.h"
#include <vector>
~~~
</div>

<h3>Exporter</h3>
~~~js title="web/engine/client.js"
export const CAD_EXTENSIONS = ['.step', '.stp', '.p21', '.iges', '.igs', '.brep', '.brp']; //«1»
export function cancelAll() { /* … */ }                                                   //«2»
export { MESH_EXTENSIONS };                                                               //«3»
function resetWorker() { /* … */ }                                                        //«4»
~~~
<ol class="notes">
<li>Export <strong>nommé</strong> d'une constante.</li>
<li>Export nommé d'une fonction : <code>app.js</code> peut l'appeler pour tout annuler.</li>
<li>Ré-export : <code>client.js</code> transmet une valeur qu'il a lui-même importée de <code>meshload.js</code>.</li>
<li>Pas de <code>export</code> : cette fonction est <strong>privée</strong> au fichier. Personne d'autre ne peut l'appeler.</li>
</ol>
<p>Il existe aussi <code>export default</code> : <em>la</em> valeur principale du fichier, importée sans accolades. Les modules de cette formation l'utilisent : <code>export default { id: 'js', … }</code>.</p>

<h3>Importer</h3>
~~~js title="web/engine/client.js"
import { summarize } from './summary.js';                           //«1»
import { cacheKey, loadResult, saveResult } from './cache.js';      //«2»
import { THICKNESS_VERSION, currentThickness } from './thickness.js';
~~~
~~~js title="web/engine/summary.js"
import { Vector3 } from 'three';                                    //«3»
import { ConvexHull } from 'three/addons/math/ConvexHull.js';
~~~
<ol class="notes">
<li>Chemin <strong>relatif</strong> (<code>./</code> = même dossier). L'extension <code>.js</code> est obligatoire dans le navigateur.</li>
<li>Plusieurs noms à la fois, entre accolades : ce doivent être exactement les noms exportés.</li>
<li>Nom « nu » (<code>'three'</code>, la bibliothèque 3D) : le navigateur le retrouve grâce à l'<em>import map</em> déclarée dans <code>index.html</code> ; Node le cherche dans <code>node_modules</code>.</li>
</ol>

<h3>L'import dynamique : charger à la demande</h3>
<p><code>import(…)</code> écrit comme une fonction charge un module <strong>seulement quand on en a besoin</strong>, et renvoie une promesse (leçon 6). La page IA ne charge le code du chiffrage que si on pose une question de chiffrage :</p>
~~~js title="web/ai-workspace.js"
const { traceForAI } = await import("./chiffrage/ai-trace.js");
~~~
<p>Avantage : la page s'ouvre plus vite, car on ne télécharge pas tout au départ. C'est aussi ainsi que <code>occt.js</code> charge le gros moteur OpenCascade.</p>

<h3><code>import.meta.url</code> : « où suis-je ? »</h3>
~~~js title="web/engine/worker.js"
// Root of the site (…/web/ or …/3D-reader/), where vendor/ lives.
const baseUrl = new URL('../', import.meta.url).href;
~~~
<p><code>import.meta.url</code> est l'adresse du fichier en cours. <code>new URL('../', …)</code> remonte d'un dossier. Résultat : le worker trouve le dossier <code>vendor/</code> que le site soit servi en local ou sur GitHub Pages (sous <code>/3D-reader/</code>).</p>
<div class="callout project">Dans <code>client.js</code> : <code>new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })</code> démarre le worker comme un module, pour qu'il puisse lui-même utiliser <code>import</code>.</div>
`,
    en: `
<h3>A program split into files</h3>
<p>3D Reader has dozens of JS files: <code>app.js</code> (the page), <code>engine/client.js</code>, <code>engine/worker.js</code>, <code>engine/parting.js</code> (the parting line), <code>chiffrage/model.js</code>… Each file is a <span class="term" data-term="module">module</span>: it keeps its variables to itself, except the ones it <strong>exports</strong>. Other files <strong>import</strong> them.</p>
<div class="compare">
~~~py title="Python"
from summary import summarize
import numpy as np
~~~
~~~js title="JavaScript"
import { summarize } from './summary.js';
import * as THREE from 'three';
~~~
~~~cpp title="C++"
#include "summary.h"
#include <vector>
~~~
</div>

<h3>Exporting</h3>
~~~js title="web/engine/client.js"
export const CAD_EXTENSIONS = ['.step', '.stp', '.p21', '.iges', '.igs', '.brep', '.brp']; //«1»
export function cancelAll() { /* … */ }                                                   //«2»
export { MESH_EXTENSIONS };                                                               //«3»
function resetWorker() { /* … */ }                                                        //«4»
~~~
<ol class="notes">
<li><strong>Named</strong> export of a constant.</li>
<li>Named export of a function: <code>app.js</code> can call it to cancel everything.</li>
<li>Re-export: <code>client.js</code> passes on a value it imported itself from <code>meshload.js</code>.</li>
<li>No <code>export</code>: this function is <strong>private</strong> to the file. Nobody else can call it.</li>
</ol>
<p>There is also <code>export default</code>: <em>the</em> main value of the file, imported without braces. The modules of this course use it: <code>export default { id: 'js', … }</code>.</p>

<h3>Importing</h3>
~~~js title="web/engine/client.js"
import { summarize } from './summary.js';                           //«1»
import { cacheKey, loadResult, saveResult } from './cache.js';      //«2»
import { THICKNESS_VERSION, currentThickness } from './thickness.js';
~~~
~~~js title="web/engine/summary.js"
import { Vector3 } from 'three';                                    //«3»
import { ConvexHull } from 'three/addons/math/ConvexHull.js';
~~~
<ol class="notes">
<li><strong>Relative</strong> path (<code>./</code> = same folder). The <code>.js</code> extension is mandatory in the browser.</li>
<li>Several names at once, between braces: they must be exactly the exported names.</li>
<li>"Bare" name (<code>'three'</code>, the 3D library): the browser finds it thanks to the <em>import map</em> declared in <code>index.html</code>; Node looks for it in <code>node_modules</code>.</li>
</ol>

<h3>Dynamic import: loading on demand</h3>
<p><code>import(…)</code> written like a function loads a module <strong>only when needed</strong>, and returns a promise (lesson 6). The AI page only loads the costing code when you ask a costing question:</p>
~~~js title="web/ai-workspace.js"
const { traceForAI } = await import("./chiffrage/ai-trace.js");
~~~
<p>Benefit: the page opens faster, since not everything is downloaded up front. It is also how <code>occt.js</code> loads the big OpenCascade engine.</p>

<h3><code>import.meta.url</code>: "where am I?"</h3>
~~~js title="web/engine/worker.js"
// Root of the site (…/web/ or …/3D-reader/), where vendor/ lives.
const baseUrl = new URL('../', import.meta.url).href;
~~~
<p><code>import.meta.url</code> is the address of the current file. <code>new URL('../', …)</code> goes up one folder. Result: the worker finds the <code>vendor/</code> folder whether the site is served locally or on GitHub Pages (under <code>/3D-reader/</code>).</p>
<div class="callout project">In <code>client.js</code>: <code>new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })</code> starts the worker as a module, so that it can use <code>import</code> itself.</div>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : les ateliers et le passe-plat</h3>
<div class="callout analogy">Chaque fichier est un <strong>atelier fermé</strong> (fusion, moulage, usinage…). Ce qui se passe dedans reste dedans. Pour donner quelque chose aux autres ateliers, on le pose sur le <strong>passe-plat</strong> : c'est <code>export</code>. Un autre atelier vient le chercher en disant précisément ce qu'il veut et où : c'est <code>import { pièce } from './atelier.js'</code>.</div>
<h4>Les trois formes à reconnaître</h4>
<table>
<thead><tr><th>Écriture</th><th>Sens</th></tr></thead>
<tbody>
<tr><td><code>import { a, b } from './x.js'</code></td><td>Je prends a et b, qui ont été exportés <em>sous ces noms</em>.</td></tr>
<tr><td><code>import x from './x.js'</code></td><td>Je prends la pièce principale (<code>export default</code>) et je l'appelle x comme je veux.</td></tr>
<tr><td><code>import * as THREE from 'three'</code></td><td>Je prends tout, rangé dans une boîte nommée THREE : <code>THREE.Mesh</code>, <code>THREE.Scene</code>…</td></tr>
<tr><td><code>await import('./x.js')</code></td><td>Je vais le chercher maintenant, seulement si nécessaire.</td></tr>
</tbody></table>
<h4>Les erreurs que tu verras dans la console</h4>
<ul>
<li><code>SyntaxError: The requested module './x.js' does not provide an export named 'truc'</code> : faute de frappe dans les accolades, ou la fonction n'est pas exportée.</li>
<li><code>Failed to resolve module specifier "three"</code> : le navigateur ne sait pas où est <code>three</code> → l'import map manque (c'est pour ça que <code>worker.js</code> n'importe jamais <code>three</code> : les import maps ne s'appliquent pas dans les workers).</li>
<li><code>404</code> sur un fichier : le chemin relatif est faux (<code>./</code> contre <code>../</code>).</li>
</ul>
<h4>Les chemins, en image</h4>
~~~text
web/
├── app.js               import { t } from './i18n.js'
├── i18n.js
└── engine/
    ├── client.js        import { summarize } from './summary.js'
    ├── summary.js
    └── worker.js        new URL('../', import.meta.url) → web/
~~~
<p><code>./</code> = « dans mon dossier », <code>../</code> = « le dossier au-dessus ».</p>
`,
    en: `
<h3>In other words: workshops and the serving hatch</h3>
<div class="callout analogy">Each file is a <strong>closed workshop</strong> (melting, moulding, machining…). What happens inside stays inside. To give something to other workshops, you put it on the <strong>serving hatch</strong>: that is <code>export</code>. Another workshop picks it up by saying exactly what it wants and from where: <code>import { part } from './workshop.js'</code>.</div>
<h4>The forms to recognise</h4>
<table>
<thead><tr><th>Writing</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>import { a, b } from './x.js'</code></td><td>I take a and b, exported <em>under these names</em>.</td></tr>
<tr><td><code>import x from './x.js'</code></td><td>I take the main piece (<code>export default</code>) and call it x, whatever name I like.</td></tr>
<tr><td><code>import * as THREE from 'three'</code></td><td>I take everything, in a box named THREE: <code>THREE.Mesh</code>, <code>THREE.Scene</code>…</td></tr>
<tr><td><code>await import('./x.js')</code></td><td>I fetch it now, only if needed.</td></tr>
</tbody></table>
<h4>Errors you will see in the console</h4>
<ul>
<li><code>SyntaxError: The requested module './x.js' does not provide an export named 'thing'</code>: typo inside the braces, or the function is not exported.</li>
<li><code>Failed to resolve module specifier "three"</code>: the browser does not know where <code>three</code> is → the import map is missing (that is why <code>worker.js</code> never imports <code>three</code>: import maps do not apply inside workers).</li>
<li><code>404</code> on a file: wrong relative path (<code>./</code> versus <code>../</code>).</li>
</ul>
<h4>Paths, as a picture</h4>
~~~text
web/
├── app.js               import { t } from './i18n.js'
├── i18n.js
└── engine/
    ├── client.js        import { summarize } from './summary.js'
    ├── summary.js
    └── worker.js        new URL('../', import.meta.url) → web/
~~~
<p><code>./</code> = "in my folder", <code>../</code> = "the folder above".</p>
`,
  },
};

const L5 = {
  id: 'js-5',
  title: { fr: 'Les classes, new et this', en: 'Classes, new and this' },
  skills: ['js.classes'],
  minutes: 10,
  body: {
    fr: `
<h3>Un moule pour fabriquer des objets</h3>
<p>Une <span class="term" data-term="class">classe</span> est un <strong>moule</strong> : elle décrit les champs et les fonctions (appelées <em>méthodes</em>) qu'auront tous les objets fabriqués avec. On fabrique un objet avec <code>new</code>. Tu as déjà vu <code>new Map()</code>, <code>new Set()</code>, <code>new Worker(…)</code>, <code>new URL(…)</code> : ce sont des classes fournies par le navigateur.</p>
<div class="compare">
~~~py title="Python"
class Compteur:
    def __init__(self, depart):
        self.valeur = depart
    def ajouter(self, n):
        self.valeur += n

c = Compteur(10)
~~~
~~~js title="JavaScript"
class Compteur {
  constructor(depart) {
    this.valeur = depart;
  }
  ajouter(n) {
    this.valeur += n;
  }
}
const c = new Compteur(10);
~~~
~~~cpp title="C++"
class Compteur {
public:
  Compteur(int depart) : valeur(depart) {}
  void ajouter(int n) { valeur += n; }
  int valeur;
};
Compteur c(10);
~~~
</div>
<ul>
<li><code>constructor</code> = <code>__init__</code> de Python : appelé par <code>new</code>.</li>
<li><code>this</code> = <code>self</code> de Python : « l'objet sur lequel on travaille ». En JS il n'est <strong>pas</strong> écrit dans les paramètres.</li>
<li>Pas de mot-clé <code>def</code> ni <code>function</code> devant les méthodes.</li>
</ul>
~~~js run
class Compteur {
  constructor(depart) { this.valeur = depart; }
  ajouter(n) { this.valeur += n; return this; }
  get double() { return this.valeur * 2; }   // getter : se lit comme un champ
}
const c = new Compteur(10);
c.ajouter(5).ajouter(1);
console.log(c.valeur, c.double);   // pas de () après double !
~~~

<h3>Hériter : <code>extends</code> et <code>super</code></h3>
<p>Une classe peut <strong>partir d'une autre</strong> et la compléter. 3D Reader crée sa propre erreur pour un fichier déjà présent dans le dossier réseau :</p>
~~~js title="web/network-folder.js"
export class FileExistsError extends Error {        //«1»
  constructor(name) {
    super(\`le fichier « \${name} » existe déjà : il n'est pas remplacé\`);  //«2»
    this.name = "FileExistsError";                  //«3»
  }
}
~~~
<ol class="notes">
<li><code>extends Error</code> : c'est une erreur JS normale, avec en plus son propre nom.</li>
<li><code>super(…)</code> appelle le constructeur du parent (<code>Error</code>) avec le message.</li>
<li>Le champ <code>name</code> permet ensuite de tester <code>err instanceof FileExistsError</code> ou <code>err.name</code>.</li>
</ol>
<p>Et la caméra de la vue 3D étend celle de three.js pour basculer entre perspective et vue orthogonale (comme SolidWorks) :</p>
~~~js title="web/app.js"
class ViewCamera extends THREE.PerspectiveCamera {
  ortho = false;          //«1»
  height = 1;

  updateProjectionMatrix() {
    if (!this.ortho) return super.updateProjectionMatrix();  //«2»
    this.top = this.height / 2;
    // …
  }
}
~~~
<ol class="notes">
<li>Champs déclarés directement dans la classe, avec leur valeur de départ.</li>
<li>« Si on n'est pas en ortho, fais comme le parent ; sinon, mon propre calcul. » C'est une méthode <strong>redéfinie</strong> (override).</li>
</ol>

<h3>Le prototype, en deux phrases</h3>
<p>Sous le capot, JS ne copie pas les méthodes dans chaque objet : chaque objet a un lien caché vers un <strong>prototype</strong> où elles sont rangées. Le mot <code>class</code> n'est qu'une façon lisible d'écrire ça ; tu croiseras parfois <code>Truc.prototype.methode</code> dans du vieux code ou dans des bibliothèques.</p>
<div class="callout warn"><strong>Piège de <code>this</code> :</strong> si tu passes une méthode comme fonction (<code>setTimeout(obj.methode, 100)</code>), elle perd son <code>this</code>. Les fonctions fléchées, elles, gardent le <code>this</code> de l'endroit où elles sont écrites : c'est pour ça qu'on écrit <code>setTimeout(() =&gt; obj.methode(), 100)</code>.</div>
`,
    en: `
<h3>A mould for making objects</h3>
<p>A <span class="term" data-term="class">class</span> is a <strong>mould</strong>: it describes the fields and functions (called <em>methods</em>) that every object made with it will have. You make an object with <code>new</code>. You have already seen <code>new Map()</code>, <code>new Set()</code>, <code>new Worker(…)</code>, <code>new URL(…)</code>: classes provided by the browser.</p>
<div class="compare">
~~~py title="Python"
class Counter:
    def __init__(self, start):
        self.value = start
    def add(self, n):
        self.value += n

c = Counter(10)
~~~
~~~js title="JavaScript"
class Counter {
  constructor(start) {
    this.value = start;
  }
  add(n) {
    this.value += n;
  }
}
const c = new Counter(10);
~~~
~~~cpp title="C++"
class Counter {
public:
  Counter(int start) : value(start) {}
  void add(int n) { value += n; }
  int value;
};
Counter c(10);
~~~
</div>
<ul>
<li><code>constructor</code> = Python's <code>__init__</code>: called by <code>new</code>.</li>
<li><code>this</code> = Python's <code>self</code>: "the object we are working on". In JS it is <strong>not</strong> written in the parameters.</li>
<li>No <code>def</code> or <code>function</code> keyword in front of methods.</li>
</ul>
~~~js run
class Counter {
  constructor(start) { this.value = start; }
  add(n) { this.value += n; return this; }
  get double() { return this.value * 2; }   // getter: read like a field
}
const c = new Counter(10);
c.add(5).add(1);
console.log(c.value, c.double);   // no () after double!
~~~

<h3>Inheriting: <code>extends</code> and <code>super</code></h3>
<p>A class can <strong>start from another one</strong> and complete it. 3D Reader creates its own error for a file already present in the network folder:</p>
~~~js title="web/network-folder.js"
export class FileExistsError extends Error {        //«1»
  constructor(name) {
    super(\`le fichier « \${name} » existe déjà : il n'est pas remplacé\`);  //«2»
    this.name = "FileExistsError";                  //«3»
  }
}
~~~
<ol class="notes">
<li><code>extends Error</code>: it is a normal JS error, with its own name on top.</li>
<li><code>super(…)</code> calls the parent's constructor (<code>Error</code>) with the message.</li>
<li>The <code>name</code> field then lets code test <code>err instanceof FileExistsError</code> or <code>err.name</code>.</li>
</ol>
<p>And the 3D view camera extends three.js's to switch between perspective and orthographic views (like SolidWorks):</p>
~~~js title="web/app.js"
class ViewCamera extends THREE.PerspectiveCamera {
  ortho = false;          //«1»
  height = 1;

  updateProjectionMatrix() {
    if (!this.ortho) return super.updateProjectionMatrix();  //«2»
    this.top = this.height / 2;
    // …
  }
}
~~~
<ol class="notes">
<li>Fields declared right in the class, with their starting value.</li>
<li>"If we are not orthographic, do as the parent does; otherwise, my own computation." An <strong>overridden</strong> method.</li>
</ol>

<h3>The prototype, in two sentences</h3>
<p>Under the hood, JS does not copy methods into every object: each object has a hidden link to a <strong>prototype</strong> where they are stored. The <code>class</code> keyword is just a readable way to write that; you will sometimes meet <code>Thing.prototype.method</code> in old code or libraries.</p>
<div class="callout warn"><strong><code>this</code> trap:</strong> if you pass a method as a function (<code>setTimeout(obj.method, 100)</code>), it loses its <code>this</code>. Arrow functions keep the <code>this</code> of where they are written: that is why people write <code>setTimeout(() =&gt; obj.method(), 100)</code>.</div>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : le moule et les pièces coulées</h3>
<div class="callout analogy">Tu es fondeur : tu le sais mieux que personne. <strong>La classe, c'est la coquille</strong> (le moule permanent). <strong>Chaque <code>new</code>, c'est une coulée</strong> : elle produit une pièce réelle. Toutes les pièces ont la même forme (mêmes champs, mêmes méthodes), mais chacune a son propre numéro de lot (ses propres valeurs).
<br><code>extends</code>, c'est une <strong>coquille dérivée</strong> : on reprend le moule d'origine et on ajoute un tiroir. <code>super(…)</code>, c'est « fais d'abord tout ce que faisait le moule d'origine ».</div>
~~~js run
class Piece {
  constructor(nom, masseKg) {
    this.nom = nom;
    this.masseKg = masseKg;
  }
  decrire() {
    return \`\${this.nom} : \${this.masseKg} kg\`;
  }
}
class PieceAvecNoyau extends Piece {
  constructor(nom, masseKg, noyaux) {
    super(nom, masseKg);    // le moule d'origine d'abord
    this.noyaux = noyaux;   // puis le tiroir en plus
  }
  decrire() {
    return super.decrire() + \` (\${this.noyaux} noyaux)\`;
  }
}
const a = new Piece('Support', 1.2);
const b = new PieceAvecNoyau('Carter', 3.4, 2);
console.log(a.decrire());
console.log(b.decrire());
console.log(b instanceof Piece);   // true : un carter EST une pièce
~~~
<h4><code>this</code> = « moi, la pièce »</h4>
<p>Dans <code>decrire()</code>, <code>this.nom</code> veut dire « mon nom à moi ». Quand on appelle <code>a.decrire()</code>, <code>this</code> est <code>a</code> ; pour <code>b.decrire()</code>, c'est <code>b</code>. C'est l'objet <strong>à gauche du point</strong>.</p>
<h4>Les erreurs typiques</h4>
<ul>
<li>Oublier <code>new</code> : <code>Piece('x', 1)</code> → <code>TypeError: Class constructor Piece cannot be invoked without 'new'</code>.</li>
<li>Utiliser <code>this</code> avant <code>super()</code> dans une classe dérivée → erreur.</li>
<li>Appeler un getter avec des parenthèses : <code>c.double()</code> → « double is not a function ».</li>
</ul>
`,
    en: `
<h3>In other words: the mould and the cast parts</h3>
<div class="callout analogy">You are a founder: you know this better than anyone. <strong>The class is the die</strong> (the permanent mould). <strong>Every <code>new</code> is a pour</strong>: it produces a real part. All parts have the same shape (same fields, same methods), but each one has its own batch number (its own values).
<br><code>extends</code> is a <strong>derived die</strong>: you take the original mould and add a slide. <code>super(…)</code> means "first do everything the original mould did".</div>
~~~js run
class Part {
  constructor(name, massKg) {
    this.name = name;
    this.massKg = massKg;
  }
  describe() {
    return \`\${this.name}: \${this.massKg} kg\`;
  }
}
class CoredPart extends Part {
  constructor(name, massKg, cores) {
    super(name, massKg);    // the original mould first
    this.cores = cores;     // then the extra slide
  }
  describe() {
    return super.describe() + \` (\${this.cores} cores)\`;
  }
}
const a = new Part('Bracket', 1.2);
const b = new CoredPart('Housing', 3.4, 2);
console.log(a.describe());
console.log(b.describe());
console.log(b instanceof Part);   // true: a housing IS a part
~~~
<h4><code>this</code> = "me, the part"</h4>
<p>In <code>describe()</code>, <code>this.name</code> means "my own name". When you call <code>a.describe()</code>, <code>this</code> is <code>a</code>; for <code>b.describe()</code>, it is <code>b</code>. It is the object <strong>left of the dot</strong>.</p>
<h4>Typical errors</h4>
<ul>
<li>Forgetting <code>new</code>: <code>Part('x', 1)</code> → <code>TypeError: Class constructor Part cannot be invoked without 'new'</code>.</li>
<li>Using <code>this</code> before <code>super()</code> in a derived class → error.</li>
<li>Calling a getter with parentheses: <code>c.double()</code> → "double is not a function".</li>
</ul>
`,
  },
};

const L6 = {
  id: 'js-6',
  title: { fr: "L'asynchrone : promesses, async et await", en: 'Asynchronous code: promises, async and await' },
  skills: ['js.async'],
  minutes: 15,
  body: {
    fr: `
<h3>Le problème : attendre sans tout bloquer</h3>
<p>Ouvrir un fichier STEP de 30 Mo, télécharger le moteur OpenCascade (50 Mo), interroger l'IA… tout ça prend du temps. Si la page attendait <em>en bloquant</em>, elle serait figée : plus de clic, plus de rotation 3D. JS résout ça avec l'<strong>asynchrone</strong> : on lance l'opération, on continue, et on est prévenu quand elle se termine.</p>

<h3>1. Les callbacks : « rappelle-moi »</h3>
<p>La forme la plus ancienne : on donne une fonction à appeler plus tard.</p>
~~~js run
console.log('1. Je lance un minuteur');
setTimeout(() => console.log('3. Minuteur terminé (après 500 ms)'), 500);
console.log('2. Je continue sans attendre');
~~~
<p><code>worker.onmessage = …</code> dans <code>client.js</code> est aussi un callback : « quand le worker envoie un message, appelle cette fonction ».</p>

<h3>2. La Promise : un ticket de retrait</h3>
<p>Une <span class="term" data-term="promise">promesse</span> (<code>Promise</code>) représente un résultat <strong>qui n'existe pas encore</strong>. Elle sera soit <em>tenue</em> (resolve → une valeur), soit <em>rompue</em> (reject → une erreur). Voici comment <code>client.js</code> transforme un échange avec le worker en promesse :</p>
~~~js title="web/engine/client.js"
function call(message, transfer, onProgress) {
  const id = nextId++;                                   //«1»
  return new Promise((resolve, reject) => {              //«2»
    pending.set(id, { resolve, reject, onProgress });    //«3»
    getWorker().postMessage({ ...message, id }, transfer); //«4»
  });
}
~~~
<ol class="notes">
<li>Un numéro unique pour cette demande.</li>
<li>On crée la promesse ; JS nous donne les deux « boutons » <code>resolve</code> et <code>reject</code>.</li>
<li>On range les boutons dans la <code>Map</code> <code>pending</code>, sous le numéro.</li>
<li>On envoie le travail au worker. Plus tard, <code>onmessage</code> retrouvera la demande et appuiera sur <code>job.resolve(data.result)</code> ou <code>job.reject(new Error(…))</code>.</li>
</ol>

<h3>3. <code>async</code> / <code>await</code> : lire l'asynchrone comme du normal</h3>
<p><code>await</code> devant une promesse signifie « attends son résultat ici (sans bloquer la page) ». On ne peut l'utiliser que dans une fonction marquée <code>async</code> (ou au niveau principal d'un module).</p>
~~~js run
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function analyser(nom) {
  console.log('Lecture de', nom, '…');
  await attendre(300);
  if (nom.endsWith('.txt')) throw new Error('Format non supporté : ' + nom);
  return { nom, volume: 1500 };
}

async function main() {
  try {
    const r = await analyser('carter.step');
    console.log('Résultat :', r.volume, 'mm³');
    await analyser('notes.txt');
  } catch (err) {
    console.log('Erreur attrapée :', err.message);
  } finally {
    console.log('Fin (dans tous les cas)');
  }
}
main();
~~~
<ul>
<li><code>try { … } catch (err) { … }</code> : attrape l'erreur d'une promesse rompue.</li>
<li><code>finally</code> : s'exécute toujours, erreur ou pas (pour cacher une barre de progression, par ex.).</li>
<li>Sans <code>await</code>, on peut écrire <code>promesse.then(valeur =&gt; …).catch(err =&gt; …)</code> : même chose, autre style. <code>occt.js</code> l'utilise : <code>import(…).then((mod) =&gt; mod.default, (err) =&gt; { throw … })</code>.</li>
</ul>

<h3>4. Plusieurs choses en même temps : <code>Promise.all</code></h3>
~~~js title="web/engine/occt.js"
// Start the download first: importing the 400 kB glue script overlaps with it.
const binaryPromise = downloadWasm(dir + OCCT_WASM_GZ, base, onProgress);
const factoryPromise = import(dir + OCCT_JS).then((mod) => mod.default);
const [wasmBinary, factory] = await Promise.all([binaryPromise, factoryPromise]);
~~~
<p>Les deux téléchargements partent <strong>en parallèle</strong> ; <code>Promise.all</code> attend les deux et renvoie leurs résultats dans un tableau (déstructuré). Si l'un échoue, tout échoue. <code>Promise.allSettled</code> (utilisé dans <code>app.js</code>) attend tout le monde même en cas d'échec.</p>

<h3>5. La boucle d'événements, simplement</h3>
<p>JS n'a qu'<strong>un seul fil</strong> d'exécution sur la page. Il exécute ton code jusqu'au bout, puis pioche la tâche suivante dans une <em>file d'attente</em> (un clic, un minuteur, une réponse réseau, un message du worker…). C'est la <span class="term" data-term="event-loop">boucle d'événements</span>. Conséquence : un calcul lourd sur le fil principal fige la page — c'est pourquoi 3D Reader envoie les calculs lourds dans un <span class="term" data-term="web-worker">Web Worker</span>, un second fil.</p>
`,
    en: `
<h3>The problem: waiting without blocking everything</h3>
<p>Opening a 30 MB STEP file, downloading the OpenCascade engine (50 MB), asking the AI… all of this takes time. If the page waited <em>by blocking</em>, it would freeze: no more clicks, no more 3D rotation. JS solves this with <strong>asynchrony</strong>: start the operation, carry on, and get notified when it ends.</p>

<h3>1. Callbacks: "call me back"</h3>
<p>The oldest form: you hand over a function to call later.</p>
~~~js run
console.log('1. I start a timer');
setTimeout(() => console.log('3. Timer done (after 500 ms)'), 500);
console.log('2. I carry on without waiting');
~~~
<p><code>worker.onmessage = …</code> in <code>client.js</code> is a callback too: "when the worker sends a message, call this function".</p>

<h3>2. The Promise: a pick-up ticket</h3>
<p>A <span class="term" data-term="promise">promise</span> (<code>Promise</code>) stands for a result <strong>that does not exist yet</strong>. It will be either <em>fulfilled</em> (resolve → a value) or <em>rejected</em> (reject → an error). Here is how <code>client.js</code> turns an exchange with the worker into a promise:</p>
~~~js title="web/engine/client.js"
function call(message, transfer, onProgress) {
  const id = nextId++;                                   //«1»
  return new Promise((resolve, reject) => {              //«2»
    pending.set(id, { resolve, reject, onProgress });    //«3»
    getWorker().postMessage({ ...message, id }, transfer); //«4»
  });
}
~~~
<ol class="notes">
<li>A unique number for this request.</li>
<li>The promise is created; JS hands us its two "buttons", <code>resolve</code> and <code>reject</code>.</li>
<li>The buttons are stored in the <code>pending</code> <code>Map</code>, under the number.</li>
<li>The job is sent to the worker. Later, <code>onmessage</code> finds the request and presses <code>job.resolve(data.result)</code> or <code>job.reject(new Error(…))</code>.</li>
</ol>

<h3>3. <code>async</code> / <code>await</code>: reading async code like normal code</h3>
<p><code>await</code> in front of a promise means "wait for its result here (without blocking the page)". It can only be used inside a function marked <code>async</code> (or at the top level of a module).</p>
~~~js run
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function analyse(name) {
  console.log('Reading', name, '…');
  await wait(300);
  if (name.endsWith('.txt')) throw new Error('Unsupported format: ' + name);
  return { name, volume: 1500 };
}

async function main() {
  try {
    const r = await analyse('housing.step');
    console.log('Result:', r.volume, 'mm³');
    await analyse('notes.txt');
  } catch (err) {
    console.log('Caught error:', err.message);
  } finally {
    console.log('End (in every case)');
  }
}
main();
~~~
<ul>
<li><code>try { … } catch (err) { … }</code>: catches the error of a rejected promise.</li>
<li><code>finally</code>: always runs, error or not (to hide a progress bar, for instance).</li>
<li>Without <code>await</code>, you can write <code>promise.then(value =&gt; …).catch(err =&gt; …)</code>: same thing, other style. <code>occt.js</code> uses it: <code>import(…).then((mod) =&gt; mod.default, (err) =&gt; { throw … })</code>.</li>
</ul>

<h3>4. Several things at once: <code>Promise.all</code></h3>
~~~js title="web/engine/occt.js"
// Start the download first: importing the 400 kB glue script overlaps with it.
const binaryPromise = downloadWasm(dir + OCCT_WASM_GZ, base, onProgress);
const factoryPromise = import(dir + OCCT_JS).then((mod) => mod.default);
const [wasmBinary, factory] = await Promise.all([binaryPromise, factoryPromise]);
~~~
<p>Both downloads start <strong>in parallel</strong>; <code>Promise.all</code> waits for both and returns their results in an array (destructured). If one fails, it all fails. <code>Promise.allSettled</code> (used in <code>app.js</code>) waits for everyone even on failure.</p>

<h3>5. The event loop, simply</h3>
<p>JS has only <strong>one thread</strong> of execution on the page. It runs your code to the end, then picks the next task from a <em>queue</em> (a click, a timer, a network answer, a worker message…). That is the <span class="term" data-term="event-loop">event loop</span>. Consequence: a heavy computation on the main thread freezes the page — which is why 3D Reader sends heavy computations to a <span class="term" data-term="web-worker">Web Worker</span>, a second thread.</p>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : le comptoir du restaurant rapide</h3>
<div class="callout analogy">Tu commandes au comptoir. Le serveur ne reste pas planté devant la friteuse : il te donne un <strong>ticket n° 42</strong> (la <em>Promise</em>) et prend la commande suivante. Quand ta commande est prête, il appelle « 42 ! » (<em>resolve</em>) — ou « 42, désolé, plus de frites » (<em>reject</em>).
<ul>
<li><code>await</code> = toi qui attends ton numéro. Mais pendant ce temps, le restaurant continue de tourner : la page reste réactive.</li>
<li><code>Promise.all</code> = tu commandes un burger et un dessert à deux comptoirs différents et tu attends d'avoir les deux.</li>
<li><code>try/catch</code> = ton plan B si on t'annonce « plus de frites ».</li>
<li>La <strong>boucle d'événements</strong> = le serveur unique, qui traite les clients un par un, très vite.</li>
<li>Le <strong>Web Worker</strong> = un deuxième cuisinier en arrière-cuisine pour les plats longs (l'analyse STEP).</li>
</ul></div>
<p>Dans 3D Reader, c'est littéral : <code>client.js</code> donne un numéro (<code>id</code>) à chaque demande, la range dans <code>pending</code>, et quand le worker répond avec ce numéro, on « appelle le ticket ».</p>
~~~text
 Page (client.js)                         Worker (worker.js)
 ─────────────────                        ──────────────────
 id = 7, pending.set(7, …)
 postMessage({type:'analyze', id:7}) ───►  reçoit, calcule…
 (la page reste utilisable)                …progression ───► onProgress
                                 ◄───────  postMessage({type:'result', id:7})
 pending.get(7).resolve(result)
 → le "await" de app.js se débloque
~~~
<h4>Quiz express : dans quel ordre ?</h4>
~~~js run
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Réponse : A, D, C, B.
// Le code en cours va d'abord jusqu'au bout (A, D).
// Puis les promesses (file prioritaire) : C.
// Puis les minuteurs, même à 0 ms : B.
~~~
<h4>Erreurs fréquentes</h4>
<ul>
<li>Oublier <code>await</code> : on obtient l'objet <code>Promise { &lt;pending&gt; }</code> au lieu du résultat.</li>
<li>Utiliser <code>await</code> hors d'une fonction <code>async</code> → <code>SyntaxError</code> (sauf au niveau principal d'un module).</li>
<li>Une promesse rompue sans <code>catch</code> → « Uncaught (in promise) » dans la console.</li>
</ul>
~~~js run
async function volume() { return 1500; }
const sansAwait = volume();
console.log(sansAwait);              // Promise
volume().then((v) => console.log('avec then :', v));
~~~
`,
    en: `
<h3>In other words: the fast-food counter</h3>
<div class="callout analogy">You order at the counter. The server does not stand in front of the fryer: they give you <strong>ticket no. 42</strong> (the <em>Promise</em>) and take the next order. When your order is ready, they call "42!" (<em>resolve</em>) — or "42, sorry, no more fries" (<em>reject</em>).
<ul>
<li><code>await</code> = you waiting for your number. Meanwhile the restaurant keeps running: the page stays responsive.</li>
<li><code>Promise.all</code> = you order a burger and a dessert at two different counters and wait until you have both.</li>
<li><code>try/catch</code> = your plan B if you hear "no more fries".</li>
<li>The <strong>event loop</strong> = the single server, handling customers one by one, very fast.</li>
<li>The <strong>Web Worker</strong> = a second cook in the back kitchen for long dishes (the STEP analysis).</li>
</ul></div>
<p>In 3D Reader this is literal: <code>client.js</code> gives a number (<code>id</code>) to each request, stores it in <code>pending</code>, and when the worker answers with that number, the ticket is "called".</p>
~~~text
 Page (client.js)                         Worker (worker.js)
 ─────────────────                        ──────────────────
 id = 7, pending.set(7, …)
 postMessage({type:'analyze', id:7}) ───►  receives, computes…
 (the page stays usable)                   …progress ───► onProgress
                                 ◄───────  postMessage({type:'result', id:7})
 pending.get(7).resolve(result)
 → the "await" in app.js resumes
~~~
<h4>Quick quiz: in which order?</h4>
~~~js run
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Answer: A, D, C, B.
// The current code runs to the end first (A, D).
// Then promises (priority queue): C.
// Then timers, even at 0 ms: B.
~~~
<h4>Common mistakes</h4>
<ul>
<li>Forgetting <code>await</code>: you get the object <code>Promise { &lt;pending&gt; }</code> instead of the result.</li>
<li>Using <code>await</code> outside an <code>async</code> function → <code>SyntaxError</code> (except at a module's top level).</li>
<li>A rejected promise without <code>catch</code> → "Uncaught (in promise)" in the console.</li>
</ul>
~~~js run
async function volume() { return 1500; }
const withoutAwait = volume();
console.log(withoutAwait);              // Promise
volume().then((v) => console.log('with then:', v));
~~~
`,
  },
};

const L7 = {
  id: 'js-7',
  title: { fr: 'Nombres, Math et tableaux typés', en: 'Numbers, Math and typed arrays' },
  skills: ['js.typed'],
  minutes: 12,
  body: {
    fr: `
<h3>Un seul type de nombre (ou presque)</h3>
<p>Contrairement au C++ (<code>int</code>, <code>float</code>, <code>double</code>…), JS n'a qu'un type <code>number</code> : un nombre à virgule flottante en double précision (le <code>double</code> du C++, le <code>float</code> de Python). Les entiers sont exacts jusqu'à environ 9 millions de milliards (<code>Number.MAX_SAFE_INTEGER</code>). Il existe aussi <code>BigInt</code> (<code>123n</code>), rarement utilisé.</p>
~~~js run
console.log(0.1 + 0.2);                 // 0.30000000000000004 !
console.log((0.1 + 0.2).toFixed(2));    // "0.30" (texte)
console.log(Math.round(2.5), Math.floor(-1.5), Math.ceil(1.2));
console.log(7 / 2, Math.trunc(7 / 2), 7 % 2);   // pas de division entière : Math.trunc
console.log(2 ** 20);                    // puissance : 1 048 576
~~~
<div class="callout warn"><strong>Flottants :</strong> ne jamais comparer deux résultats de calcul avec <code>===</code>. Les tests de 3D Reader utilisent une fonction <code>approx(a, b)</code> avec une tolérance (voir <code>tests/js/helpers.mjs</code>).</div>

<h3>NaN et Infinity : les valeurs bizarres</h3>
<ul>
<li><code>NaN</code> (« Not a Number ») : résultat d'un calcul impossible, ex. <code>0 / 0</code> ou <code>Number('abc')</code>. Particularité : <code>NaN === NaN</code> est <strong>faux</strong> ! On teste avec <code>Number.isNaN(x)</code>.</li>
<li><code>Infinity</code> : <code>1 / 0</code>. On vérifie qu'un nombre est utilisable avec <code>Number.isFinite(x)</code>.</li>
</ul>
<p>Le serveur Python de 3D Reader a même une fonction <code>_finite</code> pour remplacer ces valeurs avant de les envoyer en JSON, qui ne les accepte pas.</p>

<h3>L'objet <code>Math</code></h3>
<p>Une boîte à outils : <code>Math.max</code>, <code>Math.min</code>, <code>Math.abs</code>, <code>Math.sqrt</code>, <code>Math.hypot</code>, <code>Math.PI</code>, <code>Math.cos</code>… Exemple réel :</p>
~~~js title="web/engine/worker.js"
percent = Math.min(100, Math.max(0, Math.floor(percent)));   // «1»
~~~
<ol class="notes"><li>« Borne » le pourcentage entre 0 et 100, arrondi vers le bas : une barre de progression ne doit jamais afficher 103 %.</li></ol>

<h3>Les tableaux typés : la mémoire brute des maillages</h3>
<p>Un maillage 3D, c'est des <strong>millions de nombres</strong> : 3 coordonnées par sommet, 3 numéros de sommets par triangle. Un tableau normal <code>[ … ]</code> serait lent et gourmand. On utilise des <span class="term" data-term="typed-array">tableaux typés</span> : une suite d'octets en mémoire, tous du même type, comme un tableau C++.</p>
<table>
<thead><tr><th>Type</th><th>Contenu</th><th>Octets / valeur</th><th>Équivalent C++</th></tr></thead>
<tbody>
<tr><td><code>Float32Array</code></td><td>flottants simple précision</td><td>4</td><td><code>float[]</code></td></tr>
<tr><td><code>Float64Array</code></td><td>flottants double précision</td><td>8</td><td><code>double[]</code></td></tr>
<tr><td><code>Uint32Array</code></td><td>entiers positifs 0…4 milliards</td><td>4</td><td><code>uint32_t[]</code></td></tr>
<tr><td><code>Uint8Array</code></td><td>octets 0…255 (fichiers bruts)</td><td>1</td><td><code>uint8_t[]</code></td></tr>
</tbody></table>
~~~js title="Le contrat de résultat (SPEC.md)"
mesh: { positions: Float32Array /* xyz, mm */, indices: Uint32Array }
~~~
~~~js run
// Un seul triangle : 3 sommets × 3 coordonnées
const positions = new Float32Array([0, 0, 0,   10, 0, 0,   0, 10, 0]);
const indices = new Uint32Array([0, 1, 2]);
console.log(positions.length, 'nombres,', positions.byteLength, 'octets');
// Coordonnées du sommet n° 1 :
const i = indices[1];
console.log(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
// Un Uint8Array tronque ce qui dépasse :
console.log(new Uint8Array([255, 256, 300]));
~~~
<p>Ces tableaux reposent sur un <code>ArrayBuffer</code> (le bloc d'octets). Le worker peut <strong>transférer</strong> ce bloc à la page sans le copier : c'est le rôle de <code>transferables()</code> dans <code>worker.js</code>, qui liste les <code>.buffer</code> des positions et indices. C'est aussi un <code>Uint8Array</code> (<code>new Uint8Array(msg.bytes)</code>) qui donne les octets du fichier STEP à OpenCascade.</p>

<h3>Mesurer la performance</h3>
~~~js run
const t0 = performance.now();
let s = 0;
for (let k = 0; k < 1e6; k++) s += Math.sqrt(k);
console.log('Calcul :', (performance.now() - t0).toFixed(1), 'ms');
~~~
<p><code>performance.now()</code> donne le temps en millisecondes avec décimales. 3D Reader l'utilise pour envoyer la progression au plus toutes les 200 ms.</p>
`,
    en: `
<h3>A single number type (almost)</h3>
<p>Unlike C++ (<code>int</code>, <code>float</code>, <code>double</code>…), JS has a single <code>number</code> type: a double-precision floating-point number (C++'s <code>double</code>, Python's <code>float</code>). Integers are exact up to about 9 quadrillion (<code>Number.MAX_SAFE_INTEGER</code>). There is also <code>BigInt</code> (<code>123n</code>), rarely used.</p>
~~~js run
console.log(0.1 + 0.2);                 // 0.30000000000000004 !
console.log((0.1 + 0.2).toFixed(2));    // "0.30" (text)
console.log(Math.round(2.5), Math.floor(-1.5), Math.ceil(1.2));
console.log(7 / 2, Math.trunc(7 / 2), 7 % 2);   // no integer division: Math.trunc
console.log(2 ** 20);                    // power: 1,048,576
~~~
<div class="callout warn"><strong>Floats:</strong> never compare two computed results with <code>===</code>. 3D Reader's tests use an <code>approx(a, b)</code> function with a tolerance (see <code>tests/js/helpers.mjs</code>).</div>

<h3>NaN and Infinity: the odd values</h3>
<ul>
<li><code>NaN</code> ("Not a Number"): the result of an impossible computation, e.g. <code>0 / 0</code> or <code>Number('abc')</code>. Quirk: <code>NaN === NaN</code> is <strong>false</strong>! Test with <code>Number.isNaN(x)</code>.</li>
<li><code>Infinity</code>: <code>1 / 0</code>. Check that a number is usable with <code>Number.isFinite(x)</code>.</li>
</ul>
<p>3D Reader's Python server even has a <code>_finite</code> function that replaces these values before sending them as JSON, which does not accept them.</p>

<h3>The <code>Math</code> object</h3>
<p>A toolbox: <code>Math.max</code>, <code>Math.min</code>, <code>Math.abs</code>, <code>Math.sqrt</code>, <code>Math.hypot</code>, <code>Math.PI</code>, <code>Math.cos</code>… A real example:</p>
~~~js title="web/engine/worker.js"
percent = Math.min(100, Math.max(0, Math.floor(percent)));   // «1»
~~~
<ol class="notes"><li>"Clamps" the percentage between 0 and 100, rounded down: a progress bar must never show 103%.</li></ol>

<h3>Typed arrays: the raw memory of meshes</h3>
<p>A 3D mesh is <strong>millions of numbers</strong>: 3 coordinates per vertex, 3 vertex numbers per triangle. A normal array <code>[ … ]</code> would be slow and greedy. We use <span class="term" data-term="typed-array">typed arrays</span>: a run of bytes in memory, all of the same type, like a C++ array.</p>
<table>
<thead><tr><th>Type</th><th>Content</th><th>Bytes / value</th><th>C++ equivalent</th></tr></thead>
<tbody>
<tr><td><code>Float32Array</code></td><td>single-precision floats</td><td>4</td><td><code>float[]</code></td></tr>
<tr><td><code>Float64Array</code></td><td>double-precision floats</td><td>8</td><td><code>double[]</code></td></tr>
<tr><td><code>Uint32Array</code></td><td>positive integers 0…4 billion</td><td>4</td><td><code>uint32_t[]</code></td></tr>
<tr><td><code>Uint8Array</code></td><td>bytes 0…255 (raw files)</td><td>1</td><td><code>uint8_t[]</code></td></tr>
</tbody></table>
~~~js title="The result contract (SPEC.md)"
mesh: { positions: Float32Array /* xyz, mm */, indices: Uint32Array }
~~~
~~~js run
// A single triangle: 3 vertices × 3 coordinates
const positions = new Float32Array([0, 0, 0,   10, 0, 0,   0, 10, 0]);
const indices = new Uint32Array([0, 1, 2]);
console.log(positions.length, 'numbers,', positions.byteLength, 'bytes');
// Coordinates of vertex no. 1:
const i = indices[1];
console.log(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
// A Uint8Array wraps what overflows:
console.log(new Uint8Array([255, 256, 300]));
~~~
<p>These arrays sit on an <code>ArrayBuffer</code> (the block of bytes). The worker can <strong>transfer</strong> that block to the page without copying it: that is the job of <code>transferables()</code> in <code>worker.js</code>, which lists the <code>.buffer</code> of the positions and indices. It is also a <code>Uint8Array</code> (<code>new Uint8Array(msg.bytes)</code>) that hands the bytes of the STEP file to OpenCascade.</p>

<h3>Measuring performance</h3>
~~~js run
const t0 = performance.now();
let s = 0;
for (let k = 0; k < 1e6; k++) s += Math.sqrt(k);
console.log('Computation:', (performance.now() - t0).toFixed(1), 'ms');
~~~
<p><code>performance.now()</code> gives the time in milliseconds with decimals. 3D Reader uses it to send progress at most every 200 ms.</p>
`,
  },
  deep: {
    fr: `
<h3>Autrement dit : la boîte à œufs</h3>
<div class="callout analogy">Un tableau normal <code>[ … ]</code>, c'est un <strong>sac</strong> : on y met n'importe quoi (un nombre, un texte, un objet), mais il faut fouiller pour trouver. Un <strong>tableau typé</strong>, c'est une <strong>boîte à œufs</strong> : des alvéoles toutes identiques, alignées, numérotées. On ne peut y mettre que des œufs du bon calibre, mais on en range des millions sans perdre de place, et on trouve l'alvéole n° 2 000 000 instantanément.</div>
<h4>Comment un maillage est rangé</h4>
~~~text
positions (Float32Array) : x0 y0 z0 | x1 y1 z1 | x2 y2 z2 | x3 y3 z3 …
                           sommet 0   sommet 1   sommet 2   sommet 3
indices   (Uint32Array)  : 0 1 2 | 0 2 3 …
                           triangle 0  triangle 1
→ le sommet n° k commence à la case 3 × k
→ un carré = 2 triangles qui partagent les sommets 0 et 2
~~~
~~~js run
// Un carré de 10 mm : 4 sommets, 2 triangles
const positions = new Float32Array([0,0,0,  10,0,0,  10,10,0,  0,10,0]);
const indices = new Uint32Array([0,1,2,  0,2,3]);
const nbTriangles = indices.length / 3;
console.log('Triangles :', nbTriangles);
// Aire de chaque triangle (moitié du produit vectoriel)
let aire = 0;
for (let t = 0; t < nbTriangles; t++) {
  const [a, b, c] = [indices[3*t], indices[3*t+1], indices[3*t+2]];
  const ux = positions[3*b] - positions[3*a], uy = positions[3*b+1] - positions[3*a+1];
  const vx = positions[3*c] - positions[3*a], vy = positions[3*c+1] - positions[3*a+1];
  aire += Math.abs(ux * vy - uy * vx) / 2;
}
console.log('Aire :', aire, 'mm²');   // 100
~~~
<h4>Les pièges des nombres</h4>
<ul>
<li><code>0.1 + 0.2 !== 0.3</code> : en binaire, 0,1 ne tombe pas juste (comme 1/3 = 0,333… en décimal).</li>
<li><code>Float32Array</code> ne garde qu'environ 7 chiffres significatifs : 123456,789 devient 123456,7890625. Pour l'affichage c'est parfait, pour un volume exact on calcule en double (<code>Float64Array</code>, ou <code>positions64</code> dans 3D Reader).</li>
<li><code>toFixed(2)</code> renvoie un <strong>texte</strong>, pas un nombre.</li>
<li><code>NaN</code> est contagieux : <code>NaN + 1</code> = <code>NaN</code>. Une seule mesure ratée « empoisonne » une somme.</li>
</ul>
~~~js run
console.log(new Float32Array([123456.789])[0]);
console.log(typeof (3.14159).toFixed(2));
const mesures = [10, 20, Number('erreur'), 30];
console.log(mesures.reduce((s, v) => s + v, 0));                       // NaN
console.log(mesures.filter(Number.isFinite).reduce((s, v) => s + v, 0)); // 60
~~~
`,
    en: `
<h3>In other words: the egg box</h3>
<div class="callout analogy">A normal array <code>[ … ]</code> is a <strong>bag</strong>: you put anything in it (a number, a text, an object), but you have to rummage to find things. A <strong>typed array</strong> is an <strong>egg box</strong>: identical cells, lined up, numbered. Only eggs of the right size fit, but you store millions without wasting space, and you find cell no. 2,000,000 instantly.</div>
<h4>How a mesh is stored</h4>
~~~text
positions (Float32Array): x0 y0 z0 | x1 y1 z1 | x2 y2 z2 | x3 y3 z3 …
                          vertex 0   vertex 1   vertex 2   vertex 3
indices   (Uint32Array) : 0 1 2 | 0 2 3 …
                          triangle 0  triangle 1
→ vertex no. k starts at cell 3 × k
→ a square = 2 triangles sharing vertices 0 and 2
~~~
~~~js run
// A 10 mm square: 4 vertices, 2 triangles
const positions = new Float32Array([0,0,0,  10,0,0,  10,10,0,  0,10,0]);
const indices = new Uint32Array([0,1,2,  0,2,3]);
const triangles = indices.length / 3;
console.log('Triangles:', triangles);
// Area of each triangle (half the cross product)
let area = 0;
for (let t = 0; t < triangles; t++) {
  const [a, b, c] = [indices[3*t], indices[3*t+1], indices[3*t+2]];
  const ux = positions[3*b] - positions[3*a], uy = positions[3*b+1] - positions[3*a+1];
  const vx = positions[3*c] - positions[3*a], vy = positions[3*c+1] - positions[3*a+1];
  area += Math.abs(ux * vy - uy * vx) / 2;
}
console.log('Area:', area, 'mm²');   // 100
~~~
<h4>Number traps</h4>
<ul>
<li><code>0.1 + 0.2 !== 0.3</code>: in binary, 0.1 does not come out exact (like 1/3 = 0.333… in decimal).</li>
<li><code>Float32Array</code> keeps only about 7 significant digits: 123456.789 becomes 123456.7890625. Fine for display; for an exact volume, compute in double (<code>Float64Array</code>, or <code>positions64</code> in 3D Reader).</li>
<li><code>toFixed(2)</code> returns a <strong>text</strong>, not a number.</li>
<li><code>NaN</code> is contagious: <code>NaN + 1</code> = <code>NaN</code>. One failed measurement "poisons" a sum.</li>
</ul>
~~~js run
console.log(new Float32Array([123456.789])[0]);
console.log(typeof (3.14159).toFixed(2));
const measures = [10, 20, Number('error'), 30];
console.log(measures.reduce((s, v) => s + v, 0));                       // NaN
console.log(measures.filter(Number.isFinite).reduce((s, v) => s + v, 0)); // 60
~~~
`,
  },
};

const C = (fr, en) => ({ fr, en });

const questions = [
  // ---------------------------------------------------------------- js-1 (syntax)
  { id: 'js-q1', skill: 'js.syntax', lesson: 'js-1', level: 1, type: 'mcq',
    prompt: C("Quel mot-clé choisir pour une variable qui ne sera <strong>jamais réassignée</strong> ?", 'Which keyword for a variable that will <strong>never be reassigned</strong>?'),
    choices: C(['const', 'let', 'var', 'static'], ['const', 'let', 'var', 'static']), answer: 0,
    explain: C("<code>const</code> empêche la réassignation : c'est le choix par défaut. <code>let</code> sert aux valeurs qui changent ; <code>var</code> est l'ancienne forme à éviter.", '<code>const</code> forbids reassignment: it is the default choice. <code>let</code> is for changing values; <code>var</code> is the old form to avoid.') },
  { id: 'js-q2', skill: 'js.syntax', lesson: 'js-1', level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const t = [1, 2];\nt.push(3);\nconsole.log(t.length);`, lang: 'js',
    choices: C(['3', '2', 'Une erreur : t est constant', 'undefined'], ['3', '2', 'An error: t is constant', 'undefined']), answer: 0,
    explain: C("<code>const</code> protège l'étiquette, pas le contenu : on peut ajouter des éléments au tableau. Seul <code>t = […]</code> serait interdit.", '<code>const</code> protects the label, not the content: elements can be added to the array. Only <code>t = […]</code> would be forbidden.') },
  { id: 'js-q3', skill: 'js.syntax', lesson: 'js-1', level: 1, type: 'fill',
    prompt: C("Complète pour afficher <em>Volume : 12 mm³</em> avec une chaîne gabarit.", 'Fill in to print <em>Volume: 12 mm³</em> with a template string.'),
    code: `const v = 12;\nconsole.log(\`Volume : ____{v} mm³\`);`, lang: 'js',
    accept: ['$'],
    explain: C("Dans une chaîne entre accents graves, <code>\${expression}</code> insère la valeur. Le symbole manquant est <code>$</code>.", 'Inside a backtick string, <code>\${expression}</code> inserts the value. The missing symbol is <code>$</code>.') },
  { id: 'js-q4', skill: 'js.syntax', lesson: 'js-1', level: 2, type: 'tf',
    prompt: C("<code>const f = (x) =&gt; x * 2;</code> et <code>function f(x) { return x * 2; }</code> renvoient le même résultat pour <code>f(4)</code>.", '<code>const f = (x) =&gt; x * 2;</code> and <code>function f(x) { return x * 2; }</code> return the same result for <code>f(4)</code>.'),
    answer: true,
    explain: C("Les deux valent 8. La fonction fléchée sans accolades renvoie directement son expression.", 'Both give 8. An arrow function without braces directly returns its expression.') },

  // ---------------------------------------------------------------- js-2 (collections)
  { id: 'js-q5', skill: 'js.collections', lesson: 'js-2', level: 1, type: 'match',
    prompt: C('Associe chaque méthode à ce qu\'elle renvoie.', 'Match each method with what it returns.'),
    pairs: C(
      [['map', 'un tableau de même longueur'], ['filter', 'un tableau peut-être plus court'], ['reduce', 'une seule valeur cumulée'], ['find', 'le premier élément trouvé'], ['some', 'true ou false']],
      [['map', 'an array of the same length'], ['filter', 'a possibly shorter array'], ['reduce', 'a single accumulated value'], ['find', 'the first element found'], ['some', 'true or false']]),
    explain: C("Retenir ce que chaque méthode <em>renvoie</em> permet de lire une chaîne <code>.filter().map().reduce()</code> d'un coup d'œil.", 'Knowing what each method <em>returns</em> lets you read a <code>.filter().map().reduce()</code> chain at a glance.') },
  { id: 'js-q6', skill: 'js.collections', lesson: 'js-2', level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const vols = [100, 250, 50];\nconsole.log(vols.filter((v) => v > 80).map((v) => v / 10));`, lang: 'js',
    choices: C(['[10, 25]', '[10, 25, 5]', '[100, 250]', '35'], ['[10, 25]', '[10, 25, 5]', '[100, 250]', '35']), answer: 0,
    explain: C("<code>filter</code> garde 100 et 250 ; <code>map</code> divise chacun par 10 → <code>[10, 25]</code>.", '<code>filter</code> keeps 100 and 250; <code>map</code> divides each by 10 → <code>[10, 25]</code>.') },
  { id: 'js-q7', skill: 'js.collections', lesson: 'js-2', level: 1, type: 'mcq',
    prompt: C("Dans <code>client.js</code>, <code>const pending = new Map()</code> sert à :", 'In <code>client.js</code>, <code>const pending = new Map()</code> is used to:'),
    choices: C(['retrouver une demande en attente grâce à son numéro', 'dessiner une carte 3D', 'stocker la liste des fichiers du disque', 'trier les corps par volume'],
      ['find a pending request by its number', 'draw a 3D map', 'store the list of files on disk', 'sort the bodies by volume']), answer: 0,
    explain: C("Chaque demande au worker reçoit un <code>id</code> ; <code>pending.set(id, …)</code> la range, <code>pending.get(data.id)</code> la retrouve quand la réponse arrive.", 'Each request to the worker gets an <code>id</code>; <code>pending.set(id, …)</code> stores it, <code>pending.get(data.id)</code> finds it when the answer arrives.') },
  { id: 'js-q8', skill: 'js.collections', lesson: 'js-2', level: 2, type: 'fill',
    prompt: C("Quelle méthode d'une <code>Map</code> lit la valeur rangée sous une clé ?", 'Which <code>Map</code> method reads the value stored under a key?'),
    code: `const m = new Map();\nm.set(7, 'carter');\nconsole.log(m.____(7));`, lang: 'js',
    accept: ['get'],
    explain: C("<code>get(clé)</code>. Attention, <code>m[7]</code> ne marche pas sur une <code>Map</code> : renvoie <code>undefined</code>.", '<code>get(key)</code>. Beware, <code>m[7]</code> does not work on a <code>Map</code>: it returns <code>undefined</code>.') },

  // ---------------------------------------------------------------- js-3 (modern)
  { id: 'js-q9', skill: 'js.modern', lesson: 'js-3', level: 1, type: 'mcq',
    prompt: C("Dans <code>worker.onmessage = ({ data }) =&gt; { … }</code>, que signifie <code>({ data })</code> ?", 'In <code>worker.onmessage = ({ data }) =&gt; { … }</code>, what does <code>({ data })</code> mean?'),
    choices: C(["La fonction reçoit un objet et n'en garde que le champ data", 'La fonction crée un nouvel objet vide', 'data est une variable globale', 'La fonction ne prend aucun paramètre'],
      ['The function receives an object and keeps only its data field', 'The function creates a new empty object', 'data is a global variable', 'The function takes no parameter']), answer: 0,
    explain: C("C'est une déstructuration dans les paramètres : l'événement reçu est « déballé » et seul <code>data</code> est gardé.", 'It is destructuring in the parameters: the received event is "unpacked" and only <code>data</code> is kept.') },
  { id: 'js-q10', skill: 'js.modern', lesson: 'js-3', level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const n = 0;\nconsole.log(n || 5, n ?? 5);`, lang: 'js',
    choices: C(['5 0', '0 5', '5 5', '0 0'], ['5 0', '0 5', '5 5', '0 0']), answer: 0,
    explain: C("<code>||</code> remplace toute valeur « fausse » (0 compris) ; <code>??</code> ne remplace que <code>null</code> et <code>undefined</code>.", '<code>||</code> replaces any "falsy" value (0 included); <code>??</code> only replaces <code>null</code> and <code>undefined</code>.') },
  { id: 'js-q11', skill: 'js.modern', lesson: 'js-3', level: 2, type: 'tf',
    prompt: C("Si <code>job</code> vaut <code>undefined</code>, la ligne <code>job?.onProgress?.(data);</code> provoque une erreur.", 'If <code>job</code> is <code>undefined</code>, the line <code>job?.onProgress?.(data);</code> throws an error.'),
    answer: false,
    explain: C("Le chaînage optionnel <code>?.</code> s'arrête et renvoie <code>undefined</code> sans planter : rien n'est appelé.", 'Optional chaining <code>?.</code> stops and returns <code>undefined</code> without crashing: nothing is called.') },
  { id: 'js-q12', skill: 'js.modern', lesson: 'js-3', level: 1, type: 'fill',
    prompt: C("Complète pour copier <code>message</code> en lui ajoutant <code>id</code>.", 'Fill in to copy <code>message</code> while adding <code>id</code>.'),
    code: `getWorker().postMessage({ ____message, id }, transfer);`, lang: 'js',
    accept: ['...'],
    explain: C("Le spread <code>...</code> étale tous les champs de <code>message</code> dans le nouvel objet ; <code>id</code> est ajouté à côté.", 'The spread <code>...</code> spreads every field of <code>message</code> into the new object; <code>id</code> is added next to them.') },

  // ---------------------------------------------------------------- js-4 (modules)
  { id: 'js-q13', skill: 'js.modules', lesson: 'js-4', level: 1, type: 'tf',
    prompt: C("Une fonction déclarée <strong>sans</strong> <code>export</code> dans <code>client.js</code> peut être importée par <code>app.js</code>.", 'A function declared <strong>without</strong> <code>export</code> in <code>client.js</code> can be imported by <code>app.js</code>.'),
    answer: false,
    explain: C("Sans <code>export</code>, elle reste privée au module (comme <code>resetWorker</code>). Seuls les noms exportés sont accessibles.", 'Without <code>export</code>, it stays private to the module (like <code>resetWorker</code>). Only exported names are accessible.') },
  { id: 'js-q14', skill: 'js.modules', lesson: 'js-4', level: 2, type: 'mcq',
    prompt: C("Pourquoi <code>ai-workspace.js</code> écrit-il <code>await import('./chiffrage/ai-trace.js')</code> plutôt qu'un import en haut du fichier ?", 'Why does <code>ai-workspace.js</code> write <code>await import(\'./chiffrage/ai-trace.js\')</code> instead of an import at the top of the file?'),
    choices: C(["Pour ne charger ce code que s'il sert, et ouvrir la page plus vite", 'Parce que les imports en haut sont interdits dans le navigateur', 'Pour pouvoir modifier le fichier importé', 'Pour importer un fichier Python'],
      ['To load this code only when needed, and open the page faster', 'Because top imports are forbidden in the browser', 'To be able to modify the imported file', 'To import a Python file']), answer: 0,
    explain: C("L'import dynamique charge le module à la demande et renvoie une promesse, d'où le <code>await</code>.", 'Dynamic import loads the module on demand and returns a promise, hence the <code>await</code>.') },
  { id: 'js-q15', skill: 'js.modules', lesson: 'js-4', level: 1, type: 'match',
    prompt: C('Associe chaque écriture à son sens.', 'Match each form with its meaning.'),
    pairs: C(
      [["import { t } from './i18n.js'", 'prendre le nom exporté t'], ["import mod from './x.js'", "prendre l'export par défaut"], ["import * as THREE from 'three'", 'tout prendre, rangé dans THREE'], ["export function f() {}", 'rendre f accessible aux autres fichiers']],
      [["import { t } from './i18n.js'", 'take the exported name t'], ["import mod from './x.js'", 'take the default export'], ["import * as THREE from 'three'", 'take everything, inside THREE'], ["export function f() {}", 'make f available to other files']]),
    explain: C("Accolades = noms précis ; sans accolades = export par défaut ; <code>* as</code> = tout le module.", 'Braces = precise names; no braces = default export; <code>* as</code> = the whole module.') },
  { id: 'js-q16', skill: 'js.modules', lesson: 'js-4', level: 3, type: 'mcq',
    prompt: C("Dans <code>worker.js</code>, que vaut <code>new URL('../', import.meta.url).href</code> si le fichier est <code>https://site/3D-reader/engine/worker.js</code> ?", 'In <code>worker.js</code>, what is <code>new URL(\'../\', import.meta.url).href</code> if the file is <code>https://site/3D-reader/engine/worker.js</code>?'),
    choices: C(['https://site/3D-reader/', 'https://site/', 'https://site/3D-reader/engine/', 'https://site/3D-reader/engine/worker.js/..'], ['https://site/3D-reader/', 'https://site/', 'https://site/3D-reader/engine/', 'https://site/3D-reader/engine/worker.js/..']), answer: 0,
    explain: C("<code>import.meta.url</code> est l'adresse du fichier ; <code>../</code> remonte du dossier <code>engine/</code> à son parent, la racine du site où se trouve <code>vendor/</code>.", '<code>import.meta.url</code> is the file\'s address; <code>../</code> goes from the <code>engine/</code> folder up to its parent, the site root where <code>vendor/</code> lives.') },

  // ---------------------------------------------------------------- js-5 (classes)
  { id: 'js-q17', skill: 'js.classes', lesson: 'js-5', level: 1, type: 'match',
    prompt: C('Associe le mot JS à son équivalent Python.', 'Match the JS word with its Python equivalent.'),
    pairs: C([['constructor', '__init__'], ['this', 'self'], ['extends', 'class B(A)'], ['super(…)', 'super().__init__(…)']], [['constructor', '__init__'], ['this', 'self'], ['extends', 'class B(A)'], ['super(…)', 'super().__init__(…)']]),
    explain: C("Les concepts sont les mêmes ; seule l'écriture change. En JS, <code>this</code> n'apparaît pas dans la liste des paramètres.", 'The concepts are the same; only the spelling changes. In JS, <code>this</code> does not appear in the parameter list.') },
  { id: 'js-q18', skill: 'js.classes', lesson: 'js-5', level: 2, type: 'line',
    prompt: C("Clique sur la ligne qui appelle le constructeur de la classe parente.", "Click the line that calls the parent class's constructor."),
    code: `export class FileExistsError extends Error {\n  constructor(name) {\n    super(\`le fichier « \${name} » existe déjà\`);\n    this.name = "FileExistsError";\n  }\n}`, lang: 'js',
    answer: 2,
    explain: C("<code>super(…)</code> appelle le constructeur de <code>Error</code> avec le message. Il doit venir avant toute utilisation de <code>this</code>.", '<code>super(…)</code> calls <code>Error</code>\'s constructor with the message. It must come before any use of <code>this</code>.') },
  { id: 'js-q19', skill: 'js.classes', lesson: 'js-5', level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `class Boite {\n  constructor(v) { this.v = v; }\n  get double() { return this.v * 2; }\n}\nconst b = new Boite(4);\nconsole.log(b.double);`, lang: 'js',
    choices: C(['8', '4', 'undefined', 'Une erreur : il faut b.double()'], ['8', '4', 'undefined', 'An error: b.double() is needed']), answer: 0,
    explain: C("<code>get</code> définit un getter : il se lit comme un champ, sans parenthèses, et calcule <code>4 * 2</code>.", '<code>get</code> defines a getter: it is read like a field, without parentheses, and computes <code>4 * 2</code>.') },

  // ---------------------------------------------------------------- js-6 (async)
  { id: 'js-q20', skill: 'js.async', lesson: 'js-6', level: 2, type: 'order',
    prompt: C("Dans quel ordre s'affichent les lettres ?", 'In which order are the letters printed?'),
    code: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');`, lang: 'js',
    items: C(['A', 'D', 'C', 'B'], ['A', 'D', 'C', 'B']),
    explain: C("Le code en cours s'exécute d'abord jusqu'au bout (A, D), puis les suites de promesses (C), puis les minuteurs, même à 0 ms (B).", 'The current code runs to the end first (A, D), then promise continuations (C), then timers, even at 0 ms (B).') },
  { id: 'js-q21', skill: 'js.async', lesson: 'js-6', level: 1, type: 'mcq',
    prompt: C("Une <code>Promise</code>, c'est :", 'A <code>Promise</code> is:'),
    choices: C(["un résultat qui n'existe pas encore, tenu (resolve) ou rompu (reject) plus tard", 'une boucle qui attend en bloquant la page', 'un fichier téléchargé', 'une variable constante'],
      ['a result that does not exist yet, fulfilled (resolve) or rejected (reject) later', 'a loop that waits by blocking the page', 'a downloaded file', 'a constant variable']), answer: 0,
    explain: C("Comme un ticket de retrait : on le garde et on est prévenu quand c'est prêt — ou que ça a échoué.", 'Like a pick-up ticket: you keep it and get notified when it is ready — or when it failed.') },
  { id: 'js-q22', skill: 'js.async', lesson: 'js-6', level: 2, type: 'mcq',
    prompt: C("Que fait <code>await Promise.all([a, b])</code> ?", 'What does <code>await Promise.all([a, b])</code> do?'),
    choices: C(['Attend que a ET b soient terminées, et renvoie leurs deux résultats', 'Attend la plus rapide des deux', 'Exécute a puis b, l\'une après l\'autre', 'Ignore les erreurs'],
      ['Waits until a AND b are done, and returns both results', 'Waits for the fastest of the two', 'Runs a then b, one after the other', 'Ignores errors']), answer: 0,
    explain: C("Les deux tournent en parallèle ; le résultat est un tableau <code>[résultatA, résultatB]</code>. Si l'une échoue, le tout échoue (sinon : <code>Promise.allSettled</code>).", 'Both run in parallel; the result is an array <code>[resultA, resultB]</code>. If one fails, everything fails (otherwise: <code>Promise.allSettled</code>).') },
  { id: 'js-q23', skill: 'js.async', lesson: 'js-6', level: 1, type: 'fill',
    prompt: C("Quel mot faut-il placer devant <code>function</code> pour pouvoir utiliser <code>await</code> à l'intérieur ?", 'Which word must go before <code>function</code> to be able to use <code>await</code> inside?'),
    code: `____ function charger() {\n  const r = await fetch('config.json');\n}`, lang: 'js',
    accept: ['async'],
    explain: C("<code>async</code> marque la fonction comme asynchrone : elle renvoie une promesse et peut contenir des <code>await</code>.", '<code>async</code> marks the function as asynchronous: it returns a promise and may contain <code>await</code>.') },

  // ---------------------------------------------------------------- js-7 (typed)
  { id: 'js-q24', skill: 'js.typed', lesson: 'js-7', level: 1, type: 'mcq',
    prompt: C("Quel type contient les coordonnées xyz d'un maillage dans le contrat de résultat de 3D Reader ?", "Which type holds the xyz coordinates of a mesh in 3D Reader's result contract?"),
    choices: C(['Float32Array', 'Uint32Array', 'Array de textes', 'Map'], ['Float32Array', 'Uint32Array', 'Array of texts', 'Map']), answer: 0,
    explain: C("<code>positions</code> est un <code>Float32Array</code> (flottants, mm) ; <code>indices</code> est un <code>Uint32Array</code> (numéros de sommets).", '<code>positions</code> is a <code>Float32Array</code> (floats, mm); <code>indices</code> is a <code>Uint32Array</code> (vertex numbers).') },
  { id: 'js-q25', skill: 'js.typed', lesson: 'js-7', level: 2, type: 'tf',
    prompt: C("<code>NaN === NaN</code> vaut <code>true</code>.", '<code>NaN === NaN</code> is <code>true</code>.'),
    answer: false,
    explain: C("<code>NaN</code> n'est égal à rien, pas même à lui-même. On teste avec <code>Number.isNaN(x)</code>.", '<code>NaN</code> equals nothing, not even itself. Test with <code>Number.isNaN(x)</code>.') },
  { id: 'js-q26', skill: 'js.typed', lesson: 'js-7', level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const p = new Float32Array([0,0,0, 10,0,0, 0,10,0]);\nconst k = 2;\nconsole.log(p[3 * k + 1]);`, lang: 'js',
    choices: C(['10', '0', '2', 'undefined'], ['10', '0', '2', 'undefined']), answer: 0,
    explain: C("Le sommet n° 2 commence à la case 3 × 2 = 6 : (0, 10, 0). La case 7 est son y : 10.", 'Vertex no. 2 starts at cell 3 × 2 = 6: (0, 10, 0). Cell 7 is its y: 10.') },
  { id: 'js-q27', skill: 'js.typed', lesson: 'js-7', level: 1, type: 'mcq',
    prompt: C("Que fait <code>Math.min(100, Math.max(0, x))</code> ?", 'What does <code>Math.min(100, Math.max(0, x))</code> do?'),
    choices: C(['Borne x entre 0 et 100', 'Renvoie toujours 100', 'Arrondit x', 'Calcule une moyenne'], ['Clamps x between 0 and 100', 'Always returns 100', 'Rounds x', 'Computes an average']), answer: 0,
    explain: C("<code>Math.max(0, x)</code> remonte les valeurs négatives à 0, puis <code>Math.min(100, …)</code> écrête au-dessus de 100. Le worker l'utilise pour le pourcentage de progression.", '<code>Math.max(0, x)</code> raises negatives to 0, then <code>Math.min(100, …)</code> caps above 100. The worker uses it for the progress percentage.') },

  // ================================================================ EXTRA (remediation)
  { id: 'js-q28', skill: 'js.syntax', extra: true, level: 1, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const triple = (x) => { x * 3 };\nconsole.log(triple(2));`, lang: 'js',
    choices: C(['undefined', '6', '2', 'Une erreur'], ['undefined', '6', '2', 'An error']), answer: 0,
    explain: C("Avec des accolades, il faut écrire <code>return</code>. Sans <code>return</code>, la fonction renvoie <code>undefined</code>. Corrigé : <code>(x) =&gt; x * 3</code>.", 'With braces, you must write <code>return</code>. Without it, the function returns <code>undefined</code>. Fixed: <code>(x) =&gt; x * 3</code>.') },
  { id: 'js-q29', skill: 'js.syntax', extra: true, level: 1, type: 'tf',
    prompt: C("<code>'Volume \${v}'</code> (guillemets simples) remplace <code>\${v}</code> par la valeur de v.", "<code>'Volume \${v}'</code> (single quotes) replaces <code>\${v}</code> with the value of v."),
    answer: false,
    explain: C("Seules les chaînes entre accents graves <code>\`…\`</code> interprètent <code>\${…}</code>.", 'Only backtick strings <code>\`…\`</code> interpret <code>\${…}</code>.') },
  { id: 'js-q30', skill: 'js.syntax', extra: true, level: 2, type: 'line',
    prompt: C("Une de ces lignes provoque une erreur à l'exécution. Laquelle ?", 'One of these lines throws an error at run time. Which one?'),
    code: `let compteur = 0;\ncompteur = compteur + 1;\nconst nom = 'carter';\nnom = 'support';\nconsole.log(compteur, nom);`, lang: 'js',
    answer: 3,
    explain: C("<code>nom</code> est un <code>const</code> : le réassigner donne <code>TypeError: Assignment to constant variable</code>. <code>compteur</code>, déclaré avec <code>let</code>, peut changer.", '<code>nom</code> is a <code>const</code>: reassigning it gives <code>TypeError: Assignment to constant variable</code>. <code>compteur</code>, declared with <code>let</code>, may change.') },
  { id: 'js-q31', skill: 'js.syntax', extra: true, level: 2, type: 'mcq',
    prompt: C("À quoi sert un commentaire qui commence par <code>/**</code> au-dessus d'une fonction ?", 'What is a comment starting with <code>/**</code> above a function for?'),
    choices: C(["C'est de la JSDoc : une documentation affichée par l'éditeur au survol", 'Il désactive la fonction', 'Il rend la fonction privée', 'Il est obligatoire pour exporter'],
      ['It is JSDoc: documentation shown by the editor on hover', 'It disables the function', 'It makes the function private', 'It is required to export']), answer: 0,
    explain: C("La JSDoc décrit ce que fait la fonction, ses paramètres et son résultat. Dans 3D Reader, lis-la toujours en premier.", 'JSDoc describes what the function does, its parameters and its result. In 3D Reader, always read it first.') },

  { id: 'js-q32', skill: 'js.collections', extra: true, level: 1, type: 'mcq',
    prompt: C("Quel indice désigne le <strong>premier</strong> élément d'un tableau ?", 'Which index refers to the <strong>first</strong> element of an array?'),
    choices: C(['0', '1', '-1', 'first'], ['0', '1', '-1', 'first']), answer: 0,
    explain: C("Comme en Python et en C++, on compte à partir de 0. Le dernier est <code>t[t.length - 1]</code> (ou <code>t.at(-1)</code>).", 'As in Python and C++, counting starts at 0. The last one is <code>t[t.length - 1]</code> (or <code>t.at(-1)</code>).') },
  { id: 'js-q33', skill: 'js.collections', extra: true, level: 2, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const corps = [{ v: 5 }, { v: 7 }, { v: 3 }];\nconsole.log(corps.reduce((s, c) => s + c.v, 0));`, lang: 'js',
    choices: C(['15', '0', '[5, 7, 3]', '573'], ['15', '0', '[5, 7, 3]', '573']), answer: 0,
    explain: C("On part de 0 et on ajoute chaque <code>v</code> : 0 + 5 + 7 + 3 = 15.", 'Start at 0 and add each <code>v</code>: 0 + 5 + 7 + 3 = 15.') },
  { id: 'js-q34', skill: 'js.collections', extra: true, level: 2, type: 'mcq',
    prompt: C("Que renvoie <code>[...new Set([1, 2, 2, 3, 3])]</code> ?", 'What does <code>[...new Set([1, 2, 2, 3, 3])]</code> return?'),
    choices: C(['[1, 2, 3]', '[1, 2, 2, 3, 3]', '3', '{1, 2, 3}'], ['[1, 2, 3]', '[1, 2, 2, 3, 3]', '3', '{1, 2, 3}']), answer: 0,
    explain: C("Le <code>Set</code> élimine les doublons ; le spread le remet en tableau. C'est l'astuce de <code>transferables()</code> dans <code>worker.js</code>.", 'The <code>Set</code> drops duplicates; the spread turns it back into an array. That is the trick in <code>transferables()</code> in <code>worker.js</code>.') },
  { id: 'js-q35', skill: 'js.collections', extra: true, level: 3, type: 'fill',
    prompt: C("Complète pour obtenir le premier corps <strong>ouvert</strong> (un seul élément, pas un tableau).", 'Fill in to get the first <strong>open</strong> body (a single element, not an array).'),
    code: `const ouvert = bodies.____((b) => !b.closed);`, lang: 'js',
    accept: ['find'],
    explain: C("<code>find</code> renvoie le premier élément qui satisfait la condition (ou <code>undefined</code>). <code>filter</code> renverrait un tableau.", '<code>find</code> returns the first element satisfying the condition (or <code>undefined</code>). <code>filter</code> would return an array.') },

  { id: 'js-q36', skill: 'js.modern', extra: true, level: 1, type: 'mcq',
    prompt: C("Que vaut <code>name</code> après <code>const { name } = { name: 'C1', volume: 9 };</code> ?", "What is <code>name</code> after <code>const { name } = { name: 'C1', volume: 9 };</code>?"),
    choices: C(["'C1'", '9', "{ name: 'C1' }", 'undefined'], ["'C1'", '9', "{ name: 'C1' }", 'undefined']), answer: 0,
    explain: C("La déstructuration sort le champ <code>name</code> de l'objet et le range dans une variable du même nom.", 'Destructuring takes the <code>name</code> field out of the object into a variable of the same name.') },
  { id: 'js-q37', skill: 'js.modern', extra: true, level: 2, type: 'mcq',
    prompt: C("Que renvoie <code>STRINGS.fr[key] ?? STRINGS.en[key] ?? key</code> si la clé n'existe dans aucune langue ?", 'What does <code>STRINGS.fr[key] ?? STRINGS.en[key] ?? key</code> return if the key exists in no language?'),
    choices: C(['La clé elle-même', 'undefined', 'Une erreur', 'Un texte vide'], ['The key itself', 'undefined', 'An error', 'An empty text']), answer: 0,
    explain: C("Chaque <code>??</code> passe au suivant quand la valeur est <code>undefined</code> : on finit sur <code>key</code>. C'est la cascade de secours de <code>t()</code> dans <code>i18n.js</code>.", 'Each <code>??</code> moves to the next when the value is <code>undefined</code>: we end on <code>key</code>. It is the fallback cascade of <code>t()</code> in <code>i18n.js</code>.') },
  { id: 'js-q38', skill: 'js.modern', extra: true, level: 2, type: 'match',
    prompt: C('Associe chaque symbole à sa lecture.', 'Match each symbol with how it reads.'),
    pairs: C([['a?.b', 'b de a, si a existe'], ['a ?? b', 'a, ou à défaut b'], ['...obj', "tout le contenu d'obj, étalé"], ['c ? x : y', 'si c alors x sinon y']],
      [['a?.b', 'b of a, if a exists'], ['a ?? b', 'a, or failing that b'], ['...obj', "all of obj's content, spread"], ['c ? x : y', 'if c then x else y']]),
    explain: C("Lire chaque symbole comme une petite phrase rend le code de 3D Reader beaucoup plus clair.", 'Reading each symbol as a short sentence makes 3D Reader\'s code much clearer.') },
  { id: 'js-q39', skill: 'js.modern', extra: true, level: 3, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `const base = { type: 'analyze', id: 1 };\nconst msg = { ...base, id: 2 };\nconsole.log(msg.id, base.id);`, lang: 'js',
    choices: C(['2 1', '1 1', '2 2', '1 2'], ['2 1', '1 1', '2 2', '1 2']), answer: 0,
    explain: C("Le spread fait une <strong>copie</strong> ; le champ écrit après (<code>id: 2</code>) écrase celui copié. L'original <code>base</code> ne change pas.", 'The spread makes a <strong>copy</strong>; the field written after (<code>id: 2</code>) overrides the copied one. The original <code>base</code> is unchanged.') },

  { id: 'js-q40', skill: 'js.modules', extra: true, level: 1, type: 'mcq',
    prompt: C("Dans <code>import { summarize } from './summary.js'</code>, que signifie <code>./</code> ?", "In <code>import { summarize } from './summary.js'</code>, what does <code>./</code> mean?"),
    choices: C(['Le même dossier que le fichier qui importe', 'La racine du disque', 'Le dossier node_modules', 'Internet'], ['The same folder as the importing file', 'The root of the disk', 'The node_modules folder', 'The Internet']), answer: 0,
    explain: C("<code>./</code> = « ici », <code>../</code> = « le dossier au-dessus ». Un nom sans point (<code>'three'</code>) est une bibliothèque.", '<code>./</code> = "here", <code>../</code> = "the folder above". A name without a dot (<code>\'three\'</code>) is a library.') },
  { id: 'js-q41', skill: 'js.modules', extra: true, level: 2, type: 'mcq',
    prompt: C("La console affiche : <em>does not provide an export named 'sumarize'</em>. Cause la plus probable ?", "The console shows: <em>does not provide an export named 'sumarize'</em>. Most likely cause?"),
    choices: C(['Une faute de frappe dans le nom importé', 'Le serveur est en panne', 'La fonction est trop longue', 'Il manque un point-virgule'], ['A typo in the imported name', 'The server is down', 'The function is too long', 'A missing semicolon']), answer: 0,
    explain: C("Le nom entre accolades doit être <em>exactement</em> le nom exporté : ici <code>summarize</code> (deux m).", 'The name between braces must be <em>exactly</em> the exported name: here <code>summarize</code> (two m\'s).') },
  { id: 'js-q42', skill: 'js.modules', extra: true, level: 3, type: 'tf',
    prompt: C("<code>worker.js</code> peut importer <code>three</code> par son nom nu, exactement comme <code>summary.js</code>.", '<code>worker.js</code> can import <code>three</code> by its bare name, exactly like <code>summary.js</code>.'),
    answer: false,
    explain: C("Les import maps (qui disent où trouver <code>three</code>) ne s'appliquent pas dans les workers. C'est pourquoi l'enveloppe et le glTF sont calculés sur le fil principal (voir le commentaire de <code>client.js</code>).", 'Import maps (which say where <code>three</code> is) do not apply inside workers. That is why the envelope and glTF are computed on the main thread (see the comment of <code>client.js</code>).') },

  { id: 'js-q43', skill: 'js.classes', extra: true, level: 1, type: 'fill',
    prompt: C("Quel mot fabrique un nouvel objet à partir d'une classe ?", 'Which word makes a new object from a class?'),
    code: `const pending = ____ Map();`, lang: 'js',
    accept: ['new'],
    explain: C("<code>new</code> appelle le constructeur et renvoie l'objet fabriqué — comme une coulée dans la coquille.", '<code>new</code> calls the constructor and returns the object made — like a pour into the die.') },
  { id: 'js-q44', skill: 'js.classes', extra: true, level: 2, type: 'mcq',
    prompt: C("Dans une méthode, que désigne <code>this</code> lors de l'appel <code>camera.setProjection(true)</code> ?", 'Inside a method, what does <code>this</code> refer to during the call <code>camera.setProjection(true)</code>?'),
    choices: C(["L'objet camera", 'La classe ViewCamera elle-même', 'La fenêtre du navigateur', 'Le paramètre true'], ['The camera object', 'The ViewCamera class itself', 'The browser window', 'The parameter true']), answer: 0,
    explain: C("<code>this</code> est l'objet à gauche du point au moment de l'appel.", '<code>this</code> is the object left of the dot at call time.') },
  { id: 'js-q45', skill: 'js.classes', extra: true, level: 2, type: 'tf',
    prompt: C("Si <code>class B extends A</code>, alors un objet <code>new B()</code> vérifie <code>instanceof A</code>.", 'If <code>class B extends A</code>, then an object <code>new B()</code> satisfies <code>instanceof A</code>.'),
    answer: true,
    explain: C("Un B <em>est</em> un A (comme une <code>FileExistsError</code> est une <code>Error</code>). C'est pour ça qu'un <code>catch</code> générique l'attrape aussi.", 'A B <em>is</em> an A (as a <code>FileExistsError</code> is an <code>Error</code>). That is why a generic <code>catch</code> catches it too.') },

  { id: 'js-q46', skill: 'js.async', extra: true, level: 1, type: 'mcq',
    prompt: C("Qu'affiche ce code ?", 'What does this code print?'),
    code: `async function volume() { return 1500; }\nconsole.log(volume());`, lang: 'js',
    choices: C(['Promise { 1500 } (une promesse)', '1500', 'undefined', 'Une erreur'], ['Promise { 1500 } (a promise)', '1500', 'undefined', 'An error']), answer: 0,
    explain: C("Une fonction <code>async</code> renvoie toujours une promesse. Il faut <code>await volume()</code> ou <code>volume().then(…)</code> pour obtenir 1500.", 'An <code>async</code> function always returns a promise. You need <code>await volume()</code> or <code>volume().then(…)</code> to get 1500.') },
  { id: 'js-q47', skill: 'js.async', extra: true, level: 2, type: 'order',
    prompt: C("Remets dans l'ordre le trajet d'une analyse entre <code>client.js</code> et <code>worker.js</code>.", 'Put in order the journey of an analysis between <code>client.js</code> and <code>worker.js</code>.'),
    items: C(['La page crée un id et range resolve/reject dans pending', 'La page envoie postMessage({ …message, id })', 'Le worker calcule et envoie des messages de progression', 'Le worker envoie { type: "result", id, result }', 'La page retrouve la demande et appelle resolve(result)'],
      ['The page creates an id and stores resolve/reject in pending', 'The page sends postMessage({ …message, id })', 'The worker computes and sends progress messages', 'The worker sends { type: "result", id, result }', 'The page finds the request and calls resolve(result)']),
    explain: C("C'est le schéma « ticket de retrait » : la promesse est créée côté page et tenue quand la réponse portant le même id revient.", 'It is the "pick-up ticket" pattern: the promise is created on the page side and fulfilled when the answer with the same id comes back.') },
  { id: 'js-q48', skill: 'js.async', extra: true, level: 2, type: 'tf',
    prompt: C("Le bloc <code>finally</code> s'exécute même si une erreur a été levée dans le <code>try</code>.", 'The <code>finally</code> block runs even if an error was thrown in the <code>try</code>.'),
    answer: true,
    explain: C("<code>finally</code> s'exécute dans tous les cas : idéal pour masquer un indicateur « Mise à jour… ».", '<code>finally</code> runs in every case: ideal to hide an "Updating…" indicator.') },
  { id: 'js-q49', skill: 'js.async', extra: true, level: 3, type: 'mcq',
    prompt: C("Pourquoi 3D Reader fait-il l'analyse STEP dans un Web Worker plutôt que dans <code>app.js</code> ?", 'Why does 3D Reader run the STEP analysis in a Web Worker rather than in <code>app.js</code>?'),
    choices: C(["Parce que la page n'a qu'un fil : un long calcul la figerait", 'Parce que les workers calculent avec plus de précision', 'Parce que app.js ne peut pas lire de fichiers', 'Pour économiser de la mémoire'],
      ['Because the page has a single thread: a long computation would freeze it', 'Because workers compute more precisely', 'Because app.js cannot read files', 'To save memory']), answer: 0,
    explain: C("La boucle d'événements traite une tâche à la fois. Pendant un calcul de plusieurs secondes sur le fil principal, plus de clic ni de rotation 3D. Le worker est un second fil.", 'The event loop handles one task at a time. During a computation of several seconds on the main thread, no more clicks or 3D rotation. The worker is a second thread.') },

  { id: 'js-q50', skill: 'js.typed', extra: true, level: 1, type: 'mcq',
    prompt: C("Qu'affiche <code>console.log(0.1 + 0.2 === 0.3)</code> ?", 'What does <code>console.log(0.1 + 0.2 === 0.3)</code> print?'),
    choices: C(['false', 'true', 'NaN', 'Une erreur'], ['false', 'true', 'NaN', 'An error']), answer: 0,
    explain: C("0,1 et 0,2 ne sont pas représentés exactement en binaire : la somme vaut 0,30000000000000004. On compare avec une tolérance.", '0.1 and 0.2 are not exactly representable in binary: the sum is 0.30000000000000004. Compare with a tolerance.') },
  { id: 'js-q51', skill: 'js.typed', extra: true, level: 2, type: 'mcq',
    prompt: C("Un maillage a <code>indices.length === 36</code>. Combien a-t-il de triangles ?", 'A mesh has <code>indices.length === 36</code>. How many triangles does it have?'),
    choices: C(['12', '36', '108', '6'], ['12', '36', '108', '6']), answer: 0,
    explain: C("3 indices par triangle : 36 / 3 = 12 (c'est un cube : 6 faces × 2 triangles).", '3 indices per triangle: 36 / 3 = 12 (it is a cube: 6 faces × 2 triangles).') },
  { id: 'js-q52', skill: 'js.typed', extra: true, level: 2, type: 'match',
    prompt: C('Associe chaque tableau typé à son usage dans 3D Reader.', 'Match each typed array with its use in 3D Reader.'),
    pairs: C([['Float32Array', 'positions du maillage affiché'], ['Uint32Array', 'indices des triangles'], ['Uint8Array', 'octets bruts du fichier STEP'], ['Float64Array', 'calculs en double précision']],
      [['Float32Array', 'positions of the displayed mesh'], ['Uint32Array', 'triangle indices'], ['Uint8Array', 'raw bytes of the STEP file'], ['Float64Array', 'double-precision computations']]),
    explain: C("Chaque type choisit un compromis taille / précision / plage de valeurs.", 'Each type picks a trade-off between size, precision and value range.') },
  { id: 'js-q53', skill: 'js.typed', extra: true, level: 3, type: 'tf',
    prompt: C("<code>(2.456).toFixed(1)</code> renvoie le <strong>nombre</strong> 2.5.", '<code>(2.456).toFixed(1)</code> returns the <strong>number</strong> 2.5.'),
    answer: false,
    explain: C("<code>toFixed</code> renvoie un <strong>texte</strong> <code>'2.5'</code>, pour l'affichage. Pour un nombre arrondi : <code>Math.round(x * 10) / 10</code>.", '<code>toFixed</code> returns a <strong>text</strong> <code>\'2.5\'</code>, for display. For a rounded number: <code>Math.round(x * 10) / 10</code>.') },

  // ================================================================ EXAM
  { id: 'js-q54', skill: 'js.collections', level: 2, type: 'line',
    prompt: C("Dans cet extrait de <code>client.js</code>, clique sur la ligne qui <strong>retire</strong> la demande de la liste d'attente.", 'In this excerpt of <code>client.js</code>, click the line that <strong>removes</strong> the request from the waiting list.'),
    code: `} else if (data.type === 'result') {\n  pending.delete(data.id);\n  job?.resolve(data.result);\n} else if (data.type === 'error') {\n  job?.reject(new Error(data.message));`, lang: 'js',
    answer: 1,
    explain: C("<code>pending.delete(data.id)</code> retire l'entrée de la <code>Map</code> ; la ligne suivante tient la promesse avec le résultat.", '<code>pending.delete(data.id)</code> removes the entry from the <code>Map</code>; the next line fulfils the promise with the result.') },
  { id: 'js-q55', skill: 'js.modern', level: 2, type: 'mcq',
    prompt: C("Que fait <code>const [wasmBinary, factory] = await Promise.all([a, b]);</code> ?", 'What does <code>const [wasmBinary, factory] = await Promise.all([a, b]);</code> do?'),
    choices: C(['Attend a et b puis range leurs résultats dans deux variables', 'Crée un tableau de deux promesses non attendues', 'Copie a dans b', 'Exécute a seulement'],
      ['Waits for a and b then stores their results in two variables', 'Creates an array of two unawaited promises', 'Copies a into b', 'Runs a only']), answer: 0,
    explain: C("<code>Promise.all</code> + <code>await</code> donnent un tableau de résultats, que la déstructuration <code>[ , ]</code> déballe.", '<code>Promise.all</code> + <code>await</code> give an array of results, which the <code>[ , ]</code> destructuring unpacks.') },
  { id: 'js-q56', skill: 'js.syntax', level: 1, type: 'mcq',
    prompt: C("Laquelle de ces lignes déclare une fonction fléchée ?", 'Which of these lines declares an arrow function?'),
    choices: C(['const f = (a) => a + 1;', 'function f(a) { return a + 1; }', 'def f(a): return a + 1', 'int f(int a) { return a + 1; }'], ['const f = (a) => a + 1;', 'function f(a) { return a + 1; }', 'def f(a): return a + 1', 'int f(int a) { return a + 1; }']), answer: 0,
    explain: C("La flèche <code>=&gt;</code> signe la fonction fléchée. Les autres sont une fonction JS classique, du Python et du C++.", 'The arrow <code>=&gt;</code> marks an arrow function. The others are a classic JS function, Python and C++.') },
  { id: 'js-q57', skill: 'js.async', level: 2, type: 'multi',
    prompt: C("Quelles écritures attendent correctement le résultat d'une promesse <code>p</code> ?", 'Which forms correctly wait for the result of a promise <code>p</code>?'),
    choices: C(['const r = await p; (dans une fonction async)', 'p.then((r) => console.log(r));', 'const r = p; console.log(r);', 'p.wait();'], ['const r = await p; (inside an async function)', 'p.then((r) => console.log(r));', 'const r = p; console.log(r);', 'p.wait();']), answer: [0, 1],
    explain: C("<code>await</code> et <code>.then</code> sont les deux styles. Lire <code>p</code> directement donne l'objet promesse ; <code>wait()</code> n'existe pas.", '<code>await</code> and <code>.then</code> are the two styles. Reading <code>p</code> directly gives the promise object; <code>wait()</code> does not exist.') },
  { id: 'js-q58', skill: 'js.modules', level: 2, type: 'multi',
    prompt: C("Lesquelles de ces lignes sont des imports <strong>valides</strong> dans le navigateur ?", 'Which of these lines are <strong>valid</strong> imports in the browser?'),
    choices: C(["import { t } from './i18n.js';", "import { Vector3 } from 'three'; (avec import map)", "const m = await import('./chiffrage/ui.js');", "import t from i18n"], ["import { t } from './i18n.js';", "import { Vector3 } from 'three'; (with an import map)", "const m = await import('./chiffrage/ui.js');", "import t from i18n"]), answer: [0, 1, 2],
    explain: C("Le chemin doit être une chaîne entre guillemets. Un nom nu comme <code>'three'</code> fonctionne grâce à l'import map de <code>index.html</code>.", 'The path must be a quoted string. A bare name like <code>\'three\'</code> works thanks to the import map in <code>index.html</code>.') },
  { id: 'js-q59', skill: 'js.classes', level: 3, type: 'mcq',
    prompt: C("Dans <code>ViewCamera</code>, <code>if (!this.ortho) return super.updateProjectionMatrix();</code> signifie :", 'In <code>ViewCamera</code>, <code>if (!this.ortho) return super.updateProjectionMatrix();</code> means:'),
    choices: C(["En perspective, utiliser le calcul de la classe parente (three.js) ; sinon le calcul ortho maison", 'Toujours désactiver la vue orthogonale', 'Appeler la méthode en boucle', 'Supprimer la caméra'],
      ["In perspective, use the parent class's (three.js) computation; otherwise the home-made ortho one", 'Always disable the orthographic view', 'Call the method in a loop', 'Delete the camera']), answer: 0,
    explain: C("La méthode est redéfinie : elle délègue au parent (<code>super</code>) dans un cas, et fait son propre calcul dans l'autre.", 'The method is overridden: it delegates to the parent (<code>super</code>) in one case and does its own computation in the other.') },
  { id: 'js-q60', skill: 'js.typed', level: 2, type: 'fill',
    prompt: C("Quelle fonction teste si une valeur est un nombre utilisable (ni NaN, ni Infinity) ?", 'Which function tests whether a value is a usable number (neither NaN nor Infinity)?'),
    code: `if (Number.____(volume)) afficher(volume);`, lang: 'js',
    accept: ['isFinite'],
    explain: C("<code>Number.isFinite(x)</code> est faux pour <code>NaN</code>, <code>Infinity</code> et tout ce qui n'est pas un nombre.", '<code>Number.isFinite(x)</code> is false for <code>NaN</code>, <code>Infinity</code> and anything that is not a number.') },
  { id: 'js-q61', skill: 'js.collections', level: 1, type: 'mcq',
    prompt: C("Comment lit-on le volume du premier corps dans <code>result</code> ?", 'How do you read the volume of the first body in <code>result</code>?'),
    choices: C(['result.bodies[0].volume', 'result.bodies(0).volume', 'result[bodies][0][volume]', 'result.bodies.first.volume'], ['result.bodies[0].volume', 'result.bodies(0).volume', 'result[bodies][0][volume]', 'result.bodies.first.volume']), answer: 0,
    explain: C("Le point descend dans un champ, les crochets prennent un élément par son numéro.", 'The dot goes into a field, brackets take an element by its number.') },
  { id: 'js-q62', skill: 'js.modern', level: 3, type: 'line',
    prompt: C("Clique sur la ligne qui utilise une valeur de secours en cascade.", 'Click the line that uses a cascade of fallback values.'),
    code: `export function t(key, params = {}) {\n  const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;\n  return text.replace(/\\{(\\w+)\\}/g, (m, name) => (name in params ? String(params[name]) : m));\n}`, lang: 'js',
    answer: 1,
    explain: C("Ligne 2 : la langue choisie, sinon l'anglais, sinon la clé. Remarque aussi <code>params = {}</code> : un paramètre avec valeur par défaut.", 'Line 2: the chosen language, else English, else the key. Note also <code>params = {}</code>: a parameter with a default value.') },
  { id: 'js-q63', skill: 'js.async', level: 3, type: 'tf',
    prompt: C("Avec <code>Promise.all</code>, si une seule des promesses est rompue, le <code>await</code> lève une erreur.", 'With <code>Promise.all</code>, if a single promise is rejected, the <code>await</code> throws an error.'),
    answer: true,
    explain: C("<code>Promise.all</code> échoue dès le premier échec. Pour attendre tout le monde quoi qu'il arrive : <code>Promise.allSettled</code>, comme dans <code>app.js</code>.", '<code>Promise.all</code> fails on the first failure. To wait for everyone regardless: <code>Promise.allSettled</code>, as in <code>app.js</code>.') },
];

export default {
  id: 'js',
  order: 3,
  icon: '🟨',
  color: '#e0b400',
  title: { fr: 'Lire du JavaScript moderne', en: 'Reading modern JavaScript' },
  summary: {
    fr: "Les mots et symboles du JS de 3D Reader : const, fonctions fléchées, map/filter, ?. et ??, modules, classes, promesses et tableaux typés.",
    en: "The words and symbols of 3D Reader's JS: const, arrow functions, map/filter, ?. and ??, modules, classes, promises and typed arrays.",
  },
  skills: {
    'js.syntax': { fr: 'Syntaxe de base (const, let, fonctions, gabarits)', en: 'Basic syntax (const, let, functions, templates)' },
    'js.collections': { fr: 'Objets, tableaux, Map et Set', en: 'Objects, arrays, Map and Set' },
    'js.modern': { fr: 'Raccourcis modernes (déstructuration, spread, ?., ??)', en: 'Modern shortcuts (destructuring, spread, ?., ??)' },
    'js.modules': { fr: 'Modules import / export', en: 'Import / export modules' },
    'js.classes': { fr: 'Classes, new et this', en: 'Classes, new and this' },
    'js.async': { fr: 'Asynchrone : promesses, async/await', en: 'Async: promises, async/await' },
    'js.typed': { fr: 'Nombres et tableaux typés', en: 'Numbers and typed arrays' },
  },
  widgets: {},
  lessons: [L1, L2, L3, L4, L5, L6, L7],
  questions,
};
