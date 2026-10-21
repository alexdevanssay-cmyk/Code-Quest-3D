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
de l'exporter / importer en fichier JSON. Avec un **compte** (voir « Sauvegarde en ligne »), elle est
aussi sauvegardée en ligne et suit l'utilisateur d'un appareil à l'autre.

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

## Sauvegarde en ligne (comptes)

Sans réglage, la progression reste dans le navigateur (page *Progression* : export / import en
fichier). Pour que chacun puisse **créer un compte** et retrouver sa progression sur n'importe quel
appareil, la formation utilise **Firebase** (Google), dont l'offre gratuite suffit largement :
Authentication pour les comptes (e-mail + mot de passe, ou Google) et Cloud Firestore pour
enregistrer la progression (un document par compte, lisible par son seul propriétaire).

Mise en route (une seule fois, environ 10 minutes) :

1. **Créer le projet** : sur https://console.firebase.google.com, *Créer un projet* (par exemple
   `code-quest-3d`). Google Analytics n'est pas nécessaire.
2. **Déclarer le site** : roue dentée → *Paramètres du projet* → *Vos applications* → icône **Web**
   `</>` → donner un surnom → *Enregistrer l'application* (ne pas cocher Firebase Hosting). Firebase
   affiche un objet `firebaseConfig = { apiKey: …, authDomain: …, projectId: …, … }`.
3. **Coller la configuration** dans `formation/js/cloud-config.js`, à la place de `null` :
   `export const FIREBASE_CONFIG = { apiKey: '…', authDomain: '…', projectId: '…', storageBucket: '…', messagingSenderId: '…', appId: '…' };`
   Ces valeurs ne sont pas des secrets (chaque visiteur les reçoit) : on peut les committer.
   L'accès aux données est protégé par les règles de l'étape 6.
4. **Activer les connexions** : *Authentication* → *Commencer* → onglet *Sign-in method* → activer
   **Adresse e-mail/Mot de passe**, et si on le souhaite **Google**.
   Facultatif : *Authentication* → *Templates* → langue des e-mails : français.
5. **Autoriser le site** : *Authentication* → *Settings* → *Domaines autorisés* → *Ajouter un domaine* →
   `alexdevanssay-cmyk.github.io`.
6. **Créer la base** : *Firestore Database* → *Créer une base de données* → emplacement en Europe
   (par exemple `europe-west9`, Paris) → mode **production** → onglet *Règles* : remplacer le contenu
   par celui de [`firebase/firestore.rules`](firebase/firestore.rules) → *Publier*.
7. **Publier** : committer `cloud-config.js` sur `main`. Après la republication de Pages, la page
   *Compte* (👤 en haut à droite) propose de créer un compte.

Fonctionnement : chaque réponse est d'abord enregistrée dans le navigateur, puis envoyée sur le
compte deux secondes après la dernière modification (hors connexion : dès le retour du réseau).
Chaque envoi est fusionné avec la copie en ligne, et la page récupère la progression des autres
appareils à l'ouverture et quand on revient sur son onglet : deux appareils ouverts en même temps
ne s'effacent jamais l'un l'autre. À la
connexion, si le navigateur et le compte ont tous deux de la progression, elles sont **fusionnées**
(leçons, examens et badges des deux côtés, la réponse la plus récente de chaque question). Chacun
peut supprimer son compte et ses données depuis la page *Compte*. Les comptes se gèrent dans la
console Firebase (*Authentication* → *Users*).

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
  js/sync.js                fusion et synchronisation avec la copie du compte
  js/cloud.js, cloud-config.js   comptes et base en ligne (Firebase), désactivés sans configuration
  firebase/firestore.rules  règles d'accès de la base (chacun ne lit que sa progression)
  js/quiz.js                affichage et correction des 7 types de questions
  js/render.js              rendu des leçons et coloration du code
  js/ui.js                  textes de l'interface (fr / en)
  js/widgets/               bac à sable JS, terminal simulé, diagramme de dialogue
  content/                  les 10 modules et le glossaire
  tools/, tests/            validation du contenu et tests
```

Confidentialité : la formation ne cite que de courts extraits du code de 3D Reader. Aucune donnée de chiffrage,
de client, de clé ou de dossier réseau n'y figure (le validateur le vérifie).
