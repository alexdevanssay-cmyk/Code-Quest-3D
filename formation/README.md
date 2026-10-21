# Code Quest 3D — formation à 3D Reader

🌐 **Site en ligne : https://alexdevanssay-cmyk.github.io/Code-Quest-3D/**

Formation ludique, bilingue (français / anglais), pour comprendre de A à Z l'application
[3D Reader](https://github.com/alexdevanssay-cmyk/3D-reader) quand on débute en code.

## Contenu

| # | Module | Ce qu'on y apprend |
|---|--------|--------------------|
| 1 | 🧭 Bienvenue : la carte de 3D Reader | programme, appli web, qui fait quoi dans 3D Reader, méthode pour lire du code |
| 2 | 🧱 Les bases Python / JS / C++ | types, conditions, boucles, fonctions, collections, erreurs, côte à côte |
| 3 | 🟨 Lire du JavaScript moderne | fonctions fléchées, objets, Map, déstructuration, modules, classes, async/await, tableaux typés |
| 3½ | 🗂️ Les fichiers JSON | à quoi sert JSON, sa grammaire, lire package.json et ses cousins, JSON.parse / stringify, JSON Schema, pièges |
| 4 | 🌐 Le navigateur | HTML/CSS/DOM, stockage, Web Workers, WebAssembly, three.js, outils F12 |
| 5 | ⚙️ C++, OpenCascade, WebAssembly | syntaxe, pointeurs, classes, mémoire, compilation, Emscripten, B-rep |
| 6 | 🐍 Python côté serveur | paquets, FastAPI, venv/pip, pytest, processus isolé |
| 7 | 📡 Dialogue appareil ↔ serveur | HTTP, JSON, fetch, hébergement statique/serverless, sécurité, IA (Groq, Ollama) |
| 8 | 🖥️ Environnements et terminaux | cmd, PowerShell, bash, PATH, Node/npm, Python, VS Code, conteneurs |
| 9 | 🌿 Git et GitHub sans jargon | commit, branche, push, pull request, review, Actions, Pages, jargon |
| 10 | 🧪 Tests et Claude Code | tests unitaires et e2e, CI, relecture, bien travailler avec Claude Code |

68 leçons (chacune avec une version « approfondie et vulgarisée »), 583 questions de 7 types,
un glossaire de 272 mots, des bacs à sable JavaScript, des terminaux simulés et un labo JSON avec missions, et des
diagrammes animés du dialogue entre la page, le worker et les serveurs.

## Comment l'appli s'adapte

- Chaque question teste une compétence ; chaque réponse met à jour sa **maîtrise** (moyenne
  glissante : les réponses récentes comptent plus).
- Sous 80 %, la compétence part dans **Points faibles** : la leçon s'affiche dans sa version
  approfondie, et des **exercices de renforcement** réservés à ce mode sont proposés (les questions
  ratées d'abord, puis les nouvelles, de la plus simple à la plus difficile).
- **Répétition espacée** (boîtes de Leitner) : une bonne réponse revient après 1, 3, 7, 16 puis
  35 jours ; une erreur la fait revenir tout de suite.
- Examen de fin de module (80 % pour valider) et examen final ; XP, niveaux, série de jours, badges.

La progression est enregistrée dans le navigateur (`localStorage`) ; la page *Progression* permet
de l'exporter / importer en fichier JSON (sauvegarde ou changement d'ordinateur).

## Lancer en local

Aucune installation ni compilation : ce sont des fichiers statiques (modules ES).

```bash
cd formation
python -m http.server 8000      # ou : npx http-server -p 8000
# puis ouvrir http://localhost:8000
```

(Ouvrir `index.html` directement en double-cliquant ne marche pas : les navigateurs bloquent
les modules JavaScript chargés depuis `file://`.)

## Publication sur GitHub Pages

Deux réglages possibles (*Settings → Pages → Source*) :

- **Deploy from a branch** (`main`, `/ (root)`) : GitHub publie la racine du dépôt ; `index.html` à la
  racine renvoie vers `formation/`. Rien d'autre à faire.
- **GitHub Actions** : `.github/workflows/formation.yml` vérifie le contenu, lance les tests, puis ne
  publie que le dossier `formation/` à chaque push sur `main` (ou *Actions → Formation → Run workflow*).

## Modifier ou ajouter du contenu

- Le format des modules est décrit dans [`CONTENT_SPEC.md`](CONTENT_SPEC.md).
- `node formation/tools/validate.mjs` vérifie tous les modules (bilingue complet, réponses valides,
  HTML équilibré, termes du glossaire, absence de données confidentielles).
- `node --test formation/tests/*.test.mjs` teste le moteur (correction de chaque question,
  maîtrise, répétition espacée, missions des terminaux).

## Organisation du code

```
formation/
  index.html, style.css     la page
  js/app.js                 routeur et écrans
  js/adaptive.js            moteur adaptatif : maîtrise, points faibles, révisions, examens, badges
  js/store.js               sauvegarde de la progression (localStorage, export/import)
  js/quiz.js                affichage et correction des 7 types de questions
  js/render.js              rendu des leçons et coloration du code
  js/ui.js                  textes de l'interface (fr / en)
  js/widgets/               bac à sable JS, terminal simulé, diagramme de dialogue
  content/                  les 10 modules et le glossaire
  tools/, tests/            validation du contenu et tests
```

Confidentialité : la formation ne cite que le code public de 3D Reader. Aucune donnée de chiffrage,
de client, de clé ou de dossier réseau n'y figure (le validateur le vérifie).
