// Module « C++, OpenCascade et WebAssembly » — voir formation/CONTENT_SPEC.md
export default {
  id: 'cpp',
  order: 5,
  icon: '⚙️',
  color: '#00599c',
  title: { fr: 'C++, OpenCascade et WebAssembly', en: 'C++, OpenCascade and WebAssembly' },
  summary: {
    fr: 'Lire le C++ qui calcule les volumes exacts, comprendre la mémoire, la compilation et comment ce moteur C++ finit dans ton navigateur.',
    en: 'Read the C++ that computes exact volumes, understand memory, compilation and how this C++ engine ends up in your browser.',
  },
  skills: {
    'cpp.syntax': { fr: 'Lire la syntaxe de base du C++', en: 'Reading basic C++ syntax' },
    'cpp.functions': { fr: 'Fonctions, références et pointeurs', en: 'Functions, references and pointers' },
    'cpp.classes': { fr: 'Classes, surcharge et templates', en: 'Classes, overloading and templates' },
    'cpp.memory': { fr: 'Mémoire : pile, tas, Handle et delete()', en: 'Memory: stack, heap, Handle and delete()' },
    'cpp.build': { fr: 'Compilation, Emscripten et WebAssembly', en: 'Compilation, Emscripten and WebAssembly' },
    'cpp.occt': { fr: 'OpenCascade : B-rep, lecture STEP, volume exact', en: 'OpenCascade: B-rep, STEP reading, exact volume' },
  },
  widgets: {},
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'cpp-1',
      title: { fr: 'Lire un programme C++', en: 'Reading a C++ program' },
      skills: ['cpp.syntax'],
      minutes: 10,
      body: {
        fr: `<h3>Pourquoi le C++ te concerne</h3>
<p>Tu n'écriras sans doute jamais de C++ pour 3D Reader. Pourtant, le cœur qui calcule le <strong>volume exact</strong> d'un fichier STEP, c'est <strong>OpenCascade</strong>, une bibliothèque de plusieurs millions de lignes écrite en C++. Tous les noms bizarres que tu croises dans <code>web/engine/cad.js</code> ou <code>reader3d/cad.py</code> (<code>TopoDS_Shape</code>, <code>BRepGProp</code>, <code>STEPCAFControl_Reader</code>…) viennent de là. Savoir lire un peu de C++, c'est comprendre d'où viennent ces briques.</p>
<p>Le C++ est un langage <span class="term" data-term="compiler">compilé</span> : avant de tourner, tout le programme est traduit en code machine. C'est pour ça qu'il est très rapide — idéal pour intégrer des surfaces NURBS sur des milliers de faces.</p>
<h3>Un premier programme, ligne par ligne</h3>
~~~cpp title="masse.cpp (exemple)"
#include <iostream>   //«1»
#include <string>

namespace fonderie {  //«2»
  const double DENSITE_ALU = 2.70; // g/cm3
}

int main() {          //«3»
  int pieces = 12;                  //«4»
  double volume_cm3 = 350.5;
  bool coquille = true;
  std::string nom = "Carter";       //«5»
  auto masse = volume_cm3 * fonderie::DENSITE_ALU;  //«6»
  std::cout << nom << " : " << masse << " g" << std::endl;
  return 0;           //«7»
}
~~~
<ol class="notes">
<li><code>#include</code> ouvre une boîte à outils : <code>iostream</code> pour afficher du texte, <code>string</code> pour les chaînes. C'est l'équivalent de <code>import</code> en Python.</li>
<li><code>namespace</code> range des noms dans une « famille » pour éviter les collisions. On y accède avec <code>::</code> : <code>fonderie::DENSITE_ALU</code>.</li>
<li><code>main</code> est le point de départ : le programme commence toujours là. <code>int</code> devant veut dire qu'elle renvoie un entier.</li>
<li>Chaque variable a un <strong>type déclaré</strong> : <code>int</code> (entier), <code>double</code> (nombre à virgule), <code>bool</code> (vrai/faux).</li>
<li><code>std::string</code> : une chaîne de caractères qui vient de la bibliothèque standard (<code>std</code>).</li>
<li><code>auto</code> laisse le compilateur deviner le type (ici <code>double</code>).</li>
<li><code>return 0;</code> : « tout s'est bien passé ».</li>
</ol>
<h3>Les règles de ponctuation</h3>
<ul>
<li>Chaque instruction se termine par un <strong>point-virgule</strong> <code>;</code>.</li>
<li>Les <strong>accolades</strong> <code>{ }</code> délimitent un bloc (en Python, c'est l'indentation qui le fait).</li>
<li><code>//</code> commence un commentaire d'une ligne, <code>/* … */</code> un commentaire sur plusieurs lignes.</li>
</ul>
<div class="compare">
~~~py title="Python"
pieces = 12
nom = "Carter"
if pieces > 10:
    print(nom)
~~~
~~~js title="JavaScript"
let pieces = 12;
const nom = "Carter";
if (pieces > 10) {
  console.log(nom);
}
~~~
~~~cpp title="C++"
int pieces = 12;
std::string nom = "Carter";
if (pieces > 10) {
  std::cout << nom;
}
~~~
</div>
<table><thead><tr><th>C++</th><th>Python</th><th>Contient</th></tr></thead><tbody>
<tr><td><code>int</code></td><td><code>int</code></td><td>entier : 12</td></tr>
<tr><td><code>double</code></td><td><code>float</code></td><td>nombre à virgule : 350.5</td></tr>
<tr><td><code>bool</code></td><td><code>bool</code></td><td><code>true</code> / <code>false</code> (en minuscules !)</td></tr>
<tr><td><code>std::string</code></td><td><code>str</code></td><td>texte : "Carter"</td></tr>
<tr><td><code>auto</code></td><td>(toujours implicite)</td><td>type deviné</td></tr>
</tbody></table>
<div class="callout warn">Un type déclaré ne change plus : <code>int pieces = 12;</code> puis <code>pieces = "douze";</code> est refusé <em>à la compilation</em>. En Python, ça passerait… et planterait peut-être plus tard.</div>
<div class="callout project"><strong>Dans 3D Reader</strong> : les noms OpenCascade suivent la règle <em>Paquet_Classe</em>. <code>BRepGProp</code> = « B-rep Global Properties » (propriétés globales d'un solide), <code>gp_Pnt</code> = « geometric primitive : point », <code>TopoDS_Shape</code> = « Topology Data Structure : forme ». Le préfixe avant le <code>_</code> te dit dans quel rayon de la boîte à outils chercher.</div>`,
        en: `<h3>Why C++ matters to you</h3>
<p>You will probably never write C++ for 3D Reader. Yet the heart that computes the <strong>exact volume</strong> of a STEP file is <strong>OpenCascade</strong>, a library of several million lines written in C++. All the odd names you meet in <code>web/engine/cad.js</code> or <code>reader3d/cad.py</code> (<code>TopoDS_Shape</code>, <code>BRepGProp</code>, <code>STEPCAFControl_Reader</code>…) come from there. Reading a little C++ means understanding where those bricks come from.</p>
<p>C++ is a <span class="term" data-term="compiler">compiled</span> language: before it runs, the whole program is translated into machine code. That is why it is very fast — ideal for integrating NURBS surfaces over thousands of faces.</p>
<h3>A first program, line by line</h3>
~~~cpp title="mass.cpp (example)"
#include <iostream>   //«1»
#include <string>

namespace foundry {   //«2»
  const double ALU_DENSITY = 2.70; // g/cm3
}

int main() {          //«3»
  int parts = 12;                   //«4»
  double volume_cm3 = 350.5;
  bool permanent_mould = true;
  std::string name = "Housing";     //«5»
  auto mass = volume_cm3 * foundry::ALU_DENSITY;  //«6»
  std::cout << name << " : " << mass << " g" << std::endl;
  return 0;           //«7»
}
~~~
<ol class="notes">
<li><code>#include</code> opens a toolbox: <code>iostream</code> to print text, <code>string</code> for strings. It is the equivalent of <code>import</code> in Python.</li>
<li><code>namespace</code> puts names into a "family" to avoid clashes. You reach them with <code>::</code>: <code>foundry::ALU_DENSITY</code>.</li>
<li><code>main</code> is the starting point: the program always begins there. The <code>int</code> in front means it returns an integer.</li>
<li>Every variable has a <strong>declared type</strong>: <code>int</code> (integer), <code>double</code> (decimal number), <code>bool</code> (true/false).</li>
<li><code>std::string</code>: a character string from the standard library (<code>std</code>).</li>
<li><code>auto</code> lets the compiler guess the type (here <code>double</code>).</li>
<li><code>return 0;</code>: "everything went fine".</li>
</ol>
<h3>Punctuation rules</h3>
<ul>
<li>Every statement ends with a <strong>semicolon</strong> <code>;</code>.</li>
<li><strong>Braces</strong> <code>{ }</code> delimit a block (in Python, indentation does that).</li>
<li><code>//</code> starts a one-line comment, <code>/* … */</code> a multi-line comment.</li>
</ul>
<div class="compare">
~~~py title="Python"
parts = 12
name = "Housing"
if parts > 10:
    print(name)
~~~
~~~js title="JavaScript"
let parts = 12;
const name = "Housing";
if (parts > 10) {
  console.log(name);
}
~~~
~~~cpp title="C++"
int parts = 12;
std::string name = "Housing";
if (parts > 10) {
  std::cout << name;
}
~~~
</div>
<table><thead><tr><th>C++</th><th>Python</th><th>Holds</th></tr></thead><tbody>
<tr><td><code>int</code></td><td><code>int</code></td><td>integer: 12</td></tr>
<tr><td><code>double</code></td><td><code>float</code></td><td>decimal number: 350.5</td></tr>
<tr><td><code>bool</code></td><td><code>bool</code></td><td><code>true</code> / <code>false</code> (lower case!)</td></tr>
<tr><td><code>std::string</code></td><td><code>str</code></td><td>text: "Housing"</td></tr>
<tr><td><code>auto</code></td><td>(always implicit)</td><td>guessed type</td></tr>
</tbody></table>
<div class="callout warn">A declared type never changes: <code>int parts = 12;</code> then <code>parts = "twelve";</code> is rejected <em>at compile time</em>. In Python it would pass… and maybe crash later.</div>
<div class="callout project"><strong>In 3D Reader</strong>: OpenCascade names follow the <em>Package_Class</em> rule. <code>BRepGProp</code> = "B-rep Global Properties" (global properties of a solid), <code>gp_Pnt</code> = "geometric primitive: point", <code>TopoDS_Shape</code> = "Topology Data Structure: shape". The prefix before the <code>_</code> tells you which aisle of the toolbox to look in.</div>`,
      },
      deep: {
        fr: `<h3>Le C++ expliqué comme une fiche de fabrication</h3>
<div class="callout analogy">Imagine une <strong>gamme de fabrication</strong> très stricte. Avant de lancer la production, le bureau des méthodes (le <strong>compilateur</strong>) relit toute la gamme : chaque outil doit être déclaré, chaque cote doit avoir une unité. S'il manque une seule information, la gamme est refusée et rien n'est produit. Python, lui, ressemble à un chef d'atelier qui lit la gamme au fil de l'eau et ne découvre l'erreur qu'en arrivant à la ligne fautive.</div>
<h4>Méthode en 5 regards pour lire n'importe quel fichier C++</h4>
<ol>
<li><strong>Les <code>#include</code> en haut</strong> : la liste des outils empruntés. <code>#include &lt;iostream&gt;</code> = « je vais afficher du texte ».</li>
<li><strong>Les <code>namespace</code></strong> : des tiroirs étiquetés. <code>std::string</code> se lit « l'outil <em>string</em> du tiroir <em>std</em> ».</li>
<li><strong><code>main</code></strong> : la première opération de la gamme.</li>
<li><strong>Le mot avant chaque nom</strong> : c'est le type. <code>double volume</code> se lit « une case nommée volume qui contient un nombre à virgule ».</li>
<li><strong>Les <code>;</code> et <code>{ }</code></strong> : les fins de phrase et les paragraphes.</li>
</ol>
<h4>Mini-exemple commenté</h4>
~~~cpp
int nb_noyaux = 3;        // une case "entier" qui vaut 3
double epaisseur = 4.5;   // une case "nombre à virgule" : 4,5 mm
bool usinable = false;    // une case "oui/non"
auto total = nb_noyaux * epaisseur; // le compilateur déduit : double
~~~
<p>Schéma mental :</p>
~~~text
 type      nom          valeur
 ┌──────┐ ┌──────────┐ ┌─────┐
 │ int  │ │nb_noyaux │=│  3  │ ;   <- le ; ferme la phrase
 └──────┘ └──────────┘ └─────┘
~~~
<h4>Les erreurs classiques du débutant</h4>
<ul>
<li>Oublier le <code>;</code> : le compilateur se plaint souvent à la ligne <em>suivante</em>. Regarde donc la ligne au-dessus de l'erreur.</li>
<li>Écrire <code>True</code> comme en Python : en C++ c'est <code>true</code>.</li>
<li>Confondre <code>=</code> (ranger une valeur) et <code>==</code> (comparer).</li>
<li>Oublier <code>std::</code> devant <code>string</code> ou <code>cout</code>.</li>
</ul>
<div class="callout tip">Quand tu vois <code>::</code>, lis « de ». <code>fonderie::DENSITE_ALU</code> = « DENSITE_ALU de fonderie ». <code>BRepGProp::VolumeProperties</code> = « VolumeProperties de BRepGProp ».</div>`,
        en: `<h3>C++ explained like a routing sheet</h3>
<div class="callout analogy">Picture a very strict <strong>manufacturing routing sheet</strong>. Before production starts, the methods office (the <strong>compiler</strong>) rereads the whole sheet: every tool must be declared, every dimension must have a unit. If a single piece of information is missing, the sheet is rejected and nothing is produced. Python is more like a shop foreman who reads the sheet as he goes and only discovers the error when reaching the faulty line.</div>
<h4>A 5-look method to read any C++ file</h4>
<ol>
<li><strong>The <code>#include</code> lines at the top</strong>: the list of borrowed tools. <code>#include &lt;iostream&gt;</code> = "I am going to print text".</li>
<li><strong>The <code>namespace</code>s</strong>: labelled drawers. <code>std::string</code> reads "the <em>string</em> tool from the <em>std</em> drawer".</li>
<li><strong><code>main</code></strong>: the first operation of the routing.</li>
<li><strong>The word before each name</strong>: it is the type. <code>double volume</code> reads "a box named volume holding a decimal number".</li>
<li><strong>The <code>;</code> and <code>{ }</code></strong>: ends of sentences and paragraphs.</li>
</ol>
<h4>Commented mini-example</h4>
~~~cpp
int core_count = 3;       // an "integer" box holding 3
double thickness = 4.5;   // a "decimal number" box: 4.5 mm
bool machinable = false;  // a "yes/no" box
auto total = core_count * thickness; // the compiler deduces: double
~~~
<p>Mental picture:</p>
~~~text
 type      name         value
 ┌──────┐ ┌──────────┐ ┌─────┐
 │ int  │ │core_count│=│  3  │ ;   <- the ; ends the sentence
 └──────┘ └──────────┘ └─────┘
~~~
<h4>Classic beginner mistakes</h4>
<ul>
<li>Forgetting the <code>;</code>: the compiler often complains on the <em>next</em> line. So look at the line above the error.</li>
<li>Writing <code>True</code> as in Python: in C++ it is <code>true</code>.</li>
<li>Mixing up <code>=</code> (store a value) and <code>==</code> (compare).</li>
<li>Forgetting <code>std::</code> before <code>string</code> or <code>cout</code>.</li>
</ul>
<div class="callout tip">When you see <code>::</code>, read "of". <code>foundry::ALU_DENSITY</code> = "ALU_DENSITY of foundry". <code>BRepGProp::VolumeProperties</code> = "VolumeProperties of BRepGProp".</div>`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'cpp-2',
      title: { fr: 'Fonctions, références et pointeurs', en: 'Functions, references and pointers' },
      skills: ['cpp.functions'],
      minutes: 12,
      body: {
        fr: `<h3>Une fonction C++</h3>
<p>Une fonction C++ annonce <strong>le type de ce qu'elle renvoie</strong>, son nom, puis ses paramètres avec leur type :</p>
~~~cpp
double masse_g(double volume_mm3, double densite) {  //«1»
  return volume_mm3 / 1000.0 * densite;              //«2»
}

void afficher(const std::string& texte) {             //«3»
  std::cout << texte << std::endl;
}
~~~
<ol class="notes">
<li>Renvoie un <code>double</code>, s'appelle <code>masse_g</code>, prend deux <code>double</code>.</li>
<li><code>return</code> renvoie le résultat, comme en Python.</li>
<li><code>void</code> = « ne renvoie rien ». Le <code>const std::string&amp;</code> est expliqué juste après.</li>
</ol>
<h3>Passer par valeur ou par référence</h3>
<p>Quand tu appelles une fonction, le C++ te laisse choisir : donner <strong>une copie</strong> de la donnée, ou donner <strong>l'adresse</strong> de la donnée originale.</p>
<div class="callout analogy"><strong>L'adresse postale.</strong> Passer <em>par valeur</em>, c'est photocopier un plan et l'envoyer : le destinataire peut gribouiller dessus, ton original ne bouge pas. Passer <em>par référence</em>, c'est lui donner l'adresse de ton bureau : il vient travailler directement sur ton plan. Plus rapide (pas de photocopie de 500 pages)… mais il peut le modifier.</div>
~~~cpp
void par_valeur(int n)      { n = 99; }  // modifie une copie
void par_reference(int& n)  { n = 99; }  //«1» modifie l'original
void lecture_seule(const int& n) { /* n = 99; interdit */ }  //«2»

int main() {
  int a = 1, b = 1;
  par_valeur(a);     // a vaut toujours 1
  par_reference(b);  // b vaut maintenant 99
}
~~~
<ol class="notes">
<li>Le <code>&amp;</code> après le type = <strong>référence</strong> : un autre nom pour la même case mémoire.</li>
<li><code>const</code> = promesse de ne pas modifier. <code>const T&amp;</code> est la façon classique de passer un gros objet (une forme 3D) <em>sans copie et sans risque</em>.</li>
</ol>
<h3>Les pointeurs <code>*</code></h3>
<p>Un <strong>pointeur</strong> est une variable qui contient une <em>adresse mémoire</em>. On le reconnaît à l'étoile.</p>
~~~cpp
int stock = 40;
int* p = &stock;   //«1» p contient l'adresse de stock
*p = 35;           //«2» va à cette adresse et écris 35
// stock vaut maintenant 35
int* rien = nullptr; //«3»
~~~
<ol class="notes">
<li><code>&amp;stock</code> (ici devant une variable) = « l'adresse de stock ».</li>
<li><code>*p</code> = « ce qu'il y a à l'adresse p » (on dit <em>déréférencer</em>).</li>
<li><code>nullptr</code> = pointeur qui ne pointe sur rien (comme <code>None</code> / <code>null</code>). Le déréférencer fait planter le programme.</li>
</ol>
<table><thead><tr><th>Symbole</th><th>Où ?</th><th>Se lit</th></tr></thead><tbody>
<tr><td><code>int&amp; r</code></td><td>dans une déclaration</td><td>r est une référence vers un int</td></tr>
<tr><td><code>&amp;x</code></td><td>devant une variable</td><td>adresse de x</td></tr>
<tr><td><code>int* p</code></td><td>dans une déclaration</td><td>p est un pointeur vers un int</td></tr>
<tr><td><code>*p</code></td><td>devant un pointeur</td><td>la valeur pointée</td></tr>
<tr><td><code>p-&gt;nom</code></td><td>pointeur vers un objet</td><td>le membre nom de l'objet pointé</td></tr>
</tbody></table>
<div class="callout project"><strong>Dans 3D Reader</strong> : les fonctions OpenCascade prennent presque toutes leurs formes par <code>const TopoDS_Shape&amp;</code>, et remplissent un objet résultat passé par référence. C'est pourquoi en Python on écrit <code>props = GProp_GProps()</code> puis <code>BRepGProp.VolumeProperties_s(solid, props, GPROP_EPS)</code> : la fonction ne « renvoie » pas le volume, elle <strong>écrit dans</strong> <code>props</code>, reçu par référence.</div>
<div class="callout info">JavaScript et Python n'ont pas de pointeurs visibles, mais les objets y sont toujours passés « comme par référence » : si une fonction modifie un tableau reçu, l'original change.</div>`,
        en: `<h3>A C++ function</h3>
<p>A C++ function states <strong>the type of what it returns</strong>, its name, then its parameters with their types:</p>
~~~cpp
double mass_g(double volume_mm3, double density) {   //«1»
  return volume_mm3 / 1000.0 * density;              //«2»
}

void show(const std::string& text) {                  //«3»
  std::cout << text << std::endl;
}
~~~
<ol class="notes">
<li>Returns a <code>double</code>, is named <code>mass_g</code>, takes two <code>double</code>s.</li>
<li><code>return</code> gives back the result, as in Python.</li>
<li><code>void</code> = "returns nothing". The <code>const std::string&amp;</code> is explained just below.</li>
</ol>
<h3>Passing by value or by reference</h3>
<p>When you call a function, C++ lets you choose: give <strong>a copy</strong> of the data, or give <strong>the address</strong> of the original data.</p>
<div class="callout analogy"><strong>The postal address.</strong> Passing <em>by value</em> is photocopying a drawing and mailing it: the recipient can scribble on it, your original does not move. Passing <em>by reference</em> is giving them your office address: they come and work directly on your drawing. Faster (no 500-page photocopy)… but they can change it.</div>
~~~cpp
void by_value(int n)      { n = 99; }  // changes a copy
void by_reference(int& n) { n = 99; }  //«1» changes the original
void read_only(const int& n) { /* n = 99; forbidden */ }  //«2»

int main() {
  int a = 1, b = 1;
  by_value(a);      // a is still 1
  by_reference(b);  // b is now 99
}
~~~
<ol class="notes">
<li>The <code>&amp;</code> after the type = <strong>reference</strong>: another name for the same memory box.</li>
<li><code>const</code> = a promise not to modify. <code>const T&amp;</code> is the classic way to pass a big object (a 3D shape) <em>without a copy and without risk</em>.</li>
</ol>
<h3>Pointers <code>*</code></h3>
<p>A <strong>pointer</strong> is a variable holding a <em>memory address</em>. You recognise it by the star.</p>
~~~cpp
int stock = 40;
int* p = &stock;   //«1» p holds the address of stock
*p = 35;           //«2» go to that address and write 35
// stock is now 35
int* nothing = nullptr; //«3»
~~~
<ol class="notes">
<li><code>&amp;stock</code> (here in front of a variable) = "the address of stock".</li>
<li><code>*p</code> = "what is at address p" (this is called <em>dereferencing</em>).</li>
<li><code>nullptr</code> = a pointer pointing at nothing (like <code>None</code> / <code>null</code>). Dereferencing it crashes the program.</li>
</ol>
<table><thead><tr><th>Symbol</th><th>Where?</th><th>Reads</th></tr></thead><tbody>
<tr><td><code>int&amp; r</code></td><td>in a declaration</td><td>r is a reference to an int</td></tr>
<tr><td><code>&amp;x</code></td><td>in front of a variable</td><td>address of x</td></tr>
<tr><td><code>int* p</code></td><td>in a declaration</td><td>p is a pointer to an int</td></tr>
<tr><td><code>*p</code></td><td>in front of a pointer</td><td>the value pointed to</td></tr>
<tr><td><code>p-&gt;name</code></td><td>pointer to an object</td><td>the member name of the object pointed to</td></tr>
</tbody></table>
<div class="callout project"><strong>In 3D Reader</strong>: almost every OpenCascade function takes its shapes as <code>const TopoDS_Shape&amp;</code>, and fills a result object passed by reference. That is why in Python we write <code>props = GProp_GProps()</code> then <code>BRepGProp.VolumeProperties_s(solid, props, GPROP_EPS)</code>: the function does not "return" the volume, it <strong>writes into</strong> <code>props</code>, received by reference.</div>
<div class="callout info">JavaScript and Python have no visible pointers, but objects are always passed "as if by reference": if a function modifies an array it received, the original changes.</div>`,
      },
      deep: {
        fr: `<h3>Références et pointeurs, version atelier</h3>
<div class="callout analogy">La mémoire de l'ordinateur est un <strong>immense magasin de casiers numérotés</strong>. Chaque variable occupe un casier. Le numéro du casier, c'est son <strong>adresse</strong>.
<ul>
<li>Une <strong>copie</strong> (par valeur) : tu prends une pièce dans le casier 120 et tu en fabriques une identique dans le casier 300. Si on usine celle du 300, celle du 120 reste brute.</li>
<li>Une <strong>référence</strong> <code>&amp;</code> : tu colles une deuxième étiquette sur le casier 120. Deux noms, une seule pièce.</li>
<li>Un <strong>pointeur</strong> <code>*</code> : un ticket sur lequel est écrit « casier 120 ». Le ticket est lui-même rangé dans un casier, on peut le changer pour qu'il indique un autre casier, ou le laisser blanc (<code>nullptr</code>).</li>
</ul></div>
~~~text
 casier 120          casier 300 (pointeur p)
 ┌────────────┐      ┌──────────────┐
 │ stock = 40 │ <─── │ "casier 120" │
 └────────────┘      └──────────────┘
   ^  ^
   │  └── référence r : 2e étiquette sur le même casier
   └───── nom d'origine "stock"
~~~
<h4>Pas à pas</h4>
~~~cpp
int stock = 40;    // casier 120 contient 40
int& r = stock;    // étiquette "r" sur le casier 120
r = 38;            // stock vaut 38 (même casier)
int* p = &stock;   // ticket "casier 120"
*p = 35;           // on suit le ticket et on écrit 35 -> stock vaut 35
~~~
<h4>Pourquoi <code>const&amp;</code> est partout dans OpenCascade</h4>
<p>Une forme 3D peut peser des centaines de mégaoctets. La copier à chaque appel de fonction serait comme photocopier tout le dossier technique pour qu'un collègue lise une seule cote. Avec <code>const TopoDS_Shape&amp;</code>, on lui donne l'adresse du dossier <em>et</em> on lui interdit d'écrire dedans. Rapide et sûr.</p>
<h4>Pièges</h4>
<ul>
<li>Le même signe <code>&amp;</code> a deux sens : dans une déclaration (<code>int&amp; r</code>) = référence ; devant une variable (<code>&amp;x</code>) = « adresse de ».</li>
<li>Pareil pour <code>*</code> : dans une déclaration (<code>int* p</code>) = pointeur ; devant un pointeur (<code>*p</code>) = « la valeur pointée ».</li>
<li>Suivre un pointeur <code>nullptr</code> = plantage immédiat (« segmentation fault »). C'est exactement le genre de plantage qui oblige 3D Reader à isoler OpenCascade dans un processus à part côté Python.</li>
</ul>`,
        en: `<h3>References and pointers, workshop version</h3>
<div class="callout analogy">The computer's memory is a <strong>huge store of numbered lockers</strong>. Each variable occupies a locker. The locker number is its <strong>address</strong>.
<ul>
<li>A <strong>copy</strong> (by value): you take a part from locker 120 and make an identical one in locker 300. If you machine the one in 300, the one in 120 stays raw.</li>
<li>A <strong>reference</strong> <code>&amp;</code>: you stick a second label on locker 120. Two names, a single part.</li>
<li>A <strong>pointer</strong> <code>*</code>: a ticket with "locker 120" written on it. The ticket itself sits in a locker; you can change it to show another locker, or leave it blank (<code>nullptr</code>).</li>
</ul></div>
~~~text
 locker 120          locker 300 (pointer p)
 ┌────────────┐      ┌──────────────┐
 │ stock = 40 │ <─── │ "locker 120" │
 └────────────┘      └──────────────┘
   ^  ^
   │  └── reference r: 2nd label on the same locker
   └───── original name "stock"
~~~
<h4>Step by step</h4>
~~~cpp
int stock = 40;    // locker 120 holds 40
int& r = stock;    // label "r" on locker 120
r = 38;            // stock is 38 (same locker)
int* p = &stock;   // ticket "locker 120"
*p = 35;           // follow the ticket and write 35 -> stock is 35
~~~
<h4>Why <code>const&amp;</code> is everywhere in OpenCascade</h4>
<p>A 3D shape can weigh hundreds of megabytes. Copying it at every function call would be like photocopying the whole technical file so a colleague can read one dimension. With <code>const TopoDS_Shape&amp;</code>, you give them the address of the file <em>and</em> forbid them to write in it. Fast and safe.</p>
<h4>Traps</h4>
<ul>
<li>The same sign <code>&amp;</code> has two meanings: in a declaration (<code>int&amp; r</code>) = reference; in front of a variable (<code>&amp;x</code>) = "address of".</li>
<li>Same for <code>*</code>: in a declaration (<code>int* p</code>) = pointer; in front of a pointer (<code>*p</code>) = "the value pointed to".</li>
<li>Following a <code>nullptr</code> pointer = immediate crash ("segmentation fault"). That is exactly the kind of crash that forces 3D Reader to isolate OpenCascade in a separate process on the Python side.</li>
</ul>`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'cpp-3',
      title: { fr: 'Classes, surcharge et templates', en: 'Classes, overloading and templates' },
      skills: ['cpp.classes'],
      minutes: 12,
      body: {
        fr: `<h3>Une classe = un plan type</h3>
<p>Une <strong>classe</strong> décrit un type d'objet : ses données (attributs) et ce qu'il sait faire (méthodes). Un <strong>objet</strong> est un exemplaire fabriqué d'après ce plan.</p>
~~~cpp
class Moule {                       //«1»
public:                             //«2»
  Moule(std::string nom, int empreintes)      //«3»
    : nom_(nom), empreintes_(empreintes) {}

  int pieces_par_cycle() const {    //«4»
    return empreintes_;
  }
private:
  std::string nom_;                 //«5»
  int empreintes_;
};

Moule m("Carter", 2);               //«6»
int n = m.pieces_par_cycle();       // 2
~~~
<ol class="notes">
<li><code>class</code> + nom : le plan type.</li>
<li><code>public:</code> = accessible de l'extérieur ; <code>private:</code> = réservé à la classe.</li>
<li>Le <strong>constructeur</strong> porte le nom de la classe : il initialise l'objet (comme <code>__init__</code> en Python, <code>constructor</code> en JS).</li>
<li>Une <strong>méthode</strong>. Le <code>const</code> final promet qu'elle ne modifie pas l'objet.</li>
<li>Les attributs, souvent suffixés par <code>_</code> pour les distinguer.</li>
<li>Fabrication d'un objet <code>m</code>, puis appel de méthode avec le point.</li>
</ol>
<h3>Héritage</h3>
~~~cpp
class MouleCoquille : public Moule {   // "est un" Moule
  // hérite de tout, ajoute ses particularités
};
~~~
<p>OpenCascade en use beaucoup : <code>TopoDS_Solid</code>, <code>TopoDS_Face</code>, <code>TopoDS_Edge</code> héritent tous de <code>TopoDS_Shape</code>.</p>
<h3>La surcharge, et le mystère des <code>_1</code>, <code>_2</code></h3>
<p>En C++, plusieurs fonctions peuvent porter <strong>le même nom</strong> si leurs paramètres diffèrent : c'est la <strong>surcharge</strong>. Le compilateur choisit la bonne selon les types passés.</p>
~~~cpp
gp_Pnt();                          // constructeur 1 : point (0,0,0)
gp_Pnt(double x, double y, double z); // constructeur 3 : point (x,y,z)
~~~
<p>Mais JavaScript ne sait pas faire ça : une fonction n'a qu'une définition par nom. Alors <strong>opencascade.js numérote les variantes</strong> :</p>
~~~js title="web/engine/cad.js"
const props = new oc.GProp_GProps_1();          // 1re variante du constructeur
const apex = new oc.gp_Pnt_3(x, y, z);          // 3e variante : avec 3 coordonnées
const reader = new oc.STEPCAFControl_Reader_1(); // sans argument
~~~
<p>De même, Python (OCP) marque les fonctions <strong>statiques</strong> (appelées sur la classe, pas sur un objet) par <code>_s</code> : <code>BRepGProp.VolumeProperties_s(...)</code>.</p>
<h3>Templates et <code>std::vector</code></h3>
<p>Un <strong>template</strong> est un modèle de classe ou de fonction qui fonctionne pour n'importe quel type, précisé entre chevrons <code>&lt; &gt;</code>.</p>
~~~cpp
#include <vector>
std::vector<double> volumes = {120.5, 98.0, 310.2};  // liste de double
volumes.push_back(45.7);                              // ajoute à la fin
std::size_t n = volumes.size();                       // 4
for (double v : volumes) { std::cout << v; }          // parcourt
~~~
<p><code>std::vector&lt;double&gt;</code> = l'équivalent d'une liste Python ou d'un tableau JS, mais dont tous les éléments sont des <code>double</code>.</p>
<div class="callout project"><strong>Dans 3D Reader</strong> : <code>Handle(TDocStd_Document)</code> en C++ est un template caché (<code>opencascade::handle&lt;TDocStd_Document&gt;</code>). En JS il devient <code>new oc.Handle_TDocStd_Document_2(doc)</code> : le nom du type est collé dans le nom de la classe, puis numéroté.</div>`,
        en: `<h3>A class = a template drawing</h3>
<p>A <strong>class</strong> describes a type of object: its data (attributes) and what it can do (methods). An <strong>object</strong> is one copy built from that drawing.</p>
~~~cpp
class Mould {                       //«1»
public:                             //«2»
  Mould(std::string name, int cavities)       //«3»
    : name_(name), cavities_(cavities) {}

  int parts_per_cycle() const {     //«4»
    return cavities_;
  }
private:
  std::string name_;                //«5»
  int cavities_;
};

Mould m("Housing", 2);              //«6»
int n = m.parts_per_cycle();        // 2
~~~
<ol class="notes">
<li><code>class</code> + name: the template drawing.</li>
<li><code>public:</code> = reachable from outside; <code>private:</code> = reserved to the class.</li>
<li>The <strong>constructor</strong> has the class name: it initialises the object (like <code>__init__</code> in Python, <code>constructor</code> in JS).</li>
<li>A <strong>method</strong>. The trailing <code>const</code> promises it does not modify the object.</li>
<li>The attributes, often suffixed with <code>_</code> to tell them apart.</li>
<li>Building an object <code>m</code>, then calling a method with the dot.</li>
</ol>
<h3>Inheritance</h3>
~~~cpp
class PermanentMould : public Mould {   // "is a" Mould
  // inherits everything, adds its specifics
};
~~~
<p>OpenCascade uses it a lot: <code>TopoDS_Solid</code>, <code>TopoDS_Face</code>, <code>TopoDS_Edge</code> all inherit from <code>TopoDS_Shape</code>.</p>
<h3>Overloading, and the mystery of <code>_1</code>, <code>_2</code></h3>
<p>In C++, several functions can share <strong>the same name</strong> if their parameters differ: this is <strong>overloading</strong>. The compiler picks the right one from the types passed.</p>
~~~cpp
gp_Pnt();                          // constructor 1: point (0,0,0)
gp_Pnt(double x, double y, double z); // constructor 3: point (x,y,z)
~~~
<p>But JavaScript cannot do that: a function has one definition per name. So <strong>opencascade.js numbers the variants</strong>:</p>
~~~js title="web/engine/cad.js"
const props = new oc.GProp_GProps_1();          // 1st constructor variant
const apex = new oc.gp_Pnt_3(x, y, z);          // 3rd variant: with 3 coordinates
const reader = new oc.STEPCAFControl_Reader_1(); // no argument
~~~
<p>Likewise, Python (OCP) marks <strong>static</strong> functions (called on the class, not on an object) with <code>_s</code>: <code>BRepGProp.VolumeProperties_s(...)</code>.</p>
<h3>Templates and <code>std::vector</code></h3>
<p>A <strong>template</strong> is a pattern of class or function that works for any type, given between angle brackets <code>&lt; &gt;</code>.</p>
~~~cpp
#include <vector>
std::vector<double> volumes = {120.5, 98.0, 310.2};  // list of double
volumes.push_back(45.7);                              // append at the end
std::size_t n = volumes.size();                       // 4
for (double v : volumes) { std::cout << v; }          // loop over it
~~~
<p><code>std::vector&lt;double&gt;</code> = the equivalent of a Python list or a JS array, but all its elements are <code>double</code>s.</p>
<div class="callout project"><strong>In 3D Reader</strong>: <code>Handle(TDocStd_Document)</code> in C++ is a hidden template (<code>opencascade::handle&lt;TDocStd_Document&gt;</code>). In JS it becomes <code>new oc.Handle_TDocStd_Document_2(doc)</code>: the type name is glued into the class name, then numbered.</div>`,
      },
      deep: {
        fr: `<h3>Classes et surcharge, version bureau d'études</h3>
<div class="callout analogy">Une <strong>classe</strong>, c'est le <strong>plan d'une pièce type</strong> (avec ses cotes et ses opérations possibles). Un <strong>objet</strong>, c'est une <strong>pièce coulée</strong> d'après ce plan : chaque pièce a son numéro de série et ses propres valeurs, mais toutes suivent le même plan.</div>
~~~text
   PLAN (classe Moule)           PIÈCES (objets)
 ┌─────────────────────┐       ┌───────────────┐ ┌───────────────┐
 │ nom_ : texte        │  ───> │ "Carter", 2   │ │ "Bride", 4    │
 │ empreintes_ : entier│       └───────────────┘ └───────────────┘
 │ pieces_par_cycle()  │
 └─────────────────────┘
~~~
<h4>L'héritage = une famille de plans</h4>
<p>« Moule coquille » <em>est un</em> « Moule » avec des particularités. Il reprend tout ce que sait faire un moule et en ajoute. Dans OpenCascade, une face, une arête, un solide <em>sont des</em> formes (<code>TopoDS_Shape</code>) : une fonction qui accepte une forme accepte donc n'importe lequel.</p>
<h4>La surcharge = un même mot, plusieurs sens selon le contexte</h4>
<p>En français, « percer » un trou de Ø8 ou « percer » un trou taraudé M10 : même verbe, outils différents. Le C++ fait pareil : <code>gp_Pnt()</code> et <code>gp_Pnt(x, y, z)</code> portent le même nom, le compilateur choisit selon ce que tu lui donnes.</p>
<p>JavaScript, lui, ne comprend qu'un sens par mot. Les auteurs d'opencascade.js ont donc mis un numéro à chaque sens :</p>
<table><thead><tr><th>C++</th><th>JavaScript (opencascade.js)</th></tr></thead><tbody>
<tr><td><code>gp_Pnt()</code></td><td><code>new oc.gp_Pnt_1()</code></td></tr>
<tr><td><code>gp_Pnt(gp_XYZ)</code></td><td><code>new oc.gp_Pnt_2(xyz)</code></td></tr>
<tr><td><code>gp_Pnt(x, y, z)</code></td><td><code>new oc.gp_Pnt_3(x, y, z)</code></td></tr>
</tbody></table>
<div class="callout tip">Si tu vois <code>_1</code>, <code>_2</code>, <code>_13</code> au bout d'un nom OpenCascade en JS, ce n'est pas une version : c'est « la n-ième façon d'appeler cette fonction ». Il faut consulter la documentation C++ pour savoir laquelle prend quels arguments. Le <code>_s</code> en Python veut dire « statique » : on l'appelle sur la classe elle-même.</div>
<h4>Le template = un gabarit réglable</h4>
<p><code>std::vector&lt;double&gt;</code>, c'est un bac de rangement dont on fixe le type de pièce à l'achat : « bac à doubles », « bac à faces » (<code>std::vector&lt;TopoDS_Face&gt;</code>). Le bac sait toujours faire la même chose (ajouter, compter, parcourir), quel que soit son contenu.</p>`,
        en: `<h3>Classes and overloading, design-office version</h3>
<div class="callout analogy">A <strong>class</strong> is the <strong>drawing of a standard part</strong> (with its dimensions and possible operations). An <strong>object</strong> is a <strong>part cast</strong> from that drawing: each part has its serial number and its own values, but all follow the same drawing.</div>
~~~text
   DRAWING (class Mould)         PARTS (objects)
 ┌─────────────────────┐       ┌───────────────┐ ┌───────────────┐
 │ name_ : text        │  ───> │ "Housing", 2  │ │ "Flange", 4   │
 │ cavities_ : integer │       └───────────────┘ └───────────────┘
 │ parts_per_cycle()   │
 └─────────────────────┘
~~~
<h4>Inheritance = a family of drawings</h4>
<p>A "permanent mould" <em>is a</em> "mould" with specifics. It takes everything a mould can do and adds to it. In OpenCascade, a face, an edge, a solid <em>are</em> shapes (<code>TopoDS_Shape</code>): a function that accepts a shape therefore accepts any of them.</p>
<h4>Overloading = one word, several meanings depending on context</h4>
<p>"Drilling" a Ø8 hole or "drilling" an M10 tapped hole: same verb, different tools. C++ does the same: <code>gp_Pnt()</code> and <code>gp_Pnt(x, y, z)</code> share a name, the compiler chooses from what you give it.</p>
<p>JavaScript only understands one meaning per word. So the authors of opencascade.js put a number on each meaning:</p>
<table><thead><tr><th>C++</th><th>JavaScript (opencascade.js)</th></tr></thead><tbody>
<tr><td><code>gp_Pnt()</code></td><td><code>new oc.gp_Pnt_1()</code></td></tr>
<tr><td><code>gp_Pnt(gp_XYZ)</code></td><td><code>new oc.gp_Pnt_2(xyz)</code></td></tr>
<tr><td><code>gp_Pnt(x, y, z)</code></td><td><code>new oc.gp_Pnt_3(x, y, z)</code></td></tr>
</tbody></table>
<div class="callout tip">If you see <code>_1</code>, <code>_2</code>, <code>_13</code> at the end of an OpenCascade name in JS, it is not a version: it is "the n-th way to call this function". You need the C++ documentation to know which takes which arguments. The <code>_s</code> in Python means "static": you call it on the class itself.</div>
<h4>The template = an adjustable jig</h4>
<p><code>std::vector&lt;double&gt;</code> is a storage bin whose part type is fixed when you buy it: "bin of doubles", "bin of faces" (<code>std::vector&lt;TopoDS_Face&gt;</code>). The bin always does the same things (add, count, loop), whatever it holds.</p>`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'cpp-4',
      title: { fr: 'La mémoire : pile, tas, Handle et delete()', en: 'Memory: stack, heap, Handle and delete()' },
      skills: ['cpp.memory'],
      minutes: 12,
      body: {
        fr: `<h3>Deux zones de mémoire</h3>
<ul>
<li><strong>La pile</strong> (<em>stack</em>) : pour les variables locales. Automatique : quand la fonction se termine, tout est libéré. Rapide mais petite.</li>
<li><strong>Le tas</strong> (<em>heap</em>) : pour les gros objets ou ceux qui doivent survivre à la fonction. On demande la place avec <code>new</code>, et on doit la <strong>rendre</strong> avec <code>delete</code>.</li>
</ul>
~~~cpp
void exemple() {
  int compteur = 0;                 //«1» pile : libéré tout seul
  gp_Pnt* p = new gp_Pnt(1, 2, 3);  //«2» tas : réservé à la main
  // ... utiliser p ...
  delete p;                         //«3» rendre la mémoire
}
~~~
<ol class="notes">
<li>Sur la pile : disparaît à la fin de <code>exemple()</code>.</li>
<li><code>new</code> réserve de la place sur le tas et renvoie un <strong>pointeur</strong>.</li>
<li>Oublier ce <code>delete</code> = <strong>fuite mémoire</strong> : la place reste occupée jusqu'à la fin du programme.</li>
</ol>
<h3>Les pointeurs intelligents</h3>
<p>Gérer <code>delete</code> à la main est source d'erreurs. Le C++ moderne utilise des <strong>pointeurs intelligents</strong> qui libèrent tout seuls :</p>
~~~cpp
auto a = std::make_unique<gp_Pnt>(1, 2, 3); // un seul propriétaire
auto b = std::make_shared<gp_Pnt>(4, 5, 6); // plusieurs propriétaires, compteur
// pas de delete : libérés quand plus personne ne les utilise
~~~
<p>OpenCascade a son propre système, plus ancien : <code>Handle(T)</code> (ou <code>opencascade::handle&lt;T&gt;</code>). C'est un pointeur à <strong>compteur de références</strong> : chaque copie du Handle augmente le compteur, chaque Handle détruit le diminue ; à zéro, l'objet est libéré.</p>
~~~cpp
Handle(TDocStd_Document) doc = new TDocStd_Document("XmlOcaf");
// doc sera libéré quand le dernier Handle disparaîtra
~~~
<h3>Et en JavaScript ?</h3>
<p>JavaScript a un <span class="term" data-term="garbage-collector">ramasse-miettes</span> (<em>garbage collector</em>) : il libère les objets JS qui ne servent plus. <strong>Mais</strong> les objets OpenCascade créés depuis JS vivent dans la mémoire <span class="term" data-term="wasm">WebAssembly</span>, que le ramasse-miettes ne voit pas. Il faut donc appeler <code>.delete()</code> soi-même :</p>
~~~js title="web/engine/cad.js"
const reflection = new oc.gp_Trsf_1();
const centre = new oc.gp_Pnt_1();
reflection.SetScale(centre, -1);
const mirrored = ctx.keep(new oc.TopLoc_Location_2(reflection));
centre.delete();      //«1»
reflection.delete();
~~~
<ol class="notes">
<li>Les objets temporaires sont rendus dès qu'ils ne servent plus. <code>ctx.keep(...)</code> est une astuce du projet : il garde la liste des objets à libérer tous ensemble à la fin de l'analyse.</li>
</ol>
<div class="callout project"><strong>Dans 3D Reader</strong> : le tas WebAssembly ne fait que <em>grossir</em> (jusqu'à 4 Gio) et ne rend jamais la mémoire au système. C'est pour cela que <code>web/engine/client.js</code> propose <code>releaseMemory()</code> : il <strong>redémarre le Worker</strong> entier pour récupérer la mémoire quand elle devient trop grosse.</div>
~~~js title="web/engine/worker.js"
// Memory of the CAD engine: the WebAssembly heap only grows (up to 4 GiB) and is
// never given back, so the page can restart the worker when it gets large.
const HEAP_MAX = 4294901760;
~~~`,
        en: `<h3>Two memory areas</h3>
<ul>
<li><strong>The stack</strong>: for local variables. Automatic: when the function ends, everything is freed. Fast but small.</li>
<li><strong>The heap</strong>: for big objects or ones that must outlive the function. You request space with <code>new</code>, and must <strong>give it back</strong> with <code>delete</code>.</li>
</ul>
~~~cpp
void example() {
  int counter = 0;                  //«1» stack: freed on its own
  gp_Pnt* p = new gp_Pnt(1, 2, 3);  //«2» heap: reserved by hand
  // ... use p ...
  delete p;                         //«3» give the memory back
}
~~~
<ol class="notes">
<li>On the stack: gone at the end of <code>example()</code>.</li>
<li><code>new</code> reserves space on the heap and returns a <strong>pointer</strong>.</li>
<li>Forgetting this <code>delete</code> = <strong>memory leak</strong>: the space stays taken until the program ends.</li>
</ol>
<h3>Smart pointers</h3>
<p>Handling <code>delete</code> by hand is error-prone. Modern C++ uses <strong>smart pointers</strong> that free memory by themselves:</p>
~~~cpp
auto a = std::make_unique<gp_Pnt>(1, 2, 3); // a single owner
auto b = std::make_shared<gp_Pnt>(4, 5, 6); // several owners, a counter
// no delete: freed when nobody uses them any more
~~~
<p>OpenCascade has its own, older system: <code>Handle(T)</code> (or <code>opencascade::handle&lt;T&gt;</code>). It is a <strong>reference-counted</strong> pointer: each copy of the Handle increments the counter, each destroyed Handle decrements it; at zero, the object is freed.</p>
~~~cpp
Handle(TDocStd_Document) doc = new TDocStd_Document("XmlOcaf");
// doc will be freed when the last Handle goes away
~~~
<h3>And in JavaScript?</h3>
<p>JavaScript has a <span class="term" data-term="garbage-collector">garbage collector</span>: it frees JS objects that are no longer used. <strong>But</strong> OpenCascade objects created from JS live in <span class="term" data-term="wasm">WebAssembly</span> memory, which the garbage collector cannot see. So you must call <code>.delete()</code> yourself:</p>
~~~js title="web/engine/cad.js"
const reflection = new oc.gp_Trsf_1();
const centre = new oc.gp_Pnt_1();
reflection.SetScale(centre, -1);
const mirrored = ctx.keep(new oc.TopLoc_Location_2(reflection));
centre.delete();      //«1»
reflection.delete();
~~~
<ol class="notes">
<li>Temporary objects are given back as soon as they are no longer needed. <code>ctx.keep(...)</code> is a project trick: it keeps a list of objects to free all together at the end of the analysis.</li>
</ol>
<div class="callout project"><strong>In 3D Reader</strong>: the WebAssembly heap only <em>grows</em> (up to 4 GiB) and never gives memory back to the system. That is why <code>web/engine/client.js</code> offers <code>releaseMemory()</code>: it <strong>restarts the whole Worker</strong> to recover memory when it gets too large.</div>
~~~js title="web/engine/worker.js"
// Memory of the CAD engine: the WebAssembly heap only grows (up to 4 GiB) and is
// never given back, so the page can restart the worker when it gets large.
const HEAP_MAX = 4294901760;
~~~`,
      },
      deep: {
        fr: `<h3>La mémoire, version magasin de l'atelier</h3>
<div class="callout analogy">
<p><strong>La pile</strong>, c'est ton <strong>établi</strong> : tu y poses les outils de l'opération en cours, et quand l'opération est finie, tu débarrasses tout d'un coup. Pas besoin d'y penser.</p>
<p><strong>Le tas</strong>, c'est le <strong>magasin de stockage</strong> : tu y réserves un emplacement pour une grosse pièce qui doit rester plusieurs jours. Le magasinier ne libère l'emplacement que si tu viens rendre le bon (<code>delete</code>). Oublie de le rendre, et l'emplacement reste occupé pour rien : c'est une <strong>fuite mémoire</strong>. À force, le magasin est plein.</p>
<p>Le <strong>Handle</strong> d'OpenCascade, c'est un emplacement avec un <strong>registre des emprunteurs</strong> : chaque personne qui utilise la pièce signe le registre, et raye son nom en partant. Quand le registre est vide, le magasinier libère la place automatiquement.</p>
</div>
<h4>Pourquoi <code>.delete()</code> en JavaScript ?</h4>
~~~text
 Navigateur
 ┌───────────────────────────────────────────────┐
 │ Mémoire JavaScript  (le ramasse-miettes passe)│
 │   const centre = <ticket vers WASM>           │
 │                                               │
 │ Mémoire WebAssembly (le ramasse-miettes NE    │
 │   passe PAS) : le vrai gp_Pnt d'OpenCascade   │
 └───────────────────────────────────────────────┘
~~~
<p>En JS, <code>centre</code> n'est qu'un <em>ticket</em>. Quand JS jette le ticket, la vraie pièce reste dans le magasin WebAssembly. <code>centre.delete()</code>, c'est aller rendre le bon au magasinier.</p>
<h4>Ce qui se passe si on oublie</h4>
<ol>
<li>Chaque fichier STEP analysé laisse des objets dans le tas WebAssembly.</li>
<li>Le tas grossit : 500 Mo, 1 Go, 2 Go…</li>
<li>Comme il ne rétrécit jamais, l'onglet finit par manquer de mémoire.</li>
<li>Solution radicale de 3D Reader : jeter tout le magasin (redémarrer le Worker) et en ouvrir un neuf.</li>
</ol>
<div class="callout tip">Règle simple pour lire <code>cad.js</code> : chaque <code>new oc.Xxx_n(...)</code> doit avoir son <code>.delete()</code> quelque part (ou passer par <code>ctx.keep()</code> qui s'en charge). Si tu en vois un sans l'autre, c'est soit voulu (l'objet est renvoyé), soit une fuite.</div>`,
        en: `<h3>Memory, workshop-store version</h3>
<div class="callout analogy">
<p><strong>The stack</strong> is your <strong>workbench</strong>: you put the tools of the current operation on it, and when the operation is done you clear everything at once. No need to think about it.</p>
<p><strong>The heap</strong> is the <strong>storage warehouse</strong>: you reserve a slot for a big part that must stay for days. The storekeeper only frees the slot if you bring back the receipt (<code>delete</code>). Forget it and the slot stays taken for nothing: that is a <strong>memory leak</strong>. Eventually the warehouse is full.</p>
<p>The OpenCascade <strong>Handle</strong> is a slot with a <strong>borrowers' register</strong>: each person using the part signs the register and crosses their name out when leaving. When the register is empty, the storekeeper frees the slot automatically.</p>
</div>
<h4>Why <code>.delete()</code> in JavaScript?</h4>
~~~text
 Browser
 ┌───────────────────────────────────────────────┐
 │ JavaScript memory  (garbage collector passes) │
 │   const centre = <ticket to WASM>             │
 │                                               │
 │ WebAssembly memory (garbage collector does    │
 │   NOT pass): the real OpenCascade gp_Pnt      │
 └───────────────────────────────────────────────┘
~~~
<p>In JS, <code>centre</code> is just a <em>ticket</em>. When JS throws the ticket away, the real part stays in the WebAssembly warehouse. <code>centre.delete()</code> is bringing the receipt back to the storekeeper.</p>
<h4>What happens if you forget</h4>
<ol>
<li>Every STEP file analysed leaves objects in the WebAssembly heap.</li>
<li>The heap grows: 500 MB, 1 GB, 2 GB…</li>
<li>Since it never shrinks, the tab eventually runs out of memory.</li>
<li>3D Reader's radical fix: throw away the whole warehouse (restart the Worker) and open a new one.</li>
</ol>
<div class="callout tip">Simple rule for reading <code>cad.js</code>: every <code>new oc.Xxx_n(...)</code> should have its <code>.delete()</code> somewhere (or go through <code>ctx.keep()</code>, which handles it). If you see one without the other, it is either intended (the object is returned) or a leak.</div>`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'cpp-5',
      title: { fr: 'Compilation, Emscripten et WebAssembly', en: 'Compilation, Emscripten and WebAssembly' },
      skills: ['cpp.build'],
      minutes: 12,
      body: {
        fr: `<h3>Du texte au programme</h3>
<p>Le processeur ne comprend pas le C++. Il faut le <strong>compiler</strong> :</p>
~~~text
 fichiers .cpp + .h  ──> compilateur ──> fichiers objets .o ──> éditeur de liens ──> exécutable / bibliothèque
   (texte lisible)      (g++, clang)       (code machine)         (assemble tout)     (.exe, .so, .dll, .wasm)
~~~
<ul>
<li><strong>Fichier source</strong> <code>.cpp</code> : le code des fonctions.</li>
<li><strong>En-tête</strong> <code>.h</code>/<code>.hxx</code> : les <em>déclarations</em> (« cette fonction existe, elle prend tels types »). <code>#include</code> recopie un en-tête dans le fichier.</li>
<li><strong>Bibliothèque</strong> : un paquet de code déjà compilé, réutilisable (OpenCascade en est une énorme).</li>
<li><strong>Éditeur de liens</strong> (<em>linker</em>) : relie ton code aux bibliothèques.</li>
</ul>
<div class="callout info">Un binaire compilé pour Windows x86 ne tourne pas sur un Mac ARM : la compilation vise <em>une</em> plateforme. D'où l'intérêt de…</div>
<h3>WebAssembly : un processeur virtuel dans le navigateur</h3>
<p><span class="term" data-term="wasm">WebAssembly</span> (<em>wasm</em>) est un format de code machine <strong>universel</strong>, exécuté par le navigateur à une vitesse proche du natif. N'importe quel navigateur moderne (Chrome, Firefox, Edge, Safari), sur n'importe quel ordinateur, le comprend.</p>
<p><span class="term" data-term="emscripten">Emscripten</span> est un compilateur qui prend du C++ et produit du <code>.wasm</code> + un fichier JS de « colle » qui le charge.</p>
~~~text
 OpenCascade (C++) ──Emscripten──> opencascade.full.wasm  (≈ 50 Mo de code machine)
                                  + opencascade.full.js    (la colle JS)
~~~
<h3>embind : le pont entre JS et C++</h3>
<p>Une fois compilé, le C++ ne sait pas parler JS. <strong>embind</strong> (fourni par Emscripten) génère les <em>liaisons</em> (<em>bindings</em>) : pour chaque classe C++, un objet JS qui la représente. C'est là que naissent les <code>oc.gp_Pnt_3</code>, les <code>.delete()</code> et les <code>_1</code>, <code>_2</code>.</p>
~~~js title="web/engine/occt.js"
// Browser: the 50 MB wasm binary is published gzip-compressed next to the
// emscripten ES module factory (vendor/opencascade/). It is downloaded with
// progress reporting, decompressed on the fly with DecompressionStream, and
// instantiated through the factory's \`instantiateWasm\` hook
~~~
<h3>La même bibliothèque, trois langages</h3>
<table><thead><tr><th>Où</th><th>Langage</th><th>Accès à OpenCascade</th></tr></thead><tbody>
<tr><td>Bibliothèque d'origine</td><td>C++</td><td>directement (<code>#include &lt;BRepGProp.hxx&gt;</code>)</td></tr>
<tr><td>Moteur navigateur (<code>web/engine/cad.js</code>)</td><td>JavaScript</td><td>opencascade.js (Emscripten + embind → wasm)</td></tr>
<tr><td>Moteur serveur (<code>reader3d/cad.py</code>)</td><td>Python</td><td>OCP, paquet <code>cadquery-ocp</code> (liaisons pybind11 → bibliothèque native)</td></tr>
</tbody></table>
~~~text title="requirements.txt"
# OpenCascade 8 (Python 3.11+): 7.9 drops the reflection of mirrored STEP instances.
cadquery-ocp>=8.0
~~~
<div class="callout project"><strong>Dans 3D Reader</strong> : GitHub Pages ne peut héberger que des fichiers statiques — pas de Python. Grâce à WebAssembly, <strong>tout le calcul se fait dans le navigateur du visiteur</strong>. Le script <code>scripts/build-web.mjs</code> copie le wasm depuis <code>node_modules/opencascade.js</code> vers <code>web/vendor/opencascade/</code> et le compresse en <code>.wasm.gz</code>.</div>`,
        en: `<h3>From text to program</h3>
<p>The processor does not understand C++. It must be <strong>compiled</strong>:</p>
~~~text
 .cpp + .h files  ──> compiler ──> object files .o ──> linker ──> executable / library
   (readable text)   (g++, clang)   (machine code)    (joins all)  (.exe, .so, .dll, .wasm)
~~~
<ul>
<li><strong>Source file</strong> <code>.cpp</code>: the code of the functions.</li>
<li><strong>Header</strong> <code>.h</code>/<code>.hxx</code>: the <em>declarations</em> ("this function exists, it takes these types"). <code>#include</code> pastes a header into the file.</li>
<li><strong>Library</strong>: a package of already-compiled, reusable code (OpenCascade is a huge one).</li>
<li><strong>Linker</strong>: connects your code to the libraries.</li>
</ul>
<div class="callout info">A binary compiled for Windows x86 does not run on an ARM Mac: compilation targets <em>one</em> platform. Hence the point of…</div>
<h3>WebAssembly: a virtual processor in the browser</h3>
<p><span class="term" data-term="wasm">WebAssembly</span> (<em>wasm</em>) is a <strong>universal</strong> machine-code format, run by the browser at near-native speed. Any modern browser (Chrome, Firefox, Edge, Safari), on any computer, understands it.</p>
<p><span class="term" data-term="emscripten">Emscripten</span> is a compiler that takes C++ and produces <code>.wasm</code> + a JS "glue" file that loads it.</p>
~~~text
 OpenCascade (C++) ──Emscripten──> opencascade.full.wasm  (≈ 50 MB of machine code)
                                  + opencascade.full.js    (the JS glue)
~~~
<h3>embind: the bridge between JS and C++</h3>
<p>Once compiled, C++ cannot speak JS. <strong>embind</strong> (shipped with Emscripten) generates the <em>bindings</em>: for each C++ class, a JS object that stands for it. That is where <code>oc.gp_Pnt_3</code>, <code>.delete()</code> and the <code>_1</code>, <code>_2</code> are born.</p>
~~~js title="web/engine/occt.js"
// Browser: the 50 MB wasm binary is published gzip-compressed next to the
// emscripten ES module factory (vendor/opencascade/). It is downloaded with
// progress reporting, decompressed on the fly with DecompressionStream, and
// instantiated through the factory's \`instantiateWasm\` hook
~~~
<h3>The same library, three languages</h3>
<table><thead><tr><th>Where</th><th>Language</th><th>Access to OpenCascade</th></tr></thead><tbody>
<tr><td>Original library</td><td>C++</td><td>directly (<code>#include &lt;BRepGProp.hxx&gt;</code>)</td></tr>
<tr><td>Browser engine (<code>web/engine/cad.js</code>)</td><td>JavaScript</td><td>opencascade.js (Emscripten + embind → wasm)</td></tr>
<tr><td>Server engine (<code>reader3d/cad.py</code>)</td><td>Python</td><td>OCP, package <code>cadquery-ocp</code> (pybind11 bindings → native library)</td></tr>
</tbody></table>
~~~text title="requirements.txt"
# OpenCascade 8 (Python 3.11+): 7.9 drops the reflection of mirrored STEP instances.
cadquery-ocp>=8.0
~~~
<div class="callout project"><strong>In 3D Reader</strong>: GitHub Pages can only host static files — no Python. Thanks to WebAssembly, <strong>all the computation happens in the visitor's browser</strong>. The script <code>scripts/build-web.mjs</code> copies the wasm from <code>node_modules/opencascade.js</code> to <code>web/vendor/opencascade/</code> and compresses it into <code>.wasm.gz</code>.</div>`,
      },
      deep: {
        fr: `<h3>La compilation, version traduction de notice</h3>
<div class="callout analogy">
<p>Tu as une notice de machine écrite en allemand technique (le <strong>C++</strong>). L'opérateur (le <strong>processeur</strong>) ne lit que sa langue maternelle, très primitive (le <strong>code machine</strong>).</p>
<ul>
<li>Le <strong>compilateur</strong> est un traducteur qui traduit <em>toute</em> la notice d'un coup, avant la mise en route.</li>
<li>Problème : un opérateur Windows et un opérateur Mac ne parlent pas la même langue maternelle. Il faut une traduction par opérateur.</li>
<li><strong>WebAssembly</strong>, c'est une langue « espéranto » que <em>tous</em> les navigateurs savent lire. On traduit une seule fois vers l'espéranto (avec <strong>Emscripten</strong>), et ça marche partout.</li>
<li><strong>embind</strong>, c'est le lexique bilingue qui permet au JavaScript de la page de donner des ordres à la notice traduite.</li>
</ul>
</div>
<h4>Le trajet complet d'OpenCascade jusqu'à ton écran</h4>
<ol>
<li>Des développeurs écrivent OpenCascade en C++ (des milliers de fichiers <code>.cxx</code> et <code>.hxx</code>).</li>
<li>Le projet opencascade.js le compile avec Emscripten → <code>opencascade.full.wasm</code> + <code>opencascade.full.js</code>. Il est publié sur npm.</li>
<li><code>npm ci</code> le télécharge dans <code>node_modules/</code> du dépôt 3D Reader.</li>
<li><code>npm run build</code> le recopie, compressé en gzip, dans le site.</li>
<li>GitHub Pages publie le site.</li>
<li>Ton navigateur télécharge le <code>.wasm.gz</code>, le décompresse, le compile en code natif pour <em>ton</em> processeur, et le garde en cache.</li>
<li>Le Worker appelle <code>new oc.STEPCAFControl_Reader_1()</code> : c'est du C++ qui tourne dans ton onglet.</li>
</ol>
<h4>Et Python ?</h4>
<p>Côté serveur, pas besoin d'espéranto : le paquet <code>cadquery-ocp</code> contient OpenCascade déjà compilé pour ton système (Windows, Linux, macOS) + des liaisons Python. <code>from OCP.BRepGProp import BRepGProp</code> appelle directement la bibliothèque native.</p>
<div class="callout tip">Retiens : <strong>une bibliothèque C++</strong> (OpenCascade) → <strong>deux habillages</strong> (opencascade.js pour le navigateur, OCP pour Python) → <strong>deux moteurs</strong> dans 3D Reader, qui doivent donner les <em>mêmes</em> résultats. Les tests le vérifient.</div>`,
        en: `<h3>Compilation, manual-translation version</h3>
<div class="callout analogy">
<p>You have a machine manual written in technical German (the <strong>C++</strong>). The operator (the <strong>processor</strong>) only reads their very primitive mother tongue (<strong>machine code</strong>).</p>
<ul>
<li>The <strong>compiler</strong> is a translator who translates the <em>whole</em> manual at once, before start-up.</li>
<li>Problem: a Windows operator and a Mac operator do not share a mother tongue. You need one translation per operator.</li>
<li><strong>WebAssembly</strong> is an "Esperanto" that <em>every</em> browser can read. You translate once into Esperanto (with <strong>Emscripten</strong>), and it works everywhere.</li>
<li><strong>embind</strong> is the bilingual glossary that lets the page's JavaScript give orders to the translated manual.</li>
</ul>
</div>
<h4>OpenCascade's full journey to your screen</h4>
<ol>
<li>Developers write OpenCascade in C++ (thousands of <code>.cxx</code> and <code>.hxx</code> files).</li>
<li>The opencascade.js project compiles it with Emscripten → <code>opencascade.full.wasm</code> + <code>opencascade.full.js</code>. It is published on npm.</li>
<li><code>npm ci</code> downloads it into the 3D Reader repository's <code>node_modules/</code>.</li>
<li><code>npm run build</code> copies it, gzip-compressed, into the site.</li>
<li>GitHub Pages publishes the site.</li>
<li>Your browser downloads the <code>.wasm.gz</code>, decompresses it, compiles it to native code for <em>your</em> processor, and caches it.</li>
<li>The Worker calls <code>new oc.STEPCAFControl_Reader_1()</code>: that is C++ running in your tab.</li>
</ol>
<h4>And Python?</h4>
<p>On the server, no Esperanto needed: the <code>cadquery-ocp</code> package contains OpenCascade already compiled for your system (Windows, Linux, macOS) + Python bindings. <code>from OCP.BRepGProp import BRepGProp</code> calls the native library directly.</p>
<div class="callout tip">Remember: <strong>one C++ library</strong> (OpenCascade) → <strong>two wrappers</strong> (opencascade.js for the browser, OCP for Python) → <strong>two engines</strong> in 3D Reader, which must give the <em>same</em> results. The tests check it.</div>`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'cpp-6',
      title: { fr: 'OpenCascade pour un fondeur', en: 'OpenCascade for a foundry engineer' },
      skills: ['cpp.occt'],
      minutes: 14,
      body: {
        fr: `<h3>B-rep : la pièce décrite par sa peau</h3>
<p>Un fichier STEP ne contient pas de triangles : il décrit la pièce en <strong>B-rep</strong> (<em>Boundary Representation</em>, représentation par les frontières). La pièce est un <strong>solide</strong> fermé par des <strong>faces</strong> ; chaque face repose sur une vraie surface mathématique (plan, cylindre, cône, tore, NURBS) et est bordée d'<strong>arêtes</strong>, qui se rejoignent en <strong>sommets</strong>.</p>
~~~text
 Compound (assemblage)
   └─ Solid (pièce)
        └─ Shell (peau fermée)
             └─ Face (sur une surface : plan, cylindre, NURBS…)
                  └─ Wire (contour)
                       └─ Edge (arête, sur une courbe)
                            └─ Vertex (sommet)
~~~
<p>Toutes ces entités sont des <code>TopoDS_Shape</code> (<em>TopoDS</em> = structure de données topologique). On les parcourt avec <code>TopExp_Explorer</code>.</p>
<h3>Lire un STEP</h3>
<p><code>STEPCAFControl_Reader</code> lit le fichier dans un « document » XCAF qui garde aussi les <strong>noms</strong> et les <strong>couleurs</strong> des pièces.</p>
<h3>Volume exact contre volume du maillage</h3>
<p><code>BRepGProp::VolumeProperties</code> <strong>intègre</strong> sur les vraies surfaces : le volume ne dépend pas de l'affichage. Pour l'afficher, <code>BRepMesh_IncrementalMesh</code> découpe les faces en triangles (la <em>tessellation</em>) ; le volume de ces triangles (<code>mesh_volume</code>) est un peu différent, surtout sur les formes courbes.</p>
<div class="compare">
~~~cpp title="C++ (OpenCascade)"
GProp_GProps props;
BRepGProp::VolumeProperties(solid, props, eps);
double volume = props.Mass();
gp_Pnt g = props.CentreOfMass();

BRepMesh_IncrementalMesh(shape,
    deflection, false, angle, true);
~~~
~~~py title="Python — reader3d/cad.py"
props = GProp_GProps()
BRepGProp.VolumeProperties_s(solid, props, GPROP_EPS)
volume = props.Mass()
if volume < 0:
    notes.append("Solid had inverted orientation; volume sign corrected")
    volume = -volume
com = props.CentreOfMass()
~~~
~~~js title="JS — web/engine/cad.js"
const props = new oc.GProp_GProps_1();
oc.BRepGProp.LinearProperties(wire, props, false, false);
const length = props.Mass();
const centre = ctx.keep(props.CentreOfMass());
props.delete();

new oc.BRepMesh_IncrementalMesh_2(shape,
    deflection, false, ang, true).delete();
~~~
</div>
<p>Remarque les trois habillages d'une même idée :</p>
<ul>
<li>C++ : appel statique avec <code>::</code>, objets sur la pile, pas de <code>delete</code>.</li>
<li>Python : <code>_s</code> pour « statique », le ramasse-miettes Python libère tout.</li>
<li>JS : <code>_1</code>, <code>_2</code> pour les surcharges, et <code>.delete()</code> à la main.</li>
</ul>
<p><code>Mass()</code> renvoie la « masse » au sens d'une densité 1 : c'est donc le <strong>volume</strong> (mm³) pour <code>VolumeProperties</code>, la <strong>longueur</strong> pour <code>LinearProperties</code>, l'<strong>aire</strong> pour <code>SurfaceProperties</code>.</p>
<div class="callout warn">Un volume <em>négatif</em> veut dire que le solide est « retourné » (faces orientées vers l'intérieur). Le code Python corrige le signe et ajoute une note au résultat.</div>
<div class="callout project"><strong>Dans 3D Reader</strong> : le moteur Python est la <strong>référence</strong>. Le moteur JS doit reproduire ses résultats et ses notes mot pour mot. La CI génère les résultats Python (<code>tests/make_fixtures.py</code>), puis vérifie que le JS trouve les mêmes volumes.</div>`,
        en: `<h3>B-rep: the part described by its skin</h3>
<p>A STEP file contains no triangles: it describes the part as a <strong>B-rep</strong> (<em>Boundary Representation</em>). The part is a <strong>solid</strong> closed by <strong>faces</strong>; each face lies on a true mathematical surface (plane, cylinder, cone, torus, NURBS) and is bounded by <strong>edges</strong>, which meet at <strong>vertices</strong>.</p>
~~~text
 Compound (assembly)
   └─ Solid (part)
        └─ Shell (closed skin)
             └─ Face (on a surface: plane, cylinder, NURBS…)
                  └─ Wire (outline)
                       └─ Edge (on a curve)
                            └─ Vertex
~~~
<p>All these entities are <code>TopoDS_Shape</code>s (<em>TopoDS</em> = topological data structure). You walk them with <code>TopExp_Explorer</code>.</p>
<h3>Reading a STEP</h3>
<p><code>STEPCAFControl_Reader</code> reads the file into an XCAF "document" that also keeps the <strong>names</strong> and <strong>colours</strong> of the parts.</p>
<h3>Exact volume versus mesh volume</h3>
<p><code>BRepGProp::VolumeProperties</code> <strong>integrates</strong> over the true surfaces: the volume does not depend on the display. To display it, <code>BRepMesh_IncrementalMesh</code> cuts the faces into triangles (the <em>tessellation</em>); the volume of those triangles (<code>mesh_volume</code>) is slightly different, especially on curved shapes.</p>
<div class="compare">
~~~cpp title="C++ (OpenCascade)"
GProp_GProps props;
BRepGProp::VolumeProperties(solid, props, eps);
double volume = props.Mass();
gp_Pnt g = props.CentreOfMass();

BRepMesh_IncrementalMesh(shape,
    deflection, false, angle, true);
~~~
~~~py title="Python — reader3d/cad.py"
props = GProp_GProps()
BRepGProp.VolumeProperties_s(solid, props, GPROP_EPS)
volume = props.Mass()
if volume < 0:
    notes.append("Solid had inverted orientation; volume sign corrected")
    volume = -volume
com = props.CentreOfMass()
~~~
~~~js title="JS — web/engine/cad.js"
const props = new oc.GProp_GProps_1();
oc.BRepGProp.LinearProperties(wire, props, false, false);
const length = props.Mass();
const centre = ctx.keep(props.CentreOfMass());
props.delete();

new oc.BRepMesh_IncrementalMesh_2(shape,
    deflection, false, ang, true).delete();
~~~
</div>
<p>Notice the three wrappers of one idea:</p>
<ul>
<li>C++: static call with <code>::</code>, objects on the stack, no <code>delete</code>.</li>
<li>Python: <code>_s</code> for "static", Python's garbage collector frees everything.</li>
<li>JS: <code>_1</code>, <code>_2</code> for overloads, and <code>.delete()</code> by hand.</li>
</ul>
<p><code>Mass()</code> returns the "mass" for a density of 1: so it is the <strong>volume</strong> (mm³) for <code>VolumeProperties</code>, the <strong>length</strong> for <code>LinearProperties</code>, the <strong>area</strong> for <code>SurfaceProperties</code>.</p>
<div class="callout warn">A <em>negative</em> volume means the solid is "inside out" (faces oriented inwards). The Python code fixes the sign and adds a note to the result.</div>
<div class="callout project"><strong>In 3D Reader</strong>: the Python engine is the <strong>reference</strong>. The JS engine must reproduce its results and notes word for word. CI generates the Python results (<code>tests/make_fixtures.py</code>), then checks that JS finds the same volumes.</div>`,
      },
      deep: {
        fr: `<h3>OpenCascade, version modèle de fonderie</h3>
<div class="callout analogy">
<p>Pense à un <strong>modèle en bois</strong> pour le moulage au sable. Il y a deux façons de le décrire :</p>
<ul>
<li><strong>B-rep (STEP)</strong> : le dessinateur donne la <em>vraie forme</em> de chaque surface — « ici un cylindre de rayon 25, là un plan, là un congé torique de rayon 3 ». C'est exact, comme une cote sur un plan.</li>
<li><strong>Maillage (STL)</strong> : on recouvre le modèle de petites facettes triangulaires plates, comme une sculpture en papier plié. Un cylindre devient un prisme à 64 côtés. Plus les facettes sont petites, plus c'est proche, mais jamais exact.</li>
</ul>
</div>
<h4>Pourquoi deux volumes ?</h4>
<p>Prends un cylindre Ø50 × 100 mm. Volume exact : π × 25² × 100 ≈ 196 350 mm³. Avec une tessellation grossière (quelques dizaines de facettes), le prisme inscrit est un peu plus petit : par exemple ≈ 195 600 mm³. 3D Reader affiche le <strong>volume exact</strong> (BRepGProp) et, pour comparaison, le <strong>volume du maillage</strong> d'affichage. Changer la « qualité d'affichage » ne change pas le volume exact — seulement le maillage.</p>
<h4>La hiérarchie, comme une nomenclature</h4>
<table><thead><tr><th>OpenCascade</th><th>En atelier</th></tr></thead><tbody>
<tr><td>Compound</td><td>la nomenclature / l'assemblage</td></tr>
<tr><td>Solid</td><td>une pièce massive</td></tr>
<tr><td>Shell</td><td>sa peau fermée (étanche)</td></tr>
<tr><td>Face</td><td>une surface usinée ou brute de fonderie</td></tr>
<tr><td>Edge</td><td>une arête, un bord de face</td></tr>
<tr><td>Vertex</td><td>un coin</td></tr>
</tbody></table>
<h4>Le trajet d'un fichier STEP</h4>
<ol>
<li><code>STEPCAFControl_Reader</code> lit le texte du STEP (des lignes <code>#12=CYLINDRICAL_SURFACE(...)</code>).</li>
<li>Il construit des <code>TopoDS_Shape</code> + noms + couleurs dans un document XCAF.</li>
<li>Pour chaque solide : <code>BRepGProp::VolumeProperties</code> → volume, centre de gravité.</li>
<li><code>BRepMesh_IncrementalMesh</code> → triangles pour l'affichage three.js.</li>
<li>Le volume × densité de l'alliage → la masse (calculée côté page).</li>
</ol>
<div class="callout tip">Si une surface STEP n'est pas fermée (des faces seules, pas de solide), il n'y a pas de volume possible. 3D Reader essaie alors de les « coudre » (<code>BRepBuilderAPI_Sewing</code>) pour refermer la peau, comme on bouche un modèle percé.</div>`,
        en: `<h3>OpenCascade, foundry-pattern version</h3>
<div class="callout analogy">
<p>Think of a <strong>wooden pattern</strong> for sand casting. There are two ways to describe it:</p>
<ul>
<li><strong>B-rep (STEP)</strong>: the draughtsman gives the <em>true shape</em> of every surface — "here a cylinder of radius 25, there a plane, there a toroidal fillet of radius 3". It is exact, like a dimension on a drawing.</li>
<li><strong>Mesh (STL)</strong>: you cover the pattern with small flat triangular facets, like a folded-paper sculpture. A cylinder becomes a 64-sided prism. The smaller the facets, the closer it gets, but never exact.</li>
</ul>
</div>
<h4>Why two volumes?</h4>
<p>Take a Ø50 × 100 mm cylinder. Exact volume: π × 25² × 100 ≈ 196,350 mm³. With a coarse tessellation (a few dozen facets), the inscribed prism is slightly smaller: for instance ≈ 195,600 mm³. 3D Reader shows the <strong>exact volume</strong> (BRepGProp) and, for comparison, the <strong>volume of the display mesh</strong>. Changing the "display quality" does not change the exact volume — only the mesh.</p>
<h4>The hierarchy, like a bill of materials</h4>
<table><thead><tr><th>OpenCascade</th><th>In the shop</th></tr></thead><tbody>
<tr><td>Compound</td><td>the bill of materials / assembly</td></tr>
<tr><td>Solid</td><td>a solid part</td></tr>
<tr><td>Shell</td><td>its closed (watertight) skin</td></tr>
<tr><td>Face</td><td>a machined or as-cast surface</td></tr>
<tr><td>Edge</td><td>an edge, the border of a face</td></tr>
<tr><td>Vertex</td><td>a corner</td></tr>
</tbody></table>
<h4>The journey of a STEP file</h4>
<ol>
<li><code>STEPCAFControl_Reader</code> reads the STEP text (lines like <code>#12=CYLINDRICAL_SURFACE(...)</code>).</li>
<li>It builds <code>TopoDS_Shape</code>s + names + colours in an XCAF document.</li>
<li>For each solid: <code>BRepGProp::VolumeProperties</code> → volume, centre of gravity.</li>
<li><code>BRepMesh_IncrementalMesh</code> → triangles for the three.js display.</li>
<li>Volume × alloy density → the mass (computed on the page).</li>
</ol>
<div class="callout tip">If a STEP surface is not closed (loose faces, no solid), no volume is possible. 3D Reader then tries to "sew" them (<code>BRepBuilderAPI_Sewing</code>) to close the skin, like plugging a pattern with holes.</div>`,
      },
    },
  ],
  questions: [
    // ---------------- cpp-1 lesson quiz
    {
      id: 'cpp-q1', skill: 'cpp.syntax', lesson: 'cpp-1', level: 1, type: 'mcq',
      prompt: { fr: 'Par quoi se termine chaque instruction en C++ ?', en: 'What ends every statement in C++?' },
      choices: { fr: ['Un retour à la ligne', 'Un point-virgule <code>;</code>', 'Deux-points <code>:</code>', 'Une accolade <code>}</code>'], en: ['A line break', 'A semicolon <code>;</code>', 'A colon <code>:</code>', 'A brace <code>}</code>'] },
      answer: 1,
      explain: { fr: 'Le <code>;</code> marque la fin d\'une instruction. Le retour à la ligne n\'a aucun sens pour le compilateur C++ (contrairement à Python).', en: 'The <code>;</code> marks the end of a statement. Line breaks mean nothing to the C++ compiler (unlike Python).' },
    },
    {
      id: 'cpp-q2', skill: 'cpp.syntax', lesson: 'cpp-1', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque type C++ à son équivalent Python.', en: 'Match each C++ type with its Python equivalent.' },
      pairs: {
        fr: [['int', 'int (entier)'], ['double', 'float (nombre à virgule)'], ['bool', 'bool (vrai/faux)'], ['std::string', 'str (texte)']],
        en: [['int', 'int (integer)'], ['double', 'float (decimal)'], ['bool', 'bool (true/false)'], ['std::string', 'str (text)']],
      },
      explain: { fr: 'Le C++ a les mêmes familles de types que Python, mais il faut les écrire explicitement (ou utiliser <code>auto</code>).', en: 'C++ has the same type families as Python, but you must write them explicitly (or use <code>auto</code>).' },
    },
    {
      id: 'cpp-q3', skill: 'cpp.syntax', lesson: 'cpp-1', level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui contient une erreur de compilation.', en: 'Click the line that contains a compilation error.' },
      code: 'int main() {\n  int pieces = 12;\n  double volume = 350.5\n  bool ok = true;\n  return 0;\n}',
      lang: 'cpp',
      answer: 2,
      explain: { fr: 'Il manque le <code>;</code> après <code>350.5</code>. Le compilateur signalera souvent l\'erreur à la ligne suivante : pense à regarder au-dessus !', en: 'The <code>;</code> is missing after <code>350.5</code>. The compiler often reports the error on the next line: remember to look above!' },
    },
    // ---------------- cpp-2
    {
      id: 'cpp-q4', skill: 'cpp.functions', lesson: 'cpp-2', level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie <code>void</code> devant le nom d\'une fonction ?', en: 'What does <code>void</code> before a function name mean?' },
      choices: { fr: ['Elle est vide et ne fait rien', 'Elle ne renvoie aucune valeur', 'Elle est privée', 'Elle renvoie un pointeur'], en: ['It is empty and does nothing', 'It returns no value', 'It is private', 'It returns a pointer'] },
      answer: 1,
      explain: { fr: '<code>void</code> = pas de valeur de retour. La fonction peut agir (afficher, modifier un paramètre par référence) mais ne « rend » rien.', en: '<code>void</code> = no return value. The function can act (print, modify a parameter by reference) but does not "give back" anything.' },
    },
    {
      id: 'cpp-q5', skill: 'cpp.functions', lesson: 'cpp-2', level: 2, type: 'mcq',
      prompt: { fr: 'Après ce code, combien vaut <code>b</code> ?', en: 'After this code, what is <code>b</code>?' },
      code: 'void f(int& n) { n = 99; }\nint b = 1;\nf(b);',
      lang: 'cpp',
      choices: { fr: ['1', '99', '100', 'Erreur de compilation'], en: ['1', '99', '100', 'Compilation error'] },
      answer: 1,
      explain: { fr: '<code>int&amp; n</code> est une référence : <code>n</code> est un autre nom de <code>b</code>. Modifier <code>n</code> modifie donc <code>b</code>.', en: '<code>int&amp; n</code> is a reference: <code>n</code> is another name for <code>b</code>. Changing <code>n</code> therefore changes <code>b</code>.' },
    },
    {
      id: 'cpp-q6', skill: 'cpp.functions', lesson: 'cpp-2', level: 2, type: 'tf',
      prompt: { fr: 'Passer un gros objet par <code>const T&amp;</code> évite de le copier ET empêche la fonction de le modifier.', en: 'Passing a big object as <code>const T&amp;</code> avoids copying it AND prevents the function from modifying it.' },
      answer: true,
      explain: { fr: 'Exactement : <code>&amp;</code> = pas de copie (on passe l\'adresse), <code>const</code> = lecture seule. C\'est le style d\'OpenCascade pour les <code>TopoDS_Shape</code>.', en: 'Exactly: <code>&amp;</code> = no copy (the address is passed), <code>const</code> = read-only. It is OpenCascade\'s style for <code>TopoDS_Shape</code>s.' },
    },
    // ---------------- cpp-3
    {
      id: 'cpp-q7', skill: 'cpp.classes', lesson: 'cpp-3', level: 1, type: 'mcq',
      prompt: { fr: 'Pourquoi opencascade.js écrit-il <code>new oc.gp_Pnt_3(x, y, z)</code> avec un <code>_3</code> ?', en: 'Why does opencascade.js write <code>new oc.gp_Pnt_3(x, y, z)</code> with a <code>_3</code>?' },
      choices: {
        fr: ['C\'est la version 3 de la bibliothèque', 'Le point a 3 coordonnées', 'C\'est la 3e surcharge du constructeur C++, car JS ne gère pas la surcharge', 'Il crée 3 points'],
        en: ['It is version 3 of the library', 'The point has 3 coordinates', 'It is the 3rd overload of the C++ constructor, since JS has no overloading', 'It creates 3 points'],
      },
      answer: 2,
      explain: { fr: 'En C++, <code>gp_Pnt()</code>, <code>gp_Pnt(xyz)</code> et <code>gp_Pnt(x, y, z)</code> portent le même nom. JavaScript n\'accepte qu\'une définition par nom, donc les variantes sont numérotées <code>_1</code>, <code>_2</code>, <code>_3</code>.', en: 'In C++, <code>gp_Pnt()</code>, <code>gp_Pnt(xyz)</code> and <code>gp_Pnt(x, y, z)</code> share a name. JavaScript accepts one definition per name, so the variants are numbered <code>_1</code>, <code>_2</code>, <code>_3</code>.' },
    },
    {
      id: 'cpp-q8', skill: 'cpp.classes', lesson: 'cpp-3', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque mot à sa définition.', en: 'Match each word with its definition.' },
      pairs: {
        fr: [['Classe', 'Le plan type d\'un objet'], ['Objet', 'Un exemplaire fabriqué d\'après la classe'], ['Constructeur', 'Fonction qui initialise un nouvel objet'], ['Méthode', 'Fonction attachée à un objet'], ['Héritage', '« est un » : reprend une classe parente']],
        en: [['Class', 'The template drawing of an object'], ['Object', 'A copy built from the class'], ['Constructor', 'Function that initialises a new object'], ['Method', 'Function attached to an object'], ['Inheritance', '"is a": takes over a parent class']],
      },
      explain: { fr: 'Classe = plan, objet = pièce, constructeur = mise en forme initiale, méthode = opération possible, héritage = famille de plans.', en: 'Class = drawing, object = part, constructor = initial forming, method = possible operation, inheritance = family of drawings.' },
    },
    {
      id: 'cpp-q9', skill: 'cpp.classes', lesson: 'cpp-3', level: 2, type: 'fill',
      prompt: { fr: 'Complète pour déclarer une liste de nombres à virgule (bibliothèque standard).', en: 'Fill in to declare a list of decimal numbers (standard library).' },
      code: 'std::vector<____> volumes = {120.5, 98.0};',
      lang: 'cpp',
      accept: ['double', 'float'],
      explain: { fr: '<code>std::vector</code> est un <em>template</em> : le type des éléments se met entre chevrons. Pour des nombres à virgule : <code>double</code>.', en: '<code>std::vector</code> is a <em>template</em>: the element type goes between angle brackets. For decimal numbers: <code>double</code>.' },
    },
    // ---------------- cpp-4
    {
      id: 'cpp-q10', skill: 'cpp.memory', lesson: 'cpp-4', level: 1, type: 'mcq',
      prompt: { fr: 'Que se passe-t-il si on oublie le <code>delete</code> d\'un objet créé avec <code>new</code> ?', en: 'What happens if you forget the <code>delete</code> of an object created with <code>new</code>?' },
      choices: { fr: ['Une fuite mémoire : la place reste occupée', 'Le programme ne compile pas', 'L\'objet est libéré à la fin de la fonction', 'Rien, le C++ a un ramasse-miettes'], en: ['A memory leak: the space stays taken', 'The program does not compile', 'The object is freed at the end of the function', 'Nothing, C++ has a garbage collector'] },
      answer: 0,
      explain: { fr: 'Le tas ne se libère pas tout seul en C++. Sans <code>delete</code> (ou pointeur intelligent), la mémoire est perdue jusqu\'à la fin du programme.', en: 'The heap does not free itself in C++. Without <code>delete</code> (or a smart pointer), the memory is lost until the program ends.' },
    },
    {
      id: 'cpp-q11', skill: 'cpp.memory', lesson: 'cpp-4', level: 2, type: 'tf',
      prompt: { fr: 'Le ramasse-miettes de JavaScript libère automatiquement les objets OpenCascade créés avec <code>new oc.…</code>.', en: 'JavaScript\'s garbage collector automatically frees OpenCascade objects created with <code>new oc.…</code>.' },
      answer: false,
      explain: { fr: 'Ces objets vivent dans la mémoire WebAssembly, invisible pour le ramasse-miettes. Il faut appeler <code>.delete()</code> (dans 3D Reader, souvent via <code>ctx.keep()</code>).', en: 'These objects live in WebAssembly memory, invisible to the garbage collector. You must call <code>.delete()</code> (in 3D Reader, often via <code>ctx.keep()</code>).' },
    },
    {
      id: 'cpp-q12', skill: 'cpp.memory', lesson: 'cpp-4', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi 3D Reader redémarre-t-il parfois son Worker (<code>releaseMemory()</code>) ?', en: 'Why does 3D Reader sometimes restart its Worker (<code>releaseMemory()</code>)?' },
      choices: { fr: ['Pour mettre à jour l\'application', 'Parce que le tas WebAssembly ne rétrécit jamais', 'Pour changer de langue', 'Parce que le Worker est plus lent après 5 minutes'], en: ['To update the application', 'Because the WebAssembly heap never shrinks', 'To change language', 'Because the Worker is slower after 5 minutes'] },
      answer: 1,
      explain: { fr: 'Le tas WebAssembly ne fait que grossir (jusqu\'à 4 Gio). Le seul moyen de rendre la mémoire au système est de jeter le Worker et d\'en créer un neuf.', en: 'The WebAssembly heap only grows (up to 4 GiB). The only way to give memory back to the system is to drop the Worker and create a new one.' },
    },
    // ---------------- cpp-5
    {
      id: 'cpp-q13', skill: 'cpp.build', lesson: 'cpp-5', level: 1, type: 'order',
      prompt: { fr: 'Remets dans l\'ordre le trajet d\'OpenCascade jusqu\'au navigateur.', en: 'Put OpenCascade\'s journey to the browser in order.' },
      items: {
        fr: ['Code source C++ d\'OpenCascade', 'Compilation avec Emscripten', 'Fichier opencascade.full.wasm publié sur npm', 'npm ci puis npm run build dans 3D Reader', 'Le navigateur télécharge et exécute le .wasm'],
        en: ['OpenCascade C++ source code', 'Compilation with Emscripten', 'opencascade.full.wasm file published on npm', 'npm ci then npm run build in 3D Reader', 'The browser downloads and runs the .wasm'],
      },
      explain: { fr: 'C++ → Emscripten → wasm (paquet npm) → build du site → exécution dans le navigateur.', en: 'C++ → Emscripten → wasm (npm package) → site build → run in the browser.' },
    },
    {
      id: 'cpp-q14', skill: 'cpp.build', lesson: 'cpp-5', level: 1, type: 'mcq',
      prompt: { fr: 'Quel est le rôle d\'un fichier d\'en-tête <code>.h</code> / <code>.hxx</code> ?', en: 'What is the role of a <code>.h</code> / <code>.hxx</code> header file?' },
      choices: { fr: ['Contenir le code machine', 'Déclarer les fonctions et classes disponibles', 'Stocker les tests', 'Configurer GitHub'], en: ['Hold the machine code', 'Declare the available functions and classes', 'Store the tests', 'Configure GitHub'] },
      answer: 1,
      explain: { fr: 'L\'en-tête annonce « ces fonctions/classes existent, avec ces types ». <code>#include</code> le recopie pour que le compilateur les connaisse.', en: 'The header announces "these functions/classes exist, with these types". <code>#include</code> pastes it so the compiler knows them.' },
    },
    {
      id: 'cpp-q15', skill: 'cpp.build', lesson: 'cpp-5', level: 2, type: 'multi',
      prompt: { fr: 'Quelles affirmations sont vraies ?', en: 'Which statements are true?' },
      choices: {
        fr: ['WebAssembly tourne dans tous les navigateurs modernes', 'GitHub Pages peut exécuter du Python', 'embind crée les objets JS qui représentent les classes C++', 'Le moteur Python utilise OpenCascade via le paquet cadquery-ocp'],
        en: ['WebAssembly runs in every modern browser', 'GitHub Pages can run Python', 'embind creates the JS objects that stand for the C++ classes', 'The Python engine uses OpenCascade through the cadquery-ocp package'],
      },
      answer: [0, 2, 3],
      explain: { fr: 'GitHub Pages ne sert que des fichiers statiques : pas de Python. C\'est justement pour ça que le calcul tourne en WebAssembly dans le navigateur.', en: 'GitHub Pages only serves static files: no Python. That is exactly why the computation runs as WebAssembly in the browser.' },
    },
    // ---------------- cpp-6
    {
      id: 'cpp-q16', skill: 'cpp.occt', lesson: 'cpp-6', level: 1, type: 'mcq',
      prompt: { fr: 'Que veut dire <strong>B-rep</strong> ?', en: 'What does <strong>B-rep</strong> mean?' },
      choices: { fr: ['Binary repository', 'Boundary representation : la pièce décrite par ses faces', 'Basic rendering pipeline', 'Bloc de répétition'], en: ['Binary repository', 'Boundary representation: the part described by its faces', 'Basic rendering pipeline', 'Block repeat'] },
      answer: 1,
      explain: { fr: 'B-rep = représentation par les frontières : un solide est délimité par des faces posées sur de vraies surfaces mathématiques.', en: 'B-rep = boundary representation: a solid is bounded by faces lying on true mathematical surfaces.' },
    },
    {
      id: 'cpp-q17', skill: 'cpp.occt', lesson: 'cpp-6', level: 2, type: 'order',
      prompt: { fr: 'Range ces entités de la plus grande à la plus petite.', en: 'Order these entities from largest to smallest.' },
      items: { fr: ['Compound', 'Solid', 'Shell', 'Face', 'Edge', 'Vertex'], en: ['Compound', 'Solid', 'Shell', 'Face', 'Edge', 'Vertex'] },
      explain: { fr: 'Assemblage → pièce → peau → face → arête → sommet (le Wire, contour, se place entre Face et Edge).', en: 'Assembly → part → skin → face → edge → vertex (the Wire, an outline, sits between Face and Edge).' },
    },
    {
      id: 'cpp-q18', skill: 'cpp.occt', lesson: 'cpp-6', level: 2, type: 'tf',
      prompt: { fr: 'Choisir une qualité d\'affichage plus fine change le volume exact calculé par BRepGProp.', en: 'Choosing a finer display quality changes the exact volume computed by BRepGProp.' },
      answer: false,
      explain: { fr: 'BRepGProp intègre sur les vraies surfaces : le volume exact ne dépend pas de la tessellation. Seul le <code>mesh_volume</code> (volume des triangles) change.', en: 'BRepGProp integrates over the true surfaces: the exact volume does not depend on the tessellation. Only the <code>mesh_volume</code> (volume of the triangles) changes.' },
    },
    // ---------------- extra (remediation)
    {
      id: 'cpp-q19', skill: 'cpp.syntax', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'En C++, les blocs de code sont délimités par l\'indentation, comme en Python.', en: 'In C++, code blocks are delimited by indentation, as in Python.' },
      answer: false,
      explain: { fr: 'Ce sont les accolades <code>{ }</code>. L\'indentation n\'aide que l\'humain qui lit.', en: 'It is the braces <code>{ }</code>. Indentation only helps the human reading.' },
    },
    {
      id: 'cpp-q20', skill: 'cpp.syntax', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'Quel mot-clé laisse le compilateur deviner le type ?', en: 'Which keyword lets the compiler guess the type?' },
      code: '____ masse = volume * 2.70;',
      lang: 'cpp',
      accept: ['auto'],
      explain: { fr: '<code>auto</code> : le compilateur regarde la valeur à droite et en déduit le type (ici <code>double</code>).', en: '<code>auto</code>: the compiler looks at the value on the right and deduces the type (here <code>double</code>).' },
    },
    {
      id: 'cpp-q21', skill: 'cpp.syntax', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Comment se lit <code>fonderie::DENSITE_ALU</code> ?', en: 'How do you read <code>foundry::ALU_DENSITY</code>?' },
      choices: { fr: ['fonderie divisé par DENSITE_ALU', 'DENSITE_ALU rangé dans l\'espace de noms fonderie', 'un pointeur vers fonderie', 'une comparaison'], en: ['foundry divided by ALU_DENSITY', 'ALU_DENSITY stored in the foundry namespace', 'a pointer to foundry', 'a comparison'] },
      answer: 1,
      explain: { fr: '<code>::</code> est l\'opérateur de portée : « DENSITE_ALU <em>de</em> fonderie ». Même logique pour <code>std::string</code>.', en: '<code>::</code> is the scope operator: "ALU_DENSITY <em>of</em> foundry". Same logic for <code>std::string</code>.' },
    },
    {
      id: 'cpp-q22', skill: 'cpp.functions', extra: true, level: 1, type: 'match',
      prompt: { fr: 'Associe chaque écriture à son sens.', en: 'Match each notation to its meaning.' },
      pairs: {
        fr: [['int&amp; r', 'r est une référence vers un int'], ['&amp;x', 'l\'adresse de x'], ['int* p', 'p est un pointeur vers un int'], ['*p', 'la valeur à l\'adresse p']],
        en: [['int&amp; r', 'r is a reference to an int'], ['&amp;x', 'the address of x'], ['int* p', 'p is a pointer to an int'], ['*p', 'the value at address p']],
      },
      explain: { fr: 'Dans une déclaration, <code>&amp;</code> et <code>*</code> décrivent le type. Devant une variable, ils agissent : « adresse de » et « valeur pointée ».', en: 'In a declaration, <code>&amp;</code> and <code>*</code> describe the type. In front of a variable, they act: "address of" and "value pointed to".' },
    },
    {
      id: 'cpp-q23', skill: 'cpp.functions', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Après ce code, combien vaut <code>a</code> ?', en: 'After this code, what is <code>a</code>?' },
      code: 'void f(int n) { n = 99; }\nint a = 1;\nf(a);',
      lang: 'cpp',
      choices: { fr: ['1', '99', '0', 'Indéfini'], en: ['1', '99', '0', 'Undefined'] },
      answer: 0,
      explain: { fr: 'Sans <code>&amp;</code>, le paramètre est une <strong>copie</strong>. La fonction modifie la photocopie, pas l\'original.', en: 'Without <code>&amp;</code>, the parameter is a <strong>copy</strong>. The function modifies the photocopy, not the original.' },
    },
    {
      id: 'cpp-q24', skill: 'cpp.functions', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi en Python écrit-on <code>BRepGProp.VolumeProperties_s(solid, props, eps)</code> puis <code>props.Mass()</code>, au lieu de <code>volume = BRepGProp.VolumeProperties_s(solid)</code> ?', en: 'Why do we write <code>BRepGProp.VolumeProperties_s(solid, props, eps)</code> then <code>props.Mass()</code> in Python, instead of <code>volume = BRepGProp.VolumeProperties_s(solid)</code>?' },
      choices: {
        fr: ['Parce que Python ne sait pas renvoyer de nombre', 'Parce que la fonction C++ remplit un objet résultat reçu par référence', 'Parce que Mass() est plus rapide', 'Par erreur du développeur'],
        en: ['Because Python cannot return a number', 'Because the C++ function fills a result object received by reference', 'Because Mass() is faster', 'Developer mistake'],
      },
      answer: 1,
      explain: { fr: 'La signature C++ est <code>VolumeProperties(const TopoDS_Shape&amp;, GProp_GProps&amp; props, …)</code> : <code>props</code> est passé par référence et rempli. Les liaisons Python/JS gardent cette forme.', en: 'The C++ signature is <code>VolumeProperties(const TopoDS_Shape&amp;, GProp_GProps&amp; props, …)</code>: <code>props</code> is passed by reference and filled. The Python/JS bindings keep that shape.' },
    },
    {
      id: 'cpp-q25', skill: 'cpp.classes', extra: true, level: 1, type: 'tf',
      prompt: { fr: '<code>TopoDS_Face</code> hérite de <code>TopoDS_Shape</code> : une fonction qui accepte une forme accepte donc une face.', en: '<code>TopoDS_Face</code> inherits from <code>TopoDS_Shape</code>: a function that accepts a shape therefore accepts a face.' },
      answer: true,
      explain: { fr: 'Héritage = « est un ». Une face <em>est une</em> forme, comme un moule coquille <em>est un</em> moule.', en: 'Inheritance = "is a". A face <em>is a</em> shape, just as a permanent mould <em>is a</em> mould.' },
    },
    {
      id: 'cpp-q26', skill: 'cpp.classes', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'En Python (OCP), que signifie le suffixe <code>_s</code> dans <code>VolumeProperties_s</code> ?', en: 'In Python (OCP), what does the <code>_s</code> suffix in <code>VolumeProperties_s</code> mean?' },
      choices: { fr: ['Sécurisé', 'Statique : appelée sur la classe, pas sur un objet', 'Secondes', 'Surcharge numéro s'], en: ['Secure', 'Static: called on the class, not on an object', 'Seconds', 'Overload number s'] },
      answer: 1,
      explain: { fr: 'Une méthode statique n\'a pas besoin d\'objet : <code>BRepGProp.VolumeProperties_s(...)</code> s\'appelle directement sur la classe.', en: 'A static method needs no object: <code>BRepGProp.VolumeProperties_s(...)</code> is called directly on the class.' },
    },
    {
      id: 'cpp-q27', skill: 'cpp.classes', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui est le <strong>constructeur</strong>.', en: 'Click the line that is the <strong>constructor</strong>.' },
      code: 'class Moule {\npublic:\n  Moule(int empreintes) : empreintes_(empreintes) {}\n  int pieces_par_cycle() const { return empreintes_; }\nprivate:\n  int empreintes_;\n};',
      lang: 'cpp',
      answer: 2,
      explain: { fr: 'Le constructeur porte <strong>le nom de la classe</strong> et n\'a pas de type de retour. La ligne suivante est une méthode.', en: 'The constructor has <strong>the class name</strong> and no return type. The next line is a method.' },
    },
    {
      id: 'cpp-q28', skill: 'cpp.memory', extra: true, level: 1, type: 'match',
      prompt: { fr: 'Associe chaque notion à son analogie.', en: 'Match each notion with its analogy.' },
      pairs: {
        fr: [['Pile', 'L\'établi, débarrassé à la fin de l\'opération'], ['Tas', 'Le magasin de stockage, il faut rendre le bon'], ['Handle', 'Un emplacement avec registre des emprunteurs'], ['Fuite mémoire', 'Un emplacement réservé jamais rendu']],
        en: [['Stack', 'The workbench, cleared at the end of the operation'], ['Heap', 'The storage warehouse, the receipt must be returned'], ['Handle', 'A slot with a borrowers\' register'], ['Memory leak', 'A reserved slot never given back']],
      },
      explain: { fr: 'Pile = automatique, tas = manuel, Handle = compteur de références, fuite = oubli de libérer.', en: 'Stack = automatic, heap = manual, Handle = reference counting, leak = forgetting to free.' },
    },
    {
      id: 'cpp-q29', skill: 'cpp.memory', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Dans ce code JS, quelle ligne rend la mémoire WebAssembly du point ?', en: 'In this JS code, which line gives back the WebAssembly memory of the point?' },
      code: 'const centre = new oc.gp_Pnt_1();\nconst t = new oc.gp_Trsf_1();\nt.SetScale(centre, -1);\ncentre.delete();\nreturn t;',
      lang: 'js',
      answer: 3,
      explain: { fr: '<code>centre.delete()</code> libère le <code>gp_Pnt</code> côté WebAssembly. <code>t</code> est renvoyé, donc c\'est l\'appelant qui devra le libérer.', en: '<code>centre.delete()</code> frees the <code>gp_Pnt</code> on the WebAssembly side. <code>t</code> is returned, so the caller will have to free it.' },
    },
    {
      id: 'cpp-q30', skill: 'cpp.memory', extra: true, level: 3, type: 'multi',
      prompt: { fr: 'Quelles solutions évitent d\'avoir à écrire <code>delete</code> soi-même en C++ ?', en: 'Which solutions avoid writing <code>delete</code> yourself in C++?' },
      choices: { fr: ['<code>std::unique_ptr</code> / <code>std::make_unique</code>', '<code>std::shared_ptr</code>', '<code>Handle(T)</code> d\'OpenCascade', 'Un pointeur brut <code>T*</code>'], en: ['<code>std::unique_ptr</code> / <code>std::make_unique</code>', '<code>std::shared_ptr</code>', 'OpenCascade\'s <code>Handle(T)</code>', 'A raw pointer <code>T*</code>'] },
      answer: [0, 1, 2],
      explain: { fr: 'Les pointeurs intelligents et le Handle libèrent l\'objet automatiquement. Un pointeur brut obtenu par <code>new</code> exige un <code>delete</code>.', en: 'Smart pointers and the Handle free the object automatically. A raw pointer from <code>new</code> needs a <code>delete</code>.' },
    },
    {
      id: 'cpp-q31', skill: 'cpp.build', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un exécutable compilé pour Windows x86 tourne tel quel sur un Mac ARM.', en: 'An executable compiled for Windows x86 runs as-is on an ARM Mac.' },
      answer: false,
      explain: { fr: 'Un binaire natif vise un système et un processeur précis. WebAssembly contourne ça : un seul fichier pour tous les navigateurs.', en: 'A native binary targets one system and processor. WebAssembly gets around that: one file for every browser.' },
    },
    {
      id: 'cpp-q32', skill: 'cpp.build', extra: true, level: 2, type: 'match',
      prompt: { fr: 'Associe chaque outil à son rôle.', en: 'Match each tool to its role.' },
      pairs: {
        fr: [['Compilateur', 'Traduit le C++ en code machine'], ['Éditeur de liens', 'Assemble ton code et les bibliothèques'], ['Emscripten', 'Compile le C++ en WebAssembly'], ['embind', 'Génère les liaisons JS ↔ C++']],
        en: [['Compiler', 'Translates C++ into machine code'], ['Linker', 'Joins your code and the libraries'], ['Emscripten', 'Compiles C++ to WebAssembly'], ['embind', 'Generates the JS ↔ C++ bindings']],
      },
      explain: { fr: 'Emscripten est un compilateur particulier dont la cible est WebAssembly ; embind est la partie qui fabrique le « lexique » entre JS et C++.', en: 'Emscripten is a special compiler whose target is WebAssembly; embind is the part that builds the "glossary" between JS and C++.' },
    },
    {
      id: 'cpp-q33', skill: 'cpp.build', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi le fichier wasm est-il publié en <code>.wasm.gz</code> ?', en: 'Why is the wasm file published as <code>.wasm.gz</code>?' },
      choices: { fr: ['Pour le chiffrer', 'Pour réduire la taille à télécharger (≈ 50 Mo non compressé)', 'Parce que les navigateurs exigent le gzip', 'Pour le rendre compatible Python'], en: ['To encrypt it', 'To reduce the download size (≈ 50 MB uncompressed)', 'Because browsers require gzip', 'To make it Python-compatible'] },
      answer: 1,
      explain: { fr: 'Le binaire complet d\'OpenCascade est gros. Compressé, il se télécharge plus vite ; <code>occt.js</code> le décompresse au vol avec <code>DecompressionStream</code>.', en: 'The full OpenCascade binary is big. Compressed, it downloads faster; <code>occt.js</code> decompresses it on the fly with <code>DecompressionStream</code>.' },
    },
    {
      id: 'cpp-q34', skill: 'cpp.occt', extra: true, level: 1, type: 'match',
      prompt: { fr: 'Associe chaque classe OpenCascade à son rôle.', en: 'Match each OpenCascade class to its role.' },
      pairs: {
        fr: [['STEPCAFControl_Reader', 'Lit un fichier STEP avec noms et couleurs'], ['BRepGProp', 'Calcule volume, aire, centre de gravité'], ['BRepMesh_IncrementalMesh', 'Découpe les faces en triangles'], ['TopExp_Explorer', 'Parcourt les faces/arêtes d\'une forme']],
        en: [['STEPCAFControl_Reader', 'Reads a STEP file with names and colours'], ['BRepGProp', 'Computes volume, area, centre of gravity'], ['BRepMesh_IncrementalMesh', 'Cuts faces into triangles'], ['TopExp_Explorer', 'Walks the faces/edges of a shape']],
      },
      explain: { fr: 'Lecture → propriétés → tessellation → exploration : les quatre briques de base de <code>cad.py</code> et <code>cad.js</code>.', en: 'Reading → properties → tessellation → exploration: the four basic bricks of <code>cad.py</code> and <code>cad.js</code>.' },
    },
    {
      id: 'cpp-q35', skill: 'cpp.occt', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Un solide renvoie un volume négatif. Que fait <code>reader3d/cad.py</code> ?', en: 'A solid returns a negative volume. What does <code>reader3d/cad.py</code> do?' },
      choices: { fr: ['Il rejette le fichier', 'Il corrige le signe et ajoute une note', 'Il met le volume à 0', 'Il refait la tessellation'], en: ['It rejects the file', 'It fixes the sign and adds a note', 'It sets the volume to 0', 'It redoes the tessellation'] },
      answer: 1,
      explain: { fr: 'Un volume négatif = solide retourné. Le code fait <code>volume = -volume</code> et ajoute « Solid had inverted orientation; volume sign corrected ».', en: 'A negative volume = inside-out solid. The code does <code>volume = -volume</code> and adds "Solid had inverted orientation; volume sign corrected".' },
    },
    {
      id: 'cpp-q36', skill: 'cpp.occt', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pour <code>BRepGProp::LinearProperties(wire, props)</code>, que renvoie <code>props.Mass()</code> ?', en: 'For <code>BRepGProp::LinearProperties(wire, props)</code>, what does <code>props.Mass()</code> return?' },
      choices: { fr: ['Une masse en kg', 'La longueur du contour', 'L\'aire', 'Le volume'], en: ['A mass in kg', 'The length of the outline', 'The area', 'The volume'] },
      answer: 1,
      explain: { fr: '<code>Mass()</code> = la « masse » d\'une densité 1 dans la dimension étudiée : longueur pour Linear, aire pour Surface, volume pour Volume.', en: '<code>Mass()</code> = the "mass" for density 1 in the dimension studied: length for Linear, area for Surface, volume for Volume.' },
    },
    // ---------------- exam
    {
      id: 'cpp-q37', skill: 'cpp.syntax', level: 1, type: 'mcq',
      prompt: { fr: 'Quel est le point de départ d\'un programme C++ ?', en: 'What is the starting point of a C++ program?' },
      choices: { fr: ['La première ligne du fichier', 'La fonction <code>main</code>', 'Le premier <code>#include</code>', 'La classe <code>Program</code>'], en: ['The first line of the file', 'The <code>main</code> function', 'The first <code>#include</code>', 'The <code>Program</code> class'] },
      answer: 1,
      explain: { fr: 'L\'exécution commence toujours par <code>main()</code>.', en: 'Execution always begins with <code>main()</code>.' },
    },
    {
      id: 'cpp-q38', skill: 'cpp.syntax', level: 2, type: 'fill',
      prompt: { fr: 'Quelle directive permet d\'utiliser <code>std::vector</code> ?', en: 'Which directive lets you use <code>std::vector</code>?' },
      code: '____ <vector>',
      lang: 'cpp',
      accept: ['#include'],
      explain: { fr: '<code>#include &lt;vector&gt;</code> recopie l\'en-tête de la bibliothèque standard qui déclare <code>std::vector</code>.', en: '<code>#include &lt;vector&gt;</code> pastes the standard library header that declares <code>std::vector</code>.' },
    },
    {
      id: 'cpp-q39', skill: 'cpp.functions', level: 2, type: 'mcq',
      prompt: { fr: 'Que se passe-t-il si on déréférence un pointeur <code>nullptr</code> (<code>*p</code>) ?', en: 'What happens if you dereference a <code>nullptr</code> pointer (<code>*p</code>)?' },
      choices: { fr: ['On obtient 0', 'Le programme plante (segmentation fault)', 'Le compilateur le corrige', 'On obtient une chaîne vide'], en: ['You get 0', 'The program crashes (segmentation fault)', 'The compiler fixes it', 'You get an empty string'] },
      answer: 1,
      explain: { fr: 'Aller lire « nulle part » fait planter le processus. Ce type de plantage explique pourquoi le serveur Python isole OpenCascade dans un processus enfant.', en: 'Reading from "nowhere" crashes the process. This kind of crash is why the Python server isolates OpenCascade in a child process.' },
    },
    {
      id: 'cpp-q40', skill: 'cpp.functions', level: 3, type: 'fill',
      prompt: { fr: 'Complète pour passer la forme sans copie et en lecture seule.', en: 'Fill in to pass the shape without a copy and read-only.' },
      code: 'double volume(____ TopoDS_Shape& s);',
      lang: 'cpp',
      accept: ['const'],
      explain: { fr: '<code>const TopoDS_Shape&amp;</code> : référence (pas de copie) + <code>const</code> (lecture seule).', en: '<code>const TopoDS_Shape&amp;</code>: reference (no copy) + <code>const</code> (read-only).' },
    },
    {
      id: 'cpp-q41', skill: 'cpp.classes', level: 2, type: 'mcq',
      prompt: { fr: 'Dans <code>new oc.Handle_TDocStd_Document_2(doc)</code>, d\'où vient ce nom ?', en: 'In <code>new oc.Handle_TDocStd_Document_2(doc)</code>, where does that name come from?' },
      choices: {
        fr: ['Du template C++ <code>Handle(TDocStd_Document)</code>, aplati en un nom JS puis numéroté', 'D\'une fonction écrite par 3D Reader', 'D\'une erreur de frappe', 'Du format STEP'],
        en: ['From the C++ template <code>Handle(TDocStd_Document)</code>, flattened into a JS name then numbered', 'From a function written by 3D Reader', 'From a typo', 'From the STEP format'],
      },
      answer: 0,
      explain: { fr: 'JS n\'a pas de templates : chaque instanciation utile (<code>handle&lt;TDocStd_Document&gt;</code>) devient une classe JS à part, et <code>_2</code> choisit la surcharge du constructeur.', en: 'JS has no templates: each useful instantiation (<code>handle&lt;TDocStd_Document&gt;</code>) becomes a separate JS class, and <code>_2</code> picks the constructor overload.' },
    },
    {
      id: 'cpp-q42', skill: 'cpp.memory', level: 2, type: 'mcq',
      prompt: { fr: 'Où vivent les variables locales d\'une fonction C++ ?', en: 'Where do the local variables of a C++ function live?' },
      choices: { fr: ['Sur le tas', 'Sur la pile', 'Sur le disque', 'Dans le navigateur'], en: ['On the heap', 'On the stack', 'On disk', 'In the browser'] },
      answer: 1,
      explain: { fr: 'Variables locales = pile, libérées automatiquement à la sortie de la fonction.', en: 'Local variables = stack, freed automatically when the function exits.' },
    },
    {
      id: 'cpp-q43', skill: 'cpp.build', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi 3D Reader a-t-il besoin de WebAssembly pour sa version GitHub Pages ?', en: 'Why does 3D Reader need WebAssembly for its GitHub Pages version?' },
      choices: { fr: ['Parce que Pages ne sert que des fichiers statiques : le calcul doit tourner dans le navigateur', 'Parce que le Python est interdit sur GitHub', 'Pour le style CSS', 'Pour stocker les fichiers des utilisateurs'], en: ['Because Pages only serves static files: the computation must run in the browser', 'Because Python is banned on GitHub', 'For CSS styling', 'To store users\' files'] },
      answer: 0,
      explain: { fr: 'Pas de serveur sur Pages → OpenCascade compilé en wasm tourne chez le visiteur.', en: 'No server on Pages → OpenCascade compiled to wasm runs on the visitor\'s machine.' },
    },
    {
      id: 'cpp-q44', skill: 'cpp.occt', level: 2, type: 'multi',
      prompt: { fr: 'Quelles informations un STEP lu par <code>STEPCAFControl_Reader</code> peut-il fournir ?', en: 'What information can a STEP read by <code>STEPCAFControl_Reader</code> provide?' },
      choices: { fr: ['La géométrie exacte des faces', 'Les noms des pièces', 'Les couleurs', 'Le prix de la pièce'], en: ['The exact geometry of the faces', 'The part names', 'The colours', 'The price of the part'] },
      answer: [0, 1, 2],
      explain: { fr: 'Le lecteur « CAF » garde géométrie, noms et couleurs dans un document XCAF. Le prix n\'est évidemment pas dans le fichier CAO.', en: 'The "CAF" reader keeps geometry, names and colours in an XCAF document. The price is obviously not in the CAD file.' },
    },
    {
      id: 'cpp-q45', skill: 'cpp.occt', level: 3, type: 'mcq',
      prompt: { fr: 'Le volume du maillage d\'affichage d\'un cylindre est légèrement inférieur au volume exact. Pourquoi ?', en: 'The display-mesh volume of a cylinder is slightly below the exact volume. Why?' },
      choices: { fr: ['Les triangles plats forment un prisme inscrit dans le vrai cylindre', 'L\'unité est fausse', 'Le cylindre est creux', 'BRepGProp arrondit'], en: ['Flat triangles form a prism inscribed in the true cylinder', 'The unit is wrong', 'The cylinder is hollow', 'BRepGProp rounds'] },
      answer: 0,
      explain: { fr: 'Les sommets des triangles sont <em>sur</em> la surface, les facettes passent donc à l\'intérieur : un peu de matière manque sur les zones courbes.', en: 'The triangle vertices lie <em>on</em> the surface, so the facets pass inside it: a little material is missing on curved areas.' },
    },
    {
      id: 'cpp-q46', skill: 'cpp.classes', level: 1, type: 'tf',
      prompt: { fr: 'En C++, deux fonctions peuvent avoir le même nom si leurs paramètres sont différents.', en: 'In C++, two functions can have the same name if their parameters differ.' },
      answer: true,
      explain: { fr: 'C\'est la surcharge. JavaScript ne l\'a pas, d\'où les suffixes <code>_1</code>, <code>_2</code> d\'opencascade.js.', en: 'That is overloading. JavaScript lacks it, hence opencascade.js\'s <code>_1</code>, <code>_2</code> suffixes.' },
    },
  ],
};
