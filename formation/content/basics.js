// Module 2 — Les bases communes Python / JS / C++.
export default {
  id: 'basics',
  order: 2,
  icon: '🧱',
  color: '#e8833a',
  title: { fr: 'Les bases communes Python / JS / C++', en: 'Common basics: Python / JS / C++' },
  summary: {
    fr: 'Variables, conditions, boucles, fonctions, collections et erreurs : les mêmes briques dans les trois langages, côte à côte.',
    en: 'Variables, conditions, loops, functions, collections and errors: the same bricks in the three languages, side by side.',
  },
  skills: {
    'basics.types': { fr: 'Variables et types', en: 'Variables and types' },
    'basics.conditions': { fr: 'Opérateurs et conditions', en: 'Operators and conditions' },
    'basics.loops': { fr: 'Boucles', en: 'Loops' },
    'basics.functions': { fr: 'Fonctions', en: 'Functions' },
    'basics.collections': { fr: 'Collections (listes, dictionnaires)', en: 'Collections (lists, dictionaries)' },
    'basics.errors': { fr: 'Erreurs et exceptions', en: 'Errors and exceptions' },
  },
  widgets: {},
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'basics-1',
      title: { fr: 'Variables et types', en: 'Variables and types' },
      skills: ['basics.types'],
      minutes: 10,
      body: {
        fr: `
<h3>Une variable, c’est une étiquette sur une boîte</h3>
<p>Une <span class="term" data-term="variable">variable</span> est un nom qui désigne une valeur rangée en mémoire : <code>volume = 1250.5</code>. Ensuite, partout où tu écris <code>volume</code>, la machine lit la valeur.</p>
<p>Chaque valeur a un <span class="term" data-term="type">type</span> : nombre entier, nombre à virgule, texte, vrai/faux… Le type dit ce qu’on peut faire avec : on additionne des nombres, on met des textes bout à bout.</p>

<div class="compare">
~~~py title="Python"
nb_corps = 3            # int
volume = 1250.5         # float
nom = "carter.step"     # str
ferme = True            # bool
couleur = None          # « rien »
~~~
~~~js title="JavaScript"
let nbCorps = 3;            // number
const volume = 1250.5;      // number aussi
const nom = "carter.step";  // string
const ferme = true;         // boolean
let couleur = null;         // « rien, volontairement »
let masse;                  // undefined : pas encore de valeur
~~~
~~~cpp title="C++"
int nbCorps = 3;
double volume = 1250.5;
std::string nom = "carter.step";
bool ferme = true;
// pas de null pour un double : on utilise
// des pointeurs ou std::optional
~~~
</div>

<h3>Les types de base</h3>
<table>
  <thead><tr><th>Idée</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>entier</td><td><code>int</code></td><td><code>number</code></td><td><code>int</code>, <code>long</code></td></tr>
    <tr><td>à virgule</td><td><code>float</code></td><td><code>number</code></td><td><code>float</code>, <code>double</code></td></tr>
    <tr><td>texte</td><td><code>str</code></td><td><code>string</code></td><td><code>std::string</code></td></tr>
    <tr><td>vrai / faux</td><td><code>True</code> / <code>False</code></td><td><code>true</code> / <code>false</code></td><td><code>true</code> / <code>false</code></td></tr>
    <tr><td>rien</td><td><code>None</code></td><td><code>null</code>, <code>undefined</code></td><td><code>nullptr</code> (pointeurs)</td></tr>
  </tbody>
</table>
<p>JavaScript n’a qu’<strong>un seul</strong> type de nombre, <code>number</code> (à virgule double précision, comme <code>double</code> en C++). Et il a <strong>deux</strong> « riens » : <code>undefined</code> (jamais rempli) et <code>null</code> (vidé exprès). Dans 3D Reader, un volume inconnu vaut <code>null</code> : <code>volume: number|null</code> dans le contrat de résultat.</p>

<h3>Typage statique ou dynamique</h3>
<ul>
  <li>En <strong>C++</strong>, le type est écrit et <em>figé</em> : <code>double volume</code> ne contiendra jamais un texte. Le compilateur vérifie avant l’exécution. C’est le typage <strong>statique</strong>.</li>
  <li>En <strong>Python</strong> et <strong>JavaScript</strong>, c’est la <em>valeur</em> qui a un type, pas la variable : on peut y ranger un nombre puis un texte. C’est le typage <strong>dynamique</strong>. Plus souple, mais les erreurs apparaissent seulement à l’exécution.</li>
</ul>

<h3><code>const</code> et <code>let</code> en JavaScript</h3>
<p><code>const</code> : l’étiquette ne peut pas être recollée sur une autre boîte. <code>let</code> : elle peut. Le code de 3D Reader utilise <code>const</code> partout où c’est possible, ce qui aide à lire : « cette valeur ne changera pas ».</p>
~~~js title="web/engine/client.js"
let worker = null;    // changera : le Worker sera créé plus tard
let nextId = 1;       // compteur qui augmente
const pending = new Map();
~~~

<h3>Essaie</h3>
~~~js run
const volume = 1250.5;         // mm³
const densite = 0.0027;        // g/mm³ (aluminium, fictif mais réaliste)
const masse = volume * densite;
console.log("Masse :", masse, "g");
console.log(typeof volume, typeof "texte", typeof true, typeof null, typeof undefined);
~~~
<div class="callout warn"><code>typeof null</code> affiche <code>"object"</code> : c’est un vieux bug historique de JavaScript, conservé pour ne rien casser. Ne t’en inquiète pas.</div>
`,
        en: `
<h3>A variable is a label on a box</h3>
<p>A <span class="term" data-term="variable">variable</span> is a name that designates a value stored in memory: <code>volume = 1250.5</code>. Then, wherever you write <code>volume</code>, the machine reads the value.</p>
<p>Each value has a <span class="term" data-term="type">type</span>: whole number, decimal number, text, true/false… The type says what you can do with it: you add numbers, you join texts end to end.</p>

<div class="compare">
~~~py title="Python"
nb_bodies = 3           # int
volume = 1250.5         # float
name = "housing.step"   # str
closed = True           # bool
colour = None           # "nothing"
~~~
~~~js title="JavaScript"
let nbBodies = 3;            // number
const volume = 1250.5;       // number too
const name = "housing.step"; // string
const closed = true;         // boolean
let colour = null;           // "nothing, on purpose"
let mass;                    // undefined: no value yet
~~~
~~~cpp title="C++"
int nbBodies = 3;
double volume = 1250.5;
std::string name = "housing.step";
bool closed = true;
// no null for a double: one uses
// pointers or std::optional
~~~
</div>

<h3>The basic types</h3>
<table>
  <thead><tr><th>Idea</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>whole number</td><td><code>int</code></td><td><code>number</code></td><td><code>int</code>, <code>long</code></td></tr>
    <tr><td>decimal</td><td><code>float</code></td><td><code>number</code></td><td><code>float</code>, <code>double</code></td></tr>
    <tr><td>text</td><td><code>str</code></td><td><code>string</code></td><td><code>std::string</code></td></tr>
    <tr><td>true / false</td><td><code>True</code> / <code>False</code></td><td><code>true</code> / <code>false</code></td><td><code>true</code> / <code>false</code></td></tr>
    <tr><td>nothing</td><td><code>None</code></td><td><code>null</code>, <code>undefined</code></td><td><code>nullptr</code> (pointers)</td></tr>
  </tbody>
</table>
<p>JavaScript has only <strong>one</strong> number type, <code>number</code> (double-precision decimal, like <code>double</code> in C++). And it has <strong>two</strong> “nothings”: <code>undefined</code> (never filled) and <code>null</code> (emptied on purpose). In 3D Reader, an unknown volume is <code>null</code>: <code>volume: number|null</code> in the result contract.</p>

<h3>Static or dynamic typing</h3>
<ul>
  <li>In <strong>C++</strong>, the type is written and <em>fixed</em>: <code>double volume</code> will never hold a text. The compiler checks before running. This is <strong>static</strong> typing.</li>
  <li>In <strong>Python</strong> and <strong>JavaScript</strong>, it is the <em>value</em> that has a type, not the variable: you can store a number then a text in it. This is <strong>dynamic</strong> typing. More flexible, but errors only show up at run time.</li>
</ul>

<h3><code>const</code> and <code>let</code> in JavaScript</h3>
<p><code>const</code>: the label cannot be stuck onto another box. <code>let</code>: it can. 3D Reader’s code uses <code>const</code> wherever possible, which helps reading: “this value will not change”.</p>
~~~js title="web/engine/client.js"
let worker = null;    // will change: the Worker is created later
let nextId = 1;       // counter that goes up
const pending = new Map();
~~~

<h3>Try it</h3>
~~~js run
const volume = 1250.5;         // mm³
const density = 0.0027;        // g/mm³ (aluminium, made-up but realistic)
const mass = volume * density;
console.log("Mass:", mass, "g");
console.log(typeof volume, typeof "text", typeof true, typeof null, typeof undefined);
~~~
<div class="callout warn"><code>typeof null</code> prints <code>"object"</code>: an old historical bug of JavaScript, kept so as not to break anything. Do not worry about it.</div>
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : les bacs du magasin</h3>
<p>Imagine le magasin de la fonderie avec des bacs étiquetés.</p>
<ul>
  <li>L’<strong>étiquette</strong> collée sur le bac, c’est le <strong>nom de la variable</strong> (<code>volume</code>).</li>
  <li>Ce qu’il y a <strong>dans</strong> le bac, c’est la <strong>valeur</strong> (<code>1250.5</code>).</li>
  <li>Le <strong>type</strong>, c’est la nature du contenu : des vis (entiers), de la poudre pesée (à virgule), une fiche écrite (texte), un voyant allumé/éteint (booléen).</li>
</ul>
~~~text
 ┌──────────────┐   ┌──────────────┐   ┌───────────────┐
 │ volume       │   │ nom          │   │ ferme         │
 │   1250.5     │   │ "carter.step"│   │   true        │
 └──────────────┘   └──────────────┘   └───────────────┘
   nombre             texte               vrai/faux
~~~
<h3>Statique ou dynamique, avec les bacs</h3>
<p>En <strong>C++</strong>, le bac porte en plus une plaque gravée « VIS UNIQUEMENT » : impossible d’y mettre de la poudre, le magasinier (le compilateur) refuse <em>avant</em> même l’ouverture de l’usine. En <strong>Python/JS</strong>, le bac accepte tout : c’est pratique, mais on peut découvrir trop tard qu’on a mis du sable à la place des vis.</p>

<h3>Ligne à ligne</h3>
~~~js
let compteur = 0;       // je crée un bac "compteur" et j'y mets 0
compteur = compteur + 1; // je lis 0, j'ajoute 1, je remets 1 dans le bac
const nom = "carter";   // bac "nom" verrouillé : son contenu ne changera pas
// nom = "autre";       // ← erreur : on ne recolle pas une étiquette const
~~~
<h3>Les erreurs classiques</h3>
<ul>
  <li><code>"3" + 2</code> donne <code>"32"</code> en JavaScript (le texte « colle » le nombre), alors que Python lève une erreur. Attention aux nombres lus dans un formulaire : ce sont des textes !</li>
  <li>Confondre <code>=</code> (ranger une valeur) et <code>===</code> (comparer) : voir la leçon suivante.</li>
  <li><code>0.1 + 0.2</code> donne <code>0.30000000000000004</code> : les nombres à virgule sont approchés, dans les trois langages. C’est pour ça que les tests de 3D Reader comparent les volumes « à une tolérance près » (<code>approx</code>).</li>
</ul>
~~~js run
console.log("3" + 2);       // "32"
console.log(Number("3") + 2); // 5
console.log(0.1 + 0.2);
~~~
`,
        en: `
<h3>Put differently: the store bins</h3>
<p>Picture the foundry store with labelled bins.</p>
<ul>
  <li>The <strong>label</strong> stuck on the bin is the <strong>variable name</strong> (<code>volume</code>).</li>
  <li>What is <strong>in</strong> the bin is the <strong>value</strong> (<code>1250.5</code>).</li>
  <li>The <strong>type</strong> is the nature of the content: screws (integers), weighed powder (decimals), a written card (text), an on/off light (boolean).</li>
</ul>
~~~text
 ┌──────────────┐   ┌───────────────┐   ┌───────────────┐
 │ volume       │   │ name          │   │ closed        │
 │   1250.5     │   │"housing.step" │   │   true        │
 └──────────────┘   └───────────────┘   └───────────────┘
   number             text                true/false
~~~
<h3>Static or dynamic, with bins</h3>
<p>In <strong>C++</strong>, the bin also has an engraved plate “SCREWS ONLY”: impossible to put powder in it, the storekeeper (the compiler) refuses <em>before</em> the plant even opens. In <strong>Python/JS</strong>, the bin accepts anything: handy, but you may find out too late that you put sand instead of screws.</p>

<h3>Line by line</h3>
~~~js
let counter = 0;         // I create a "counter" bin and put 0 in it
counter = counter + 1;   // I read 0, add 1, put 1 back in the bin
const name = "housing";  // "name" bin locked: its content will not change
// name = "other";       // ← error: a const label cannot be re-stuck
~~~
<h3>Classic mistakes</h3>
<ul>
  <li><code>"3" + 2</code> gives <code>"32"</code> in JavaScript (the text “glues” the number), whereas Python raises an error. Beware of numbers read from a form: they are texts!</li>
  <li>Mixing up <code>=</code> (store a value) and <code>===</code> (compare): see the next lesson.</li>
  <li><code>0.1 + 0.2</code> gives <code>0.30000000000000004</code>: decimal numbers are approximate, in all three languages. That is why 3D Reader’s tests compare volumes “within a tolerance” (<code>approx</code>).</li>
</ul>
~~~js run
console.log("3" + 2);         // "32"
console.log(Number("3") + 2); // 5
console.log(0.1 + 0.2);
~~~
`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'basics-2',
      title: { fr: 'Opérateurs et conditions', en: 'Operators and conditions' },
      skills: ['basics.conditions'],
      minutes: 10,
      body: {
        fr: `
<h3>Comparer, combiner, décider</h3>
<p>Un programme prend des décisions avec <code>if</code> (« si »). La condition est une expression qui vaut vrai ou faux, construite avec des <strong>opérateurs</strong>.</p>
<table>
  <thead><tr><th>Sens</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>égal</td><td><code>==</code></td><td><code>===</code></td><td><code>==</code></td></tr>
    <tr><td>différent</td><td><code>!=</code></td><td><code>!==</code></td><td><code>!=</code></td></tr>
    <tr><td>plus petit, plus grand</td><td><code>&lt; &gt; &lt;= &gt;=</code></td><td><code>&lt; &gt; &lt;= &gt;=</code></td><td><code>&lt; &gt; &lt;= &gt;=</code></td></tr>
    <tr><td>et</td><td><code>and</code></td><td><code>&amp;&amp;</code></td><td><code>&amp;&amp;</code></td></tr>
    <tr><td>ou</td><td><code>or</code></td><td><code>||</code></td><td><code>||</code></td></tr>
    <tr><td>non</td><td><code>not</code></td><td><code>!</code></td><td><code>!</code></td></tr>
  </tbody>
</table>

<div class="compare">
~~~py title="Python"
if epaisseur < 3:
    print("Paroi mince")
elif epaisseur > 20:
    print("Paroi épaisse")
else:
    print("OK")
~~~
~~~js title="JavaScript"
if (epaisseur < 3) {
  console.log("Paroi mince");
} else if (epaisseur > 20) {
  console.log("Paroi épaisse");
} else {
  console.log("OK");
}
~~~
~~~cpp title="C++"
if (epaisseur < 3) {
  std::cout << "Paroi mince\\n";
} else if (epaisseur > 20) {
  std::cout << "Paroi épaisse\\n";
} else {
  std::cout << "OK\\n";
}
~~~
</div>
<p>Python délimite les blocs par l’<strong>indentation</strong> ; JS et C++ par des <strong>accolades</strong> <code>{ }</code> et mettent la condition entre <strong>parenthèses</strong>.</p>

<h3>Pourquoi trois signes égal en JavaScript ?</h3>
<p><code>==</code> en JavaScript essaie de convertir les types avant de comparer : <code>"5" == 5</code> est vrai ! <code>===</code> compare sans conversion : <code>"5" === 5</code> est faux. Le code de 3D Reader utilise toujours <code>===</code>, comme dans <code>if (msg.type === 'preload')</code>.</p>

<h3>Le ternaire : un if en une ligne</h3>
<p><code>condition ? siVrai : siFaux</code>. On le lit « est-ce que … ? alors … sinon … ».</p>
~~~js title="web/engine/client.js"
function extensionOf(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
}
~~~
<p>Traduction : « s’il n’y a pas de point dans le nom, rends un texte vide ; sinon rends ce qui suit le dernier point, en minuscules ». <code>"Carter.STEP"</code> → <code>".step"</code>.</p>

<h3>Vrai-ish et faux-ish</h3>
<p>En JS (et en Python), <code>if (x)</code> accepte n’importe quelle valeur. Sont considérés comme faux : <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>. Tout le reste est vrai. D’où <code>if (worker) return worker;</code> : « si le worker existe déjà, rends-le ».</p>

~~~js run
const epaisseur = 2.4;
const ferme = true;
if (ferme && epaisseur < 3) {
  console.log("Corps fermé, mais paroi mince : attention au remplissage");
}
console.log("5" == 5, "5" === 5);
const statut = epaisseur >= 3 ? "OK" : "mince";
console.log(statut);
~~~
`,
        en: `
<h3>Compare, combine, decide</h3>
<p>A program makes decisions with <code>if</code>. The condition is an expression that is true or false, built with <strong>operators</strong>.</p>
<table>
  <thead><tr><th>Meaning</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>equal</td><td><code>==</code></td><td><code>===</code></td><td><code>==</code></td></tr>
    <tr><td>different</td><td><code>!=</code></td><td><code>!==</code></td><td><code>!=</code></td></tr>
    <tr><td>smaller, greater</td><td><code>&lt; &gt; &lt;= &gt;=</code></td><td><code>&lt; &gt; &lt;= &gt;=</code></td><td><code>&lt; &gt; &lt;= &gt;=</code></td></tr>
    <tr><td>and</td><td><code>and</code></td><td><code>&amp;&amp;</code></td><td><code>&amp;&amp;</code></td></tr>
    <tr><td>or</td><td><code>or</code></td><td><code>||</code></td><td><code>||</code></td></tr>
    <tr><td>not</td><td><code>not</code></td><td><code>!</code></td><td><code>!</code></td></tr>
  </tbody>
</table>

<div class="compare">
~~~py title="Python"
if thickness < 3:
    print("Thin wall")
elif thickness > 20:
    print("Thick wall")
else:
    print("OK")
~~~
~~~js title="JavaScript"
if (thickness < 3) {
  console.log("Thin wall");
} else if (thickness > 20) {
  console.log("Thick wall");
} else {
  console.log("OK");
}
~~~
~~~cpp title="C++"
if (thickness < 3) {
  std::cout << "Thin wall\\n";
} else if (thickness > 20) {
  std::cout << "Thick wall\\n";
} else {
  std::cout << "OK\\n";
}
~~~
</div>
<p>Python delimits blocks by <strong>indentation</strong>; JS and C++ by <strong>braces</strong> <code>{ }</code>, and put the condition in <strong>parentheses</strong>.</p>

<h3>Why three equal signs in JavaScript?</h3>
<p><code>==</code> in JavaScript tries to convert types before comparing: <code>"5" == 5</code> is true! <code>===</code> compares without conversion: <code>"5" === 5</code> is false. 3D Reader’s code always uses <code>===</code>, as in <code>if (msg.type === 'preload')</code>.</p>

<h3>The ternary: an if on one line</h3>
<p><code>condition ? ifTrue : ifFalse</code>. Read it as “is it …? then … otherwise …”.</p>
~~~js title="web/engine/client.js"
function extensionOf(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i).toLowerCase();
}
~~~
<p>Translation: “if there is no dot in the name, return an empty text; otherwise return what follows the last dot, in lower case”. <code>"Housing.STEP"</code> → <code>".step"</code>.</p>

<h3>Truthy and falsy</h3>
<p>In JS (and in Python), <code>if (x)</code> accepts any value. Considered false: <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>. Everything else is true. Hence <code>if (worker) return worker;</code>: “if the worker already exists, return it”.</p>

~~~js run
const thickness = 2.4;
const closed = true;
if (closed && thickness < 3) {
  console.log("Closed body, but thin wall: watch the filling");
}
console.log("5" == 5, "5" === 5);
const status = thickness >= 3 ? "OK" : "thin";
console.log(status);
~~~
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : l’aiguillage de la ligne de contrôle</h3>
<p>Une condition, c’est un aiguillage sur un convoyeur : chaque pièce passe devant un capteur, et selon la mesure elle part à gauche, à droite ou tout droit.</p>
~~~text
            pièce
              │
     épaisseur < 3 ? ──oui──► bac « paroi mince »
              │non
     épaisseur > 20 ? ─oui──► bac « paroi épaisse »
              │non
              ▼
          bac « OK »
~~~
<p>Le programme teste les conditions <strong>dans l’ordre</strong> et s’arrête à la première vraie. Les suivantes ne sont même pas regardées.</p>

<h3>ET / OU comme des interrupteurs</h3>
<ul>
  <li><code>a &amp;&amp; b</code> : deux interrupteurs <em>en série</em>. La lampe s’allume seulement si les deux sont fermés.</li>
  <li><code>a || b</code> : deux interrupteurs <em>en parallèle</em>. Un seul suffit.</li>
  <li><code>!a</code> : un inverseur.</li>
</ul>
<p>Astuce de 3D Reader : <code>a || b</code> sert aussi à donner une valeur de secours. <code>max(1, min(4, os.cpu_count() or 1))</code> dans <code>server.py</code> : « le nombre de cœurs, ou 1 si on ne le connaît pas ».</p>

<h3>Le ternaire décortiqué</h3>
~~~js
const statut = epaisseur >= 3 ? "OK" : "mince";
//             └─ question ─┘   └oui┘   └non─┘
~~~
<p>C’est exactement :</p>
~~~js
let statut;
if (epaisseur >= 3) { statut = "OK"; } else { statut = "mince"; }
~~~

<h3>Les erreurs classiques</h3>
<ul>
  <li>Écrire <code>if (x = 5)</code> au lieu de <code>if (x === 5)</code> : on <em>range</em> 5 dans x au lieu de comparer, et la condition est toujours vraie.</li>
  <li>Oublier les accolades : sans <code>{ }</code>, seule la ligne suivante dépend du <code>if</code>.</li>
  <li>Utiliser <code>==</code> en JavaScript : préfère toujours <code>===</code>.</li>
</ul>
`,
        en: `
<h3>Put differently: the switch on the inspection line</h3>
<p>A condition is a switch on a conveyor: each part passes a sensor, and depending on the measurement it goes left, right or straight on.</p>
~~~text
             part
              │
     thickness < 3 ? ──yes──► "thin wall" bin
              │no
     thickness > 20 ? ─yes──► "thick wall" bin
              │no
              ▼
          "OK" bin
~~~
<p>The program tests the conditions <strong>in order</strong> and stops at the first true one. The next ones are not even looked at.</p>

<h3>AND / OR like switches</h3>
<ul>
  <li><code>a &amp;&amp; b</code>: two switches <em>in series</em>. The lamp lights only if both are closed.</li>
  <li><code>a || b</code>: two switches <em>in parallel</em>. One is enough.</li>
  <li><code>!a</code>: an inverter.</li>
</ul>
<p>3D Reader trick: <code>a || b</code> also gives a fallback value. <code>max(1, min(4, os.cpu_count() or 1))</code> in <code>server.py</code>: “the number of cores, or 1 if unknown”.</p>

<h3>The ternary dissected</h3>
~~~js
const status = thickness >= 3 ? "OK" : "thin";
//             └─ question ─┘   └yes┘   └no─┘
~~~
<p>It is exactly:</p>
~~~js
let status;
if (thickness >= 3) { status = "OK"; } else { status = "thin"; }
~~~

<h3>Classic mistakes</h3>
<ul>
  <li>Writing <code>if (x = 5)</code> instead of <code>if (x === 5)</code>: you <em>store</em> 5 in x instead of comparing, and the condition is always true.</li>
  <li>Forgetting the braces: without <code>{ }</code>, only the next line depends on the <code>if</code>.</li>
  <li>Using <code>==</code> in JavaScript: always prefer <code>===</code>.</li>
</ul>
`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'basics-3',
      title: { fr: 'Boucles', en: 'Loops' },
      skills: ['basics.loops'],
      minutes: 10,
      body: {
        fr: `
<h3>Répéter sans recopier</h3>
<p>Un fichier STEP peut contenir des dizaines de corps, un maillage des millions de triangles. On ne va pas écrire une ligne par triangle : on écrit une <span class="term" data-term="boucle">boucle</span>, qui répète un bloc tant qu’il reste du travail.</p>

<h3>La boucle « pour chaque élément »</h3>
<div class="compare">
~~~py title="Python"
for corps in bodies:
    print(corps["name"], corps["volume"])
~~~
~~~js title="JavaScript"
for (const corps of bodies) {
  console.log(corps.name, corps.volume);
}
~~~
~~~cpp title="C++"
for (const Body& corps : bodies) {
  std::cout << corps.name << " " << corps.volume << "\\n";
}
~~~
</div>
<p>Même idée partout : « pour chaque corps de la liste, fais ceci ». En JavaScript, attention : c’est <code>for…of</code> pour les valeurs. <code>for…in</code> parcourt les <em>clés</em> d’un objet, c’est un piège fréquent.</p>

<h3>La boucle à compteur</h3>
<div class="compare">
~~~py title="Python"
for i in range(0, 10, 3):   # 0, 3, 6, 9
    print(i)
~~~
~~~js title="JavaScript"
for (let i = 0; i < 10; i += 3) {
  console.log(i);
}
~~~
~~~cpp title="C++"
for (int i = 0; i < 10; i += 3) {
  std::cout << i << "\\n";
}
~~~
</div>
<p>En JS et C++, la parenthèse a trois parties séparées par des <code>;</code> : <strong>départ</strong> (<code>let i = 0</code>), <strong>condition pour continuer</strong> (<code>i &lt; 10</code>), <strong>pas</strong> (<code>i += 3</code>). C’est le <code>range(début, fin, pas)</code> de Python écrit en clair.</p>

<div class="callout project">Les triangles d’un maillage sont rangés à plat dans un tableau d’indices : 3 numéros de sommets par triangle. Le code de 3D Reader avance donc de 3 en 3 : <code>for (let t = 0; t &lt; indices.length; t += 3)</code>.</div>

<h3>Tant que (while)</h3>
<p><code>while (condition) { … }</code> répète tant que la condition est vraie. Utile quand on ne sait pas d’avance combien de tours faire (lire un fichier jusqu’au bout, affiner un calcul jusqu’à une précision).</p>

<h3><code>break</code> et <code>continue</code></h3>
<ul>
  <li><code>break</code> : sortir de la boucle tout de suite (« trouvé, on arrête de chercher »).</li>
  <li><code>continue</code> : passer directement au tour suivant (« cette pièce ne compte pas »).</li>
</ul>

~~~js run
const volumes = [1200, 0, 830, 4500, 95];
let total = 0;
for (const v of volumes) {
  if (v === 0) continue;   // corps vide : on saute
  total += v;
}
console.log("Total :", total, "mm³");

// triangles : 2 triangles = 6 indices
const indices = [0, 1, 2, 2, 3, 0];
for (let t = 0; t < indices.length; t += 3) {
  console.log("triangle", t / 3, ":", indices[t], indices[t + 1], indices[t + 2]);
}
~~~
`,
        en: `
<h3>Repeat without copying</h3>
<p>A STEP file can hold dozens of bodies, a mesh millions of triangles. We are not going to write one line per triangle: we write a <span class="term" data-term="boucle">loop</span>, which repeats a block as long as there is work left.</p>

<h3>The “for each element” loop</h3>
<div class="compare">
~~~py title="Python"
for body in bodies:
    print(body["name"], body["volume"])
~~~
~~~js title="JavaScript"
for (const body of bodies) {
  console.log(body.name, body.volume);
}
~~~
~~~cpp title="C++"
for (const Body& body : bodies) {
  std::cout << body.name << " " << body.volume << "\\n";
}
~~~
</div>
<p>Same idea everywhere: “for each body of the list, do this”. In JavaScript, careful: it is <code>for…of</code> for values. <code>for…in</code> walks the <em>keys</em> of an object, a frequent trap.</p>

<h3>The counter loop</h3>
<div class="compare">
~~~py title="Python"
for i in range(0, 10, 3):   # 0, 3, 6, 9
    print(i)
~~~
~~~js title="JavaScript"
for (let i = 0; i < 10; i += 3) {
  console.log(i);
}
~~~
~~~cpp title="C++"
for (int i = 0; i < 10; i += 3) {
  std::cout << i << "\\n";
}
~~~
</div>
<p>In JS and C++, the parenthesis has three parts separated by <code>;</code>: <strong>start</strong> (<code>let i = 0</code>), <strong>condition to go on</strong> (<code>i &lt; 10</code>), <strong>step</strong> (<code>i += 3</code>). It is Python’s <code>range(start, stop, step)</code> spelled out.</p>

<div class="callout project">The triangles of a mesh are stored flat in an index array: 3 vertex numbers per triangle. So 3D Reader’s code steps 3 by 3: <code>for (let t = 0; t &lt; indices.length; t += 3)</code>.</div>

<h3>While</h3>
<p><code>while (condition) { … }</code> repeats as long as the condition is true. Useful when you do not know in advance how many rounds to do (reading a file to its end, refining a computation to a precision).</p>

<h3><code>break</code> and <code>continue</code></h3>
<ul>
  <li><code>break</code>: leave the loop right away (“found it, stop searching”).</li>
  <li><code>continue</code>: jump straight to the next round (“this part does not count”).</li>
</ul>

~~~js run
const volumes = [1200, 0, 830, 4500, 95];
let total = 0;
for (const v of volumes) {
  if (v === 0) continue;   // empty body: skip
  total += v;
}
console.log("Total:", total, "mm³");

// triangles: 2 triangles = 6 indices
const indices = [0, 1, 2, 2, 3, 0];
for (let t = 0; t < indices.length; t += 3) {
  console.log("triangle", t / 3, ":", indices[t], indices[t + 1], indices[t + 2]);
}
~~~
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : le contrôle à 100 %</h3>
<p>Quand un lot de 200 pièces arrive au contrôle, l’opérateur ne reçoit pas 200 consignes différentes. Il reçoit <em>une</em> consigne : « pour chaque pièce : peser, mesurer la cote A, ranger dans le bon bac ». C’est une boucle.</p>
~~~text
 lot = [p1, p2, p3, ... p200]
 pour chaque pièce p du lot :      ← en-tête de boucle
     peser p                       ← corps de boucle (répété)
     si défaut : continuer         ← passer à la suivante
     ranger p
 fin                               ← on sort quand le lot est vide
~~~

<h3>La boucle à compteur, au ralenti</h3>
~~~js
for (let i = 0; i < 3; i++) { console.log(i); }
~~~
<table>
  <thead><tr><th>Tour</th><th>i vaut</th><th>i &lt; 3 ?</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>0</td><td>oui</td><td>affiche 0, puis i++ → 1</td></tr>
    <tr><td>2</td><td>1</td><td>oui</td><td>affiche 1, puis i → 2</td></tr>
    <tr><td>3</td><td>2</td><td>oui</td><td>affiche 2, puis i → 3</td></tr>
    <tr><td>—</td><td>3</td><td>non</td><td>on sort</td></tr>
  </tbody>
</table>
<p><code>i++</code> veut dire « ajoute 1 à i ». Remarque : on compte à partir de <strong>0</strong>. Le premier élément d’un tableau est <code>tableau[0]</code> dans les trois langages.</p>

<h3>Les erreurs classiques</h3>
<ul>
  <li><strong>La boucle infinie</strong> : <code>while (x &lt; 10)</code> sans jamais changer <code>x</code>. Le programme tourne pour toujours (l’onglet du navigateur gèle).</li>
  <li><strong>Le décalage de un</strong> : <code>i &lt;= tableau.length</code> au lieu de <code>i &lt; tableau.length</code> fait un tour de trop et lit une case qui n’existe pas (<code>undefined</code>).</li>
  <li><strong>for…in au lieu de for…of</strong> en JS : on obtient les numéros <code>"0"</code>, <code>"1"</code>… (en texte !) au lieu des valeurs.</li>
</ul>
~~~js run
const corps = ["carter", "couvercle"];
for (const x in corps) console.log("for…in :", x);
for (const x of corps) console.log("for…of :", x);
~~~
`,
        en: `
<h3>Put differently: 100 % inspection</h3>
<p>When a batch of 200 parts reaches inspection, the operator does not get 200 different instructions. They get <em>one</em> instruction: “for each part: weigh, measure dimension A, put in the right bin”. That is a loop.</p>
~~~text
 batch = [p1, p2, p3, ... p200]
 for each part p of the batch:     ← loop header
     weigh p                       ← loop body (repeated)
     if defect: continue           ← go to the next one
     store p
 end                               ← we leave when the batch is empty
~~~

<h3>The counter loop, in slow motion</h3>
~~~js
for (let i = 0; i < 3; i++) { console.log(i); }
~~~
<table>
  <thead><tr><th>Round</th><th>i is</th><th>i &lt; 3?</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>0</td><td>yes</td><td>prints 0, then i++ → 1</td></tr>
    <tr><td>2</td><td>1</td><td>yes</td><td>prints 1, then i → 2</td></tr>
    <tr><td>3</td><td>2</td><td>yes</td><td>prints 2, then i → 3</td></tr>
    <tr><td>—</td><td>3</td><td>no</td><td>we leave</td></tr>
  </tbody>
</table>
<p><code>i++</code> means “add 1 to i”. Note: counting starts at <strong>0</strong>. The first element of an array is <code>array[0]</code> in all three languages.</p>

<h3>Classic mistakes</h3>
<ul>
  <li><strong>The infinite loop</strong>: <code>while (x &lt; 10)</code> without ever changing <code>x</code>. The program runs forever (the browser tab freezes).</li>
  <li><strong>Off by one</strong>: <code>i &lt;= array.length</code> instead of <code>i &lt; array.length</code> does one round too many and reads a cell that does not exist (<code>undefined</code>).</li>
  <li><strong>for…in instead of for…of</strong> in JS: you get the numbers <code>"0"</code>, <code>"1"</code>… (as text!) instead of the values.</li>
</ul>
~~~js run
const bodies = ["housing", "cover"];
for (const x in bodies) console.log("for…in:", x);
for (const x of bodies) console.log("for…of:", x);
~~~
`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'basics-4',
      title: { fr: 'Fonctions', en: 'Functions' },
      skills: ['basics.functions'],
      minutes: 12,
      body: {
        fr: `
<h3>Une fonction, c’est une machine avec une entrée et une sortie</h3>
<p>Une <span class="term" data-term="fonction">fonction</span> regroupe des instructions sous un nom, pour les réutiliser. On lui donne des <strong>paramètres</strong> (l’entrée), elle fait son travail, et elle <strong>rend</strong> un résultat avec <code>return</code> (la sortie).</p>

<div class="compare">
~~~py title="Python"
def masse(volume_mm3, densite=0.0027):
    """Masse en grammes."""
    return volume_mm3 * densite

m = masse(1250.5)
~~~
~~~js title="JavaScript"
/** Masse en grammes. */
function masse(volumeMm3, densite = 0.0027) {
  return volumeMm3 * densite;
}

const m = masse(1250.5);
~~~
~~~cpp title="C++"
// Masse en grammes.
double masse(double volumeMm3, double densite = 0.0027) {
  return volumeMm3 * densite;
}

double m = masse(1250.5);
~~~
</div>
<ul>
  <li><code>def</code> (Python), <code>function</code> (JS), le <em>type de retour</em> (C++, ici <code>double</code>) annoncent la fonction.</li>
  <li><code>densite = 0.0027</code> est une <strong>valeur par défaut</strong> : si on ne la donne pas, c’est celle-là.</li>
  <li>En C++, chaque paramètre a son type écrit : <code>double volumeMm3</code>.</li>
</ul>

<h3>Définir ou appeler</h3>
<p><strong>Définir</strong> une fonction, c’est écrire la recette (rien ne se passe encore). <strong>L’appeler</strong>, c’est l’exécuter : <code>masse(1250.5)</code>. Les parenthèses après le nom = « exécute maintenant ».</p>

<h3>Les fonctions fléchées de JavaScript</h3>
<p>Tu verras partout dans 3D Reader une écriture courte : <code>(paramètres) =&gt; résultat</code>.</p>
~~~js title="tests/js/summary.test.mjs"
const apply = (m, p, t = [0, 0, 0]) => m.map((r, i) => r[0] * p[0] + r[1] * p[1] + r[2] * p[2] + t[i]);
~~~
<p>Ça se lit : « <code>apply</code> est une fonction qui prend <code>m</code>, <code>p</code> et <code>t</code> (par défaut <code>[0,0,0]</code>) et rend… ». La flèche <code>=&gt;</code> remplace le mot <code>function</code> et, sur une ligne, le <code>return</code>.</p>

<h3>La portée : ce qui se passe dans la fonction reste dans la fonction</h3>
<p>Une variable créée <em>dans</em> une fonction n’existe que pendant son exécution, et seulement à l’intérieur. C’est la <span class="term" data-term="portee">portée</span> (scope). Deux fonctions peuvent chacune avoir leur propre <code>i</code> sans se gêner.</p>

<h3>Exporter : rendre la fonction utilisable ailleurs</h3>
<p>Le mot <code>export</code> devant une fonction JS la rend disponible pour les autres fichiers, qui l’<code>import</code>ent. <code>export function unitFactor(unit)</code> dans <code>units.js</code> : c’est l’API publique du module.</p>

~~~js run
function masse(volumeMm3, densite = 0.0027) {
  return volumeMm3 * densite;
}
const masseFlechee = (v, d = 0.0027) => v * d;

console.log(masse(1250.5));          // densité par défaut
console.log(masse(1250.5, 0.0078));  // acier, densité donnée
console.log(masseFlechee(1000));
console.log(masse);                  // sans () : la fonction elle-même, pas son résultat
~~~
`,
        en: `
<h3>A function is a machine with an input and an output</h3>
<p>A <span class="term" data-term="fonction">function</span> groups instructions under a name, to reuse them. You give it <strong>parameters</strong> (the input), it does its job, and it <strong>returns</strong> a result with <code>return</code> (the output).</p>

<div class="compare">
~~~py title="Python"
def mass(volume_mm3, density=0.0027):
    """Mass in grams."""
    return volume_mm3 * density

m = mass(1250.5)
~~~
~~~js title="JavaScript"
/** Mass in grams. */
function mass(volumeMm3, density = 0.0027) {
  return volumeMm3 * density;
}

const m = mass(1250.5);
~~~
~~~cpp title="C++"
// Mass in grams.
double mass(double volumeMm3, double density = 0.0027) {
  return volumeMm3 * density;
}

double m = mass(1250.5);
~~~
</div>
<ul>
  <li><code>def</code> (Python), <code>function</code> (JS), the <em>return type</em> (C++, here <code>double</code>) announce the function.</li>
  <li><code>density = 0.0027</code> is a <strong>default value</strong>: if you do not give it, that one is used.</li>
  <li>In C++, each parameter has its type written: <code>double volumeMm3</code>.</li>
</ul>

<h3>Define or call</h3>
<p><strong>Defining</strong> a function is writing the recipe (nothing happens yet). <strong>Calling</strong> it is running it: <code>mass(1250.5)</code>. The parentheses after the name = “run now”.</p>

<h3>JavaScript arrow functions</h3>
<p>All over 3D Reader you will see a short form: <code>(parameters) =&gt; result</code>.</p>
~~~js title="tests/js/summary.test.mjs"
const apply = (m, p, t = [0, 0, 0]) => m.map((r, i) => r[0] * p[0] + r[1] * p[1] + r[2] * p[2] + t[i]);
~~~
<p>Read it as: “<code>apply</code> is a function taking <code>m</code>, <code>p</code> and <code>t</code> (default <code>[0,0,0]</code>) and returning…”. The arrow <code>=&gt;</code> replaces the word <code>function</code> and, on one line, the <code>return</code>.</p>

<h3>Scope: what happens in the function stays in the function</h3>
<p>A variable created <em>inside</em> a function only exists while it runs, and only inside. This is the <span class="term" data-term="portee">scope</span>. Two functions can each have their own <code>i</code> without bothering each other.</p>

<h3>Export: making the function usable elsewhere</h3>
<p>The word <code>export</code> in front of a JS function makes it available to other files, which <code>import</code> it. <code>export function unitFactor(unit)</code> in <code>units.js</code>: this is the public API of the module.</p>

~~~js run
function mass(volumeMm3, density = 0.0027) {
  return volumeMm3 * density;
}
const arrowMass = (v, d = 0.0027) => v * d;

console.log(mass(1250.5));          // default density
console.log(mass(1250.5, 0.0078));  // steel, density given
console.log(arrowMass(1000));
console.log(mass);                  // without (): the function itself, not its result
~~~
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : la presse d’ébavurage</h3>
<p>Une fonction, c’est un poste de travail : une pièce brute entre, une pièce ébavurée sort. Le poste ne s’occupe pas d’où vient la pièce ni où elle ira.</p>
~~~text
          ┌───────────────────────────┐
 volume ─►│  masse(volume, densite)   │─► masse en g
 densite─►│  return volume * densite  │
          └───────────────────────────┘
~~~
<ul>
  <li>Les <strong>paramètres</strong> sont les « postes de chargement » : ils ont un nom à l’intérieur de la fonction.</li>
  <li>La <strong>valeur par défaut</strong>, c’est le réglage standard de la machine : on ne le précise que si on veut autre chose.</li>
  <li><code>return</code>, c’est la sortie du poste. Après <code>return</code>, la fonction s’arrête : les lignes suivantes ne sont pas exécutées.</li>
</ul>

<h3>Définir n’est pas exécuter</h3>
<p>Écrire la fonction, c’est installer la machine dans l’atelier. Rien ne sort tant qu’on n’y met pas de pièce. <code>masse(1250.5)</code> = mettre une pièce dans la machine.</p>

<h3>Lire une fonction fléchée en trois temps</h3>
~~~js
const double = (x) => x * 2;
//    nom      entrée   sortie
~~~
<ol>
  <li>Le <strong>nom</strong>, à gauche du <code>=</code>.</li>
  <li>Les <strong>entrées</strong>, entre parenthèses avant la flèche.</li>
  <li>La <strong>sortie</strong>, après la flèche.</li>
</ol>

<h3>La portée, comme les vestiaires</h3>
<p>Chaque appel de fonction a son propre vestiaire : ses variables locales y sont rangées, et le vestiaire est vidé quand la fonction se termine. Une autre fonction ne peut pas aller fouiller dedans.</p>

<h3>Les erreurs classiques</h3>
<ul>
  <li><strong>Oublier <code>return</code></strong> : la fonction calcule… et rend <code>undefined</code> (JS) ou <code>None</code> (Python).</li>
  <li><strong>Oublier les parenthèses</strong> : <code>masse</code> est la machine, <code>masse()</code> son résultat.</li>
  <li><strong>Inverser l’ordre des paramètres</strong> : <code>masse(0.0027, 1250.5)</code> ne plante pas, mais le résultat est faux… le même chiffre ici par chance (multiplication), mais pas pour une division !</li>
</ul>
`,
        en: `
<h3>Put differently: the trimming press</h3>
<p>A function is a work station: a raw part goes in, a trimmed part comes out. The station does not care where the part comes from or where it goes next.</p>
~~~text
          ┌───────────────────────────┐
 volume ─►│  mass(volume, density)    │─► mass in g
 density─►│  return volume * density  │
          └───────────────────────────┘
~~~
<ul>
  <li>The <strong>parameters</strong> are the “loading points”: they have a name inside the function.</li>
  <li>The <strong>default value</strong> is the machine’s standard setting: you only specify it if you want something else.</li>
  <li><code>return</code> is the station’s output. After <code>return</code>, the function stops: the following lines are not run.</li>
</ul>

<h3>Defining is not running</h3>
<p>Writing the function is installing the machine in the workshop. Nothing comes out until you put a part in. <code>mass(1250.5)</code> = putting a part into the machine.</p>

<h3>Reading an arrow function in three steps</h3>
~~~js
const double = (x) => x * 2;
//    name     input    output
~~~
<ol>
  <li>The <strong>name</strong>, left of the <code>=</code>.</li>
  <li>The <strong>inputs</strong>, in parentheses before the arrow.</li>
  <li>The <strong>output</strong>, after the arrow.</li>
</ol>

<h3>Scope, like locker rooms</h3>
<p>Each function call has its own locker room: its local variables are stored there, and the room is emptied when the function ends. Another function cannot rummage in it.</p>

<h3>Classic mistakes</h3>
<ul>
  <li><strong>Forgetting <code>return</code></strong>: the function computes… and returns <code>undefined</code> (JS) or <code>None</code> (Python).</li>
  <li><strong>Forgetting the parentheses</strong>: <code>mass</code> is the machine, <code>mass()</code> its result.</li>
  <li><strong>Swapping the parameters</strong>: <code>mass(0.0027, 1250.5)</code> does not crash, and by luck gives the same figure here (multiplication), but not for a division!</li>
</ul>
`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'basics-5',
      title: { fr: 'Collections : listes et dictionnaires', en: 'Collections: lists and dictionaries' },
      skills: ['basics.collections'],
      minutes: 12,
      body: {
        fr: `
<h3>Ranger plusieurs valeurs ensemble</h3>
<p>Deux grandes familles de rangement reviennent dans tous les langages :</p>
<ul>
  <li>la <strong>liste</strong> (tableau) : des valeurs <em>dans l’ordre</em>, numérotées à partir de 0 ;</li>
  <li>le <strong>dictionnaire</strong> (objet, map) : des valeurs rangées par <em>nom</em> (clé).</li>
</ul>

<h3>Listes</h3>
<div class="compare">
~~~py title="Python (list)"
volumes = [1200.0, 830.5, 95.2]
print(volumes[0])     # 1200.0
volumes.append(40.0)
print(len(volumes))   # 4
~~~
~~~js title="JavaScript (Array)"
const volumes = [1200.0, 830.5, 95.2];
console.log(volumes[0]);   // 1200
volumes.push(40.0);
console.log(volumes.length); // 4
~~~
~~~cpp title="C++ (std::vector)"
std::vector<double> volumes = {1200.0, 830.5, 95.2};
std::cout << volumes[0];   // 1200
volumes.push_back(40.0);
std::cout << volumes.size(); // 4
~~~
</div>
<p>Même idée, noms différents : <code>append</code> / <code>push</code> / <code>push_back</code>, <code>len()</code> / <code>.length</code> / <code>.size()</code>. En C++, le type des éléments s’écrit entre chevrons : <code>std::vector&lt;double&gt;</code>.</p>

<h3>Dictionnaires et objets</h3>
<div class="compare">
~~~py title="Python (dict)"
corps = {"name": "carter", "volume": 1200.0, "closed": True}
print(corps["volume"])
corps["mass"] = 3.24
~~~
~~~js title="JavaScript (objet)"
const corps = { name: "carter", volume: 1200.0, closed: true };
console.log(corps.volume);      // ou corps["volume"]
corps.mass = 3.24;
~~~
~~~cpp title="C++ (std::map)"
std::map<std::string, double> corps;
corps["volume"] = 1200.0;
std::cout << corps["volume"];
~~~
</div>
<p>En JavaScript, l’<strong>objet</strong> <code>{ clé: valeur }</code> est partout. Le résultat d’une analyse dans 3D Reader est un gros objet :</p>
~~~js title="SPEC.md — contrat de résultat (simplifié)"
result = {
  file: "piece.step", kind: "cad",
  summary: { volume: 1250.5, area: 980.2, bodies: 1, bbox: { size: [40, 30, 12] } },
  bodies: [ { name: "Body1", volume: 1250.5, closed: true } ],
}
~~~
<p>On lit en suivant les points : <code>result.summary.volume</code>, <code>result.bodies[0].name</code>, <code>result.summary.bbox.size[2]</code> (la hauteur, 12).</p>

<h3>Map et Set en JavaScript</h3>
<p><code>new Map()</code> est un dictionnaire dont les clés peuvent être de n’importe quel type ; <code>new Set()</code> une collection sans doublons. Dans <code>client.js</code> : <code>const pending = new Map(); // id -&gt; { resolve, reject, onProgress }</code> range les demandes en attente par numéro.</p>

<h3>Transformer une liste d’un coup</h3>
<p>Au lieu d’une boucle, JS propose des méthodes : <code>map</code> (transformer chaque élément), <code>filter</code> (garder certains), <code>reduce</code> (tout combiner en une valeur). On les reverra en détail dans le module JavaScript.</p>
~~~js title="web/engine/worker.js"
const total = msg.bodies.reduce((n, b) => n + (b ? b.indices.length : 0), 0);
~~~

~~~js run
const bodies = [
  { name: "carter", volume: 1200, closed: true },
  { name: "couvercle", volume: 830.5, closed: true },
  { name: "surface", volume: null, closed: false },
];
console.log(bodies.length, "corps ; le 2e s'appelle", bodies[1].name);
const fermes = bodies.filter((b) => b.closed);
const noms = fermes.map((b) => b.name);
const total = fermes.reduce((s, b) => s + b.volume, 0);
console.log(noms, total);
const pending = new Map();
pending.set(1, "analyse carter");
console.log(pending.get(1), pending.has(2));
~~~
`,
        en: `
<h3>Storing several values together</h3>
<p>Two big storage families come back in every language:</p>
<ul>
  <li>the <strong>list</strong> (array): values <em>in order</em>, numbered from 0;</li>
  <li>the <strong>dictionary</strong> (object, map): values stored by <em>name</em> (key).</li>
</ul>

<h3>Lists</h3>
<div class="compare">
~~~py title="Python (list)"
volumes = [1200.0, 830.5, 95.2]
print(volumes[0])     # 1200.0
volumes.append(40.0)
print(len(volumes))   # 4
~~~
~~~js title="JavaScript (Array)"
const volumes = [1200.0, 830.5, 95.2];
console.log(volumes[0]);   // 1200
volumes.push(40.0);
console.log(volumes.length); // 4
~~~
~~~cpp title="C++ (std::vector)"
std::vector<double> volumes = {1200.0, 830.5, 95.2};
std::cout << volumes[0];   // 1200
volumes.push_back(40.0);
std::cout << volumes.size(); // 4
~~~
</div>
<p>Same idea, different names: <code>append</code> / <code>push</code> / <code>push_back</code>, <code>len()</code> / <code>.length</code> / <code>.size()</code>. In C++, the element type is written in angle brackets: <code>std::vector&lt;double&gt;</code>.</p>

<h3>Dictionaries and objects</h3>
<div class="compare">
~~~py title="Python (dict)"
body = {"name": "housing", "volume": 1200.0, "closed": True}
print(body["volume"])
body["mass"] = 3.24
~~~
~~~js title="JavaScript (object)"
const body = { name: "housing", volume: 1200.0, closed: true };
console.log(body.volume);      // or body["volume"]
body.mass = 3.24;
~~~
~~~cpp title="C++ (std::map)"
std::map<std::string, double> body;
body["volume"] = 1200.0;
std::cout << body["volume"];
~~~
</div>
<p>In JavaScript, the <strong>object</strong> <code>{ key: value }</code> is everywhere. The result of an analysis in 3D Reader is a big object:</p>
~~~js title="SPEC.md — result contract (simplified)"
result = {
  file: "part.step", kind: "cad",
  summary: { volume: 1250.5, area: 980.2, bodies: 1, bbox: { size: [40, 30, 12] } },
  bodies: [ { name: "Body1", volume: 1250.5, closed: true } ],
}
~~~
<p>Read it by following the dots: <code>result.summary.volume</code>, <code>result.bodies[0].name</code>, <code>result.summary.bbox.size[2]</code> (the height, 12).</p>

<h3>Map and Set in JavaScript</h3>
<p><code>new Map()</code> is a dictionary whose keys can be of any type; <code>new Set()</code> a collection without duplicates. In <code>client.js</code>: <code>const pending = new Map(); // id -&gt; { resolve, reject, onProgress }</code> stores the pending requests by number.</p>

<h3>Transforming a list in one go</h3>
<p>Instead of a loop, JS offers methods: <code>map</code> (transform each element), <code>filter</code> (keep some), <code>reduce</code> (combine everything into one value). We will see them in detail in the JavaScript module.</p>
~~~js title="web/engine/worker.js"
const total = msg.bodies.reduce((n, b) => n + (b ? b.indices.length : 0), 0);
~~~

~~~js run
const bodies = [
  { name: "housing", volume: 1200, closed: true },
  { name: "cover", volume: 830.5, closed: true },
  { name: "surface", volume: null, closed: false },
];
console.log(bodies.length, "bodies; the 2nd is called", bodies[1].name);
const closedOnes = bodies.filter((b) => b.closed);
const names = closedOnes.map((b) => b.name);
const total = closedOnes.reduce((s, b) => s + b.volume, 0);
console.log(names, total);
const pending = new Map();
pending.set(1, "analyse housing");
console.log(pending.get(1), pending.has(2));
~~~
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : l’étagère et le casier</h3>
<ul>
  <li>Une <strong>liste</strong>, c’est une étagère à emplacements numérotés : 0, 1, 2… On dit « donne-moi ce qu’il y a à l’emplacement 2 ». L’ordre compte.</li>
  <li>Un <strong>dictionnaire</strong>, c’est un casier de vestiaire avec un nom sur chaque porte : « donne-moi ce qu’il y a dans la case <em>volume</em> ». L’ordre ne compte pas, le nom si.</li>
</ul>
~~~text
 Liste  volumes :   [0]=1200   [1]=830.5   [2]=95.2

 Objet  corps :     ┌ name   ┐ "carter"
                    ├ volume ┤ 1200
                    └ closed ┘ true
~~~

<h3>Des rangements dans des rangements</h3>
<p>Le résultat de 3D Reader mélange les deux : un objet qui contient une liste d’objets. On y circule comme dans une adresse postale, du plus large au plus précis :</p>
~~~text
 result . bodies [0] . volume
   │        │     │      └─ la case "volume"
   │        │     └──────── le premier corps de l'étagère
   │        └────────────── l'étagère "bodies"
   └─────────────────────── le gros objet résultat
~~~

<h3>Map, filter, reduce, avec un lot de pièces</h3>
<ul>
  <li><code>filter</code> : le tri au contrôle, on ne garde que les bonnes pièces.</li>
  <li><code>map</code> : chaque pièce passe au poste « peser » ; on obtient une liste de masses.</li>
  <li><code>reduce</code> : la balance de palette ; on additionne tout pour une seule valeur.</li>
</ul>

<h3>Les erreurs classiques</h3>
<ul>
  <li>Compter à partir de 1 : le premier élément est <code>[0]</code>, le dernier <code>[longueur - 1]</code>.</li>
  <li>Lire une clé qui n’existe pas : JS rend <code>undefined</code> sans prévenir, Python lève <code>KeyError</code>.</li>
  <li>Croire qu’un <code>const</code> tableau ne peut pas changer : <code>const</code> fige l’étiquette, pas le contenu. <code>volumes.push(40)</code> marche très bien.</li>
</ul>
`,
        en: `
<h3>Put differently: the shelf and the locker</h3>
<ul>
  <li>A <strong>list</strong> is a shelf with numbered slots: 0, 1, 2… You say “give me what is in slot 2”. Order matters.</li>
  <li>A <strong>dictionary</strong> is a set of lockers with a name on each door: “give me what is in the <em>volume</em> locker”. Order does not matter, the name does.</li>
</ul>
~~~text
 List   volumes :   [0]=1200   [1]=830.5   [2]=95.2

 Object body :      ┌ name   ┐ "housing"
                    ├ volume ┤ 1200
                    └ closed ┘ true
~~~

<h3>Storage inside storage</h3>
<p>3D Reader’s result mixes both: an object that contains a list of objects. You move through it like a postal address, from broad to precise:</p>
~~~text
 result . bodies [0] . volume
   │        │     │      └─ the "volume" locker
   │        │     └──────── the first body on the shelf
   │        └────────────── the "bodies" shelf
   └─────────────────────── the big result object
~~~

<h3>Map, filter, reduce, with a batch of parts</h3>
<ul>
  <li><code>filter</code>: sorting at inspection, only good parts are kept.</li>
  <li><code>map</code>: each part goes through the “weigh” station; you get a list of masses.</li>
  <li><code>reduce</code>: the pallet scale; you add everything up into one value.</li>
</ul>

<h3>Classic mistakes</h3>
<ul>
  <li>Counting from 1: the first element is <code>[0]</code>, the last <code>[length - 1]</code>.</li>
  <li>Reading a key that does not exist: JS returns <code>undefined</code> silently, Python raises <code>KeyError</code>.</li>
  <li>Believing a <code>const</code> array cannot change: <code>const</code> fixes the label, not the content. <code>volumes.push(40)</code> works fine.</li>
</ul>
`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'basics-6',
      title: { fr: 'Erreurs et exceptions', en: 'Errors and exceptions' },
      skills: ['basics.errors'],
      minutes: 12,
      body: {
        fr: `
<h3>Quand ça ne va pas</h3>
<p>Un fichier corrompu, une unité inconnue, plus de mémoire… Un programme doit pouvoir dire « stop, problème ». Pour ça, il <strong>lève</strong> (lance) une <span class="term" data-term="exception">exception</span>. L’exécution normale s’arrête et remonte jusqu’à quelqu’un qui sait la <strong>rattraper</strong>.</p>

<div class="compare">
~~~py title="Python"
def unit_factor(unit):
    if unit not in UNITS:
        raise ValueError(f"Unknown unit '{unit}'")
    return UNITS[unit]

try:
    f = unit_factor("yard")
except ValueError as e:
    print("Erreur :", e)
~~~
~~~js title="JavaScript"
function unitFactor(unit) {
  if (!(unit in UNITS)) {
    throw new Error(\`Unknown unit '\${unit}'\`);
  }
  return UNITS[unit];
}

try {
  const f = unitFactor("yard");
} catch (err) {
  console.log("Erreur :", err.message);
}
~~~
~~~cpp title="C++"
double unitFactor(const std::string& unit) {
  if (!UNITS.count(unit)) {
    throw std::invalid_argument("Unknown unit " + unit);
  }
  return UNITS.at(unit);
}

try {
  double f = unitFactor("yard");
} catch (const std::exception& e) {
  std::cout << "Erreur : " << e.what();
}
~~~
</div>
<table>
  <thead><tr><th>Action</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>lever</td><td><code>raise</code></td><td><code>throw</code></td><td><code>throw</code></td></tr>
    <tr><td>essayer</td><td><code>try:</code></td><td><code>try { }</code></td><td><code>try { }</code></td></tr>
    <tr><td>rattraper</td><td><code>except</code></td><td><code>catch (err)</code></td><td><code>catch (...)</code></td></tr>
    <tr><td>toujours à la fin</td><td><code>finally:</code></td><td><code>finally { }</code></td><td>(destructeurs)</td></tr>
  </tbody>
</table>

<div class="callout project">Dans <code>worker.js</code>, toute l’analyse est dans un grand <code>try { … } catch (err) { … }</code>. Si OpenCascade plante, le <code>catch</code> renvoie un message <code>{ type: 'error', message }</code> à la page au lieu de laisser le Worker mourir en silence. Il note même si l’erreur est <code>fatal</code> (il faut redémarrer le Worker).</div>

<h3>Lire un message d’erreur</h3>
<p>Un message d’erreur n’est pas une insulte : c’est un rapport de non-conformité. Il dit <strong>quoi</strong> (le type et le message) et <strong>où</strong> (la pile d’appels, <em>stack trace</em>).</p>
~~~text
Uncaught Error: Unknown unit 'yard'
    at unitFactor (units.js:22:11)
    at loadMeshFile (meshload.js:140:18)
    at async self.onmessage (worker.js:118:42)
~~~
<ol>
  <li>Première ligne : le <strong>type</strong> (<code>Error</code>) et le <strong>message</strong>. Lis-le en entier, il dit souvent tout.</li>
  <li>Lignes <code>at …</code> : le chemin parcouru, du plus récent (en haut) au plus ancien. <code>units.js:22:11</code> = fichier <code>units.js</code>, ligne 22, colonne 11.</li>
  <li>Cherche la première ligne qui parle de <em>ton</em> code (pas d’une bibliothèque) : c’est souvent là qu’il faut regarder.</li>
</ol>
<p>En Python, c’est l’inverse : le <em>Traceback</em> se lit de bas en haut, la dernière ligne donne le type et le message.</p>

<h3>Erreurs fréquentes et leur sens</h3>
<table>
  <thead><tr><th>Message</th><th>Sens</th></tr></thead>
  <tbody>
    <tr><td><code>TypeError: Cannot read properties of undefined (reading 'volume')</code></td><td>tu lis <code>x.volume</code> mais <code>x</code> n’existe pas</td></tr>
    <tr><td><code>ReferenceError: masse is not defined</code></td><td>nom inconnu (faute de frappe, import manquant)</td></tr>
    <tr><td><code>SyntaxError: Unexpected token</code></td><td>le code est mal écrit (parenthèse, virgule…)</td></tr>
    <tr><td><code>KeyError: 'volume'</code> (Python)</td><td>clé absente du dictionnaire</td></tr>
    <tr><td><code>IndentationError</code> (Python)</td><td>mauvaise indentation</td></tr>
  </tbody>
</table>

~~~js run
function unitFactor(unit) {
  const UNITS = { mm: 1, cm: 10, m: 1000, in: 25.4 };
  if (!(unit in UNITS)) throw new Error(\`Unknown unit '\${unit}'\`);
  return UNITS[unit];
}
for (const u of ["cm", "yard", "in"]) {
  try {
    console.log(u, "→", unitFactor(u));
  } catch (err) {
    console.log("Problème avec", u, ":", err.message);
  } finally {
    console.log("(contrôle de", u, "terminé)");
  }
}
~~~
`,
        en: `
<h3>When things go wrong</h3>
<p>A corrupt file, an unknown unit, out of memory… A program must be able to say “stop, problem”. For that, it <strong>raises</strong> (throws) an <span class="term" data-term="exception">exception</span>. Normal execution stops and climbs back up until someone who knows how to <strong>catch</strong> it.</p>

<div class="compare">
~~~py title="Python"
def unit_factor(unit):
    if unit not in UNITS:
        raise ValueError(f"Unknown unit '{unit}'")
    return UNITS[unit]

try:
    f = unit_factor("yard")
except ValueError as e:
    print("Error:", e)
~~~
~~~js title="JavaScript"
function unitFactor(unit) {
  if (!(unit in UNITS)) {
    throw new Error(\`Unknown unit '\${unit}'\`);
  }
  return UNITS[unit];
}

try {
  const f = unitFactor("yard");
} catch (err) {
  console.log("Error:", err.message);
}
~~~
~~~cpp title="C++"
double unitFactor(const std::string& unit) {
  if (!UNITS.count(unit)) {
    throw std::invalid_argument("Unknown unit " + unit);
  }
  return UNITS.at(unit);
}

try {
  double f = unitFactor("yard");
} catch (const std::exception& e) {
  std::cout << "Error: " << e.what();
}
~~~
</div>
<table>
  <thead><tr><th>Action</th><th>Python</th><th>JavaScript</th><th>C++</th></tr></thead>
  <tbody>
    <tr><td>raise</td><td><code>raise</code></td><td><code>throw</code></td><td><code>throw</code></td></tr>
    <tr><td>try</td><td><code>try:</code></td><td><code>try { }</code></td><td><code>try { }</code></td></tr>
    <tr><td>catch</td><td><code>except</code></td><td><code>catch (err)</code></td><td><code>catch (...)</code></td></tr>
    <tr><td>always at the end</td><td><code>finally:</code></td><td><code>finally { }</code></td><td>(destructors)</td></tr>
  </tbody>
</table>

<div class="callout project">In <code>worker.js</code>, the whole analysis is inside a big <code>try { … } catch (err) { … }</code>. If OpenCascade crashes, the <code>catch</code> sends a <code>{ type: 'error', message }</code> message to the page instead of letting the Worker die silently. It even notes whether the error is <code>fatal</code> (the Worker must be restarted).</div>

<h3>Reading an error message</h3>
<p>An error message is not an insult: it is a non-conformity report. It says <strong>what</strong> (the type and the message) and <strong>where</strong> (the call stack, <em>stack trace</em>).</p>
~~~text
Uncaught Error: Unknown unit 'yard'
    at unitFactor (units.js:22:11)
    at loadMeshFile (meshload.js:140:18)
    at async self.onmessage (worker.js:118:42)
~~~
<ol>
  <li>First line: the <strong>type</strong> (<code>Error</code>) and the <strong>message</strong>. Read it all, it often says everything.</li>
  <li><code>at …</code> lines: the path taken, from the most recent (top) to the oldest. <code>units.js:22:11</code> = file <code>units.js</code>, line 22, column 11.</li>
  <li>Look for the first line that talks about <em>your</em> code (not a library’s): that is often where to look.</li>
</ol>
<p>In Python it is the other way round: the <em>Traceback</em> reads bottom to top, the last line gives the type and the message.</p>

<h3>Frequent errors and their meaning</h3>
<table>
  <thead><tr><th>Message</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>TypeError: Cannot read properties of undefined (reading 'volume')</code></td><td>you read <code>x.volume</code> but <code>x</code> does not exist</td></tr>
    <tr><td><code>ReferenceError: mass is not defined</code></td><td>unknown name (typo, missing import)</td></tr>
    <tr><td><code>SyntaxError: Unexpected token</code></td><td>the code is badly written (parenthesis, comma…)</td></tr>
    <tr><td><code>KeyError: 'volume'</code> (Python)</td><td>key missing from the dictionary</td></tr>
    <tr><td><code>IndentationError</code> (Python)</td><td>wrong indentation</td></tr>
  </tbody>
</table>

~~~js run
function unitFactor(unit) {
  const UNITS = { mm: 1, cm: 10, m: 1000, in: 25.4 };
  if (!(unit in UNITS)) throw new Error(\`Unknown unit '\${unit}'\`);
  return UNITS[unit];
}
for (const u of ["cm", "yard", "in"]) {
  try {
    console.log(u, "→", unitFactor(u));
  } catch (err) {
    console.log("Problem with", u, ":", err.message);
  } finally {
    console.log("(check of", u, "done)");
  }
}
~~~
`,
      },
      deep: {
        fr: `
<h3>Autrement dit : l’arrêt d’urgence et le chef d’équipe</h3>
<p>Sur une ligne de production, un opérateur qui voit un problème qu’il ne sait pas traiter tire l’<strong>arrêt d’urgence</strong> (<code>throw</code>). Il ne répare pas : il signale, avec une fiche qui dit ce qui ne va pas (le <em>message</em>).</p>
<p>Le <strong>chef d’équipe</strong> (<code>catch</code>) a prévu ce cas : il lit la fiche, décide quoi faire (prévenir, réessayer, mettre la pièce au rebut), et la ligne repart. Si aucun chef n’a prévu le cas, l’alarme remonte jusqu’à la direction… et l’usine s’arrête (le programme plante : « Uncaught Error »).</p>
~~~text
 try {              ← « zone surveillée par le chef d'équipe »
   poste A
   poste B   ──throw──┐   (arrêt d'urgence : C n'est pas exécuté)
   poste C            │
 } catch (err) {  ◄───┘   le chef lit err.message et décide
   ...
 } finally {            ← nettoyage du poste, que tout aille bien ou non
   ...
 }
~~~

<h3>Lire une pile d’appels comme une traçabilité</h3>
<p>La pile d’appels, c’est la traçabilité du lot défectueux : « détecté au poste <em>unitFactor</em>, lui-même alimenté par <em>loadMeshFile</em>, alimenté par la réception <em>onmessage</em> ». On remonte la chaîne jusqu’au premier maillon qui nous appartient.</p>

<h3>La méthode en 4 questions</h3>
<ol>
  <li><strong>Quel type ?</strong> TypeError, ReferenceError, SyntaxError… donne la famille du problème.</li>
  <li><strong>Quel message ?</strong> Le texte exact, souvent très explicite.</li>
  <li><strong>Où ?</strong> Fichier et numéro de ligne.</li>
  <li><strong>Avec quelles valeurs ?</strong> Ajoute un <code>console.log</code> juste avant pour voir ce que contiennent les variables.</li>
</ol>
<div class="callout tip">Copie le message d’erreur complet dans ta question à Claude Code : c’est l’information la plus utile que tu puisses donner.</div>

<h3>Les erreurs classiques</h3>
<ul>
  <li>Un <code>catch</code> vide qui « avale » l’erreur : le problème est caché, pas résolu.</li>
  <li>Lire seulement la dernière ligne de la pile en JavaScript : en JS, la cause est <em>en haut</em> ; en Python, <em>en bas</em>.</li>
  <li>Paniquer devant 40 lignes rouges : souvent, seules les 2 premières comptent.</li>
</ul>
`,
        en: `
<h3>Put differently: the emergency stop and the team leader</h3>
<p>On a production line, an operator who sees a problem they cannot handle pulls the <strong>emergency stop</strong> (<code>throw</code>). They do not repair: they report, with a card saying what is wrong (the <em>message</em>).</p>
<p>The <strong>team leader</strong> (<code>catch</code>) has planned for this case: they read the card, decide what to do (warn, retry, scrap the part), and the line restarts. If no leader planned for it, the alarm climbs up to management… and the plant stops (the program crashes: “Uncaught Error”).</p>
~~~text
 try {              ← "area watched by the team leader"
   station A
   station B ──throw──┐   (emergency stop: C is not run)
   station C          │
 } catch (err) {  ◄───┘   the leader reads err.message and decides
   ...
 } finally {            ← station clean-up, whether all went well or not
   ...
 }
~~~

<h3>Reading a call stack like traceability</h3>
<p>The call stack is the traceability of the defective batch: “detected at station <em>unitFactor</em>, itself fed by <em>loadMeshFile</em>, fed by the reception <em>onmessage</em>”. You go up the chain to the first link that belongs to you.</p>

<h3>The method in 4 questions</h3>
<ol>
  <li><strong>Which type?</strong> TypeError, ReferenceError, SyntaxError… gives the family of the problem.</li>
  <li><strong>Which message?</strong> The exact text, often very explicit.</li>
  <li><strong>Where?</strong> File and line number.</li>
  <li><strong>With which values?</strong> Add a <code>console.log</code> just before to see what the variables hold.</li>
</ol>
<div class="callout tip">Paste the complete error message into your question to Claude Code: it is the most useful information you can give.</div>

<h3>Classic mistakes</h3>
<ul>
  <li>An empty <code>catch</code> that “swallows” the error: the problem is hidden, not solved.</li>
  <li>Reading only the last line of the stack in JavaScript: in JS the cause is <em>at the top</em>; in Python, <em>at the bottom</em>.</li>
  <li>Panicking at 40 red lines: often only the first 2 matter.</li>
</ul>
`,
      },
    },
  ],
  questions: [
    // ---------------------------------------------------------- basics-1 types
    {
      id: 'basics-q1', skill: 'basics.types', lesson: 'basics-1', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque valeur JavaScript à son type.', en: 'Match each JavaScript value with its type.' },
      pairs: {
        fr: [['1250.5', 'number'], ['"carter.step"', 'string'], ['true', 'boolean'], ['undefined', 'pas encore de valeur']],
        en: [['1250.5', 'number'], ['"housing.step"', 'string'], ['true', 'boolean'], ['undefined', 'no value yet']],
      },
      explain: {
        fr: 'JS n’a qu’un type de nombre (<code>number</code>), les textes sont des <code>string</code>, vrai/faux des <code>boolean</code>, et <code>undefined</code> signale une variable jamais remplie.',
        en: 'JS has one number type (<code>number</code>), texts are <code>string</code>s, true/false <code>boolean</code>s, and <code>undefined</code> marks a variable never filled.',
      },
    },
    {
      id: 'basics-q2', skill: 'basics.types', lesson: 'basics-1', level: 2, type: 'mcq',
      prompt: { fr: 'Que se passe-t-il en C++ avec ce code ?', en: 'What happens in C++ with this code?' },
      code: 'double volume = 1250.5;\nvolume = "grand";',
      lang: 'cpp',
      choices: {
        fr: ['Le compilateur refuse : on ne range pas un texte dans un double', 'volume vaut "grand"', 'volume vaut 0', 'Ça marche mais affiche un avertissement à l’exécution'],
        en: ['The compiler refuses: you cannot store a text in a double', 'volume is "grand"', 'volume is 0', 'It works but shows a warning at run time'],
      },
      answer: 0,
      explain: {
        fr: 'C++ est typé <strong>statiquement</strong> : le type de la variable est figé et vérifié à la compilation, avant toute exécution.',
        en: 'C++ is <strong>statically</strong> typed: the variable’s type is fixed and checked at compile time, before anything runs.',
      },
    },
    {
      id: 'basics-q3', skill: 'basics.types', lesson: 'basics-1', level: 1, type: 'fill',
      prompt: { fr: 'Complète pour déclarer une variable JavaScript qui ne sera jamais réaffectée.', en: 'Fill in to declare a JavaScript variable that will never be reassigned.' },
      code: '____ volume = 1250.5;',
      lang: 'js',
      accept: ['const'],
      explain: {
        fr: '<code>const</code> pour une étiquette fixe, <code>let</code> si elle doit changer. 3D Reader préfère <code>const</code> chaque fois que c’est possible.',
        en: '<code>const</code> for a fixed label, <code>let</code> if it must change. 3D Reader prefers <code>const</code> whenever possible.',
      },
    },
    {
      id: 'basics-q4', skill: 'basics.types', lesson: 'basics-1', level: 2, type: 'mcq',
      prompt: { fr: 'Dans le contrat de résultat de 3D Reader, <code>volume: number|null</code> signifie…', en: 'In 3D Reader’s result contract, <code>volume: number|null</code> means…' },
      choices: {
        fr: ['un nombre, ou <code>null</code> quand le volume est inconnu (corps ouvert)', 'un nombre divisé par null', 'toujours 0', 'un texte'],
        en: ['a number, or <code>null</code> when the volume is unknown (open body)', 'a number divided by null', 'always 0', 'a text'],
      },
      answer: 0,
      explain: {
        fr: 'La barre <code>|</code> se lit « ou ». <code>null</code> = « pas de valeur, volontairement » : un corps ouvert n’a pas de volume fiable.',
        en: 'The bar <code>|</code> reads “or”. <code>null</code> = “no value, on purpose”: an open body has no reliable volume.',
      },
    },
    // ---------------------------------------------------------- basics-2 conditions
    {
      id: 'basics-q5', skill: 'basics.conditions', lesson: 'basics-2', level: 1, type: 'mcq',
      prompt: { fr: 'En JavaScript, que vaut <code>"5" === 5</code> ?', en: 'In JavaScript, what is <code>"5" === 5</code>?' },
      choices: { fr: ['false', 'true', 'une erreur', '"55"'], en: ['false', 'true', 'an error', '"55"'] },
      answer: 0,
      explain: {
        fr: '<code>===</code> compare sans convertir : un texte n’est pas un nombre. Avec <code>==</code>, JS convertirait et dirait <code>true</code> : d’où la règle « toujours <code>===</code> ».',
        en: '<code>===</code> compares without converting: a text is not a number. With <code>==</code>, JS would convert and say <code>true</code>: hence the rule “always <code>===</code>”.',
      },
    },
    {
      id: 'basics-q6', skill: 'basics.conditions', lesson: 'basics-2', level: 2, type: 'mcq',
      prompt: { fr: 'Que rend <code>extensionOf("Carter.STEP")</code> ?', en: 'What does <code>extensionOf("Housing.STEP")</code> return?' },
      code: "function extensionOf(name) {\n  const i = name.lastIndexOf('.');\n  return i < 0 ? '' : name.slice(i).toLowerCase();\n}",
      lang: 'js',
      choices: { fr: ['".step"', '"STEP"', '""', '"Carter"'], en: ['".step"', '"STEP"', '""', '"Housing"'] },
      answer: 0,
      explain: {
        fr: 'Il y a un point (<code>i</code> ≥ 0), donc le ternaire prend la branche « sinon » : ce qui suit le dernier point, point compris, en minuscules.',
        en: 'There is a dot (<code>i</code> ≥ 0), so the ternary takes the “else” branch: what follows the last dot, dot included, in lower case.',
      },
    },
    {
      id: 'basics-q7', skill: 'basics.conditions', lesson: 'basics-2', level: 1, type: 'match',
      prompt: { fr: 'Associe l’opérateur JavaScript à son équivalent Python.', en: 'Match the JavaScript operator with its Python equivalent.' },
      pairs: {
        fr: [['&&', 'and'], ['||', 'or'], ['!', 'not'], ['===', '==']],
        en: [['&&', 'and'], ['||', 'or'], ['!', 'not'], ['===', '==']],
      },
      explain: {
        fr: 'JS et C++ utilisent des symboles (<code>&amp;&amp; || !</code>), Python des mots (<code>and or not</code>).',
        en: 'JS and C++ use symbols (<code>&amp;&amp; || !</code>), Python uses words (<code>and or not</code>).',
      },
    },
    {
      id: 'basics-q8', skill: 'basics.conditions', lesson: 'basics-2', level: 2, type: 'multi',
      prompt: { fr: 'Lesquelles de ces valeurs sont considérées comme <strong>fausses</strong> par <code>if (x)</code> en JavaScript ?', en: 'Which of these values are considered <strong>false</strong> by <code>if (x)</code> in JavaScript?' },
      choices: { fr: ['0', '""', 'null', '"0"', '[] (tableau vide)'], en: ['0', '""', 'null', '"0"', '[] (empty array)'] },
      answer: [0, 1, 2],
      explain: {
        fr: 'Faux-ish : <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>. Le texte <code>"0"</code> n’est pas vide, et un tableau, même vide, est un objet : tous deux sont vrais.',
        en: 'Falsy: <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>. The text <code>"0"</code> is not empty, and an array, even empty, is an object: both are truthy.',
      },
    },
    // ---------------------------------------------------------- basics-3 loops
    {
      id: 'basics-q9', skill: 'basics.loops', lesson: 'basics-3', level: 1, type: 'mcq',
      prompt: { fr: 'Quel est l’équivalent JavaScript de <code>for corps in bodies:</code> en Python ?', en: 'What is the JavaScript equivalent of Python’s <code>for body in bodies:</code>?' },
      choices: {
        fr: ['for (const corps of bodies) { … }', 'for (const corps in bodies) { … }', 'while (corps in bodies) { … }', 'bodies.for(corps)'],
        en: ['for (const body of bodies) { … }', 'for (const body in bodies) { … }', 'while (body in bodies) { … }', 'bodies.for(body)'],
      },
      answer: 0,
      explain: {
        fr: '<code>for…of</code> parcourt les <em>valeurs</em>. <code>for…in</code> parcourt les <em>clés</em> (ici les numéros "0", "1"…) : piège classique.',
        en: '<code>for…of</code> walks the <em>values</em>. <code>for…in</code> walks the <em>keys</em> (here the numbers "0", "1"…): classic trap.',
      },
    },
    {
      id: 'basics-q10', skill: 'basics.loops', lesson: 'basics-3', level: 2, type: 'fill',
      prompt: { fr: 'Combien de fois cette boucle affiche-t-elle quelque chose ?', en: 'How many times does this loop print something?' },
      code: 'for (let i = 0; i < 10; i += 3) {\n  console.log(i);\n}',
      lang: 'js',
      accept: ['4', 'quatre', 'four'],
      explain: {
        fr: 'i vaut 0, 3, 6, 9 (4 tours) ; à 12, la condition <code>i &lt; 10</code> est fausse et on sort. C’est <code>range(0, 10, 3)</code> en Python.',
        en: 'i is 0, 3, 6, 9 (4 rounds); at 12 the condition <code>i &lt; 10</code> is false and we leave. It is Python’s <code>range(0, 10, 3)</code>.',
      },
    },
    {
      id: 'basics-q11', skill: 'basics.loops', lesson: 'basics-3', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi 3D Reader parcourt-il les indices de triangles avec <code>t += 3</code> ?', en: 'Why does 3D Reader walk the triangle indices with <code>t += 3</code>?' },
      choices: {
        fr: ['Chaque triangle occupe 3 indices consécutifs (ses 3 sommets)', 'Pour aller 3 fois plus vite', 'Parce qu’un triangle sur trois est faux', 'C’est obligatoire en JavaScript'],
        en: ['Each triangle takes 3 consecutive indices (its 3 vertices)', 'To go 3 times faster', 'Because one triangle in three is wrong', 'It is mandatory in JavaScript'],
      },
      answer: 0,
      explain: {
        fr: 'Les indices sont rangés à plat : [a0,b0,c0, a1,b1,c1, …]. Avancer de 3 place <code>t</code> au début de chaque triangle.',
        en: 'Indices are stored flat: [a0,b0,c0, a1,b1,c1, …]. Stepping by 3 puts <code>t</code> at the start of each triangle.',
      },
    },
    {
      id: 'basics-q12', skill: 'basics.loops', lesson: 'basics-3', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque mot-clé à son effet.', en: 'Match each keyword with its effect.' },
      pairs: {
        fr: [['break', 'sortir de la boucle tout de suite'], ['continue', 'passer au tour suivant'], ['while', 'répéter tant qu’une condition est vraie']],
        en: [['break', 'leave the loop right away'], ['continue', 'jump to the next round'], ['while', 'repeat as long as a condition is true']],
      },
      explain: {
        fr: '<code>break</code> = « trouvé, on arrête » ; <code>continue</code> = « celle-ci ne compte pas » ; <code>while</code> = « tant que… ».',
        en: '<code>break</code> = “found it, stop”; <code>continue</code> = “this one does not count”; <code>while</code> = “as long as…”.',
      },
    },
    // ---------------------------------------------------------- basics-4 functions
    {
      id: 'basics-q13', skill: 'basics.functions', lesson: 'basics-4', level: 1, type: 'mcq',
      prompt: { fr: 'Que vaut <code>masse(1000)</code> ?', en: 'What is <code>mass(1000)</code>?' },
      code: 'function mass(volumeMm3, density = 0.0027) {\n  return volumeMm3 * density;\n}',
      lang: 'js',
      choices: { fr: ['2.7', '1000', 'undefined', 'une erreur : il manque density'], en: ['2.7', '1000', 'undefined', 'an error: density is missing'] },
      answer: 0,
      explain: {
        fr: '<code>density</code> n’est pas donné, donc la valeur par défaut 0.0027 s’applique : 1000 × 0.0027 = 2.7.',
        en: '<code>density</code> is not given, so the default value 0.0027 applies: 1000 × 0.0027 = 2.7.',
      },
    },
    {
      id: 'basics-q14', skill: 'basics.functions', lesson: 'basics-4', level: 2, type: 'mcq',
      prompt: { fr: 'Comment lire <code>const double = (x) =&gt; x * 2;</code> ?', en: 'How do you read <code>const double = (x) =&gt; x * 2;</code>?' },
      choices: {
        fr: ['« double » est une fonction qui prend x et rend x fois 2', 'x est plus grand ou égal à 2', 'double vaut toujours 2', 'on compare double et x'],
        en: ['“double” is a function that takes x and returns x times 2', 'x is greater than or equal to 2', 'double is always 2', 'we compare double and x'],
      },
      answer: 0,
      explain: {
        fr: 'Fonction fléchée : nom à gauche du <code>=</code>, entrée entre parenthèses, sortie après <code>=&gt;</code> (ici sans <code>return</code> écrit).',
        en: 'Arrow function: name left of the <code>=</code>, input in parentheses, output after <code>=&gt;</code> (here without a written <code>return</code>).',
      },
    },
    {
      id: 'basics-q15', skill: 'basics.functions', lesson: 'basics-4', level: 1, type: 'match',
      prompt: { fr: 'Associe le mot qui annonce une fonction à son langage.', en: 'Match the word that introduces a function with its language.' },
      pairs: {
        fr: [['def', 'Python'], ['function', 'JavaScript'], ['double masse(...)', 'C++ (type de retour)']],
        en: [['def', 'Python'], ['function', 'JavaScript'], ['double mass(...)', 'C++ (return type)']],
      },
      explain: {
        fr: 'Python : <code>def</code> ; JS : <code>function</code> (ou une flèche) ; C++ : le type rendu, suivi du nom.',
        en: 'Python: <code>def</code>; JS: <code>function</code> (or an arrow); C++: the returned type, then the name.',
      },
    },
    {
      id: 'basics-q16', skill: 'basics.functions', lesson: 'basics-4', level: 2, type: 'tf',
      prompt: { fr: 'Une variable déclarée à l’intérieur d’une fonction est accessible partout dans le fichier.', en: 'A variable declared inside a function is accessible everywhere in the file.' },
      answer: false,
      explain: {
        fr: 'Faux : c’est la <strong>portée</strong>. Une variable locale n’existe qu’à l’intérieur de sa fonction, pendant son exécution.',
        en: 'False: that is <strong>scope</strong>. A local variable only exists inside its function, while it runs.',
      },
    },
    // ---------------------------------------------------------- basics-5 collections
    {
      id: 'basics-q17', skill: 'basics.collections', lesson: 'basics-5', level: 1, type: 'mcq',
      prompt: { fr: 'Avec <code>const v = [1200, 830.5, 95.2];</code>, que vaut <code>v[1]</code> ?', en: 'With <code>const v = [1200, 830.5, 95.2];</code>, what is <code>v[1]</code>?' },
      choices: { fr: ['830.5', '1200', '95.2', 'undefined'], en: ['830.5', '1200', '95.2', 'undefined'] },
      answer: 0,
      explain: {
        fr: 'Les positions commencent à 0 : <code>v[0]</code> = 1200, <code>v[1]</code> = 830.5, <code>v[2]</code> = 95.2.',
        en: 'Positions start at 0: <code>v[0]</code> = 1200, <code>v[1]</code> = 830.5, <code>v[2]</code> = 95.2.',
      },
    },
    {
      id: 'basics-q18', skill: 'basics.collections', lesson: 'basics-5', level: 1, type: 'match',
      prompt: { fr: 'Associe « ajouter à la fin » à chaque langage.', en: 'Match “add at the end” with each language.' },
      pairs: {
        fr: [['Python list', 'append'], ['JavaScript Array', 'push'], ['C++ std::vector', 'push_back']],
        en: [['Python list', 'append'], ['JavaScript Array', 'push'], ['C++ std::vector', 'push_back']],
      },
      explain: {
        fr: 'Même geste, trois noms. Idem pour la taille : <code>len()</code>, <code>.length</code>, <code>.size()</code>.',
        en: 'Same gesture, three names. Likewise for the size: <code>len()</code>, <code>.length</code>, <code>.size()</code>.',
      },
    },
    {
      id: 'basics-q19', skill: 'basics.collections', lesson: 'basics-5', level: 2, type: 'fill',
      prompt: { fr: 'Complète pour lire le nom du premier corps du résultat.', en: 'Fill in to read the name of the first body of the result.' },
      code: 'const nom = result.bodies[____].name;',
      lang: 'js',
      accept: ['0'],
      explain: {
        fr: '<code>bodies</code> est une liste : le premier élément est à l’indice 0.',
        en: '<code>bodies</code> is a list: the first element is at index 0.',
      },
    },
    {
      id: 'basics-q20', skill: 'basics.collections', lesson: 'basics-5', level: 2, type: 'mcq',
      prompt: { fr: 'Que produit ce code ?', en: 'What does this code produce?' },
      code: 'const bodies = [{ v: 10, closed: true }, { v: 5, closed: false }, { v: 7, closed: true }];\nconst total = bodies.filter((b) => b.closed).reduce((s, b) => s + b.v, 0);',
      lang: 'js',
      choices: { fr: ['17', '22', '10', '15'], en: ['17', '22', '10', '15'] },
      answer: 0,
      explain: {
        fr: '<code>filter</code> garde les corps fermés (10 et 7), <code>reduce</code> les additionne en partant de 0 : 17.',
        en: '<code>filter</code> keeps the closed bodies (10 and 7), <code>reduce</code> adds them starting from 0: 17.',
      },
    },
    // ---------------------------------------------------------- basics-6 errors
    {
      id: 'basics-q21', skill: 'basics.errors', lesson: 'basics-6', level: 1, type: 'match',
      prompt: { fr: 'Associe l’action au mot-clé JavaScript.', en: 'Match the action with the JavaScript keyword.' },
      pairs: {
        fr: [['lever une erreur', 'throw'], ['zone surveillée', 'try'], ['rattraper l’erreur', 'catch'], ['exécuté dans tous les cas', 'finally']],
        en: [['raise an error', 'throw'], ['watched area', 'try'], ['catch the error', 'catch'], ['run in every case', 'finally']],
      },
      explain: {
        fr: '<code>throw</code> = arrêt d’urgence, <code>try</code> = zone surveillée, <code>catch</code> = le chef d’équipe, <code>finally</code> = le nettoyage du poste.',
        en: '<code>throw</code> = emergency stop, <code>try</code> = watched area, <code>catch</code> = the team leader, <code>finally</code> = cleaning the station.',
      },
    },
    {
      id: 'basics-q22', skill: 'basics.errors', lesson: 'basics-6', level: 2, type: 'line',
      prompt: { fr: 'Dans cette pile d’appels JavaScript, clique sur la ligne qui donne le <strong>message</strong> de l’erreur.', en: 'In this JavaScript stack trace, click the line that gives the error <strong>message</strong>.' },
      code: "Uncaught Error: Unknown unit 'yard'\n    at unitFactor (units.js:22:11)\n    at loadMeshFile (meshload.js:140:18)\n    at async self.onmessage (worker.js:118:42)",
      lang: 'text',
      answer: 0,
      explain: {
        fr: 'En JavaScript, la première ligne donne type et message ; les lignes <code>at</code> suivent le chemin du plus récent au plus ancien.',
        en: 'In JavaScript, the first line gives type and message; the <code>at</code> lines follow the path from most recent to oldest.',
      },
    },
    {
      id: 'basics-q23', skill: 'basics.errors', lesson: 'basics-6', level: 2, type: 'mcq',
      prompt: { fr: '<code>TypeError: Cannot read properties of undefined (reading \'volume\')</code> signifie…', en: '<code>TypeError: Cannot read properties of undefined (reading \'volume\')</code> means…' },
      choices: {
        fr: ['On lit <code>x.volume</code> alors que <code>x</code> est <code>undefined</code>', 'Le volume est négatif', 'Le fichier STEP est trop gros', 'La variable volume est mal orthographiée'],
        en: ['We read <code>x.volume</code> while <code>x</code> is <code>undefined</code>', 'The volume is negative', 'The STEP file is too big', 'The volume variable is misspelt'],
      },
      answer: 0,
      explain: {
        fr: 'L’objet avant le point n’existe pas (par exemple <code>bodies[5]</code> alors qu’il n’y a que 3 corps). Une faute de frappe sur un nom donnerait plutôt <code>ReferenceError</code>.',
        en: 'The object before the dot does not exist (e.g. <code>bodies[5]</code> when there are only 3 bodies). A typo in a name would rather give <code>ReferenceError</code>.',
      },
    },
    {
      id: 'basics-q24', skill: 'basics.errors', lesson: 'basics-6', level: 1, type: 'tf',
      prompt: { fr: 'Dans un <em>Traceback</em> Python, le type et le message de l’erreur sont sur la <strong>dernière</strong> ligne.', en: 'In a Python <em>Traceback</em>, the error type and message are on the <strong>last</strong> line.' },
      answer: true,
      explain: {
        fr: 'Vrai : Python se lit de bas en haut (dernier appel en bas), JavaScript de haut en bas.',
        en: 'True: Python reads bottom to top (last call at the bottom), JavaScript top to bottom.',
      },
    },
    // ---------------------------------------------------------- extra: types
    {
      id: 'basics-q25', skill: 'basics.types', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que vaut <code>"3" + 2</code> en JavaScript ?', en: 'What is <code>"3" + 2</code> in JavaScript?' },
      choices: { fr: ['"32"', '5', 'une erreur', 'NaN'], en: ['"32"', '5', 'an error', 'NaN'] },
      answer: 0,
      explain: {
        fr: 'Avec un texte, <code>+</code> colle : le 2 devient "2". Convertis d’abord avec <code>Number("3")</code> pour obtenir 5. Python, lui, lèverait une erreur.',
        en: 'With a text, <code>+</code> glues: the 2 becomes "2". Convert first with <code>Number("3")</code> to get 5. Python would raise an error.',
      },
    },
    {
      id: 'basics-q26', skill: 'basics.types', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'En Python et en JavaScript, une même variable peut contenir un nombre puis un texte.', en: 'In Python and JavaScript, the same variable can hold a number and then a text.' },
      answer: true,
      explain: {
        fr: 'Vrai : typage dynamique. C’est la valeur qui porte le type. En C++ (typage statique), c’est interdit.',
        en: 'True: dynamic typing. The value carries the type. In C++ (static typing), it is forbidden.',
      },
    },
    {
      id: 'basics-q27', skill: 'basics.types', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi les tests de 3D Reader comparent-ils les volumes avec une tolérance (<code>approx</code>) plutôt qu’avec <code>===</code> ?', en: 'Why do 3D Reader’s tests compare volumes with a tolerance (<code>approx</code>) rather than <code>===</code>?' },
      choices: {
        fr: ['Les nombres à virgule sont approchés : 0.1 + 0.2 ne vaut pas exactement 0.3', 'Parce que === ne marche pas sur les nombres', 'Pour aller plus vite', 'Parce que les volumes sont des textes'],
        en: ['Decimal numbers are approximate: 0.1 + 0.2 is not exactly 0.3', 'Because === does not work on numbers', 'To go faster', 'Because volumes are texts'],
      },
      answer: 0,
      explain: {
        fr: 'Les <code>double</code> stockent les nombres en binaire avec une précision limitée. Deux calculs justes peuvent différer au 15e chiffre.',
        en: '<code>double</code>s store numbers in binary with limited precision. Two correct computations can differ at the 15th digit.',
      },
    },
    // ---------------------------------------------------------- extra: conditions
    {
      id: 'basics-q28', skill: 'basics.conditions', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que fait <code>if (x = 5)</code> en JavaScript ?', en: 'What does <code>if (x = 5)</code> do in JavaScript?' },
      choices: {
        fr: ['Il range 5 dans x et la condition est toujours vraie', 'Il compare x à 5', 'Il lève une erreur', 'Il ne fait rien'],
        en: ['It stores 5 in x and the condition is always true', 'It compares x with 5', 'It raises an error', 'It does nothing'],
      },
      answer: 0,
      explain: {
        fr: 'Un seul <code>=</code> range une valeur. Pour comparer : <code>===</code>. Erreur classique, difficile à repérer.',
        en: 'A single <code>=</code> stores a value. To compare: <code>===</code>. Classic mistake, hard to spot.',
      },
    },
    {
      id: 'basics-q29', skill: 'basics.conditions', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que vaut <code>statut</code> ?', en: 'What is <code>status</code>?' },
      code: 'const thickness = 2.4;\nconst status = thickness >= 3 ? "OK" : "thin";',
      lang: 'js',
      choices: { fr: ['"thin"', '"OK"', 'true', '2.4'], en: ['"thin"', '"OK"', 'true', '2.4'] },
      answer: 0,
      explain: {
        fr: '2.4 ≥ 3 est faux, donc le ternaire prend la valeur après les deux-points : <code>"thin"</code>.',
        en: '2.4 ≥ 3 is false, so the ternary takes the value after the colon: <code>"thin"</code>.',
      },
    },
    {
      id: 'basics-q30', skill: 'basics.conditions', extra: true, level: 3, type: 'order',
      prompt: { fr: 'Pour une épaisseur de 25 mm, remets dans l’ordre ce que fait le programme.', en: 'For a 25 mm thickness, put in order what the program does.' },
      code: 'if (e < 3) { a(); }\nelse if (e > 20) { b(); }\nelse { c(); }',
      lang: 'js',
      items: {
        fr: ['Tester « e plus petit que 3 » : faux', 'Tester « e plus grand que 20 » : vrai', 'Exécuter b()', 'Sauter le else (c n’est pas exécuté)'],
        en: ['Test “e smaller than 3”: false', 'Test “e greater than 20”: true', 'Run b()', 'Skip the else (c is not run)'],
      },
      explain: {
        fr: 'Les conditions sont testées dans l’ordre ; dès qu’une est vraie, son bloc s’exécute et les autres sont ignorées.',
        en: 'Conditions are tested in order; as soon as one is true, its block runs and the others are ignored.',
      },
    },
    // ---------------------------------------------------------- extra: loops
    {
      id: 'basics-q31', skill: 'basics.loops', extra: true, level: 1, type: 'tf',
      prompt: { fr: '<code>while (x &lt; 10) { console.log(x); }</code> sans jamais modifier x est une boucle infinie si x vaut 0 au départ.', en: '<code>while (x &lt; 10) { console.log(x); }</code> without ever changing x is an infinite loop if x starts at 0.' },
      answer: true,
      explain: {
        fr: 'Vrai : la condition reste vraie pour toujours. Il faut faire évoluer x dans la boucle (<code>x++</code>).',
        en: 'True: the condition stays true forever. You must change x inside the loop (<code>x++</code>).',
      },
    },
    {
      id: 'basics-q32', skill: 'basics.loops', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Ce code lit une case de trop. Clique sur la ligne fautive.', en: 'This code reads one cell too many. Click the faulty line.' },
      code: 'const v = [10, 20, 30];\nlet total = 0;\nfor (let i = 0; i <= v.length; i++) {\n  total += v[i];\n}\nconsole.log(total);',
      lang: 'js',
      answer: 2,
      explain: {
        fr: '<code>i &lt;= v.length</code> va jusqu’à i = 3 alors que la dernière case est <code>v[2]</code>. <code>v[3]</code> est <code>undefined</code> et <code>total</code> devient <code>NaN</code>. Il faut <code>i &lt; v.length</code>.',
        en: '<code>i &lt;= v.length</code> goes up to i = 3 while the last cell is <code>v[2]</code>. <code>v[3]</code> is <code>undefined</code> and <code>total</code> becomes <code>NaN</code>. You need <code>i &lt; v.length</code>.',
      },
    },
    {
      id: 'basics-q33', skill: 'basics.loops', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Complète la boucle JS équivalente à <code>for i in range(5):</code>.', en: 'Fill in the JS loop equivalent to <code>for i in range(5):</code>.' },
      code: 'for (let i = 0; i ____ 5; i++) { … }',
      lang: 'js',
      accept: ['<'],
      explain: {
        fr: '<code>range(5)</code> donne 0 à 4 : on continue tant que <code>i &lt; 5</code>.',
        en: '<code>range(5)</code> gives 0 to 4: keep going while <code>i &lt; 5</code>.',
      },
    },
    // ---------------------------------------------------------- extra: functions
    {
      id: 'basics-q34', skill: 'basics.functions', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que rend cette fonction ?', en: 'What does this function return?' },
      code: 'function area(w, h) {\n  const a = w * h;\n}\nconsole.log(area(2, 3));',
      lang: 'js',
      choices: { fr: ['undefined', '6', '5', 'une erreur'], en: ['undefined', '6', '5', 'an error'] },
      answer: 0,
      explain: {
        fr: 'Il manque <code>return a;</code> : la fonction calcule mais ne rend rien, donc <code>undefined</code>.',
        en: '<code>return a;</code> is missing: the function computes but returns nothing, hence <code>undefined</code>.',
      },
    },
    {
      id: 'basics-q35', skill: 'basics.functions', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Quelle différence entre <code>masse</code> et <code>masse(1000)</code> ?', en: 'What is the difference between <code>mass</code> and <code>mass(1000)</code>?' },
      choices: {
        fr: ['<code>masse</code> est la fonction elle-même, <code>masse(1000)</code> est le résultat de son exécution', 'Aucune', '<code>masse</code> vaut 0', '<code>masse(1000)</code> redéfinit la fonction'],
        en: ['<code>mass</code> is the function itself, <code>mass(1000)</code> is the result of running it', 'None', '<code>mass</code> is 0', '<code>mass(1000)</code> redefines the function'],
      },
      answer: 0,
      explain: {
        fr: 'Les parenthèses déclenchent l’appel. Sans elles, on manipule la « machine » sans y mettre de pièce.',
        en: 'Parentheses trigger the call. Without them, you handle the “machine” without putting a part in.',
      },
    },
    {
      id: 'basics-q36', skill: 'basics.functions', extra: true, level: 3, type: 'order',
      prompt: { fr: 'Remets dans l’ordre ce qui se passe lors de <code>const m = masse(1000);</code>.', en: 'Put in order what happens during <code>const m = mass(1000);</code>.' },
      items: {
        fr: ['La fonction reçoit volumeMm3 = 1000', 'density prend sa valeur par défaut', 'Le calcul 1000 × density est fait', 'return rend le résultat', 'Le résultat est rangé dans m'],
        en: ['The function receives volumeMm3 = 1000', 'density takes its default value', 'The computation 1000 × density is done', 'return gives back the result', 'The result is stored in m'],
      },
      explain: {
        fr: 'Appel → paramètres remplis (défauts compris) → corps exécuté → <code>return</code> → la valeur revient à l’endroit de l’appel.',
        en: 'Call → parameters filled (defaults included) → body run → <code>return</code> → the value comes back where the call was.',
      },
    },
    // ---------------------------------------------------------- extra: collections
    {
      id: 'basics-q37', skill: 'basics.collections', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Comment lit-on le volume dans <code>const b = { name: "carter", volume: 1200 };</code> ?', en: 'How do you read the volume in <code>const b = { name: "housing", volume: 1200 };</code>?' },
      choices: { fr: ['b.volume', 'b[1]', 'b(volume)', 'volume.b'], en: ['b.volume', 'b[1]', 'b(volume)', 'volume.b'] },
      answer: 0,
      explain: {
        fr: 'Un objet se lit par clé : <code>b.volume</code> ou <code>b["volume"]</code>. Les numéros <code>[1]</code> sont pour les listes.',
        en: 'An object is read by key: <code>b.volume</code> or <code>b["volume"]</code>. Numbers <code>[1]</code> are for lists.',
      },
    },
    {
      id: 'basics-q38', skill: 'basics.collections', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Avec <code>const v = [1, 2];</code>, l’instruction <code>v.push(3);</code> provoque une erreur car v est <code>const</code>.', en: 'With <code>const v = [1, 2];</code>, the statement <code>v.push(3);</code> raises an error because v is <code>const</code>.' },
      answer: false,
      explain: {
        fr: 'Faux : <code>const</code> fige l’étiquette (on ne peut pas faire <code>v = …</code>), pas le contenu du tableau.',
        en: 'False: <code>const</code> fixes the label (you cannot do <code>v = …</code>), not the content of the array.',
      },
    },
    {
      id: 'basics-q39', skill: 'basics.collections', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Le résultat vaut <code>{ summary: { bbox: { size: [40, 30, 12] } } }</code>. Que vaut <code>result.summary.bbox.size[2]</code> ?', en: 'The result is <code>{ summary: { bbox: { size: [40, 30, 12] } } }</code>. What is <code>result.summary.bbox.size[2]</code>?' },
      accept: ['12'],
      explain: {
        fr: 'On suit l’adresse : summary → bbox → size, puis la case n° 2 (la troisième) : 12.',
        en: 'Follow the address: summary → bbox → size, then cell no. 2 (the third): 12.',
      },
    },
    // ---------------------------------------------------------- extra: errors
    {
      id: 'basics-q40', skill: 'basics.errors', extra: true, level: 1, type: 'mcq',
      prompt: { fr: '<code>ReferenceError: masse is not defined</code> veut le plus souvent dire…', en: '<code>ReferenceError: mass is not defined</code> most often means…' },
      choices: {
        fr: ['Le nom est inconnu : faute de frappe ou import manquant', 'La masse est nulle', 'Le fichier est corrompu', 'Il n’y a plus de mémoire'],
        en: ['The name is unknown: typo or missing import', 'The mass is zero', 'The file is corrupt', 'Out of memory'],
      },
      answer: 0,
      explain: {
        fr: 'Le moteur ne trouve aucune variable ou fonction de ce nom à cet endroit. Vérifie l’orthographe et les <code>import</code>.',
        en: 'The engine finds no variable or function of that name at that place. Check the spelling and the <code>import</code>s.',
      },
    },
    {
      id: 'basics-q41', skill: 'basics.errors', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Qu’affiche ce code ?', en: 'What does this code print?' },
      code: 'try {\n  console.log("A");\n  throw new Error("boom");\n  console.log("B");\n} catch (e) {\n  console.log("C");\n} finally {\n  console.log("D");\n}',
      lang: 'js',
      choices: { fr: ['A C D', 'A B C D', 'A B D', 'C D'], en: ['A C D', 'A B C D', 'A B D', 'C D'] },
      answer: 0,
      explain: {
        fr: 'A s’affiche, puis <code>throw</code> saute directement au <code>catch</code> (B n’est jamais exécuté), puis <code>finally</code> s’exécute toujours.',
        en: 'A prints, then <code>throw</code> jumps straight to <code>catch</code> (B never runs), then <code>finally</code> always runs.',
      },
    },
    {
      id: 'basics-q42', skill: 'basics.errors', extra: true, level: 3, type: 'order',
      prompt: { fr: 'Remets dans l’ordre la méthode pour analyser une erreur.', en: 'Put in order the method to analyse an error.' },
      items: {
        fr: ['Lire le type de l’erreur', 'Lire le message exact', 'Trouver le fichier et la ligne', 'Afficher les valeurs avec console.log juste avant'],
        en: ['Read the error type', 'Read the exact message', 'Find the file and line', 'Print the values with console.log just before'],
      },
      explain: {
        fr: 'Quoi (type, message), où (fichier:ligne), avec quoi (valeurs). Et copie le message complet dans ta question à Claude Code.',
        en: 'What (type, message), where (file:line), with what (values). And paste the full message into your question to Claude Code.',
      },
    },
    // ---------------------------------------------------------- exam
    {
      id: 'basics-q43', skill: 'basics.types', level: 2, type: 'mcq',
      prompt: { fr: 'Quelle est la différence entre <code>null</code> et <code>undefined</code> en JavaScript ?', en: 'What is the difference between <code>null</code> and <code>undefined</code> in JavaScript?' },
      choices: {
        fr: ['undefined = jamais rempli ; null = vidé volontairement', 'Aucune', 'null est un nombre', 'undefined est une erreur'],
        en: ['undefined = never filled; null = emptied on purpose', 'None', 'null is a number', 'undefined is an error'],
      },
      answer: 0,
      explain: {
        fr: 'Les deux signifient « pas de valeur », mais <code>null</code> est un choix explicite du programmeur, comme <code>let worker = null;</code> dans client.js.',
        en: 'Both mean “no value”, but <code>null</code> is the programmer’s explicit choice, like <code>let worker = null;</code> in client.js.',
      },
    },
    {
      id: 'basics-q44', skill: 'basics.conditions', level: 2, type: 'tf',
      prompt: { fr: 'En Python, les blocs d’un <code>if</code> sont délimités par l’indentation ; en JavaScript et C++, par des accolades.', en: 'In Python, the blocks of an <code>if</code> are delimited by indentation; in JavaScript and C++, by braces.' },
      answer: true,
      explain: {
        fr: 'Vrai. En JS/C++, l’indentation aide la lecture mais ce sont les <code>{ }</code> qui comptent pour la machine.',
        en: 'True. In JS/C++, indentation helps reading but the <code>{ }</code> are what count for the machine.',
      },
    },
    {
      id: 'basics-q45', skill: 'basics.loops', level: 2, type: 'mcq',
      prompt: { fr: 'Qu’affiche ce code ?', en: 'What does this code print?' },
      code: 'const v = [1200, 0, 830, 0];\nlet n = 0;\nfor (const x of v) {\n  if (x === 0) continue;\n  n++;\n}\nconsole.log(n);',
      lang: 'js',
      choices: { fr: ['2', '4', '0', '1'], en: ['2', '4', '0', '1'] },
      answer: 0,
      explain: {
        fr: '<code>continue</code> saute les zéros ; <code>n</code> n’augmente que pour 1200 et 830 : 2.',
        en: '<code>continue</code> skips the zeros; <code>n</code> only goes up for 1200 and 830: 2.',
      },
    },
    {
      id: 'basics-q46', skill: 'basics.functions', level: 2, type: 'fill',
      prompt: { fr: 'Quel mot JavaScript rend une fonction utilisable par les autres fichiers ?', en: 'Which JavaScript word makes a function usable by other files?' },
      code: '____ function unitFactor(unit) { … }',
      lang: 'js',
      accept: ['export'],
      explain: {
        fr: '<code>export</code> publie la fonction ; les autres fichiers l’obtiennent avec <code>import { unitFactor } from \'./units.js\'</code>.',
        en: '<code>export</code> publishes the function; other files get it with <code>import { unitFactor } from \'./units.js\'</code>.',
      },
    },
    {
      id: 'basics-q47', skill: 'basics.collections', level: 2, type: 'match',
      prompt: { fr: 'Associe la méthode de tableau à son rôle.', en: 'Match the array method with its role.' },
      pairs: {
        fr: [['filter', 'garder certains éléments'], ['map', 'transformer chaque élément'], ['reduce', 'tout combiner en une valeur'], ['push', 'ajouter à la fin']],
        en: [['filter', 'keep some elements'], ['map', 'transform each element'], ['reduce', 'combine everything into one value'], ['push', 'add at the end']],
      },
      explain: {
        fr: 'Le tri au contrôle (filter), le poste de pesée (map), la balance de palette (reduce), et on pose une pièce de plus sur l’étagère (push).',
        en: 'Sorting at inspection (filter), the weighing station (map), the pallet scale (reduce), and putting one more part on the shelf (push).',
      },
    },
    {
      id: 'basics-q48', skill: 'basics.errors', level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi <code>worker.js</code> entoure-t-il toute l’analyse d’un <code>try { … } catch</code> ?', en: 'Why does <code>worker.js</code> wrap the whole analysis in a <code>try { … } catch</code>?' },
      choices: {
        fr: ['Pour renvoyer un message d’erreur à la page au lieu de mourir en silence', 'Pour accélérer OpenCascade', 'Parce que JavaScript l’impose', 'Pour cacher les erreurs à l’utilisateur'],
        en: ['To send an error message to the page instead of dying silently', 'To speed up OpenCascade', 'Because JavaScript requires it', 'To hide errors from the user'],
      },
      answer: 0,
      explain: {
        fr: 'Le <code>catch</code> transforme l’erreur en message <code>{ type: \'error\', message }</code> : la page peut l’afficher et, si l’erreur est fatale, redémarrer le Worker.',
        en: 'The <code>catch</code> turns the error into a <code>{ type: \'error\', message }</code> message: the page can show it and, if fatal, restart the Worker.',
      },
    },
    {
      id: 'basics-q49', skill: 'basics.types', level: 1, type: 'match',
      prompt: { fr: 'Associe le type « texte » à son nom dans chaque langage.', en: 'Match the “text” type with its name in each language.' },
      pairs: {
        fr: [['Python', 'str'], ['JavaScript', 'string'], ['C++', 'std::string']],
        en: [['Python', 'str'], ['JavaScript', 'string'], ['C++', 'std::string']],
      },
      explain: {
        fr: 'Même idée, trois noms. En C++, <code>std::</code> indique que le type vient de la bibliothèque standard.',
        en: 'Same idea, three names. In C++, <code>std::</code> says the type comes from the standard library.',
      },
    },
    {
      id: 'basics-q50', skill: 'basics.loops', level: 3, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui fixe le <strong>pas</strong> de la boucle.', en: 'Click the line that sets the <strong>step</strong> of the loop.' },
      code: 'const n = indices.length;\nlet t = 0;\nwhile (t < n) {\n  visit(indices[t], indices[t + 1], indices[t + 2]);\n  t += 3;\n}',
      lang: 'js',
      answer: 4,
      explain: {
        fr: '<code>t += 3</code> fait avancer d’un triangle (3 indices) à chaque tour. C’est la même boucle que <code>for (let t = 0; t &lt; n; t += 3)</code>.',
        en: '<code>t += 3</code> moves forward one triangle (3 indices) each round. It is the same loop as <code>for (let t = 0; t &lt; n; t += 3)</code>.',
      },
    },
  ],
};
