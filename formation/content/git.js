// Module « Git et GitHub sans jargon » — voir formation/CONTENT_SPEC.md.
export default {
  id: 'git',
  order: 9,
  icon: '🌿',
  color: '#2da44e',
  title: { fr: 'Git et GitHub sans jargon', en: 'Git and GitHub without the jargon' },
  summary: {
    fr: `Comprendre commits, branches, pull requests, CI et GitHub Pages pour suivre (et valider) le travail de Claude Code sur 3D Reader.`,
    en: `Understand commits, branches, pull requests, CI and GitHub Pages so you can follow (and approve) Claude Code's work on 3D Reader.`,
  },
  skills: {
    'git.basics': { fr: 'Dépôt, commit, historique et diff', en: 'Repository, commit, history and diff' },
    'git.branches': { fr: 'Branches, fusion et conflits', en: 'Branches, merging and conflicts' },
    'git.remote': { fr: 'Local et distant : clone, pull, push', en: 'Local and remote: clone, pull, push' },
    'git.github': { fr: 'GitHub : issues, pull requests, revues', en: 'GitHub: issues, pull requests, reviews' },
    'git.actions': { fr: 'GitHub Actions et intégration continue', en: 'GitHub Actions and continuous integration' },
    'git.pages': { fr: 'GitHub Pages, déploiement, versions', en: 'GitHub Pages, deployment, releases' },
    'git.jargon': { fr: 'Le jargon des développeurs', en: 'Developer jargon' },
  },
  widgets: {
    'git-term': {
      type: 'terminal',
      shell: 'bash',
      intro: {
        fr: `Tu es dans le dossier <code>3D-reader</code>. Fais le trajet complet d'une modification : regarder l'état, créer une branche, préparer, enregistrer, envoyer sur GitHub.`,
        en: `You are in the <code>3D-reader</code> folder. Walk a change all the way: check the state, create a branch, stage, record, send to GitHub.`,
      },
      missions: [
        { match: '^git status\\b', fr: `Regarde l'état du dépôt : <code>git status</code>`, en: `Check the state of the repository: <code>git status</code>` },
        { match: '^git log\\b', fr: `Affiche l'historique en version courte : <code>git log --oneline</code>`, en: `Show the history, short version: <code>git log --oneline</code>` },
        { match: '^git (switch -c|checkout -b) \\S+', fr: `Crée une branche et place-toi dessus : <code>git switch -c correction-texte</code>`, en: `Create a branch and move onto it: <code>git switch -c fix-text</code>` },
        { match: '^git add \\S+', fr: `Prépare (indexe) tes modifications : <code>git add .</code>`, en: `Stage your changes: <code>git add .</code>` },
        { match: '^git commit (-am|-m)\\s*\\S+', fr: `Enregistre un commit avec un message : <code>git commit -m "Corrige un texte"</code>`, en: `Record a commit with a message: <code>git commit -m "Fix a text"</code>` },
        { match: '^git push -u origin \\S+', fr: `Envoie la branche sur GitHub et retiens le lien : <code>git push -u origin correction-texte</code>`, en: `Push the branch to GitHub and remember the link: <code>git push -u origin fix-text</code>` },
      ],
    },
    'git-flow-pr': {
      type: 'flow',
      actors: [
        { fr: 'Claude Code', en: 'Claude Code' },
        { fr: 'GitHub', en: 'GitHub' },
        { fr: 'CI (Actions)', en: 'CI (Actions)' },
        { fr: 'Toi', en: 'You' },
        { fr: 'GitHub Pages', en: 'GitHub Pages' },
      ],
      steps: [
        { from: 0, to: 1, label: { fr: 'git push (branche claude/…)', en: 'git push (claude/… branch)' }, detail: { fr: `Claude Code envoie ses commits sur sa branche, par exemple <code>claude/3d-reader-uxw782</code>. <strong>main</strong> n'est pas touchée.`, en: `Claude Code sends its commits to its branch, for example <code>claude/3d-reader-uxw782</code>. <strong>main</strong> is not touched.` } },
        { from: 1, to: 2, label: { fr: 'déclenche ci.yml', en: 'triggers ci.yml' }, detail: { fr: `Chaque <em>push</em> déclenche le workflow « CI » : tests Python, <code>npm test</code>, construction du site, tests de bout en bout.`, en: `Every push triggers the "CI" workflow: Python tests, <code>npm test</code>, site build, end-to-end tests.` } },
        { from: 2, to: 1, label: { fr: '✔ coche verte', en: '✔ green check' }, detail: { fr: `Le résultat s'affiche à côté du commit et dans la pull request : vert = tout passe, rouge = au moins une étape a échoué.`, en: `The result shows next to the commit and in the pull request: green = everything passes, red = at least one step failed.` } },
        { from: 1, to: 3, label: { fr: 'pull request #35 à relire', en: 'pull request #35 to review' }, detail: { fr: `La PR montre l'onglet <em>Files changed</em> (le diff), les commits et la conversation. C'est toi qui décides.`, en: `The PR shows the <em>Files changed</em> tab (the diff), the commits and the conversation. You decide.` } },
        { from: 3, to: 1, label: { fr: 'Merge pull request', en: 'Merge pull request' }, detail: { fr: `Tu fusionnes : les commits de la branche entrent dans <strong>main</strong>.`, en: `You merge: the branch's commits enter <strong>main</strong>.` } },
        { from: 1, to: 2, label: { fr: 'CI sur main', en: 'CI on main' }, detail: { fr: `Le nouveau commit de main est testé à son tour.`, en: `The new commit of main is tested in turn.` } },
        { from: 2, to: 4, label: { fr: 'pages.yml publie dist/', en: 'pages.yml publishes dist/' }, detail: { fr: `Si la CI de main est verte, <code>pages.yml</code> construit le site et le publie sur <code>alexdevanssay-cmyk.github.io/3D-reader/</code>.`, en: `If main's CI is green, <code>pages.yml</code> builds the site and publishes it at <code>alexdevanssay-cmyk.github.io/3D-reader/</code>.` } },
      ],
    },
  },
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'git-1',
      title: { fr: 'Pourquoi Git ? Commits, historique et diff', en: 'Why Git? Commits, history and diff' },
      skills: ['git.basics'],
      minutes: 10,
      body: {
        fr: `
<p>Imagine le plan d'une pièce de fonderie. Il passe par l'indice A, puis B, puis C. Chaque indice a une date, un auteur, et une case « modifications » qui dit ce qui a changé. Si l'indice C pose problème, on ressort l'indice B. <strong>Git fait exactement ça, mais pour des fichiers de code</strong>, et automatiquement.</p>

<h3>Le dépôt (repository)</h3>
<p>Un <span class="term" data-term="repo">dépôt</span> (<em>repository</em>, ou « repo ») est un dossier de projet dont Git garde toute l'histoire. Le dossier <code>3D-reader</code> est un dépôt : il contient le code (<code>web/</code>, <code>reader3d/</code>, <code>tests/</code>…) et, caché dans un sous-dossier <code>.git/</code>, l'historique complet de chaque modification depuis le premier jour.</p>

<h3>Le commit : une photo datée et signée</h3>
<p>Un <span class="term" data-term="commit">commit</span> est un enregistrement de l'état du projet à un instant donné, avec :</p>
<ul>
  <li>un <strong>message</strong> qui explique le changement (« Parting card: … ») ;</li>
  <li>un <strong>auteur</strong> et une <strong>date</strong> ;</li>
  <li>un <strong>parent</strong> : le commit d'avant (c'est ce qui forme la chaîne de l'historique) ;</li>
  <li>un identifiant unique, le <span class="term" data-term="sha">SHA</span>.</li>
</ul>
<p>Le SHA est une longue empreinte de 40 caractères hexadécimaux, calculée à partir du contenu. On l'abrège souvent aux 7 premiers : <code>7144ee5</code>. Si une seule virgule change, l'empreinte change : c'est l'équivalent d'un numéro d'indice infalsifiable.</p>

~~~text title="git log --oneline (historique en version courte)"
906ebf4 Parting card: the undercut of each kind of surface as a sentence
7144ee5 Gating: feeding circuits and pouring weight sent to the costing
03a27c5 Merge pull request #34 from alexdevanssay-cmyk/claude/3d-reader-uxw782
~~~
<p>Chaque ligne = un commit, le plus récent en haut. À gauche le SHA abrégé, à droite la première ligne du message.</p>

<h3>Le diff : ce qui a changé</h3>
<p>Un <span class="term" data-term="diff">diff</span> compare deux versions d'un fichier. Les lignes qui commencent par <code>-</code> (en rouge sur GitHub) ont été retirées, celles qui commencent par <code>+</code> (en vert) ont été ajoutées. Une modification de ligne apparaît donc comme un <code>-</code> suivi d'un <code>+</code>.</p>

~~~diff title="web/i18n.js"
@@ -18,7 +18,7 @@ const STRINGS = {
     "top.unit": "Mesh unit",
-    "top.quality": "Quality",«1»
+    "top.quality": "Display quality",«2»
     "top.engine": "Engine",«3»
~~~
<ol class="notes">
  <li>Ancienne version de la ligne (supprimée).</li>
  <li>Nouvelle version (ajoutée).</li>
  <li>Ligne de contexte, sans signe : inchangée, montrée pour se repérer.</li>
</ol>
<p>La ligne <code>@@ -18,7 +18,7 @@</code> dit où l'on est : à partir de la ligne 18, 7 lignes avant, 7 lignes après.</p>

<h3>Le message et les co-auteurs</h3>
<p>Un bon message de commit dit <em>quoi</em> et <em>pourquoi</em>, en une première ligne courte. Les commits de Claude Code finissent par une ligne <code>Co-Authored-By: Claude …</code> : c'est une convention reconnue par GitHub, qui affiche alors deux avatars sur le commit. Tu vois ainsi d'un coup d'œil ce qui a été écrit avec l'IA.</p>

<div class="callout project">Dans 3D Reader, la PR #35 contient des dizaines de commits. Tu n'as pas besoin de lire tout le code : lis les <strong>messages</strong> (le « quoi ») puis le <strong>diff</strong> des fichiers qui t'intéressent.</div>

<h3>Les trois zones</h3>
<p>Avant de devenir un commit, une modification passe par trois endroits :</p>
<ol>
  <li><strong>Le dossier de travail</strong> : les fichiers que tu modifies.</li>
  <li><strong>L'index</strong> (<em>staging area</em>) : la « corbeille d'envoi » où tu poses ce qui ira dans le prochain commit (<code>git add</code>).</li>
  <li><strong>L'historique</strong> : le commit enregistré (<code>git commit</code>).</li>
</ol>
<div class="callout tip"><code>git status</code> est la commande la plus utile de toutes : elle dit sur quelle branche tu es et quels fichiers sont modifiés, indexés ou nouveaux. Dans le doute, tape <code>git status</code>.</div>
`,
        en: `
<p>Picture the drawing of a cast part. It goes through revision A, then B, then C. Each revision has a date, an author, and a "changes" box saying what changed. If revision C causes trouble, you pull out revision B again. <strong>Git does exactly that, but for code files</strong>, and automatically.</p>

<h3>The repository</h3>
<p>A <span class="term" data-term="repo">repository</span> ("repo") is a project folder whose whole history Git keeps. The <code>3D-reader</code> folder is a repository: it holds the code (<code>web/</code>, <code>reader3d/</code>, <code>tests/</code>…) and, hidden in a <code>.git/</code> subfolder, the full history of every change since day one.</p>

<h3>The commit: a dated, signed snapshot</h3>
<p>A <span class="term" data-term="commit">commit</span> is a record of the state of the project at a given moment, with:</p>
<ul>
  <li>a <strong>message</strong> explaining the change ("Parting card: …");</li>
  <li>an <strong>author</strong> and a <strong>date</strong>;</li>
  <li>a <strong>parent</strong>: the commit before (this forms the chain of history);</li>
  <li>a unique identifier, the <span class="term" data-term="sha">SHA</span>.</li>
</ul>
<p>The SHA is a long fingerprint of 40 hexadecimal characters, computed from the content. It is often shortened to its first 7: <code>7144ee5</code>. Change a single comma and the fingerprint changes: it is a tamper-proof revision number.</p>

~~~text title="git log --oneline (short history)"
906ebf4 Parting card: the undercut of each kind of surface as a sentence
7144ee5 Gating: feeding circuits and pouring weight sent to the costing
03a27c5 Merge pull request #34 from alexdevanssay-cmyk/claude/3d-reader-uxw782
~~~
<p>Each line = one commit, the most recent at the top. On the left the short SHA, on the right the first line of the message.</p>

<h3>The diff: what changed</h3>
<p>A <span class="term" data-term="diff">diff</span> compares two versions of a file. Lines starting with <code>-</code> (red on GitHub) were removed, lines starting with <code>+</code> (green) were added. A changed line therefore shows up as a <code>-</code> followed by a <code>+</code>.</p>

~~~diff title="web/i18n.js"
@@ -18,7 +18,7 @@ const STRINGS = {
     "top.unit": "Mesh unit",
-    "top.quality": "Quality",«1»
+    "top.quality": "Display quality",«2»
     "top.engine": "Engine",«3»
~~~
<ol class="notes">
  <li>Old version of the line (removed).</li>
  <li>New version (added).</li>
  <li>Context line, no sign: unchanged, shown to help you find your way.</li>
</ol>
<p>The line <code>@@ -18,7 +18,7 @@</code> says where you are: from line 18, 7 lines before, 7 lines after.</p>

<h3>The message and co-authors</h3>
<p>A good commit message says <em>what</em> and <em>why</em>, in a short first line. Claude Code's commits end with a <code>Co-Authored-By: Claude …</code> line: a convention GitHub recognises, which then shows two avatars on the commit. You can see at a glance what was written with the AI.</p>

<div class="callout project">In 3D Reader, PR #35 holds dozens of commits. You do not need to read all the code: read the <strong>messages</strong> (the "what") then the <strong>diff</strong> of the files you care about.</div>

<h3>The three areas</h3>
<p>Before becoming a commit, a change goes through three places:</p>
<ol>
  <li><strong>The working folder</strong>: the files you edit.</li>
  <li><strong>The index</strong> (staging area): the "outbox" where you put what goes into the next commit (<code>git add</code>).</li>
  <li><strong>The history</strong>: the recorded commit (<code>git commit</code>).</li>
</ol>
<div class="callout tip"><code>git status</code> is the most useful command of all: it tells you which branch you are on and which files are modified, staged or new. When in doubt, type <code>git status</code>.</div>
`,
      },
      deep: {
        fr: `
<h3>Git expliqué avec un cahier de laboratoire</h3>
<div class="callout analogy">Au labo d'essais, chaque essai est noté dans un cahier : date, opérateur, ce qu'on a changé, résultat. On ne gomme jamais : on ajoute une nouvelle page. Git est ce cahier, tenu pour toi.</div>
<ul>
  <li><strong>Le cahier entier</strong> = le dépôt.</li>
  <li><strong>Une page datée et signée</strong> = un commit.</li>
  <li><strong>Le numéro de page</strong> = le SHA (sauf qu'il est calculé à partir du contenu de la page, donc impossible à tricher).</li>
  <li><strong>« Ce qui change par rapport à la page d'avant »</strong> = le diff.</li>
</ul>

<h3>Pas à pas : de la modification au commit</h3>
~~~text
 dossier de travail      index (corbeille)       historique
 ┌──────────────┐  add  ┌──────────────┐ commit ┌──────────────┐
 │ i18n.js modif├──────►│ i18n.js prêt ├───────►│ 906ebf4      │
 └──────────────┘       └──────────────┘        └──────────────┘
~~~
<ol>
  <li>Tu modifies un fichier : Git le voit « modifié » (<em>modified</em>).</li>
  <li><code>git add i18n.js</code> : tu le poses dans la corbeille du prochain envoi.</li>
  <li><code>git commit -m "Renomme le libellé qualité"</code> : Git prend la photo et lui donne un SHA.</li>
</ol>

<h3>Lire un diff sans paniquer</h3>
<p>Ne lis pas tout. Cherche seulement :</p>
<ol>
  <li>le <strong>nom du fichier</strong> (en haut de chaque bloc) ;</li>
  <li>les lignes <strong>rouges <code>-</code></strong> : ce qui disparaît ;</li>
  <li>les lignes <strong>vertes <code>+</code></strong> : ce qui arrive.</li>
</ol>
<p>Les lignes blanches autour ne sont là que pour te situer, comme les cotes de repère autour d'une zone modifiée sur un plan.</p>

<h3>Erreurs classiques</h3>
<ul>
  <li>Croire qu'un commit envoie le code sur Internet : <strong>non</strong>, un commit reste sur ton ordinateur tant que tu ne fais pas <code>git push</code>.</li>
  <li>Oublier <code>git add</code> : le commit est alors vide, ou ne contient pas ton dernier changement.</li>
  <li>Écrire « modif » comme message : dans six mois, personne (ni toi) ne saura pourquoi.</li>
</ul>
`,
        en: `
<h3>Git explained with a lab notebook</h3>
<div class="callout analogy">In the test lab, every trial is written in a notebook: date, operator, what was changed, result. You never erase: you add a new page. Git is that notebook, kept for you.</div>
<ul>
  <li><strong>The whole notebook</strong> = the repository.</li>
  <li><strong>A dated, signed page</strong> = a commit.</li>
  <li><strong>The page number</strong> = the SHA (except it is computed from the page's content, so it cannot be faked).</li>
  <li><strong>"What changed since the page before"</strong> = the diff.</li>
</ul>

<h3>Step by step: from edit to commit</h3>
~~~text
 working folder          index (outbox)          history
 ┌──────────────┐  add  ┌──────────────┐ commit ┌──────────────┐
 │ i18n.js edit ├──────►│ i18n.js ready├───────►│ 906ebf4      │
 └──────────────┘       └──────────────┘        └──────────────┘
~~~
<ol>
  <li>You edit a file: Git sees it as "modified".</li>
  <li><code>git add i18n.js</code>: you put it in the outbox for the next record.</li>
  <li><code>git commit -m "Rename the quality label"</code>: Git takes the snapshot and gives it a SHA.</li>
</ol>

<h3>Reading a diff without panicking</h3>
<p>Do not read everything. Look only for:</p>
<ol>
  <li>the <strong>file name</strong> (at the top of each block);</li>
  <li>the <strong>red <code>-</code> lines</strong>: what goes away;</li>
  <li>the <strong>green <code>+</code> lines</strong>: what arrives.</li>
</ol>
<p>The white lines around are only there to locate you, like the reference dimensions around a modified zone on a drawing.</p>

<h3>Classic mistakes</h3>
<ul>
  <li>Thinking a commit sends the code to the Internet: <strong>no</strong>, a commit stays on your computer until you run <code>git push</code>.</li>
  <li>Forgetting <code>git add</code>: the commit is then empty, or misses your last change.</li>
  <li>Writing "changes" as the message: in six months nobody (you included) will know why.</li>
</ul>
`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'git-2',
      title: { fr: 'Les branches : travailler sans casser main', en: 'Branches: working without breaking main' },
      skills: ['git.branches'],
      minutes: 12,
      body: {
        fr: `
<p>Une <span class="term" data-term="branch">branche</span> est une ligne de travail parallèle. La branche principale s'appelle <span class="term" data-term="main">main</span> : c'est la version « officielle », celle qui est publiée. Pour essayer quelque chose, on crée une branche à côté, on y fait ses commits, puis on la <strong>fusionne</strong> dans main quand c'est prêt.</p>

~~~text
main     A───B───────────M        (M = commit de fusion)
              \\         /
claude/…       C───D───E
~~~
<p>Ici, Claude Code a fait les commits C, D, E sur sa branche <code>claude/3d-reader-uxw782</code> pendant que <code>main</code> restait intacte. M est la fusion.</p>

<h3>HEAD : « tu es ici »</h3>
<p><span class="term" data-term="head">HEAD</span> est le marqueur « vous êtes ici » du plan du centre commercial : il désigne la branche (et donc le commit) sur laquelle tu travailles en ce moment. Changer de branche déplace HEAD.</p>
~~~bash
git branch                     # liste les branches, * = la branche actuelle
git switch main                # aller sur main
git switch -c essai-joint      # créer la branche essai-joint et y aller
git checkout -b essai-joint    # ancienne écriture, même effet
~~~

<h3>Fusionner (merge)</h3>
<p><code>git merge autre-branche</code> ramène les commits d'une autre branche dans la branche actuelle. Deux cas :</p>
<ul>
  <li><strong>Avance rapide</strong> (<em>fast-forward</em>) : main n'a pas bougé, Git se contente d'avancer l'étiquette main jusqu'au dernier commit. Pas de commit de fusion.</li>
  <li><strong>Vraie fusion</strong> : les deux branches ont avancé, Git crée un <strong>commit de fusion</strong> à deux parents.</li>
</ul>
<p>L'option <code>--no-ff</code> force un commit de fusion même quand l'avance rapide serait possible. Intérêt : l'historique garde la trace « ce lot de commits est arrivé ensemble ». C'est la méthode notée dans les règles de travail de 3D Reader (« fusion --no-ff »).</p>

<h3>Le conflit de fusion</h3>
<p>Si deux branches ont modifié <strong>la même ligne</strong> différemment, Git ne choisit pas à ta place : il s'arrête et écrit les deux versions dans le fichier, entre des marqueurs.</p>
~~~text title="web/i18n.js pendant un conflit"
<<<<<<< HEAD«1»
    "top.quality": "Display quality",
=======«2»
    "top.quality": "Mesh quality",
>>>>>>> essai-joint«3»
~~~
<ol class="notes">
  <li>Début : la version de la branche où tu es (HEAD).</li>
  <li>Séparation : en dessous, la version qui arrive.</li>
  <li>Fin : le nom de la branche qui arrive.</li>
</ol>
<p>Résoudre = garder la bonne version (ou un mélange), <strong>supprimer les trois lignes de marqueurs</strong>, puis <code>git add</code> et <code>git commit</code>.</p>

<h3>Rebase, cherry-pick, worktree</h3>
<ul>
  <li><span class="term" data-term="rebase">Rebase</span> : au lieu de fusionner, on « rejoue » ses commits par-dessus la dernière version de main. Historique bien droit, mais les SHA changent : à éviter sur une branche que d'autres utilisent.</li>
  <li><strong>Cherry-pick</strong> : copier <em>un seul</em> commit d'une branche vers une autre (« je veux juste ce correctif-là »).</li>
  <li><span class="term" data-term="worktree">Worktree</span> : un deuxième dossier de travail branché sur le même dépôt, sur une autre branche. Les agents de Claude Code en utilisent un chacun : plusieurs chantiers avancent en même temps sans se marcher dessus, puis on fusionne.</li>
</ul>
<div class="callout project">Le fichier de reprise de 3D Reader décrit cette méthode : « agents en worktrees isolés par chantier, relecture indépendante, fusion --no-ff, tests, push ».</div>
`,
        en: `
<p>A <span class="term" data-term="branch">branch</span> is a parallel line of work. The main branch is called <span class="term" data-term="main">main</span>: it is the "official" version, the one that gets published. To try something, you create a branch next to it, make your commits there, then <strong>merge</strong> it into main when it is ready.</p>

~~~text
main     A───B───────────M        (M = merge commit)
              \\         /
claude/…       C───D───E
~~~
<p>Here Claude Code made commits C, D, E on its <code>claude/3d-reader-uxw782</code> branch while <code>main</code> stayed untouched. M is the merge.</p>

<h3>HEAD: "you are here"</h3>
<p><span class="term" data-term="head">HEAD</span> is the "you are here" marker on a shopping-mall map: it points to the branch (and so the commit) you are working on right now. Switching branch moves HEAD.</p>
~~~bash
git branch                     # list branches, * = current branch
git switch main                # go to main
git switch -c parting-trial    # create the parting-trial branch and go there
git checkout -b parting-trial  # older spelling, same effect
~~~

<h3>Merging</h3>
<p><code>git merge other-branch</code> brings another branch's commits into the current branch. Two cases:</p>
<ul>
  <li><strong>Fast-forward</strong>: main has not moved, Git just slides the main label up to the last commit. No merge commit.</li>
  <li><strong>True merge</strong>: both branches moved on, Git creates a <strong>merge commit</strong> with two parents.</li>
</ul>
<p>The <code>--no-ff</code> option forces a merge commit even when a fast-forward would be possible. Benefit: the history keeps the trace "this batch of commits arrived together". It is the method written in 3D Reader's working rules ("merge --no-ff").</p>

<h3>The merge conflict</h3>
<p>If two branches changed <strong>the same line</strong> differently, Git does not choose for you: it stops and writes both versions in the file, between markers.</p>
~~~text title="web/i18n.js during a conflict"
<<<<<<< HEAD«1»
    "top.quality": "Display quality",
=======«2»
    "top.quality": "Mesh quality",
>>>>>>> parting-trial«3»
~~~
<ol class="notes">
  <li>Start: the version of the branch you are on (HEAD).</li>
  <li>Separator: below it, the incoming version.</li>
  <li>End: the name of the incoming branch.</li>
</ol>
<p>Resolving = keep the right version (or a mix), <strong>delete the three marker lines</strong>, then <code>git add</code> and <code>git commit</code>.</p>

<h3>Rebase, cherry-pick, worktree</h3>
<ul>
  <li><span class="term" data-term="rebase">Rebase</span>: instead of merging, you "replay" your commits on top of the latest main. Nice straight history, but the SHAs change: avoid it on a branch others use.</li>
  <li><strong>Cherry-pick</strong>: copy <em>a single</em> commit from one branch to another ("I just want that fix").</li>
  <li><span class="term" data-term="worktree">Worktree</span>: a second working folder attached to the same repository, on another branch. Claude Code's agents each use one: several jobs progress at the same time without stepping on each other, then they get merged.</li>
</ul>
<div class="callout project">3D Reader's hand-off file describes this method: "agents in isolated worktrees per job, independent review, merge --no-ff, tests, push".</div>
`,
      },
      deep: {
        fr: `
<h3>Les branches comme des variantes d'outillage</h3>
<div class="callout analogy">Tu as un moule qui fonctionne (main). Tu veux tester une nouvelle attaque de coulée. Tu ne modifies pas le moule de production : tu fais une <strong>variante</strong> sur un double (la branche). Si l'essai est bon, tu reportes la modification sur le moule officiel (la fusion). Sinon, tu jettes la variante, et la production n'a jamais été dérangée.</div>

<h3>Pourquoi Claude Code ne travaille jamais sur main</h3>
<p>main est ce qui est publié sur GitHub Pages. Si une modification cassée y arrivait, le site de tout le monde serait cassé. Donc Claude Code travaille sur sa branche <code>claude/…</code>, et c'est <strong>toi</strong> qui ouvres la porte vers main en fusionnant la pull request.</p>

<h3>Un conflit, ce n'est pas une panne</h3>
<p>C'est juste Git qui dit : « deux personnes ont réécrit la même phrase, laquelle je garde ? ». Lis-le comme ça :</p>
~~~text
<<<<<<<   ← ma version commence
  ...
=======   ← la version de l'autre commence
  ...
>>>>>>>   ← fin
~~~
<p>Tu effaces les marqueurs et la version que tu ne veux pas. Fini. Si tu n'es pas sûr, demande à Claude Code : « résous le conflit en gardant le texte de main ».</p>

<h3>Merge ou rebase ? La version simple</h3>
<ul>
  <li><strong>Merge</strong> = on agrafe les deux dossiers ensemble avec une fiche « fusion ». Rien n'est réécrit. Sûr.</li>
  <li><strong>Rebase</strong> = on recopie ses pages à la fin du cahier officiel, comme si on avait commencé après. Plus propre, mais les pages ont de nouveaux numéros : ceux qui avaient les anciennes sont perdus.</li>
</ul>
<p>Règle de survie : sur une branche partagée, <strong>merge</strong>.</p>

<h3>Le worktree en une image</h3>
<p>Un seul classeur d'archives (le dépôt <code>.git</code>), mais plusieurs établis (dossiers) ouverts chacun sur une branche différente. Trois agents = trois établis, aucun ne déplace les outils de l'autre.</p>
`,
        en: `
<h3>Branches as tooling variants</h3>
<div class="callout analogy">You have a working die (main). You want to test a new gate. You do not modify the production die: you make a <strong>variant</strong> on a copy (the branch). If the trial is good, you carry the change over to the official die (the merge). Otherwise you throw the variant away, and production was never disturbed.</div>

<h3>Why Claude Code never works on main</h3>
<p>main is what is published on GitHub Pages. If a broken change landed there, everybody's site would be broken. So Claude Code works on its <code>claude/…</code> branch, and <strong>you</strong> open the door to main by merging the pull request.</p>

<h3>A conflict is not a breakdown</h3>
<p>It is just Git saying: "two people rewrote the same sentence, which one do I keep?". Read it like this:</p>
~~~text
<<<<<<<   ← my version starts
  ...
=======   ← the other version starts
  ...
>>>>>>>   ← end
~~~
<p>You delete the markers and the version you do not want. Done. If unsure, ask Claude Code: "resolve the conflict keeping main's text".</p>

<h3>Merge or rebase? The simple version</h3>
<ul>
  <li><strong>Merge</strong> = you staple both folders together with a "merge" sheet. Nothing is rewritten. Safe.</li>
  <li><strong>Rebase</strong> = you copy your pages to the end of the official notebook, as if you had started later. Cleaner, but the pages get new numbers: whoever had the old ones is lost.</li>
</ul>
<p>Survival rule: on a shared branch, <strong>merge</strong>.</p>

<h3>The worktree in one picture</h3>
<p>One archive cabinet (the <code>.git</code> repository), but several workbenches (folders), each open on a different branch. Three agents = three workbenches, none moves the other's tools.</p>
`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'git-3',
      title: { fr: 'Local et distant : clone, pull, push', en: 'Local and remote: clone, pull, push' },
      skills: ['git.remote'],
      minutes: 12,
      body: {
        fr: `
<p>Git existe à deux endroits : <strong>ton ordinateur</strong> (le dépôt <em>local</em>) et <strong>GitHub</strong> (le dépôt <em>distant</em>, <span class="term" data-term="remote">remote</span>). Les deux sont des copies complètes ; on les synchronise à la main, avec quelques commandes.</p>

<h3>Les commandes du voyage</h3>
<table>
<thead><tr><th>Commande</th><th>Sens</th><th>Ce qu'elle fait</th></tr></thead>
<tbody>
<tr><td><code>git clone URL</code></td><td>GitHub → toi</td><td>Copie tout le dépôt la première fois.</td></tr>
<tr><td><code>git fetch</code></td><td>GitHub → toi</td><td>Télécharge les nouveautés <em>sans toucher</em> à tes fichiers.</td></tr>
<tr><td><code>git pull</code></td><td>GitHub → toi</td><td><code>fetch</code> + fusion dans ta branche : tes fichiers sont mis à jour.</td></tr>
<tr><td><code>git push</code></td><td>toi → GitHub</td><td>Envoie tes commits.</td></tr>
</tbody>
</table>

<h3>origin et upstream</h3>
<p>Quand tu clones, Git retient l'adresse du dépôt d'origine sous le surnom <code>origin</code>. <code>git push origin ma-branche</code> veut dire « envoie ma-branche vers origin ». La première fois, on ajoute <code>-u</code> :</p>
~~~bash
git push -u origin claude/3d-reader-uxw782
~~~
<p><code>-u</code> (<em>set upstream</em>) mémorise le lien entre ta branche locale et la branche distante. Ensuite, un simple <code>git push</code> ou <code>git pull</code> suffit : Git sait où aller.</p>

<h3>« ahead » et « behind »</h3>
~~~text title="git status"
On branch claude/3d-reader-uxw782
Your branch is ahead of 'origin/claude/3d-reader-uxw782' by 2 commits.
  (use "git push" to publish your local commits)
~~~
<ul>
  <li><strong>ahead by 2</strong> : tu as 2 commits que GitHub n'a pas encore → <code>git push</code>.</li>
  <li><strong>behind by 3</strong> : GitHub a 3 commits que tu n'as pas → <code>git pull</code>.</li>
  <li><strong>diverged</strong> : les deux ont avancé → <code>git pull</code> (fusion), puis <code>git push</code>.</li>
</ul>

<h3>Le danger du force-push</h3>
<p><code>git push --force</code> dit à GitHub : « remplace ta version par la mienne, même si tu as des commits que je n'ai pas ». Ces commits sont alors <strong>effacés</strong> du distant. C'est pour ça que les règles de 3D Reader interdisent de réécrire l'historique d'une branche partagée. Si vraiment nécessaire, la version prudente est <code>--force-with-lease</code>, qui refuse si quelqu'un a poussé entre-temps.</p>

<h3>À toi de jouer</h3>
<div data-widget="git-term"></div>

<div class="callout project">Dans une session Claude Code « dans le cloud », le dépôt est cloné dans un conteneur temporaire. Tant que Claude n'a pas fait <code>git push</code>, ses commits n'existent que dans ce conteneur : s'il est supprimé, ils sont perdus. C'est pour ça qu'il pousse à la fin de chaque lot.</div>
`,
        en: `
<p>Git lives in two places: <strong>your computer</strong> (the <em>local</em> repository) and <strong>GitHub</strong> (the <em>remote</em> repository, <span class="term" data-term="remote">remote</span>). Both are full copies; you synchronise them by hand with a few commands.</p>

<h3>The travel commands</h3>
<table>
<thead><tr><th>Command</th><th>Direction</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>git clone URL</code></td><td>GitHub → you</td><td>Copies the whole repository the first time.</td></tr>
<tr><td><code>git fetch</code></td><td>GitHub → you</td><td>Downloads what is new <em>without touching</em> your files.</td></tr>
<tr><td><code>git pull</code></td><td>GitHub → you</td><td><code>fetch</code> + merge into your branch: your files are updated.</td></tr>
<tr><td><code>git push</code></td><td>you → GitHub</td><td>Sends your commits.</td></tr>
</tbody>
</table>

<h3>origin and upstream</h3>
<p>When you clone, Git remembers the address of the original repository under the nickname <code>origin</code>. <code>git push origin my-branch</code> means "send my-branch to origin". The first time, add <code>-u</code>:</p>
~~~bash
git push -u origin claude/3d-reader-uxw782
~~~
<p><code>-u</code> (set upstream) remembers the link between your local branch and the remote one. After that, a plain <code>git push</code> or <code>git pull</code> is enough: Git knows where to go.</p>

<h3>"ahead" and "behind"</h3>
~~~text title="git status"
On branch claude/3d-reader-uxw782
Your branch is ahead of 'origin/claude/3d-reader-uxw782' by 2 commits.
  (use "git push" to publish your local commits)
~~~
<ul>
  <li><strong>ahead by 2</strong>: you have 2 commits GitHub does not have yet → <code>git push</code>.</li>
  <li><strong>behind by 3</strong>: GitHub has 3 commits you do not have → <code>git pull</code>.</li>
  <li><strong>diverged</strong>: both moved on → <code>git pull</code> (merge), then <code>git push</code>.</li>
</ul>

<h3>The danger of force-push</h3>
<p><code>git push --force</code> tells GitHub: "replace your version with mine, even if you have commits I do not". Those commits are then <strong>erased</strong> from the remote. That is why 3D Reader's rules forbid rewriting the history of a shared branch. If really needed, the careful version is <code>--force-with-lease</code>, which refuses if someone pushed in the meantime.</p>

<h3>Your turn</h3>
<div data-widget="git-term"></div>

<div class="callout project">In a Claude Code session "in the cloud", the repository is cloned into a temporary container. Until Claude runs <code>git push</code>, its commits only exist in that container: if it is deleted, they are lost. That is why it pushes at the end of every batch.</div>
`,
      },
      deep: {
        fr: `
<h3>Local / distant, version bureau d'études</h3>
<div class="callout analogy">Le serveur de plans de l'entreprise, c'est GitHub. Ton poste, c'est le dépôt local. Tu <strong>récupères</strong> le dossier (clone), tu travailles dessus hors ligne, puis tu <strong>déposes</strong> tes nouveaux indices sur le serveur (push). Le matin, tu <strong>récupères</strong> ce que les collègues ont déposé (pull).</div>

<h3>fetch ou pull ?</h3>
<ul>
  <li><strong>fetch</strong> = regarder la boîte aux lettres et rentrer le courrier, sans l'ouvrir. Tes fichiers ne bougent pas.</li>
  <li><strong>pull</strong> = rentrer le courrier <em>et</em> classer son contenu dans ton dossier. Tes fichiers changent.</li>
</ul>

<h3>Le schéma à retenir</h3>
~~~text
  GitHub (origin)                 ton ordinateur
 ┌────────────────┐   clone   ┌────────────────┐
 │                ├──────────►│                │
 │                │   pull    │                │
 │                ├──────────►│                │
 │                │   push    │                │
 │                │◄──────────┤                │
 └────────────────┘           └────────────────┘
~~~

<h3>Lire « ahead / behind » comme un compteur</h3>
<p>Git compare ta branche et sa jumelle sur GitHub :</p>
<ul>
  <li>« ahead 2 » : tu as 2 pages d'avance → dépose-les (<code>push</code>).</li>
  <li>« behind 3 » : tu as 3 pages de retard → récupère-les (<code>pull</code>).</li>
</ul>

<h3>Pourquoi le force-push est interdit</h3>
<p>C'est comme écraser le dossier du serveur avec ta copie, sans regarder si un collègue y a déposé un indice entre-temps : son travail disparaît. Avec Claude Code, la règle est simple : <strong>jamais de --force sur la branche de quelqu'un d'autre</strong>.</p>

<h3>Mini-exercice mental</h3>
<p>Tu fais 2 commits, tu fermes ton ordinateur, et ton collègue ouvre GitHub. Voit-il tes commits ? <strong>Non</strong> : tu n'as pas fait <code>git push</code>.</p>
`,
        en: `
<h3>Local / remote, design-office version</h3>
<div class="callout analogy">The company's drawing server is GitHub. Your workstation is the local repository. You <strong>fetch</strong> the folder (clone), work on it offline, then <strong>drop</strong> your new revisions on the server (push). In the morning, you <strong>pick up</strong> what colleagues dropped (pull).</div>

<h3>fetch or pull?</h3>
<ul>
  <li><strong>fetch</strong> = check the mailbox and bring the mail in, without opening it. Your files do not move.</li>
  <li><strong>pull</strong> = bring the mail in <em>and</em> file its content in your folder. Your files change.</li>
</ul>

<h3>The diagram to remember</h3>
~~~text
  GitHub (origin)                 your computer
 ┌────────────────┐   clone   ┌────────────────┐
 │                ├──────────►│                │
 │                │   pull    │                │
 │                ├──────────►│                │
 │                │   push    │                │
 │                │◄──────────┤                │
 └────────────────┘           └────────────────┘
~~~

<h3>Read "ahead / behind" as a counter</h3>
<p>Git compares your branch with its twin on GitHub:</p>
<ul>
  <li>"ahead 2": you are 2 pages ahead → drop them (<code>push</code>).</li>
  <li>"behind 3": you are 3 pages behind → pick them up (<code>pull</code>).</li>
</ul>

<h3>Why force-push is forbidden</h3>
<p>It is like overwriting the server folder with your copy without checking whether a colleague dropped a revision in the meantime: their work disappears. With Claude Code the rule is simple: <strong>never --force on someone else's branch</strong>.</p>

<h3>Mental mini-exercise</h3>
<p>You make 2 commits, close your laptop, and your colleague opens GitHub. Do they see your commits? <strong>No</strong>: you did not run <code>git push</code>.</p>
`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'git-4',
      title: { fr: 'GitHub : issues, pull requests et revues', en: 'GitHub: issues, pull requests and reviews' },
      skills: ['git.github'],
      minutes: 14,
      body: {
        fr: `
<p>Git est l'outil ; <strong>GitHub</strong> est le site web qui héberge les dépôts et ajoute tout ce qu'il faut pour travailler à plusieurs : discussions, revues, automatisation, publication.</p>

<h3>Les onglets d'un dépôt</h3>
<table>
<thead><tr><th>Onglet</th><th>À quoi il sert</th></tr></thead>
<tbody>
<tr><td><strong>Code</strong></td><td>Les fichiers, le README affiché en bas, le choix de branche, le bouton vert « Code » pour cloner.</td></tr>
<tr><td><strong>Issues</strong></td><td>Les tickets : bugs, idées, questions.</td></tr>
<tr><td><strong>Pull requests</strong></td><td>Les demandes de fusion d'une branche dans une autre.</td></tr>
<tr><td><strong>Actions</strong></td><td>Les automatismes (tests, déploiement) et leurs journaux.</td></tr>
<tr><td><strong>Settings</strong></td><td>Réglages : visibilité, Pages, secrets, protections de branche.</td></tr>
</tbody>
</table>

<h3>Issue et fork</h3>
<p>Une <span class="term" data-term="issue">issue</span> est un ticket numéroté (#12) : « la carte du plan de joint déborde sur petit écran ». On peut l'assigner, lui mettre des <strong>labels</strong> (<code>bug</code>, <code>enhancement</code>), la fermer (<em>close</em>) ou la rouvrir (<em>reopen</em>). Un <span class="term" data-term="fork">fork</span> est une copie d'un dépôt dans <em>ton</em> compte GitHub : utile pour contribuer à un projet où tu n'as pas le droit d'écrire.</p>

<h3>La pull request (PR)</h3>
<p>Une <span class="term" data-term="pull-request">pull request</span> dit : « je propose de fusionner la branche X dans main ». Elle porte un numéro partagé avec les issues (#35). Ses parties :</p>
<ul>
  <li><strong>Titre et description</strong> : le résumé du lot (Claude Code y met ce qui a changé et comment c'est testé).</li>
  <li><strong>Conversation</strong> : les commentaires et l'état des vérifications (coches de la CI).</li>
  <li><strong>Commits</strong> : la liste des commits de la branche.</li>
  <li><strong>Files changed</strong> : le diff complet, fichier par fichier.</li>
</ul>
<p>Une PR en <strong>draft</strong> (brouillon) signale « pas encore prête, ne pas fusionner ». <code>@nom</code> dans un commentaire mentionne (et notifie) quelqu'un ; <code>#35</code> fait un lien vers la PR 35.</p>

<h3>La revue (review)</h3>
<p>Dans <em>Files changed</em>, tu peux cliquer sur le <strong>+</strong> à gauche d'une ligne pour laisser un <strong>commentaire de ligne</strong>, voire une <strong>suggestion</strong> (une modification proposée que l'auteur applique d'un clic). Puis tu termines par <em>Review changes</em> :</p>
<ul>
  <li><strong>Comment</strong> : remarques sans verdict ;</li>
  <li><strong>Approve</strong> : « c'est bon pour moi » ;</li>
  <li><strong>Request changes</strong> : « à corriger avant fusion ».</li>
</ul>

<h3>Les trois façons de fusionner</h3>
<table>
<thead><tr><th>Bouton</th><th>Résultat dans main</th></tr></thead>
<tbody>
<tr><td><strong>Create a merge commit</strong></td><td>Tous les commits + un commit de fusion (« Merge pull request #34… »).</td></tr>
<tr><td><strong>Squash and merge</strong></td><td>Tous les commits écrasés en <em>un seul</em>.</td></tr>
<tr><td><strong>Rebase and merge</strong></td><td>Les commits recopiés un par un, sans commit de fusion.</td></tr>
</tbody>
</table>
<div class="callout project">Le commit <code>03a27c5 Merge pull request #34…</code> de 3D Reader vient du premier bouton : c'est toi qui as fusionné la PR #34. Les règles du projet disent que tu fusionnes toi-même : Claude Code ouvre les PR, ne les fusionne pas.</div>
<div class="flow-wrap"><div data-widget="git-flow-pr"></div></div>
`,
        en: `
<p>Git is the tool; <strong>GitHub</strong> is the website that hosts repositories and adds everything needed to work together: discussions, reviews, automation, publishing.</p>

<h3>The tabs of a repository</h3>
<table>
<thead><tr><th>Tab</th><th>What it is for</th></tr></thead>
<tbody>
<tr><td><strong>Code</strong></td><td>The files, the README shown below, the branch selector, the green "Code" button to clone.</td></tr>
<tr><td><strong>Issues</strong></td><td>Tickets: bugs, ideas, questions.</td></tr>
<tr><td><strong>Pull requests</strong></td><td>Requests to merge one branch into another.</td></tr>
<tr><td><strong>Actions</strong></td><td>Automations (tests, deployment) and their logs.</td></tr>
<tr><td><strong>Settings</strong></td><td>Settings: visibility, Pages, secrets, branch protection.</td></tr>
</tbody>
</table>

<h3>Issue and fork</h3>
<p>An <span class="term" data-term="issue">issue</span> is a numbered ticket (#12): "the parting card overflows on a small screen". It can be assigned, given <strong>labels</strong> (<code>bug</code>, <code>enhancement</code>), closed or reopened. A <span class="term" data-term="fork">fork</span> is a copy of a repository in <em>your</em> GitHub account: useful to contribute to a project you cannot write to.</p>

<h3>The pull request (PR)</h3>
<p>A <span class="term" data-term="pull-request">pull request</span> says: "I propose to merge branch X into main". It has a number shared with issues (#35). Its parts:</p>
<ul>
  <li><strong>Title and description</strong>: the summary of the batch (Claude Code puts what changed and how it is tested).</li>
  <li><strong>Conversation</strong>: comments and the status of checks (CI ticks).</li>
  <li><strong>Commits</strong>: the list of the branch's commits.</li>
  <li><strong>Files changed</strong>: the full diff, file by file.</li>
</ul>
<p>A <strong>draft</strong> PR signals "not ready yet, do not merge". <code>@name</code> in a comment mentions (and notifies) someone; <code>#35</code> links to PR 35.</p>

<h3>The review</h3>
<p>In <em>Files changed</em>, click the <strong>+</strong> left of a line to leave a <strong>line comment</strong>, or even a <strong>suggestion</strong> (a proposed edit the author applies in one click). Then finish with <em>Review changes</em>:</p>
<ul>
  <li><strong>Comment</strong>: remarks without a verdict;</li>
  <li><strong>Approve</strong>: "fine by me";</li>
  <li><strong>Request changes</strong>: "fix before merging".</li>
</ul>

<h3>The three ways to merge</h3>
<table>
<thead><tr><th>Button</th><th>Result in main</th></tr></thead>
<tbody>
<tr><td><strong>Create a merge commit</strong></td><td>All commits + a merge commit ("Merge pull request #34…").</td></tr>
<tr><td><strong>Squash and merge</strong></td><td>All commits squashed into <em>one</em>.</td></tr>
<tr><td><strong>Rebase and merge</strong></td><td>Commits copied one by one, no merge commit.</td></tr>
</tbody>
</table>
<div class="callout project">3D Reader's commit <code>03a27c5 Merge pull request #34…</code> comes from the first button: you merged PR #34. The project rules say you merge yourself: Claude Code opens PRs, it does not merge them.</div>
<div class="flow-wrap"><div data-widget="git-flow-pr"></div></div>
`,
      },
      deep: {
        fr: `
<h3>La pull request, c'est une demande de modification d'outillage</h3>
<div class="callout analogy">Dans l'atelier, personne ne modifie un moule de série sans une <strong>demande de modification</strong> : un formulaire qui décrit le changement, les plans avant/après, et une case de signature du responsable. La pull request est ce formulaire. Le diff, ce sont les plans avant/après. Le bouton « Merge », c'est ta signature.</div>

<h3>Ta routine de relecture d'une PR de Claude Code</h3>
<ol>
  <li><strong>Lis le titre et la description</strong> : qu'est-ce qui est censé changer ?</li>
  <li><strong>Regarde les coches</strong> en bas de la conversation : tout vert ? Sinon, ne fusionne pas.</li>
  <li><strong>Ouvre Files changed</strong> et parcours les fichiers qui te parlent (textes de l'interface, valeurs par défaut).</li>
  <li><strong>Commente</strong> une ligne si quelque chose t'étonne (« pourquoi 5 mm ? »). Claude Code peut répondre et corriger.</li>
  <li><strong>Fusionne</strong> quand tu es d'accord.</li>
</ol>

<h3>Issue ou PR ?</h3>
<ul>
  <li><strong>Issue</strong> = « il y a un problème / j'ai une idée » (pas de code).</li>
  <li><strong>PR</strong> = « voici du code qui répond au problème ».</li>
</ul>
<p>Écrire <code>Fixes #12</code> dans la description d'une PR ferme automatiquement l'issue 12 au moment de la fusion.</p>

<h3>Approve, Comment, Request changes : trois tampons</h3>
<ul>
  <li>✅ <strong>Approve</strong> : tampon « Bon pour fusion ».</li>
  <li>💬 <strong>Comment</strong> : post-it, sans tampon.</li>
  <li>⛔ <strong>Request changes</strong> : tampon « Refusé en l'état ».</li>
</ul>

<h3>Squash : quand c'est utile</h3>
<p>Une branche avec 40 petits commits (« typo », « encore typo »…) peut être <em>écrasée</em> en un seul commit propre dans main. Inconvénient : on perd le détail des étapes.</p>
`,
        en: `
<h3>The pull request is a tooling change request</h3>
<div class="callout analogy">In the shop, nobody modifies a production die without a <strong>change request</strong>: a form describing the change, before/after drawings, and a signature box for the manager. The pull request is that form. The diff is the before/after drawings. The "Merge" button is your signature.</div>

<h3>Your routine for reviewing a Claude Code PR</h3>
<ol>
  <li><strong>Read the title and description</strong>: what is supposed to change?</li>
  <li><strong>Look at the ticks</strong> at the bottom of the conversation: all green? Otherwise, do not merge.</li>
  <li><strong>Open Files changed</strong> and browse the files that speak to you (interface texts, default values).</li>
  <li><strong>Comment</strong> on a line if something surprises you ("why 5 mm?"). Claude Code can answer and fix it.</li>
  <li><strong>Merge</strong> when you agree.</li>
</ol>

<h3>Issue or PR?</h3>
<ul>
  <li><strong>Issue</strong> = "there is a problem / I have an idea" (no code).</li>
  <li><strong>PR</strong> = "here is code that answers the problem".</li>
</ul>
<p>Writing <code>Fixes #12</code> in a PR description automatically closes issue 12 when it is merged.</p>

<h3>Approve, Comment, Request changes: three stamps</h3>
<ul>
  <li>✅ <strong>Approve</strong>: "Good to merge" stamp.</li>
  <li>💬 <strong>Comment</strong>: a sticky note, no stamp.</li>
  <li>⛔ <strong>Request changes</strong>: "Rejected as is" stamp.</li>
</ul>

<h3>Squash: when it helps</h3>
<p>A branch with 40 tiny commits ("typo", "typo again"…) can be <em>squashed</em> into one clean commit in main. Downside: you lose the detail of the steps.</p>
`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'git-5',
      title: { fr: 'GitHub Actions : la CI qui teste tout', en: 'GitHub Actions: the CI that tests everything' },
      skills: ['git.actions'],
      minutes: 14,
      body: {
        fr: `
<p>La <span class="term" data-term="ci">CI</span> (<em>intégration continue</em>) est un contrôle qualité automatique : à chaque envoi de code, un ordinateur de GitHub télécharge le projet, l'installe et lance tous les tests. Comme un banc de contrôle en sortie de ligne : aucune pièce ne part sans être passée dessus.</p>

<h3>Un workflow = un fichier YAML</h3>
<p>Les automatismes sont décrits dans <code>.github/workflows/*.yml</code>, au format <span class="term" data-term="yaml">YAML</span> (indentation = structure, <code>clé: valeur</code>, <code>-</code> = élément de liste). Voici l'essentiel de <code>ci.yml</code> de 3D Reader :</p>
~~~yaml title=".github/workflows/ci.yml (extrait)"
name: CI«1»

on:«2»
  push:
  pull_request:
  workflow_dispatch:

jobs:«3»
  test:
    runs-on: ubuntu-24.04«4»
    timeout-minutes: 30
    steps:«5»
      - uses: actions/checkout@v7«6»
      - uses: actions/setup-python@v7
        with:
          python-version: "3.11"
      - name: Python engine tests
        run: pytest«7»
      - uses: actions/setup-node@v7
        with:
          node-version: "24"
      - name: Install Node dependencies
        run: npm ci
      - name: Browser engine tests
        run: npm test
      - name: Build the static site
        run: npm run build
        env:«8»
          BASE_PATH: /\${{ github.event.repository.name }}
      - name: End-to-end tests of the built site
        run: npm run test:e2e
~~~
<ol class="notes">
  <li><code>name</code> : le nom affiché dans l'onglet Actions.</li>
  <li><code>on</code> : <strong>quand</strong> ça se déclenche : à chaque push, sur les PR, ou à la main (<code>workflow_dispatch</code>).</li>
  <li><code>jobs</code> : les tâches ; ici une seule, <code>test</code>.</li>
  <li><code>runs-on</code> : la machine virtuelle utilisée (un Linux Ubuntu tout neuf à chaque fois).</li>
  <li><code>steps</code> : les étapes, exécutées dans l'ordre ; si une échoue, la suite s'arrête.</li>
  <li><code>uses</code> : une action toute faite (ici : récupérer le code du dépôt).</li>
  <li><code>run</code> : une commande de terminal, comme si tu la tapais.</li>
  <li><code>env</code> : des variables d'environnement données à l'étape. <code>\${{ … }}</code> insère une valeur fournie par GitHub.</li>
</ol>

<h3>Lire le résultat</h3>
<ul>
  <li>🟡 point jaune : en cours ; ✅ coche verte : tout est passé ; ❌ croix rouge : au moins une étape a échoué.</li>
  <li>Clique sur la croix → <em>Details</em> → l'étape rouge s'ouvre avec ses <strong>logs</strong> (le texte affiché par les commandes). L'erreur est presque toujours dans les dernières lignes.</li>
  <li><strong>Re-run jobs</strong> relance le workflow. Mais attention : relancer en espérant que « ça passe » n'est pas une correction (voir « flaky » dans la leçon jargon).</li>
  <li>Les <strong>artefacts</strong> sont des fichiers produits par un job et téléchargeables (rapports, site construit).</li>
  <li>Les <span class="term" data-term="secret">secrets</span> (<em>Settings → Secrets</em>) sont des valeurs cachées (clés d'API) qu'un workflow peut utiliser sans qu'elles apparaissent dans les logs ni dans le code.</li>
</ul>

<h3>Les finesses de ci.yml</h3>
~~~yaml
concurrency:
  group: ci-\${{ github.ref == 'refs/heads/main' && github.run_id || github.ref }}
  cancel-in-progress: \${{ github.ref != 'refs/heads/main' }}
~~~
<p>Traduction : sur une branche de travail, un nouveau push <strong>annule</strong> la CI précédente devenue inutile ; sur main, chaque commit est testé jusqu'au bout, parce que le déploiement attend ce résultat.</p>
<div class="callout project">« 791 tests unitaires verts ; e2e 104/105 » dans le fichier de reprise : ce sont les étapes <code>npm test</code> et <code>npm run test:e2e</code> de ce workflow.</div>
`,
        en: `
<p><span class="term" data-term="ci">CI</span> (continuous integration) is an automatic quality check: on every code push, a GitHub computer downloads the project, installs it and runs all the tests. Like an end-of-line inspection bench: no part leaves without going through it.</p>

<h3>A workflow = a YAML file</h3>
<p>Automations are described in <code>.github/workflows/*.yml</code>, in <span class="term" data-term="yaml">YAML</span> (indentation = structure, <code>key: value</code>, <code>-</code> = list item). Here is the core of 3D Reader's <code>ci.yml</code>:</p>
~~~yaml title=".github/workflows/ci.yml (excerpt)"
name: CI«1»

on:«2»
  push:
  pull_request:
  workflow_dispatch:

jobs:«3»
  test:
    runs-on: ubuntu-24.04«4»
    timeout-minutes: 30
    steps:«5»
      - uses: actions/checkout@v7«6»
      - uses: actions/setup-python@v7
        with:
          python-version: "3.11"
      - name: Python engine tests
        run: pytest«7»
      - uses: actions/setup-node@v7
        with:
          node-version: "24"
      - name: Install Node dependencies
        run: npm ci
      - name: Browser engine tests
        run: npm test
      - name: Build the static site
        run: npm run build
        env:«8»
          BASE_PATH: /\${{ github.event.repository.name }}
      - name: End-to-end tests of the built site
        run: npm run test:e2e
~~~
<ol class="notes">
  <li><code>name</code>: the name shown in the Actions tab.</li>
  <li><code>on</code>: <strong>when</strong> it triggers: on every push, on PRs, or by hand (<code>workflow_dispatch</code>).</li>
  <li><code>jobs</code>: the tasks; here only one, <code>test</code>.</li>
  <li><code>runs-on</code>: the virtual machine used (a brand-new Ubuntu Linux every time).</li>
  <li><code>steps</code>: the steps, run in order; if one fails, the rest stops.</li>
  <li><code>uses</code>: a ready-made action (here: fetch the repository's code).</li>
  <li><code>run</code>: a terminal command, as if you typed it.</li>
  <li><code>env</code>: environment variables given to the step. <code>\${{ … }}</code> inserts a value provided by GitHub.</li>
</ol>

<h3>Reading the result</h3>
<ul>
  <li>🟡 yellow dot: running; ✅ green tick: everything passed; ❌ red cross: at least one step failed.</li>
  <li>Click the cross → <em>Details</em> → the red step opens with its <strong>logs</strong> (the text printed by the commands). The error is almost always in the last lines.</li>
  <li><strong>Re-run jobs</strong> runs the workflow again. But careful: re-running in the hope it "passes" is not a fix (see "flaky" in the jargon lesson).</li>
  <li><strong>Artifacts</strong> are files produced by a job and downloadable (reports, built site).</li>
  <li><span class="term" data-term="secret">Secrets</span> (<em>Settings → Secrets</em>) are hidden values (API keys) a workflow can use without them appearing in logs or code.</li>
</ul>

<h3>The finer points of ci.yml</h3>
~~~yaml
concurrency:
  group: ci-\${{ github.ref == 'refs/heads/main' && github.run_id || github.ref }}
  cancel-in-progress: \${{ github.ref != 'refs/heads/main' }}
~~~
<p>Translation: on a work branch, a new push <strong>cancels</strong> the previous CI run that became useless; on main, every commit is tested to the end, because deployment waits for that result.</p>
<div class="callout project">"791 unit tests green; e2e 104/105" in the hand-off file: those are the <code>npm test</code> and <code>npm run test:e2e</code> steps of this workflow.</div>
`,
      },
      deep: {
        fr: `
<h3>La CI, c'est le contrôle réception… automatique</h3>
<div class="callout analogy">Chaque fois que Claude Code « livre » des commits (push), un contrôleur robot reçoit le lot, monte la pièce sur un banc neuf, et passe toute la gamme de contrôle : cotes (tests unitaires), assemblage (construction du site), essai fonctionnel (tests de bout en bout dans un vrai navigateur). Verdict : conforme ✅ ou non conforme ❌.</div>

<h3>Lire un YAML comme une gamme de contrôle</h3>
~~~text
QUAND   (on)        → à chaque livraison (push)
OÙ      (runs-on)   → sur un banc Linux neuf
QUOI    (steps)     → 1. sortir la pièce (checkout)
                      2. installer Python, tester (pytest)
                      3. installer Node, tester (npm test)
                      4. assembler le site (npm run build)
                      5. essai réel dans Chromium (test:e2e)
~~~
<p>L'indentation compte : les étapes « appartiennent » au job parce qu'elles sont décalées vers la droite sous lui. Un espace de travers et le fichier ne veut plus rien dire.</p>

<h3>Quand c'est rouge</h3>
<ol>
  <li>Ne fusionne pas.</li>
  <li>Ouvre les logs de l'étape rouge, descends tout en bas.</li>
  <li>Copie les dernières lignes d'erreur et donne-les à Claude Code : « la CI échoue avec ce message, corrige ».</li>
</ol>

<h3>uses ou run ?</h3>
<ul>
  <li><code>uses</code> = utiliser un outil du commerce (une action publiée, avec une version : <code>@v7</code>).</li>
  <li><code>run</code> = taper soi-même une commande.</li>
</ul>

<h3>Les secrets</h3>
<p>Une clé d'API ne s'écrit <strong>jamais</strong> dans un fichier du dépôt (tout le monde la verrait, et l'historique Git la garde pour toujours). Elle va dans les secrets de GitHub ou, pour la passerelle IA de 3D Reader, dans les variables d'environnement de Vercel.</p>
`,
        en: `
<h3>CI is incoming inspection… automated</h3>
<div class="callout analogy">Every time Claude Code "delivers" commits (push), a robot inspector receives the batch, mounts the part on a fresh bench, and runs the whole inspection plan: dimensions (unit tests), assembly (site build), functional test (end-to-end tests in a real browser). Verdict: compliant ✅ or non-compliant ❌.</div>

<h3>Read a YAML like an inspection plan</h3>
~~~text
WHEN    (on)        → on every delivery (push)
WHERE   (runs-on)   → on a fresh Linux bench
WHAT    (steps)     → 1. take the part out (checkout)
                      2. install Python, test (pytest)
                      3. install Node, test (npm test)
                      4. assemble the site (npm run build)
                      5. real test in Chromium (test:e2e)
~~~
<p>Indentation matters: the steps "belong" to the job because they are shifted right under it. One stray space and the file means nothing any more.</p>

<h3>When it is red</h3>
<ol>
  <li>Do not merge.</li>
  <li>Open the logs of the red step, scroll to the very bottom.</li>
  <li>Copy the last error lines and give them to Claude Code: "CI fails with this message, fix it".</li>
</ol>

<h3>uses or run?</h3>
<ul>
  <li><code>uses</code> = use an off-the-shelf tool (a published action, with a version: <code>@v7</code>).</li>
  <li><code>run</code> = type a command yourself.</li>
</ul>

<h3>Secrets</h3>
<p>An API key is <strong>never</strong> written in a repository file (everyone would see it, and Git history keeps it forever). It goes in GitHub's secrets or, for 3D Reader's AI gateway, in Vercel's environment variables.</p>
`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'git-6',
      title: { fr: 'GitHub Pages : publier le site', en: 'GitHub Pages: publishing the site' },
      skills: ['git.pages'],
      minutes: 10,
      body: {
        fr: `
<p><span class="term" data-term="pages">GitHub Pages</span> héberge gratuitement un <strong>site statique</strong> : des fichiers HTML, CSS, JavaScript, images, envoyés tels quels au navigateur. Pas de serveur qui calcule : c'est pour ça que 3D Reader fait tous ses calculs <em>dans le navigateur</em> (OpenCascade compilé en WebAssembly) au lieu du serveur Python.</p>

<h3>L'adresse</h3>
<p>Un site Pages est publié à <code>https://&lt;propriétaire&gt;.github.io/&lt;dépôt&gt;/</code>. Pour 3D Reader : <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>. Le site ne vit donc pas à la racine du domaine mais dans le sous-dossier <code>/3D-reader/</code>. C'est le rôle de <code>BASE_PATH</code> : dire à la construction quel est ce préfixe.</p>

<h3>La chaîne de publication de 3D Reader</h3>
~~~yaml title=".github/workflows/pages.yml (extrait)"
on:
  workflow_run:«1»
    workflows: [CI]
    types: [completed]
    branches: [main]
  workflow_dispatch:«2»

jobs:
  select:«3»
    if: github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch'
  build:«4»
    needs: select
    steps:
      - uses: actions/checkout@v7
      - run: npm ci
      - run: npm run build
        env:
          BASE_PATH: \${{ steps.pages.outputs.base_path }}
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist/
          include-hidden-files: true
  deploy:«5»
    needs: build
    steps:
      - uses: actions/deploy-pages@v5
~~~
<ol class="notes">
  <li>Se déclenche quand le workflow <strong>CI</strong> est terminé sur <strong>main</strong>.</li>
  <li>Ou à la main, depuis l'onglet Actions (« Run workflow »).</li>
  <li><code>select</code> vérifie que la CI a <strong>réussi</strong> (et que ce commit est toujours le dernier de main).</li>
  <li><code>build</code> construit le site dans <code>dist/</code> et l'emballe en artefact. <code>needs</code> = « attendre que select ait fini ».</li>
  <li><code>deploy</code> publie l'artefact.</li>
</ol>
<p>Conséquence : <strong>un commit qui casse les tests n'est jamais publié</strong>.</p>

<h3>Deux fichiers spéciaux</h3>
<ul>
  <li><code>.nojekyll</code> : un fichier vide qui dit à Pages de ne pas passer le site dans Jekyll (un générateur de sites qui ignorerait, entre autres, les dossiers commençant par <code>_</code>). Comme il commence par un point, il faut <code>include-hidden-files: true</code>.</li>
  <li><code>404.html</code> : la page renvoyée pour une adresse inconnue. 3D Reader y met une copie de l'appli, pour qu'un lien profond fonctionne quand même.</li>
</ul>

<h3>Réglage unique</h3>
<p>Dans le dépôt : <em>Settings → Pages → Source : GitHub Actions</em>. Un dépôt privé demande un abonnement payant pour Pages ; le site publié, lui, est public dans tous les cas.</p>

<h3>Tags et releases</h3>
<p>Un <span class="term" data-term="tag">tag</span> est une étiquette fixe posée sur un commit (<code>v0.2.0</code>) : « cette version-là ». Une <strong>release</strong> GitHub est une page construite sur un tag, avec des notes de version et des fichiers à télécharger. Pratique pour dire « la version livrée au client était la 0.2.0 ».</p>
`,
        en: `
<p><span class="term" data-term="pages">GitHub Pages</span> hosts a <strong>static site</strong> for free: HTML, CSS, JavaScript files, images, sent as-is to the browser. No server that computes: that is why 3D Reader does all its computing <em>in the browser</em> (OpenCascade compiled to WebAssembly) instead of on the Python server.</p>

<h3>The address</h3>
<p>A Pages site is published at <code>https://&lt;owner&gt;.github.io/&lt;repository&gt;/</code>. For 3D Reader: <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>. So the site does not live at the root of the domain but in the <code>/3D-reader/</code> subfolder. That is the job of <code>BASE_PATH</code>: telling the build what that prefix is.</p>

<h3>3D Reader's publishing chain</h3>
~~~yaml title=".github/workflows/pages.yml (excerpt)"
on:
  workflow_run:«1»
    workflows: [CI]
    types: [completed]
    branches: [main]
  workflow_dispatch:«2»

jobs:
  select:«3»
    if: github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch'
  build:«4»
    needs: select
    steps:
      - uses: actions/checkout@v7
      - run: npm ci
      - run: npm run build
        env:
          BASE_PATH: \${{ steps.pages.outputs.base_path }}
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist/
          include-hidden-files: true
  deploy:«5»
    needs: build
    steps:
      - uses: actions/deploy-pages@v5
~~~
<ol class="notes">
  <li>Triggers when the <strong>CI</strong> workflow has completed on <strong>main</strong>.</li>
  <li>Or by hand, from the Actions tab ("Run workflow").</li>
  <li><code>select</code> checks that CI <strong>succeeded</strong> (and that this commit is still main's latest).</li>
  <li><code>build</code> builds the site into <code>dist/</code> and packs it as an artifact. <code>needs</code> = "wait for select to finish".</li>
  <li><code>deploy</code> publishes the artifact.</li>
</ol>
<p>Consequence: <strong>a commit that breaks the tests is never published</strong>.</p>

<h3>Two special files</h3>
<ul>
  <li><code>.nojekyll</code>: an empty file telling Pages not to run the site through Jekyll (a site generator that would, among other things, ignore folders starting with <code>_</code>). Since it starts with a dot, <code>include-hidden-files: true</code> is needed.</li>
  <li><code>404.html</code>: the page returned for an unknown address. 3D Reader puts a copy of the app there, so a deep link still works.</li>
</ul>

<h3>One-time setting</h3>
<p>In the repository: <em>Settings → Pages → Source: GitHub Actions</em>. A private repository needs a paid plan for Pages; the published site is public in every case.</p>

<h3>Tags and releases</h3>
<p>A <span class="term" data-term="tag">tag</span> is a fixed label on a commit (<code>v0.2.0</code>): "that version". A GitHub <strong>release</strong> is a page built on a tag, with release notes and downloadable files. Handy to say "the version delivered to the customer was 0.2.0".</p>
`,
      },
      deep: {
        fr: `
<h3>Pages, c'est une vitrine, pas un atelier</h3>
<div class="callout analogy">GitHub Pages est une <strong>vitrine</strong> : on y pose des objets finis (les fichiers du site) et les passants (les navigateurs) les regardent. Personne ne travaille derrière la vitrine. Si tu veux qu'un calcul soit fait, il faut que ce soit le visiteur qui le fasse, chez lui, dans son navigateur.</div>

<h3>Le trajet d'une modification jusqu'au site</h3>
~~~text
 Claude Code ──push──► branche claude/…  ──► CI ✅
                                              │
           toi : Merge pull request ◄─────────┘
                       │
                       ▼
                     main ──► CI ✅ ──► pages.yml ──► site en ligne
~~~
<p>Il y a donc <strong>deux</strong> passages de CI : un sur la branche (pour que tu fusionnes en confiance), un sur main (pour autoriser la publication).</p>

<h3>Pourquoi <code>/3D-reader/</code> pose problème</h3>
<p>Si une page demande le fichier <code>/style.css</code>, le navigateur va chercher <code>alexdevanssay-cmyk.github.io/style.css</code>… qui n'existe pas : le bon chemin est <code>/3D-reader/style.css</code>. <code>BASE_PATH</code> évite cette erreur d'adresse, comme indiquer le numéro de bâtiment en plus de la rue.</p>

<h3>Mon site ne s'est pas mis à jour !</h3>
<ul>
  <li>La PR est-elle bien <strong>fusionnée</strong> dans main ?</li>
  <li>La CI de main est-elle <strong>verte</strong> ? Sinon pages.yml ne publie rien.</li>
  <li>Le navigateur garde parfois l'ancienne version quelques minutes : recharge avec <kbd>Ctrl</kbd>+<kbd>F5</kbd>.</li>
</ul>

<h3>Tag = indice gelé</h3>
<p>Une branche avance tout le temps ; un tag, jamais. C'est l'équivalent de l'indice « livré » d'un plan : figé, archivé, retrouvable.</p>
`,
        en: `
<h3>Pages is a shop window, not a workshop</h3>
<div class="callout analogy">GitHub Pages is a <strong>shop window</strong>: finished items (the site's files) are placed there and passers-by (browsers) look at them. Nobody works behind the window. If you want a computation done, the visitor has to do it, at home, in their browser.</div>

<h3>The path of a change to the site</h3>
~~~text
 Claude Code ──push──► claude/… branch  ──► CI ✅
                                              │
           you: Merge pull request ◄──────────┘
                       │
                       ▼
                     main ──► CI ✅ ──► pages.yml ──► site online
~~~
<p>So there are <strong>two</strong> CI passes: one on the branch (so you merge with confidence), one on main (to allow publishing).</p>

<h3>Why <code>/3D-reader/</code> is a problem</h3>
<p>If a page asks for the file <code>/style.css</code>, the browser looks for <code>alexdevanssay-cmyk.github.io/style.css</code>… which does not exist: the right path is <code>/3D-reader/style.css</code>. <code>BASE_PATH</code> avoids that address mistake, like giving the building number as well as the street.</p>

<h3>My site did not update!</h3>
<ul>
  <li>Is the PR actually <strong>merged</strong> into main?</li>
  <li>Is main's CI <strong>green</strong>? Otherwise pages.yml publishes nothing.</li>
  <li>The browser sometimes keeps the old version a few minutes: reload with <kbd>Ctrl</kbd>+<kbd>F5</kbd>.</li>
</ul>

<h3>Tag = frozen revision</h3>
<p>A branch moves all the time; a tag never does. It is the equivalent of a drawing's "delivered" revision: frozen, archived, retrievable.</p>
`,
      },
    },
    // ------------------------------------------------------------------ 7
    {
      id: 'git-7',
      title: { fr: 'Le jargon des développeurs', en: 'Developer jargon' },
      skills: ['git.jargon'],
      minutes: 10,
      body: {
        fr: `
<p>Sur GitHub, les commentaires sont pleins d'abréviations anglaises. Les voici décodées : après cette leçon, plus aucun commentaire de PR ne te sera opaque.</p>

<h3>Les abréviations des commentaires</h3>
<table>
<thead><tr><th>Terme</th><th>Anglais</th><th>Sens</th></tr></thead>
<tbody>
<tr><td><strong>LGTM</strong></td><td>Looks Good To Me</td><td>« Ça me va » : accord pour fusionner.</td></tr>
<tr><td><strong>WIP</strong></td><td>Work In Progress</td><td>Travail en cours, pas prêt.</td></tr>
<tr><td><strong>nit</strong></td><td>nitpick</td><td>Détail mineur (« pinaillage »), non bloquant.</td></tr>
<tr><td><strong>PTAL</strong></td><td>Please Take A Look</td><td>« Peux-tu regarder ? »</td></tr>
<tr><td><strong>TL;DR</strong></td><td>Too Long; Didn't Read</td><td>Le résumé en une phrase.</td></tr>
<tr><td><strong>RFC</strong></td><td>Request For Comments</td><td>Proposition soumise à discussion.</td></tr>
<tr><td><strong>IMO / IMHO</strong></td><td>In My (Humble) Opinion</td><td>« À mon avis ».</td></tr>
<tr><td><strong>FYI</strong></td><td>For Your Information</td><td>Pour info.</td></tr>
</tbody>
</table>

<h3>Les mots du métier</h3>
<table>
<thead><tr><th>Terme</th><th>Sens</th></tr></thead>
<tbody>
<tr><td><strong>bump</strong></td><td>Monter un numéro de version (« bump three to 0.180.0 »).</td></tr>
<tr><td><strong>hotfix</strong></td><td>Correctif urgent, livré vite, souvent directement depuis main.</td></tr>
<tr><td><strong>revert</strong></td><td>Commit qui <em>annule</em> un commit précédent (sans effacer l'historique).</td></tr>
<tr><td><strong><span class="term" data-term="flaky">flaky</span></strong></td><td>Test « capricieux » qui échoue parfois sans changement du code. Dans 3D Reader : les tests de durée qui échouent quand la machine est chargée. « Flaky n'est pas une cause racine » : il faut comprendre pourquoi.</td></tr>
<tr><td><strong>upstream / downstream</strong></td><td>En amont (le projet d'origine, ou la branche distante suivie) / en aval (ceux qui dépendent de toi).</td></tr>
<tr><td><strong>monorepo</strong></td><td>Un seul dépôt pour plusieurs projets.</td></tr>
<tr><td><strong>breaking change</strong></td><td>Changement qui casse la compatibilité.</td></tr>
<tr><td><strong>refactor</strong></td><td>Réorganiser le code sans changer ce qu'il fait.</td></tr>
</tbody>
</table>

<h3>Les fichiers qu'on retrouve partout</h3>
<ul>
  <li><code>README.md</code> : la notice, affichée sur la page d'accueil du dépôt (en Markdown).</li>
  <li><code>LICENSE</code> : les droits d'utilisation du code.</li>
  <li><code>CHANGELOG.md</code> : la liste des changements, version par version.</li>
  <li><code>.gitignore</code> : la liste des fichiers que Git doit <strong>ignorer</strong>. Celui de 3D Reader contient <code>node_modules/</code>, <code>dist/</code>, <code>.venv/</code>… (fichiers régénérables ou trop gros).</li>
  <li><strong>LFS</strong> (<em>Large File Storage</em>) : extension de Git pour les gros fichiers binaires ; le dépôt ne garde qu'un « pointeur ».</li>
</ul>
~~~text title=".gitignore de 3D Reader (début)"
.venv/
__pycache__/
node_modules/
dist/
web/vendor/opencascade/
test-results/
~~~

<h3>Le versionnage sémantique (semver)</h3>
<p><code>package.json</code> de 3D Reader annonce <code>"version": "0.2.0"</code>. Lecture : <strong>MAJEUR.MINEUR.CORRECTIF</strong>.</p>
<ul>
  <li><strong>correctif</strong> (0.2.<strong>1</strong>) : réparation, rien ne change pour l'utilisateur ;</li>
  <li><strong>mineur</strong> (0.<strong>3</strong>.0) : nouvelle fonction, compatible ;</li>
  <li><strong>majeur</strong> (<strong>1</strong>.0.0) : changement incompatible. Un majeur à 0 signifie « encore en développement ».</li>
</ul>
<div class="callout tip">Dans <code>package.json</code>, <code>"^1.56.1"</code> veut dire « 1.56.1 ou plus récent, tant que le majeur reste 1 ».</div>
`,
        en: `
<p>On GitHub, comments are full of English abbreviations. Here they are decoded: after this lesson, no PR comment will be opaque to you any more.</p>

<h3>Comment abbreviations</h3>
<table>
<thead><tr><th>Term</th><th>Stands for</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>LGTM</strong></td><td>Looks Good To Me</td><td>"Fine by me": OK to merge.</td></tr>
<tr><td><strong>WIP</strong></td><td>Work In Progress</td><td>Ongoing work, not ready.</td></tr>
<tr><td><strong>nit</strong></td><td>nitpick</td><td>Minor detail, not blocking.</td></tr>
<tr><td><strong>PTAL</strong></td><td>Please Take A Look</td><td>"Can you look?"</td></tr>
<tr><td><strong>TL;DR</strong></td><td>Too Long; Didn't Read</td><td>The one-sentence summary.</td></tr>
<tr><td><strong>RFC</strong></td><td>Request For Comments</td><td>Proposal put up for discussion.</td></tr>
<tr><td><strong>IMO / IMHO</strong></td><td>In My (Humble) Opinion</td><td>"I think".</td></tr>
<tr><td><strong>FYI</strong></td><td>For Your Information</td><td>Just so you know.</td></tr>
</tbody>
</table>

<h3>Trade words</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>bump</strong></td><td>Raise a version number ("bump three to 0.180.0").</td></tr>
<tr><td><strong>hotfix</strong></td><td>Urgent fix, shipped fast, often straight from main.</td></tr>
<tr><td><strong>revert</strong></td><td>A commit that <em>undoes</em> an earlier commit (without erasing history).</td></tr>
<tr><td><strong><span class="term" data-term="flaky">flaky</span></strong></td><td>A test that sometimes fails without any code change. In 3D Reader: the timing tests that fail when the machine is loaded. "Flaky is not a root cause": you must understand why.</td></tr>
<tr><td><strong>upstream / downstream</strong></td><td>Upstream (the original project, or the tracked remote branch) / downstream (those depending on you).</td></tr>
<tr><td><strong>monorepo</strong></td><td>One repository for several projects.</td></tr>
<tr><td><strong>breaking change</strong></td><td>A change that breaks compatibility.</td></tr>
<tr><td><strong>refactor</strong></td><td>Reorganise code without changing what it does.</td></tr>
</tbody>
</table>

<h3>Files you find everywhere</h3>
<ul>
  <li><code>README.md</code>: the manual, shown on the repository's home page (in Markdown).</li>
  <li><code>LICENSE</code>: the rights to use the code.</li>
  <li><code>CHANGELOG.md</code>: the list of changes, version by version.</li>
  <li><code>.gitignore</code>: the list of files Git must <strong>ignore</strong>. 3D Reader's contains <code>node_modules/</code>, <code>dist/</code>, <code>.venv/</code>… (files that can be regenerated or are too big).</li>
  <li><strong>LFS</strong> (Large File Storage): a Git extension for large binary files; the repository only keeps a "pointer".</li>
</ul>
~~~text title="3D Reader's .gitignore (start)"
.venv/
__pycache__/
node_modules/
dist/
web/vendor/opencascade/
test-results/
~~~

<h3>Semantic versioning (semver)</h3>
<p>3D Reader's <code>package.json</code> says <code>"version": "0.2.0"</code>. Read it as <strong>MAJOR.MINOR.PATCH</strong>.</p>
<ul>
  <li><strong>patch</strong> (0.2.<strong>1</strong>): a repair, nothing changes for the user;</li>
  <li><strong>minor</strong> (0.<strong>3</strong>.0): new feature, compatible;</li>
  <li><strong>major</strong> (<strong>1</strong>.0.0): incompatible change. A major of 0 means "still in development".</li>
</ul>
<div class="callout tip">In <code>package.json</code>, <code>"^1.56.1"</code> means "1.56.1 or newer, as long as the major stays 1".</div>
`,
      },
      deep: {
        fr: `
<h3>Un lexique pour survivre à une revue de code</h3>
<div class="callout analogy">C'est comme les abréviations d'un plan : « Ra 3,2 », « ⌀ », « CHF 1×45° ». Opaques au début, évidentes ensuite. Il suffit d'en connaître une dizaine.</div>

<h3>Les 5 à connaître absolument</h3>
<ol>
  <li><strong>LGTM</strong> → feu vert.</li>
  <li><strong>nit</strong> → détail, tu peux ignorer si tu veux.</li>
  <li><strong>WIP</strong> → n'y touche pas encore.</li>
  <li><strong>revert</strong> → marche arrière propre.</li>
  <li><strong>flaky</strong> → test instable, à comprendre, pas à ignorer.</li>
</ol>

<h3>Exemple de commentaire décodé</h3>
~~~text
LGTM overall, just a nit: the label is in English. PTAL at the FR text.
~~~
<p>Traduction : « Globalement ça me va, juste un détail : le libellé est en anglais. Peux-tu regarder le texte français ? »</p>

<h3>.gitignore, la liste « à ne pas archiver »</h3>
<p>Comme au magasin d'archives : on n'archive pas les copeaux. <code>node_modules/</code> (les bibliothèques téléchargées, des centaines de Mo) se réinstallent avec <code>npm ci</code> ; <code>dist/</code> se reconstruit avec <code>npm run build</code>. Inutile de les garder dans l'historique.</p>
<div class="callout warn">Mettre un fichier dans <code>.gitignore</code> après l'avoir committé ne l'efface pas de l'historique. Un fichier confidentiel committé par erreur reste lisible dans les anciens commits : d'où la règle de 3D Reader « ne jamais committer les classeurs de chiffrage ».</div>

<h3>Semver avec des moules</h3>
<ul>
  <li>Correctif : on reprend une bavure → même moule, 0.2.<strong>1</strong>.</li>
  <li>Mineur : on ajoute une empreinte, l'ancienne pièce sort toujours → 0.<strong>3</strong>.0.</li>
  <li>Majeur : nouvelle presse, l'ancien moule ne se monte plus → <strong>1</strong>.0.0.</li>
</ul>
`,
        en: `
<h3>A glossary to survive a code review</h3>
<div class="callout analogy">It is like the abbreviations on a drawing: "Ra 3.2", "⌀", "CHF 1×45°". Opaque at first, obvious afterwards. You only need about ten of them.</div>

<h3>The 5 you must know</h3>
<ol>
  <li><strong>LGTM</strong> → green light.</li>
  <li><strong>nit</strong> → detail, you may ignore it.</li>
  <li><strong>WIP</strong> → do not touch yet.</li>
  <li><strong>revert</strong> → clean step back.</li>
  <li><strong>flaky</strong> → unstable test, to understand, not to ignore.</li>
</ol>

<h3>A decoded comment</h3>
~~~text
LGTM overall, just a nit: the label is in English. PTAL at the FR text.
~~~
<p>Translation: "Overall fine by me, just a detail: the label is in English. Can you look at the French text?"</p>

<h3>.gitignore, the "do not archive" list</h3>
<p>Like the archive room: you do not archive the chips. <code>node_modules/</code> (downloaded libraries, hundreds of MB) is reinstalled with <code>npm ci</code>; <code>dist/</code> is rebuilt with <code>npm run build</code>. No need to keep them in history.</p>
<div class="callout warn">Adding a file to <code>.gitignore</code> after committing it does not erase it from history. A confidential file committed by mistake stays readable in old commits: hence 3D Reader's rule "never commit the costing workbooks".</div>

<h3>Semver with dies</h3>
<ul>
  <li>Patch: you fix a flash → same die, 0.2.<strong>1</strong>.</li>
  <li>Minor: you add a cavity, the old part still comes out → 0.<strong>3</strong>.0.</li>
  <li>Major: new machine, the old die no longer fits → <strong>1</strong>.0.0.</li>
</ul>
`,
      },
    },
  ],
  questions: [
    // ---------------------------------------------------------------- lesson 1
    {
      id: 'git-q1', skill: 'git.basics', lesson: 'git-1', level: 1, type: 'mcq',
      prompt: { fr: `Qu'est-ce qu'un <strong>commit</strong> ?`, en: `What is a <strong>commit</strong>?` },
      choices: {
        fr: [`Un enregistrement daté et signé de l'état du projet`, `L'envoi du code sur GitHub`, `Un fichier de configuration`, `Une copie du dépôt sur un autre compte`],
        en: [`A dated, signed record of the state of the project`, `Sending the code to GitHub`, `A configuration file`, `A copy of the repository in another account`],
      },
      answer: 0,
      explain: { fr: `Un commit est une « photo » du projet avec message, auteur, date et SHA. L'envoi sur GitHub, c'est <code>git push</code> ; la copie sur un autre compte, c'est un fork.`, en: `A commit is a "snapshot" of the project with message, author, date and SHA. Sending to GitHub is <code>git push</code>; a copy in another account is a fork.` },
    },
    {
      id: 'git-q2', skill: 'git.basics', lesson: 'git-1', level: 1, type: 'line',
      prompt: { fr: `Clique sur la ligne qui a été <strong>ajoutée</strong> par ce diff.`, en: `Click the line that was <strong>added</strong> by this diff.` },
      code: `diff --git a/web/i18n.js b/web/i18n.js
@@ -18,7 +18,7 @@ const STRINGS = {
     "top.unit": "Mesh unit",
-    "top.quality": "Quality",
+    "top.quality": "Display quality",
     "top.engine": "Engine",`,
      lang: 'diff',
      answer: 4,
      explain: { fr: `Les lignes ajoutées commencent par <code>+</code>. La ligne en <code>-</code> juste au-dessus est l'ancienne version, supprimée. Les lignes sans signe sont du contexte.`, en: `Added lines start with <code>+</code>. The <code>-</code> line just above is the old version, removed. Lines without a sign are context.` },
    },
    {
      id: 'git-q3', skill: 'git.basics', lesson: 'git-1', level: 2, type: 'order',
      prompt: { fr: `Remets dans l'ordre le trajet d'une modification jusqu'au commit.`, en: `Put in order the path of a change up to the commit.` },
      items: {
        fr: [`Modifier le fichier`, `git add (le poser dans l'index)`, `git commit -m "message"`],
        en: [`Edit the file`, `git add (put it in the index)`, `git commit -m "message"`],
      },
      explain: { fr: `Dossier de travail → index (<code>git add</code>) → historique (<code>git commit</code>).`, en: `Working folder → index (<code>git add</code>) → history (<code>git commit</code>).` },
    },
    {
      id: 'git-q4', skill: 'git.basics', lesson: 'git-1', level: 2, type: 'tf',
      prompt: { fr: `<code>7144ee5</code> et <code>906ebf4</code> sont des SHA abrégés : si un seul caractère d'un fichier change, le SHA du commit change aussi.`, en: `<code>7144ee5</code> and <code>906ebf4</code> are short SHAs: if a single character of a file changes, the commit's SHA changes too.` },
      answer: true,
      explain: { fr: `Le SHA est une empreinte calculée à partir du contenu (et du parent, de l'auteur, du message). Le moindre changement donne une autre empreinte.`, en: `The SHA is a fingerprint computed from the content (and the parent, author, message). The smallest change gives another fingerprint.` },
    },
    // ---------------------------------------------------------------- lesson 2
    {
      id: 'git-q5', skill: 'git.branches', lesson: 'git-2', level: 1, type: 'mcq',
      prompt: { fr: `Que désigne <strong>HEAD</strong> ?`, en: `What does <strong>HEAD</strong> refer to?` },
      choices: {
        fr: [`La branche (et le commit) sur laquelle tu travailles en ce moment`, `Le tout premier commit du dépôt`, `Le chef de projet`, `Le serveur GitHub`],
        en: [`The branch (and commit) you are working on right now`, `The very first commit of the repository`, `The project lead`, `The GitHub server`],
      },
      answer: 0,
      explain: { fr: `HEAD est le marqueur « vous êtes ici ». <code>git switch</code> le déplace d'une branche à l'autre.`, en: `HEAD is the "you are here" marker. <code>git switch</code> moves it from one branch to another.` },
    },
    {
      id: 'git-q6', skill: 'git.branches', lesson: 'git-2', level: 2, type: 'line',
      prompt: { fr: `Dans ce conflit, clique sur la ligne qui <strong>sépare</strong> ta version de la version qui arrive.`, en: `In this conflict, click the line that <strong>separates</strong> your version from the incoming one.` },
      code: `<<<<<<< HEAD
    "top.quality": "Display quality",
=======
    "top.quality": "Mesh quality",
>>>>>>> essai-joint`,
      lang: 'text',
      answer: 2,
      explain: { fr: `<code>=======</code> sépare les deux versions : au-dessus celle de HEAD (ta branche), en dessous celle de la branche qui arrive (<code>essai-joint</code>).`, en: `<code>=======</code> separates the two versions: above is HEAD's (your branch), below is the incoming branch's (<code>essai-joint</code>).` },
    },
    {
      id: 'git-q7', skill: 'git.branches', lesson: 'git-2', level: 2, type: 'fill',
      prompt: { fr: `Complète la commande qui crée la branche <code>essai-joint</code> et s'y place.`, en: `Complete the command that creates the <code>essai-joint</code> branch and moves onto it.` },
      code: `git switch ____ essai-joint`,
      lang: 'bash',
      accept: ['-c', '--create'],
      explain: { fr: `<code>git switch -c nom</code> crée (<em>create</em>) la branche puis s'y place. L'ancienne écriture est <code>git checkout -b nom</code>.`, en: `<code>git switch -c name</code> creates the branch then moves onto it. The older spelling is <code>git checkout -b name</code>.` },
    },
    {
      id: 'git-q8', skill: 'git.branches', lesson: 'git-2', level: 3, type: 'mcq',
      prompt: { fr: `Pourquoi les agents de Claude Code travaillent-ils chacun dans un <strong>worktree</strong> ?`, en: `Why do Claude Code's agents each work in a <strong>worktree</strong>?` },
      choices: {
        fr: [`Pour avoir chacun son dossier de travail sur sa branche, sans se gêner, avec un seul dépôt`, `Pour cacher le code à l'utilisateur`, `Pour éviter de devoir committer`, `Parce que GitHub l'exige pour les pull requests`],
        en: [`So each has its own working folder on its own branch, without interfering, with a single repository`, `To hide the code from the user`, `To avoid having to commit`, `Because GitHub requires it for pull requests`],
      },
      answer: 0,
      explain: { fr: `Un worktree est un dossier de travail supplémentaire branché sur le même dépôt. Plusieurs chantiers avancent en parallèle, puis on fusionne.`, en: `A worktree is an extra working folder attached to the same repository. Several jobs progress in parallel, then get merged.` },
    },
    // ---------------------------------------------------------------- lesson 3
    {
      id: 'git-q9', skill: 'git.remote', lesson: 'git-3', level: 1, type: 'match',
      prompt: { fr: `Associe chaque commande à ce qu'elle fait.`, en: `Match each command with what it does.` },
      pairs: {
        fr: [[`git clone`, `Copier tout le dépôt la première fois`], [`git fetch`, `Télécharger les nouveautés sans toucher aux fichiers`], [`git pull`, `Télécharger et fusionner dans ta branche`], [`git push`, `Envoyer tes commits sur GitHub`]],
        en: [[`git clone`, `Copy the whole repository the first time`], [`git fetch`, `Download what is new without touching files`], [`git pull`, `Download and merge into your branch`], [`git push`, `Send your commits to GitHub`]],
      },
      explain: { fr: `clone = première copie ; fetch = regarder le courrier ; pull = fetch + fusion ; push = envoyer.`, en: `clone = first copy; fetch = pick up the mail; pull = fetch + merge; push = send.` },
    },
    {
      id: 'git-q10', skill: 'git.remote', lesson: 'git-3', level: 2, type: 'mcq',
      prompt: { fr: `<code>git status</code> affiche « Your branch is <strong>ahead</strong> of 'origin/…' by 2 commits ». Que faire pour que GitHub ait tes commits ?`, en: `<code>git status</code> shows "Your branch is <strong>ahead</strong> of 'origin/…' by 2 commits". What do you do so GitHub has your commits?` },
      choices: { fr: [`git push`, `git pull`, `git clone`, `Rien, c'est automatique`], en: [`git push`, `git pull`, `git clone`, `Nothing, it is automatic`] },
      answer: 0,
      explain: { fr: `« ahead » = tu as de l'avance : 2 commits locaux que le distant n'a pas. <code>git push</code> les envoie.`, en: `"ahead" = you are ahead: 2 local commits the remote does not have. <code>git push</code> sends them.` },
    },
    {
      id: 'git-q11', skill: 'git.remote', lesson: 'git-3', level: 2, type: 'tf',
      prompt: { fr: `<code>git push --force</code> peut effacer du dépôt distant des commits que d'autres y avaient poussés.`, en: `<code>git push --force</code> can erase from the remote commits that others had pushed there.` },
      answer: true,
      explain: { fr: `Le force-push remplace la branche distante par la tienne. Les commits qui n'existaient que là-bas disparaissent. D'où l'interdiction sur les branches partagées.`, en: `Force-push replaces the remote branch with yours. Commits that only existed there disappear. Hence the ban on shared branches.` },
    },
    {
      id: 'git-q12', skill: 'git.remote', lesson: 'git-3', level: 1, type: 'fill',
      prompt: { fr: `Quel est le surnom donné par défaut au dépôt GitHub d'où tu as cloné ?`, en: `What nickname is given by default to the GitHub repository you cloned from?` },
      accept: ['origin'],
      explain: { fr: `<code>origin</code> : c'est pour ça qu'on écrit <code>git push -u origin ma-branche</code>.`, en: `<code>origin</code>: that is why you write <code>git push -u origin my-branch</code>.` },
    },
    // ---------------------------------------------------------------- lesson 4
    {
      id: 'git-q13', skill: 'git.github', lesson: 'git-4', level: 1, type: 'mcq',
      prompt: { fr: `Dans une pull request, quel onglet montre le <strong>diff</strong> complet ?`, en: `In a pull request, which tab shows the full <strong>diff</strong>?` },
      choices: { fr: [`Files changed`, `Conversation`, `Actions`, `Settings`], en: [`Files changed`, `Conversation`, `Actions`, `Settings`] },
      answer: 0,
      explain: { fr: `<em>Files changed</em> montre chaque fichier avec ses lignes rouges et vertes ; c'est là qu'on laisse des commentaires de ligne.`, en: `<em>Files changed</em> shows each file with its red and green lines; that is where you leave line comments.` },
    },
    {
      id: 'git-q14', skill: 'git.github', lesson: 'git-4', level: 2, type: 'match',
      prompt: { fr: `Associe chaque verdict de revue à son sens.`, en: `Match each review verdict with its meaning.` },
      pairs: {
        fr: [[`Approve`, `Bon pour fusion`], [`Request changes`, `À corriger avant fusion`], [`Comment`, `Remarques sans verdict`]],
        en: [[`Approve`, `Good to merge`], [`Request changes`, `Fix before merging`], [`Comment`, `Remarks without a verdict`]],
      },
      explain: { fr: `Trois tampons : vert (Approve), rouge (Request changes), post-it (Comment).`, en: `Three stamps: green (Approve), red (Request changes), sticky note (Comment).` },
    },
    {
      id: 'git-q15', skill: 'git.github', lesson: 'git-4', level: 2, type: 'mcq',
      prompt: { fr: `Quel bouton de fusion transforme les 40 commits d'une PR en <strong>un seul</strong> commit dans main ?`, en: `Which merge button turns a PR's 40 commits into <strong>a single</strong> commit in main?` },
      choices: { fr: [`Squash and merge`, `Create a merge commit`, `Rebase and merge`, `Close pull request`], en: [`Squash and merge`, `Create a merge commit`, `Rebase and merge`, `Close pull request`] },
      answer: 0,
      explain: { fr: `<em>Squash</em> = écraser : tous les commits deviennent un seul. <em>Create a merge commit</em> les garde tous et ajoute un commit de fusion.`, en: `<em>Squash</em>: all commits become one. <em>Create a merge commit</em> keeps them all and adds a merge commit.` },
    },
    {
      id: 'git-q16', skill: 'git.github', lesson: 'git-4', level: 1, type: 'tf',
      prompt: { fr: `Dans le projet 3D Reader, Claude Code fusionne lui-même ses pull requests dans main.`, en: `In the 3D Reader project, Claude Code merges its own pull requests into main.` },
      answer: false,
      explain: { fr: `Non : Claude Code ouvre les PR, c'est toi qui les relis et les fusionnes. main reste sous ton contrôle.`, en: `No: Claude Code opens the PRs, you review and merge them. main stays under your control.` },
    },
    // ---------------------------------------------------------------- lesson 5
    {
      id: 'git-q17', skill: 'git.actions', lesson: 'git-5', level: 1, type: 'match',
      prompt: { fr: `Associe chaque clé YAML d'un workflow à son rôle.`, en: `Match each workflow YAML key with its role.` },
      pairs: {
        fr: [[`on`, `Quand le workflow se déclenche`], [`runs-on`, `Sur quelle machine il tourne`], [`steps`, `La liste des étapes, dans l'ordre`], [`uses`, `Utiliser une action toute faite`], [`run`, `Lancer une commande de terminal`]],
        en: [[`on`, `When the workflow triggers`], [`runs-on`, `Which machine it runs on`], [`steps`, `The list of steps, in order`], [`uses`, `Use a ready-made action`], [`run`, `Run a terminal command`]],
      },
      explain: { fr: `Quand (on), où (runs-on), quoi (steps), avec un outil tout fait (uses) ou une commande (run).`, en: `When (on), where (runs-on), what (steps), with an off-the-shelf tool (uses) or a command (run).` },
    },
    {
      id: 'git-q18', skill: 'git.actions', lesson: 'git-5', level: 2, type: 'order',
      prompt: { fr: `Remets dans l'ordre les étapes de <code>ci.yml</code> de 3D Reader.`, en: `Put the steps of 3D Reader's <code>ci.yml</code> in order.` },
      items: {
        fr: [`Récupérer le code (actions/checkout)`, `Tests du moteur Python (pytest)`, `Installer Node (npm ci)`, `Tests du moteur navigateur (npm test)`, `Construire le site (npm run build)`, `Tests de bout en bout (npm run test:e2e)`],
        en: [`Get the code (actions/checkout)`, `Python engine tests (pytest)`, `Install Node (npm ci)`, `Browser engine tests (npm test)`, `Build the site (npm run build)`, `End-to-end tests (npm run test:e2e)`],
      },
      explain: { fr: `On ne peut rien tester sans le code ; les tests e2e ont besoin du site construit, donc ils viennent en dernier.`, en: `Nothing can be tested without the code; e2e tests need the built site, so they come last.` },
    },
    {
      id: 'git-q19', skill: 'git.actions', lesson: 'git-5', level: 2, type: 'mcq',
      prompt: { fr: `La CI de ta PR affiche une croix rouge ❌. Que fais-tu en premier ?`, en: `Your PR's CI shows a red cross ❌. What do you do first?` },
      choices: {
        fr: [`Ouvrir les logs de l'étape rouge et lire les dernières lignes`, `Fusionner quand même`, `Relancer jusqu'à ce que ça passe`, `Supprimer le test qui échoue`],
        en: [`Open the logs of the red step and read the last lines`, `Merge anyway`, `Re-run until it passes`, `Delete the failing test`],
      },
      answer: 0,
      explain: { fr: `Les logs disent pourquoi. Relancer sans comprendre ou désactiver un test cache le problème : les règles de 3D Reader l'interdisent.`, en: `The logs tell you why. Re-running blindly or disabling a test hides the problem: 3D Reader's rules forbid it.` },
    },
    {
      id: 'git-q20', skill: 'git.actions', lesson: 'git-5', level: 3, type: 'line',
      prompt: { fr: `Clique sur la ligne qui permet de lancer ce workflow <strong>à la main</strong> depuis l'onglet Actions.`, en: `Click the line that lets you run this workflow <strong>by hand</strong> from the Actions tab.` },
      code: `name: CI
on:
  push:
  pull_request:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-24.04`,
      lang: 'yaml',
      answer: 4,
      explain: { fr: `<code>workflow_dispatch</code> ajoute le bouton « Run workflow ». <code>push</code> et <code>pull_request</code> sont des déclenchements automatiques.`, en: `<code>workflow_dispatch</code> adds the "Run workflow" button. <code>push</code> and <code>pull_request</code> are automatic triggers.` },
    },
    // ---------------------------------------------------------------- lesson 6
    {
      id: 'git-q21', skill: 'git.pages', lesson: 'git-6', level: 1, type: 'mcq',
      prompt: { fr: `Pourquoi 3D Reader fait-il ses calculs dans le navigateur quand il est sur GitHub Pages ?`, en: `Why does 3D Reader compute in the browser when it is on GitHub Pages?` },
      choices: {
        fr: [`Pages ne sert que des fichiers statiques : aucun programme (comme Python) ne tourne côté serveur`, `Parce que le navigateur est plus rapide qu'un serveur`, `Parce que GitHub interdit le Python`, `Pour économiser de la bande passante`],
        en: [`Pages only serves static files: no program (like Python) runs on the server side`, `Because the browser is faster than a server`, `Because GitHub bans Python`, `To save bandwidth`],
      },
      answer: 0,
      explain: { fr: `Pages est une vitrine : il envoie les fichiers tels quels. Le calcul doit donc se faire chez le visiteur (WebAssembly + JavaScript).`, en: `Pages is a shop window: it sends files as they are. So computation must happen at the visitor's (WebAssembly + JavaScript).` },
    },
    {
      id: 'git-q22', skill: 'git.pages', lesson: 'git-6', level: 2, type: 'order',
      prompt: { fr: `Remets dans l'ordre le trajet d'une modification jusqu'au site en ligne.`, en: `Put in order the path of a change to the live site.` },
      items: {
        fr: [`Claude Code pousse sur sa branche`, `La CI de la branche passe au vert`, `Tu fusionnes la pull request dans main`, `La CI de main passe au vert`, `pages.yml construit et publie dist/`],
        en: [`Claude Code pushes to its branch`, `The branch's CI turns green`, `You merge the pull request into main`, `main's CI turns green`, `pages.yml builds and publishes dist/`],
      },
      explain: { fr: `Deux passages de CI : sur la branche (pour fusionner en confiance), puis sur main (pour autoriser la publication).`, en: `Two CI passes: on the branch (to merge with confidence), then on main (to allow publishing).` },
    },
    {
      id: 'git-q23', skill: 'git.pages', lesson: 'git-6', level: 2, type: 'fill',
      prompt: { fr: `Le site 3D Reader est à <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>. Quelle valeur doit avoir <code>BASE_PATH</code> ?`, en: `The 3D Reader site is at <code>https://alexdevanssay-cmyk.github.io/3D-reader/</code>. What value must <code>BASE_PATH</code> have?` },
      accept: ['/3D-reader', '/3D-reader/', '/3d-reader', '/3d-reader/'],
      explain: { fr: `Le site vit dans le sous-dossier <code>/3D-reader</code> du domaine : c'est le préfixe que la construction doit connaître.`, en: `The site lives in the domain's <code>/3D-reader</code> subfolder: that is the prefix the build must know.` },
    },
    // ---------------------------------------------------------------- lesson 7
    {
      id: 'git-q24', skill: 'git.jargon', lesson: 'git-7', level: 1, type: 'match',
      prompt: { fr: `Associe chaque abréviation à son sens.`, en: `Match each abbreviation with its meaning.` },
      pairs: {
        fr: [[`LGTM`, `Ça me va, OK pour fusionner`], [`WIP`, `Travail en cours, pas prêt`], [`nit`, `Détail mineur, non bloquant`], [`PTAL`, `Peux-tu regarder ?`], [`TL;DR`, `Le résumé en une phrase`]],
        en: [[`LGTM`, `Fine by me, OK to merge`], [`WIP`, `Work in progress, not ready`], [`nit`, `Minor detail, not blocking`], [`PTAL`, `Can you take a look?`], [`TL;DR`, `The one-sentence summary`]],
      },
      explain: { fr: `Looks Good To Me, Work In Progress, nitpick, Please Take A Look, Too Long; Didn't Read.`, en: `Looks Good To Me, Work In Progress, nitpick, Please Take A Look, Too Long; Didn't Read.` },
    },
    {
      id: 'git-q25', skill: 'git.jargon', lesson: 'git-7', level: 2, type: 'mcq',
      prompt: { fr: `Dans la version <code>0.2.0</code> (semver), que signifie passer à <code>0.3.0</code> ?`, en: `In version <code>0.2.0</code> (semver), what does going to <code>0.3.0</code> mean?` },
      choices: {
        fr: [`Nouvelle fonction, compatible avec l'existant`, `Simple correctif`, `Changement incompatible`, `Retour en arrière`],
        en: [`New feature, compatible with what exists`, `Just a fix`, `Incompatible change`, `A step back`],
      },
      answer: 0,
      explain: { fr: `MAJEUR.MINEUR.CORRECTIF : le chiffre du milieu (mineur) monte pour une nouveauté compatible.`, en: `MAJOR.MINOR.PATCH: the middle number (minor) goes up for a compatible new feature.` },
    },
    {
      id: 'git-q26', skill: 'git.jargon', lesson: 'git-7', level: 2, type: 'multi',
      prompt: { fr: `Lesquels de ces dossiers sont dans le <code>.gitignore</code> de 3D Reader (donc jamais committés) ?`, en: `Which of these folders are in 3D Reader's <code>.gitignore</code> (so never committed)?` },
      choices: { fr: [`node_modules/`, `dist/`, `web/engine/`, `.venv/`, `tests/js/`], en: [`node_modules/`, `dist/`, `web/engine/`, `.venv/`, `tests/js/`] },
      answer: [0, 1, 3],
      explain: { fr: `On ignore ce qui se régénère : bibliothèques (<code>node_modules/</code>, <code>.venv/</code>) et site construit (<code>dist/</code>). Le code (<code>web/engine/</code>) et les tests sont versionnés.`, en: `We ignore what can be regenerated: libraries (<code>node_modules/</code>, <code>.venv/</code>) and the built site (<code>dist/</code>). The code (<code>web/engine/</code>) and tests are versioned.` },
    },
    {
      id: 'git-q27', skill: 'git.jargon', lesson: 'git-7', level: 3, type: 'tf',
      prompt: { fr: `Un test <em>flaky</em> peut être ignoré : il suffit de relancer la CI jusqu'à ce qu'elle passe.`, en: `A <em>flaky</em> test can be ignored: just re-run CI until it passes.` },
      answer: false,
      explain: { fr: `« Flaky n'est pas une cause racine » : un test instable révèle souvent un vrai problème (lenteur, ordre, dépendance à la machine). Il faut le comprendre.`, en: `"Flaky is not a root cause": an unstable test often reveals a real problem (slowness, ordering, dependence on the machine). It must be understood.` },
    },
    // ---------------------------------------------------------------- extra: basics
    {
      id: 'git-q28', skill: 'git.basics', extra: true, level: 1, type: 'mcq',
      prompt: { fr: `Quelle commande dit sur quelle branche tu es et quels fichiers sont modifiés ?`, en: `Which command tells you which branch you are on and which files are modified?` },
      choices: { fr: [`git status`, `git log`, `git push`, `git clone`], en: [`git status`, `git log`, `git push`, `git clone`] },
      answer: 0,
      explain: { fr: `<code>git status</code> est le tableau de bord. <code>git log</code> montre l'historique des commits.`, en: `<code>git status</code> is the dashboard. <code>git log</code> shows commit history.` },
    },
    {
      id: 'git-q29', skill: 'git.basics', extra: true, level: 2, type: 'line',
      prompt: { fr: `Clique sur la ligne qui a été <strong>supprimée</strong>.`, en: `Click the line that was <strong>removed</strong>.` },
      code: `@@ -40,6 +40,6 @@
 const MAX_BODY = 200 * 1024;
 const MAX_MESSAGES = 20;
-const RATE_LIMIT = 10;
+const RATE_LIMIT = 20;
 const TIMEOUT_MS = 50_000;`,
      lang: 'diff',
      answer: 3,
      explain: { fr: `La ligne en <code>-</code> (ancienne limite 10) est remplacée par la ligne en <code>+</code> (nouvelle limite 20).`, en: `The <code>-</code> line (old limit 10) is replaced by the <code>+</code> line (new limit 20).` },
    },
    {
      id: 'git-q30', skill: 'git.basics', extra: true, level: 2, type: 'tf',
      prompt: { fr: `Après <code>git commit</code>, ton collègue voit immédiatement ton commit sur GitHub.`, en: `After <code>git commit</code>, your colleague immediately sees your commit on GitHub.` },
      answer: false,
      explain: { fr: `Le commit reste local tant que tu ne fais pas <code>git push</code>.`, en: `The commit stays local until you run <code>git push</code>.` },
    },
    {
      id: 'git-q31', skill: 'git.basics', extra: true, level: 3, type: 'mcq',
      prompt: { fr: `Que signifie la ligne <code>Co-Authored-By: Claude …</code> à la fin d'un message de commit ?`, en: `What does the <code>Co-Authored-By: Claude …</code> line at the end of a commit message mean?` },
      choices: {
        fr: [`Le commit a été écrit avec Claude ; GitHub affiche les deux auteurs`, `Claude a fusionné le commit dans main`, `Le commit est signé cryptographiquement`, `Le commit ne doit pas être poussé`],
        en: [`The commit was written with Claude; GitHub shows both authors`, `Claude merged the commit into main`, `The commit is cryptographically signed`, `The commit must not be pushed`],
      },
      answer: 0,
      explain: { fr: `C'est une convention de GitHub (« trailer ») qui ajoute un co-auteur. Elle n'a rien à voir avec la fusion ni la signature.`, en: `It is a GitHub convention (a "trailer") adding a co-author. It has nothing to do with merging or signing.` },
    },
    // ---------------------------------------------------------------- extra: branches
    {
      id: 'git-q32', skill: 'git.branches', extra: true, level: 1, type: 'tf',
      prompt: { fr: `Une branche permet d'essayer une modification sans toucher à <code>main</code>.`, en: `A branch lets you try a change without touching <code>main</code>.` },
      answer: true,
      explain: { fr: `C'est la variante d'outillage : on essaie sur un double, main (la production) n'est pas dérangée.`, en: `It is the tooling variant: you try on a copy, main (production) is not disturbed.` },
    },
    {
      id: 'git-q33', skill: 'git.branches', extra: true, level: 2, type: 'order',
      prompt: { fr: `Remets dans l'ordre la résolution d'un conflit de fusion.`, en: `Put in order the resolution of a merge conflict.` },
      items: {
        fr: [`git merge essai-joint (Git signale un conflit)`, `Ouvrir le fichier et choisir la bonne version`, `Supprimer les trois lignes de marqueurs de conflit`, `git add du fichier résolu`, `git commit pour terminer la fusion`],
        en: [`git merge parting-trial (Git reports a conflict)`, `Open the file and choose the right version`, `Delete the three conflict marker lines`, `git add the resolved file`, `git commit to finish the merge`],
      },
      explain: { fr: `On choisit, on nettoie les marqueurs, puis on indexe et on committe comme d'habitude.`, en: `Choose, clean the markers, then stage and commit as usual.` },
    },
    {
      id: 'git-q34', skill: 'git.branches', extra: true, level: 3, type: 'mcq',
      prompt: { fr: `Quelle est la différence entre <code>git merge --no-ff</code> et une avance rapide (fast-forward) ?`, en: `What is the difference between <code>git merge --no-ff</code> and a fast-forward?` },
      choices: {
        fr: [`--no-ff crée toujours un commit de fusion, qui garde la trace du lot`, `--no-ff efface les commits de la branche`, `--no-ff envoie le résultat sur GitHub`, `Il n'y a aucune différence`],
        en: [`--no-ff always creates a merge commit, which keeps the trace of the batch`, `--no-ff erases the branch's commits`, `--no-ff sends the result to GitHub`, `There is no difference`],
      },
      answer: 0,
      explain: { fr: `En avance rapide, l'étiquette main avance simplement. Avec <code>--no-ff</code>, un commit de fusion à deux parents montre « ce lot est arrivé ensemble ».`, en: `With a fast-forward, the main label just moves forward. With <code>--no-ff</code>, a two-parent merge commit shows "this batch arrived together".` },
    },
    {
      id: 'git-q35', skill: 'git.branches', extra: true, level: 2, type: 'match',
      prompt: { fr: `Associe chaque opération à sa description.`, en: `Match each operation with its description.` },
      pairs: {
        fr: [[`merge`, `Réunir deux branches, sans réécrire l'historique`], [`rebase`, `Rejouer ses commits par-dessus main (nouveaux SHA)`], [`cherry-pick`, `Copier un seul commit vers une autre branche`], [`worktree`, `Un dossier de travail de plus sur le même dépôt`]],
        en: [[`merge`, `Join two branches, without rewriting history`], [`rebase`, `Replay your commits on top of main (new SHAs)`], [`cherry-pick`, `Copy a single commit to another branch`], [`worktree`, `One more working folder on the same repository`]],
      },
      explain: { fr: `Le rebase change les SHA : à éviter sur une branche partagée. Le merge est sûr.`, en: `Rebase changes SHAs: avoid it on a shared branch. Merge is safe.` },
    },
    // ---------------------------------------------------------------- extra: remote
    {
      id: 'git-q36', skill: 'git.remote', extra: true, level: 1, type: 'mcq',
      prompt: { fr: `Quelle commande met à jour <em>tes fichiers</em> avec les nouveaux commits de GitHub ?`, en: `Which command updates <em>your files</em> with GitHub's new commits?` },
      choices: { fr: [`git pull`, `git fetch`, `git push`, `git status`], en: [`git pull`, `git fetch`, `git push`, `git status`] },
      answer: 0,
      explain: { fr: `<code>fetch</code> télécharge seulement ; <code>pull</code> télécharge et fusionne dans ta branche, donc tes fichiers changent.`, en: `<code>fetch</code> only downloads; <code>pull</code> downloads and merges into your branch, so your files change.` },
    },
    {
      id: 'git-q37', skill: 'git.remote', extra: true, level: 2, type: 'fill',
      prompt: { fr: `Complète pour envoyer la branche la première fois <strong>et</strong> mémoriser le lien avec la branche distante.`, en: `Complete to push the branch the first time <strong>and</strong> remember the link with the remote branch.` },
      code: `git push ____ origin claude/3d-reader-uxw782`,
      lang: 'bash',
      accept: ['-u', '--set-upstream'],
      explain: { fr: `<code>-u</code> (<em>set upstream</em>) : ensuite, <code>git push</code> et <code>git pull</code> tout courts suffisent.`, en: `<code>-u</code> (set upstream): afterwards, plain <code>git push</code> and <code>git pull</code> are enough.` },
    },
    {
      id: 'git-q38', skill: 'git.remote', extra: true, level: 3, type: 'mcq',
      prompt: { fr: `Pourquoi Claude Code pousse-t-il ses commits à la fin de chaque lot dans une session cloud ?`, en: `Why does Claude Code push its commits at the end of every batch in a cloud session?` },
      choices: {
        fr: [`Le conteneur est temporaire : les commits non poussés seraient perdus s'il est supprimé`, `Parce que git commit ne marche pas hors ligne`, `Pour fusionner automatiquement dans main`, `Pour effacer l'historique local`],
        en: [`The container is temporary: unpushed commits would be lost if it is deleted`, `Because git commit does not work offline`, `To merge automatically into main`, `To erase local history`],
      },
      answer: 0,
      explain: { fr: `Un commit local n'existe que sur la machine. Dans un conteneur jetable, seul le push le met à l'abri sur GitHub.`, en: `A local commit only exists on the machine. In a disposable container, only a push puts it safely on GitHub.` },
    },
    // ---------------------------------------------------------------- extra: github
    {
      id: 'git-q39', skill: 'git.github', extra: true, level: 1, type: 'match',
      prompt: { fr: `Associe chaque onglet d'un dépôt GitHub à son usage.`, en: `Match each GitHub repository tab with its use.` },
      pairs: {
        fr: [[`Code`, `Les fichiers et le README`], [`Issues`, `Les tickets : bugs, idées`], [`Pull requests`, `Les demandes de fusion`], [`Actions`, `Les automatismes et leurs logs`], [`Settings`, `Réglages, Pages, secrets`]],
        en: [[`Code`, `Files and the README`], [`Issues`, `Tickets: bugs, ideas`], [`Pull requests`, `Merge requests`], [`Actions`, `Automations and their logs`], [`Settings`, `Settings, Pages, secrets`]],
      },
      explain: { fr: `Cinq onglets suffisent pour s'y retrouver dans presque tous les dépôts.`, en: `Five tabs are enough to find your way in almost every repository.` },
    },
    {
      id: 'git-q40', skill: 'git.github', extra: true, level: 2, type: 'mcq',
      prompt: { fr: `Qu'écrire dans la description d'une PR pour fermer automatiquement l'issue 12 à la fusion ?`, en: `What do you write in a PR description to automatically close issue 12 on merge?` },
      choices: { fr: [`Fixes #12`, `@12`, `close 12 now`, `issue=12`], en: [`Fixes #12`, `@12`, `close 12 now`, `issue=12`] },
      answer: 0,
      explain: { fr: `Les mots-clés <code>Fixes</code>, <code>Closes</code>, <code>Resolves</code> suivis de <code>#numéro</code> ferment l'issue quand la PR est fusionnée.`, en: `The keywords <code>Fixes</code>, <code>Closes</code>, <code>Resolves</code> followed by <code>#number</code> close the issue when the PR is merged.` },
    },
    {
      id: 'git-q41', skill: 'git.github', extra: true, level: 2, type: 'multi',
      prompt: { fr: `Avant de fusionner une PR de Claude Code, que vérifies-tu ?`, en: `Before merging a Claude Code PR, what do you check?` },
      choices: {
        fr: [`Que les coches de la CI sont vertes`, `Le titre et la description`, `Le diff des fichiers qui te concernent`, `Que la PR a plus de 100 commits`, `Que le dépôt a une étoile`],
        en: [`That the CI ticks are green`, `The title and description`, `The diff of the files that concern you`, `That the PR has more than 100 commits`, `That the repository has a star`],
      },
      answer: [0, 1, 2],
      explain: { fr: `Ce qui doit changer (description), si c'est testé (CI verte), et comment c'est fait (diff). Le nombre de commits ou d'étoiles ne dit rien de la qualité.`, en: `What should change (description), whether it is tested (green CI), and how it is done (diff). The number of commits or stars says nothing about quality.` },
    },
    {
      id: 'git-q42', skill: 'git.github', extra: true, level: 3, type: 'tf',
      prompt: { fr: `Un <em>fork</em> et une <em>branche</em>, c'est la même chose.`, en: `A <em>fork</em> and a <em>branch</em> are the same thing.` },
      answer: false,
      explain: { fr: `Une branche vit <em>dans</em> le dépôt. Un fork est une <em>copie entière</em> du dépôt dans un autre compte, utile quand on n'a pas le droit d'écrire dans l'original.`, en: `A branch lives <em>inside</em> the repository. A fork is a <em>whole copy</em> of the repository in another account, useful when you cannot write to the original.` },
    },
    // ---------------------------------------------------------------- extra: actions
    {
      id: 'git-q43', skill: 'git.actions', extra: true, level: 1, type: 'tf',
      prompt: { fr: `Les workflows GitHub Actions sont décrits dans des fichiers <code>.github/workflows/*.yml</code>.`, en: `GitHub Actions workflows are described in <code>.github/workflows/*.yml</code> files.` },
      answer: true,
      explain: { fr: `Par exemple <code>ci.yml</code> (tests) et <code>pages.yml</code> (publication) dans 3D Reader.`, en: `For example <code>ci.yml</code> (tests) and <code>pages.yml</code> (publishing) in 3D Reader.` },
    },
    {
      id: 'git-q44', skill: 'git.actions', extra: true, level: 2, type: 'mcq',
      prompt: { fr: `Où mettre une clé d'API dont un workflow a besoin ?`, en: `Where do you put an API key a workflow needs?` },
      choices: {
        fr: [`Dans les secrets du dépôt (Settings → Secrets)`, `Directement dans ci.yml`, `Dans le README`, `Dans un commentaire de PR`],
        en: [`In the repository's secrets (Settings → Secrets)`, `Directly in ci.yml`, `In the README`, `In a PR comment`],
      },
      answer: 0,
      explain: { fr: `Tout ce qui est dans le dépôt est lisible et reste dans l'historique. Les secrets sont cachés, y compris dans les logs.`, en: `Everything in the repository is readable and stays in history. Secrets are hidden, including in logs.` },
    },
    {
      id: 'git-q45', skill: 'git.actions', extra: true, level: 3, type: 'mcq',
      prompt: { fr: `Dans <code>ci.yml</code>, à quoi sert <code>cancel-in-progress</code> sur les branches autres que main ?`, en: `In <code>ci.yml</code>, what is <code>cancel-in-progress</code> for on branches other than main?` },
      code: `concurrency:
  group: ci-\${{ github.ref == 'refs/heads/main' && github.run_id || github.ref }}
  cancel-in-progress: \${{ github.ref != 'refs/heads/main' }}`,
      lang: 'yaml',
      choices: {
        fr: [`Un nouveau push annule la CI précédente devenue inutile`, `La CI ne tourne jamais sur les branches`, `Les tests échoués sont ignorés`, `Le site est publié depuis la branche`],
        en: [`A new push cancels the previous, now useless, CI run`, `CI never runs on branches`, `Failed tests are ignored`, `The site is published from the branch`],
      },
      answer: 0,
      explain: { fr: `Sur une branche, seul le dernier commit compte : on annule l'ancien test. Sur main, chaque commit va au bout car le déploiement en dépend.`, en: `On a branch only the latest commit matters: the old run is cancelled. On main, every commit runs to the end because deployment depends on it.` },
    },
    // ---------------------------------------------------------------- extra: pages
    {
      id: 'git-q46', skill: 'git.pages', extra: true, level: 1, type: 'mcq',
      prompt: { fr: `Quelle est la forme de l'adresse d'un site GitHub Pages de dépôt ?`, en: `What is the shape of the address of a repository's GitHub Pages site?` },
      choices: {
        fr: [`https://propriétaire.github.io/dépôt/`, `https://github.com/dépôt/pages`, `https://dépôt.vercel.app`, `http://localhost:8000`],
        en: [`https://owner.github.io/repository/`, `https://github.com/repository/pages`, `https://repository.vercel.app`, `http://localhost:8000`],
      },
      answer: 0,
      explain: { fr: `Pour 3D Reader : <code>alexdevanssay-cmyk.github.io/3D-reader/</code>. <code>vercel.app</code> est l'hébergeur de la passerelle IA, <code>localhost</code> ton propre ordinateur.`, en: `For 3D Reader: <code>alexdevanssay-cmyk.github.io/3D-reader/</code>. <code>vercel.app</code> hosts the AI gateway, <code>localhost</code> is your own computer.` },
    },
    {
      id: 'git-q47', skill: 'git.pages', extra: true, level: 2, type: 'tf',
      prompt: { fr: `Si la CI de main est rouge, <code>pages.yml</code> publie quand même la nouvelle version du site.`, en: `If main's CI is red, <code>pages.yml</code> still publishes the new version of the site.` },
      answer: false,
      explain: { fr: `Le job <code>select</code> vérifie <code>conclusion == 'success'</code> : un commit qui casse les tests n'est jamais publié (sauf lancement manuel).`, en: `The <code>select</code> job checks <code>conclusion == 'success'</code>: a commit that breaks the tests is never published (except a manual run).` },
    },
    {
      id: 'git-q48', skill: 'git.pages', extra: true, level: 3, type: 'match',
      prompt: { fr: `Associe chaque élément de publication à son rôle.`, en: `Match each publishing element with its role.` },
      pairs: {
        fr: [[`.nojekyll`, `Empêcher Pages de passer le site dans Jekyll`], [`404.html`, `Page renvoyée pour une adresse inconnue`], [`BASE_PATH`, `Préfixe du site (/3D-reader)`], [`tag v0.2.0`, `Étiquette fixe sur une version`]],
        en: [[`.nojekyll`, `Stop Pages from running the site through Jekyll`], [`404.html`, `Page returned for an unknown address`], [`BASE_PATH`, `Site prefix (/3D-reader)`], [`tag v0.2.0`, `Fixed label on a version`]],
      },
      explain: { fr: `Ces détails font qu'un site statique fonctionne correctement dans un sous-dossier de github.io.`, en: `These details make a static site work properly in a github.io subfolder.` },
    },
    // ---------------------------------------------------------------- extra: jargon
    {
      id: 'git-q49', skill: 'git.jargon', extra: true, level: 1, type: 'mcq',
      prompt: { fr: `Un relecteur écrit « <em>nit: missing space</em> ». C'est…`, en: `A reviewer writes "<em>nit: missing space</em>". It is…` },
      choices: { fr: [`Un détail mineur, non bloquant`, `Un bug grave`, `Un refus de la PR`, `Une demande de fusion immédiate`], en: [`A minor, non-blocking detail`, `A serious bug`, `A rejection of the PR`, `A request to merge immediately`] },
      answer: 0,
      explain: { fr: `<em>nit</em> (de <em>nitpick</em>) = pinaillage. On corrige si c'est facile, sinon on peut fusionner quand même.`, en: `<em>nit</em> (from nitpick) = nitpicking. Fix it if easy, otherwise you can still merge.` },
    },
    {
      id: 'git-q50', skill: 'git.jargon', extra: true, level: 2, type: 'match',
      prompt: { fr: `Associe chaque terme à son sens.`, en: `Match each term with its meaning.` },
      pairs: {
        fr: [[`revert`, `Commit qui annule un commit précédent`], [`hotfix`, `Correctif urgent`], [`bump`, `Monter un numéro de version`], [`refactor`, `Réorganiser sans changer le comportement`]],
        en: [[`revert`, `Commit that undoes an earlier commit`], [`hotfix`, `Urgent fix`], [`bump`, `Raise a version number`], [`refactor`, `Reorganise without changing behaviour`]],
      },
      explain: { fr: `Un revert n'efface rien : il ajoute un commit inverse, l'historique reste complet.`, en: `A revert erases nothing: it adds an inverse commit, history stays complete.` },
    },
    {
      id: 'git-q51', skill: 'git.jargon', extra: true, level: 3, type: 'tf',
      prompt: { fr: `Ajouter un fichier confidentiel au <code>.gitignore</code> après l'avoir committé le retire de l'historique.`, en: `Adding a confidential file to <code>.gitignore</code> after committing it removes it from history.` },
      answer: false,
      explain: { fr: `.gitignore n'agit que sur les fichiers pas encore suivis. Le fichier reste lisible dans les anciens commits : il faut donc ne jamais le committer.`, en: `.gitignore only affects files not yet tracked. The file stays readable in old commits: so it must never be committed.` },
    },
    // ---------------------------------------------------------------- exam
    {
      id: 'git-q52', skill: 'git.basics', level: 2, type: 'mcq',
      prompt: { fr: `Que contient le sous-dossier caché <code>.git/</code> d'un dépôt ?`, en: `What does a repository's hidden <code>.git/</code> subfolder contain?` },
      choices: {
        fr: [`Tout l'historique : commits, branches, configuration`, `Le site construit`, `Les bibliothèques npm`, `Les mots de passe GitHub`],
        en: [`The whole history: commits, branches, configuration`, `The built site`, `The npm libraries`, `GitHub passwords`],
      },
      answer: 0,
      explain: { fr: `Supprimer <code>.git/</code> transforme le dépôt en simple dossier sans mémoire.`, en: `Deleting <code>.git/</code> turns the repository into a plain folder with no memory.` },
    },
    {
      id: 'git-q53', skill: 'git.branches', level: 2, type: 'tf',
      prompt: { fr: `Git choisit tout seul quelle version garder quand deux branches ont modifié la même ligne.`, en: `Git chooses by itself which version to keep when two branches changed the same line.` },
      answer: false,
      explain: { fr: `C'est justement un conflit : Git s'arrête, écrit les deux versions avec des marqueurs et te laisse décider.`, en: `That is precisely a conflict: Git stops, writes both versions with markers and lets you decide.` },
    },
    {
      id: 'git-q54', skill: 'git.remote', level: 2, type: 'order',
      prompt: { fr: `Remets dans l'ordre : récupérer un projet, y faire une modification et la publier sur une branche.`, en: `Put in order: get a project, make a change and publish it on a branch.` },
      items: {
        fr: [`git clone https://github.com/…`, `git switch -c ma-branche`, `git add .`, `git commit -m "…"`, `git push -u origin ma-branche`],
        en: [`git clone https://github.com/…`, `git switch -c my-branch`, `git add .`, `git commit -m "…"`, `git push -u origin my-branch`],
      },
      explain: { fr: `Copier, créer sa branche, indexer, enregistrer, envoyer.`, en: `Copy, create your branch, stage, record, send.` },
    },
    {
      id: 'git-q55', skill: 'git.github', level: 2, type: 'mcq',
      prompt: { fr: `Que signifie une PR marquée <strong>Draft</strong> ?`, en: `What does a PR marked <strong>Draft</strong> mean?` },
      choices: { fr: [`Pas encore prête, à ne pas fusionner`, `Déjà fusionnée`, `Refusée`, `Créée par un robot`], en: [`Not ready yet, do not merge`, `Already merged`, `Rejected`, `Created by a bot`] },
      answer: 0,
      explain: { fr: `Draft = brouillon. L'auteur la passe en « Ready for review » quand elle est prête.`, en: `Draft = work in progress. The author switches it to "Ready for review" when it is ready.` },
    },
    {
      id: 'git-q56', skill: 'git.actions', level: 2, type: 'line',
      prompt: { fr: `Clique sur la ligne qui exécute les <strong>tests unitaires du moteur navigateur</strong>.`, en: `Click the line that runs the <strong>browser engine unit tests</strong>.` },
      code: `    steps:
      - uses: actions/checkout@v7
      - name: Python engine tests
        run: pytest
      - name: Install Node dependencies
        run: npm ci
      - name: Browser engine tests
        run: npm test
      - name: Build the static site
        run: npm run build`,
      lang: 'yaml',
      answer: 7,
      explain: { fr: `<code>npm test</code> lance <code>node --test tests/js/*.test.mjs</code> (défini dans package.json). <code>npm ci</code> ne fait qu'installer.`, en: `<code>npm test</code> runs <code>node --test tests/js/*.test.mjs</code> (defined in package.json). <code>npm ci</code> only installs.` },
    },
    {
      id: 'git-q57', skill: 'git.actions', level: 3, type: 'multi',
      prompt: { fr: `Lesquelles de ces actions sont des <strong>mauvaises</strong> réponses à une CI rouge ?`, en: `Which of these are <strong>bad</strong> responses to a red CI?` },
      choices: {
        fr: [`Désactiver le test qui échoue`, `Relancer en boucle sans lire les logs`, `Lire les logs et demander une correction`, `Fusionner quand même`],
        en: [`Disable the failing test`, `Re-run in a loop without reading logs`, `Read the logs and ask for a fix`, `Merge anyway`],
      },
      answer: [0, 1, 3],
      explain: { fr: `Seule la lecture des logs suivie d'une correction règle le problème. Les autres le cachent ou le font entrer dans main.`, en: `Only reading the logs then fixing solves the problem. The others hide it or let it into main.` },
    },
    {
      id: 'git-q58', skill: 'git.pages', level: 2, type: 'fill',
      prompt: { fr: `Dans quel dossier <code>npm run build</code> produit-il le site que <code>pages.yml</code> publie ?`, en: `In which folder does <code>npm run build</code> produce the site that <code>pages.yml</code> publishes?` },
      accept: ['dist', 'dist/', './dist', './dist/'],
      explain: { fr: `<code>dist/</code> (pour <em>distribution</em>) : il est dans le .gitignore car il se reconstruit à chaque fois.`, en: `<code>dist/</code> (for distribution): it is in .gitignore because it is rebuilt every time.` },
    },
    {
      id: 'git-q59', skill: 'git.jargon', level: 2, type: 'mcq',
      prompt: { fr: `« <em>LGTM, merging.</em> » signifie :`, en: `"<em>LGTM, merging.</em>" means:` },
      choices: { fr: [`Ça me va, je fusionne`, `Il manque des tests`, `Travail en cours`, `Je refuse la PR`], en: [`Fine by me, merging`, `Tests are missing`, `Work in progress`, `I reject the PR`] },
      answer: 0,
      explain: { fr: `<em>Looks Good To Me</em> : accord.`, en: `<em>Looks Good To Me</em>: agreement.` },
    },
    {
      id: 'git-q60', skill: 'git.basics', level: 3, type: 'mcq',
      prompt: { fr: `Dans l'en-tête <code>@@ -18,7 +18,7 @@</code> d'un diff, que signifie <code>-18,7</code> ?`, en: `In a diff header <code>@@ -18,7 +18,7 @@</code>, what does <code>-18,7</code> mean?` },
      choices: {
        fr: [`Dans l'ancienne version, le bloc commence ligne 18 et fait 7 lignes`, `18 lignes ont été supprimées`, `Le fichier a 7 erreurs`, `C'est le SHA du commit`],
        en: [`In the old version, the block starts at line 18 and is 7 lines long`, `18 lines were removed`, `The file has 7 errors`, `It is the commit's SHA`],
      },
      answer: 0,
      explain: { fr: `<code>-</code> = ancienne version, <code>+</code> = nouvelle : position de départ, puis nombre de lignes du bloc.`, en: `<code>-</code> = old version, <code>+</code> = new: start position, then number of lines in the block.` },
    },
  ],
};
