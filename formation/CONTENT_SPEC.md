# Format des modules de contenu (Code Quest — formation 3D Reader)

Chaque module est un fichier ES module `formation/content/<id>.js` qui exporte par défaut un objet.
Tout texte visible est bilingue : `{ fr: '…', en: '…' }` (les deux obligatoires).
Vérifier un module : `node formation/tools/validate.mjs` (doit finir sans erreur).

```js
export default {
  id: 'js',                       // identifiant court, unique, [a-z0-9]+
  order: 3,                       // position dans le parcours
  icon: '🟨',                     // un emoji
  color: '#e0b400',               // couleur d'accent du module
  title:   { fr: 'Lire du JavaScript', en: 'Reading JavaScript' },
  summary: { fr: 'Une phrase.', en: 'One sentence.' },
  skills: {                       // compétences évaluées (clé "<module>.<nom>")
    'js.variables': { fr: 'Variables et constantes', en: 'Variables and constants' },
  },
  widgets: { /* voir « Widgets » */ },
  lessons: [
    {
      id: 'js-1',                 // "<module>-<n>", unique
      title: { fr, en },
      skills: ['js.variables'],   // compétences couvertes (au moins une)
      minutes: 8,
      body: { fr: `…`, en: `…` }, // leçon normale (HTML léger + blocs de code ~~~)
      deep: { fr: `…`, en: `…` }, // leçon « approfondie et vulgarisée » : montrée quand l'élève
                                  // échoue sur ces compétences ou clique « Explique-moi autrement ».
                                  // Autre angle : analogie de la vie courante, pas à pas, schéma
                                  // ASCII, erreurs classiques, mini-exemple commenté ligne à ligne.
    },
  ],
  questions: [ /* voir « Questions » */ ],
};
```

## Corps des leçons (body / deep)

