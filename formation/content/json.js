// Module « Les fichiers JSON » : à quoi sert JSON, sa grammaire, les vrais fichiers
// de 3D Reader, JSON dans le code, JSON Schema et les bonnes pratiques.
// Format : voir ../CONTENT_SPEC.md. Valeurs d'exemple fictives uniquement.

export default {
  id: 'json',
  order: 3.5,
  icon: '🗂️',
  color: '#0e8a7e',
  title: { fr: 'Les fichiers JSON', en: 'JSON files' },
  summary: {
    fr: 'Le format texte qui transporte les données partout dans 3D Reader : réglages, résultats, échanges avec les serveurs et l’IA.',
    en: 'The text format that carries data everywhere in 3D Reader: settings, results, exchanges with servers and the AI.',
  },
  skills: {
    'json.purpose': { fr: 'À quoi sert JSON', en: 'What JSON is for' },
    'json.syntax': { fr: 'La grammaire de JSON', en: 'JSON grammar' },
    'json.files': { fr: 'Lire un vrai fichier JSON', en: 'Reading a real JSON file' },
    'json.code': { fr: 'JSON dans le code (parse, stringify)', en: 'JSON in code (parse, stringify)' },
    'json.schema': { fr: 'Contrats et JSON Schema', en: 'Contracts and JSON Schema' },
    'json.practice': { fr: 'Bonnes pratiques et pièges', en: 'Good practice and pitfalls' },
  },

  widgets: {
    'json-lab-fix': {
      type: 'jsonlab',
      intro: {
        fr: 'Ce fichier a été écrit « comme du JavaScript » : le lecteur JSON le refuse. Corrige-le jusqu’à ce que toutes les missions soient vertes.',
        en: 'This file was written “like JavaScript”: the JSON reader refuses it. Fix it until every mission is green.',
      },
      initial: '{\n  name: \'carter\',\n  "volume": 1250,\n  "closed": True,\n  "bodies": ["Body 1", "Body 2",],\n}',
      solution: '{\n  "name": "carter",\n  "volume": 1250,\n  "closed": true,\n  "bodies": ["Body 1", "Body 2"]\n}',
      missions: [
        { fr: 'Rends le JSON valide (le message d’erreur indique la ligne).', en: 'Make the JSON valid (the error message gives the line).' },
        { path: 'name', equals: 'carter', fr: 'La clé <code>name</code> vaut le texte <code>"carter"</code>.', en: 'The <code>name</code> key holds the text <code>"carter"</code>.' },
        { path: 'closed', equals: true, fr: '<code>closed</code> est le booléen <code>true</code> (en minuscules).', en: '<code>closed</code> is the boolean <code>true</code> (lower case).' },
        { path: 'bodies', type: 'array', length: 2, fr: '<code>bodies</code> est un tableau de 2 éléments.', en: '<code>bodies</code> is an array of 2 items.' },
      ],
    },
    'json-lab-escape': {
      type: 'jsonlab',
      intro: {
        fr: 'Les guillemets et les barres obliques inverses doivent être « échappés » dans une chaîne JSON. Répare ces deux valeurs.',
        en: 'Quotes and backslashes must be “escaped” inside a JSON string. Fix these two values.',
      },
      initial: '{\n  "message": "Il a dit "OK" au contrôle",\n  "folder": "C:\\dev\\3D-reader"\n}',
      solution: '{\n  "message": "Il a dit \\"OK\\" au contrôle",\n  "folder": "C:\\\\dev\\\\3D-reader"\n}',
      missions: [
        { fr: 'Rends le JSON valide.', en: 'Make the JSON valid.' },
        { path: 'message', equals: 'Il a dit "OK" au contrôle', fr: '<code>message</code> contient vraiment les guillemets autour de OK.', en: '<code>message</code> really contains the quotes around OK.' },
        { path: 'folder', equals: 'C:\\dev\\3D-reader', fr: '<code>folder</code> vaut le chemin <code>C:\\dev\\3D-reader</code>.', en: '<code>folder</code> holds the path <code>C:\\dev\\3D-reader</code>.' },
      ],
    },
    'json-lab-build': {
      type: 'jsonlab',
      intro: {
        fr: 'Construis le résultat d’analyse d’une pièce fictive, sur le modèle du contrat de résultat de 3D Reader.',
        en: 'Build the analysis result of a made-up part, modelled on 3D Reader’s result contract.',
      },
      initial: '{\n  "file": "support.step",\n  "kind": "cad",\n  "bodies": []\n}',
      solution: '{\n  "file": "support.step",\n  "kind": "cad",\n  "summary": { "bodies": 2, "volume": 4300 },\n  "bodies": [\n    { "name": "Body 1", "volume": 4000, "closed": true },\n    { "name": "Body 2", "volume": 300, "closed": false }\n  ]\n}',
      missions: [
        { path: 'bodies', type: 'array', minLength: 2, fr: 'Mets au moins 2 corps (des objets) dans le tableau <code>bodies</code>.', en: 'Put at least 2 bodies (objects) in the <code>bodies</code> array.' },
        { path: 'bodies.0.name', type: 'string', fr: 'Le premier corps a un <code>name</code> (texte).', en: 'The first body has a <code>name</code> (text).' },
        { path: 'bodies.0.volume', type: 'number', fr: 'Le premier corps a un <code>volume</code> (nombre, sans guillemets).', en: 'The first body has a <code>volume</code> (number, no quotes).' },
        { path: 'bodies.1.closed', equals: false, fr: 'Le deuxième corps est ouvert : <code>closed</code> vaut <code>false</code>.', en: 'The second body is open: <code>closed</code> is <code>false</code>.' },
        { path: 'summary.bodies', equals: 2, fr: 'Ajoute un objet <code>summary</code> dont <code>bodies</code> vaut 2.', en: 'Add a <code>summary</code> object whose <code>bodies</code> is 2.' },
      ],
    },
    'json-lab-package': {
      type: 'jsonlab',
      intro: {
        fr: 'Voici un package.json simplifié. Prépare une nouvelle version de l’appli.',
        en: 'Here is a simplified package.json. Prepare a new version of the app.',
      },
      initial: '{\n  "name": "3d-reader-web",\n  "private": true,\n  "version": "0.2.0",\n  "type": "module",\n  "scripts": {\n    "build": "node scripts/build-web.mjs",\n    "test": "node --test tests/js/*.test.mjs"\n  },\n  "devDependencies": {\n    "three": "0.180.0"\n  }\n}',
      solution: '{\n  "name": "3d-reader-web",\n  "private": true,\n  "version": "0.3.0",\n  "type": "module",\n  "scripts": {\n    "build": "node scripts/build-web.mjs",\n    "test": "node --test tests/js/*.test.mjs",\n    "serve": "node scripts/serve.mjs"\n  },\n  "devDependencies": {\n    "three": "0.180.0"\n  }\n}',
      missions: [
        { path: 'version', equals: '0.3.0', fr: 'Passe la version à <code>0.3.0</code> (nouvelle fonctionnalité).', en: 'Bump the version to <code>0.3.0</code> (new feature).' },
        { path: 'scripts.serve', equals: 'node scripts/serve.mjs', fr: 'Ajoute le script <code>serve</code> qui lance <code>node scripts/serve.mjs</code> (attention à la virgule !).', en: 'Add the <code>serve</code> script that runs <code>node scripts/serve.mjs</code> (mind the comma!).' },
        { path: 'scripts.test', type: 'string', fr: 'Garde le script <code>test</code>.', en: 'Keep the <code>test</code> script.' },
        { path: 'devDependencies.three', equals: '0.180.0', fr: 'Ne touche pas à la version de three.', en: 'Leave the version of three alone.' },
      ],
    },
  },

  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'json-1',
      title: { fr: 'À quoi sert JSON ?', en: 'What is JSON for?' },
      skills: ['json.purpose'],
      minutes: 9,
      body: {
        fr: `<h3>Un format pour transporter des données</h3>
<p><span class="term" data-term="json">JSON</span> (prononcé « djé-sonne », pour <em>JavaScript Object Notation</em>) est une façon d’écrire des données <strong>sous forme de texte</strong>. Pas un langage de programmation : il n’y a ni boucle, ni condition, ni fonction. Juste des valeurs bien rangées, que n’importe quel programme sait relire.</p>
<p>Pourquoi du texte ? Parce que le texte voyage partout : dans un fichier sur le disque, dans un message envoyé sur Internet, dans la mémoire du navigateur. Un humain peut l’ouvrir dans le Bloc-notes et le lire ; une machine peut le découper en un clin d’œil.</p>
~~~json title="Un résultat d’analyse (valeurs fictives)"
{
  "file": "carter.step",
  "unit": "mm",
  "volume": 152000,
  "closed": true,
  "bodies": ["Body 1", "Body 2"]
}
~~~
<p>Même sans rien connaître, tu devines : le fichier s’appelle <code>carter.step</code>, l’unité est le millimètre, le volume vaut 152 000, le corps est fermé et il y a deux corps. C’est tout l’intérêt de JSON : <strong>lisible par un humain ET par une machine</strong>.</p>

<h3>Indépendant du langage</h3>
<p>JSON est né du JavaScript, mais aujourd’hui tous les langages le parlent : Python (<code>json.loads</code>), C++ (bibliothèques comme nlohmann::json), PowerShell (<code>ConvertFrom-Json</code>), Excel (Power Query)… C’est une <strong>langue commune</strong> : le moteur Python de 3D Reader et le moteur JavaScript produisent le <em>même</em> JSON de résultat, ce qui permet de les comparer dans les tests.</p>

<h3>Où on le croise dans 3D Reader</h3>
<table>
<thead><tr><th>Fichier ou échange</th><th>Rôle</th></tr></thead>
<tbody>
<tr><td><code>package.json</code></td><td>la carte d’identité du projet Node : nom, version, scripts, dépendances</td></tr>
<tr><td><code>package-lock.json</code></td><td>les versions exactes de toutes les dépendances installées</td></tr>
<tr><td><code>vercel.json</code></td><td>les réglages de l’hébergement de la passerelle IA</td></tr>
<tr><td><code>web/config.json</code></td><td>un réglage lu par la page au démarrage (<code>"server": false</code>)</td></tr>
<tr><td><code>.devcontainer/devcontainer.json</code></td><td>la recette de l’environnement Codespaces</td></tr>
<tr><td>réponse de <code>/api/analyze</code> et <code>/api/ai</code></td><td>les données échangées avec les serveurs (voir le module réseau)</td></tr>
<tr><td><code>localStorage</code></td><td>les réglages et l’historique gardés dans le navigateur</td></tr>
</tbody>
</table>
<div class="callout project"><p>La sauvegarde de ta progression dans cette formation (bouton « Exporter » de la page Progression) est un fichier JSON. Le fichier de reprise de session que Claude Code peut te remettre est aussi du JSON. Même format, usages différents.</p></div>

<h3>JSON et ses cousins</h3>
<table>
<thead><tr><th>Format</th><th>Forme</th><th>Bon pour</th></tr></thead>
<tbody>
<tr><td>CSV</td><td>lignes et colonnes séparées par des virgules ou des points-virgules</td><td>des tableaux plats (une ligne = une pièce)</td></tr>
<tr><td>JSON</td><td>objets et listes imbriqués</td><td>des données structurées : une pièce qui contient des corps qui contiennent des faces</td></tr>
<tr><td>XML</td><td>balises <code>&lt;piece&gt;…&lt;/piece&gt;</code></td><td>documents anciens, formats industriels ; plus bavard</td></tr>
<tr><td>YAML</td><td>indentation, sans accolades</td><td>fichiers de réglages écrits à la main (workflows GitHub)</td></tr>
<tr><td>Excel (.xlsx)</td><td>fichier binaire compressé</td><td>calculs et mise en forme pour des humains ; pas un format d’échange simple</td></tr>
</tbody>
</table>
<div class="callout tip"><p>Règle pratique : un tableau plat → CSV ; des données avec des niveaux (une pièce et ses corps) → JSON ; un réglage que des humains éditent souvent → YAML ou JSON.</p></div>`,
        en: `<h3>A format to carry data</h3>
<p><span class="term" data-term="json">JSON</span> (pronounced “jay-son”, for <em>JavaScript Object Notation</em>) is a way to write data <strong>as text</strong>. Not a programming language: no loop, no condition, no function. Just well-arranged values that any program can read back.</p>
<p>Why text? Because text travels everywhere: in a file on disk, in a message sent over the Internet, in the browser’s memory. A human can open it in Notepad and read it; a machine can split it up in a flash.</p>
~~~json title="An analysis result (made-up values)"
{
  "file": "carter.step",
  "unit": "mm",
  "volume": 152000,
  "closed": true,
  "bodies": ["Body 1", "Body 2"]
}
~~~
<p>Even knowing nothing, you can guess: the file is called <code>carter.step</code>, the unit is the millimetre, the volume is 152,000, the body is closed and there are two bodies. That is the whole point of JSON: <strong>readable by a human AND a machine</strong>.</p>

<h3>Independent of the language</h3>
<p>JSON was born from JavaScript, but today every language speaks it: Python (<code>json.loads</code>), C++ (libraries such as nlohmann::json), PowerShell (<code>ConvertFrom-Json</code>), Excel (Power Query)… It is a <strong>common language</strong>: 3D Reader’s Python engine and JavaScript engine produce the <em>same</em> result JSON, which lets the tests compare them.</p>

<h3>Where you meet it in 3D Reader</h3>
<table>
<thead><tr><th>File or exchange</th><th>Role</th></tr></thead>
<tbody>
<tr><td><code>package.json</code></td><td>the ID card of the Node project: name, version, scripts, dependencies</td></tr>
<tr><td><code>package-lock.json</code></td><td>the exact versions of every installed dependency</td></tr>
<tr><td><code>vercel.json</code></td><td>the hosting settings of the AI gateway</td></tr>
<tr><td><code>web/config.json</code></td><td>a setting the page reads at start-up (<code>"server": false</code>)</td></tr>
<tr><td><code>.devcontainer/devcontainer.json</code></td><td>the recipe of the Codespaces environment</td></tr>
<tr><td>answer of <code>/api/analyze</code> and <code>/api/ai</code></td><td>the data exchanged with the servers (see the network module)</td></tr>
<tr><td><code>localStorage</code></td><td>the settings and history kept in the browser</td></tr>
</tbody>
</table>
<div class="callout project"><p>The backup of your progress in this course (the “Export” button of the Progress page) is a JSON file. The session handoff file Claude Code can give you is JSON too. Same format, different uses.</p></div>

<h3>JSON and its cousins</h3>
<table>
<thead><tr><th>Format</th><th>Shape</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>CSV</td><td>rows and columns separated by commas or semicolons</td><td>flat tables (one row = one part)</td></tr>
<tr><td>JSON</td><td>nested objects and lists</td><td>structured data: a part containing bodies containing faces</td></tr>
<tr><td>XML</td><td>tags <code>&lt;part&gt;…&lt;/part&gt;</code></td><td>older documents, industrial formats; wordier</td></tr>
<tr><td>YAML</td><td>indentation, no braces</td><td>settings files written by hand (GitHub workflows)</td></tr>
<tr><td>Excel (.xlsx)</td><td>compressed binary file</td><td>calculations and layout for humans; not a simple exchange format</td></tr>
</tbody>
</table>
<div class="callout tip"><p>Rule of thumb: a flat table → CSV; data with levels (a part and its bodies) → JSON; a setting humans edit often → YAML or JSON.</p></div>`,
      },
      deep: {
        fr: `<h3>L’étiquette de colis</h3>
<div class="callout analogy"><p>Imagine un colis qui part de l’atelier vers un client. Dessus, une étiquette : expéditeur, destinataire, poids, nombre de cartons. Le transporteur (qui ne parle peut-être pas français) sait la lire parce qu’elle suit <strong>toujours le même modèle</strong> : chaque information a un nom et une valeur.</p></div>
<p>JSON, c’est exactement cette étiquette, mais pour les programmes. Chaque information a :</p>
<ul>
<li>un <strong>nom</strong> (on dit une <em>clé</em>), toujours entre guillemets : <code>"poids"</code> ;</li>
<li>deux-points <code>:</code> ;</li>
<li>une <strong>valeur</strong> : <code>12.5</code>.</li>
</ul>
~~~text
   ÉTIQUETTE                      JSON
┌──────────────────────┐    {
│ Destinataire : Dupont│      "destinataire": "Dupont",
│ Poids : 12,5 kg      │      "poids_kg": 12.5,
│ Fragile : oui        │      "fragile": true,
│ Cartons : 3          │      "cartons": 3
└──────────────────────┘    }
~~~
<h3>Pourquoi pas un fichier Excel ?</h3>
<p>Un fichier Excel est une boîte fermée : pour l’ouvrir, il faut un logiciel qui connaît son format interne compliqué. Un fichier JSON, c’est du texte : on l’ouvre avec n’importe quel éditeur, on le copie dans un e-mail, on voit d’un coup d’œil ce qui a changé entre deux versions (Git adore ça).</p>
<h3>Pourquoi pas une simple liste de lignes ?</h3>
<p>Parce que les données ont souvent des <strong>niveaux</strong> : une pièce contient des corps, chaque corps a un volume, un nom, un état. Un fichier CSV est plat comme une feuille de papier ; JSON est comme un classeur avec des intercalaires : on peut ranger des fiches dans des fiches.</p>
<h3>À retenir en 3 points</h3>
<ol>
<li>JSON = des <strong>données</strong> écrites en texte, pas un programme.</li>
<li>Tout le monde le comprend : JavaScript, Python, C++, PowerShell…</li>
<li>Dans 3D Reader, il sert aux réglages (<code>package.json</code>), aux échanges avec les serveurs et à la mémoire du navigateur.</li>
</ol>`,
        en: `<h3>The parcel label</h3>
<div class="callout analogy"><p>Picture a parcel leaving the workshop for a customer. On it, a label: sender, recipient, weight, number of boxes. The carrier (who may not speak your language) can read it because it <strong>always follows the same template</strong>: each piece of information has a name and a value.</p></div>
<p>JSON is exactly that label, but for programs. Each piece of information has:</p>
<ul>
<li>a <strong>name</strong> (called a <em>key</em>), always between quotes: <code>"weight"</code>;</li>
<li>a colon <code>:</code>;</li>
<li>a <strong>value</strong>: <code>12.5</code>.</li>
</ul>
~~~text
   LABEL                          JSON
┌──────────────────────┐    {
│ Recipient: Smith     │      "recipient": "Smith",
│ Weight: 12.5 kg      │      "weight_kg": 12.5,
│ Fragile: yes         │      "fragile": true,
│ Boxes: 3             │      "boxes": 3
└──────────────────────┘    }
~~~
<h3>Why not an Excel file?</h3>
<p>An Excel file is a closed box: to open it you need software that knows its complicated inner format. A JSON file is text: you open it with any editor, paste it into an e-mail, see at a glance what changed between two versions (Git loves that).</p>
<h3>Why not a plain list of lines?</h3>
<p>Because data often has <strong>levels</strong>: a part contains bodies, each body has a volume, a name, a state. A CSV file is flat like a sheet of paper; JSON is like a binder with dividers: you can file cards inside cards.</p>
<h3>Remember in 3 points</h3>
<ol>
<li>JSON = <strong>data</strong> written as text, not a program.</li>
<li>Everybody understands it: JavaScript, Python, C++, PowerShell…</li>
<li>In 3D Reader it holds settings (<code>package.json</code>), exchanges with the servers and the browser’s memory.</li>
</ol>`,
      },
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'json-2',
      title: { fr: 'La grammaire complète de JSON', en: 'The complete JSON grammar' },
      skills: ['json.syntax'],
      minutes: 14,
      body: {
        fr: `<p>Bonne nouvelle : toute la grammaire de JSON tient sur une page. Mauvaise nouvelle : elle est <strong>très stricte</strong>. Une seule virgule de trop et le fichier entier est refusé.</p>
<h3>Six sortes de valeurs, pas une de plus</h3>
<table>
<thead><tr><th>Sorte</th><th>Exemple</th><th>Règle</th></tr></thead>
<tbody>
<tr><td><span class="term" data-term="objet">objet</span></td><td><code>{ "a": 1, "b": 2 }</code></td><td>des paires <code>"clé": valeur</code> séparées par des virgules, entre accolades</td></tr>
<tr><td><span class="term" data-term="tableau">tableau</span></td><td><code>[1, 2, 3]</code></td><td>des valeurs dans l’ordre, entre crochets</td></tr>
<tr><td><span class="term" data-term="chaine">chaîne</span></td><td><code>"carter.step"</code></td><td>entre guillemets <strong>doubles</strong> uniquement</td></tr>
<tr><td>nombre</td><td><code>42</code>, <code>-3.5</code>, <code>1.2e6</code></td><td>point décimal, pas de virgule ; pas de zéro devant (<code>007</code> interdit)</td></tr>
<tr><td><span class="term" data-term="booleen">booléen</span></td><td><code>true</code>, <code>false</code></td><td>en minuscules, sans guillemets</td></tr>
<tr><td><span class="term" data-term="null">null</span></td><td><code>null</code></td><td>« pas de valeur », en minuscules</td></tr>
</tbody>
</table>
<p>Et on peut <strong>imbriquer</strong> : un objet peut contenir des tableaux qui contiennent des objets, à l’infini.</p>
~~~json
{
  "file": "support.step",     «1»
  "volume": 4300.5,          «2»
  "closed": false,           «3»
  "color": null,             «4»
  "size": [120, 80, 45],     «5»
  "summary": { "bodies": 2 } «6»
}
~~~
<ol class="notes">
<li>Une clé (toujours une chaîne entre guillemets doubles), deux-points, une valeur.</li>
<li>Un nombre décimal : un point, jamais une virgule.</li>
<li>Un booléen, sans guillemets.</li>
<li><code>null</code> : la couleur est inconnue.</li>
<li>Un tableau de trois nombres.</li>
<li>Un objet dans l’objet. Pas de virgule après le dernier élément !</li>
</ol>
<div class="callout warn"><p>Attention : les marqueurs numérotés de l’exemple ci-dessus sont là pour la leçon. Dans un vrai fichier JSON, <strong>aucun commentaire n’est permis</strong> : ni <code>//</code>, ni <code>/* */</code>, ni <code>#</code>.</p></div>

<h3>Les pièges classiques</h3>
<ul>
<li><strong>Virgule finale</strong> : <code>[1, 2, 3,]</code> est refusé.</li>
<li><strong>Guillemets simples</strong> : <code>'carter'</code> est refusé ; il faut <code>"carter"</code>.</li>
<li><strong>Clé sans guillemets</strong> : <code>{ name: "carter" }</code> est refusé.</li>
<li><strong>Majuscules</strong> : <code>True</code>, <code>NULL</code> sont refusés.</li>
<li><strong>Valeurs JavaScript inconnues de JSON</strong> : <code>undefined</code>, <code>NaN</code>, <code>Infinity</code>, une fonction, une date <code>new Date()</code>.</li>
</ul>

<h3>Échapper les caractères spéciaux</h3>
<p>À l’intérieur d’une chaîne, certains caractères doivent être précédés d’une barre oblique inverse <code>\\</code> :</p>
<table>
<thead><tr><th>On écrit</th><th>Ça donne</th></tr></thead>
<tbody>
<tr><td><code>\\"</code></td><td>un guillemet dans le texte</td></tr>
<tr><td><code>\\\\</code></td><td>une barre oblique inverse (chemins Windows : <code>"C:\\\\dev"</code>)</td></tr>
<tr><td><code>\\n</code></td><td>un retour à la ligne</td></tr>
<tr><td><code>\\t</code></td><td>une tabulation</td></tr>
<tr><td><code>\\u00e9</code></td><td>le caractère Unicode n° 00E9, soit « é »</td></tr>
</tbody>
</table>
<p>Les accents peuvent aussi s’écrire directement (<code>"fermé"</code>) : un fichier JSON est en <strong>UTF-8</strong>, l’encodage qui connaît tous les alphabets.</p>
<div data-widget="json-lab-fix"></div>
<div data-widget="json-lab-escape"></div>

<h3>JSON n’est PAS du JavaScript</h3>
<p>Un objet JavaScript écrit dans du code ressemble beaucoup à du JSON, mais il est plus permissif :</p>
<div class="compare">
~~~js title="Objet JavaScript (accepté dans du code)"
const piece = {
  name: 'carter',     // clé sans guillemets, guillemets simples
  volume: 1250,
  closed: true,
  check() { return this.volume > 0; }, // une fonction
};                    // virgule finale permise
~~~
~~~json title="JSON (fichier ou message)"
{
  "name": "carter",
  "volume": 1250,
  "closed": true
}
~~~
</div>
<p>JSON est un <strong>sous-ensemble</strong> strict : tout JSON valide est un objet JavaScript valide, mais pas l’inverse.</p>`,
        en: `<p>Good news: the whole JSON grammar fits on one page. Bad news: it is <strong>very strict</strong>. One comma too many and the whole file is refused.</p>
<h3>Six kinds of values, not one more</h3>
<table>
<thead><tr><th>Kind</th><th>Example</th><th>Rule</th></tr></thead>
<tbody>
<tr><td><span class="term" data-term="objet">object</span></td><td><code>{ "a": 1, "b": 2 }</code></td><td><code>"key": value</code> pairs separated by commas, between braces</td></tr>
<tr><td><span class="term" data-term="tableau">array</span></td><td><code>[1, 2, 3]</code></td><td>values in order, between square brackets</td></tr>
<tr><td><span class="term" data-term="chaine">string</span></td><td><code>"carter.step"</code></td><td>between <strong>double</strong> quotes only</td></tr>
<tr><td>number</td><td><code>42</code>, <code>-3.5</code>, <code>1.2e6</code></td><td>decimal point, no comma; no leading zero (<code>007</code> forbidden)</td></tr>
<tr><td><span class="term" data-term="booleen">boolean</span></td><td><code>true</code>, <code>false</code></td><td>lower case, no quotes</td></tr>
<tr><td><span class="term" data-term="null">null</span></td><td><code>null</code></td><td>“no value”, lower case</td></tr>
</tbody>
</table>
<p>And you can <strong>nest</strong>: an object can hold arrays holding objects, endlessly.</p>
~~~json
{
  "file": "support.step",     «1»
  "volume": 4300.5,          «2»
  "closed": false,           «3»
  "color": null,             «4»
  "size": [120, 80, 45],     «5»
  "summary": { "bodies": 2 } «6»
}
~~~
<ol class="notes">
<li>A key (always a string in double quotes), a colon, a value.</li>
<li>A decimal number: a point, never a comma.</li>
<li>A boolean, no quotes.</li>
<li><code>null</code>: the colour is unknown.</li>
<li>An array of three numbers.</li>
<li>An object inside the object. No comma after the last item!</li>
</ol>
<div class="callout warn"><p>Careful: the numbered markers in the example above are there for the lesson. In a real JSON file <strong>no comment is allowed</strong>: no <code>//</code>, no <code>/* */</code>, no <code>#</code>.</p></div>

<h3>The classic traps</h3>
<ul>
<li><strong>Trailing comma</strong>: <code>[1, 2, 3,]</code> is refused.</li>
<li><strong>Single quotes</strong>: <code>'carter'</code> is refused; you need <code>"carter"</code>.</li>
<li><strong>Key without quotes</strong>: <code>{ name: "carter" }</code> is refused.</li>
<li><strong>Capitals</strong>: <code>True</code>, <code>NULL</code> are refused.</li>
<li><strong>JavaScript values JSON does not know</strong>: <code>undefined</code>, <code>NaN</code>, <code>Infinity</code>, a function, a date <code>new Date()</code>.</li>
</ul>

<h3>Escaping special characters</h3>
<p>Inside a string, some characters must be preceded by a backslash <code>\\</code>:</p>
<table>
<thead><tr><th>You write</th><th>It gives</th></tr></thead>
<tbody>
<tr><td><code>\\"</code></td><td>a quote inside the text</td></tr>
<tr><td><code>\\\\</code></td><td>a backslash (Windows paths: <code>"C:\\\\dev"</code>)</td></tr>
<tr><td><code>\\n</code></td><td>a line break</td></tr>
<tr><td><code>\\t</code></td><td>a tab</td></tr>
<tr><td><code>\\u00e9</code></td><td>Unicode character no. 00E9, i.e. “é”</td></tr>
</tbody>
</table>
<p>Accents can also be written directly (<code>"fermé"</code>): a JSON file is in <strong>UTF-8</strong>, the encoding that knows every alphabet.</p>
<div data-widget="json-lab-fix"></div>
<div data-widget="json-lab-escape"></div>

<h3>JSON is NOT JavaScript</h3>
<p>A JavaScript object written in code looks a lot like JSON, but it is more permissive:</p>
<div class="compare">
~~~js title="JavaScript object (accepted in code)"
const part = {
  name: 'carter',     // key without quotes, single quotes
  volume: 1250,
  closed: true,
  check() { return this.volume > 0; }, // a function
};                    // trailing comma allowed
~~~
~~~json title="JSON (file or message)"
{
  "name": "carter",
  "volume": 1250,
  "closed": true
}
~~~
</div>
<p>JSON is a strict <strong>subset</strong>: every valid JSON is a valid JavaScript object, but not the other way round.</p>`,
      },
      deep: {
        fr: `<h3>Le douanier très pointilleux</h3>
<div class="callout analogy"><p>Le programme qui lit le JSON (on l’appelle un <em>parseur</em>) est comme un douanier qui vérifie un formulaire. Il ne devine rien, il ne pardonne rien. Une case mal remplie, et tout le formulaire est renvoyé avec un message : « erreur ligne 4 ».</p></div>
<p>Pour passer la douane, il suffit de connaître <strong>quatre règles d’or</strong> :</p>
<ol>
<li><strong>Toutes les clés et tous les textes sont entre guillemets doubles</strong> <code>"…"</code>. Jamais d’apostrophe <code>'…'</code>.</li>
<li><strong>Une virgule ENTRE les éléments, jamais après le dernier.</strong> Comme dans une liste de courses dite à voix haute : « pommes, poires, et bananes » — on ne dit pas « bananes, » puis plus rien.</li>
<li><strong><code>true</code>, <code>false</code>, <code>null</code> en minuscules et sans guillemets.</strong></li>
<li><strong>Aucun commentaire.</strong> Si tu veux expliquer, ajoute une vraie clé, par exemple <code>"note": "volume en mm³"</code>.</li>
</ol>
<h3>Les poupées russes</h3>
<p>Accolades <code>{ }</code> = une fiche avec des cases nommées. Crochets <code>[ ]</code> = une pile de choses rangées dans l’ordre. On peut mettre des fiches dans une pile, et des piles dans une fiche :</p>
~~~text
{                          ← la fiche « pièce »
  "file": "support.step",
  "bodies": [              ← une pile de fiches « corps »
    { "name": "Body 1" },  ← fiche n° 0
    { "name": "Body 2" }   ← fiche n° 1 (pas de virgule après)
  ]
}                          ← chaque ouverture a sa fermeture
~~~
<div class="callout tip"><p>Astuce de contrôle : compte les ouvertures et les fermetures. Autant de <code>{</code> que de <code>}</code>, autant de <code>[</code> que de <code>]</code>. Un bon éditeur colore les paires de la même couleur.</p></div>
<h3>Le cas des caractères spéciaux</h3>
<p>Le guillemet sert à délimiter le texte. Alors comment écrire un texte qui <em>contient</em> un guillemet ? On le « protège » avec une barre oblique inverse : <code>"Il a dit \\"OK\\""</code>. Et comme la barre oblique inverse est elle-même spéciale, un chemin Windows s’écrit en la doublant : <code>"C:\\\\dev"</code>. Le parseur retire les barres de protection en lisant.</p>`,
        en: `<h3>The very fussy customs officer</h3>
<div class="callout analogy"><p>The program that reads JSON (called a <em>parser</em>) is like a customs officer checking a form. It guesses nothing, forgives nothing. One badly filled box and the whole form is sent back with a message: “error line 4”.</p></div>
<p>To get through customs, you only need <strong>four golden rules</strong>:</p>
<ol>
<li><strong>Every key and every text is between double quotes</strong> <code>"…"</code>. Never apostrophes <code>'…'</code>.</li>
<li><strong>A comma BETWEEN items, never after the last.</strong> Like a shopping list said aloud: “apples, pears, and bananas” — you don’t say “bananas,” and then nothing.</li>
<li><strong><code>true</code>, <code>false</code>, <code>null</code> in lower case and without quotes.</strong></li>
<li><strong>No comment.</strong> If you want to explain, add a real key, for instance <code>"note": "volume in mm³"</code>.</li>
</ol>
<h3>Russian dolls</h3>
<p>Braces <code>{ }</code> = a card with named boxes. Square brackets <code>[ ]</code> = a stack of things in order. You can put cards in a stack, and stacks in a card:</p>
~~~text
{                          ← the “part” card
  "file": "support.step",
  "bodies": [              ← a stack of “body” cards
    { "name": "Body 1" },  ← card no. 0
    { "name": "Body 2" }   ← card no. 1 (no comma after)
  ]
}                          ← every opening has its closing
~~~
<div class="callout tip"><p>Checking trick: count the openings and closings. As many <code>{</code> as <code>}</code>, as many <code>[</code> as <code>]</code>. A good editor colours matching pairs the same.</p></div>
<h3>Special characters</h3>
<p>The quote marks where the text starts and ends. So how do you write a text that <em>contains</em> a quote? You “protect” it with a backslash: <code>"He said \\"OK\\""</code>. And since the backslash is itself special, a Windows path is written by doubling it: <code>"C:\\\\dev"</code>. The parser removes the protecting backslashes as it reads.</p>`,
      },
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'json-3',
      title: { fr: 'Lire un vrai fichier JSON', en: 'Reading a real JSON file' },
      skills: ['json.files'],
      minutes: 13,
      body: {
        fr: `<h3>package.json, la carte d’identité du projet</h3>
<p>À la racine de 3D Reader, le fichier <span class="term" data-term="package-json">package.json</span> dit à Node.js et à npm tout ce qu’il faut savoir du projet :</p>
~~~json title="package.json (3D Reader)"
{
  "name": "3d-reader-web",               «1»
  "private": true,                       «2»
  "version": "0.2.0",                    «3»
  "type": "module",                      «4»
  "scripts": {                           «5»
    "build": "node scripts/build-web.mjs",
    "serve": "node scripts/serve.mjs",
    "test": "node --test tests/js/*.test.mjs"
  },
  "devDependencies": {                   «6»
    "opencascade.js": "2.0.0-beta.b5ff984",
    "playwright": "^1.56.1",
    "three": "0.180.0"
  },
  "engines": { "node": "24.x" }          «7»
}
~~~
<ol class="notes">
<li>Le nom du paquet.</li>
<li><code>true</code> : ce projet ne sera jamais publié sur le registre public npm.</li>
<li>La version en <span class="term" data-term="semver">semver</span> : MAJEUR.MINEUR.CORRECTIF. <code>0.2.0</code> → <code>0.3.0</code> pour une nouvelle fonction, <code>0.2.1</code> pour un correctif.</li>
<li>Les fichiers <code>.js</code> sont des modules ES (<code>import</code>/<code>export</code>).</li>
<li>Un objet de scripts : <code>npm run build</code> lance la commande associée à la clé <code>"build"</code> ; <code>npm test</code> lance <code>"test"</code>.</li>
<li>Les outils nécessaires au développement, avec leur version.</li>
<li>La version de Node attendue : n’importe quelle 24.</li>
</ol>
<h4>Les petits signes devant les versions</h4>
<ul>
<li><code>"0.180.0"</code> : exactement cette version.</li>
<li><code>"^1.56.1"</code> : 1.56.1 ou plus récente, <strong>tant que le premier chiffre reste 1</strong> (1.57.0 oui, 2.0.0 non).</li>
<li><code>"~1.56.1"</code> : seulement les correctifs (1.56.2 oui, 1.57.0 non).</li>
</ul>
<div data-widget="json-lab-package"></div>

<h3>package-lock.json : on ne touche pas</h3>
<p>Quand npm installe les dépendances, il note dans <span class="term" data-term="package-lock">package-lock.json</span> la version <em>exacte</em> de chaque paquet (et de leurs propres dépendances), avec une empreinte de sécurité :</p>
~~~json title="package-lock.json (extrait)"
"node_modules/fsevents": {
  "version": "2.3.2",
  "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.2.tgz",
  "integrity": "sha512-xiqMQR4x…",
  "optional": true
}
~~~
<p>Ce fichier fait des milliers de lignes et il est <strong>généré par npm</strong>. On le committe (pour que <code>npm ci</code> installe exactement la même chose sur la CI), mais on ne l’édite jamais à la main.</p>

<h3>vercel.json et devcontainer.json</h3>
~~~json title="vercel.json"
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "outputDirectory": "web",
  "functions": {
    "api/ai.js": { "maxDuration": 60 }
  }
}
~~~
<p>La clé <code>"$schema"</code> pointe vers la description officielle du format : l’éditeur s’en sert pour proposer les clés possibles et souligner les fautes. <code>"maxDuration": 60</code> : la fonction IA a 60 secondes maximum pour répondre.</p>
<div class="callout info"><p><code>.devcontainer/devcontainer.json</code> contient des commentaires <code>//</code>… alors que JSON les interdit ! C’est du <strong>JSONC</strong> (JSON with Comments), une variante tolérée par VS Code et quelques outils pour les fichiers de réglages. Ne le fais pas dans un JSON ordinaire : <code>JSON.parse</code> le refuserait.</p></div>

<h3>Retrouver une valeur : le chemin</h3>
<p>Pour désigner une valeur au fond d’un JSON, on écrit son <strong>chemin</strong> : les clés séparées par des points, les positions de tableau entre crochets (en partant de 0).</p>
~~~json
{ "summary": { "volume": 4300 }, "bodies": [ { "name": "Body 1", "volume": 4000 }, { "name": "Body 2", "volume": 300 } ] }
~~~
<ul>
<li><code>summary.volume</code> → 4300</li>
<li><code>bodies[0].name</code> → "Body 1"</li>
<li><code>bodies[1].volume</code> → 300</li>
</ul>
<div data-widget="json-lab-build"></div>`,
        en: `<h3>package.json, the project’s ID card</h3>
<p>At the root of 3D Reader, the <span class="term" data-term="package-json">package.json</span> file tells Node.js and npm everything they need to know about the project:</p>
~~~json title="package.json (3D Reader)"
{
  "name": "3d-reader-web",               «1»
  "private": true,                       «2»
  "version": "0.2.0",                    «3»
  "type": "module",                      «4»
  "scripts": {                           «5»
    "build": "node scripts/build-web.mjs",
    "serve": "node scripts/serve.mjs",
    "test": "node --test tests/js/*.test.mjs"
  },
  "devDependencies": {                   «6»
    "opencascade.js": "2.0.0-beta.b5ff984",
    "playwright": "^1.56.1",
    "three": "0.180.0"
  },
  "engines": { "node": "24.x" }          «7»
}
~~~
<ol class="notes">
<li>The package name.</li>
<li><code>true</code>: this project will never be published on the public npm registry.</li>
<li>The version in <span class="term" data-term="semver">semver</span>: MAJOR.MINOR.PATCH. <code>0.2.0</code> → <code>0.3.0</code> for a new feature, <code>0.2.1</code> for a fix.</li>
<li><code>.js</code> files are ES modules (<code>import</code>/<code>export</code>).</li>
<li>An object of scripts: <code>npm run build</code> runs the command under the <code>"build"</code> key; <code>npm test</code> runs <code>"test"</code>.</li>
<li>The tools needed for development, with their version.</li>
<li>The expected Node version: any 24.</li>
</ol>
<h4>The little signs in front of versions</h4>
<ul>
<li><code>"0.180.0"</code>: exactly this version.</li>
<li><code>"^1.56.1"</code>: 1.56.1 or newer, <strong>as long as the first number stays 1</strong> (1.57.0 yes, 2.0.0 no).</li>
<li><code>"~1.56.1"</code>: fixes only (1.56.2 yes, 1.57.0 no).</li>
</ul>
<div data-widget="json-lab-package"></div>

<h3>package-lock.json: hands off</h3>
<p>When npm installs the dependencies, it writes in <span class="term" data-term="package-lock">package-lock.json</span> the <em>exact</em> version of every package (and of their own dependencies), with a security fingerprint:</p>
~~~json title="package-lock.json (excerpt)"
"node_modules/fsevents": {
  "version": "2.3.2",
  "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.2.tgz",
  "integrity": "sha512-xiqMQR4x…",
  "optional": true
}
~~~
<p>This file is thousands of lines long and <strong>generated by npm</strong>. It is committed (so that <code>npm ci</code> installs exactly the same thing on the CI), but never edited by hand.</p>

<h3>vercel.json and devcontainer.json</h3>
~~~json title="vercel.json"
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "outputDirectory": "web",
  "functions": {
    "api/ai.js": { "maxDuration": 60 }
  }
}
~~~
<p>The <code>"$schema"</code> key points to the official description of the format: the editor uses it to suggest the possible keys and underline mistakes. <code>"maxDuration": 60</code>: the AI function has at most 60 seconds to answer.</p>
<div class="callout info"><p><code>.devcontainer/devcontainer.json</code> contains <code>//</code> comments… although JSON forbids them! It is <strong>JSONC</strong> (JSON with Comments), a variant VS Code and a few tools accept for settings files. Do not do it in ordinary JSON: <code>JSON.parse</code> would refuse it.</p></div>

<h3>Finding a value: the path</h3>
<p>To point at a value deep in a JSON, you write its <strong>path</strong>: keys separated by dots, array positions in square brackets (starting at 0).</p>
~~~json
{ "summary": { "volume": 4300 }, "bodies": [ { "name": "Body 1", "volume": 4000 }, { "name": "Body 2", "volume": 300 } ] }
~~~
<ul>
<li><code>summary.volume</code> → 4300</li>
<li><code>bodies[0].name</code> → "Body 1"</li>
<li><code>bodies[1].volume</code> → 300</li>
</ul>
<div data-widget="json-lab-build"></div>`,
      },
      deep: {
        fr: `<h3>Le bon de commande de l’atelier</h3>
<div class="callout analogy"><p>Un bon de commande a toujours les mêmes zones : en-tête (client, date, numéro), puis un tableau de lignes (référence, quantité), puis des conditions. Tu ne le lis pas mot à mot : tu vas droit à la zone qui t’intéresse. Un fichier JSON se lit pareil.</p></div>
<h3>Méthode en 3 étapes pour n’importe quel fichier JSON</h3>
<ol>
<li><strong>Regarde le premier niveau</strong> : les clés juste sous la première accolade. Dans <code>package.json</code> : <code>name</code>, <code>version</code>, <code>scripts</code>, <code>devDependencies</code>… C’est le sommaire.</li>
<li><strong>Repère les objets et les tableaux</strong> : une accolade ouvre une « sous-fiche » (<code>scripts</code>), un crochet ouvre une liste.</li>
<li><strong>Descends seulement là où tu as besoin</strong>. Tu cherches la commande de test ? <code>scripts</code> → <code>test</code>.</li>
</ol>
~~~text
package.json
├── name ............ "3d-reader-web"
├── version ......... "0.2.0"
├── scripts
│   ├── build ....... "node scripts/build-web.mjs"
│   └── test ........ "node --test tests/js/*.test.mjs"
└── devDependencies
    ├── playwright .. "^1.56.1"
    └── three ....... "0.180.0"
~~~
<p>C’est exactement ce que montre la vue « arbre » du labo JSON : le texte devient une arborescence, comme les dossiers de l’explorateur Windows.</p>
<h3>Le chemin = l’adresse dans l’arbre</h3>
<p><code>bodies[1].volume</code> se lit : « dans la pile <code>bodies</code>, prends la fiche numéro 1 (la deuxième, car on compte à partir de 0), puis sa case <code>volume</code> ». Comme une adresse : bâtiment, étage, bureau.</p>
<h3>Le lock, c’est le relevé du magasin</h3>
<p><code>package.json</code> dit « il me faut une perceuse de marque X, version 1.56 ou plus ». <code>package-lock.json</code> est le relevé du magasinier : « j’ai sorti la perceuse n° de série 1.56.1, avec ses 40 accessoires précis ». On ne réécrit pas le relevé à la main : on laisse npm le tenir à jour.</p>`,
        en: `<h3>The workshop purchase order</h3>
<div class="callout analogy"><p>A purchase order always has the same zones: a header (customer, date, number), then a table of lines (reference, quantity), then terms. You do not read it word by word: you go straight to the zone you need. A JSON file reads the same way.</p></div>
<h3>A 3-step method for any JSON file</h3>
<ol>
<li><strong>Look at the first level</strong>: the keys right under the first brace. In <code>package.json</code>: <code>name</code>, <code>version</code>, <code>scripts</code>, <code>devDependencies</code>… That is the table of contents.</li>
<li><strong>Spot the objects and arrays</strong>: a brace opens a “sub-card” (<code>scripts</code>), a square bracket opens a list.</li>
<li><strong>Only go down where you need to</strong>. Looking for the test command? <code>scripts</code> → <code>test</code>.</li>
</ol>
~~~text
package.json
├── name ............ "3d-reader-web"
├── version ......... "0.2.0"
├── scripts
│   ├── build ....... "node scripts/build-web.mjs"
│   └── test ........ "node --test tests/js/*.test.mjs"
└── devDependencies
    ├── playwright .. "^1.56.1"
    └── three ....... "0.180.0"
~~~
<p>That is exactly what the “tree” view of the JSON lab shows: the text becomes a tree, like the folders of Windows Explorer.</p>
<h3>The path = the address in the tree</h3>
<p><code>bodies[1].volume</code> reads: “in the <code>bodies</code> stack, take card number 1 (the second, since we count from 0), then its <code>volume</code> box”. Like an address: building, floor, office.</p>
<h3>The lock file is the storekeeper’s record</h3>
<p><code>package.json</code> says “I need a brand X drill, version 1.56 or later”. <code>package-lock.json</code> is the storekeeper’s record: “I handed out drill serial no. 1.56.1, with its 40 exact accessories”. You do not rewrite the record by hand: you let npm keep it up to date.</p>`,
      },
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'json-4',
      title: { fr: 'JSON dans le code : parse et stringify', en: 'JSON in code: parse and stringify' },
      skills: ['json.code'],
      minutes: 13,
      body: {
        fr: `<p>Dans un programme, JSON n’existe que sous forme de <strong>texte</strong>. Pour s’en servir, il faut le transformer en objet, et inversement. Deux fonctions font tout le travail en JavaScript.</p>
<h3>JSON.parse : du texte vers l’objet</h3>
~~~js run
const texte = '{"file": "carter.step", "volume": 152000, "bodies": ["Body 1", "Body 2"]}';
const resultat = JSON.parse(texte);          // texte → objet
console.log(typeof texte, typeof resultat);  // string object
console.log(resultat.volume / 1000, 'cm³');
console.log(resultat.bodies.length, 'corps');
~~~
<h3>JSON.stringify : de l’objet vers le texte</h3>
~~~js run
const piece = { name: 'carter', volume: 1250, closed: true, tags: ['alu', 'coquille'] };
console.log(JSON.stringify(piece));            // tout sur une ligne
console.log(JSON.stringify(piece, null, 2));   // indenté de 2 espaces, lisible
console.log(JSON.stringify(piece, ['name', 'volume'])); // seulement ces clés
~~~
<p>Le deuxième argument (le <em>replacer</em>) filtre ou transforme les valeurs ; le troisième règle l’indentation. 3D Reader écrit par exemple ses fichiers d’historique avec <code>JSON.stringify(…, null, 1)</code>.</p>
<div class="callout warn"><p><code>JSON.stringify</code> ne sait pas tout écrire : les fonctions et <code>undefined</code> disparaissent, <code>NaN</code> et <code>Infinity</code> deviennent <code>null</code>, une date devient un texte. Teste ci-dessous.</p></div>
~~~js run
console.log(JSON.stringify({ a: undefined, b: () => 1, c: NaN, d: new Date(0) }));
~~~

<h3>Quand le texte est mal formé</h3>
<p>Si le texte n’est pas du JSON valide, <code>JSON.parse</code> lance une erreur <code>SyntaxError</code>. Un programme sérieux l’attrape avec <code>try / catch</code> :</p>
~~~js run
function lireReglages(texte) {
  try {
    return JSON.parse(texte);
  } catch (err) {
    console.log('Fichier illisible :', err.message);
    return {};                         // valeurs par défaut
  }
}
console.log(lireReglages('{"theme": "dark"}'));
console.log(lireReglages("{'theme': 'dark'}"));
~~~

<h3>Dans 3D Reader</h3>
<p>Le stockage du navigateur <span class="term" data-term="localstorage">localStorage</span> ne garde que du texte. Pour y ranger un objet, on le passe par <code>JSON.stringify</code>, et on le relit avec <code>JSON.parse</code> :</p>
~~~js title="web/ai-workspace.js (simplifié)"
const kept = JSON.parse(store.get(localStorage, KEYS.tokens) || "null"); «1»
store.set(localStorage, KEYS.tokens, JSON.stringify({ questions, all }));  «2»
~~~
<ol class="notes">
<li>On relit le texte rangé ; s’il n’y a rien, on lit <code>"null"</code>, qui donne <code>null</code>.</li>
<li>On range l’objet sous forme de texte JSON.</li>
</ol>
<p>Et quand la page parle à un serveur, la réponse HTTP arrive en texte : <code>response.json()</code> la lit et la transforme en objet (c’est un <code>JSON.parse</code> asynchrone) :</p>
~~~js title="web/ai-workspace.js"
const data = await response.json().catch(() => ({}));
~~~

<h3>Les mêmes outils ailleurs</h3>
<div class="compare">
~~~py title="Python"
import json
data = json.loads(texte)          # texte -> dict
texte = json.dumps(data, indent=2)
with open("r.json") as f:
    data = json.load(f)           # fichier -> dict
~~~
~~~cpp title="C++ (nlohmann::json)"
#include <nlohmann/json.hpp>
auto data = nlohmann::json::parse(texte);
double v = data["volume"];
std::string s = data.dump(2);
~~~
~~~ps title="PowerShell"
$data = Get-Content r.json | ConvertFrom-Json
$data.volume
$data | ConvertTo-Json -Depth 5
~~~
</div>
<p>En Python, un objet JSON devient un <code>dict</code>, un tableau une <code>list</code>, <code>null</code> devient <code>None</code>, <code>true</code> devient <code>True</code>.</p>`,
        en: `<p>Inside a program, JSON only exists as <strong>text</strong>. To use it you turn it into an object, and back. Two functions do all the work in JavaScript.</p>
<h3>JSON.parse: from text to object</h3>
~~~js run
const text = '{"file": "carter.step", "volume": 152000, "bodies": ["Body 1", "Body 2"]}';
const result = JSON.parse(text);           // text → object
console.log(typeof text, typeof result);   // string object
console.log(result.volume / 1000, 'cm³');
console.log(result.bodies.length, 'bodies');
~~~
<h3>JSON.stringify: from object to text</h3>
~~~js run
const part = { name: 'carter', volume: 1250, closed: true, tags: ['alu', 'die'] };
console.log(JSON.stringify(part));            // all on one line
console.log(JSON.stringify(part, null, 2));   // indented by 2 spaces, readable
console.log(JSON.stringify(part, ['name', 'volume'])); // only these keys
~~~
<p>The second argument (the <em>replacer</em>) filters or transforms values; the third sets the indentation. 3D Reader for instance writes its history files with <code>JSON.stringify(…, null, 1)</code>.</p>
<div class="callout warn"><p><code>JSON.stringify</code> cannot write everything: functions and <code>undefined</code> vanish, <code>NaN</code> and <code>Infinity</code> become <code>null</code>, a date becomes a text. Try it below.</p></div>
~~~js run
console.log(JSON.stringify({ a: undefined, b: () => 1, c: NaN, d: new Date(0) }));
~~~

<h3>When the text is malformed</h3>
<p>If the text is not valid JSON, <code>JSON.parse</code> throws a <code>SyntaxError</code>. A serious program catches it with <code>try / catch</code>:</p>
~~~js run
function readSettings(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log('Unreadable file:', err.message);
    return {};                         // default values
  }
}
console.log(readSettings('{"theme": "dark"}'));
console.log(readSettings("{'theme': 'dark'}"));
~~~

<h3>In 3D Reader</h3>
<p>The browser storage <span class="term" data-term="localstorage">localStorage</span> only keeps text. To store an object you pass it through <code>JSON.stringify</code>, and read it back with <code>JSON.parse</code>:</p>
~~~js title="web/ai-workspace.js (simplified)"
const kept = JSON.parse(store.get(localStorage, KEYS.tokens) || "null"); «1»
store.set(localStorage, KEYS.tokens, JSON.stringify({ questions, all }));  «2»
~~~
<ol class="notes">
<li>Read the stored text back; if there is nothing, read <code>"null"</code>, which gives <code>null</code>.</li>
<li>Store the object as JSON text.</li>
</ol>
<p>And when the page talks to a server, the HTTP answer arrives as text: <code>response.json()</code> reads it and turns it into an object (an asynchronous <code>JSON.parse</code>):</p>
~~~js title="web/ai-workspace.js"
const data = await response.json().catch(() => ({}));
~~~

<h3>The same tools elsewhere</h3>
<div class="compare">
~~~py title="Python"
import json
data = json.loads(text)           # text -> dict
text = json.dumps(data, indent=2)
with open("r.json") as f:
    data = json.load(f)           # file -> dict
~~~
~~~cpp title="C++ (nlohmann::json)"
#include <nlohmann/json.hpp>
auto data = nlohmann::json::parse(text);
double v = data["volume"];
std::string s = data.dump(2);
~~~
~~~ps title="PowerShell"
$data = Get-Content r.json | ConvertFrom-Json
$data.volume
$data | ConvertTo-Json -Depth 5
~~~
</div>
<p>In Python a JSON object becomes a <code>dict</code>, an array a <code>list</code>, <code>null</code> becomes <code>None</code>, <code>true</code> becomes <code>True</code>.</p>`,
      },
      deep: {
        fr: `<h3>Mettre en carton, déballer</h3>
<div class="callout analogy"><p>Un objet dans la mémoire du programme, c’est une pièce montée sur l’établi : on peut la manipuler, mesurer, modifier. Pour l’expédier, il faut la <strong>mettre en carton</strong> (stringify) : elle devient un colis plat, du texte. À l’arrivée, on <strong>déballe</strong> (parse) et on retrouve la pièce montée.</p></div>
~~~text
     établi (objet)                 colis (texte)
 { name: 'carter', ... }  ──stringify──►  '{"name":"carter",...}'
                          ◄───parse─────
~~~
<p>Le mot à retenir : <strong>parse = lire</strong> (texte → objet), <strong>stringify = écrire</strong> (objet → texte).</p>
<h3>Pourquoi le colis ne peut pas tout contenir</h3>
<p>Le carton n’accepte que des choses « inertes » : nombres, textes, oui/non, listes, fiches. Une fonction, c’est une machine en marche : elle ne rentre pas dans le carton, elle disparaît. Un <code>NaN</code> (« pas un nombre ») n’a pas de case prévue : il devient <code>null</code>.</p>
<h3>Le déballage qui rate</h3>
<p>Si le colis est abîmé (texte mal formé), <code>JSON.parse</code> ne bricole pas : il refuse et crie une erreur. Sans protection, cette erreur arrête tout le programme. Avec <code>try / catch</code>, on dit : « essaie de déballer ; si ça rate, prends des réglages par défaut et continue ». C’est pour ça que 3D Reader écrit <code>response.json().catch(() =&gt; ({}))</code> : si la réponse du serveur n’est pas du JSON, on part d’un objet vide au lieu de planter.</p>
<h3>L’erreur classique du débutant</h3>
~~~js run
const texte = '{"volume": 1250}';
console.log(texte.volume);              // undefined : c'est encore du texte !
console.log(JSON.parse(texte).volume);  // 1250 : déballé
~~~`,
        en: `<h3>Packing and unpacking</h3>
<div class="callout analogy"><p>An object in the program’s memory is a part mounted on the bench: you can handle, measure and change it. To ship it, you must <strong>pack it in a box</strong> (stringify): it becomes a flat parcel, text. On arrival you <strong>unpack</strong> it (parse) and get the mounted part back.</p></div>
~~~text
     bench (object)                 parcel (text)
 { name: 'carter', ... }  ──stringify──►  '{"name":"carter",...}'
                          ◄───parse─────
~~~
<p>The words to remember: <strong>parse = read</strong> (text → object), <strong>stringify = write</strong> (object → text).</p>
<h3>Why the box cannot hold everything</h3>
<p>The box only takes “inert” things: numbers, texts, yes/no, lists, cards. A function is a running machine: it does not fit in the box, it disappears. A <code>NaN</code> (“not a number”) has no slot: it becomes <code>null</code>.</p>
<h3>Unpacking that fails</h3>
<p>If the parcel is damaged (malformed text), <code>JSON.parse</code> does not patch it up: it refuses and shouts an error. Without protection that error stops the whole program. With <code>try / catch</code> you say: “try to unpack; if it fails, take default settings and carry on”. That is why 3D Reader writes <code>response.json().catch(() =&gt; ({}))</code>: if the server’s answer is not JSON, start from an empty object instead of crashing.</p>
<h3>The classic beginner mistake</h3>
~~~js run
const text = '{"volume": 1250}';
console.log(text.volume);              // undefined: it is still text!
console.log(JSON.parse(text).volume);  // 1250: unpacked
~~~`,
      },
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'json-5',
      title: { fr: 'Décrire et vérifier : contrats et JSON Schema', en: 'Describe and check: contracts and JSON Schema' },
      skills: ['json.schema'],
      minutes: 12,
      body: {
        fr: `<h3>Le contrat de résultat</h3>
<p>Le moteur Python, le moteur JavaScript, la page, les tests : tout le monde doit être d’accord sur la <strong>forme</strong> du JSON de résultat. 3D Reader l’écrit noir sur blanc dans sa spécification, le « contrat de résultat » :</p>
~~~js title="SPEC.md (extrait simplifié)"
result = {
  file: "name.step", kind: "cad" | "mesh",
  units: { length: "mm", area: "mm2", volume: "mm3" },
  summary: { volume: number|null, area: number, bodies: int, ... },
  bodies: [{ name: string, volume: number|null, closed: bool, ... }],
  elapsed_s: number,
}
~~~
<p>Ce n’est pas du JSON (c’est une description), mais ça dit tout : quelles clés existent, quel type de valeur, ce qui peut être <code>null</code>. Si un moteur renvoie <code>"volume": "152000"</code> (un texte au lieu d’un nombre), le contrat est rompu et un test le signale.</p>

<h3>JSON Schema : le contrat écrit… en JSON</h3>
<p><span class="term" data-term="json-schema">JSON Schema</span> est une façon standard de décrire la forme attendue d’un JSON, que des programmes savent vérifier automatiquement. Les mots-clés principaux :</p>
<table>
<thead><tr><th>Mot-clé</th><th>Sens</th></tr></thead>
<tbody>
<tr><td><code>type</code></td><td>la sorte de valeur : <code>"object"</code>, <code>"array"</code>, <code>"string"</code>, <code>"number"</code>, <code>"boolean"</code>, <code>"null"</code></td></tr>
<tr><td><code>properties</code></td><td>pour un objet : le schéma de chaque clé</td></tr>
<tr><td><code>required</code></td><td>les clés obligatoires</td></tr>
<tr><td><code>items</code></td><td>pour un tableau : le schéma de chaque élément</td></tr>
<tr><td><code>enum</code></td><td>la liste fermée des valeurs permises</td></tr>
<tr><td><code>additionalProperties: false</code></td><td>aucune autre clé n’est permise</td></tr>
<tr><td><code>anyOf</code></td><td>« l’un de ces schémas » (par exemple un objet OU <code>null</code>)</td></tr>
</tbody>
</table>

<h3>Le schéma imposé à l’IA dans api/ai.js</h3>
~~~js title="api/ai.js (CYCLE_SCHEMA, extrait)"
export const CYCLE_SCHEMA = {
  type: "object",                                         «1»
  properties: {
    estimation_s: { type: "number" },                     «2»
    fourchette_s: { type: "array", items: { type: "number" } }, «3»
    confiance: { type: "string", enum: ["faible", "moyenne", "haute"] }, «4»
    hypotheses: { type: "array", items: { type: "string" } },
  },
  required: ["estimation_s", "fourchette_s", "confiance", "hypotheses"], «5»
  additionalProperties: false,                            «6»
};
~~~
<ol class="notes">
<li>La réponse doit être un objet.</li>
<li>Une estimation en secondes : un nombre.</li>
<li>Une fourchette : un tableau de nombres (min, max).</li>
<li>La confiance : un texte parmi trois valeurs seulement.</li>
<li>Ces clés sont obligatoires.</li>
<li>L’IA n’a pas le droit d’inventer d’autres clés.</li>
</ol>
<p>Une réponse conforme ressemble à ceci (valeurs fictives) :</p>
~~~json
{
  "estimation_s": 95,
  "fourchette_s": [80, 110],
  "confiance": "moyenne",
  "hypotheses": ["valeurs de démonstration"]
}
~~~
<div class="callout project"><p>Pourquoi imposer un schéma à une IA ? Parce qu’un modèle de langage écrit du texte libre : il pourrait répondre « environ une minute et demie ». La page, elle, a besoin d’un nombre dans une case précise pour l’afficher et le comparer. Le schéma transforme une réponse floue en données exploitables, et la page vérifie la réponse avec le même schéma avant de s’en servir. Et même conforme, une estimation n’entre dans un devis qu’une fois adoptée par une personne.</p></div>

<h3>Valider</h3>
<p>Valider, c’est passer un JSON au « gabarit » du schéma : chaque clé obligatoire est-elle là ? chaque valeur du bon type ? Les éditeurs le font en direct (la clé <code>"$schema"</code> de <code>vercel.json</code>), les programmes avec une bibliothèque de validation, et les tests de 3D Reader comparent les résultats au contrat.</p>`,
        en: `<h3>The result contract</h3>
<p>The Python engine, the JavaScript engine, the page, the tests: everyone must agree on the <strong>shape</strong> of the result JSON. 3D Reader writes it down in its specification, the “result contract”:</p>
~~~js title="SPEC.md (simplified excerpt)"
result = {
  file: "name.step", kind: "cad" | "mesh",
  units: { length: "mm", area: "mm2", volume: "mm3" },
  summary: { volume: number|null, area: number, bodies: int, ... },
  bodies: [{ name: string, volume: number|null, closed: bool, ... }],
  elapsed_s: number,
}
~~~
<p>It is not JSON (it is a description), but it says everything: which keys exist, which type of value, what may be <code>null</code>. If an engine returns <code>"volume": "152000"</code> (a text instead of a number), the contract is broken and a test flags it.</p>

<h3>JSON Schema: the contract written… in JSON</h3>
<p><span class="term" data-term="json-schema">JSON Schema</span> is a standard way to describe the expected shape of a JSON, which programs can check automatically. The main keywords:</p>
<table>
<thead><tr><th>Keyword</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>type</code></td><td>the kind of value: <code>"object"</code>, <code>"array"</code>, <code>"string"</code>, <code>"number"</code>, <code>"boolean"</code>, <code>"null"</code></td></tr>
<tr><td><code>properties</code></td><td>for an object: the schema of each key</td></tr>
<tr><td><code>required</code></td><td>the mandatory keys</td></tr>
<tr><td><code>items</code></td><td>for an array: the schema of each item</td></tr>
<tr><td><code>enum</code></td><td>the closed list of allowed values</td></tr>
<tr><td><code>additionalProperties: false</code></td><td>no other key is allowed</td></tr>
<tr><td><code>anyOf</code></td><td>“one of these schemas” (for instance an object OR <code>null</code>)</td></tr>
</tbody>
</table>

<h3>The schema imposed on the AI in api/ai.js</h3>
~~~js title="api/ai.js (CYCLE_SCHEMA, excerpt)"
export const CYCLE_SCHEMA = {
  type: "object",                                         «1»
  properties: {
    estimation_s: { type: "number" },                     «2»
    fourchette_s: { type: "array", items: { type: "number" } }, «3»
    confiance: { type: "string", enum: ["faible", "moyenne", "haute"] }, «4»
    hypotheses: { type: "array", items: { type: "string" } },
  },
  required: ["estimation_s", "fourchette_s", "confiance", "hypotheses"], «5»
  additionalProperties: false,                            «6»
};
~~~
<ol class="notes">
<li>The answer must be an object.</li>
<li>An estimate in seconds: a number.</li>
<li>A range: an array of numbers (min, max).</li>
<li>The confidence: a text among three values only (low, medium, high in French).</li>
<li>These keys are mandatory.</li>
<li>The AI may not invent other keys.</li>
</ol>
<p>A conforming answer looks like this (made-up values):</p>
~~~json
{
  "estimation_s": 95,
  "fourchette_s": [80, 110],
  "confiance": "moyenne",
  "hypotheses": ["demo values"]
}
~~~
<div class="callout project"><p>Why impose a schema on an AI? Because a language model writes free text: it might answer “about a minute and a half”. The page needs a number in a precise box to show and compare it. The schema turns a vague answer into usable data, and the page checks the answer against the same schema before using it. And even when it conforms, an estimate only enters a quote once a person adopts it.</p></div>

<h3>Validating</h3>
<p>Validating means passing a JSON through the schema’s “gauge”: is every mandatory key there? every value of the right type? Editors do it live (the <code>"$schema"</code> key of <code>vercel.json</code>), programs with a validation library, and 3D Reader’s tests compare results with the contract.</p>`,
      },
      deep: {
        fr: `<h3>Le calibre de contrôle</h3>
<div class="callout analogy"><p>À la sortie du moule, une pièce passe dans un calibre « entre / n’entre pas ». Le calibre ne dit pas comment fabriquer la pièce : il dit seulement si elle est <strong>conforme</strong>. Un JSON Schema est le calibre d’un fichier JSON.</p></div>
<p>Pour chaque case de la fiche, le schéma répond à trois questions :</p>
<ol>
<li><strong>Est-elle obligatoire ?</strong> (<code>required</code>)</li>
<li><strong>Quelle sorte de valeur ?</strong> (<code>type</code> : nombre, texte, liste…)</li>
<li><strong>Quelles valeurs sont permises ?</strong> (<code>enum</code> : une liste fermée, comme un menu déroulant)</li>
</ol>
~~~text
 Schéma (le calibre)              Réponse reçue          Verdict
 estimation_s : nombre, oblig.    "estimation_s": 95     ✔
 confiance : faible|moyenne|haute "confiance": "top"     ✘ pas dans la liste
 fourchette_s : liste de nombres  (absente)              ✘ obligatoire
 rien d'autre permis              "blague": "..."        ✘ clé en trop
~~~
<h3>Pourquoi c’est précieux avec une IA</h3>
<p>Demander quelque chose à une IA, c’est comme demander à un sous-traitant très bavard. Sans cahier des charges, il répond par un long paragraphe. Avec un formulaire à remplir (le schéma), il doit mettre un nombre dans la case « secondes » et choisir « faible », « moyenne » ou « haute » pour la confiance. La page peut alors lire la réponse sans deviner.</p>
<div class="callout tip"><p>Un schéma ne garantit pas que la valeur est <em>juste</em>, seulement qu’elle a la <em>bonne forme</em>. Une estimation bien formée peut être fausse : c’est pour ça qu’une personne valide toujours avant qu’un chiffre de l’IA serve.</p></div>`,
        en: `<h3>The inspection gauge</h3>
<div class="callout analogy"><p>Out of the die, a part goes through a “go / no-go” gauge. The gauge does not say how to make the part: it only says whether it <strong>conforms</strong>. A JSON Schema is the gauge of a JSON file.</p></div>
<p>For each box of the card, the schema answers three questions:</p>
<ol>
<li><strong>Is it mandatory?</strong> (<code>required</code>)</li>
<li><strong>What kind of value?</strong> (<code>type</code>: number, text, list…)</li>
<li><strong>Which values are allowed?</strong> (<code>enum</code>: a closed list, like a drop-down menu)</li>
</ol>
~~~text
 Schema (the gauge)               Answer received        Verdict
 estimation_s: number, mandatory  "estimation_s": 95     ✔
 confiance: faible|moyenne|haute  "confiance": "top"     ✘ not in the list
 fourchette_s: list of numbers    (missing)              ✘ mandatory
 nothing else allowed             "joke": "..."          ✘ extra key
~~~
<h3>Why it is precious with an AI</h3>
<p>Asking an AI something is like asking a very talkative subcontractor. Without specifications, it answers with a long paragraph. With a form to fill in (the schema), it must put a number in the “seconds” box and choose “low”, “medium” or “high” for the confidence. The page can then read the answer without guessing.</p>
<div class="callout tip"><p>A schema does not guarantee the value is <em>right</em>, only that it has the <em>right shape</em>. A well-formed estimate can be wrong: that is why a person always validates before an AI figure is used.</p></div>`,
      },
    },

    // ------------------------------------------------------------------ 6
    {
      id: 'json-6',
      title: { fr: 'Bonnes pratiques et pièges', en: 'Good practice and pitfalls' },
      skills: ['json.practice'],
      minutes: 11,
      body: {
        fr: `<h3>Éditer un JSON confortablement</h3>
<ul>
<li><strong>VS Code</strong> colore le JSON, souligne en rouge les fautes (virgule en trop, guillemet manquant) et les liste dans l’onglet « Problèmes ».</li>
<li><kbd>Maj</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> (Windows) remet en forme tout le fichier : indentation propre, une clé par ligne.</li>
<li>Avec une clé <code>"$schema"</code> (comme <code>vercel.json</code>), VS Code propose les clés possibles en tapant <kbd>Ctrl</kbd>+<kbd>Espace</kbd>.</li>
<li>Le navigateur affiche joliment un JSON ouvert directement (essaie une URL d’API) et l’onglet Réseau des outils F12 montre les réponses JSON en arbre.</li>
</ul>

<h3>En ligne de commande</h3>
<div class="compare">
~~~ps title="PowerShell"
$p = Get-Content package.json -Raw | ConvertFrom-Json
$p.version
$p.scripts.test
~~~
~~~bash title="bash + jq"
jq '.version' package.json
jq '.scripts | keys' package.json
jq '.bodies[0].volume' resultat.json
~~~
</div>
<p><code>jq</code> est un petit outil très répandu sous Linux pour interroger un JSON avec un chemin, exactement comme <code>bodies[0].volume</code>.</p>

<h3>Les pièges à connaître</h3>
<table>
<thead><tr><th>Piège</th><th>Bonne pratique</th></tr></thead>
<tbody>
<tr><td>Les dates n’existent pas en JSON</td><td>les écrire en texte au format <strong>ISO 8601</strong> : <code>"2026-10-21T09:30:00Z"</code> (triable, sans ambiguïté jour/mois)</td></tr>
<tr><td>Les nombres décimaux sont des flottants</td><td><code>0.1 + 0.2</code> donne <code>0.30000000000000004</code> ; arrondir à l’affichage, comparer avec une tolérance</td></tr>
<tr><td>Les unités ne sont pas dans le nombre</td><td>les dire dans la clé ou à côté : <code>"volume_mm3"</code> ou <code>"units": { "volume": "mm3" }</code> comme 3D Reader</td></tr>
<tr><td>Les très gros fichiers</td><td>un JSON se lit en entier en mémoire ; pour des millions de lignes, préférer <strong>JSON Lines</strong> (un objet JSON par ligne) ou un format binaire</td></tr>
<tr><td>Les secrets</td><td>jamais de clé d’API, mot de passe ou code d’accès dans un JSON committé : les mettre dans des variables d’environnement</td></tr>
<tr><td>Les données confidentielles</td><td>un fichier de résultats ou de reprise de session peut contenir des données de l’entreprise : ne pas le committer, ne pas le publier</td></tr>
</tbody>
</table>

<h3>JSON Lines</h3>
~~~text
{"file": "a.step", "volume": 1200}
{"file": "b.step", "volume": 3400}
{"file": "c.step", "volume": 560}
~~~
<p>Chaque ligne est un JSON complet : on peut ajouter une ligne à la fin sans relire tout le fichier, et en lire une seule. Pratique pour des journaux (logs) ou des historiques.</p>

<h3>Un JSON dans Git</h3>
<p>Comme c’est du texte, <code>git diff</code> montre exactement ce qui a changé :</p>
~~~diff
   "name": "3d-reader-web",
-  "version": "0.2.0",
+  "version": "0.3.0",
   "type": "module",
~~~
<div class="callout tip"><p>Garde une clé par ligne et une indentation stable : les diffs restent courts et lisibles. Un JSON écrit sur une seule ligne géante donne un diff illisible (toute la ligne change).</p></div>
<div class="callout warn"><p>Avant de committer un JSON, demande-toi : contient-il un secret ? des données réelles de l’entreprise ? Si oui, il va dans <code>.gitignore</code>, pas dans le dépôt.</p></div>`,
        en: `<h3>Editing JSON comfortably</h3>
<ul>
<li><strong>VS Code</strong> colours JSON, underlines mistakes in red (extra comma, missing quote) and lists them in the “Problems” tab.</li>
<li><kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> (Windows) reformats the whole file: clean indentation, one key per line.</li>
<li>With a <code>"$schema"</code> key (like <code>vercel.json</code>), VS Code suggests the possible keys when you press <kbd>Ctrl</kbd>+<kbd>Space</kbd>.</li>
<li>The browser nicely displays a JSON opened directly (try an API URL) and the Network tab of the F12 tools shows JSON answers as a tree.</li>
</ul>

<h3>On the command line</h3>
<div class="compare">
~~~ps title="PowerShell"
$p = Get-Content package.json -Raw | ConvertFrom-Json
$p.version
$p.scripts.test
~~~
~~~bash title="bash + jq"
jq '.version' package.json
jq '.scripts | keys' package.json
jq '.bodies[0].volume' result.json
~~~
</div>
<p><code>jq</code> is a small, very common Linux tool to query a JSON with a path, just like <code>bodies[0].volume</code>.</p>

<h3>Pitfalls to know</h3>
<table>
<thead><tr><th>Pitfall</th><th>Good practice</th></tr></thead>
<tbody>
<tr><td>Dates do not exist in JSON</td><td>write them as text in <strong>ISO 8601</strong> format: <code>"2026-10-21T09:30:00Z"</code> (sortable, no day/month ambiguity)</td></tr>
<tr><td>Decimal numbers are floats</td><td><code>0.1 + 0.2</code> gives <code>0.30000000000000004</code>; round when displaying, compare with a tolerance</td></tr>
<tr><td>Units are not in the number</td><td>state them in the key or next to it: <code>"volume_mm3"</code> or <code>"units": { "volume": "mm3" }</code> like 3D Reader</td></tr>
<tr><td>Very large files</td><td>a JSON is read whole into memory; for millions of lines prefer <strong>JSON Lines</strong> (one JSON object per line) or a binary format</td></tr>
<tr><td>Secrets</td><td>never an API key, password or access code in a committed JSON: put them in environment variables</td></tr>
<tr><td>Confidential data</td><td>a results or session handoff file may contain company data: do not commit it, do not publish it</td></tr>
</tbody>
</table>

<h3>JSON Lines</h3>
~~~text
{"file": "a.step", "volume": 1200}
{"file": "b.step", "volume": 3400}
{"file": "c.step", "volume": 560}
~~~
<p>Each line is a complete JSON: you can append a line without rereading the whole file, and read just one. Handy for logs or histories.</p>

<h3>JSON in Git</h3>
<p>Since it is text, <code>git diff</code> shows exactly what changed:</p>
~~~diff
   "name": "3d-reader-web",
-  "version": "0.2.0",
+  "version": "0.3.0",
   "type": "module",
~~~
<div class="callout tip"><p>Keep one key per line and stable indentation: diffs stay short and readable. A JSON written on one giant line gives an unreadable diff (the whole line changes).</p></div>
<div class="callout warn"><p>Before committing a JSON, ask yourself: does it contain a secret? real company data? If so, it goes in <code>.gitignore</code>, not in the repository.</p></div>`,
      },
      deep: {
        fr: `<h3>La fiche de suivi bien tenue</h3>
<div class="callout analogy"><p>Une fiche de suivi de production est utile si tout le monde la remplit pareil : dates au même format, unités indiquées, une ligne par opération. Un JSON, c’est pareil : il sera relu par d’autres (humains ou programmes) qui n’étaient pas là quand tu l’as écrit.</p></div>
<h3>Cinq réflexes</h3>
<ol>
<li><strong>Formater avant de lire</strong> : un JSON tassé sur une ligne est illisible. Dans VS Code : <kbd>Maj</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>.</li>
<li><strong>Écrire les dates comme 2026-10-21</strong> (année-mois-jour) : pas de confusion entre le 10 novembre et le 11 octobre, et le tri alphabétique est aussi le tri chronologique.</li>
<li><strong>Dire l’unité</strong> : <code>1250</code> tout seul, c’est des mm³ ? des cm³ ? des grammes ? Mets-la dans le nom de la clé.</li>
<li><strong>Ne pas comparer des décimaux au millième près</strong> : l’ordinateur stocke 0,1 de façon approchée, comme 1/3 qu’on écrit 0,333…</li>
<li><strong>Jamais de secret dedans</strong> : un fichier JSON se copie, s’envoie, se committe en deux secondes. Une clé d’API qui s’y trouve finit tôt ou tard en public.</li>
</ol>
<h3>Le fichier trop gros</h3>
<p>Lire un énorme JSON, c’est comme devoir déballer un conteneur entier pour prendre une seule boîte. JSON Lines range chaque boîte sur sa propre étagère (une ligne) : on prend celle qu’on veut, on en ajoute une au bout sans tout déplacer.</p>
~~~js run
const lignes = '{"file":"a.step","volume":1200}\\n{"file":"b.step","volume":3400}';
const pieces = lignes.split('\\n').map((l) => JSON.parse(l));
console.log(pieces.length, 'pièces, total', pieces.reduce((s, p) => s + p.volume, 0));
console.log(0.1 + 0.2, '→ arrondi :', (0.1 + 0.2).toFixed(2));
~~~`,
        en: `<h3>A well-kept tracking sheet</h3>
<div class="callout analogy"><p>A production tracking sheet is useful if everyone fills it in the same way: dates in the same format, units stated, one line per operation. JSON is the same: it will be read by others (people or programs) who were not there when you wrote it.</p></div>
<h3>Five reflexes</h3>
<ol>
<li><strong>Format before reading</strong>: a JSON squashed on one line is unreadable. In VS Code: <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>.</li>
<li><strong>Write dates as 2026-10-21</strong> (year-month-day): no confusion between 10 November and 11 October, and alphabetical order is also chronological order.</li>
<li><strong>State the unit</strong>: <code>1250</code> alone — mm³? cm³? grams? Put it in the key name.</li>
<li><strong>Do not compare decimals to the thousandth</strong>: the computer stores 0.1 approximately, like 1/3 written 0.333…</li>
<li><strong>Never a secret inside</strong>: a JSON file is copied, sent, committed in two seconds. An API key in it ends up public sooner or later.</li>
</ol>
<h3>The file that is too big</h3>
<p>Reading a huge JSON is like unpacking a whole container to take one box. JSON Lines puts each box on its own shelf (one line): you take the one you want, you add one at the end without moving everything.</p>
~~~js run
const lines = '{"file":"a.step","volume":1200}\\n{"file":"b.step","volume":3400}';
const parts = lines.split('\\n').map((l) => JSON.parse(l));
console.log(parts.length, 'parts, total', parts.reduce((s, p) => s + p.volume, 0));
console.log(0.1 + 0.2, '→ rounded:', (0.1 + 0.2).toFixed(2));
~~~`,
      },
    },
  ],

  questions: [
    // ------------------------------------------------------------------ json-1 (purpose)
    {
      id: 'json-q1', skill: 'json.purpose', lesson: 'json-1', level: 1, type: 'mcq',
      prompt: { fr: 'Qu’est-ce que JSON ?', en: 'What is JSON?' },
      choices: {
        fr: ['Un format texte pour écrire et échanger des données', 'Un langage de programmation avec des boucles', 'Un logiciel de Microsoft', 'Un format d’image 3D'],
        en: ['A text format to write and exchange data', 'A programming language with loops', 'A Microsoft program', 'A 3D image format'],
      },
      answer: 0,
      explain: { fr: 'JSON ne contient que des données (pas de boucle ni de fonction), écrites en texte lisible par un humain et une machine.', en: 'JSON only holds data (no loop or function), written as text readable by a human and a machine.' },
    },
    {
      id: 'json-q2', skill: 'json.purpose', lesson: 'json-1', level: 1, type: 'multi',
      prompt: { fr: 'Lesquels de ces fichiers de 3D Reader sont du JSON ?', en: 'Which of these 3D Reader files are JSON?' },
      choices: {
        fr: ['package.json', 'vercel.json', 'web/config.json', 'requirements.txt', 'ci.yml'],
        en: ['package.json', 'vercel.json', 'web/config.json', 'requirements.txt', 'ci.yml'],
      },
      answer: [0, 1, 2],
      explain: { fr: 'Les trois fichiers en .json. requirements.txt est une simple liste de texte pour pip, ci.yml est du YAML.', en: 'The three .json files. requirements.txt is a plain text list for pip, ci.yml is YAML.' },
    },
    {
      id: 'json-q3', skill: 'json.purpose', lesson: 'json-1', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque besoin au format le plus adapté.', en: 'Match each need with the best-suited format.' },
      pairs: {
        fr: [['Un tableau plat : une ligne par pièce', 'CSV'], ['Une pièce avec ses corps imbriqués, envoyée à un serveur', 'JSON'], ['Un workflow GitHub Actions écrit à la main', 'YAML'], ['Un calcul mis en forme pour un humain', 'Excel']],
        en: [['A flat table: one row per part', 'CSV'], ['A part with its nested bodies, sent to a server', 'JSON'], ['A GitHub Actions workflow written by hand', 'YAML'], ['A formatted calculation for a human', 'Excel']],
      },
      explain: { fr: 'CSV pour le plat, JSON pour l’imbriqué et l’échange, YAML pour les réglages écrits à la main, Excel pour le calcul humain.', en: 'CSV for flat data, JSON for nested data and exchange, YAML for hand-written settings, Excel for human calculation.' },
    },
    {
      id: 'json-q4', skill: 'json.purpose', lesson: 'json-1', level: 2, type: 'tf',
      prompt: { fr: 'Un programme Python et un programme JavaScript peuvent échanger des données en JSON.', en: 'A Python program and a JavaScript program can exchange data in JSON.' },
      answer: true,
      explain: { fr: 'JSON est indépendant du langage. Les moteurs Python et JS de 3D Reader produisent le même JSON de résultat, ce qui permet de les comparer.', en: 'JSON is language-independent. 3D Reader’s Python and JS engines produce the same result JSON, which lets them be compared.' },
    },

    // ------------------------------------------------------------------ json-2 (syntax)
    {
      id: 'json-q5', skill: 'json.syntax', lesson: 'json-2', level: 1, type: 'tf',
      prompt: { fr: 'Ce texte est-il du JSON valide ?', en: 'Is this text valid JSON?' },
      code: '{ "volume": 1250, "closed": true, }', lang: 'json',
      answer: false,
      explain: { fr: 'Non : la virgule après <code>true</code> (virgule finale) est interdite en JSON.', en: 'No: the comma after <code>true</code> (trailing comma) is forbidden in JSON.' },
    },
    {
      id: 'json-q6', skill: 'json.syntax', lesson: 'json-2', level: 1, type: 'line',
      prompt: { fr: 'Quelle ligne rend ce JSON invalide ?', en: 'Which line makes this JSON invalid?' },
      code: '{\n  "file": "carter.stl",\n  "unit": "mm",\n  // volume en mm³\n  "volume": 152000\n}', lang: 'json',
      answer: 3,
      explain: { fr: 'Les commentaires sont interdits en JSON. Pour donner l’unité, on peut l’écrire dans une clé (<code>"volume_mm3"</code>).', en: 'Comments are forbidden in JSON. To give the unit, write it in a key (<code>"volume_mm3"</code>).' },
    },
    {
      id: 'json-q7', skill: 'json.syntax', lesson: 'json-2', level: 2, type: 'multi',
      prompt: { fr: 'Quelles valeurs sont permises en JSON ?', en: 'Which values are allowed in JSON?' },
      choices: {
        fr: ['<code>null</code>', '<code>undefined</code>', '<code>"texte"</code>', '<code>NaN</code>', '<code>-3.5e2</code>', '<code>\'texte\'</code>'],
        en: ['<code>null</code>', '<code>undefined</code>', '<code>"text"</code>', '<code>NaN</code>', '<code>-3.5e2</code>', '<code>\'text\'</code>'],
      },
      answer: [0, 2, 4],
      explain: { fr: '<code>null</code>, une chaîne entre guillemets doubles et un nombre (même en notation scientifique) sont permis. <code>undefined</code>, <code>NaN</code> et les guillemets simples ne le sont pas.', en: '<code>null</code>, a double-quoted string and a number (even in scientific notation) are allowed. <code>undefined</code>, <code>NaN</code> and single quotes are not.' },
    },
    {
      id: 'json-q8', skill: 'json.syntax', lesson: 'json-2', level: 2, type: 'fill',
      prompt: { fr: 'Comment écrire, dans une chaîne JSON, un texte qui contient un guillemet ? Complète l’échappement.', en: 'How do you write, in a JSON string, a text containing a quote? Complete the escape.' },
      code: '{ "message": "Il a dit ____OK\\" au contrôle" }', lang: 'json',
      accept: ['\\"'],
      explain: { fr: 'On protège le guillemet avec une barre oblique inverse : <code>\\"</code>. Le second guillemet est déjà écrit.', en: 'You protect the quote with a backslash: <code>\\"</code>. The second quote is already written.' },
      hint: { fr: 'Un caractère spécial avant le guillemet.', en: 'A special character before the quote.' },
    },

    // ------------------------------------------------------------------ json-3 (files)
    {
      id: 'json-q9', skill: 'json.files', lesson: 'json-3', level: 1, type: 'mcq',
      prompt: { fr: 'Dans <code>package.json</code>, que lance <code>npm test</code> ?', en: 'In <code>package.json</code>, what does <code>npm test</code> run?' },
      code: '"scripts": {\n  "build": "node scripts/build-web.mjs",\n  "test": "node --test tests/js/*.test.mjs"\n}', lang: 'json',
      choices: {
        fr: ['<code>node --test tests/js/*.test.mjs</code>', '<code>node scripts/build-web.mjs</code>', 'Tous les scripts l’un après l’autre', 'Rien : il faut écrire <code>npm run scripts</code>'],
        en: ['<code>node --test tests/js/*.test.mjs</code>', '<code>node scripts/build-web.mjs</code>', 'Every script one after the other', 'Nothing: you must type <code>npm run scripts</code>'],
      },
      answer: 0,
      explain: { fr: 'npm cherche la clé <code>"test"</code> dans l’objet <code>scripts</code> et lance la commande associée.', en: 'npm looks up the <code>"test"</code> key in the <code>scripts</code> object and runs the matching command.' },
    },
    {
      id: 'json-q10', skill: 'json.files', lesson: 'json-3', level: 2, type: 'mcq',
      prompt: { fr: 'Avec <code>"playwright": "^1.56.1"</code>, quelle version npm peut-il installer ?', en: 'With <code>"playwright": "^1.56.1"</code>, which version may npm install?' },
      choices: { fr: ['1.58.0', '2.0.0', '1.55.9', '0.99.0'], en: ['1.58.0', '2.0.0', '1.55.9', '0.99.0'] },
      answer: 0,
      explain: { fr: 'Le <code>^</code> autorise les versions plus récentes tant que le premier chiffre (majeur) reste 1 : 1.58.0 oui, 2.0.0 non, et jamais plus ancien que 1.56.1.', en: 'The <code>^</code> allows newer versions as long as the first (major) number stays 1: 1.58.0 yes, 2.0.0 no, and never older than 1.56.1.' },
    },
    {
      id: 'json-q11', skill: 'json.files', lesson: 'json-3', level: 1, type: 'tf',
      prompt: { fr: 'On modifie <code>package-lock.json</code> à la main pour changer une version.', en: 'You edit <code>package-lock.json</code> by hand to change a version.' },
      answer: false,
      explain: { fr: 'Ce fichier est généré par npm. On change la version dans <code>package.json</code> (ou avec <code>npm install paquet@version</code>) et npm met le lock à jour.', en: 'This file is generated by npm. You change the version in <code>package.json</code> (or with <code>npm install package@version</code>) and npm updates the lock.' },
    },
    {
      id: 'json-q12', skill: 'json.files', lesson: 'json-3', level: 2, type: 'fill',
      prompt: { fr: 'Quel chemin désigne le volume du <strong>deuxième</strong> corps ?', en: 'Which path points at the volume of the <strong>second</strong> body?' },
      code: '{ "bodies": [ { "name": "Body 1", "volume": 4000 }, { "name": "Body 2", "volume": 300 } ] }', lang: 'json',
      accept: ['bodies[1].volume', 'bodies.1.volume'],
      explain: { fr: '<code>bodies[1].volume</code> : on compte à partir de 0, donc le deuxième corps est à la position 1. Il vaut 300.', en: '<code>bodies[1].volume</code>: counting starts at 0, so the second body is at position 1. It holds 300.' },
      hint: { fr: 'Les positions commencent à 0.', en: 'Positions start at 0.' },
    },

    // ------------------------------------------------------------------ json-4 (code)
    {
      id: 'json-q13', skill: 'json.code', lesson: 'json-4', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque fonction à ce qu’elle fait.', en: 'Match each function with what it does.' },
      pairs: {
        fr: [['JSON.parse(texte)', 'texte → objet (JavaScript)'], ['JSON.stringify(objet)', 'objet → texte (JavaScript)'], ['json.loads(texte)', 'texte → dict (Python)'], ['json.dumps(data)', 'dict → texte (Python)']],
        en: [['JSON.parse(text)', 'text → object (JavaScript)'], ['JSON.stringify(object)', 'object → text (JavaScript)'], ['json.loads(text)', 'text → dict (Python)'], ['json.dumps(data)', 'dict → text (Python)']],
      },
      explain: { fr: 'parse / loads lisent (du texte vers les données), stringify / dumps écrivent (des données vers le texte).', en: 'parse / loads read (text to data), stringify / dumps write (data to text).' },
    },
    {
      id: 'json-q14', skill: 'json.code', lesson: 'json-4', level: 2, type: 'mcq',
      prompt: { fr: 'Qu’affiche ce code ?', en: 'What does this code print?' },
      code: 'const texte = \'{"volume": 1250}\';\nconsole.log(texte.volume);', lang: 'js',
      choices: { fr: ['undefined', '1250', '"1250"', 'Une erreur SyntaxError'], en: ['undefined', '1250', '"1250"', 'A SyntaxError'] },
      answer: 0,
      explain: { fr: '<code>texte</code> est encore une chaîne : elle n’a pas de propriété <code>volume</code>. Il faut d’abord <code>JSON.parse(texte).volume</code>.', en: '<code>texte</code> is still a string: it has no <code>volume</code> property. You first need <code>JSON.parse(texte).volume</code>.' },
    },
    {
      id: 'json-q15', skill: 'json.code', lesson: 'json-4', level: 2, type: 'fill',
      prompt: { fr: 'Complète pour écrire l’objet en JSON indenté de 2 espaces.', en: 'Complete to write the object as JSON indented by 2 spaces.' },
      code: 'const texte = JSON.stringify(piece, null, ____);', lang: 'js',
      accept: ['2'],
      explain: { fr: 'Le troisième argument de <code>JSON.stringify</code> est l’indentation : <code>2</code> espaces par niveau.', en: 'The third argument of <code>JSON.stringify</code> is the indentation: <code>2</code> spaces per level.' },
    },
    {
      id: 'json-q16', skill: 'json.code', lesson: 'json-4', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre la sauvegarde puis la relecture d’un réglage dans le navigateur.', en: 'Put in order saving then reading back a setting in the browser.' },
      items: {
        fr: ['Créer l’objet <code>{ theme: "dark" }</code>', 'Le transformer en texte avec <code>JSON.stringify</code>', 'Le ranger avec <code>localStorage.setItem</code>', 'Plus tard, le relire avec <code>localStorage.getItem</code>', 'Le retransformer en objet avec <code>JSON.parse</code>'],
        en: ['Create the object <code>{ theme: "dark" }</code>', 'Turn it into text with <code>JSON.stringify</code>', 'Store it with <code>localStorage.setItem</code>', 'Later, read it back with <code>localStorage.getItem</code>', 'Turn it back into an object with <code>JSON.parse</code>'],
      },
      explain: { fr: 'localStorage ne garde que du texte : on écrit avec stringify avant de ranger, on relit avec parse après avoir repris le texte.', en: 'localStorage only keeps text: write with stringify before storing, read with parse after getting the text back.' },
    },

    // ------------------------------------------------------------------ json-5 (schema)
    {
      id: 'json-q17', skill: 'json.schema', lesson: 'json-5', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque mot-clé de JSON Schema à son sens.', en: 'Match each JSON Schema keyword with its meaning.' },
      pairs: {
        fr: [['type', 'la sorte de valeur attendue'], ['required', 'les clés obligatoires'], ['enum', 'la liste fermée des valeurs permises'], ['additionalProperties: false', 'aucune autre clé permise']],
        en: [['type', 'the expected kind of value'], ['required', 'the mandatory keys'], ['enum', 'the closed list of allowed values'], ['additionalProperties: false', 'no other key allowed']],
      },
      explain: { fr: 'Ce sont les quatre mots-clés les plus utilisés, et ceux de CYCLE_SCHEMA dans api/ai.js.', en: 'These are the four most used keywords, and the ones of CYCLE_SCHEMA in api/ai.js.' },
    },
    {
      id: 'json-q18', skill: 'json.schema', lesson: 'json-5', level: 2, type: 'mcq',
      prompt: { fr: 'Le schéma dit <code>confiance: { type: "string", enum: ["faible", "moyenne", "haute"] }</code>. Quelle réponse est conforme ?', en: 'The schema says <code>confiance: { type: "string", enum: ["faible", "moyenne", "haute"] }</code>. Which answer conforms?' },
      choices: {
        fr: ['<code>"confiance": "moyenne"</code>', '<code>"confiance": "assez bonne"</code>', '<code>"confiance": 2</code>', '<code>"confiance": ["haute"]</code>'],
        en: ['<code>"confiance": "moyenne"</code>', '<code>"confiance": "fairly good"</code>', '<code>"confiance": 2</code>', '<code>"confiance": ["haute"]</code>'],
      },
      answer: 0,
      explain: { fr: 'Il faut un texte ET qu’il soit dans la liste <code>enum</code>. Les autres sont hors liste, un nombre ou un tableau.', en: 'It must be a text AND be in the <code>enum</code> list. The others are off the list, a number or an array.' },
    },
    {
      id: 'json-q19', skill: 'json.schema', lesson: 'json-5', level: 2, type: 'tf',
      prompt: { fr: 'Si la réponse de l’IA respecte le schéma, la valeur estimée est forcément juste.', en: 'If the AI’s answer respects the schema, the estimated value is necessarily right.' },
      answer: false,
      explain: { fr: 'Le schéma vérifie la <em>forme</em>, pas la justesse. C’est pourquoi une estimation de l’IA n’est utilisée qu’après validation par une personne.', en: 'The schema checks the <em>shape</em>, not the correctness. That is why an AI estimate is used only after a person validates it.' },
    },
    {
      id: 'json-q20', skill: 'json.schema', lesson: 'json-5', level: 3, type: 'line',
      prompt: { fr: 'Le schéma exige <code>required: ["estimation_s", "fourchette_s"]</code> et <code>fourchette_s</code> : tableau de nombres. Quelle ligne de la réponse viole le schéma ?', en: 'The schema requires <code>required: ["estimation_s", "fourchette_s"]</code> and <code>fourchette_s</code>: array of numbers. Which line of the answer breaks the schema?' },
      code: '{\n  "estimation_s": 95,\n  "fourchette_s": ["80", "110"],\n  "confiance": "moyenne"\n}', lang: 'json',
      answer: 2,
      explain: { fr: 'La fourchette contient des chaînes (<code>"80"</code>) au lieu de nombres (<code>80</code>). Le JSON est valide, mais pas conforme au schéma.', en: 'The range holds strings (<code>"80"</code>) instead of numbers (<code>80</code>). The JSON is valid, but does not conform to the schema.' },
    },

    // ------------------------------------------------------------------ json-6 (practice)
    {
      id: 'json-q21', skill: 'json.practice', lesson: 'json-6', level: 1, type: 'mcq',
      prompt: { fr: 'Comment écrire une date dans un JSON ?', en: 'How do you write a date in JSON?' },
      choices: {
        fr: ['<code>"2026-10-21T09:30:00Z"</code> (texte ISO 8601)', '<code>21/10/2026</code> sans guillemets', '<code>new Date()</code>', '<code>date(2026, 10, 21)</code>'],
        en: ['<code>"2026-10-21T09:30:00Z"</code> (ISO 8601 text)', '<code>21/10/2026</code> without quotes', '<code>new Date()</code>', '<code>date(2026, 10, 21)</code>'],
      },
      answer: 0,
      explain: { fr: 'JSON n’a pas de type date : on écrit un texte au format ISO 8601, sans ambiguïté et triable.', en: 'JSON has no date type: write a text in ISO 8601 format, unambiguous and sortable.' },
    },
    {
      id: 'json-q22', skill: 'json.practice', lesson: 'json-6', level: 1, type: 'tf',
      prompt: { fr: 'On peut mettre la clé d’API Groq dans <code>web/config.json</code> puisque ce fichier est fait pour les réglages.', en: 'You can put the Groq API key in <code>web/config.json</code> since this file is meant for settings.' },
      answer: false,
      explain: { fr: 'Jamais : ce fichier est committé et publié avec le site. Les secrets vont dans les variables d’environnement du serveur (Vercel).', en: 'Never: this file is committed and published with the site. Secrets go in the server’s environment variables (Vercel).' },
    },
    {
      id: 'json-q23', skill: 'json.practice', lesson: 'json-6', level: 2, type: 'mcq',
      prompt: { fr: 'Quel raccourci de VS Code (Windows) remet un JSON en forme ?', en: 'Which VS Code shortcut (Windows) reformats a JSON?' },
      choices: { fr: ['<kbd>Maj</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>', '<kbd>Ctrl</kbd>+<kbd>S</kbd>', '<kbd>Ctrl</kbd>+<kbd>Z</kbd>', '<kbd>F5</kbd>'], en: ['<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>', '<kbd>Ctrl</kbd>+<kbd>S</kbd>', '<kbd>Ctrl</kbd>+<kbd>Z</kbd>', '<kbd>F5</kbd>'] },
      answer: 0,
      explain: { fr: '« Mettre en forme le document » : Maj+Alt+F. Ctrl+S enregistre, Ctrl+Z annule, F5 lance le débogage.', en: '“Format document”: Shift+Alt+F. Ctrl+S saves, Ctrl+Z undoes, F5 starts debugging.' },
    },
    {
      id: 'json-q24', skill: 'json.practice', lesson: 'json-6', level: 2, type: 'multi',
      prompt: { fr: 'Quels sont les avantages de JSON Lines (un objet JSON par ligne) ?', en: 'What are the advantages of JSON Lines (one JSON object per line)?' },
      choices: {
        fr: ['On peut ajouter une ligne sans relire tout le fichier', 'On peut lire une seule ligne', 'Il autorise les commentaires', 'Il chiffre les données'],
        en: ['You can append a line without rereading the whole file', 'You can read a single line', 'It allows comments', 'It encrypts the data'],
      },
      answer: [0, 1],
      explain: { fr: 'Chaque ligne est un JSON complet et indépendant. Pas de commentaires pour autant, et aucun chiffrement.', en: 'Each line is a complete, independent JSON. Still no comments, and no encryption.' },
    },

    // ------------------------------------------------------------------ extra: purpose
    {
      id: 'json-q25', skill: 'json.purpose', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un fichier JSON peut s’ouvrir et se lire avec le Bloc-notes.', en: 'A JSON file can be opened and read with Notepad.' },
      answer: true,
      explain: { fr: 'C’est du texte, comme une étiquette de colis : n’importe quel éditeur l’ouvre.', en: 'It is text, like a parcel label: any editor opens it.' },
    },
    {
      id: 'json-q26', skill: 'json.purpose', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie le sigle JSON ?', en: 'What does JSON stand for?' },
      choices: { fr: ['JavaScript Object Notation', 'Java Standard Object Network', 'JSON Script Online', 'Joint System Of Numbers'], en: ['JavaScript Object Notation', 'Java Standard Object Network', 'JSON Script Online', 'Joint System Of Numbers'] },
      answer: 0,
      explain: { fr: '« Notation des objets JavaScript » : il est né de JavaScript, mais tous les langages le lisent aujourd’hui.', en: '“JavaScript Object Notation”: it was born from JavaScript, but every language reads it today.' },
    },
    {
      id: 'json-q27', skill: 'json.purpose', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi JSON plutôt que CSV pour le résultat d’analyse d’une pièce ?', en: 'Why JSON rather than CSV for the analysis result of a part?' },
      choices: {
        fr: ['Parce que la pièce contient des corps, eux-mêmes avec plusieurs valeurs : des niveaux', 'Parce que CSV ne sait pas stocker de nombres', 'Parce que JSON est plus compact dans tous les cas', 'Parce que CSV est réservé à Excel'],
        en: ['Because the part contains bodies, each with several values: levels', 'Because CSV cannot store numbers', 'Because JSON is always more compact', 'Because CSV is reserved for Excel'],
      },
      answer: 0,
      explain: { fr: 'CSV est plat (lignes × colonnes) ; JSON range des fiches dans des fiches, idéal pour une pièce et ses corps.', en: 'CSV is flat (rows × columns); JSON files cards inside cards, ideal for a part and its bodies.' },
    },
    {
      id: 'json-q28', skill: 'json.purpose', extra: true, level: 2, type: 'multi',
      prompt: { fr: 'Où rencontre-t-on du JSON quand on utilise 3D Reader ?', en: 'Where do you meet JSON when using 3D Reader?' },
      choices: {
        fr: ['La réponse de la passerelle IA', 'Les réglages gardés dans localStorage', 'Le fichier STEP de la pièce', 'Le package.json du projet'],
        en: ['The answer of the AI gateway', 'The settings kept in localStorage', 'The STEP file of the part', 'The project’s package.json'],
      },
      answer: [0, 1, 3],
      explain: { fr: 'Le fichier STEP a son propre format (ISO 10303), ce n’est pas du JSON. Les trois autres le sont.', en: 'The STEP file has its own format (ISO 10303), it is not JSON. The other three are.' },
    },

    // ------------------------------------------------------------------ extra: syntax
    {
      id: 'json-q29', skill: 'json.syntax', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Ce texte est-il du JSON valide ?', en: 'Is this text valid JSON?' },
      code: '[1, 2, 3]', lang: 'json',
      answer: true,
      explain: { fr: 'Oui : un tableau peut être la valeur de premier niveau d’un JSON, pas seulement un objet.', en: 'Yes: an array can be the top-level value of a JSON, not only an object.' },
    },
    {
      id: 'json-q30', skill: 'json.syntax', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Ce texte est-il du JSON valide ?', en: 'Is this text valid JSON?' },
      code: "{ 'name': 'carter' }", lang: 'json',
      answer: false,
      explain: { fr: 'Non : JSON exige des guillemets <strong>doubles</strong> pour les clés et les chaînes : <code>{ "name": "carter" }</code>.', en: 'No: JSON requires <strong>double</strong> quotes for keys and strings: <code>{ "name": "carter" }</code>.' },
    },
    {
      id: 'json-q31', skill: 'json.syntax', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Il manque quelque chose à la fin d’une ligne. Laquelle ?', en: 'Something is missing at the end of a line. Which one?' },
      code: '{\n  "bodies": [\n    { "name": "Body 1", "closed": true },\n    { "name": "Body 2", "closed": false }\n    { "name": "Body 3", "closed": true }\n  ]\n}', lang: 'json',
      answer: 3,
      explain: { fr: 'Il manque la virgule après le deuxième corps : entre deux éléments d’un tableau, une virgule est obligatoire.', en: 'The comma after the second body is missing: between two items of an array a comma is mandatory.' },
    },
    {
      id: 'json-q32', skill: 'json.syntax', extra: true, level: 2, type: 'match',
      prompt: { fr: 'Associe chaque écriture JavaScript à son équivalent JSON valide.', en: 'Match each JavaScript writing with its valid JSON equivalent.' },
      pairs: {
        fr: [["{ name: 'a' }", '{ "name": "a" }'], ['True', 'true'], ['[1, 2,]', '[1, 2]'], ['undefined', 'null (ou supprimer la clé)']],
        en: [["{ name: 'a' }", '{ "name": "a" }'], ['True', 'true'], ['[1, 2,]', '[1, 2]'], ['undefined', 'null (or remove the key)']],
      },
      explain: { fr: 'Guillemets doubles partout, booléens en minuscules, pas de virgule finale, et <code>undefined</code> n’existe pas en JSON.', en: 'Double quotes everywhere, lower-case booleans, no trailing comma, and <code>undefined</code> does not exist in JSON.' },
    },
    {
      id: 'json-q33', skill: 'json.syntax', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Écris en JSON la chaîne du chemin Windows <code>C:\\dev</code> (avec ses guillemets).', en: 'Write in JSON the string of the Windows path <code>C:\\dev</code> (with its quotes).' },
      accept: ['"C:\\\\dev"'],
      explain: { fr: 'La barre oblique inverse est un caractère d’échappement : il faut la doubler, <code>"C:\\\\dev"</code>.', en: 'The backslash is an escape character: you must double it, <code>"C:\\\\dev"</code>.' },
      hint: { fr: 'Le caractère <code>\\</code> doit être échappé… par lui-même.', en: 'The <code>\\</code> character must be escaped… by itself.' },
    },

    // ------------------------------------------------------------------ extra: files
    {
      id: 'json-q34', skill: 'json.files', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'La version passe de <code>0.2.0</code> à <code>0.2.1</code>. Qu’est-ce que ça annonce ?', en: 'The version goes from <code>0.2.0</code> to <code>0.2.1</code>. What does it announce?' },
      choices: { fr: ['Un correctif', 'Une nouvelle fonctionnalité', 'Un changement incompatible', 'Rien de particulier'], en: ['A fix', 'A new feature', 'A breaking change', 'Nothing special'] },
      answer: 0,
      explain: { fr: 'En semver MAJEUR.MINEUR.CORRECTIF, le dernier chiffre est le correctif.', en: 'In semver MAJOR.MINOR.PATCH, the last number is the patch (fix).' },
    },
    {
      id: 'json-q35', skill: 'json.files', extra: true, level: 2, type: 'tf',
      prompt: { fr: '<code>devcontainer.json</code> contient des commentaires <code>//</code>, donc les commentaires sont permis dans tout fichier JSON.', en: '<code>devcontainer.json</code> contains <code>//</code> comments, so comments are allowed in any JSON file.' },
      answer: false,
      explain: { fr: 'C’est du JSONC, une variante tolérée par certains outils (VS Code). Un JSON ordinaire lu par <code>JSON.parse</code> refuse les commentaires.', en: 'It is JSONC, a variant some tools (VS Code) accept. Ordinary JSON read by <code>JSON.parse</code> refuses comments.' },
    },
    {
      id: 'json-q36', skill: 'json.files', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert la clé <code>"$schema"</code> en tête de <code>vercel.json</code> ?', en: 'What is the <code>"$schema"</code> key at the top of <code>vercel.json</code> for?' },
      choices: {
        fr: ['À indiquer la description officielle du format, pour que l’éditeur propose les clés et signale les fautes', 'À chiffrer le fichier', 'À lancer le déploiement', 'À rien, c’est un commentaire'],
        en: ['To point at the official description of the format, so the editor suggests keys and flags mistakes', 'To encrypt the file', 'To start the deployment', 'Nothing, it is a comment'],
      },
      answer: 0,
      explain: { fr: 'L’éditeur télécharge le schéma et s’en sert comme d’un calibre pendant que tu tapes.', en: 'The editor downloads the schema and uses it as a gauge while you type.' },
    },
    {
      id: 'json-q37', skill: 'json.files', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Quel chemin donne la durée maximale de la fonction IA ?', en: 'Which path gives the maximum duration of the AI function?' },
      code: '{\n  "outputDirectory": "web",\n  "functions": {\n    "api/ai.js": { "maxDuration": 60 }\n  }\n}', lang: 'json',
      accept: ['functions["api/ai.js"].maxDuration', "functions['api/ai.js'].maxDuration", 'functions.api/ai.js.maxDuration'],
      explain: { fr: 'La clé <code>"api/ai.js"</code> contient un point et une barre : on l’écrit entre crochets et guillemets, <code>functions["api/ai.js"].maxDuration</code>. Elle vaut 60.', en: 'The <code>"api/ai.js"</code> key contains a dot and a slash: write it in brackets and quotes, <code>functions["api/ai.js"].maxDuration</code>. It holds 60.' },
      hint: { fr: 'Une clé avec des caractères spéciaux s’écrit entre <code>["…"]</code>.', en: 'A key with special characters is written between <code>["…"]</code>.' },
    },

    // ------------------------------------------------------------------ extra: code
    {
      id: 'json-q38', skill: 'json.code', extra: true, level: 1, type: 'fill',
      prompt: { fr: 'Complète pour transformer le texte en objet.', en: 'Complete to turn the text into an object.' },
      code: 'const resultat = JSON.____(texte);', lang: 'js',
      accept: ['parse'],
      explain: { fr: '<code>JSON.parse</code> lit un texte JSON et rend l’objet correspondant.', en: '<code>JSON.parse</code> reads a JSON text and returns the matching object.' },
    },
    {
      id: 'json-q39', skill: 'json.code', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Qu’affiche ce code ?', en: 'What does this code print?' },
      code: 'console.log(JSON.stringify({ a: 1, b: undefined, c: NaN }));', lang: 'js',
      choices: { fr: ['{"a":1,"c":null}', '{"a":1,"b":undefined,"c":NaN}', '{"a":1}', 'Une erreur'], en: ['{"a":1,"c":null}', '{"a":1,"b":undefined,"c":NaN}', '{"a":1}', 'An error'] },
      answer: 0,
      explain: { fr: 'Une clé valant <code>undefined</code> disparaît, <code>NaN</code> devient <code>null</code>.', en: 'A key holding <code>undefined</code> vanishes, <code>NaN</code> becomes <code>null</code>.' },
    },
    {
      id: 'json-q40', skill: 'json.code', extra: true, level: 2, type: 'tf',
      prompt: { fr: '<code>JSON.parse("{\'a\': 1}")</code> lance une erreur <code>SyntaxError</code>.', en: '<code>JSON.parse("{\'a\': 1}")</code> throws a <code>SyntaxError</code>.' },
      answer: true,
      explain: { fr: 'Les guillemets simples ne sont pas du JSON : le parseur refuse. On protège l’appel avec <code>try / catch</code>.', en: 'Single quotes are not JSON: the parser refuses. Protect the call with <code>try / catch</code>.' },
    },
    {
      id: 'json-q41', skill: 'json.code', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Quelle ligne contient l’erreur ?', en: 'Which line holds the mistake?' },
      code: 'const saved = { theme: "dark", lang: "fr" };\nlocalStorage.setItem("settings", saved);\nconst text = localStorage.getItem("settings");\nconst settings = JSON.parse(text);', lang: 'js',
      answer: 1,
      explain: { fr: 'localStorage ne garde que du texte : il fallait <code>JSON.stringify(saved)</code>. Sinon il range le texte « [object Object] », que <code>JSON.parse</code> refuse ensuite.', en: 'localStorage only keeps text: it needed <code>JSON.stringify(saved)</code>. Otherwise it stores the text “[object Object]”, which <code>JSON.parse</code> then refuses.' },
    },

    // ------------------------------------------------------------------ extra: schema
    {
      id: 'json-q42', skill: 'json.schema', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Pourquoi api/ai.js impose-t-il un schéma JSON à la réponse de l’IA ?', en: 'Why does api/ai.js impose a JSON schema on the AI’s answer?' },
      choices: {
        fr: ['Pour obtenir des données à des places précises que la page sait lire', 'Pour que l’IA réponde plus vite', 'Pour cacher la réponse', 'Pour traduire la réponse en anglais'],
        en: ['To get data in precise places the page can read', 'So the AI answers faster', 'To hide the answer', 'To translate the answer into English'],
      },
      answer: 0,
      explain: { fr: 'Un texte libre (« environ une minute ») est difficile à exploiter ; un nombre dans la case <code>estimation_s</code> se lit directement.', en: 'Free text (“about a minute”) is hard to use; a number in the <code>estimation_s</code> box can be read directly.' },
    },
    {
      id: 'json-q43', skill: 'json.schema', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Avec <code>additionalProperties: false</code>, la réponse peut contenir une clé <code>"blague"</code> en plus.', en: 'With <code>additionalProperties: false</code>, the answer may contain an extra <code>"joke"</code> key.' },
      answer: false,
      explain: { fr: 'Ce mot-clé interdit toute clé qui n’est pas décrite dans <code>properties</code>.', en: 'This keyword forbids any key not described in <code>properties</code>.' },
    },
    {
      id: 'json-q44', skill: 'json.schema', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Complète le schéma pour que <code>volume</code> soit un nombre.', en: 'Complete the schema so that <code>volume</code> is a number.' },
      code: '{\n  "type": "object",\n  "properties": {\n    "volume": { "type": "____" }\n  },\n  "required": ["volume"]\n}', lang: 'json',
      accept: ['number'],
      explain: { fr: 'Les types de JSON Schema sont <code>object, array, string, number, boolean, null</code> (et <code>integer</code> pour les entiers).', en: 'JSON Schema types are <code>object, array, string, number, boolean, null</code> (and <code>integer</code> for whole numbers).' },
    },
    {
      id: 'json-q45', skill: 'json.schema', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Dans le contrat de résultat, <code>volume: number|null</code> veut dire…', en: 'In the result contract, <code>volume: number|null</code> means…' },
      choices: {
        fr: ['un nombre, ou <code>null</code> quand le volume n’est pas calculable (corps ouvert)', 'un nombre multiplié par null', 'un texte', 'une valeur facultative qui peut être n’importe quoi'],
        en: ['a number, or <code>null</code> when the volume cannot be computed (open body)', 'a number multiplied by null', 'a text', 'an optional value that can be anything'],
      },
      answer: 0,
      explain: { fr: 'La barre <code>|</code> signifie « ou ». Un corps ouvert n’a pas de volume défini : il vaut <code>null</code>, jamais un texte ni <code>NaN</code>.', en: 'The bar <code>|</code> means “or”. An open body has no defined volume: it is <code>null</code>, never a text nor <code>NaN</code>.' },
    },

    // ------------------------------------------------------------------ extra: practice
    {
      id: 'json-q46', skill: 'json.practice', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que donne <code>0.1 + 0.2</code> en JavaScript ?', en: 'What does <code>0.1 + 0.2</code> give in JavaScript?' },
      choices: { fr: ['0.30000000000000004', '0.3', '0.03', 'Une erreur'], en: ['0.30000000000000004', '0.3', '0.03', 'An error'] },
      answer: 0,
      explain: { fr: 'Les décimaux sont stockés de façon approchée (nombres flottants). On arrondit à l’affichage et on compare avec une tolérance.', en: 'Decimals are stored approximately (floating-point numbers). Round when displaying and compare with a tolerance.' },
    },
    {
      id: 'json-q47', skill: 'json.practice', extra: true, level: 2, type: 'multi',
      prompt: { fr: 'Lesquels de ces contenus ne doivent JAMAIS être dans un JSON committé ?', en: 'Which of these must NEVER be in a committed JSON?' },
      choices: {
        fr: ['Une clé d’API', 'Le code d’accès de la passerelle', 'La version du projet', 'Les vrais chiffres de chiffrage de l’entreprise', 'Le nom des scripts npm'],
        en: ['An API key', 'The gateway access code', 'The project version', 'The company’s real costing figures', 'The names of the npm scripts'],
      },
      answer: [0, 1, 3],
      explain: { fr: 'Secrets et données confidentielles restent hors du dépôt (variables d’environnement, fichiers dans .gitignore). La version et les scripts sont publics par nature.', en: 'Secrets and confidential data stay out of the repository (environment variables, files in .gitignore). The version and the scripts are public by nature.' },
    },
    {
      id: 'json-q48', skill: 'json.practice', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'En PowerShell, quelle commande transforme un texte JSON en objet ?', en: 'In PowerShell, which command turns JSON text into an object?' },
      code: 'Get-Content package.json -Raw | ____', lang: 'ps',
      accept: ['ConvertFrom-Json'],
      explain: { fr: '<code>ConvertFrom-Json</code> (l’inverse : <code>ConvertTo-Json</code>). On accède ensuite aux valeurs avec <code>.version</code>.', en: '<code>ConvertFrom-Json</code> (the reverse: <code>ConvertTo-Json</code>). Then reach values with <code>.version</code>.' },
    },

    // ------------------------------------------------------------------ exam
    {
      id: 'json-q49', skill: 'json.syntax', level: 2, type: 'line',
      prompt: { fr: 'Quelle ligne rend ce package.json invalide ?', en: 'Which line makes this package.json invalid?' },
      code: '{\n  "name": "3d-reader-web",\n  "version": "0.2.0",\n  "private": true,\n  "type": "module",\n}', lang: 'json',
      answer: 4,
      explain: { fr: 'La virgule après <code>"module"</code> est une virgule finale : interdite avant l’accolade fermante.', en: 'The comma after <code>"module"</code> is a trailing comma: forbidden before the closing brace.' },
    },
    {
      id: 'json-q50', skill: 'json.syntax', level: 1, type: 'tf',
      prompt: { fr: 'Ce texte est-il du JSON valide ?', en: 'Is this text valid JSON?' },
      code: '{ "color": null, "closed": false, "size": [120, 80, 45] }', lang: 'json',
      answer: true,
      explain: { fr: 'Oui : <code>null</code> et <code>false</code> en minuscules, un tableau de nombres, des clés entre guillemets doubles.', en: 'Yes: lower-case <code>null</code> and <code>false</code>, an array of numbers, keys in double quotes.' },
    },
    {
      id: 'json-q51', skill: 'json.purpose', level: 1, type: 'mcq',
      prompt: { fr: 'Le bouton « Exporter » de la page Progression de cette formation produit…', en: 'The “Export” button of this course’s Progress page produces…' },
      choices: { fr: ['un fichier JSON', 'un fichier Excel', 'une image', 'un fichier STEP'], en: ['a JSON file', 'an Excel file', 'an image', 'a STEP file'] },
      answer: 0,
      explain: { fr: 'La progression est un objet JavaScript, écrit avec <code>JSON.stringify</code> dans un fichier <code>.json</code> que tu peux réimporter.', en: 'The progress is a JavaScript object, written with <code>JSON.stringify</code> to a <code>.json</code> file you can import again.' },
    },
    {
      id: 'json-q52', skill: 'json.files', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre, du plus général au plus précis, le chemin vers le nom du premier corps.', en: 'Put in order, from the most general to the most precise, the path to the name of the first body.' },
      items: {
        fr: ['L’objet résultat (la racine)', 'La clé <code>bodies</code> (un tableau)', 'L’élément à la position 0', 'La clé <code>name</code>'],
        en: ['The result object (the root)', 'The <code>bodies</code> key (an array)', 'The item at position 0', 'The <code>name</code> key'],
      },
      explain: { fr: 'Le chemin <code>bodies[0].name</code> se lit de la racine vers la feuille.', en: 'The path <code>bodies[0].name</code> reads from the root to the leaf.' },
    },
    {
      id: 'json-q53', skill: 'json.code', level: 2, type: 'mcq',
      prompt: { fr: 'Dans <code>const data = await response.json();</code>, que fait <code>response.json()</code> ?', en: 'In <code>const data = await response.json();</code>, what does <code>response.json()</code> do?' },
      choices: {
        fr: ['Il lit le corps de la réponse HTTP et le transforme en objet (comme JSON.parse)', 'Il envoie un JSON au serveur', 'Il enregistre la réponse dans un fichier', 'Il vérifie le schéma de la réponse'],
        en: ['It reads the body of the HTTP answer and turns it into an object (like JSON.parse)', 'It sends a JSON to the server', 'It saves the answer to a file', 'It checks the answer’s schema'],
      },
      answer: 0,
      explain: { fr: 'C’est un <code>JSON.parse</code> asynchrone du corps de la réponse ; il échoue si ce n’est pas du JSON, d’où le <code>.catch(() =&gt; ({}))</code> de 3D Reader.', en: 'It is an asynchronous <code>JSON.parse</code> of the response body; it fails if it is not JSON, hence 3D Reader’s <code>.catch(() =&gt; ({}))</code>.' },
    },
    {
      id: 'json-q54', skill: 'json.code', level: 2, type: 'match',
      prompt: { fr: 'En Python, en quoi devient chaque valeur JSON ?', en: 'In Python, what does each JSON value become?' },
      pairs: {
        fr: [['objet {}', 'dict'], ['tableau []', 'list'], ['null', 'None'], ['true', 'True']],
        en: [['object {}', 'dict'], ['array []', 'list'], ['null', 'None'], ['true', 'True']],
      },
      explain: { fr: '<code>json.loads</code> convertit chaque sorte de valeur JSON vers son équivalent Python.', en: '<code>json.loads</code> converts each kind of JSON value to its Python equivalent.' },
    },
    {
      id: 'json-q55', skill: 'json.schema', level: 2, type: 'multi',
      prompt: { fr: 'Le schéma : <code>required: ["estimation_s", "confiance"]</code>, <code>confiance</code> dans <code>["faible", "moyenne", "haute"]</code>, aucune clé en plus. Quelles réponses sont conformes ?', en: 'The schema: <code>required: ["estimation_s", "confiance"]</code>, <code>confiance</code> in <code>["faible", "moyenne", "haute"]</code>, no extra key. Which answers conform?' },
      choices: {
        fr: ['<code>{"estimation_s": 90, "confiance": "haute"}</code>', '<code>{"estimation_s": 90}</code>', '<code>{"estimation_s": 70, "confiance": "faible"}</code>', '<code>{"estimation_s": 90, "confiance": "haute", "note": "x"}</code>'],
        en: ['<code>{"estimation_s": 90, "confiance": "haute"}</code>', '<code>{"estimation_s": 90}</code>', '<code>{"estimation_s": 70, "confiance": "faible"}</code>', '<code>{"estimation_s": 90, "confiance": "haute", "note": "x"}</code>'],
      },
      answer: [0, 2],
      explain: { fr: 'La deuxième oublie une clé obligatoire, la quatrième ajoute une clé interdite.', en: 'The second misses a mandatory key, the fourth adds a forbidden key.' },
    },
    {
      id: 'json-q56', skill: 'json.practice', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi garder une clé par ligne dans un JSON suivi par Git ?', en: 'Why keep one key per line in a JSON tracked by Git?' },
      choices: {
        fr: ['Pour que le diff montre seulement la ligne modifiée', 'Parce que JSON l’exige', 'Pour que le fichier soit plus petit', 'Pour que npm le lise plus vite'],
        en: ['So the diff shows only the changed line', 'Because JSON requires it', 'So the file is smaller', 'So npm reads it faster'],
      },
      answer: 0,
      explain: { fr: 'JSON accepte tout sur une ligne, mais alors le moindre changement modifie toute la ligne et le diff devient illisible.', en: 'JSON accepts everything on one line, but then the slightest change modifies the whole line and the diff becomes unreadable.' },
    },
    {
      id: 'json-q57', skill: 'json.practice', level: 3, type: 'order',
      prompt: { fr: 'Un fichier JSON refuse de se charger. Remets dans l’ordre la démarche.', en: 'A JSON file refuses to load. Put the steps in order.' },
      items: {
        fr: ['Lire le message d’erreur (ligne et colonne)', 'Ouvrir le fichier dans VS Code et repérer le soulignement rouge', 'Corriger la faute (virgule, guillemet, accolade)', 'Remettre en forme avec Maj+Alt+F', 'Relancer le programme pour vérifier'],
        en: ['Read the error message (line and column)', 'Open the file in VS Code and spot the red underline', 'Fix the mistake (comma, quote, brace)', 'Reformat with Shift+Alt+F', 'Run the program again to check'],
      },
      explain: { fr: 'Le message donne la position, l’éditeur montre la faute, on corrige, on reformate, et on vérifie toujours en relançant.', en: 'The message gives the position, the editor shows the mistake, you fix, reformat, and always check by running again.' },
    },
    {
      id: 'json-q58', skill: 'json.files', level: 1, type: 'tf',
      prompt: { fr: 'On committe <code>package-lock.json</code> dans le dépôt.', en: 'You commit <code>package-lock.json</code> to the repository.' },
      answer: true,
      explain: { fr: 'Oui : grâce à lui, <code>npm ci</code> installe exactement les mêmes versions sur ta machine et sur la CI.', en: 'Yes: thanks to it, <code>npm ci</code> installs exactly the same versions on your machine and on the CI.' },
    },
  ],
};
