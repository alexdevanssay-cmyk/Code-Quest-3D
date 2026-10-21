// Module 8 — Environnements, terminaux et moteurs.
// Les textes utilisent String.raw : les barres obliques inverses des chemins Windows
// (C:\Users\...) restent telles quelles. Ne jamais écrire de backtick ni de « $ { » collés.
const r = String.raw;

export default {
  id: 'env',
  order: 8,
  icon: '🖥️',
  color: '#2f7d6d',
  title: { fr: 'Environnements, terminaux et moteurs', en: 'Environments, terminals and engines' },
  summary: {
    fr: 'Fichiers et chemins, cmd, PowerShell, bash, variables d’environnement, Node.js, npm, Python et les espaces de travail : savoir où tourne quoi.',
    en: 'Files and paths, cmd, PowerShell, bash, environment variables, Node.js, npm, Python and workspaces: knowing what runs where.',
  },
  skills: {
    'env.files': { fr: 'Fichiers, dossiers et chemins', en: 'Files, folders and paths' },
    'env.cmd': { fr: 'Invite de commande (cmd)', en: 'Command Prompt (cmd)' },
    'env.powershell': { fr: 'PowerShell', en: 'PowerShell' },
    'env.bash': { fr: 'bash et Linux', en: 'bash and Linux' },
    'env.variables': { fr: 'Variables d’environnement et PATH', en: 'Environment variables and PATH' },
    'env.engines': { fr: 'Moteurs : Node.js, npm, Python, navigateurs', en: 'Engines: Node.js, npm, Python, browsers' },
    'env.workspaces': { fr: 'Espaces de travail : VS Code, conteneurs, Claude Code', en: 'Workspaces: VS Code, containers, Claude Code' },
  },

  widgets: {
    'env-term-cmd': {
      type: 'terminal',
      shell: 'cmd',
      intro: {
        fr: 'Tu es dans l’invite de commande Windows, à la racine du dépôt 3D-reader. Réussis les missions dans l’ordre.',
        en: 'You are in the Windows Command Prompt, at the root of the 3D-reader repository. Complete the missions in order.',
      },
      missions: [
        { match: r`^dir(\s+[/.\\]?\S*)?\s*$`, fr: 'Affiche le contenu du dossier courant.', en: 'Show the contents of the current folder.' },
        { match: r`^cd\s+\.?[\\/]?web[\\/]?\s*$`, fr: 'Entre dans le dossier web.', en: 'Go into the web folder.' },
        { match: r`^cd\s*\.\.[\\/]?\s*$`, fr: 'Remonte d’un niveau (dossier parent).', en: 'Go back up one level (parent folder).' },
        { match: r`^type\s+\.?[\\/]?readme\.md\s*$`, fr: 'Affiche le texte du fichier README.md.', en: 'Print the text of README.md.' },
        { match: r`^where(\.exe)?\s+node(\.exe)?\s*$`, fr: 'Trouve où est installé le programme node.', en: 'Find where the node program is installed.' },
        { match: r`^cls\s*$`, fr: 'Efface l’écran.', en: 'Clear the screen.' },
      ],
    },
    'env-term-ps': {
      type: 'terminal',
      shell: 'powershell',
      intro: {
        fr: 'PowerShell, à la racine du dépôt 3D-reader. Les alias (ls, cd, cat, pwd) sont acceptés, mais essaie les vrais noms Verbe-Nom !',
        en: 'PowerShell, at the root of the 3D-reader repository. Aliases (ls, cd, cat, pwd) are accepted, but try the real Verb-Noun names!',
      },
      missions: [
        { match: r`^(get-location|pwd|gl)\s*$`, fr: 'Affiche le dossier où tu te trouves.', en: 'Show the folder you are in.' },
        { match: r`^(get-childitem|ls|dir|gci)(\s+\S+)?\s*$`, fr: 'Liste les fichiers du dossier.', en: 'List the files of the folder.' },
        { match: r`^(get-content|cat|gc|type)\s+\.?[\\/]?package\.json\s*$`, fr: 'Lis le fichier package.json (c’est la fiche d’identité du projet Node).', en: 'Read package.json (the identity card of the Node project).' },
        { match: r`^((echo|write-output|write-host)\s+)?\$env:path\s*$`, fr: 'Affiche la variable d’environnement PATH.', en: 'Show the PATH environment variable.' },
        { match: r`^(get-command|gcm|where\.exe)\s+node(\.exe)?\s*$`, fr: 'Demande à PowerShell quel programme se cache derrière la commande node.', en: 'Ask PowerShell which program is behind the node command.' },
        { match: r`^(get-help|help|man)\s+(get-childitem|ls|dir|gci)(\s+.*)?$`, fr: 'Ouvre l’aide de la commande Get-ChildItem.', en: 'Open the help of the Get-ChildItem command.' },
      ],
    },
    'env-term-bash': {
      type: 'terminal',
      shell: 'bash',
      intro: {
        fr: 'Un terminal bash, comme dans la CI GitHub ou le conteneur cloud de Claude Code. Tu es à la racine du dépôt 3D-reader.',
        en: 'A bash terminal, like in GitHub CI or Claude Code’s cloud container. You are at the root of the 3D-reader repository.',
      },
      missions: [
        { match: r`^pwd\s*$`, fr: 'Affiche le chemin du dossier courant.', en: 'Print the path of the current folder.' },
        { match: r`^ls(\s+-[a-z]+)*\s*$`, fr: 'Liste les fichiers (essaie aussi ls -a pour voir les fichiers cachés).', en: 'List the files (also try ls -a to see hidden files).' },
        { match: r`^cd\s+\.?/?web/?\s*$`, fr: 'Entre dans le dossier web.', en: 'Go into the web folder.' },
        { match: r`^cd\s*(\.\.|~|-)?/?\s*$`, fr: 'Reviens au dossier parent (cd ..).', en: 'Go back to the parent folder (cd ..).' },
        { match: r`^cat\s+\.?/?package\.json\s*$`, fr: 'Affiche le contenu de package.json.', en: 'Print the contents of package.json.' },
        { match: r`^which\s+node\s*$`, fr: 'Trouve où se trouve le programme node.', en: 'Find where the node program is.' },
        { match: r`^export\s+base_path=\S+\s*$`, fr: 'Crée la variable BASE_PATH avec la valeur /3D-reader.', en: 'Create the BASE_PATH variable with the value /3D-reader.' },
        { match: r`^echo\s+"?\$base_path"?\s*$`, fr: 'Affiche la valeur de BASE_PATH.', en: 'Print the value of BASE_PATH.' },
      ],
    },
    'env-term-local': {
      type: 'terminal',
      cwd: 'home',
      shell: 'bash',
      intro: {
        fr: 'Mission « lancer 3D Reader en local » : récupère le code, installe les dépendances, construis le site, sers-le, puis lance les tests.',
        en: 'Mission “run 3D Reader locally”: get the code, install the dependencies, build the site, serve it, then run the tests.',
      },
      missions: [
        { match: r`^git\s+clone\s+\S*3d-reader(\.git)?/?\s*$`, fr: 'Clone le dépôt : git clone https://github.com/alexdevanssay-cmyk/3D-reader', en: 'Clone the repository: git clone https://github.com/alexdevanssay-cmyk/3D-reader' },
        { match: r`^cd\s+\.?/?3d-reader/?\s*$`, fr: 'Entre dans le dossier 3D-reader qui vient d’être créé.', en: 'Go into the 3D-reader folder that was just created.' },
        { match: r`^npm\s+(ci|install|i)\s*$`, fr: 'Installe les dépendances exactes du projet (npm ci).', en: 'Install the exact dependencies of the project (npm ci).' },
        { match: r`^npm\s+run\s+build\s*$`, fr: 'Construis le site statique dans dist/.', en: 'Build the static site into dist/.' },
        { match: r`^npm\s+(run\s+)?serve\s*$`, fr: 'Sers le site en local (npm run serve).', en: 'Serve the site locally (npm run serve).' },
        { match: r`^npm\s+(run\s+)?test\s*$|^npm\s+t\s*$`, fr: 'Lance les tests unitaires du moteur (npm test).', en: 'Run the engine unit tests (npm test).' },
      ],
    },
  },

  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'env-1',
      title: { fr: 'Fichiers, dossiers et chemins', en: 'Files, folders and paths' },
      skills: ['env.files'],
      minutes: 9,
      body: {
        fr: r`
<p>Avant de taper la moindre commande, il faut savoir <strong>où</strong> on est. Ton ordinateur range tout dans des <strong>fichiers</strong>, eux-mêmes rangés dans des <strong>dossiers</strong> (on dit aussi <em>répertoires</em>, <em>directories</em> en anglais), qui peuvent contenir d’autres dossiers. Cela forme un <strong>arbre</strong> : une racine, des branches, des feuilles.</p>

<div class="callout analogy">Pense à l’atelier : la fonderie (le disque <code>C:</code>), le bâtiment (<code>Users</code>), le bureau d’études (<code>alexis</code>), l’armoire (<code>3D-reader</code>), le tiroir (<code>web</code>), et enfin la fiche (<code>app.js</code>). Le <strong>chemin</strong>, c’est l’adresse complète pour retrouver la fiche.</div>

<h3>Le système d’exploitation</h3>
<p>Le <span class="term" data-term="os">système d’exploitation</span> (Windows, Linux, macOS) est le chef d’orchestre : il gère les fichiers, la mémoire, et lance les programmes. Windows et Linux n’écrivent pas les chemins de la même façon :</p>
<table>
<thead><tr><th></th><th>Windows</th><th>Linux / macOS</th></tr></thead>
<tbody>
<tr><td>Racine</td><td><code>C:\</code> (une lettre par disque)</td><td><code>/</code> (une seule racine)</td></tr>
<tr><td>Séparateur</td><td><code>\</code> (barre oblique inverse)</td><td><code>/</code> (barre oblique)</td></tr>
<tr><td>Dossier personnel</td><td><code>C:\Users\alexis</code></td><td><code>/home/alexis</code> ou <code>~</code></td></tr>
<tr><td>Majuscules</td><td><code>App.js</code> = <code>app.js</code></td><td><code>App.js</code> ≠ <code>app.js</code> !</td></tr>
</tbody>
</table>

<h3>Chemin absolu, chemin relatif</h3>
<ul>
<li><strong>Absolu</strong> : part de la racine. <code>C:\Users\alexis\3D-reader\web\app.js</code>. Il marche d’où que tu sois.</li>
<li><strong>Relatif</strong> : part du dossier où tu te trouves (le <em>dossier courant</em>). Si tu es dans <code>3D-reader</code>, le même fichier est simplement <code>web\app.js</code>.</li>
<li><code>.</code> veut dire « ici », <code>..</code> veut dire « le dossier parent » (un cran au-dessus).</li>
</ul>

~~~text title="L'arbre du dépôt 3D-reader (simplifié)"
3D-reader/                 «1»
├── .git/                  «2»
├── .gitignore
├── package.json           «3»
├── README.md
├── api/ai.js
├── reader3d/              (moteur Python)
├── scripts/build-web.mjs
├── tests/js/
└── web/
    ├── app.js
    └── engine/client.js   «4»
~~~
<ol class="notes">
<li>La racine du <span class="term" data-term="repo">dépôt</span> : tout le projet tient dans ce dossier.</li>
<li>Un dossier <strong>caché</strong> (son nom commence par un point) : Git y range tout l’historique. On n’y touche jamais à la main.</li>
<li>La fiche d’identité du projet JavaScript (on la verra en leçon 6).</li>
<li>Depuis <code>web/</code>, le chemin relatif de ce fichier est <code>engine/client.js</code> ; depuis <code>tests/js/</code>, c’est <code>../../web/engine/client.js</code>. C’est exactement ce qu’on lit dans les <code>import</code> des tests !</li>
</ol>

<h3>Extensions et fichiers cachés</h3>
<p>L’<strong>extension</strong> (<code>.js</code>, <code>.py</code>, <code>.json</code>, <code>.md</code>, <code>.yml</code>, <code>.stp</code>) indique le type de contenu. Windows la masque par défaut : active <em>Affichage → Extensions de noms de fichiers</em> dans l’Explorateur, c’est indispensable pour coder. Les fichiers qui commencent par un point (<code>.git</code>, <code>.gitignore</code>, <code>.devcontainer</code>) sont cachés par convention sous Linux ; <code>.gitignore</code> liste ce que Git doit ignorer (par exemple <code>node_modules/</code> ou <code>dist/</code>).</p>

<div class="callout project">Dans 3D Reader, les scripts Node utilisent <code>path.join()</code> plutôt que d’écrire les séparateurs à la main : le commentaire de <code>scripts/build-web.mjs</code> le dit, « il tourne pareil sous Linux, macOS et Windows ».</div>

<div class="callout warn">Évite les espaces et les accents dans les noms de dossiers de code (<code>Mes Documents\Projet é</code>) : beaucoup d’outils s’y prennent les pieds. Préfère <code>C:\dev\3D-reader</code>.</div>
`,
        en: r`
<p>Before typing any command you need to know <strong>where</strong> you are. Your computer stores everything in <strong>files</strong>, themselves stored in <strong>folders</strong> (also called <em>directories</em>), which can contain other folders. This forms a <strong>tree</strong>: a root, branches, leaves.</p>

<div class="callout analogy">Think of the plant: the foundry (drive <code>C:</code>), the building (<code>Users</code>), the design office (<code>alexis</code>), the cabinet (<code>3D-reader</code>), the drawer (<code>web</code>), and finally the sheet (<code>app.js</code>). The <strong>path</strong> is the full address to find the sheet.</div>

<h3>The operating system</h3>
<p>The <span class="term" data-term="os">operating system</span> (Windows, Linux, macOS) is the conductor: it manages files, memory, and starts programs. Windows and Linux do not write paths the same way:</p>
<table>
<thead><tr><th></th><th>Windows</th><th>Linux / macOS</th></tr></thead>
<tbody>
<tr><td>Root</td><td><code>C:\</code> (one letter per drive)</td><td><code>/</code> (a single root)</td></tr>
<tr><td>Separator</td><td><code>\</code> (backslash)</td><td><code>/</code> (slash)</td></tr>
<tr><td>Home folder</td><td><code>C:\Users\alexis</code></td><td><code>/home/alexis</code> or <code>~</code></td></tr>
<tr><td>Upper case</td><td><code>App.js</code> = <code>app.js</code></td><td><code>App.js</code> ≠ <code>app.js</code>!</td></tr>
</tbody>
</table>

<h3>Absolute path, relative path</h3>
<ul>
<li><strong>Absolute</strong>: starts from the root. <code>C:\Users\alexis\3D-reader\web\app.js</code>. It works wherever you are.</li>
<li><strong>Relative</strong>: starts from the folder you are in (the <em>current folder</em>). If you are in <code>3D-reader</code>, the same file is simply <code>web\app.js</code>.</li>
<li><code>.</code> means “here”, <code>..</code> means “the parent folder” (one level up).</li>
</ul>

~~~text title="The 3D-reader repository tree (simplified)"
3D-reader/                 «1»
├── .git/                  «2»
├── .gitignore
├── package.json           «3»
├── README.md
├── api/ai.js
├── reader3d/              (Python engine)
├── scripts/build-web.mjs
├── tests/js/
└── web/
    ├── app.js
    └── engine/client.js   «4»
~~~
<ol class="notes">
<li>The root of the <span class="term" data-term="repo">repository</span>: the whole project lives in this folder.</li>
<li>A <strong>hidden</strong> folder (its name starts with a dot): Git keeps the whole history there. Never touch it by hand.</li>
<li>The identity card of the JavaScript project (see lesson 6).</li>
<li>From <code>web/</code>, the relative path of this file is <code>engine/client.js</code>; from <code>tests/js/</code>, it is <code>../../web/engine/client.js</code>. That is exactly what you read in the tests’ <code>import</code> lines!</li>
</ol>

<h3>Extensions and hidden files</h3>
<p>The <strong>extension</strong> (<code>.js</code>, <code>.py</code>, <code>.json</code>, <code>.md</code>, <code>.yml</code>, <code>.stp</code>) tells the type of content. Windows hides it by default: turn on <em>View → File name extensions</em> in File Explorer, it is essential for coding. Files starting with a dot (<code>.git</code>, <code>.gitignore</code>, <code>.devcontainer</code>) are hidden by convention on Linux; <code>.gitignore</code> lists what Git must ignore (for example <code>node_modules/</code> or <code>dist/</code>).</p>

<div class="callout project">In 3D Reader, the Node scripts use <code>path.join()</code> instead of writing separators by hand: the comment of <code>scripts/build-web.mjs</code> says so, “it runs the same on Linux, macOS and Windows”.</div>

<div class="callout warn">Avoid spaces and accents in code folder names (<code>My Documents\Project é</code>): many tools trip over them. Prefer <code>C:\dev\3D-reader</code>.</div>
`,
      },
      deep: {
        fr: r`
<h3>Le chemin, c’est un GPS à l’intérieur de l’ordinateur</h3>
<p>Imagine que tu donnes rendez-vous à un collègue.</p>
<ul>
<li><strong>Adresse absolue</strong> : « 12 rue de la Fonderie, bâtiment B, 2ᵉ étage, bureau 4 ». N’importe qui, d’où qu’il parte, trouve.</li>
<li><strong>Adresse relative</strong> : « la porte à côté de la mienne ». Ça ne marche que si l’on sait où tu es !</li>
</ul>
<p>Un ordinateur fait exactement pareil. Le terminal a toujours un « dossier où je suis » (le <strong>dossier courant</strong>). Un chemin relatif se lit <em>à partir de là</em>.</p>

~~~text title="Lire un chemin relatif pas à pas"
Je suis dans :  C:\dev\3D-reader\tests\js
Je vise      :  ..\..\web\app.js

..        -> je monte dans  C:\dev\3D-reader\tests
..        -> je monte dans  C:\dev\3D-reader
web       -> je descends dans C:\dev\3D-reader\web
app.js    -> le fichier     C:\dev\3D-reader\web\app.js
~~~

<h3>Pourquoi deux sortes de barres ?</h3>
<p>Histoire : en 1981, MS-DOS utilisait déjà <code>/</code> pour les options des commandes (<code>dir /w</code>). Il a donc pris <code>\</code> pour séparer les dossiers. Linux, héritier d’Unix, a gardé <code>/</code>. Bonne nouvelle : PowerShell, Node.js, Python et Git acceptent presque toujours <code>/</code> même sous Windows. En cas de doute, écris <code>/</code>.</p>

<h3>Les trois erreurs classiques</h3>
<ol>
<li><strong>« Fichier introuvable »</strong> alors qu’il existe : tu n’es pas dans le bon dossier courant. Vérifie avec <code>cd</code> (cmd) ou <code>pwd</code> (PowerShell, bash).</li>
<li><strong>Majuscules</strong> : sous Windows <code>README.md</code> et <code>readme.md</code> c’est pareil ; dans la CI GitHub (Linux) non. Un test peut donc passer chez toi et échouer en ligne.</li>
<li><strong>Extension cachée</strong> : tu crois avoir <code>notes.txt</code>, tu as en réalité <code>notes.txt.txt</code>. Affiche les extensions !</li>
</ol>

<div class="callout tip">Astuce Windows : dans l’Explorateur, clique dans la barre d’adresse : le chemin absolu s’affiche en texte, prêt à copier. Et <kbd>Maj</kbd> + clic droit sur un fichier → « Copier en tant que chemin d’accès ».</div>

<h3>Les fichiers « point »</h3>
<p>Un nom qui commence par un point, c’est comme une armoire technique fermée : elle est là, elle sert, mais on ne l’affiche pas pour ne pas encombrer. <code>.git</code> est le coffre-fort de l’historique, <code>.gitignore</code> la liste « à ne pas ranger dans le coffre » (fichiers générés, gros fichiers, secrets).</p>
`,
        en: r`
<h3>A path is a GPS inside the computer</h3>
<p>Imagine you are meeting a colleague.</p>
<ul>
<li><strong>Absolute address</strong>: “12 Foundry Street, building B, 2nd floor, office 4”. Anyone, starting from anywhere, finds it.</li>
<li><strong>Relative address</strong>: “the door next to mine”. It only works if you know where I am!</li>
</ul>
<p>A computer does exactly the same. The terminal always has a “folder where I am” (the <strong>current folder</strong>). A relative path is read <em>from there</em>.</p>

~~~text title="Reading a relative path step by step"
I am in    :  C:\dev\3D-reader\tests\js
I target   :  ..\..\web\app.js

..        -> I go up to     C:\dev\3D-reader\tests
..        -> I go up to     C:\dev\3D-reader
web       -> I go down into C:\dev\3D-reader\web
app.js    -> the file       C:\dev\3D-reader\web\app.js
~~~

<h3>Why two kinds of slashes?</h3>
<p>History: in 1981 MS-DOS already used <code>/</code> for command options (<code>dir /w</code>). So it took <code>\</code> to separate folders. Linux, heir of Unix, kept <code>/</code>. Good news: PowerShell, Node.js, Python and Git almost always accept <code>/</code> even on Windows. When in doubt, write <code>/</code>.</p>

<h3>The three classic mistakes</h3>
<ol>
<li><strong>“File not found”</strong> although it exists: you are not in the right current folder. Check with <code>cd</code> (cmd) or <code>pwd</code> (PowerShell, bash).</li>
<li><strong>Upper case</strong>: on Windows <code>README.md</code> and <code>readme.md</code> are the same; in GitHub CI (Linux) they are not. A test can pass on your PC and fail online.</li>
<li><strong>Hidden extension</strong>: you think you have <code>notes.txt</code>, you actually have <code>notes.txt.txt</code>. Show the extensions!</li>
</ol>

<div class="callout tip">Windows tip: in File Explorer, click in the address bar: the absolute path shows as text, ready to copy. And <kbd>Shift</kbd> + right-click on a file → “Copy as path”.</div>

<h3>“Dot” files</h3>
<p>A name starting with a dot is like a closed technical cabinet: it is there, it is used, but it is not shown to avoid clutter. <code>.git</code> is the safe of the history, <code>.gitignore</code> the list of “do not put in the safe” (generated files, large files, secrets).</p>
`,
      },
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'env-2',
      title: { fr: 'Terminal, shell et l’invite de commande (cmd)', en: 'Terminal, shell and the Command Prompt (cmd)' },
      skills: ['env.cmd'],
      minutes: 10,
      body: {
        fr: r`
<p>Trois mots qu’on mélange tout le temps :</p>
<ul>
<li><strong>Le <span class="term" data-term="terminal">terminal</span></strong> (ou console) : la <em>fenêtre</em> noire où l’on tape du texte. Sous Windows : <em>Windows Terminal</em>, ou le terminal intégré de VS Code.</li>
<li><strong>Le <span class="term" data-term="shell">shell</span></strong> : le <em>programme</em> qui lit ta commande, la comprend et la fait exécuter. cmd, PowerShell et bash sont trois shells différents.</li>
<li><strong>La <span class="term" data-term="cli">ligne de commande</span></strong> (CLI) : la façon de piloter un programme en tapant du texte plutôt qu’en cliquant (<code>git</code>, <code>npm</code>, <code>node</code>, <code>claude</code> sont des CLI).</li>
</ul>

<div class="callout analogy">Le terminal, c’est le <strong>téléphone</strong> ; le shell, c’est la <strong>standardiste</strong> au bout du fil qui comprend ta demande et passe l’appel au bon service (git, node, python…). Tu peux changer de standardiste (cmd, PowerShell, bash) sans changer de téléphone.</div>

<h3>L’invite de commande : cmd.exe</h3>
<p>C’est le plus ancien shell de Windows (héritier de MS-DOS). On l’ouvre avec <kbd>Win</kbd> + <kbd>R</kbd> → <code>cmd</code>. L’<strong>invite</strong> (<em>prompt</em>) affiche le dossier courant puis <code>&gt;</code> : c’est là qu’on tape.</p>

~~~cmd title="Une petite session cmd"
C:\dev\3D-reader> dir                «1»
C:\dev\3D-reader> cd web             «2»
C:\dev\3D-reader\web> cd ..          «3»
C:\dev\3D-reader> type README.md     «4»
C:\dev\3D-reader> echo %USERNAME%    «5»
C:\dev\3D-reader> where node         «6»
C:\dev\3D-reader> cls                «7»
~~~
<ol class="notes">
<li><code>dir</code> liste fichiers et dossiers (avec taille et date).</li>
<li><code>cd</code> (<em>change directory</em>) entre dans un dossier. Le prompt change : on est ailleurs.</li>
<li><code>cd ..</code> remonte au dossier parent. <code>cd</code> seul affiche le dossier courant.</li>
<li><code>type</code> affiche le contenu d’un fichier texte.</li>
<li>Les variables s’écrivent entre <code>%</code> : <code>%USERNAME%</code>, <code>%PATH%</code>. <code>set</code> seul les liste toutes.</li>
<li><code>where</code> dit où se trouve le programme qui répondra à <code>node</code>.</li>
<li><code>cls</code> efface l’écran (rien n’est supprimé, juste l’affichage).</li>
</ol>

<h3>Anatomie d’une commande</h3>
~~~cmd
dir    /s     web\engine
 │      │        └── argument : sur quoi agir
 │      └── option (sous cmd : avec /)
 └── nom de la commande
~~~
<p>Sous cmd les options commencent par <code>/</code> (<code>dir /s</code>, <code>help dir</code> ou <code>dir /?</code> pour l’aide). Dans PowerShell et bash, ce sera plutôt <code>-</code>.</p>

<div data-widget="env-term-cmd"></div>

<div class="callout tip">Astuces qui font gagner un temps fou : <kbd>Tab</kbd> complète les noms de fichiers ; <kbd>↑</kbd> rappelle la commande précédente ; <kbd>Ctrl</kbd> + <kbd>C</kbd> interrompt une commande qui tourne (par exemple un serveur lancé avec <code>npm run serve</code>).</div>

<div class="callout info">Faut-il apprendre cmd ? Juste les bases : il est encore partout (scripts <code>.bat</code>, vieux tutoriels). Pour travailler au quotidien sous Windows, on préfère PowerShell (leçon suivante).</div>
`,
        en: r`
<p>Three words that are mixed up all the time:</p>
<ul>
<li><strong>The <span class="term" data-term="terminal">terminal</span></strong> (or console): the black <em>window</em> where you type text. On Windows: <em>Windows Terminal</em>, or VS Code’s integrated terminal.</li>
<li><strong>The <span class="term" data-term="shell">shell</span></strong>: the <em>program</em> that reads your command, understands it and has it run. cmd, PowerShell and bash are three different shells.</li>
<li><strong>The <span class="term" data-term="cli">command line</span></strong> (CLI): the way to drive a program by typing text instead of clicking (<code>git</code>, <code>npm</code>, <code>node</code>, <code>claude</code> are CLIs).</li>
</ul>

<div class="callout analogy">The terminal is the <strong>telephone</strong>; the shell is the <strong>operator</strong> on the line who understands your request and puts the call through to the right department (git, node, python…). You can change operator (cmd, PowerShell, bash) without changing telephone.</div>

<h3>The Command Prompt: cmd.exe</h3>
<p>It is Windows’ oldest shell (heir of MS-DOS). Open it with <kbd>Win</kbd> + <kbd>R</kbd> → <code>cmd</code>. The <strong>prompt</strong> shows the current folder then <code>&gt;</code>: that is where you type.</p>

~~~cmd title="A small cmd session"
C:\dev\3D-reader> dir                «1»
C:\dev\3D-reader> cd web             «2»
C:\dev\3D-reader\web> cd ..          «3»
C:\dev\3D-reader> type README.md     «4»
C:\dev\3D-reader> echo %USERNAME%    «5»
C:\dev\3D-reader> where node         «6»
C:\dev\3D-reader> cls                «7»
~~~
<ol class="notes">
<li><code>dir</code> lists files and folders (with size and date).</li>
<li><code>cd</code> (<em>change directory</em>) goes into a folder. The prompt changes: we are elsewhere.</li>
<li><code>cd ..</code> goes up to the parent folder. <code>cd</code> alone shows the current folder.</li>
<li><code>type</code> prints the contents of a text file.</li>
<li>Variables are written between <code>%</code>: <code>%USERNAME%</code>, <code>%PATH%</code>. <code>set</code> alone lists them all.</li>
<li><code>where</code> tells where the program that will answer <code>node</code> is.</li>
<li><code>cls</code> clears the screen (nothing is deleted, only the display).</li>
</ol>

<h3>Anatomy of a command</h3>
~~~cmd
dir    /s     web\engine
 │      │        └── argument: what to act on
 │      └── option (in cmd: with /)
 └── command name
~~~
<p>In cmd options start with <code>/</code> (<code>dir /s</code>, <code>help dir</code> or <code>dir /?</code> for help). In PowerShell and bash, it will rather be <code>-</code>.</p>

<div data-widget="env-term-cmd"></div>

<div class="callout tip">Huge time savers: <kbd>Tab</kbd> completes file names; <kbd>↑</kbd> recalls the previous command; <kbd>Ctrl</kbd> + <kbd>C</kbd> stops a running command (for example a server started with <code>npm run serve</code>).</div>

<div class="callout info">Should you learn cmd? Only the basics: it is still everywhere (<code>.bat</code> scripts, old tutorials). For day-to-day work on Windows, PowerShell is preferred (next lesson).</div>
`,
      },
      deep: {
        fr: r`
<h3>Le shell, un dialogue question → réponse</h3>
<p>Le terminal fonctionne comme un talkie-walkie très poli :</p>
<ol>
<li>Il affiche l’<strong>invite</strong> <code>C:\dev\3D-reader&gt;</code> : « Je suis ici, à toi. »</li>
<li>Tu tapes une phrase courte et tu appuies sur <kbd>Entrée</kbd>.</li>
<li>Le shell exécute, affiche le résultat (ou une erreur).</li>
<li>Il réaffiche l’invite : « À toi. »</li>
</ol>
<p>Tant que l’invite ne revient pas, la commande travaille encore (un serveur, par exemple, ne rend jamais la main : c’est normal, on l’arrête avec <kbd>Ctrl</kbd> + <kbd>C</kbd>).</p>

<h3>Une commande = verbe + complément</h3>
<p>Lis les commandes comme des phrases :</p>
<table>
<thead><tr><th>Commande</th><th>Phrase en français</th></tr></thead>
<tbody>
<tr><td><code>dir</code></td><td>« Montre-moi ce qu’il y a ici. »</td></tr>
<tr><td><code>cd web</code></td><td>« Entre dans le tiroir web. »</td></tr>
<tr><td><code>cd ..</code></td><td>« Ressors du tiroir. »</td></tr>
<tr><td><code>type README.md</code></td><td>« Lis-moi la fiche README.md. »</td></tr>
<tr><td><code>where node</code></td><td>« Où ranges-tu l’outil node ? »</td></tr>
<tr><td><code>echo %USERNAME%</code></td><td>« Répète-moi le contenu de la case USERNAME. »</td></tr>
</tbody>
</table>

<h3>Messages d’erreur fréquents (et quoi faire)</h3>
<ul>
<li><code>'nod' n'est pas reconnu en tant que commande interne...</code> → faute de frappe, ou le programme n’est pas installé / pas dans le PATH (leçon 5).</li>
<li><code>Le chemin d'accès spécifié est introuvable.</code> → le dossier n’existe pas <em>à partir d’ici</em>. Fais <code>dir</code> pour voir ce qui existe vraiment.</li>
<li><code>Le fichier spécifié est introuvable.</code> → même chose pour un fichier ; vérifie l’extension.</li>
</ul>

<div class="callout tip">Rien de ce que tu tapes dans <code>dir</code>, <code>cd</code>, <code>type</code>, <code>where</code>, <code>echo</code>, <code>cls</code> ne peut casser quoi que ce soit : ce sont des commandes de <strong>lecture</strong>. Les commandes dangereuses sont celles qui suppriment (<code>del</code>, <code>rmdir</code>) : celles-là, on les lit deux fois avant d’appuyer sur Entrée.</div>
`,
        en: r`
<h3>The shell, a question → answer dialogue</h3>
<p>The terminal works like a very polite walkie-talkie:</p>
<ol>
<li>It shows the <strong>prompt</strong> <code>C:\dev\3D-reader&gt;</code>: “I am here, over to you.”</li>
<li>You type a short sentence and press <kbd>Enter</kbd>.</li>
<li>The shell runs it, shows the result (or an error).</li>
<li>It shows the prompt again: “Over to you.”</li>
</ol>
<p>As long as the prompt does not come back, the command is still working (a server, for example, never gives control back: that is normal, stop it with <kbd>Ctrl</kbd> + <kbd>C</kbd>).</p>

<h3>A command = verb + object</h3>
<p>Read commands like sentences:</p>
<table>
<thead><tr><th>Command</th><th>Sentence in English</th></tr></thead>
<tbody>
<tr><td><code>dir</code></td><td>“Show me what is here.”</td></tr>
<tr><td><code>cd web</code></td><td>“Go into the web drawer.”</td></tr>
<tr><td><code>cd ..</code></td><td>“Come back out of the drawer.”</td></tr>
<tr><td><code>type README.md</code></td><td>“Read me the README.md sheet.”</td></tr>
<tr><td><code>where node</code></td><td>“Where do you keep the node tool?”</td></tr>
<tr><td><code>echo %USERNAME%</code></td><td>“Repeat to me what is in the USERNAME box.”</td></tr>
</tbody>
</table>

<h3>Frequent error messages (and what to do)</h3>
<ul>
<li><code>'nod' is not recognized as an internal or external command...</code> → typo, or the program is not installed / not in the PATH (lesson 5).</li>
<li><code>The system cannot find the path specified.</code> → the folder does not exist <em>from here</em>. Run <code>dir</code> to see what really exists.</li>
<li><code>The system cannot find the file specified.</code> → same for a file; check the extension.</li>
</ul>

<div class="callout tip">Nothing you type with <code>dir</code>, <code>cd</code>, <code>type</code>, <code>where</code>, <code>echo</code>, <code>cls</code> can break anything: they are <strong>read</strong> commands. The dangerous commands are the ones that delete (<code>del</code>, <code>rmdir</code>): read those twice before pressing Enter.</div>
`,
      },
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'env-3',
      title: { fr: 'PowerShell : des commandes qui parlent en objets', en: 'PowerShell: commands that speak in objects' },
      skills: ['env.powershell'],
      minutes: 12,
      body: {
        fr: r`
<p><span class="term" data-term="powershell">PowerShell</span> est le shell moderne de Windows (il existe aussi sous Linux et macOS : <em>PowerShell 7</em>, commande <code>pwsh</code>). C’est souvent lui qui s’ouvre par défaut dans Windows Terminal et dans VS Code. Son prompt commence par <code>PS</code> : <code>PS C:\dev\3D-reader&gt;</code>.</p>

<h3>Les cmdlets : Verbe-Nom</h3>
<p>Les commandes de PowerShell s’appellent des <strong>cmdlets</strong> et suivent toutes le même modèle <strong>Verbe-Nom</strong>, en anglais. Une fois le modèle compris, on devine les commandes !</p>
<table>
<thead><tr><th>Cmdlet</th><th>Alias</th><th>Rôle</th></tr></thead>
<tbody>
<tr><td><code>Get-Location</code></td><td><code>pwd</code></td><td>Où suis-je ?</td></tr>
<tr><td><code>Get-ChildItem</code></td><td><code>ls</code>, <code>dir</code>, <code>gci</code></td><td>Lister le contenu d’un dossier</td></tr>
<tr><td><code>Set-Location</code></td><td><code>cd</code></td><td>Changer de dossier</td></tr>
<tr><td><code>Get-Content</code></td><td><code>cat</code>, <code>type</code>, <code>gc</code></td><td>Lire un fichier</td></tr>
<tr><td><code>New-Item</code></td><td><code>ni</code> (<code>mkdir</code> pour un dossier)</td><td>Créer un fichier ou un dossier</td></tr>
<tr><td><code>Remove-Item</code></td><td><code>rm</code>, <code>del</code></td><td>Supprimer (attention !)</td></tr>
<tr><td><code>Write-Output</code></td><td><code>echo</code></td><td>Afficher un texte</td></tr>
<tr><td><code>Get-Command</code></td><td><code>gcm</code></td><td>Où est cette commande ?</td></tr>
<tr><td><code>Get-Help</code></td><td><code>help</code></td><td>Mode d’emploi d’une commande</td></tr>
</tbody>
</table>
<p>Les <strong>alias</strong> sont des surnoms : <code>ls</code> et <code>cat</code> existent pour que les habitués de bash se sentent chez eux. PowerShell ne fait pas de différence entre majuscules et minuscules : <code>get-childitem</code> marche aussi.</p>

<h3>Paramètres avec un tiret</h3>
~~~ps
Get-ChildItem -Path web\engine -Filter *.js -Recurse   «1»
Get-Content README.md -TotalCount 5                    «2»
~~~
<ol class="notes">
<li>Liste tous les fichiers <code>.js</code> de <code>web\engine</code> et de ses sous-dossiers. Chaque <code>-Nom</code> est un paramètre.</li>
<li>Seulement les 5 premières lignes du README.</li>
</ol>

<h3>La grande idée : le pipeline transporte des objets</h3>
<p>Le symbole <code>|</code> (<em>pipe</em>, tuyau) envoie le résultat d’une commande à la suivante. Dans bash, ce qui circule c’est du texte. Dans PowerShell, ce sont des <strong>objets</strong> avec des propriétés (<code>Name</code>, <code>Length</code>, <code>LastWriteTime</code>…), comme des fiches remplies :</p>
~~~ps title="Les 3 plus gros fichiers du moteur"
Get-ChildItem web\engine -Filter *.js |
  Sort-Object Length -Descending |
  Select-Object -First 3 Name, Length
~~~
<p>On a « trié par la propriété Length » sans découper de texte : c’est la force de PowerShell.</p>

<h3>Variables et variables d’environnement</h3>
~~~ps
$fichier = "web\app.js"          # une variable PowerShell commence par $
Get-Content $fichier -TotalCount 3
$env:PATH                        # une variable d'environnement : $env:NOM
$env:BASE_PATH = "/3D-reader"    # la définir pour cette session
~~~

<h3>La politique d’exécution</h3>
<p>Par sécurité, Windows peut refuser de lancer des scripts <code>.ps1</code> : message <em>« l’exécution de scripts est désactivée sur ce système »</em>. On le voit parfois avec <code>npm.ps1</code> ou l’activation d’un venv Python. La politique se consulte avec <code>Get-ExecutionPolicy</code>. La correction habituelle, pour ton seul compte :</p>
~~~ps
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
~~~
<div class="callout warn">Ne mets jamais <code>Unrestricted</code> ou <code>Bypass</code> pour toute la machine « pour que ça marche ». <code>RemoteSigned</code> autorise tes scripts locaux et exige une signature pour ceux téléchargés. En entreprise, demande au service informatique : la politique peut être imposée.</div>

<div data-widget="env-term-ps"></div>

<div class="callout tip"><code>Get-Help Get-ChildItem -Examples</code> montre des exemples prêts à copier. Lors de la première utilisation, <code>Update-Help</code> télécharge l’aide complète.</div>
`,
        en: r`
<p><span class="term" data-term="powershell">PowerShell</span> is Windows’ modern shell (it also exists on Linux and macOS: <em>PowerShell 7</em>, command <code>pwsh</code>). It is often what opens by default in Windows Terminal and VS Code. Its prompt starts with <code>PS</code>: <code>PS C:\dev\3D-reader&gt;</code>.</p>

<h3>Cmdlets: Verb-Noun</h3>
<p>PowerShell commands are called <strong>cmdlets</strong> and all follow the same <strong>Verb-Noun</strong> pattern. Once you get the pattern, you can guess the commands!</p>
<table>
<thead><tr><th>Cmdlet</th><th>Alias</th><th>Role</th></tr></thead>
<tbody>
<tr><td><code>Get-Location</code></td><td><code>pwd</code></td><td>Where am I?</td></tr>
<tr><td><code>Get-ChildItem</code></td><td><code>ls</code>, <code>dir</code>, <code>gci</code></td><td>List a folder’s contents</td></tr>
<tr><td><code>Set-Location</code></td><td><code>cd</code></td><td>Change folder</td></tr>
<tr><td><code>Get-Content</code></td><td><code>cat</code>, <code>type</code>, <code>gc</code></td><td>Read a file</td></tr>
<tr><td><code>New-Item</code></td><td><code>ni</code> (<code>mkdir</code> for a folder)</td><td>Create a file or folder</td></tr>
<tr><td><code>Remove-Item</code></td><td><code>rm</code>, <code>del</code></td><td>Delete (careful!)</td></tr>
<tr><td><code>Write-Output</code></td><td><code>echo</code></td><td>Print a text</td></tr>
<tr><td><code>Get-Command</code></td><td><code>gcm</code></td><td>Where is this command?</td></tr>
<tr><td><code>Get-Help</code></td><td><code>help</code></td><td>A command’s manual</td></tr>
</tbody>
</table>
<p><strong>Aliases</strong> are nicknames: <code>ls</code> and <code>cat</code> exist so that bash users feel at home. PowerShell does not care about upper or lower case: <code>get-childitem</code> works too.</p>

<h3>Parameters with a dash</h3>
~~~ps
Get-ChildItem -Path web\engine -Filter *.js -Recurse   «1»
Get-Content README.md -TotalCount 5                    «2»
~~~
<ol class="notes">
<li>Lists every <code>.js</code> file of <code>web\engine</code> and its subfolders. Each <code>-Name</code> is a parameter.</li>
<li>Only the first 5 lines of the README.</li>
</ol>

<h3>The big idea: the pipeline carries objects</h3>
<p>The <code>|</code> symbol (<em>pipe</em>) sends a command’s result to the next one. In bash, what flows is text. In PowerShell, it is <strong>objects</strong> with properties (<code>Name</code>, <code>Length</code>, <code>LastWriteTime</code>…), like filled-in forms:</p>
~~~ps title="The 3 largest engine files"
Get-ChildItem web\engine -Filter *.js |
  Sort-Object Length -Descending |
  Select-Object -First 3 Name, Length
~~~
<p>We “sorted by the Length property” without cutting any text: that is PowerShell’s strength.</p>

<h3>Variables and environment variables</h3>
~~~ps
$file = "web\app.js"             # a PowerShell variable starts with $
Get-Content $file -TotalCount 3
$env:PATH                        # an environment variable: $env:NAME
$env:BASE_PATH = "/3D-reader"    # set it for this session
~~~

<h3>The execution policy</h3>
<p>For safety, Windows may refuse to run <code>.ps1</code> scripts: message <em>“running scripts is disabled on this system”</em>. You sometimes see it with <code>npm.ps1</code> or when activating a Python venv. Check the policy with <code>Get-ExecutionPolicy</code>. The usual fix, for your account only:</p>
~~~ps
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
~~~
<div class="callout warn">Never set <code>Unrestricted</code> or <code>Bypass</code> for the whole machine “to make it work”. <code>RemoteSigned</code> allows your local scripts and requires a signature for downloaded ones. In a company, ask IT: the policy may be enforced.</div>

<div data-widget="env-term-ps"></div>

<div class="callout tip"><code>Get-Help Get-ChildItem -Examples</code> shows ready-to-copy examples. The first time, <code>Update-Help</code> downloads the full help.</div>
`,
      },
      deep: {
        fr: r`
<h3>Texte ou objets : la différence en image</h3>
<p>Imagine qu’on te transmet la liste des pièces coulées de la journée.</p>
<ul>
<li><strong>Façon bash / cmd</strong> : on te tend une <em>feuille imprimée</em>. Pour trouver la plus lourde, tu dois lire chaque ligne, repérer la colonne « masse », découper le texte…</li>
<li><strong>Façon PowerShell</strong> : on te tend un <em>tableur</em>. Chaque ligne est une fiche avec des colonnes nommées. « Trier par masse » = un clic.</li>
</ul>
~~~ps title="Lire un pipeline de gauche à droite"
Get-ChildItem web\engine      # 1. prends toutes les fiches (fichiers)
  | Sort-Object Length        # 2. trie-les par la colonne Length (taille)
  | Select-Object -Last 1     # 3. garde la dernière = la plus grosse
~~~

<h3>Deviner une commande</h3>
<p>Les verbes sont peu nombreux et toujours les mêmes : <code>Get</code> (lire), <code>Set</code> (régler), <code>New</code> (créer), <code>Remove</code> (supprimer), <code>Start</code>/<code>Stop</code>, <code>Test</code> (vérifier). Tu veux savoir si un fichier existe ? <code>Test-Path package.json</code> → <code>True</code>. Tu cherches toutes les commandes qui parlent de « Location » ? <code>Get-Command *Location*</code>.</p>

<h3>Le $ : deux usages à ne pas confondre</h3>
<table>
<thead><tr><th>Écriture</th><th>Signification</th></tr></thead>
<tbody>
<tr><td><code>$x = 5</code></td><td>Une variable à toi, qui vit dans ce terminal.</td></tr>
<tr><td><code>$env:PATH</code></td><td>Une variable <strong>d’environnement</strong>, transmise aux programmes lancés (node, npm…).</td></tr>
</tbody>
</table>

<h3>Le message rouge de la politique d’exécution</h3>
<p>C’est un vigile à l’entrée : par défaut il refuse tout script. <code>RemoteSigned</code> pour ton utilisateur revient à lui dire : « Les gens du bâtiment peuvent entrer ; les visiteurs extérieurs doivent montrer un badge signé. » C’est raisonnable. <code>Unrestricted</code>, c’est laisser la porte grande ouverte.</p>

<div class="callout tip">Si tu ne veux toucher à rien : dans PowerShell, tape <code>npm.cmd test</code> au lieu de <code>npm test</code>, ou ouvre un terminal cmd pour cette commande. Le résultat est le même.</div>
`,
        en: r`
<h3>Text or objects: the difference in a picture</h3>
<p>Imagine you are handed the list of the parts cast today.</p>
<ul>
<li><strong>bash / cmd way</strong>: you get a <em>printed sheet</em>. To find the heaviest, you must read each line, spot the “mass” column, cut the text…</li>
<li><strong>PowerShell way</strong>: you get a <em>spreadsheet</em>. Each row is a record with named columns. “Sort by mass” = one click.</li>
</ul>
~~~ps title="Reading a pipeline left to right"
Get-ChildItem web\engine      # 1. take all the records (files)
  | Sort-Object Length        # 2. sort them by the Length column (size)
  | Select-Object -Last 1     # 3. keep the last = the largest
~~~

<h3>Guessing a command</h3>
<p>Verbs are few and always the same: <code>Get</code> (read), <code>Set</code> (adjust), <code>New</code> (create), <code>Remove</code> (delete), <code>Start</code>/<code>Stop</code>, <code>Test</code> (check). Want to know whether a file exists? <code>Test-Path package.json</code> → <code>True</code>. Looking for every command about “Location”? <code>Get-Command *Location*</code>.</p>

<h3>The $: two uses not to mix up</h3>
<table>
<thead><tr><th>Writing</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>$x = 5</code></td><td>Your own variable, living in this terminal.</td></tr>
<tr><td><code>$env:PATH</code></td><td>An <strong>environment</strong> variable, passed on to the programs you start (node, npm…).</td></tr>
</tbody>
</table>

<h3>The red execution policy message</h3>
<p>It is a security guard at the door: by default it refuses every script. <code>RemoteSigned</code> for your user means telling it: “People from the building can come in; outside visitors must show a signed badge.” That is reasonable. <code>Unrestricted</code> is leaving the door wide open.</p>

<div class="callout tip">If you do not want to change anything: in PowerShell, type <code>npm.cmd test</code> instead of <code>npm test</code>, or open a cmd terminal for that command. The result is the same.</div>
`,
      },
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'env-4',
      title: { fr: 'bash et Linux : la langue des serveurs', en: 'bash and Linux: the language of servers' },
      skills: ['env.bash'],
      minutes: 11,
      body: {
        fr: r`
<p>Même si tu travailles sous Windows, ton code passe sa vie sous <strong>Linux</strong> : la <span class="term" data-term="ci">CI</span> GitHub tourne sur des machines <code>ubuntu-24.04</code> (regarde <code>runs-on</code> dans <code>.github/workflows/ci.yml</code>), le <span class="term" data-term="container">conteneur</span> cloud de Claude Code est un Linux, le Codespace du <code>.devcontainer</code> aussi. Leur shell : <span class="term" data-term="bash">bash</span>.</p>

<h3>Les commandes de base</h3>
~~~bash
pwd                      # «1»
ls -la                   # «2»
cd web/engine            # «3»
cd ..                    #    dossier parent ; cd ~ = dossier personnel
cat package.json         # «4»
which node               # «5»
export BASE_PATH=/3D-reader   # «6»
echo $BASE_PATH
~~~
<ol class="notes">
<li><em>print working directory</em> : où suis-je ? → <code>/home/user/3D-reader</code></li>
<li>Liste. <code>-l</code> = format long (droits, taille, date), <code>-a</code> = montre aussi les fichiers cachés (<code>.git</code>, <code>.gitignore</code>). Les options se combinent : <code>-la</code>.</li>
<li>Les chemins utilisent <code>/</code>. Et attention : <code>Web</code> ≠ <code>web</code> sous Linux.</li>
<li>Affiche un fichier (<em>concatenate</em>).</li>
<li>Équivalent de <code>where</code> (cmd) / <code>Get-Command</code> (PowerShell).</li>
<li>Crée une variable d’environnement. Pas d’espace autour du <code>=</code> ! On la lit avec <code>$NOM</code>.</li>
</ol>

<h3>Enchaîner : &amp;&amp; et |</h3>
<ul>
<li><code>A &amp;&amp; B</code> : lance B <strong>seulement si A a réussi</strong>. Le <code>.devcontainer/devcontainer.json</code> de 3D Reader en est plein : <code>pip install -r requirements-dev.txt &amp;&amp; npm ci &amp;&amp; npm run vendor</code>. Si l’installation Python échoue, on ne continue pas.</li>
<li><code>A | B</code> : le texte écrit par A devient l’entrée de B. <code>ls web/engine | grep worker</code> ne garde que les lignes contenant « worker ».</li>
<li><code>A &gt; fichier.txt</code> : écrit le résultat dans un fichier au lieu de l’écran.</li>
</ul>

<h3>Le grand tableau de correspondance</h3>
<table>
<thead><tr><th>Je veux…</th><th>cmd</th><th>PowerShell</th><th>bash</th></tr></thead>
<tbody>
<tr><td>Savoir où je suis</td><td><code>cd</code></td><td><code>Get-Location</code> (<code>pwd</code>)</td><td><code>pwd</code></td></tr>
<tr><td>Lister</td><td><code>dir</code></td><td><code>Get-ChildItem</code> (<code>ls</code>)</td><td><code>ls</code></td></tr>
<tr><td>Voir les cachés</td><td><code>dir /a</code></td><td><code>Get-ChildItem -Force</code></td><td><code>ls -a</code></td></tr>
<tr><td>Changer de dossier</td><td><code>cd web</code></td><td><code>Set-Location web</code> (<code>cd</code>)</td><td><code>cd web</code></td></tr>
<tr><td>Lire un fichier</td><td><code>type a.txt</code></td><td><code>Get-Content a.txt</code> (<code>cat</code>)</td><td><code>cat a.txt</code></td></tr>
<tr><td>Créer un dossier</td><td><code>mkdir d</code></td><td><code>New-Item -ItemType Directory d</code> (<code>mkdir</code>)</td><td><code>mkdir d</code></td></tr>
<tr><td>Supprimer un fichier</td><td><code>del a.txt</code></td><td><code>Remove-Item a.txt</code></td><td><code>rm a.txt</code></td></tr>
<tr><td>Lire une variable</td><td><code>echo %PATH%</code></td><td><code>$env:PATH</code></td><td><code>echo $PATH</code></td></tr>
<tr><td>Définir une variable</td><td><code>set X=1</code></td><td><code>$env:X = "1"</code></td><td><code>export X=1</code></td></tr>
<tr><td>Trouver un programme</td><td><code>where node</code></td><td><code>Get-Command node</code></td><td><code>which node</code></td></tr>
<tr><td>Effacer l’écran</td><td><code>cls</code></td><td><code>Clear-Host</code> (<code>cls</code>)</td><td><code>clear</code></td></tr>
<tr><td>Aide</td><td><code>dir /?</code></td><td><code>Get-Help dir</code></td><td><code>man ls</code> / <code>ls --help</code></td></tr>
</tbody>
</table>

<div class="callout info">Les commandes <code>git</code>, <code>node</code>, <code>npm</code>, <code>python</code>, <code>pytest</code> ne sont <strong>pas</strong> des commandes du shell : ce sont des programmes. Elles s’écrivent donc pareil dans les trois shells. C’est pour ça que le README de 3D Reader peut donner <code>npm ci</code> et <code>npm run build</code> sans préciser le shell.</div>

<div data-widget="env-term-bash"></div>

<div class="callout warn"><code>rm</code> sous Linux ne passe <strong>pas</strong> par une corbeille. <code>rm -rf dossier</code> efface tout, définitivement, sans demander. Relis toujours avant.</div>
`,
        en: r`
<p>Even if you work on Windows, your code spends its life on <strong>Linux</strong>: GitHub <span class="term" data-term="ci">CI</span> runs on <code>ubuntu-24.04</code> machines (look at <code>runs-on</code> in <code>.github/workflows/ci.yml</code>), Claude Code’s cloud <span class="term" data-term="container">container</span> is a Linux, and so is the Codespace from <code>.devcontainer</code>. Their shell: <span class="term" data-term="bash">bash</span>.</p>

<h3>The basic commands</h3>
~~~bash
pwd                      # «1»
ls -la                   # «2»
cd web/engine            # «3»
cd ..                    #    parent folder; cd ~ = home folder
cat package.json         # «4»
which node               # «5»
export BASE_PATH=/3D-reader   # «6»
echo $BASE_PATH
~~~
<ol class="notes">
<li><em>print working directory</em>: where am I? → <code>/home/user/3D-reader</code></li>
<li>List. <code>-l</code> = long format (permissions, size, date), <code>-a</code> = also show hidden files (<code>.git</code>, <code>.gitignore</code>). Options combine: <code>-la</code>.</li>
<li>Paths use <code>/</code>. And careful: <code>Web</code> ≠ <code>web</code> on Linux.</li>
<li>Prints a file (<em>concatenate</em>).</li>
<li>Equivalent of <code>where</code> (cmd) / <code>Get-Command</code> (PowerShell).</li>
<li>Creates an environment variable. No space around <code>=</code>! Read it with <code>$NAME</code>.</li>
</ol>

<h3>Chaining: &amp;&amp; and |</h3>
<ul>
<li><code>A &amp;&amp; B</code>: runs B <strong>only if A succeeded</strong>. 3D Reader’s <code>.devcontainer/devcontainer.json</code> is full of them: <code>pip install -r requirements-dev.txt &amp;&amp; npm ci &amp;&amp; npm run vendor</code>. If the Python install fails, it stops.</li>
<li><code>A | B</code>: the text written by A becomes B’s input. <code>ls web/engine | grep worker</code> keeps only the lines containing “worker”.</li>
<li><code>A &gt; file.txt</code>: writes the result into a file instead of the screen.</li>
</ul>

<h3>The big correspondence table</h3>
<table>
<thead><tr><th>I want to…</th><th>cmd</th><th>PowerShell</th><th>bash</th></tr></thead>
<tbody>
<tr><td>Know where I am</td><td><code>cd</code></td><td><code>Get-Location</code> (<code>pwd</code>)</td><td><code>pwd</code></td></tr>
<tr><td>List</td><td><code>dir</code></td><td><code>Get-ChildItem</code> (<code>ls</code>)</td><td><code>ls</code></td></tr>
<tr><td>See hidden files</td><td><code>dir /a</code></td><td><code>Get-ChildItem -Force</code></td><td><code>ls -a</code></td></tr>
<tr><td>Change folder</td><td><code>cd web</code></td><td><code>Set-Location web</code> (<code>cd</code>)</td><td><code>cd web</code></td></tr>
<tr><td>Read a file</td><td><code>type a.txt</code></td><td><code>Get-Content a.txt</code> (<code>cat</code>)</td><td><code>cat a.txt</code></td></tr>
<tr><td>Create a folder</td><td><code>mkdir d</code></td><td><code>New-Item -ItemType Directory d</code> (<code>mkdir</code>)</td><td><code>mkdir d</code></td></tr>
<tr><td>Delete a file</td><td><code>del a.txt</code></td><td><code>Remove-Item a.txt</code></td><td><code>rm a.txt</code></td></tr>
<tr><td>Read a variable</td><td><code>echo %PATH%</code></td><td><code>$env:PATH</code></td><td><code>echo $PATH</code></td></tr>
<tr><td>Set a variable</td><td><code>set X=1</code></td><td><code>$env:X = "1"</code></td><td><code>export X=1</code></td></tr>
<tr><td>Find a program</td><td><code>where node</code></td><td><code>Get-Command node</code></td><td><code>which node</code></td></tr>
<tr><td>Clear the screen</td><td><code>cls</code></td><td><code>Clear-Host</code> (<code>cls</code>)</td><td><code>clear</code></td></tr>
<tr><td>Help</td><td><code>dir /?</code></td><td><code>Get-Help dir</code></td><td><code>man ls</code> / <code>ls --help</code></td></tr>
</tbody>
</table>

<div class="callout info">The commands <code>git</code>, <code>node</code>, <code>npm</code>, <code>python</code>, <code>pytest</code> are <strong>not</strong> shell commands: they are programs. So they are written the same in all three shells. That is why 3D Reader’s README can give <code>npm ci</code> and <code>npm run build</code> without naming a shell.</div>

<div data-widget="env-term-bash"></div>

<div class="callout warn"><code>rm</code> on Linux does <strong>not</strong> go through a recycle bin. <code>rm -rf folder</code> deletes everything, permanently, without asking. Always read twice.</div>
`,
      },
      deep: {
        fr: r`
<h3>Pourquoi apprendre bash si je suis sous Windows ?</h3>
<p>Parce que dès que ton code quitte ton PC, il arrive chez Linux :</p>
~~~text
Ton PC (Windows, PowerShell)
   │  git push
   ▼
GitHub ──► CI : machine Ubuntu, bash  (npm test, npm run build...)
   │
   └─► Claude Code (cloud) : conteneur Linux, bash
~~~
<p>Quand tu lis un log de CI rouge ou ce que Claude Code a exécuté, c’est du bash. Savoir le lire, c’est savoir ce qui s’est passé.</p>

<h3>Lire &amp;&amp; comme « et si ça a marché, alors »</h3>
<p>Une recette de fonderie : « Préchauffer le moule <strong>et si c’est fait, alors</strong> couler <strong>et si c’est fait, alors</strong> démouler. » On ne coule pas dans un moule froid ! <code>&amp;&amp;</code> fait la même chose : à la première étape ratée, tout s’arrête.</p>
~~~bash
npm ci && npm run build && npm run serve
#  1. installer  2. construire   3. servir   (3 seulement si 1 et 2 ont réussi)
~~~

<h3>Lire | comme un tapis roulant</h3>
<p>Le résultat d’une machine tombe directement dans la suivante. <code>cat README.md | grep npm</code> : la première machine déroule tout le README, la seconde ne laisse passer que les lignes qui contiennent « npm ».</p>

<h3>Les pièges de débutant</h3>
<ul>
<li><code>export X = 1</code> (avec espaces) → erreur. Il faut <code>export X=1</code>.</li>
<li><code>cd Web</code> → « No such file or directory » : le dossier s’appelle <code>web</code>.</li>
<li><code>~</code> = ton dossier personnel, <code>/</code> = la racine de tout le disque. <code>cd /</code> t’envoie tout en haut de l’arbre.</li>
<li>Pour sortir d’un affichage long (<code>man</code>, <code>git log</code>), appuie sur <kbd>q</kbd>.</li>
</ul>
`,
        en: r`
<h3>Why learn bash if I am on Windows?</h3>
<p>Because as soon as your code leaves your PC, it lands on Linux:</p>
~~~text
Your PC (Windows, PowerShell)
   │  git push
   ▼
GitHub ──► CI: Ubuntu machine, bash  (npm test, npm run build...)
   │
   └─► Claude Code (cloud): Linux container, bash
~~~
<p>When you read a red CI log or what Claude Code ran, it is bash. Being able to read it means knowing what happened.</p>

<h3>Read &amp;&amp; as “and if that worked, then”</h3>
<p>A foundry recipe: “Preheat the die <strong>and if done, then</strong> pour <strong>and if done, then</strong> eject.” You do not pour into a cold die! <code>&amp;&amp;</code> does the same: at the first failed step, everything stops.</p>
~~~bash
npm ci && npm run build && npm run serve
#  1. install   2. build       3. serve   (3 only if 1 and 2 succeeded)
~~~

<h3>Read | as a conveyor belt</h3>
<p>One machine’s output drops straight into the next. <code>cat README.md | grep npm</code>: the first machine unrolls the whole README, the second lets only the lines containing “npm” through.</p>

<h3>Beginner traps</h3>
<ul>
<li><code>export X = 1</code> (with spaces) → error. It must be <code>export X=1</code>.</li>
<li><code>cd Web</code> → “No such file or directory”: the folder is called <code>web</code>.</li>
<li><code>~</code> = your home folder, <code>/</code> = the root of the whole disk. <code>cd /</code> sends you to the very top of the tree.</li>
<li>To leave a long display (<code>man</code>, <code>git log</code>), press <kbd>q</kbd>.</li>
</ul>
`,
      },
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'env-5',
      title: { fr: 'Variables d’environnement et PATH', en: 'Environment variables and PATH' },
      skills: ['env.variables'],
      minutes: 9,
      body: {
        fr: r`
<p>Une <span class="term" data-term="env-var">variable d’environnement</span> est une paire <strong>NOM = valeur</strong> que le système (ou le shell) donne à chaque programme qu’il lance. Le programme peut la lire pour adapter son comportement, sans qu’on modifie son code.</p>

<div class="callout analogy">C’est la <strong>fiche de poste</strong> affichée à côté d’une machine : « Alliage = AS7G, Température = … ». L’opérateur (le programme) est le même ; selon la fiche, il règle la machine différemment.</div>

<h3>Lire et définir</h3>
<table>
<thead><tr><th></th><th>cmd</th><th>PowerShell</th><th>bash</th></tr></thead>
<tbody>
<tr><td>Lire</td><td><code>echo %BASE_PATH%</code></td><td><code>$env:BASE_PATH</code></td><td><code>echo $BASE_PATH</code></td></tr>
<tr><td>Définir (cette fenêtre seulement)</td><td><code>set BASE_PATH=/3D-reader</code></td><td><code>$env:BASE_PATH = "/3D-reader"</code></td><td><code>export BASE_PATH=/3D-reader</code></td></tr>
<tr><td>Toutes les lister</td><td><code>set</code></td><td><code>Get-ChildItem env:</code></td><td><code>env</code></td></tr>
</tbody>
</table>
<p>Une variable définie ainsi disparaît quand on ferme le terminal. Pour la rendre permanente sous Windows : <em>Paramètres → Système → Informations → Paramètres avancés du système → Variables d’environnement</em>.</p>

<h3>Exemple réel : BASE_PATH dans le build</h3>
~~~yaml title=".github/workflows/ci.yml (extrait)"
- name: Build the static site
  run: npm run build
  env:
    BASE_PATH: /${'$'}{{ github.event.repository.name }}
~~~
~~~js title="Ce que fait le script de build (principe)"
const basePath = process.env.BASE_PATH || '/';   // lu dans l'environnement, '/' sinon
~~~
<p>Le site est publié sous <code>https://…github.io/3D-reader/</code> : il doit savoir qu’il vit dans le sous-dossier <code>/3D-reader</code>. Plutôt que d’écrire ce nom dans le code, la CI le passe par une variable. En Node, toutes les variables sont dans l’objet <code>process.env</code> ; en Python, dans <code>os.environ</code>.</p>

<h3>Les secrets : jamais dans le code</h3>
<p>La passerelle IA de 3D Reader (<code>api/ai.js</code>, sur Vercel) a besoin d’une clé pour parler au fournisseur de modèle. Son commentaire le dit : « configurée par variables d’environnement seulement : <code>AI_API_KEY</code> … <code>GROQ_API_KEY</code> … et le code d’accès <code>READER3D_ACCESS_CODE</code> ». La clé est saisie dans le tableau de bord Vercel, le code fait <code>process.env.AI_API_KEY</code>. Ainsi la clé n’apparaît jamais dans Git, ni dans le site public.</p>
<div class="callout warn">Règle d’or : une clé ou un mot de passe ne se colle <strong>jamais</strong> dans un fichier du dépôt, ni dans un chat, ni dans une capture d’écran. Si c’est arrivé : on considère la clé comme volée et on la régénère.</div>

<h3>PATH : comment le shell trouve un programme</h3>
<p>Quand tu tapes <code>node</code>, le shell ne fouille pas tout le disque. Il lit la variable <span class="term" data-term="path">PATH</span>, une liste de dossiers séparés par <code>;</code> (Windows) ou <code>:</code> (Linux), et les essaie <strong>dans l’ordre</strong> :</p>
~~~text
PATH = C:\Windows\system32;C:\Program Files\nodejs\;C:\Users\alexis\AppData\Local\Programs\Python\Python311\

node ?  -> C:\Windows\system32\node.exe        non
        -> C:\Program Files\nodejs\node.exe    OUI -> lancé !
~~~
<p>D’où le célèbre <em>« node n’est pas reconnu… »</em> : soit Node n’est pas installé, soit son dossier n’est pas dans le PATH. Après une installation, <strong>ferme et rouvre le terminal</strong> : il ne relit le PATH qu’à son ouverture. <code>where node</code> / <code>Get-Command node</code> / <code>which node</code> montrent quel fichier a été trouvé.</p>
`,
        en: r`
<p>An <span class="term" data-term="env-var">environment variable</span> is a <strong>NAME = value</strong> pair that the system (or the shell) gives to every program it starts. The program can read it to adapt its behaviour, without changing its code.</p>

<div class="callout analogy">It is the <strong>job sheet</strong> pinned next to a machine: “Alloy = AS7G, Temperature = …”. The operator (the program) is the same; depending on the sheet, they set the machine differently.</div>

<h3>Reading and setting</h3>
<table>
<thead><tr><th></th><th>cmd</th><th>PowerShell</th><th>bash</th></tr></thead>
<tbody>
<tr><td>Read</td><td><code>echo %BASE_PATH%</code></td><td><code>$env:BASE_PATH</code></td><td><code>echo $BASE_PATH</code></td></tr>
<tr><td>Set (this window only)</td><td><code>set BASE_PATH=/3D-reader</code></td><td><code>$env:BASE_PATH = "/3D-reader"</code></td><td><code>export BASE_PATH=/3D-reader</code></td></tr>
<tr><td>List them all</td><td><code>set</code></td><td><code>Get-ChildItem env:</code></td><td><code>env</code></td></tr>
</tbody>
</table>
<p>A variable set this way disappears when you close the terminal. To make it permanent on Windows: <em>Settings → System → About → Advanced system settings → Environment Variables</em>.</p>

<h3>Real example: BASE_PATH in the build</h3>
~~~yaml title=".github/workflows/ci.yml (excerpt)"
- name: Build the static site
  run: npm run build
  env:
    BASE_PATH: /${'$'}{{ github.event.repository.name }}
~~~
~~~js title="What the build script does (principle)"
const basePath = process.env.BASE_PATH || '/';   // read from the environment, '/' otherwise
~~~
<p>The site is published under <code>https://…github.io/3D-reader/</code>: it must know it lives in the <code>/3D-reader</code> subfolder. Instead of writing that name in the code, CI passes it through a variable. In Node, every variable is in the <code>process.env</code> object; in Python, in <code>os.environ</code>.</p>

<h3>Secrets: never in the code</h3>
<p>3D Reader’s AI gateway (<code>api/ai.js</code>, on Vercel) needs a key to talk to the model provider. Its comment says so: “configured by environment variables only: <code>AI_API_KEY</code> … <code>GROQ_API_KEY</code> … and the access code <code>READER3D_ACCESS_CODE</code>”. The key is entered in the Vercel dashboard, the code does <code>process.env.AI_API_KEY</code>. So the key never appears in Git, nor in the public site.</p>
<div class="callout warn">Golden rule: a key or password is <strong>never</strong> pasted into a repository file, a chat, or a screenshot. If it happened: consider the key stolen and regenerate it.</div>

<h3>PATH: how the shell finds a program</h3>
<p>When you type <code>node</code>, the shell does not search the whole disk. It reads the <span class="term" data-term="path">PATH</span> variable, a list of folders separated by <code>;</code> (Windows) or <code>:</code> (Linux), and tries them <strong>in order</strong>:</p>
~~~text
PATH = C:\Windows\system32;C:\Program Files\nodejs\;C:\Users\alexis\AppData\Local\Programs\Python\Python311\

node ?  -> C:\Windows\system32\node.exe        no
        -> C:\Program Files\nodejs\node.exe    YES -> started!
~~~
<p>Hence the famous <em>“node is not recognized…”</em>: either Node is not installed, or its folder is not in the PATH. After an install, <strong>close and reopen the terminal</strong>: it only reads PATH when it opens. <code>where node</code> / <code>Get-Command node</code> / <code>which node</code> show which file was found.</p>
`,
      },
      deep: {
        fr: r`
<h3>Le PATH, c’est l’annuaire du standard</h3>
<p>Tu appelles le standard : « Passez-moi node. » La standardiste (le shell) ouvre son annuaire (le PATH) et lit les services <strong>dans l’ordre</strong> : « Service system32 ? pas de node. Service nodejs ? oui ! Je vous le passe. » Si aucun service n’a de node : « Ce correspondant n’est pas reconnu. »</p>
<ul>
<li>Installer Node = embaucher quelqu’un. Mettre son dossier dans le PATH = l’inscrire dans l’annuaire.</li>
<li>Un terminal ouvert <em>avant</em> l’installation a un vieil annuaire photocopié : il faut en ouvrir un nouveau.</li>
<li>Deux versions installées ? C’est la première trouvée dans l’annuaire qui répond. <code>where node</code> les montre toutes, dans l’ordre.</li>
</ul>

<h3>Pourquoi les secrets vont dans l’environnement</h3>
~~~text
Dépôt Git (public !)          Vercel (privé)
api/ai.js                     Variables d'environnement
  key = process.env.AI_API_KEY   AI_API_KEY = ********
        └──────── lit au démarrage ───────┘
~~~
<p>Le code est une <em>recette</em> publiée ; la clé est la <em>clé du coffre</em>. On publie la recette « ouvrir le coffre avec la clé posée sur le bureau », jamais la clé elle-même. Chaque environnement (ton PC, la CI, Vercel) pose sa propre clé sur son bureau.</p>

<h3>Une variable n’existe que pour les enfants</h3>
<p>Quand tu fais <code>$env:BASE_PATH = "/3D-reader"</code> puis <code>npm run build</code>, npm (et le script Node qu’il lance) héritent de la variable : ce sont les « enfants » de ton terminal. Un autre terminal ouvert à côté ne la voit pas. Et quand tu fermes la fenêtre, elle disparaît.</p>

<div class="callout tip">Pour vérifier rapidement ce qu’un programme Node voit : <code>node -e "console.log(process.env.BASE_PATH)"</code>.</div>
`,
        en: r`
<h3>PATH is the switchboard’s directory</h3>
<p>You call the switchboard: “Put me through to node.” The operator (the shell) opens the directory (PATH) and reads the departments <strong>in order</strong>: “system32 department? no node. nodejs department? yes! Putting you through.” If no department has node: “This person is not recognized.”</p>
<ul>
<li>Installing Node = hiring someone. Putting its folder in PATH = listing them in the directory.</li>
<li>A terminal opened <em>before</em> the install has an old photocopied directory: open a new one.</li>
<li>Two versions installed? The first one found in the directory answers. <code>where node</code> shows them all, in order.</li>
</ul>

<h3>Why secrets go in the environment</h3>
~~~text
Git repository (public!)       Vercel (private)
api/ai.js                      Environment variables
  key = process.env.AI_API_KEY    AI_API_KEY = ********
        └──────── read at start-up ───────┘
~~~
<p>The code is a published <em>recipe</em>; the key is the <em>key to the safe</em>. You publish the recipe “open the safe with the key lying on the desk”, never the key itself. Each environment (your PC, CI, Vercel) puts its own key on its own desk.</p>

<h3>A variable only exists for the children</h3>
<p>When you do <code>$env:BASE_PATH = "/3D-reader"</code> then <code>npm run build</code>, npm (and the Node script it starts) inherit the variable: they are the “children” of your terminal. Another terminal opened next to it does not see it. And when you close the window, it disappears.</p>

<div class="callout tip">To quickly check what a Node program sees: <code>node -e "console.log(process.env.BASE_PATH)"</code>.</div>
`,
      },
    },

    // ------------------------------------------------------------------ 6
    {
      id: 'env-6',
      title: { fr: 'Les moteurs : Node.js, npm, Python et les navigateurs', en: 'The engines: Node.js, npm, Python and browsers' },
      skills: ['env.engines'],
      minutes: 13,
      body: {
        fr: r`
<p>Un fichier <code>.js</code> ou <code>.py</code> n’est que du texte. Pour qu’il « tourne », il faut un <span class="term" data-term="moteur">moteur</span> qui le lise et l’exécute. 3D Reader en utilise plusieurs.</p>

<h3>JavaScript : un langage, plusieurs moteurs</h3>
<table>
<thead><tr><th>Navigateur</th><th>Moteur de rendu (HTML/CSS)</th><th>Moteur JavaScript</th></tr></thead>
<tbody>
<tr><td>Chrome, Edge, Chromium</td><td>Blink</td><td>V8</td></tr>
<tr><td>Firefox</td><td>Gecko</td><td>SpiderMonkey</td></tr>
<tr><td>Safari</td><td>WebKit</td><td>JavaScriptCore</td></tr>
</tbody>
</table>
<p>Chaque navigateur exécute aussi le <span class="term" data-term="wasm">WebAssembly</span> : c’est ainsi qu’OpenCascade (écrit en C++) tourne dans la page de 3D Reader.</p>

<h3>Node.js : V8 sorti du navigateur</h3>
<p><span class="term" data-term="node">Node.js</span> prend le moteur V8 de Chrome et le fait tourner <strong>en dehors</strong> du navigateur, dans ton terminal. Pas de page, pas de bouton, mais accès aux fichiers et au réseau. 3D Reader s’en sert pour : construire le site (<code>scripts/build-web.mjs</code>), le servir en local (<code>scripts/serve.mjs</code>), lancer les tests (<code>node --test</code>), et faire tourner la passerelle IA sur Vercel. Le <code>package.json</code> exige <code>"node": "24.x"</code>.</p>
~~~bash
node -v                  # quelle version ? ex. v24.x
node scripts/serve.mjs   # exécuter un fichier JavaScript
~~~

<h3>npm, le magasin de pièces détachées</h3>
<p><span class="term" data-term="npm">npm</span> (installé avec Node) télécharge les bibliothèques dont le projet dépend et lance les scripts du projet. Tout est décrit dans <span class="term" data-term="package-json">package.json</span> :</p>
~~~json title="package.json de 3D Reader (extrait)"
{
  "type": "module",
  "scripts": {
    "build": "node scripts/build-web.mjs",
    "serve": "node scripts/serve.mjs",
    "test": "node --test tests/js/*.test.mjs",
    "test:e2e": "node --test tests/e2e/*.test.mjs"
  },
  "devDependencies": {
    "opencascade.js": "2.0.0-beta.b5ff984",
    "playwright": "^1.56.1",
    "three": "0.180.0"
  }
}
~~~
<ul>
<li><code>npm run build</code> exécute la ligne <code>"build"</code>, donc <code>node scripts/build-web.mjs</code>. <code>npm test</code> est un raccourci de <code>npm run test</code>.</li>
<li><code>devDependencies</code> : three.js (3D), opencascade.js (CAO en WebAssembly), Playwright (tests dans un navigateur).</li>
<li><code>node_modules/</code> : le dossier où npm dépose ces bibliothèques. Énorme, jamais commité (il est dans <code>.gitignore</code>).</li>
<li><code>package-lock.json</code> : la liste <strong>exacte</strong> des versions installées, pour que tout le monde ait les mêmes pièces.</li>
</ul>
<table>
<thead><tr><th><code>npm install</code></th><th><code>npm ci</code></th></tr></thead>
<tbody>
<tr><td>Installe et peut mettre à jour le <code>package-lock.json</code>. Pour ajouter une dépendance.</td><td>Efface <code>node_modules</code> et réinstalle exactement le lock, sans le modifier. Pour la CI et pour démarrer proprement.</td></tr>
</tbody>
</table>
<p><code>npx</code> lance un outil d’un paquet sans l’installer globalement : <code>npx playwright install chromium</code>.</p>

<h3>Python : l’interpréteur et le venv</h3>
<p>Le moteur Python de référence (<code>reader3d/</code>) s’exécute avec l’<span class="term" data-term="interpreteur">interpréteur</span> <code>python</code>. Ses bibliothèques (OpenCascade via <code>cadquery-ocp</code>, FastAPI, numpy, trimesh…) sont listées dans <code>requirements.txt</code> et s’installent avec <code>pip</code>, dans un <span class="term" data-term="venv">environnement virtuel</span> :</p>
~~~ps title="Windows, PowerShell"
python -m venv .venv               # crée une bulle Python propre au projet
.venv\Scripts\activate             # l'active (Linux : source .venv/bin/activate)
pip install -r requirements.txt
python -m reader3d serve           # puis http://127.0.0.1:8000
~~~

<h3>Playwright et le Chromium « sans tête »</h3>
<p>Les tests de bout en bout (<code>npm run test:e2e</code>) pilotent un vrai navigateur Chromium <span class="term" data-term="headless">sans tête</span> (<em>headless</em>) : il charge le site, clique, vérifie les résultats, mais n’affiche aucune fenêtre. C’est ce qui tourne dans la CI.</p>
`,
        en: r`
<p>A <code>.js</code> or <code>.py</code> file is just text. For it to “run”, you need an <span class="term" data-term="moteur">engine</span> that reads and executes it. 3D Reader uses several.</p>

<h3>JavaScript: one language, several engines</h3>
<table>
<thead><tr><th>Browser</th><th>Rendering engine (HTML/CSS)</th><th>JavaScript engine</th></tr></thead>
<tbody>
<tr><td>Chrome, Edge, Chromium</td><td>Blink</td><td>V8</td></tr>
<tr><td>Firefox</td><td>Gecko</td><td>SpiderMonkey</td></tr>
<tr><td>Safari</td><td>WebKit</td><td>JavaScriptCore</td></tr>
</tbody>
</table>
<p>Every browser also runs <span class="term" data-term="wasm">WebAssembly</span>: that is how OpenCascade (written in C++) runs inside 3D Reader’s page.</p>

<h3>Node.js: V8 out of the browser</h3>
<p><span class="term" data-term="node">Node.js</span> takes Chrome’s V8 engine and runs it <strong>outside</strong> the browser, in your terminal. No page, no button, but access to files and the network. 3D Reader uses it to: build the site (<code>scripts/build-web.mjs</code>), serve it locally (<code>scripts/serve.mjs</code>), run the tests (<code>node --test</code>), and run the AI gateway on Vercel. <code>package.json</code> requires <code>"node": "24.x"</code>.</p>
~~~bash
node -v                  # which version? e.g. v24.x
node scripts/serve.mjs   # run a JavaScript file
~~~

<h3>npm, the spare-parts store</h3>
<p><span class="term" data-term="npm">npm</span> (installed with Node) downloads the libraries the project depends on and runs the project’s scripts. Everything is described in <span class="term" data-term="package-json">package.json</span>:</p>
~~~json title="3D Reader's package.json (excerpt)"
{
  "type": "module",
  "scripts": {
    "build": "node scripts/build-web.mjs",
    "serve": "node scripts/serve.mjs",
    "test": "node --test tests/js/*.test.mjs",
    "test:e2e": "node --test tests/e2e/*.test.mjs"
  },
  "devDependencies": {
    "opencascade.js": "2.0.0-beta.b5ff984",
    "playwright": "^1.56.1",
    "three": "0.180.0"
  }
}
~~~
<ul>
<li><code>npm run build</code> runs the <code>"build"</code> line, i.e. <code>node scripts/build-web.mjs</code>. <code>npm test</code> is a shortcut for <code>npm run test</code>.</li>
<li><code>devDependencies</code>: three.js (3D), opencascade.js (CAD in WebAssembly), Playwright (tests in a browser).</li>
<li><code>node_modules/</code>: the folder where npm puts these libraries. Huge, never committed (it is in <code>.gitignore</code>).</li>
<li><code>package-lock.json</code>: the <strong>exact</strong> list of installed versions, so everyone has the same parts.</li>
</ul>
<table>
<thead><tr><th><code>npm install</code></th><th><code>npm ci</code></th></tr></thead>
<tbody>
<tr><td>Installs and may update <code>package-lock.json</code>. To add a dependency.</td><td>Deletes <code>node_modules</code> and reinstalls exactly the lock, without changing it. For CI and for a clean start.</td></tr>
</tbody>
</table>
<p><code>npx</code> runs a package’s tool without installing it globally: <code>npx playwright install chromium</code>.</p>

<h3>Python: the interpreter and the venv</h3>
<p>The reference Python engine (<code>reader3d/</code>) runs with the <code>python</code> <span class="term" data-term="interpreteur">interpreter</span>. Its libraries (OpenCascade through <code>cadquery-ocp</code>, FastAPI, numpy, trimesh…) are listed in <code>requirements.txt</code> and installed with <code>pip</code>, in a <span class="term" data-term="venv">virtual environment</span>:</p>
~~~ps title="Windows, PowerShell"
python -m venv .venv               # creates a Python bubble for the project
.venv\Scripts\activate             # activates it (Linux: source .venv/bin/activate)
pip install -r requirements.txt
python -m reader3d serve           # then http://127.0.0.1:8000
~~~

<h3>Playwright and “headless” Chromium</h3>
<p>The end-to-end tests (<code>npm run test:e2e</code>) drive a real <span class="term" data-term="headless">headless</span> Chromium browser: it loads the site, clicks, checks the results, but shows no window. That is what runs in CI.</p>
`,
      },
      deep: {
        fr: r`
<h3>Le code, c’est la partition ; le moteur, c’est le musicien</h3>
<p>Une partition (ton fichier <code>.js</code>) ne fait aucun bruit posée sur la table. Il faut un musicien pour la jouer. V8, SpiderMonkey et JavaScriptCore sont trois musiciens différents qui jouent la <em>même</em> partition JavaScript — chacun avec son style, mais le morceau est le même. Node.js, c’est le musicien V8 qui est sorti de la salle de concert (le navigateur) pour jouer dans l’atelier (ton terminal), avec accès aux outils de l’atelier (fichiers, réseau).</p>

<h3>Qui exécute quoi dans 3D Reader ?</h3>
<table>
<thead><tr><th>Partie</th><th>Moteur</th><th>Où</th></tr></thead>
<tbody>
<tr><td><code>web/app.js</code>, <code>web/engine/*.js</code></td><td>V8 / SpiderMonkey / JSC</td><td>Dans le navigateur du visiteur</td></tr>
<tr><td>OpenCascade (C++)</td><td>WebAssembly du navigateur</td><td>Dans un Web Worker de la page</td></tr>
<tr><td><code>scripts/build-web.mjs</code>, <code>tests/js/*.mjs</code></td><td>Node.js</td><td>Ton PC ou la CI</td></tr>
<tr><td><code>api/ai.js</code></td><td>Node.js</td><td>Serveur Vercel</td></tr>
<tr><td><code>reader3d/*.py</code></td><td>Interpréteur Python</td><td>Ton PC (serveur local) ou la CI</td></tr>
<tr><td><code>tests/e2e/*.mjs</code></td><td>Node.js qui pilote Chromium sans tête</td><td>Ton PC ou la CI</td></tr>
</tbody>
</table>

<h3>npm comme un magasinier</h3>
<ul>
<li><code>package.json</code> = la <strong>liste de besoins</strong> (« il me faut three.js version 0.180.0 »).</li>
<li><code>package-lock.json</code> = le <strong>bon de livraison</strong> exact, avec chaque vis et rondelle.</li>
<li><code>node_modules/</code> = le <strong>stock</strong> livré sur place. On ne l’envoie pas dans Git : n’importe qui peut le reconstituer à partir du bon de livraison.</li>
<li><code>npm ci</code> = « vide le stock et reprends exactement le bon de livraison » ; <code>npm install</code> = « complète le stock, quitte à refaire le bon ».</li>
</ul>

<h3>Le venv : un établi par projet</h3>
<p>Sans venv, toutes les bibliothèques Python s’entassent sur un établi commun ; deux projets qui veulent des versions différentes se marchent dessus. Le venv donne à chaque projet son propre établi (<code>.venv</code>). Quand il est activé, le prompt affiche <code>(.venv)</code> : c’est le signe que <code>python</code> et <code>pip</code> pointent vers cet établi.</p>
`,
        en: r`
<h3>Code is the score; the engine is the musician</h3>
<p>A score (your <code>.js</code> file) makes no sound lying on the table. You need a musician to play it. V8, SpiderMonkey and JavaScriptCore are three different musicians playing the <em>same</em> JavaScript score — each with its own style, but the piece is the same. Node.js is the V8 musician who left the concert hall (the browser) to play in the workshop (your terminal), with access to the workshop’s tools (files, network).</p>

<h3>Who runs what in 3D Reader?</h3>
<table>
<thead><tr><th>Part</th><th>Engine</th><th>Where</th></tr></thead>
<tbody>
<tr><td><code>web/app.js</code>, <code>web/engine/*.js</code></td><td>V8 / SpiderMonkey / JSC</td><td>In the visitor’s browser</td></tr>
<tr><td>OpenCascade (C++)</td><td>The browser’s WebAssembly</td><td>In a Web Worker of the page</td></tr>
<tr><td><code>scripts/build-web.mjs</code>, <code>tests/js/*.mjs</code></td><td>Node.js</td><td>Your PC or CI</td></tr>
<tr><td><code>api/ai.js</code></td><td>Node.js</td><td>Vercel server</td></tr>
<tr><td><code>reader3d/*.py</code></td><td>Python interpreter</td><td>Your PC (local server) or CI</td></tr>
<tr><td><code>tests/e2e/*.mjs</code></td><td>Node.js driving headless Chromium</td><td>Your PC or CI</td></tr>
</tbody>
</table>

<h3>npm as a storekeeper</h3>
<ul>
<li><code>package.json</code> = the <strong>list of needs</strong> (“I need three.js version 0.180.0”).</li>
<li><code>package-lock.json</code> = the exact <strong>delivery note</strong>, with every screw and washer.</li>
<li><code>node_modules/</code> = the <strong>stock</strong> delivered on site. It does not go into Git: anyone can rebuild it from the delivery note.</li>
<li><code>npm ci</code> = “empty the stock and take exactly the delivery note again”; <code>npm install</code> = “top up the stock, even if it means redoing the note”.</li>
</ul>

<h3>The venv: one workbench per project</h3>
<p>Without a venv, all Python libraries pile up on a shared workbench; two projects wanting different versions step on each other. The venv gives each project its own workbench (<code>.venv</code>). When it is activated, the prompt shows <code>(.venv)</code>: the sign that <code>python</code> and <code>pip</code> point to that workbench.</p>
`,
      },
    },

    // ------------------------------------------------------------------ 7
    {
      id: 'env-7',
      title: { fr: 'Les espaces de travail : où tourne quoi ?', en: 'Workspaces: what runs where?' },
      skills: ['env.workspaces'],
      minutes: 11,
      body: {
        fr: r`
<p>Le même code peut vivre à plusieurs endroits. Savoir <strong>où</strong> on est évite beaucoup de confusion (« ça marche chez moi mais pas dans la CI »).</p>

<h3>VS Code, l’établi du développeur</h3>
<p><span class="term" data-term="vs-code">Visual Studio Code</span> est un éditeur de code gratuit. On ouvre le <em>dossier</em> du projet (<code>code .</code> dans un terminal, ou Fichier → Ouvrir le dossier). Il offre :</p>
<ul>
<li>un <strong>terminal intégré</strong> (<kbd>Ctrl</kbd> + <kbd>ù</kbd> sur un clavier français, <kbd>Ctrl</kbd> + <kbd>&#96;</kbd> en anglais), dont on choisit le shell (PowerShell, cmd, Git Bash…) avec la petite flèche à côté du <kbd>+</kbd> ;</li>
<li>des <strong>extensions</strong> (Python, ESLint, Playwright, Claude Code…) ; le <code>.devcontainer</code> de 3D Reader recommande <code>ms-python.python</code> ;</li>
<li>un panneau <strong>Source Control</strong> pour Git (voir le module Git).</li>
</ul>

<h3>Le devcontainer : un PC tout prêt dans une boîte</h3>
<p>Un <span class="term" data-term="container">conteneur</span> est un petit Linux isolé, construit à partir d’une <em>image</em>. Le fichier <code>.devcontainer/devcontainer.json</code> de 3D Reader décrit un <span class="term" data-term="devcontainer">devcontainer</span> :</p>
~~~json title=".devcontainer/devcontainer.json (extrait)"
{
  "image": "mcr.microsoft.com/devcontainers/python:1-3.11-bookworm",
  "features": { "ghcr.io/devcontainers/features/node:1": { "version": "24" } },
  "postCreateCommand": "... && pip install -r requirements-dev.txt && npm ci && npm run vendor",
  "forwardPorts": [8000]
}
~~~
<p>Traduction : « Prends un Linux Debian avec Python 3.11, ajoute Node 24, installe les dépendances, et rends le port 8000 (le serveur Python) accessible. » GitHub Codespaces (bouton <em>Code → Codespaces</em>) ou VS Code avec Docker le construisent tout seuls : tout le monde a le même environnement.</p>

<h3>Claude Code : trois façons de le lancer</h3>
<table>
<thead><tr><th>Forme</th><th>Où le code s’exécute</th></tr></thead>
<tbody>
<tr><td><strong>CLI</strong> : <code>claude</code> dans ton terminal</td><td>Sur ton PC, dans le dossier ouvert</td></tr>
<tr><td><strong>Extension</strong> VS Code / JetBrains</td><td>Sur ton PC, dans l’éditeur</td></tr>
<tr><td><strong>Web / application</strong> (claude.ai/code)</td><td>Dans un <strong>conteneur cloud éphémère</strong> (Linux, bash) : le dépôt y est cloné, puis le conteneur est détruit après la session</td></tr>
</tbody>
</table>
<div class="callout warn">Conteneur éphémère = <strong>tout ce qui n’est pas commité et poussé sur GitHub est perdu</strong> à la fin. C’est pour ça que Claude Code fait un <code>git push</code> sur sa branche quand il a fini.</div>

<h3>La grande carte : où tourne quoi</h3>
~~~text
 Ton PC (Windows)                 GitHub                         Internet
 ─────────────────                ──────                         ────────
 VS Code + PowerShell  git push   Dépôt 3D-reader
 npm test / build      ───────►   Actions (CI, Ubuntu, bash)
 python -m reader3d               └─► Pages : site statique ───►  Navigateur du visiteur
                                                                   (V8 + WebAssembly)
 Claude Code (cloud) : conteneur Linux ─► push sur sa branche      Vercel : api/ai.js (Node)
~~~

<div data-widget="env-term-local"></div>

<div class="callout tip">Quand quelque chose échoue, pose-toi d’abord la question : <strong>sur quelle machine</strong>, <strong>dans quel shell</strong>, <strong>avec quel moteur</strong> ? La moitié des problèmes se résout là.</div>
`,
        en: r`
<p>The same code can live in several places. Knowing <strong>where</strong> you are avoids a lot of confusion (“it works on my machine but not in CI”).</p>

<h3>VS Code, the developer’s workbench</h3>
<p><span class="term" data-term="vs-code">Visual Studio Code</span> is a free code editor. You open the project <em>folder</em> (<code>code .</code> in a terminal, or File → Open Folder). It offers:</p>
<ul>
<li>an <strong>integrated terminal</strong> (<kbd>Ctrl</kbd> + <kbd>&#96;</kbd>), whose shell you choose (PowerShell, cmd, Git Bash…) with the small arrow next to <kbd>+</kbd>;</li>
<li><strong>extensions</strong> (Python, ESLint, Playwright, Claude Code…); 3D Reader’s <code>.devcontainer</code> recommends <code>ms-python.python</code>;</li>
<li>a <strong>Source Control</strong> panel for Git (see the Git module).</li>
</ul>

<h3>The devcontainer: a ready-made PC in a box</h3>
<p>A <span class="term" data-term="container">container</span> is a small isolated Linux, built from an <em>image</em>. 3D Reader’s <code>.devcontainer/devcontainer.json</code> file describes a <span class="term" data-term="devcontainer">devcontainer</span>:</p>
~~~json title=".devcontainer/devcontainer.json (excerpt)"
{
  "image": "mcr.microsoft.com/devcontainers/python:1-3.11-bookworm",
  "features": { "ghcr.io/devcontainers/features/node:1": { "version": "24" } },
  "postCreateCommand": "... && pip install -r requirements-dev.txt && npm ci && npm run vendor",
  "forwardPorts": [8000]
}
~~~
<p>Translation: “Take a Debian Linux with Python 3.11, add Node 24, install the dependencies, and make port 8000 (the Python server) reachable.” GitHub Codespaces (<em>Code → Codespaces</em> button) or VS Code with Docker build it by themselves: everyone gets the same environment.</p>

<h3>Claude Code: three ways to run it</h3>
<table>
<thead><tr><th>Form</th><th>Where the code runs</th></tr></thead>
<tbody>
<tr><td><strong>CLI</strong>: <code>claude</code> in your terminal</td><td>On your PC, in the open folder</td></tr>
<tr><td>VS Code / JetBrains <strong>extension</strong></td><td>On your PC, in the editor</td></tr>
<tr><td><strong>Web / app</strong> (claude.ai/code)</td><td>In an <strong>ephemeral cloud container</strong> (Linux, bash): the repository is cloned there, then the container is destroyed after the session</td></tr>
</tbody>
</table>
<div class="callout warn">Ephemeral container = <strong>anything not committed and pushed to GitHub is lost</strong> at the end. That is why Claude Code does a <code>git push</code> to its branch when it is done.</div>

<h3>The big map: what runs where</h3>
~~~text
 Your PC (Windows)                GitHub                         Internet
 ─────────────────                ──────                         ────────
 VS Code + PowerShell  git push   3D-reader repository
 npm test / build      ───────►   Actions (CI, Ubuntu, bash)
 python -m reader3d               └─► Pages: static site ─────►  Visitor's browser
                                                                   (V8 + WebAssembly)
 Claude Code (cloud): Linux container ─► push to its branch        Vercel: api/ai.js (Node)
~~~

<div data-widget="env-term-local"></div>

<div class="callout tip">When something fails, first ask yourself: <strong>on which machine</strong>, <strong>in which shell</strong>, <strong>with which engine</strong>? Half of the problems are solved right there.</div>
`,
      },
      deep: {
        fr: r`
<h3>Trois ateliers pour un même plan</h3>
<p>Imagine un plan de pièce (le code). On peut l’usiner :</p>
<ul>
<li><strong>Dans ton atelier</strong> (ton PC) : tes outils, tes réglages. Rapide, mais « chez toi » n’est pas forcément comme ailleurs.</li>
<li><strong>Dans un atelier en kit</strong> (le devcontainer / Codespace) : un atelier identique livré dans un conteneur, monté automatiquement à partir d’une notice (<code>devcontainer.json</code>). Tout le monde a exactement les mêmes machines.</li>
<li><strong>Chez un sous-traitant de passage</strong> (le conteneur cloud de Claude Code) : il monte un atelier temporaire, fait le travail, t’envoie la pièce (le <code>git push</code>)… puis démonte tout. Ce qu’il n’a pas envoyé disparaît.</li>
</ul>

<h3>Les ports : les portes du serveur</h3>
<p>Quand tu lances <code>npm run serve</code>, un petit serveur écoute sur un <strong>port</strong> de ta machine (par exemple <code>http://127.0.0.1:8080</code>). <code>127.0.0.1</code> (ou <code>localhost</code>) veut dire « cette machine-ci ». Le serveur Python de 3D Reader écoute, lui, sur le port 8000 ; le devcontainer « transfère » ce port pour que ton navigateur puisse l’ouvrir.</p>

<h3>La checklist « ça marche chez moi, pas dans la CI »</h3>
<ol>
<li><strong>Système</strong> : Windows chez toi, Linux dans la CI → majuscules des noms de fichiers, séparateurs de chemins.</li>
<li><strong>Version du moteur</strong> : <code>node -v</code> chez toi vs <code>node-version: "24"</code> dans le workflow.</li>
<li><strong>Dépendances</strong> : la CI fait <code>npm ci</code> (lock exact). Fais pareil.</li>
<li><strong>Variables d’environnement</strong> : la CI définit <code>BASE_PATH</code> ; chez toi elle est peut-être vide.</li>
<li><strong>Fichiers non commités</strong> : un fichier présent chez toi mais pas dans Git n’existe pas pour la CI.</li>
</ol>
`,
        en: r`
<h3>Three workshops for the same drawing</h3>
<p>Imagine a part drawing (the code). It can be machined:</p>
<ul>
<li><strong>In your own workshop</strong> (your PC): your tools, your settings. Fast, but “at your place” is not necessarily like elsewhere.</li>
<li><strong>In a workshop kit</strong> (the devcontainer / Codespace): an identical workshop delivered in a container, assembled automatically from instructions (<code>devcontainer.json</code>). Everyone has exactly the same machines.</li>
<li><strong>At a visiting subcontractor’s</strong> (Claude Code’s cloud container): they set up a temporary workshop, do the job, send you the part (the <code>git push</code>)… then take everything down. Whatever they did not send disappears.</li>
</ul>

<h3>Ports: the server’s doors</h3>
<p>When you run <code>npm run serve</code>, a small server listens on a <strong>port</strong> of your machine (for example <code>http://127.0.0.1:8080</code>). <code>127.0.0.1</code> (or <code>localhost</code>) means “this very machine”. 3D Reader’s Python server listens on port 8000; the devcontainer “forwards” that port so your browser can open it.</p>

<h3>The “works on my machine, not in CI” checklist</h3>
<ol>
<li><strong>System</strong>: Windows at home, Linux in CI → upper case of file names, path separators.</li>
<li><strong>Engine version</strong>: <code>node -v</code> at home vs <code>node-version: "24"</code> in the workflow.</li>
<li><strong>Dependencies</strong>: CI runs <code>npm ci</code> (exact lock). Do the same.</li>
<li><strong>Environment variables</strong>: CI sets <code>BASE_PATH</code>; at home it may be empty.</li>
<li><strong>Uncommitted files</strong>: a file present at home but not in Git does not exist for CI.</li>
</ol>
`,
      },
    },
  ],

  questions: [
    // ---------------------------------------------------------------- env-1 (files)
    {
      id: 'env-q1', skill: 'env.files', lesson: 'env-1', level: 1, type: 'mcq',
      prompt: { fr: 'Lequel de ces chemins est <strong>absolu</strong> ?', en: 'Which of these paths is <strong>absolute</strong>?' },
      choices: {
        fr: [r`web\app.js`, r`..\README.md`, r`C:\dev\3D-reader\web\app.js`, r`.\package.json`],
        en: [r`web\app.js`, r`..\README.md`, r`C:\dev\3D-reader\web\app.js`, r`.\package.json`],
      },
      answer: 2,
      explain: {
        fr: 'Un chemin absolu part de la racine (ici le disque <code>C:\\</code>). Les autres partent du dossier courant (<code>.</code> = ici, <code>..</code> = parent).',
        en: 'An absolute path starts from the root (here drive <code>C:\\</code>). The others start from the current folder (<code>.</code> = here, <code>..</code> = parent).',
      },
    },
    {
      id: 'env-q2', skill: 'env.files', lesson: 'env-1', level: 2, type: 'fill',
      prompt: {
        fr: 'Depuis le dossier <code>tests/js/</code>, complète le chemin relatif vers <code>web/engine/summary.js</code>.',
        en: 'From the <code>tests/js/</code> folder, complete the relative path to <code>web/engine/summary.js</code>.',
      },
      code: "import { summarize } from '____/web/engine/summary.js';",
      lang: 'js',
      accept: ['../..', '../../'],
      explain: {
        fr: '<code>..</code> remonte à <code>tests/</code>, un second <code>..</code> remonte à la racine du dépôt, puis on redescend dans <code>web/engine/</code>. C’est exactement la ligne des tests de 3D Reader.',
        en: '<code>..</code> goes up to <code>tests/</code>, a second <code>..</code> goes up to the repository root, then we go down into <code>web/engine/</code>. That is exactly the line in 3D Reader’s tests.',
      },
    },
    {
      id: 'env-q3', skill: 'env.files', lesson: 'env-1', level: 1, type: 'tf',
      prompt: {
        fr: 'Sous Linux (dans la CI GitHub), <code>App.js</code> et <code>app.js</code> désignent le même fichier.',
        en: 'On Linux (in GitHub CI), <code>App.js</code> and <code>app.js</code> are the same file.',
      },
      answer: false,
      explain: {
        fr: 'Linux est sensible à la casse : ce sont deux fichiers différents. Windows, lui, ne fait pas la différence — d’où des tests qui passent chez toi et échouent dans la CI.',
        en: 'Linux is case-sensitive: they are two different files. Windows does not care — hence tests that pass on your PC and fail in CI.',
      },
    },
    {
      id: 'env-q4', skill: 'env.files', lesson: 'env-1', level: 2, type: 'multi',
      prompt: { fr: 'Quels éléments sont des fichiers/dossiers « cachés » par convention ?', en: 'Which items are “hidden” files/folders by convention?' },
      choices: {
        fr: ['.git', 'README.md', '.gitignore', '.devcontainer', 'package.json'],
        en: ['.git', 'README.md', '.gitignore', '.devcontainer', 'package.json'],
      },
      answer: [0, 2, 3],
      explain: {
        fr: 'Un nom qui commence par un point est caché par convention (Linux, macOS). <code>.git</code> contient l’historique, <code>.gitignore</code> la liste des fichiers à ignorer, <code>.devcontainer</code> la description de l’environnement.',
        en: 'A name starting with a dot is hidden by convention (Linux, macOS). <code>.git</code> holds the history, <code>.gitignore</code> the list of files to ignore, <code>.devcontainer</code> the environment description.',
      },
    },

    // ---------------------------------------------------------------- env-2 (cmd)
    {
      id: 'env-q5', skill: 'env.cmd', lesson: 'env-2', level: 1, type: 'match',
      prompt: { fr: 'Associe chaque commande cmd à son rôle.', en: 'Match each cmd command with its role.' },
      pairs: {
        fr: [['dir', 'Lister le dossier'], ['cd ..', 'Remonter au dossier parent'], ['type README.md', 'Afficher un fichier'], ['cls', 'Effacer l’écran'], ['where node', 'Trouver un programme']],
        en: [['dir', 'List the folder'], ['cd ..', 'Go up to the parent folder'], ['type README.md', 'Print a file'], ['cls', 'Clear the screen'], ['where node', 'Find a program']],
      },
      explain: {
        fr: 'Les cinq commandes de base de cmd. Aucune ne modifie tes fichiers : on peut s’entraîner sans risque.',
        en: 'The five basic cmd commands. None of them changes your files: you can practise safely.',
      },
    },
    {
      id: 'env-q6', skill: 'env.cmd', lesson: 'env-2', level: 1, type: 'mcq',
      prompt: { fr: 'Quelle est la différence entre le <em>terminal</em> et le <em>shell</em> ?', en: 'What is the difference between the <em>terminal</em> and the <em>shell</em>?' },
      choices: {
        fr: ['Aucune, ce sont deux noms de la même chose', 'Le terminal est la fenêtre ; le shell est le programme qui interprète les commandes', 'Le shell est la fenêtre ; le terminal interprète les commandes', 'Le terminal n’existe que sous Linux'],
        en: ['None, they are two names for the same thing', 'The terminal is the window; the shell is the program that interprets commands', 'The shell is the window; the terminal interprets commands', 'The terminal only exists on Linux'],
      },
      answer: 1,
      explain: {
        fr: 'Le terminal (téléphone) affiche et transmet ; le shell (standardiste : cmd, PowerShell, bash) comprend et exécute. Windows Terminal peut héberger les trois shells.',
        en: 'The terminal (telephone) displays and transmits; the shell (operator: cmd, PowerShell, bash) understands and runs. Windows Terminal can host all three shells.',
      },
    },
    {
      id: 'env-q7', skill: 'env.cmd', lesson: 'env-2', level: 2, type: 'fill',
      prompt: { fr: 'Dans cmd, comment affiches-tu la valeur de la variable USERNAME ?', en: 'In cmd, how do you print the value of the USERNAME variable?' },
      code: 'echo ____',
      lang: 'cmd',
      accept: ['%USERNAME%', '%username%'],
      explain: {
        fr: 'Dans cmd, une variable se lit entre deux signes pourcentage : <code>%USERNAME%</code>. (PowerShell : <code>$env:USERNAME</code> ; bash : <code>$USER</code>.)',
        en: 'In cmd, a variable is read between two percent signs: <code>%USERNAME%</code>. (PowerShell: <code>$env:USERNAME</code>; bash: <code>$USER</code>.)',
      },
    },

    // ---------------------------------------------------------------- env-3 (powershell)
    {
      id: 'env-q8', skill: 'env.powershell', lesson: 'env-3', level: 1, type: 'mcq',
      prompt: { fr: 'Quel est le vrai nom PowerShell derrière l’alias <code>ls</code> ?', en: 'What is the real PowerShell name behind the <code>ls</code> alias?' },
      choices: { fr: ['List-Files', 'Get-ChildItem', 'Show-Folder', 'Get-Content'], en: ['List-Files', 'Get-ChildItem', 'Show-Folder', 'Get-Content'] },
      answer: 1,
      explain: {
        fr: '<code>Get-ChildItem</code> (« obtenir les éléments enfants ») liste le contenu d’un dossier. <code>ls</code>, <code>dir</code> et <code>gci</code> sont ses alias. <code>Get-Content</code> lit un fichier.',
        en: '<code>Get-ChildItem</code> (“get the child items”) lists a folder’s contents. <code>ls</code>, <code>dir</code> and <code>gci</code> are its aliases. <code>Get-Content</code> reads a file.',
      },
    },
    {
      id: 'env-q9', skill: 'env.powershell', lesson: 'env-3', level: 2, type: 'tf',
      prompt: {
        fr: 'Dans PowerShell, le pipeline <code>|</code> transmet des <strong>objets</strong> (avec des propriétés comme <code>Name</code> ou <code>Length</code>), pas seulement du texte.',
        en: 'In PowerShell, the <code>|</code> pipeline passes <strong>objects</strong> (with properties such as <code>Name</code> or <code>Length</code>), not just text.',
      },
      answer: true,
      explain: {
        fr: 'C’est la grande différence avec bash et cmd : on peut trier ou filtrer par propriété (<code>Sort-Object Length</code>) sans découper de texte.',
        en: 'That is the big difference with bash and cmd: you can sort or filter by property (<code>Sort-Object Length</code>) without cutting text.',
      },
    },
    {
      id: 'env-q10', skill: 'env.powershell', lesson: 'env-3', level: 2, type: 'mcq',
      prompt: {
        fr: 'PowerShell affiche : <em>« l’exécution de scripts est désactivée sur ce système »</em> quand tu tapes <code>npm test</code>. Quelle est la bonne réaction ?',
        en: 'PowerShell shows: <em>“running scripts is disabled on this system”</em> when you type <code>npm test</code>. What is the right reaction?',
      },
      choices: {
        fr: ['Set-ExecutionPolicy Unrestricted pour toute la machine', 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (ou utiliser npm.cmd)', 'Réinstaller Windows', 'Supprimer le dossier node_modules'],
        en: ['Set-ExecutionPolicy Unrestricted for the whole machine', 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (or use npm.cmd)', 'Reinstall Windows', 'Delete the node_modules folder'],
      },
      answer: 1,
      explain: {
        fr: '<code>RemoteSigned</code> pour ton seul utilisateur autorise les scripts locaux (comme <code>npm.ps1</code>) tout en gardant une protection pour les scripts téléchargés. <code>Unrestricted</code> ouvre tout : à éviter.',
        en: '<code>RemoteSigned</code> for your user only allows local scripts (like <code>npm.ps1</code>) while keeping protection for downloaded scripts. <code>Unrestricted</code> opens everything: avoid it.',
      },
    },
    {
      id: 'env-q11', skill: 'env.powershell', lesson: 'env-3', level: 1, type: 'fill',
      prompt: { fr: 'Complète la cmdlet qui affiche le dossier courant (modèle Verbe-Nom).', en: 'Complete the cmdlet that shows the current folder (Verb-Noun pattern).' },
      code: 'Get-____',
      lang: 'ps',
      accept: ['Location'],
      explain: {
        fr: '<code>Get-Location</code> (alias <code>pwd</code>). Son jumeau <code>Set-Location</code> (alias <code>cd</code>) change de dossier.',
        en: '<code>Get-Location</code> (alias <code>pwd</code>). Its twin <code>Set-Location</code> (alias <code>cd</code>) changes folder.',
      },
    },

    // ---------------------------------------------------------------- env-4 (bash)
    {
      id: 'env-q12', skill: 'env.bash', lesson: 'env-4', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque commande cmd à son équivalent bash.', en: 'Match each cmd command with its bash equivalent.' },
      pairs: {
        fr: [['dir', 'ls'], ['type a.txt', 'cat a.txt'], ['where node', 'which node'], ['cls', 'clear'], ['set X=1', 'export X=1']],
        en: [['dir', 'ls'], ['type a.txt', 'cat a.txt'], ['where node', 'which node'], ['cls', 'clear'], ['set X=1', 'export X=1']],
      },
      explain: {
        fr: 'Même intention, vocabulaire différent. Le grand tableau de la leçon 4 donne aussi la colonne PowerShell.',
        en: 'Same intent, different vocabulary. The big table of lesson 4 also gives the PowerShell column.',
      },
    },
    {
      id: 'env-q13', skill: 'env.bash', lesson: 'env-4', level: 2, type: 'mcq',
      prompt: { fr: 'Que fait <code>npm ci &amp;&amp; npm run build</code> ?', en: 'What does <code>npm ci &amp;&amp; npm run build</code> do?' },
      choices: {
        fr: ['Lance les deux commandes en même temps', 'Lance npm run build seulement si npm ci a réussi', 'Lance npm run build seulement si npm ci a échoué', 'Envoie le texte de npm ci à npm run build'],
        en: ['Runs both commands at the same time', 'Runs npm run build only if npm ci succeeded', 'Runs npm run build only if npm ci failed', 'Sends npm ci’s text to npm run build'],
      },
      answer: 1,
      explain: {
        fr: '<code>&amp;&amp;</code> = « et si ça a marché, alors ». Inutile de construire si l’installation a échoué. Envoyer le texte, c’est le rôle de <code>|</code>.',
        en: '<code>&amp;&amp;</code> = “and if that worked, then”. No point building if the install failed. Sending text is the job of <code>|</code>.',
      },
    },
    {
      id: 'env-q14', skill: 'env.bash', lesson: 'env-4', level: 1, type: 'mcq',
      prompt: { fr: 'Pourquoi apprendre à lire du bash quand on travaille sous Windows ?', en: 'Why learn to read bash when you work on Windows?' },
      choices: {
        fr: ['Parce que Windows va disparaître', 'Parce que la CI GitHub et le conteneur cloud de Claude Code tournent sous Linux avec bash', 'Parce que PowerShell ne sait pas lancer npm', 'Ce n’est pas utile'],
        en: ['Because Windows is going away', 'Because GitHub CI and Claude Code’s cloud container run Linux with bash', 'Because PowerShell cannot run npm', 'It is not useful'],
      },
      answer: 1,
      explain: {
        fr: '<code>runs-on: ubuntu-24.04</code> dans <code>ci.yml</code> : les logs de CI et les commandes exécutées par Claude Code dans le cloud sont du bash.',
        en: '<code>runs-on: ubuntu-24.04</code> in <code>ci.yml</code>: CI logs and the commands Claude Code runs in the cloud are bash.',
      },
    },

    // ---------------------------------------------------------------- env-5 (variables)
    {
      id: 'env-q15', skill: 'env.variables', lesson: 'env-5', level: 1, type: 'mcq',
      prompt: { fr: 'Où doit être rangée la clé API de la passerelle IA (<code>api/ai.js</code>) ?', en: 'Where must the AI gateway’s API key (<code>api/ai.js</code>) be stored?' },
      choices: {
        fr: ['Écrite dans api/ai.js', 'Dans un fichier cle.txt commité à côté', 'Dans une variable d’environnement configurée sur Vercel', 'Dans le README pour que l’équipe la trouve'],
        en: ['Written in api/ai.js', 'In a key.txt file committed next to it', 'In an environment variable set on Vercel', 'In the README so the team can find it'],
      },
      answer: 2,
      explain: {
        fr: 'Le code lit <code>process.env.AI_API_KEY</code> ; la valeur n’existe que dans les réglages de Vercel. Rien de secret dans Git, qui est public.',
        en: 'The code reads <code>process.env.AI_API_KEY</code>; the value only exists in Vercel’s settings. Nothing secret in Git, which is public.',
      },
    },
    {
      id: 'env-q16', skill: 'env.variables', lesson: 'env-5', level: 2, type: 'tf',
      prompt: {
        fr: 'Après avoir installé Node.js, un terminal resté ouvert depuis avant l’installation reconnaîtra forcément la commande <code>node</code>.',
        en: 'After installing Node.js, a terminal left open since before the install will necessarily recognize the <code>node</code> command.',
      },
      answer: false,
      explain: {
        fr: 'Le terminal lit le PATH à son ouverture : il garde l’ancien. Ferme-le et rouvre-en un nouveau.',
        en: 'The terminal reads PATH when it opens: it keeps the old one. Close it and open a new one.',
      },
    },
    {
      id: 'env-q17', skill: 'env.variables', lesson: 'env-5', level: 2, type: 'fill',
      prompt: { fr: 'En JavaScript (Node), dans quel objet lit-on les variables d’environnement ?', en: 'In JavaScript (Node), which object holds the environment variables?' },
      code: "const basePath = ____.BASE_PATH || '/';",
      lang: 'js',
      accept: ['process.env'],
      explain: {
        fr: '<code>process.env</code> contient toutes les variables d’environnement du processus Node. En Python : <code>os.environ</code>.',
        en: '<code>process.env</code> holds all the environment variables of the Node process. In Python: <code>os.environ</code>.',
      },
    },

    // ---------------------------------------------------------------- env-6 (engines)
    {
      id: 'env-q18', skill: 'env.engines', lesson: 'env-6', level: 1, type: 'mcq',
      prompt: { fr: 'Node.js, c’est…', en: 'Node.js is…' },
      choices: {
        fr: ['Un navigateur web', 'Le moteur JavaScript V8 qui tourne en dehors du navigateur', 'Un langage différent de JavaScript', 'Un éditeur de code'],
        en: ['A web browser', 'The V8 JavaScript engine running outside the browser', 'A language different from JavaScript', 'A code editor'],
      },
      answer: 1,
      explain: {
        fr: 'Même langage, même moteur (V8 de Chrome), mais dans ton terminal, avec accès aux fichiers. 3D Reader s’en sert pour le build, le serveur local et les tests.',
        en: 'Same language, same engine (Chrome’s V8), but in your terminal, with file access. 3D Reader uses it for the build, the local server and the tests.',
      },
    },
    {
      id: 'env-q19', skill: 'env.engines', lesson: 'env-6', level: 2, type: 'mcq',
      prompt: {
        fr: 'Avec ce <code>package.json</code>, que lance <code>npm run serve</code> ?',
        en: 'With this <code>package.json</code>, what does <code>npm run serve</code> run?',
      },
      code: '"scripts": {\n  "build": "node scripts/build-web.mjs",\n  "serve": "node scripts/serve.mjs",\n  "test": "node --test tests/js/*.test.mjs"\n}',
      lang: 'json',
      choices: {
        fr: ['node scripts/build-web.mjs', 'node scripts/serve.mjs', 'node --test tests/js/*.test.mjs', 'python -m reader3d serve'],
        en: ['node scripts/build-web.mjs', 'node scripts/serve.mjs', 'node --test tests/js/*.test.mjs', 'python -m reader3d serve'],
      },
      answer: 1,
      explain: {
        fr: '<code>npm run NOM</code> exécute la ligne <code>NOM</code> de <code>scripts</code>. Ici <code>serve</code> → <code>node scripts/serve.mjs</code>, le petit serveur statique.',
        en: '<code>npm run NAME</code> runs the <code>NAME</code> line of <code>scripts</code>. Here <code>serve</code> → <code>node scripts/serve.mjs</code>, the small static server.',
      },
    },
    {
      id: 'env-q20', skill: 'env.engines', lesson: 'env-6', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque navigateur à son moteur JavaScript.', en: 'Match each browser with its JavaScript engine.' },
      pairs: {
        fr: [['Chrome / Edge / Chromium', 'V8'], ['Firefox', 'SpiderMonkey'], ['Safari', 'JavaScriptCore'], ['Node.js', 'V8 (hors navigateur)']],
        en: [['Chrome / Edge / Chromium', 'V8'], ['Firefox', 'SpiderMonkey'], ['Safari', 'JavaScriptCore'], ['Node.js', 'V8 (outside the browser)']],
      },
      explain: {
        fr: 'Trois grands moteurs JavaScript jouent la même « partition ». Node.js réutilise V8.',
        en: 'Three major JavaScript engines play the same “score”. Node.js reuses V8.',
      },
    },
    {
      id: 'env-q21', skill: 'env.engines', lesson: 'env-6', level: 3, type: 'mcq',
      prompt: { fr: 'Quelle est la différence entre <code>npm ci</code> et <code>npm install</code> ?', en: 'What is the difference between <code>npm ci</code> and <code>npm install</code>?' },
      choices: {
        fr: ['Aucune', 'npm ci réinstalle exactement le package-lock.json sans le modifier ; npm install peut le mettre à jour', 'npm ci installe Python', 'npm install est réservé à la CI'],
        en: ['None', 'npm ci reinstalls exactly package-lock.json without changing it; npm install may update it', 'npm ci installs Python', 'npm install is reserved for CI'],
      },
      answer: 1,
      explain: {
        fr: '<code>npm ci</code> (<em>clean install</em>) efface <code>node_modules</code> et suit le lock à la lettre : c’est ce que fait la CI de 3D Reader. <code>npm install</code> sert à ajouter ou mettre à jour des dépendances.',
        en: '<code>npm ci</code> (<em>clean install</em>) deletes <code>node_modules</code> and follows the lock to the letter: that is what 3D Reader’s CI does. <code>npm install</code> is for adding or updating dependencies.',
      },
    },

    // ---------------------------------------------------------------- env-7 (workspaces)
    {
      id: 'env-q22', skill: 'env.workspaces', lesson: 'env-7', level: 1, type: 'tf',
      prompt: {
        fr: 'Dans Claude Code en version web, le travail non commité et non poussé est perdu quand le conteneur cloud est détruit.',
        en: 'In Claude Code on the web, uncommitted and unpushed work is lost when the cloud container is destroyed.',
      },
      answer: true,
      explain: {
        fr: 'Le conteneur est éphémère : seul ce qui est poussé sur GitHub survit. D’où le <code>git push</code> en fin de tâche.',
        en: 'The container is ephemeral: only what is pushed to GitHub survives. Hence the <code>git push</code> at the end of a task.',
      },
    },
    {
      id: 'env-q23', skill: 'env.workspaces', lesson: 'env-7', level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre les étapes pour lancer 3D Reader en local.', en: 'Put the steps to run 3D Reader locally in order.' },
      items: {
        fr: ['git clone https://github.com/alexdevanssay-cmyk/3D-reader', 'cd 3D-reader', 'npm ci', 'npm run build', 'npm run serve'],
        en: ['git clone https://github.com/alexdevanssay-cmyk/3D-reader', 'cd 3D-reader', 'npm ci', 'npm run build', 'npm run serve'],
      },
      explain: {
        fr: 'Récupérer le code, entrer dans son dossier, installer les dépendances, construire <code>dist/</code>, puis servir <code>dist/</code> (le README dit : <code>npm run build</code> d’abord).',
        en: 'Get the code, go into its folder, install the dependencies, build <code>dist/</code>, then serve <code>dist/</code> (the README says: <code>npm run build</code> first).',
      },
    },
    {
      id: 'env-q24', skill: 'env.workspaces', lesson: 'env-7', level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert le fichier <code>.devcontainer/devcontainer.json</code> ?', en: 'What is the <code>.devcontainer/devcontainer.json</code> file for?' },
      choices: {
        fr: ['À configurer GitHub Pages', 'À décrire un environnement de développement prêt à l’emploi (image Linux, Node, dépendances, ports)', 'À stocker les clés API', 'À lister les tests'],
        en: ['To configure GitHub Pages', 'To describe a ready-to-use development environment (Linux image, Node, dependencies, ports)', 'To store API keys', 'To list the tests'],
      },
      answer: 1,
      explain: {
        fr: 'Codespaces ou VS Code + Docker lisent ce fichier et montent automatiquement le même atelier pour tout le monde : Python 3.11, Node 24, dépendances installées, port 8000 transféré.',
        en: 'Codespaces or VS Code + Docker read this file and automatically set up the same workshop for everyone: Python 3.11, Node 24, dependencies installed, port 8000 forwarded.',
      },
    },

    // ================================================================ extra (remediation)
    // env.files
    {
      id: 'env-q25', skill: 'env.files', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie <code>..</code> dans un chemin ?', en: 'What does <code>..</code> mean in a path?' },
      choices: { fr: ['Le dossier courant', 'Le dossier parent', 'La racine du disque', 'Le dossier personnel'], en: ['The current folder', 'The parent folder', 'The root of the disk', 'The home folder'] },
      answer: 1,
      explain: { fr: '<code>..</code> = un cran au-dessus. <code>.</code> = ici. La racine c’est <code>C:\\</code> ou <code>/</code>, le dossier personnel <code>~</code>.', en: '<code>..</code> = one level up. <code>.</code> = here. The root is <code>C:\\</code> or <code>/</code>, the home folder <code>~</code>.' },
    },
    {
      id: 'env-q26', skill: 'env.files', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui est un chemin <strong>Linux</strong> absolu.', en: 'Click the line that is an absolute <strong>Linux</strong> path.' },
      code: r`web\engine\client.js
C:\Users\alexis\3D-reader
/home/user/3D-reader/web/app.js
../README.md`,
      lang: 'text',
      answer: 2,
      explain: { fr: 'Sous Linux, un chemin absolu commence par <code>/</code> (la racine unique) et utilise des <code>/</code>. La ligne 2 est un chemin absolu Windows.', en: 'On Linux, an absolute path starts with <code>/</code> (the single root) and uses <code>/</code>. Line 2 is a Windows absolute path.' },
    },
    {
      id: 'env-q27', skill: 'env.files', extra: true, level: 3, type: 'mcq',
      prompt: {
        fr: 'Je suis dans <code>C:\\dev\\3D-reader\\web\\engine</code>. Où mène <code>..\\..\\tests</code> ?',
        en: 'I am in <code>C:\\dev\\3D-reader\\web\\engine</code>. Where does <code>..\\..\\tests</code> lead?',
      },
      choices: {
        fr: [r`C:\dev\3D-reader\web\tests`, r`C:\dev\3D-reader\tests`, r`C:\dev\tests`, r`C:\tests`],
        en: [r`C:\dev\3D-reader\web\tests`, r`C:\dev\3D-reader\tests`, r`C:\dev\tests`, r`C:\tests`],
      },
      answer: 1,
      explain: { fr: 'Premier <code>..</code> → <code>web</code>, second <code>..</code> → <code>3D-reader</code>, puis on entre dans <code>tests</code>.', en: 'First <code>..</code> → <code>web</code>, second <code>..</code> → <code>3D-reader</code>, then into <code>tests</code>.' },
    },
    {
      id: 'env-q28', skill: 'env.files', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Le dossier <code>node_modules/</code> doit être listé dans <code>.gitignore</code> plutôt que commité.', en: 'The <code>node_modules/</code> folder should be listed in <code>.gitignore</code> rather than committed.' },
      answer: true,
      explain: { fr: 'Il est énorme et se reconstruit avec <code>npm ci</code> à partir de <code>package-lock.json</code>. Même chose pour <code>dist/</code> (produit par le build).', en: 'It is huge and rebuilt with <code>npm ci</code> from <code>package-lock.json</code>. Same for <code>dist/</code> (produced by the build).' },
    },
    // env.cmd
    {
      id: 'env-q29', skill: 'env.cmd', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'La commande <code>cls</code> supprime les fichiers du dossier courant.', en: 'The <code>cls</code> command deletes the files of the current folder.' },
      answer: false,
      explain: { fr: '<code>cls</code> efface seulement l’<em>affichage</em> de l’écran. Les fichiers ne bougent pas.', en: '<code>cls</code> only clears the screen <em>display</em>. Files are untouched.' },
    },
    {
      id: 'env-q30', skill: 'env.cmd', extra: true, level: 2, type: 'order',
      prompt: {
        fr: 'Tu es dans <code>C:\\dev\\3D-reader</code>. Remets dans l’ordre pour lire le fichier <code>web\\index.html</code> puis revenir.',
        en: 'You are in <code>C:\\dev\\3D-reader</code>. Put in order to read <code>web\\index.html</code> then come back.',
      },
      items: { fr: ['cd web', 'dir', 'type index.html', 'cd ..'], en: ['cd web', 'dir', 'type index.html', 'cd ..'] },
      explain: { fr: 'On entre dans le dossier, on regarde ce qu’il contient, on lit le fichier, on remonte.', en: 'Go into the folder, look at what it contains, read the file, go back up.' },
    },
    {
      id: 'env-q31', skill: 'env.cmd', extra: true, level: 2, type: 'mcq',
      prompt: {
        fr: "cmd répond : <em>« 'nodee' n’est pas reconnu en tant que commande interne ou externe »</em>. Cause la plus probable ?",
        en: "cmd answers: <em>“'nodee' is not recognized as an internal or external command”</em>. Most likely cause?",
      },
      choices: { fr: ['Le disque est plein', 'Une faute de frappe (ou programme absent du PATH)', 'Le fichier README.md est cassé', 'Il faut redémarrer GitHub'], en: ['The disk is full', 'A typo (or program missing from PATH)', 'README.md is broken', 'GitHub must be restarted'] },
      answer: 1,
      explain: { fr: '« nodee » au lieu de « node ». Si l’orthographe est bonne, le programme n’est pas installé ou pas dans le PATH.', en: '“nodee” instead of “node”. If the spelling is right, the program is not installed or not in PATH.' },
    },
    {
      id: 'env-q32', skill: 'env.cmd', extra: true, level: 1, type: 'fill',
      prompt: { fr: 'Quelle touche complète automatiquement un nom de fichier dans le terminal ?', en: 'Which key auto-completes a file name in the terminal?' },
      accept: { fr: ['Tab', 'Tabulation', 'Tabulation ↹'], en: ['Tab'] },
      explain: { fr: '<kbd>Tab</kbd> complète, <kbd>↑</kbd> rappelle la commande précédente, <kbd>Ctrl</kbd> + <kbd>C</kbd> interrompt.', en: '<kbd>Tab</kbd> completes, <kbd>↑</kbd> recalls the previous command, <kbd>Ctrl</kbd> + <kbd>C</kbd> interrupts.' },
    },
    // env.powershell
    {
      id: 'env-q33', skill: 'env.powershell', extra: true, level: 1, type: 'match',
      prompt: { fr: 'Associe chaque alias à sa cmdlet PowerShell.', en: 'Match each alias with its PowerShell cmdlet.' },
      pairs: {
        fr: [['cd', 'Set-Location'], ['pwd', 'Get-Location'], ['cat', 'Get-Content'], ['ls', 'Get-ChildItem'], ['echo', 'Write-Output']],
        en: [['cd', 'Set-Location'], ['pwd', 'Get-Location'], ['cat', 'Get-Content'], ['ls', 'Get-ChildItem'], ['echo', 'Write-Output']],
      },
      explain: { fr: 'Verbe-Nom : <code>Get</code> lit, <code>Set</code> règle, <code>Write</code> écrit. Les alias rendent PowerShell familier aux habitués de bash.', en: 'Verb-Noun: <code>Get</code> reads, <code>Set</code> adjusts, <code>Write</code> writes. Aliases make PowerShell familiar to bash users.' },
    },
    {
      id: 'env-q34', skill: 'env.powershell', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'Dans PowerShell, comment lis-tu la variable d’environnement PATH ?', en: 'In PowerShell, how do you read the PATH environment variable?' },
      code: '____',
      lang: 'ps',
      accept: ['$env:PATH', '$env:Path', 'echo $env:PATH', 'Write-Output $env:PATH'],
      explain: { fr: '<code>$env:NOM</code>. Ne pas confondre avec <code>%PATH%</code> (cmd) et <code>$PATH</code> (bash).', en: '<code>$env:NAME</code>. Not to be confused with <code>%PATH%</code> (cmd) and <code>$PATH</code> (bash).' },
    },
    {
      id: 'env-q35', skill: 'env.powershell', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Dans ce pipeline, clique sur la ligne qui <strong>trie</strong> les fichiers par taille.', en: 'In this pipeline, click the line that <strong>sorts</strong> the files by size.' },
      code: 'Get-ChildItem web\\engine -Filter *.js |\n  Where-Object Length -gt 50000 |\n  Sort-Object Length -Descending |\n  Select-Object -First 3 Name, Length',
      lang: 'ps',
      answer: 2,
      explain: { fr: '<code>Sort-Object Length</code> trie selon la propriété <code>Length</code>. <code>Where-Object</code> filtre, <code>Select-Object</code> garde les 3 premiers.', en: '<code>Sort-Object Length</code> sorts by the <code>Length</code> property. <code>Where-Object</code> filters, <code>Select-Object</code> keeps the first 3.' },
    },
    {
      id: 'env-q36', skill: 'env.powershell', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Comment obtenir des exemples d’utilisation de <code>Get-ChildItem</code> ?', en: 'How do you get usage examples of <code>Get-ChildItem</code>?' },
      choices: { fr: ['Get-ChildItem --examples', 'Get-Help Get-ChildItem -Examples', 'man.exe Get-ChildItem', 'Help-Me Get-ChildItem'], en: ['Get-ChildItem --examples', 'Get-Help Get-ChildItem -Examples', 'man.exe Get-ChildItem', 'Help-Me Get-ChildItem'] },
      answer: 1,
      explain: { fr: '<code>Get-Help</code> (alias <code>help</code>) avec le paramètre <code>-Examples</code>.', en: '<code>Get-Help</code> (alias <code>help</code>) with the <code>-Examples</code> parameter.' },
    },
    // env.bash
    {
      id: 'env-q37', skill: 'env.bash', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Quelle commande bash montre aussi les fichiers cachés (<code>.git</code>, <code>.gitignore</code>) ?', en: 'Which bash command also shows hidden files (<code>.git</code>, <code>.gitignore</code>)?' },
      choices: { fr: ['ls', 'ls -a', 'pwd -a', 'cat -a'], en: ['ls', 'ls -a', 'pwd -a', 'cat -a'] },
      answer: 1,
      explain: { fr: '<code>-a</code> = <em>all</em>. On combine souvent : <code>ls -la</code> (long + tout).', en: '<code>-a</code> = <em>all</em>. Often combined: <code>ls -la</code> (long + all).' },
    },
    {
      id: 'env-q38', skill: 'env.bash', extra: true, level: 2, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui contient une <strong>erreur</strong>.', en: 'Click the line that contains an <strong>error</strong>.' },
      code: 'cd web\nls engine\nexport BASE_PATH = /3D-reader\necho $BASE_PATH',
      lang: 'bash',
      answer: 2,
      explain: { fr: 'En bash, pas d’espaces autour du <code>=</code> : <code>export BASE_PATH=/3D-reader</code>.', en: 'In bash, no spaces around <code>=</code>: <code>export BASE_PATH=/3D-reader</code>.' },
    },
    {
      id: 'env-q39', skill: 'env.bash', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Sous Linux, <code>rm fichier</code> envoie le fichier dans la corbeille.', en: 'On Linux, <code>rm file</code> sends the file to the recycle bin.' },
      answer: false,
      explain: { fr: '<code>rm</code> supprime définitivement, sans corbeille. Prudence, surtout avec <code>rm -rf</code>.', en: '<code>rm</code> deletes permanently, no recycle bin. Careful, especially with <code>rm -rf</code>.' },
    },
    {
      id: 'env-q40', skill: 'env.bash', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Que fait <code>ls web/engine | grep worker</code> ?', en: 'What does <code>ls web/engine | grep worker</code> do?' },
      choices: {
        fr: ['Supprime les workers', 'Liste web/engine puis ne garde que les lignes contenant « worker »', 'Lance les Web Workers', 'Crée un fichier worker'],
        en: ['Deletes the workers', 'Lists web/engine then keeps only the lines containing “worker”', 'Starts the Web Workers', 'Creates a worker file'],
      },
      answer: 1,
      explain: { fr: 'Le <code>|</code> passe le texte de <code>ls</code> à <code>grep</code>, qui filtre. Résultat : <code>worker.js</code>, <code>partworker.js</code>, <code>thickworker.js</code>…', en: 'The <code>|</code> passes <code>ls</code>’s text to <code>grep</code>, which filters. Result: <code>worker.js</code>, <code>partworker.js</code>, <code>thickworker.js</code>…' },
    },
    // env.variables
    {
      id: 'env-q41', skill: 'env.variables', extra: true, level: 1, type: 'match',
      prompt: { fr: 'Associe le shell à la façon de lire la variable PATH.', en: 'Match the shell with the way to read the PATH variable.' },
      pairs: {
        fr: [['cmd', 'echo %PATH%'], ['PowerShell', '$env:PATH'], ['bash', 'echo $PATH'], ['Node.js', 'process.env.PATH']],
        en: [['cmd', 'echo %PATH%'], ['PowerShell', '$env:PATH'], ['bash', 'echo $PATH'], ['Node.js', 'process.env.PATH']],
      },
      explain: { fr: 'Même variable, quatre écritures. Le programme Node lancé depuis le shell hérite des mêmes valeurs.', en: 'Same variable, four spellings. The Node program started from the shell inherits the same values.' },
    },
    {
      id: 'env-q42', skill: 'env.variables', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Le PATH contient deux dossiers avec un <code>node.exe</code>. Lequel est lancé quand tu tapes <code>node</code> ?', en: 'PATH contains two folders with a <code>node.exe</code>. Which one runs when you type <code>node</code>?' },
      choices: { fr: ['Le plus récent', 'Le premier trouvé dans l’ordre du PATH', 'Le plus gros', 'Les deux à la fois'], en: ['The most recent', 'The first one found in PATH order', 'The largest', 'Both at once'] },
      answer: 1,
      explain: { fr: 'Le shell parcourt le PATH dans l’ordre et s’arrête au premier trouvé. <code>where node</code> liste les candidats dans cet ordre.', en: 'The shell walks PATH in order and stops at the first match. <code>where node</code> lists the candidates in that order.' },
    },
    {
      id: 'env-q43', skill: 'env.variables', extra: true, level: 2, type: 'tf',
      prompt: { fr: 'Une variable définie avec <code>$env:X = "1"</code> dans un terminal est visible dans tous les autres terminaux ouverts.', en: 'A variable set with <code>$env:X = "1"</code> in one terminal is visible in all the other open terminals.' },
      answer: false,
      explain: { fr: 'Elle n’existe que dans ce terminal et les programmes qu’il lance (ses « enfants »). Elle disparaît à la fermeture.', en: 'It only exists in that terminal and the programs it starts (its “children”). It disappears when it closes.' },
    },
    {
      id: 'env-q44', skill: 'env.variables', extra: true, level: 3, type: 'multi',
      prompt: { fr: 'Que faire si une clé API a été commitée par erreur dans le dépôt ?', en: 'What to do if an API key was committed to the repository by mistake?' },
      choices: {
        fr: ['La considérer comme compromise et la régénérer chez le fournisseur', 'Mettre la nouvelle clé dans une variable d’environnement (Vercel)', 'Juste supprimer la ligne dans un nouveau commit et continuer avec la même clé', 'La publier dans le README pour que tout le monde soit au courant'],
        en: ['Consider it compromised and regenerate it at the provider', 'Put the new key in an environment variable (Vercel)', 'Just delete the line in a new commit and keep the same key', 'Publish it in the README so everyone knows'],
      },
      answer: [0, 1],
      explain: { fr: 'L’historique Git garde l’ancienne version : supprimer la ligne ne suffit pas. On révoque, on régénère, et la nouvelle clé va dans l’environnement.', en: 'Git history keeps the old version: deleting the line is not enough. Revoke, regenerate, and the new key goes into the environment.' },
    },
    // env.engines
    {
      id: 'env-q45', skill: 'env.engines', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Le dossier <code>node_modules/</code> est créé par npm et contient les bibliothèques téléchargées.', en: 'The <code>node_modules/</code> folder is created by npm and holds the downloaded libraries.' },
      answer: true,
      explain: { fr: 'C’est le « stock » livré. On le recrée avec <code>npm ci</code>.', en: 'It is the delivered “stock”. Recreate it with <code>npm ci</code>.' },
    },
    {
      id: 'env-q46', skill: 'env.engines', extra: true, level: 2, type: 'order',
      prompt: { fr: 'Remets dans l’ordre pour lancer le serveur Python de 3D Reader sous Windows.', en: 'Put in order to start 3D Reader’s Python server on Windows.' },
      items: {
        fr: ['python -m venv .venv', r`.venv\Scripts\activate`, 'pip install -r requirements.txt', 'python -m reader3d serve'],
        en: ['python -m venv .venv', r`.venv\Scripts\activate`, 'pip install -r requirements.txt', 'python -m reader3d serve'],
      },
      explain: { fr: 'Créer l’établi (venv), s’y installer (activer), y ranger les outils (pip install), puis travailler (lancer le serveur, port 8000).', en: 'Create the workbench (venv), step onto it (activate), store the tools there (pip install), then work (start the server, port 8000).' },
    },
    {
      id: 'env-q47', skill: 'env.engines', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que veut dire « Chromium sans tête » (headless) dans les tests e2e ?', en: 'What does “headless Chromium” mean in the e2e tests?' },
      choices: {
        fr: ['Un navigateur sans moteur JavaScript', 'Un vrai navigateur qui charge le site et clique, sans afficher de fenêtre', 'Une version de Chrome sans Internet', 'Un faux navigateur qui ne lit que le HTML'],
        en: ['A browser without a JavaScript engine', 'A real browser that loads the site and clicks, without showing a window', 'A version of Chrome without Internet', 'A fake browser that only reads HTML'],
      },
      answer: 1,
      explain: { fr: 'Playwright pilote un vrai Chromium (Blink + V8 + WebAssembly), mais sans interface graphique : parfait pour la CI.', en: 'Playwright drives a real Chromium (Blink + V8 + WebAssembly), but without a GUI: perfect for CI.' },
    },
    {
      id: 'env-q48', skill: 'env.engines', extra: true, level: 3, type: 'match',
      prompt: { fr: 'Associe chaque partie de 3D Reader au moteur qui l’exécute.', en: 'Match each part of 3D Reader with the engine that runs it.' },
      pairs: {
        fr: [['web/app.js', 'Moteur JS du navigateur'], ['OpenCascade (C++)', 'WebAssembly'], ['reader3d/*.py', 'Interpréteur Python'], ['api/ai.js', 'Node.js sur Vercel'], ['tests/js/*.test.mjs', 'Node.js (node --test)']],
        en: [['web/app.js', 'Browser JS engine'], ['OpenCascade (C++)', 'WebAssembly'], ['reader3d/*.py', 'Python interpreter'], ['api/ai.js', 'Node.js on Vercel'], ['tests/js/*.test.mjs', 'Node.js (node --test)']],
      },
      explain: { fr: 'Le même projet mobilise quatre moteurs. Savoir lequel exécute quoi aide à lire les erreurs.', en: 'The same project uses four engines. Knowing which one runs what helps read the errors.' },
    },
    // env.workspaces
    {
      id: 'env-q49', skill: 'env.workspaces', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Quelle commande ouvre le dossier courant dans VS Code ?', en: 'Which command opens the current folder in VS Code?' },
      choices: { fr: ['code .', 'vscode open', 'open code', 'npm code'], en: ['code .', 'vscode open', 'open code', 'npm code'] },
      answer: 0,
      explain: { fr: '<code>code</code> est la CLI de VS Code, <code>.</code> = le dossier courant.', en: '<code>code</code> is VS Code’s CLI, <code>.</code> = the current folder.' },
    },
    {
      id: 'env-q50', skill: 'env.workspaces', extra: true, level: 2, type: 'multi',
      prompt: { fr: 'Ça marche chez toi mais la CI est rouge. Quelles pistes vérifier ?', en: 'It works on your PC but CI is red. Which leads should you check?' },
      choices: {
        fr: ['Majuscules d’un nom de fichier (Windows vs Linux)', 'Un fichier présent chez toi mais jamais commité', 'La version de Node (node -v vs node-version dans le workflow)', 'La couleur du thème de VS Code'],
        en: ['Upper case in a file name (Windows vs Linux)', 'A file present at home but never committed', 'The Node version (node -v vs node-version in the workflow)', 'The VS Code theme colour'],
      },
      answer: [0, 1, 2],
      explain: { fr: 'Système, fichiers non commités, versions des moteurs, variables d’environnement : les causes classiques. Le thème n’y est pour rien !', en: 'System, uncommitted files, engine versions, environment variables: the classic causes. The theme has nothing to do with it!' },
    },
    {
      id: 'env-q51', skill: 'env.workspaces', extra: true, level: 2, type: 'tf',
      prompt: { fr: '<code>http://127.0.0.1:8080</code> désigne un serveur qui tourne sur ta propre machine.', en: '<code>http://127.0.0.1:8080</code> refers to a server running on your own machine.' },
      answer: true,
      explain: { fr: '<code>127.0.0.1</code> = <code>localhost</code> = cette machine-ci ; <code>8080</code> est le port (la porte) où écoute le serveur de <code>npm run serve</code>.', en: '<code>127.0.0.1</code> = <code>localhost</code> = this very machine; <code>8080</code> is the port (the door) where the <code>npm run serve</code> server listens.' },
    },
    {
      id: 'env-q52', skill: 'env.workspaces', extra: true, level: 3, type: 'match',
      prompt: { fr: 'Associe chaque forme de Claude Code à l’endroit où les commandes s’exécutent.', en: 'Match each form of Claude Code with where the commands run.' },
      pairs: {
        fr: [['CLI claude dans PowerShell', 'Ton PC'], ['Extension VS Code', 'Ton PC, dans l’éditeur'], ['claude.ai/code (web)', 'Conteneur Linux éphémère dans le cloud']],
        en: [['claude CLI in PowerShell', 'Your PC'], ['VS Code extension', 'Your PC, in the editor'], ['claude.ai/code (web)', 'Ephemeral Linux container in the cloud']],
      },
      explain: { fr: 'En local, Claude Code agit sur tes fichiers ; sur le web, il travaille dans un conteneur cloud et doit pousser son travail sur GitHub.', en: 'Locally, Claude Code acts on your files; on the web, it works in a cloud container and must push its work to GitHub.' },
    },

    // ================================================================ exam
    {
      id: 'env-q53', skill: 'env.files', level: 2, type: 'mcq',
      prompt: { fr: 'Quel séparateur de dossiers fonctionne à la fois sous Linux et (presque toujours) dans Node, Git et PowerShell sous Windows ?', en: 'Which folder separator works on Linux and (almost always) in Node, Git and PowerShell on Windows?' },
      choices: { fr: ['\\', '/', ':', ';'], en: ['\\', '/', ':', ';'] },
      answer: 1,
      explain: { fr: '<code>/</code> est accepté presque partout. <code>;</code> et <code>:</code> séparent les dossiers <em>dans le PATH</em>, pas dans un chemin.', en: '<code>/</code> is accepted almost everywhere. <code>;</code> and <code>:</code> separate folders <em>in PATH</em>, not within a path.' },
    },
    {
      id: 'env-q54', skill: 'env.cmd', level: 2, type: 'mcq',
      prompt: { fr: 'Dans <code>dir /s web</code>, que représente <code>/s</code> ?', en: 'In <code>dir /s web</code>, what is <code>/s</code>?' },
      choices: { fr: ['Un dossier', 'Une option de la commande', 'Un chemin absolu Linux', 'Une variable'], en: ['A folder', 'A command option', 'A Linux absolute path', 'A variable'] },
      answer: 1,
      explain: { fr: 'Sous cmd, les options commencent par <code>/</code> (ici : inclure les sous-dossiers). <code>web</code> est l’argument.', en: 'In cmd, options start with <code>/</code> (here: include subfolders). <code>web</code> is the argument.' },
    },
    {
      id: 'env-q55', skill: 'env.powershell', level: 2, type: 'tf',
      prompt: { fr: 'PowerShell fait la différence entre <code>Get-ChildItem</code> et <code>get-childitem</code>.', en: 'PowerShell distinguishes <code>Get-ChildItem</code> from <code>get-childitem</code>.' },
      answer: false,
      explain: { fr: 'Les noms de commandes PowerShell sont insensibles à la casse. Les majuscules servent seulement à la lisibilité.', en: 'PowerShell command names are case-insensitive. Capitals are only for readability.' },
    },
    {
      id: 'env-q56', skill: 'env.bash', level: 2, type: 'fill',
      prompt: { fr: 'Quelle commande bash affiche le dossier courant ?', en: 'Which bash command prints the current folder?' },
      accept: ['pwd'],
      explain: { fr: '<code>pwd</code> = <em>print working directory</em>. Même alias dans PowerShell.', en: '<code>pwd</code> = <em>print working directory</em>. Same alias in PowerShell.' },
    },
    {
      id: 'env-q57', skill: 'env.variables', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi la CI définit-elle <code>BASE_PATH</code> avant <code>npm run build</code> ?', en: 'Why does CI set <code>BASE_PATH</code> before <code>npm run build</code>?' },
      choices: {
        fr: ['Pour accélérer le build', 'Pour que le site sache qu’il est publié sous le sous-dossier /3D-reader de GitHub Pages', 'Pour cacher la clé API', 'Pour choisir la langue du site'],
        en: ['To speed up the build', 'So the site knows it is published under the /3D-reader subfolder of GitHub Pages', 'To hide the API key', 'To choose the site language'],
      },
      answer: 1,
      explain: { fr: 'Le build lit <code>BASE_PATH</code> (par défaut <code>/</code>) : sur Pages le site vit sous <code>/3D-reader/</code>, en local à la racine. Une variable évite de changer le code.', en: 'The build reads <code>BASE_PATH</code> (default <code>/</code>): on Pages the site lives under <code>/3D-reader/</code>, locally at the root. A variable avoids changing the code.' },
    },
    {
      id: 'env-q58', skill: 'env.engines', level: 2, type: 'multi',
      prompt: { fr: 'Quels fichiers/dossiers faut-il commiter dans Git pour un projet Node ?', en: 'Which files/folders should be committed to Git for a Node project?' },
      choices: { fr: ['package.json', 'package-lock.json', 'node_modules/', 'dist/ (le site construit)'], en: ['package.json', 'package-lock.json', 'node_modules/', 'dist/ (the built site)'] },
      answer: [0, 1],
      explain: { fr: 'La liste de besoins et le bon de livraison exact se commitent ; le stock (<code>node_modules</code>) et le produit fini (<code>dist</code>) se régénèrent.', en: 'The list of needs and the exact delivery note are committed; the stock (<code>node_modules</code>) and the finished product (<code>dist</code>) are regenerated.' },
    },
    {
      id: 'env-q59', skill: 'env.engines', level: 1, type: 'fill',
      prompt: { fr: 'Quelle commande affiche la version de Node installée ?', en: 'Which command shows the installed Node version?' },
      accept: ['node -v', 'node --version'],
      explain: { fr: '<code>node -v</code> (ou <code>--version</code>). 3D Reader demande Node 24 (<code>"engines"</code> dans <code>package.json</code>).', en: '<code>node -v</code> (or <code>--version</code>). 3D Reader requires Node 24 (<code>"engines"</code> in <code>package.json</code>).' },
    },
    {
      id: 'env-q60', skill: 'env.workspaces', level: 2, type: 'mcq',
      prompt: { fr: 'Où tourne le JavaScript de <code>web/engine/</code> quand un visiteur utilise le site GitHub Pages ?', en: 'Where does the JavaScript of <code>web/engine/</code> run when a visitor uses the GitHub Pages site?' },
      choices: { fr: ['Sur les serveurs de GitHub', 'Dans le navigateur du visiteur', 'Sur Vercel', 'Dans la CI GitHub Actions'], en: ['On GitHub’s servers', 'In the visitor’s browser', 'On Vercel', 'In GitHub Actions CI'] },
      answer: 1,
      explain: { fr: 'GitHub Pages ne fait que livrer des fichiers statiques. Tout le calcul (y compris OpenCascade en WebAssembly) se fait dans le navigateur. Seule la page IA appelle Vercel.', en: 'GitHub Pages only delivers static files. All the computation (including OpenCascade in WebAssembly) happens in the browser. Only the AI page calls Vercel.' },
    },
    {
      id: 'env-q61', skill: 'env.bash', level: 3, type: 'order',
      prompt: { fr: 'Remets dans l’ordre les étapes de la CI de 3D Reader (extrait de ci.yml).', en: 'Put 3D Reader’s CI steps in order (excerpt of ci.yml).' },
      items: { fr: ['npm ci', 'npm test', 'npm run build', 'npx playwright install --with-deps chromium', 'npm run test:e2e'], en: ['npm ci', 'npm test', 'npm run build', 'npx playwright install --with-deps chromium', 'npm run test:e2e'] },
      explain: { fr: 'Installer, tester le moteur, construire le site, installer le navigateur sans tête, puis tester le site construit de bout en bout.', en: 'Install, test the engine, build the site, install the headless browser, then test the built site end to end.' },
    },
    {
      id: 'env-q62', skill: 'env.variables', level: 3, type: 'line',
      prompt: { fr: 'Clique sur la ligne où le programme lit un <strong>secret</strong> dans l’environnement.', en: 'Click the line where the program reads a <strong>secret</strong> from the environment.' },
      code: "const GROQ_BASE = 'https://api.groq.com/openai/v1';\nconst MAX_TOKENS = 1200;\nconst key = process.env.AI_API_KEY;\nconst model = 'openai/gpt-oss-120b';",
      lang: 'js',
      answer: 2,
      explain: { fr: 'La clé vient de <code>process.env</code> : elle n’est écrite nulle part dans le code. Les autres lignes sont des réglages publics.', en: 'The key comes from <code>process.env</code>: it is written nowhere in the code. The other lines are public settings.' },
    },
  ],
};