Chaîne HTML écrite dans un gabarit JS (backticks). **Dans un gabarit, échapper `` ` `` en `` \` `` et `${` en `\${`.**

Balises autorisées : `h3, h4, p, ul, ol, li, strong, em, code, br, table, thead, tbody, tr, th, td, kbd, a, div, span, details, summary`.
Dans le texte HTML (hors blocs ~~~), écrire `&lt;` `&gt;` `&amp;` pour `<` `>` `&`.

Composants (classes CSS) :
- `<div class="callout tip">…</div>` astuce ; `warn` piège ; `analogy` analogie de la vie courante ;
  `project` « Dans 3D Reader » (lien avec le vrai code de l'appli) ; `info` à savoir.
- `<div class="compare">` + plusieurs blocs ~~~ avec `title=` → colonnes côte à côte (Python / JS / C++).
- `<span class="term" data-term="commit">commit</span>` → infobulle du glossaire (id du glossaire, en minuscules).
- `<div data-widget="ID"></div>` → widget interactif déclaré dans `widgets` du module.
- `<details><summary>Pour aller plus loin</summary>…</details>`.

### Blocs de code

Clôturés par `~~~` (PAS par ```), code brut (pas d'échappement HTML ; seulement `` \` `` et `\${`) :

```
~~~js title="web/engine/client.js"
const pending = new Map(); //«1»
~~~
```
- Langages : `js, py, cpp, bash, ps (PowerShell), cmd, json, yaml, html, css, text, diff`.
- `title="…"` (facultatif) : légende (souvent le chemin du fichier).
- `run` (js uniquement) : bac à sable éditable avec bouton « Exécuter » ; `console.log` s'affiche.
  Le code doit tourner seul dans un navigateur (pas d'import, pas de DOM, pas de réseau).
- `«1»`, `«2»`… dans le code → pastilles numérotées ; les expliquer juste après dans `<ol class="notes">`.

## Questions

Champs communs :
```js
{
  id: 'js-q1',              // unique global, "<module>-q<n>"
  skill: 'js.variables',    // UNE compétence du module
  lesson: 'js-1',           // leçon dont c'est le quiz de fin (facultatif). Sans `lesson` ni `extra`,
                            //   la question sert seulement aux examens et révisions.
  extra: true,              // facultatif : exercice de renforcement, réservé au mode « points faibles »
  level: 1,                 // 1 facile, 2 moyen, 3 difficile
  type: 'mcq',
  prompt: { fr, en },       // HTML inline autorisé
  code: '…',                // facultatif, code brut affiché au-dessus
  lang: 'js',               // langage de `code`
  explain: { fr, en },      // explication montrée après la réponse (toujours, juste ou faux)
  hint: { fr, en },         // facultatif : indice
}
```
Types :
- `mcq` : `choices: { fr: [...], en: [...] }`, `answer: 0` (index).
- `multi` : idem, `answer: [0, 2]` (plusieurs bonnes réponses).
- `tf` : vrai/faux, `answer: true|false`.
- `fill` : réponse tapée, `accept: ['const', 'let']` (comparaison sans casse ni espaces de bord ;
  bilingue possible : `accept: { fr: [...], en: [...] }`). Utiliser `____` dans `code` pour le trou.
- `order` : remettre dans l'ordre ; `items: { fr: [...], en: [...] }` donnés DANS LE BON ORDRE (mélangés à l'affichage).
- `match` : associer ; `pairs: { fr: [[gauche, droite], ...], en: [...] }` (3 à 6 paires).
- `line` : cliquer la ligne du `code` qui… ; `answer: 3` (index de ligne, base 0).

Volumes attendus par module : chaque leçon a ≥ 3 questions `lesson`, chaque compétence a ≥ 3 questions
`extra` (de niveau varié), et ≥ 8 questions d'examen (sans lesson ni extra). Varier les types
(au moins 5 types différents par module). Les explications enseignent : dire POURQUOI.

## Widgets (déclarés dans `widgets`, placés avec `<div data-widget="ID">`)

Terminal simulé :
```js
'env-term-ps': {
  type: 'terminal',
  shell: 'powershell',              // 'powershell' | 'cmd' | 'bash'
  cwd: 'repo',                      // dossier de départ : 'repo' (racine du dépôt, défaut) ou 'home'
  intro: { fr, en },                // consigne générale
  missions: [                       // à réussir dans l'ordre
    { match: '^(get-childitem|ls|dir)\\b', fr: 'Liste le contenu du dossier.', en: 'List the folder.' },
  ],
}
```
`match` : expression régulière (chaîne, insensible à la casse) testée sur la commande tapée.
Le simulateur connaît un faux dépôt `3D-reader` (README.md, package.json, web/, web/engine/, tests/, api/ai.js, reader3d/)
et les commandes : cmd (`dir cd type echo cls mkdir where set ver help`), PowerShell (`Get-ChildItem/ls/dir
Set-Location/cd Get-Location/pwd Get-Content/cat Write-Output/echo New-Item mkdir Clear-Host Get-Command
Get-Help $env:NOM`), bash (`ls cd pwd cat echo mkdir which env export clear`), et partout : `git status/log/branch/
switch/checkout/add/commit/push/pull/diff/clone`, `node -v`, `node fichier.js`, `npm -v`, `npm install`, `npm ci`, `npm test`,
`npm run build`, `npm run serve`, `npx playwright test`, `python --version`, `pip install`, `pytest`, `code .`, `help`.

Diagramme de dialogue animé (séquence de messages) :
```js
'net-flow-ai': {
  type: 'flow',
  actors: [{ fr: 'Page', en: 'Page' }, { fr: 'Passerelle Vercel', en: 'Vercel gateway' }, { fr: 'Groq', en: 'Groq' }],
  steps: [
    { from: 0, to: 1, label: { fr: 'POST /api/ai', en: 'POST /api/ai' }, detail: { fr: 'HTML…', en: '…' } },
  ],
}
```

Labo JSON (éditeur de JSON avec vérification en direct, message d'erreur avec ligne/colonne, vue en arbre) :
```js
'json-lab-fix': {
  type: 'jsonlab',
  intro: { fr, en },                 // consigne générale (facultatif)
  initial: '{\n  "name": "piece"\n}', // texte de départ (peut être volontairement invalide)
  solution: '{ … }',                 // facultatif : une solution valide (le validateur vérifie qu'elle remplit les missions)
  missions: [                        // toutes vérifiées en direct ; le JSON doit d'abord être valide
    { fr: 'Rends le JSON valide.', en: 'Make the JSON valid.' },               // aucune condition = JSON valide
    { path: 'bodies.0.volume', type: 'number', fr: '…', en: '…' },            // chemin pointé, index de tableau en nombre
    { path: 'closed', equals: true, fr: '…', en: '…' },
    { path: 'bodies', type: 'array', minLength: 2, fr: '…', en: '…' },         // aussi `length`, `exists: false`
  ],
}
```
Types possibles : `object, array, string, number, boolean, null`.

## Confidentialité

Le code de 3D Reader est public (github.com/alexdevanssay-cmyk/3D-reader) : on peut en citer des extraits courts.
JAMAIS de données de chiffrage réelles (prix, taux, temps de cycle, coefficients calés, noms de clients, historique),
ni de clés, codes d'accès, adresses de dossiers réseau. Exemples chiffrés = valeurs fictives.
