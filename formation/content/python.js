// Module « Python côté serveur » — voir formation/CONTENT_SPEC.md
export default {
  id: 'python',
  order: 6,
  icon: '🐍',
  color: '#3776ab',
  title: { fr: 'Python côté serveur', en: 'Python on the server' },
  summary: {
    fr: 'Comprendre le moteur de référence reader3d : paquet, syntaxe utile, serveur FastAPI, environnements, tests pytest et processus isolés.',
    en: 'Understand the reference engine reader3d: package, useful syntax, FastAPI server, environments, pytest tests and isolated processes.',
  },
  skills: {
    'python.packages': { fr: 'Paquets, modules et imports', en: 'Packages, modules and imports' },
    'python.syntax': { fr: 'Syntaxe Python utile', en: 'Useful Python syntax' },
    'python.fastapi': { fr: 'Le serveur web FastAPI', en: 'The FastAPI web server' },
    'python.env': { fr: 'venv, pip et dépendances', en: 'venv, pip and dependencies' },
    'python.tests': { fr: 'Tests avec pytest', en: 'Testing with pytest' },
    'python.process': { fr: 'Processus isolés et moteurs de référence', en: 'Isolated processes and reference engines' },
  },
  widgets: {},
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'python-1',
      title: { fr: 'Un paquet Python : reader3d', en: 'A Python package: reader3d' },
      skills: ['python.packages'],
      minutes: 10,
      body: {
        fr: `<h3>Le moteur d'origine de 3D Reader</h3>
<p>Avant la version navigateur, 3D Reader était une application Python. Ce moteur existe toujours, dans le dossier <code>reader3d/</code>, et il reste la <strong>référence</strong> : le moteur JavaScript doit retrouver exactement ses résultats.</p>
~~~text title="reader3d/"
reader3d/
├── __init__.py     ← fait de ce dossier un « paquet »
├── __main__.py     ← exécuté par : python -m reader3d
├── analyze.py      ← analyze_file() : point d'entrée de l'analyse
├── cad.py          ← lecture STEP/IGES/BREP via OpenCascade
├── mesh.py         ← lecture STL, OBJ, PLY… via trimesh
├── model.py        ← la classe Body et summarize()
├── isolate.py      ← analyse dans un processus enfant
└── server.py       ← serveur web FastAPI
~~~
<h3>Module, paquet, import</h3>
<ul>
<li>Un <strong>module</strong> = un fichier <code>.py</code>. <code>cad.py</code> est le module <code>reader3d.cad</code>.</li>
<li>Un <strong>paquet</strong> = un dossier de modules avec un <code>__init__.py</code>.</li>
<li><code>import</code> charge un module ; <code>from … import …</code> en prend seulement certains noms.</li>
</ul>
~~~py title="tests/test_volume.py"
import json                                   #«1»
from pathlib import Path                      #«2»
import numpy as np                            #«3»
from reader3d.analyze import analyze_file     #«4»
from reader3d.model import Body, summarize
~~~
<ol class="notes">
<li>Module de la <strong>bibliothèque standard</strong> (livré avec Python).</li>
<li>On n'importe que la classe <code>Path</code> du module <code>pathlib</code>.</li>
<li><code>as np</code> donne un surnom : on écrira <code>np.array(...)</code>.</li>
<li>Import <strong>absolu</strong> depuis notre propre paquet.</li>
</ol>
<p>À l'intérieur du paquet, les modules s'importent entre eux avec un point (import <strong>relatif</strong>) :</p>
~~~py title="reader3d/server.py"
from .analyze import SUPPORTED_EXTENSIONS
from .isolate import AnalysisCancelled, AnalysisCrashed, analyze_isolated
~~~
<p>Le <code>.</code> veut dire « dans le même paquet que moi ».</p>
<h3>Lancer le paquet : <code>python -m reader3d</code></h3>
<p>L'option <code>-m</code> exécute un module. Pour un paquet, Python lance son fichier <code>__main__.py</code> :</p>
~~~py title="reader3d/__main__.py"
"""Command line: \`python -m reader3d serve\` or \`python -m reader3d analyze FILE\`."""

def main() -> None:
    parser = argparse.ArgumentParser(prog="reader3d", description="3D model reader: viewer and real volume calculation")
    sub = parser.add_subparsers(dest="command", required=True)
    serve = sub.add_parser("serve", help="start the web interface")
    an = sub.add_parser("analyze", help="print the volume and dimensions of a file")
~~~
~~~bash
python -m reader3d analyze piece.step     # affiche volume et dimensions
python -m reader3d analyze piece.step --json
python -m reader3d serve --port 8000      # lance le serveur web
~~~
<div class="callout info">Le texte entre triples guillemets <code>"""…"""</code> juste sous la ligne <code>def</code> ou en haut d'un fichier est une <strong>docstring</strong> : la documentation officielle de la fonction ou du module.</div>
<div class="callout project"><strong>Dans 3D Reader</strong> : <code>pyproject.toml</code> déclare aussi une commande : <code>reader3d = "reader3d.__main__:main"</code>. Une fois le paquet installé, taper <code>reader3d analyze piece.step</code> revient au même que <code>python -m reader3d analyze piece.step</code>.</div>`,
        en: `<h3>3D Reader's original engine</h3>
<p>Before the browser version, 3D Reader was a Python application. That engine still exists, in the <code>reader3d/</code> folder, and remains the <strong>reference</strong>: the JavaScript engine must find exactly its results.</p>
~~~text title="reader3d/"
reader3d/
├── __init__.py     ← makes this folder a "package"
├── __main__.py     ← run by: python -m reader3d
├── analyze.py      ← analyze_file(): entry point of the analysis
├── cad.py          ← STEP/IGES/BREP reading via OpenCascade
├── mesh.py         ← STL, OBJ, PLY… reading via trimesh
├── model.py        ← the Body class and summarize()
├── isolate.py      ← analysis in a child process
└── server.py       ← FastAPI web server
~~~
<h3>Module, package, import</h3>
<ul>
<li>A <strong>module</strong> = one <code>.py</code> file. <code>cad.py</code> is the module <code>reader3d.cad</code>.</li>
<li>A <strong>package</strong> = a folder of modules with an <code>__init__.py</code>.</li>
<li><code>import</code> loads a module; <code>from … import …</code> takes only some of its names.</li>
</ul>
~~~py title="tests/test_volume.py"
import json                                   #«1»
from pathlib import Path                      #«2»
import numpy as np                            #«3»
from reader3d.analyze import analyze_file     #«4»
from reader3d.model import Body, summarize
~~~
<ol class="notes">
<li>A <strong>standard library</strong> module (shipped with Python).</li>
<li>Only the <code>Path</code> class is imported from the <code>pathlib</code> module.</li>
<li><code>as np</code> gives a nickname: we will write <code>np.array(...)</code>.</li>
<li><strong>Absolute</strong> import from our own package.</li>
</ol>
<p>Inside the package, modules import each other with a dot (<strong>relative</strong> import):</p>
~~~py title="reader3d/server.py"
from .analyze import SUPPORTED_EXTENSIONS
from .isolate import AnalysisCancelled, AnalysisCrashed, analyze_isolated
~~~
<p>The <code>.</code> means "in the same package as me".</p>
<h3>Running the package: <code>python -m reader3d</code></h3>
<p>The <code>-m</code> option runs a module. For a package, Python runs its <code>__main__.py</code> file:</p>
~~~py title="reader3d/__main__.py"
"""Command line: \`python -m reader3d serve\` or \`python -m reader3d analyze FILE\`."""

def main() -> None:
    parser = argparse.ArgumentParser(prog="reader3d", description="3D model reader: viewer and real volume calculation")
    sub = parser.add_subparsers(dest="command", required=True)
    serve = sub.add_parser("serve", help="start the web interface")
    an = sub.add_parser("analyze", help="print the volume and dimensions of a file")
~~~
~~~bash
python -m reader3d analyze part.step      # prints volume and dimensions
python -m reader3d analyze part.step --json
python -m reader3d serve --port 8000      # starts the web server
~~~
<div class="callout info">Text between triple quotes <code>"""…"""</code> right under a <code>def</code> line or at the top of a file is a <strong>docstring</strong>: the official documentation of the function or module.</div>
<div class="callout project"><strong>In 3D Reader</strong>: <code>pyproject.toml</code> also declares a command: <code>reader3d = "reader3d.__main__:main"</code>. Once the package is installed, typing <code>reader3d analyze part.step</code> is the same as <code>python -m reader3d analyze part.step</code>.</div>`,
      },
      deep: {
        fr: `<h3>Paquets et imports, version rayonnages d'atelier</h3>
<div class="callout analogy">
<p>Un <strong>module</strong> (<code>cad.py</code>), c'est une <strong>caisse à outils</strong> étiquetée. Un <strong>paquet</strong> (<code>reader3d/</code>), c'est l'<strong>armoire</strong> qui range plusieurs caisses ; le petit fichier <code>__init__.py</code> est l'étiquette « armoire officielle » collée sur la porte.</p>
<ul>
<li><code>import json</code> = « apporte-moi la caisse <em>json</em> entière ».</li>
<li><code>from pathlib import Path</code> = « dans la caisse <em>pathlib</em>, sors-moi juste la clé <em>Path</em> ».</li>
<li><code>import numpy as np</code> = « apporte la caisse <em>numpy</em>, je l'appellerai <em>np</em> ».</li>
<li><code>from .analyze import …</code> = « dans <em>ma</em> armoire (le point), caisse <em>analyze</em> ».</li>
</ul>
</div>
<h4>Les trois provenances d'un import</h4>
<table><thead><tr><th>Provenance</th><th>Exemple</th><th>Comment il arrive là</th></tr></thead><tbody>
<tr><td>Bibliothèque standard</td><td><code>json</code>, <code>pathlib</code>, <code>tempfile</code></td><td>livré avec Python</td></tr>
<tr><td>Paquet tiers</td><td><code>numpy</code>, <code>fastapi</code>, <code>OCP</code></td><td>installé avec <code>pip</code></td></tr>
<tr><td>Notre code</td><td><code>reader3d.cad</code></td><td>le dossier du dépôt</td></tr>
</tbody></table>
<h4>L'erreur la plus courante</h4>
~~~text
ModuleNotFoundError: No module named 'trimesh'
~~~
<p>Traduction : « je ne trouve pas cette caisse dans l'armoire ». Soit le paquet n'est pas installé (<code>pip install -r requirements.txt</code>), soit tu n'es pas dans le bon environnement virtuel (on le verra plus loin).</p>
<h4><code>python -m</code> pas à pas</h4>
<ol>
<li>Tu tapes <code>python -m reader3d analyze piece.step</code>.</li>
<li>Python cherche une armoire nommée <code>reader3d</code>.</li>
<li>Il ouvre le tiroir spécial <code>__main__.py</code> et exécute <code>main()</code>.</li>
<li><code>argparse</code> lit les mots suivants : commande <code>analyze</code>, fichier <code>piece.step</code>.</li>
<li><code>analyze_file()</code> fait le calcul et le résultat s'affiche.</li>
</ol>`,
        en: `<h3>Packages and imports, workshop-shelves version</h3>
<div class="callout analogy">
<p>A <strong>module</strong> (<code>cad.py</code>) is a labelled <strong>toolbox</strong>. A <strong>package</strong> (<code>reader3d/</code>) is the <strong>cabinet</strong> holding several boxes; the small file <code>__init__.py</code> is the "official cabinet" label stuck on the door.</p>
<ul>
<li><code>import json</code> = "bring me the whole <em>json</em> box".</li>
<li><code>from pathlib import Path</code> = "in the <em>pathlib</em> box, just get me the <em>Path</em> spanner".</li>
<li><code>import numpy as np</code> = "bring the <em>numpy</em> box, I will call it <em>np</em>".</li>
<li><code>from .analyze import …</code> = "in <em>my</em> cabinet (the dot), the <em>analyze</em> box".</li>
</ul>
</div>
<h4>The three origins of an import</h4>
<table><thead><tr><th>Origin</th><th>Example</th><th>How it gets there</th></tr></thead><tbody>
<tr><td>Standard library</td><td><code>json</code>, <code>pathlib</code>, <code>tempfile</code></td><td>ships with Python</td></tr>
<tr><td>Third-party package</td><td><code>numpy</code>, <code>fastapi</code>, <code>OCP</code></td><td>installed with <code>pip</code></td></tr>
<tr><td>Our code</td><td><code>reader3d.cad</code></td><td>the repository folder</td></tr>
</tbody></table>
<h4>The most common error</h4>
~~~text
ModuleNotFoundError: No module named 'trimesh'
~~~
<p>Translation: "I cannot find that box in the cabinet". Either the package is not installed (<code>pip install -r requirements.txt</code>), or you are not in the right virtual environment (we will see that later).</p>
<h4><code>python -m</code> step by step</h4>
<ol>
<li>You type <code>python -m reader3d analyze part.step</code>.</li>
<li>Python looks for a cabinet named <code>reader3d</code>.</li>
<li>It opens the special drawer <code>__main__.py</code> and runs <code>main()</code>.</li>
<li><code>argparse</code> reads the next words: command <code>analyze</code>, file <code>part.step</code>.</li>
<li><code>analyze_file()</code> does the computation and the result is printed.</li>
</ol>`,
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'python-2',
      title: { fr: 'La syntaxe Python qu\'on croise partout', en: 'The Python syntax you meet everywhere' },
      skills: ['python.syntax'],
      minutes: 14,
      body: {
        fr: `<h3>L'indentation est la syntaxe</h3>
<p>Pas d'accolades en Python : c'est le <strong>décalage</strong> (4 espaces) qui dit ce qui est dans le <code>if</code>, la boucle ou la fonction. Un décalage faux = une erreur (<code>IndentationError</code>) ou, pire, un programme qui fait autre chose.</p>
~~~py title="reader3d/cad.py"
volume = props.Mass()
if volume < 0:
    notes.append("Solid had inverted orientation; volume sign corrected")
    volume = -volume
com = props.CentreOfMass()
~~~
<h3>Les f-strings</h3>
<p>Un <code>f</code> devant une chaîne permet d'y insérer des valeurs entre <code>{ }</code> :</p>
~~~py title="reader3d/server.py"
raise HTTPException(400, f"Unsupported file type '{suffix}'. Supported: {', '.join(SUPPORTED_EXTENSIONS)}")
~~~
<p>On peut aussi formater : <code>f"{masse:.2f} kg"</code> → deux décimales.</p>
<h3>Les annotations de type</h3>
<p>Python ne vérifie pas les types à l'exécution, mais on peut les <strong>annoter</strong> pour la documentation et les outils :</p>
~~~py title="reader3d/model.py"
@dataclass
class Body:                                   #«1»
    name: str
    volume: float | None                      #«2»
    area: float
    centroid: tuple[float, float, float] | None
    closed: bool
    mesh_volume: float | None = None          #«3»
    notes: list[str] = field(default_factory=list)
~~~
<ol class="notes">
<li><code>@dataclass</code> fabrique automatiquement le constructeur à partir de la liste des champs : plus besoin d'écrire <code>__init__</code>.</li>
<li><code>float | None</code> = « un nombre, ou rien du tout » (pas de volume pour une surface ouverte).</li>
<li>Valeur par défaut. Pour une liste, on passe par <code>field(default_factory=list)</code> afin que chaque objet ait <em>sa</em> liste.</li>
</ol>
<p>Pour les fonctions : <code>def read_cad(path: str | Path, quality: str = "normal") -&gt; list[Body]:</code> — la flèche <code>-&gt;</code> annonce le type renvoyé.</p>
<h3>Les compréhensions</h3>
<p>Une façon courte de construire une liste ou un dictionnaire :</p>
~~~py
volumes = [b.volume for b in bodies if b.closed]       # liste
par_nom = {b.name: b.volume for b in bodies}           # dictionnaire
taille = tuple(float(b - a) for a, b in zip(bmin, bmax))  # générateur → tuple
~~~
<p>Se lit : « le volume de <em>b</em>, pour chaque <em>b</em> de bodies, si <em>b</em> est fermé ».</p>
<h3><code>with</code> : ouvrir et refermer proprement</h3>
~~~py title="reader3d/server.py"
with tempfile.TemporaryDirectory() as tmp:
    target = Path(tmp) / _safe_name(name)
    with target.open("wb") as out:
        out.write(chunk)
# ici, le fichier est fermé et le dossier temporaire supprimé, même en cas d'erreur
~~~
<h3>Les décorateurs <code>@</code></h3>
<p>Une ligne <code>@quelquechose</code> au-dessus d'une fonction ou d'une classe l'« emballe » pour lui ajouter un comportement. <code>@dataclass</code> ajoute un constructeur ; <code>@property</code> transforme une méthode en attribut calculé ; <code>@app.post("/api/analyze")</code> (prochaine leçon) branche une fonction sur une adresse web.</p>
~~~py title="reader3d/model.py"
@property
def size(self) -> tuple[float, float, float]:
    return tuple(float(b - a) for a, b in zip(self.bbox_min, self.bbox_max))
# on écrit body.size, sans parenthèses
~~~
<div class="callout tip">L'opérateur « morse » <code>:=</code> range une valeur <em>et</em> la teste : <code>while chunk := await file.read(1024 * 1024):</code> lit des blocs de 1 Mo tant qu'il en reste.</div>`,
        en: `<h3>Indentation is the syntax</h3>
<p>No braces in Python: the <strong>indent</strong> (4 spaces) says what is inside the <code>if</code>, the loop or the function. A wrong indent = an error (<code>IndentationError</code>) or, worse, a program that does something else.</p>
~~~py title="reader3d/cad.py"
volume = props.Mass()
if volume < 0:
    notes.append("Solid had inverted orientation; volume sign corrected")
    volume = -volume
com = props.CentreOfMass()
~~~
<h3>f-strings</h3>
<p>An <code>f</code> in front of a string lets you insert values between <code>{ }</code>:</p>
~~~py title="reader3d/server.py"
raise HTTPException(400, f"Unsupported file type '{suffix}'. Supported: {', '.join(SUPPORTED_EXTENSIONS)}")
~~~
<p>You can also format: <code>f"{mass:.2f} kg"</code> → two decimals.</p>
<h3>Type annotations</h3>
<p>Python does not check types at run time, but you can <strong>annotate</strong> them for documentation and tools:</p>
~~~py title="reader3d/model.py"
@dataclass
class Body:                                   #«1»
    name: str
    volume: float | None                      #«2»
    area: float
    centroid: tuple[float, float, float] | None
    closed: bool
    mesh_volume: float | None = None          #«3»
    notes: list[str] = field(default_factory=list)
~~~
<ol class="notes">
<li><code>@dataclass</code> builds the constructor automatically from the list of fields: no need to write <code>__init__</code>.</li>
<li><code>float | None</code> = "a number, or nothing at all" (no volume for an open surface).</li>
<li>Default value. For a list, use <code>field(default_factory=list)</code> so each object gets <em>its own</em> list.</li>
</ol>
<p>For functions: <code>def read_cad(path: str | Path, quality: str = "normal") -&gt; list[Body]:</code> — the arrow <code>-&gt;</code> states the returned type.</p>
<h3>Comprehensions</h3>
<p>A short way to build a list or a dictionary:</p>
~~~py
volumes = [b.volume for b in bodies if b.closed]       # list
by_name = {b.name: b.volume for b in bodies}           # dictionary
size = tuple(float(b - a) for a, b in zip(bmin, bmax)) # generator → tuple
~~~
<p>Reads: "the volume of <em>b</em>, for each <em>b</em> in bodies, if <em>b</em> is closed".</p>
<h3><code>with</code>: open and close cleanly</h3>
~~~py title="reader3d/server.py"
with tempfile.TemporaryDirectory() as tmp:
    target = Path(tmp) / _safe_name(name)
    with target.open("wb") as out:
        out.write(chunk)
# here the file is closed and the temporary folder deleted, even after an error
~~~
<h3>Decorators <code>@</code></h3>
<p>A line <code>@something</code> above a function or class "wraps" it to add behaviour. <code>@dataclass</code> adds a constructor; <code>@property</code> turns a method into a computed attribute; <code>@app.post("/api/analyze")</code> (next lesson) plugs a function onto a web address.</p>
~~~py title="reader3d/model.py"
@property
def size(self) -> tuple[float, float, float]:
    return tuple(float(b - a) for a, b in zip(self.bbox_min, self.bbox_max))
# you write body.size, without parentheses
~~~
<div class="callout tip">The "walrus" operator <code>:=</code> stores a value <em>and</em> tests it: <code>while chunk := await file.read(1024 * 1024):</code> reads 1 MB blocks while there are any left.</div>`,
      },
      deep: {
        fr: `<h3>La syntaxe Python, version fiche de contrôle</h3>
<div class="callout analogy">
<p>L'<strong>indentation</strong>, c'est comme les retraits d'une <strong>gamme de contrôle</strong> : l'opération 20 a des sous-opérations 21, 22 décalées vers la droite. Si tu décales mal une ligne, elle change d'opération parente.</p>
</div>
~~~text
if volume < 0:            ← condition
    corriger le signe     ← DANS le if (décalé)
    ajouter une note      ← DANS le if (décalé)
calculer le centre        ← APRÈS le if (revenu à gauche)
~~~
<h4>Six outils à reconnaître d'un coup d'œil</h4>
<table><thead><tr><th>Tu vois…</th><th>Ça veut dire…</th></tr></thead><tbody>
<tr><td><code>f"Volume : {v} mm3"</code></td><td>texte à trous rempli avec la valeur de <code>v</code></td></tr>
<tr><td><code>x: float | None</code></td><td>étiquette : « x est un nombre, ou vide »</td></tr>
<tr><td><code>-&gt; list[Body]</code></td><td>la fonction renvoie une liste de Body</td></tr>
<tr><td><code>[f(x) for x in L if c]</code></td><td>fabrique une liste en une ligne</td></tr>
<tr><td><code>with … as f:</code></td><td>ouvre, utilise, <strong>referme toujours</strong></td></tr>
<tr><td><code>@quelquechose</code></td><td>un « emballage » qui ajoute une capacité</td></tr>
</tbody></table>
<h4>La compréhension décortiquée</h4>
~~~py
# version longue
volumes = []
for b in bodies:
    if b.closed:
        volumes.append(b.volume)

# version courte, même résultat
volumes = [b.volume for b in bodies if b.closed]
~~~
<h4><code>with</code>, l'analogie de la porte du four</h4>
<p><code>with</code>, c'est un four qui <strong>se referme tout seul</strong> quand tu as fini, même si tu lâches la pièce en route (une erreur). Sans <code>with</code>, il faut penser à fermer le fichier : un oubli et il reste ouvert.</p>
<h4>Le décorateur, l'analogie du traitement thermique</h4>
<p>La pièce (la fonction) reste la même, mais le traitement (le décorateur) lui donne une propriété en plus. <code>@dataclass</code> donne un constructeur automatique, <code>@app.post</code> rend la fonction joignable sur le web.</p>
<div class="callout warn">Les annotations de type ne sont <em>pas vérifiées</em> par Python à l'exécution : <code>volume: float</code> n'empêchera pas d'y mettre du texte. Ce sont des indications pour les humains et les éditeurs (VS Code).</div>`,
        en: `<h3>Python syntax, inspection-sheet version</h3>
<div class="callout analogy">
<p><strong>Indentation</strong> is like the indents of an <strong>inspection routing</strong>: operation 20 has sub-operations 21, 22 shifted to the right. Indent a line wrongly and it changes parent operation.</p>
</div>
~~~text
if volume < 0:            ← condition
    fix the sign          ← INSIDE the if (indented)
    add a note            ← INSIDE the if (indented)
compute the centre        ← AFTER the if (back to the left)
~~~
<h4>Six tools to recognise at a glance</h4>
<table><thead><tr><th>You see…</th><th>It means…</th></tr></thead><tbody>
<tr><td><code>f"Volume: {v} mm3"</code></td><td>a fill-in text filled with the value of <code>v</code></td></tr>
<tr><td><code>x: float | None</code></td><td>label: "x is a number, or empty"</td></tr>
<tr><td><code>-&gt; list[Body]</code></td><td>the function returns a list of Body</td></tr>
<tr><td><code>[f(x) for x in L if c]</code></td><td>builds a list in one line</td></tr>
<tr><td><code>with … as f:</code></td><td>open, use, <strong>always close</strong></td></tr>
<tr><td><code>@something</code></td><td>a "wrapping" that adds a capability</td></tr>
</tbody></table>
<h4>The comprehension taken apart</h4>
~~~py
# long version
volumes = []
for b in bodies:
    if b.closed:
        volumes.append(b.volume)

# short version, same result
volumes = [b.volume for b in bodies if b.closed]
~~~
<h4><code>with</code>, the furnace-door analogy</h4>
<p><code>with</code> is a furnace that <strong>closes by itself</strong> when you are done, even if you drop the part on the way (an error). Without <code>with</code>, you must remember to close the file: forget once and it stays open.</p>
<h4>The decorator, the heat-treatment analogy</h4>
<p>The part (the function) stays the same, but the treatment (the decorator) gives it an extra property. <code>@dataclass</code> gives an automatic constructor, <code>@app.post</code> makes the function reachable on the web.</p>
<div class="callout warn">Type annotations are <em>not checked</em> by Python at run time: <code>volume: float</code> will not stop you storing text in it. They are hints for humans and editors (VS Code).</div>`,
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'python-3',
      title: { fr: 'Le serveur web FastAPI', en: 'The FastAPI web server' },
      skills: ['python.fastapi'],
      minutes: 14,
      body: {
        fr: `<h3>Quand Python sert de serveur</h3>
<p>En mode « serveur Python » (menu <em>Moteur</em> de 3D Reader), le navigateur n'analyse pas lui-même le fichier : il l'<strong>envoie</strong> à un programme Python qui répond avec le résultat en JSON. Ce programme est écrit avec <span class="term" data-term="fastapi">FastAPI</span>.</p>
~~~text
 Navigateur                         Serveur Python (uvicorn + FastAPI)
   fetch("api/analyze", POST, fichier)  ──>  @app.post("/api/analyze")
                                             analyze_isolated(...)
   résultat JSON  <──────────────────────  return result
~~~
<h3>Les routes</h3>
~~~py title="reader3d/server.py"
app = FastAPI(title="3D Reader")                    #«1»

@app.get("/api/formats")                            #«2»
...

@app.post("/api/analyze")                           #«3»
async def analyze(                                  #«4»
    request: Request,
    file: UploadFile = File(...),                   #«5»
    unit: str = Form("auto"),
    quality: str = Form("normal"),
):
    name = Path(file.filename or "").name
    suffix = Path(name).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type '{suffix}'. ...")  #«6»
    ...
    result["file"] = name
    return result                                   #«7»
~~~
<ol class="notes">
<li>L'objet <code>app</code> est l'application web.</li>
<li><code>@app.get(chemin)</code> : cette fonction répond aux requêtes <strong>GET</strong> (lire) sur ce chemin.</li>
<li><code>@app.post(chemin)</code> : répond aux requêtes <strong>POST</strong> (envoyer des données).</li>
<li><code>async def</code> : une fonction <em>asynchrone</em>, qui peut attendre (<code>await</code>) sans bloquer les autres visiteurs.</li>
<li>FastAPI lit le formulaire envoyé : un fichier (<code>UploadFile</code>) et deux champs texte, avec leurs valeurs par défaut.</li>
<li><code>raise HTTPException(code, message)</code> renvoie une erreur HTTP : 400 = requête incorrecte, 413 = trop gros, 422 = illisible.</li>
<li>On renvoie un dictionnaire Python : FastAPI le convertit en <strong>JSON</strong> automatiquement.</li>
</ol>
<h3><code>async</code> / <code>await</code></h3>
<p>Une analyse peut durer des secondes. Pendant ce temps, le serveur doit pouvoir répondre à d'autres. <code>await</code> dit : « je mets cette tâche en pause en attendant le résultat, occupe-toi des autres en attendant ».</p>
~~~py
while chunk := await file.read(1024 * 1024):   # lit le fichier par blocs de 1 Mo
    size += len(chunk)
    if size > MAX_UPLOAD_BYTES:
        raise HTTPException(413, _too_large())
~~~
<h3>uvicorn : le moteur qui fait tourner l'app</h3>
<p>FastAPI décrit les routes ; <strong>uvicorn</strong> est le serveur qui écoute réellement le réseau et transmet les requêtes à <code>app</code>.</p>
~~~py title="reader3d/__main__.py"
if args.command == "serve":
    import uvicorn
    uvicorn.run("reader3d.server:app", host=args.host, port=args.port)
~~~
<p>Par défaut : <code>http://127.0.0.1:8000</code> — 127.0.0.1 = « cette machine ».</p>
<div class="callout project"><strong>Dans 3D Reader</strong> : côté page, <code>web/app.js</code> fait <code>fetch("api/analyze", { method: "POST", body: form, signal: ... })</code>. Le même site sait donc travailler avec le moteur navigateur (WebAssembly) <em>ou</em> avec ce serveur Python, au choix de l'utilisateur.</div>
<div class="callout warn">Une limite de taille est vérifiée <em>pendant</em> la réception (classe <code>_UploadLimit</code>) : sinon un fichier énorme serait écrit en entier sur le disque avant qu'on puisse le refuser.</div>`,
        en: `<h3>When Python acts as a server</h3>
<p>In "Python server" mode (3D Reader's <em>Engine</em> menu), the browser does not analyse the file itself: it <strong>sends</strong> it to a Python program that answers with the result as JSON. That program is written with <span class="term" data-term="fastapi">FastAPI</span>.</p>
~~~text
 Browser                            Python server (uvicorn + FastAPI)
   fetch("api/analyze", POST, file)     ──>  @app.post("/api/analyze")
                                             analyze_isolated(...)
   JSON result  <──────────────────────────  return result
~~~
<h3>Routes</h3>
~~~py title="reader3d/server.py"
app = FastAPI(title="3D Reader")                    #«1»

@app.get("/api/formats")                            #«2»
...

@app.post("/api/analyze")                           #«3»
async def analyze(                                  #«4»
    request: Request,
    file: UploadFile = File(...),                   #«5»
    unit: str = Form("auto"),
    quality: str = Form("normal"),
):
    name = Path(file.filename or "").name
    suffix = Path(name).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type '{suffix}'. ...")  #«6»
    ...
    result["file"] = name
    return result                                   #«7»
~~~
<ol class="notes">
<li>The <code>app</code> object is the web application.</li>
<li><code>@app.get(path)</code>: this function answers <strong>GET</strong> requests (read) on this path.</li>
<li><code>@app.post(path)</code>: answers <strong>POST</strong> requests (send data).</li>
<li><code>async def</code>: an <em>asynchronous</em> function, which can wait (<code>await</code>) without blocking other visitors.</li>
<li>FastAPI reads the submitted form: a file (<code>UploadFile</code>) and two text fields, with their defaults.</li>
<li><code>raise HTTPException(code, message)</code> returns an HTTP error: 400 = bad request, 413 = too large, 422 = unreadable.</li>
<li>We return a Python dictionary: FastAPI converts it to <strong>JSON</strong> automatically.</li>
</ol>
<h3><code>async</code> / <code>await</code></h3>
<p>An analysis can take seconds. Meanwhile, the server must be able to answer others. <code>await</code> says: "I pause this task while waiting for the result, deal with the others in the meantime".</p>
~~~py
while chunk := await file.read(1024 * 1024):   # reads the file in 1 MB blocks
    size += len(chunk)
    if size > MAX_UPLOAD_BYTES:
        raise HTTPException(413, _too_large())
~~~
<h3>uvicorn: the engine that runs the app</h3>
<p>FastAPI describes the routes; <strong>uvicorn</strong> is the server that actually listens on the network and passes requests to <code>app</code>.</p>
~~~py title="reader3d/__main__.py"
if args.command == "serve":
    import uvicorn
    uvicorn.run("reader3d.server:app", host=args.host, port=args.port)
~~~
<p>By default: <code>http://127.0.0.1:8000</code> — 127.0.0.1 = "this machine".</p>
<div class="callout project"><strong>In 3D Reader</strong>: on the page side, <code>web/app.js</code> does <code>fetch("api/analyze", { method: "POST", body: form, signal: ... })</code>. So the same site can work with the browser engine (WebAssembly) <em>or</em> with this Python server, as the user chooses.</div>
<div class="callout warn">A size limit is checked <em>while</em> receiving (class <code>_UploadLimit</code>): otherwise a huge file would be written to disk in full before it could be refused.</div>`,
      },
      deep: {
        fr: `<h3>FastAPI, version guichet de l'atelier</h3>
<div class="callout analogy">
<p>Imagine le <strong>guichet</strong> du bureau des méthodes. Chaque guichet a une étiquette (la <strong>route</strong>, ex. <code>/api/analyze</code>) et un type de demande (<strong>GET</strong> = « je viens chercher une info », <strong>POST</strong> = « je vous dépose un dossier »).</p>
<ul>
<li><strong>uvicorn</strong> = l'accueil du bâtiment : il reçoit tout le monde et oriente vers le bon guichet.</li>
<li><strong>FastAPI</strong> = le plan des guichets : quelle étiquette mène à quel employé.</li>
<li>La <strong>fonction décorée</strong> = l'employé derrière le guichet.</li>
<li><code>HTTPException(400, …)</code> = l'employé qui rend le dossier avec un mot : « format refusé ».</li>
<li>Le <strong>JSON</strong> renvoyé = la fiche de résultats tamponnée.</li>
</ul>
</div>
<h4><code>async</code>/<code>await</code>, l'analogie du four de traitement</h4>
<p>Un opérateur enfourne une pièce pour 2 heures. Il ne reste pas planté devant (<em>synchrone</em>) : il lance le cycle (<code>await</code>) et va s'occuper d'autres pièces. Quand le four sonne, il revient. Un serveur <code>async</code> fait pareil avec des dizaines de visiteurs.</p>
<h4>Les codes de réponse à connaître</h4>
<table><thead><tr><th>Code</th><th>Sens</th><th>Dans server.py</th></tr></thead><tbody>
<tr><td>200</td><td>OK, voici le résultat</td><td><code>return result</code></td></tr>
<tr><td>400</td><td>Demande incorrecte</td><td>extension non prise en charge</td></tr>
<tr><td>413</td><td>Trop gros</td><td>fichier &gt; 500 Mo</td></tr>
<tr><td>422</td><td>Contenu illisible</td><td>fichier corrompu, OpenCascade a planté</td></tr>
<tr><td>499</td><td>Le client est parti</td><td>onglet fermé pendant l'analyse</td></tr>
</tbody></table>
<h4>Le trajet d'un fichier, en 6 étapes</h4>
<ol>
<li>Tu choisis <em>Moteur : serveur Python</em> et tu ouvres <code>carter.step</code>.</li>
<li>La page envoie un POST multipart vers <code>/api/analyze</code>.</li>
<li>uvicorn reçoit, FastAPI appelle <code>analyze(file=…, unit="auto", quality="normal")</code>.</li>
<li>Le fichier est copié dans un dossier temporaire (<code>with tempfile.TemporaryDirectory()</code>).</li>
<li>L'analyse tourne dans un processus enfant (leçon 6).</li>
<li>Le dictionnaire résultat repart en JSON ; la page l'affiche en 3D.</li>
</ol>`,
        en: `<h3>FastAPI, workshop-counter version</h3>
<div class="callout analogy">
<p>Picture the <strong>counters</strong> of the methods office. Each counter has a label (the <strong>route</strong>, e.g. <code>/api/analyze</code>) and a kind of request (<strong>GET</strong> = "I came to fetch some info", <strong>POST</strong> = "I am handing in a file").</p>
<ul>
<li><strong>uvicorn</strong> = the building's reception: it receives everyone and directs them to the right counter.</li>
<li><strong>FastAPI</strong> = the counter map: which label leads to which clerk.</li>
<li>The <strong>decorated function</strong> = the clerk behind the counter.</li>
<li><code>HTTPException(400, …)</code> = the clerk handing the file back with a note: "format refused".</li>
<li>The returned <strong>JSON</strong> = the stamped results sheet.</li>
</ul>
</div>
<h4><code>async</code>/<code>await</code>, the heat-treatment-oven analogy</h4>
<p>An operator loads a part for 2 hours. They do not stand in front of it (<em>synchronous</em>): they start the cycle (<code>await</code>) and go work on other parts. When the oven beeps, they come back. An <code>async</code> server does the same with dozens of visitors.</p>
<h4>Response codes to know</h4>
<table><thead><tr><th>Code</th><th>Meaning</th><th>In server.py</th></tr></thead><tbody>
<tr><td>200</td><td>OK, here is the result</td><td><code>return result</code></td></tr>
<tr><td>400</td><td>Bad request</td><td>unsupported extension</td></tr>
<tr><td>413</td><td>Too large</td><td>file &gt; 500 MB</td></tr>
<tr><td>422</td><td>Unreadable content</td><td>corrupt file, OpenCascade crashed</td></tr>
<tr><td>499</td><td>Client went away</td><td>tab closed during the analysis</td></tr>
</tbody></table>
<h4>A file's journey, in 6 steps</h4>
<ol>
<li>You pick <em>Engine: Python server</em> and open <code>housing.step</code>.</li>
<li>The page sends a multipart POST to <code>/api/analyze</code>.</li>
<li>uvicorn receives it, FastAPI calls <code>analyze(file=…, unit="auto", quality="normal")</code>.</li>
<li>The file is copied into a temporary folder (<code>with tempfile.TemporaryDirectory()</code>).</li>
<li>The analysis runs in a child process (lesson 6).</li>
<li>The result dictionary goes back as JSON; the page shows it in 3D.</li>
</ol>`,
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'python-4',
      title: { fr: 'Environnements : venv, pip et dépendances', en: 'Environments: venv, pip and dependencies' },
      skills: ['python.env'],
      minutes: 12,
      body: {
        fr: `<h3>Le problème</h3>
<p>3D Reader a besoin de <code>numpy</code>, <code>trimesh</code>, <code>fastapi</code>, <code>cadquery-ocp</code>… dans des versions précises. Un autre projet sur ton PC peut vouloir d'autres versions. Si tout est installé au même endroit, les projets se marchent dessus.</p>
<h3>La solution : un environnement virtuel</h3>
<p>Un <span class="term" data-term="venv">venv</span> est un dossier (souvent <code>.venv/</code>) qui contient <strong>son propre Python et ses propres paquets</strong>, isolés du reste.</p>
~~~bash
python -m venv .venv               # crée l'environnement (une fois)
source .venv/bin/activate          # l'active (Linux / macOS)
pip install -r requirements.txt    # installe les dépendances DANS .venv
python -m reader3d serve           # tourne avec ce Python-là
deactivate                         # quitte l'environnement
~~~
~~~ps title="PowerShell (Windows)"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
~~~
<p>Une fois activé, l'invite affiche <code>(.venv)</code> au début de la ligne : c'est le signe que <code>python</code> et <code>pip</code> sont ceux du projet.</p>
<div class="callout info">Le dossier <code>.venv/</code> n'est jamais committé (il est dans <code>.gitignore</code>) : chacun le recrée chez lui à partir de la liste des dépendances.</div>
<h3>pip et requirements.txt</h3>
<p><span class="term" data-term="pip">pip</span> est l'installateur de paquets Python (il télécharge depuis PyPI). <code>requirements.txt</code> liste ce qu'il faut installer :</p>
~~~text title="requirements.txt"
# OpenCascade 8 (Python 3.11+): 7.9 drops the reflection of mirrored STEP instances.
cadquery-ocp>=8.0
fastapi>=0.110
uvicorn>=0.29
python-multipart>=0.0.9
numpy>=1.26
scipy>=1.11
trimesh>=4.0
~~~
<p><code>&gt;=8.0</code> = « version 8.0 ou plus récente ». <code>requirements-dev.txt</code> ajoute les outils réservés aux développeurs (comme <code>pytest</code>).</p>
<h3>pyproject.toml : la carte d'identité du paquet</h3>
~~~text title="pyproject.toml"
[project]
name = "reader3d"
version = "0.3.0"
requires-python = ">=3.11"
dependencies = [
    "cadquery-ocp>=8.0",
    "fastapi>=0.110",
    ...
]

[project.scripts]
reader3d = "reader3d.__main__:main"

[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]
~~~
<p>Il dit comment s'appelle le paquet, quelle version de Python il exige, ses dépendances, la commande qu'il installe et la configuration de pytest.</p>
<h3>Qui fait quoi dans les dépendances ?</h3>
<table><thead><tr><th>Paquet</th><th>Rôle dans reader3d</th></tr></thead><tbody>
<tr><td><code>cadquery-ocp</code></td><td>OpenCascade pour Python (module <code>OCP</code>) : STEP, IGES, volume exact</td></tr>
<tr><td><code>numpy</code></td><td>calcul sur de grands tableaux de nombres (sommets, triangles)</td></tr>
<tr><td><code>scipy</code></td><td>outils scientifiques (enveloppe convexe pour la boîte orientée minimale)</td></tr>
<tr><td><code>trimesh</code></td><td>lecture et réparation des maillages STL, OBJ, PLY, 3MF…</td></tr>
<tr><td><code>fastapi</code> + <code>uvicorn</code></td><td>le serveur web</td></tr>
<tr><td><code>python-multipart</code></td><td>lire les fichiers envoyés par formulaire</td></tr>
</tbody></table>
<div class="callout project"><strong>Dans 3D Reader</strong> : la CI GitHub fait exactement ces étapes sur une machine neuve : <code>actions/setup-python</code> (Python 3.11), <code>pip install -r requirements-dev.txt</code>, puis <code>pytest</code>.</div>`,
        en: `<h3>The problem</h3>
<p>3D Reader needs <code>numpy</code>, <code>trimesh</code>, <code>fastapi</code>, <code>cadquery-ocp</code>… in specific versions. Another project on your PC may want other versions. If everything is installed in the same place, the projects step on each other.</p>
<h3>The solution: a virtual environment</h3>
<p>A <span class="term" data-term="venv">venv</span> is a folder (often <code>.venv/</code>) holding <strong>its own Python and its own packages</strong>, isolated from the rest.</p>
~~~bash
python -m venv .venv               # creates the environment (once)
source .venv/bin/activate          # activates it (Linux / macOS)
pip install -r requirements.txt    # installs the dependencies INTO .venv
python -m reader3d serve           # runs with that Python
deactivate                         # leaves the environment
~~~
~~~ps title="PowerShell (Windows)"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
~~~
<p>Once activated, the prompt shows <code>(.venv)</code> at the start of the line: the sign that <code>python</code> and <code>pip</code> are the project's.</p>
<div class="callout info">The <code>.venv/</code> folder is never committed (it is in <code>.gitignore</code>): everyone recreates it locally from the list of dependencies.</div>
<h3>pip and requirements.txt</h3>
<p><span class="term" data-term="pip">pip</span> is Python's package installer (it downloads from PyPI). <code>requirements.txt</code> lists what to install:</p>
~~~text title="requirements.txt"
# OpenCascade 8 (Python 3.11+): 7.9 drops the reflection of mirrored STEP instances.
cadquery-ocp>=8.0
fastapi>=0.110
uvicorn>=0.29
python-multipart>=0.0.9
numpy>=1.26
scipy>=1.11
trimesh>=4.0
~~~
<p><code>&gt;=8.0</code> = "version 8.0 or newer". <code>requirements-dev.txt</code> adds tools reserved for developers (like <code>pytest</code>).</p>
<h3>pyproject.toml: the package's ID card</h3>
~~~text title="pyproject.toml"
[project]
name = "reader3d"
version = "0.3.0"
requires-python = ">=3.11"
dependencies = [
    "cadquery-ocp>=8.0",
    "fastapi>=0.110",
    ...
]

[project.scripts]
reader3d = "reader3d.__main__:main"

[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]
~~~
<p>It says what the package is called, which Python version it requires, its dependencies, the command it installs and the pytest configuration.</p>
<h3>Who does what among the dependencies?</h3>
<table><thead><tr><th>Package</th><th>Role in reader3d</th></tr></thead><tbody>
<tr><td><code>cadquery-ocp</code></td><td>OpenCascade for Python (module <code>OCP</code>): STEP, IGES, exact volume</td></tr>
<tr><td><code>numpy</code></td><td>computing on large arrays of numbers (vertices, triangles)</td></tr>
<tr><td><code>scipy</code></td><td>scientific tools (convex hull for the minimum oriented box)</td></tr>
<tr><td><code>trimesh</code></td><td>reading and repairing STL, OBJ, PLY, 3MF… meshes</td></tr>
<tr><td><code>fastapi</code> + <code>uvicorn</code></td><td>the web server</td></tr>
<tr><td><code>python-multipart</code></td><td>reading files sent by form</td></tr>
</tbody></table>
<div class="callout project"><strong>In 3D Reader</strong>: GitHub CI does exactly these steps on a fresh machine: <code>actions/setup-python</code> (Python 3.11), <code>pip install -r requirements-dev.txt</code>, then <code>pytest</code>.</div>`,
      },
      deep: {
        fr: `<h3>venv et pip, version cellules de production</h3>
<div class="callout analogy">
<p>Ton PC est une <strong>usine</strong>. Sans environnement virtuel, tous les projets partagent le <strong>même magasin d'outillage</strong> : si le projet A veut la fraise de Ø10 et le projet B la même fraise réaffûtée à Ø9,8, conflit.</p>
<p>Un <strong>venv</strong>, c'est une <strong>cellule de production dédiée</strong>, avec son propre petit magasin d'outillage. Ce qui s'y trouve ne gêne pas les autres cellules.</p>
<ul>
<li><code>python -m venv .venv</code> = construire la cellule (vide).</li>
<li><code>activate</code> = entrer dans la cellule : désormais, « python » et « pip » désignent ceux de la cellule.</li>
<li><code>pip install -r requirements.txt</code> = approvisionner la cellule d'après la <strong>liste d'outillage</strong>.</li>
<li><code>requirements.txt</code> = la liste d'outillage (outil + version minimale).</li>
<li><code>pyproject.toml</code> = la fiche d'identité du produit fabriqué par la cellule.</li>
</ul>
</div>
<h4>Diagnostic rapide</h4>
<table><thead><tr><th>Symptôme</th><th>Cause probable</th><th>Remède</th></tr></thead><tbody>
<tr><td><code>ModuleNotFoundError: No module named 'numpy'</code></td><td>venv pas activé, ou dépendances pas installées</td><td>activer <code>.venv</code>, puis <code>pip install -r requirements.txt</code></td></tr>
<tr><td>PowerShell refuse <code>Activate.ps1</code></td><td>politique d'exécution des scripts</td><td><code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code></td></tr>
<tr><td><code>python</code> introuvable sous Windows</td><td>Python pas dans le PATH</td><td>réinstaller en cochant « Add to PATH », ou utiliser <code>py</code></td></tr>
<tr><td>« requires Python &gt;=3.11 »</td><td>Python trop ancien</td><td>installer Python 3.11 ou plus</td></tr>
</tbody></table>
<h4>Pourquoi on ne committe pas <code>.venv/</code> ?</h4>
<p>Il pèse des centaines de Mo et dépend de ta machine (Windows ≠ Linux). On committe la <em>liste</em> (<code>requirements.txt</code>), pas les outils eux-mêmes : chacun approvisionne sa propre cellule.</p>`,
        en: `<h3>venv and pip, production-cell version</h3>
<div class="callout analogy">
<p>Your PC is a <strong>factory</strong>. Without a virtual environment, every project shares the <strong>same tool store</strong>: if project A wants the Ø10 cutter and project B the same cutter reground to Ø9.8, conflict.</p>
<p>A <strong>venv</strong> is a <strong>dedicated production cell</strong>, with its own little tool store. What is in it does not bother the other cells.</p>
<ul>
<li><code>python -m venv .venv</code> = build the (empty) cell.</li>
<li><code>activate</code> = step into the cell: from now on, "python" and "pip" mean the cell's.</li>
<li><code>pip install -r requirements.txt</code> = stock the cell from the <strong>tooling list</strong>.</li>
<li><code>requirements.txt</code> = the tooling list (tool + minimum version).</li>
<li><code>pyproject.toml</code> = the ID sheet of the product the cell makes.</li>
</ul>
</div>
<h4>Quick diagnosis</h4>
<table><thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead><tbody>
<tr><td><code>ModuleNotFoundError: No module named 'numpy'</code></td><td>venv not activated, or dependencies not installed</td><td>activate <code>.venv</code>, then <code>pip install -r requirements.txt</code></td></tr>
<tr><td>PowerShell refuses <code>Activate.ps1</code></td><td>script execution policy</td><td><code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code></td></tr>
<tr><td><code>python</code> not found on Windows</td><td>Python not on the PATH</td><td>reinstall ticking "Add to PATH", or use <code>py</code></td></tr>
<tr><td>"requires Python &gt;=3.11"</td><td>Python too old</td><td>install Python 3.11 or newer</td></tr>
</tbody></table>
<h4>Why don't we commit <code>.venv/</code>?</h4>
<p>It weighs hundreds of MB and depends on your machine (Windows ≠ Linux). We commit the <em>list</em> (<code>requirements.txt</code>), not the tools themselves: everyone stocks their own cell.</p>`,
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'python-5',
      title: { fr: 'Tester avec pytest', en: 'Testing with pytest' },
      skills: ['python.tests'],
      minutes: 12,
      body: {
        fr: `<h3>Un test = une vérification automatique</h3>
<p>Un <span class="term" data-term="test-unitaire">test</span> est une petite fonction qui exécute une partie du programme et <strong>vérifie</strong> le résultat. Si le résultat est faux, le test échoue et on le sait tout de suite — avant l'utilisateur.</p>
<h3>Les conventions de pytest</h3>
<ul>
<li>Les fichiers s'appellent <code>test_*.py</code> (ex. <code>tests/test_volume.py</code>, <code>tests/test_server.py</code>).</li>
<li>Les fonctions de test commencent par <code>test_</code>.</li>
<li>On vérifie avec le mot-clé <code>assert</code> : si l'expression est fausse, le test échoue.</li>
</ul>
~~~py title="exemple dans l'esprit de tests/test_volume.py"
import math
from reader3d.analyze import analyze_file

def test_bloc_perce(tmp_path):                       #«1»
    """Bloc 100 x 60 x 20 avec un trou traversant de rayon 10."""
    path = write_step(holed_block(), tmp_path / "bloc.step")   #«2»
    result = analyze_file(path)
    attendu = 100 * 60 * 20 - math.pi * 10**2 * 20
    assert math.isclose(result["summary"]["volume"], attendu, rel_tol=1e-6)  #«3»
~~~
<ol class="notes">
<li><code>tmp_path</code> est une <strong>fixture</strong> fournie par pytest : un dossier temporaire tout neuf, rien qu'en le demandant en paramètre.</li>
<li>On fabrique une pièce dont on connaît le volume <em>par le calcul</em> (ici avec OpenCascade lui-même).</li>
<li><code>math.isclose</code> : on compare des nombres à virgule avec une tolérance, jamais avec <code>==</code> strict.</li>
</ol>
<h3>Les fixtures et <code>conftest.py</code></h3>
<p>Une <strong>fixture</strong> prépare quelque chose dont plusieurs tests ont besoin. Elles se rangent dans <code>conftest.py</code>, que pytest lit automatiquement :</p>
~~~py title="tests/conftest.py"
@pytest.fixture(scope="session", autouse=True)      #«1»
def generated_fixtures():
    """Write tests/fixtures/generated/ (tests/make_fixtures.py) when it is missing."""
    if not (GENERATED / "expected.json").exists():
        from make_fixtures import main
        main(GENERATED)
    return GENERATED
~~~
<ol class="notes">
<li><code>scope="session"</code> = préparée une seule fois pour toute la séance de tests ; <code>autouse=True</code> = utilisée par tous les tests sans qu'ils la demandent.</li>
</ol>
<h3>Tester le serveur sans le lancer</h3>
<p>FastAPI fournit un <code>TestClient</code> qui envoie de fausses requêtes à <code>app</code> :</p>
~~~py
from fastapi.testclient import TestClient
from reader3d.server import app

client = TestClient(app)
r = client.get("/api/formats")
assert r.status_code == 200
~~~
<h3>Lancer les tests</h3>
~~~bash
pytest                         # tous les tests (dossier tests/, voir pyproject.toml)
pytest tests/test_volume.py    # un seul fichier
pytest -k bloc                 # seulement les tests dont le nom contient "bloc"
pytest -x                      # s'arrêter au premier échec
~~~
~~~text
tests/test_server.py ........                      [ 30%]
tests/test_volume.py ...................F           [100%]
FAILED tests/test_volume.py::test_bloc_perce - assert False
~~~
<p>Chaque <code>.</code> est un test réussi, <code>F</code> un échec, <code>E</code> une erreur pendant la préparation.</p>
<div class="callout project"><strong>Dans 3D Reader</strong> : <code>tests/make_fixtures.py</code> fait calculer par Python les résultats de référence (<code>expected.json</code>), puis <code>npm test</code> vérifie que le moteur JavaScript trouve les mêmes. Les tests Python protègent donc aussi le moteur navigateur.</div>`,
        en: `<h3>A test = an automatic check</h3>
<p>A <span class="term" data-term="test-unitaire">test</span> is a small function that runs part of the program and <strong>checks</strong> the result. If the result is wrong, the test fails and you know at once — before the user does.</p>
<h3>pytest conventions</h3>
<ul>
<li>Files are named <code>test_*.py</code> (e.g. <code>tests/test_volume.py</code>, <code>tests/test_server.py</code>).</li>
<li>Test functions start with <code>test_</code>.</li>
<li>You check with the <code>assert</code> keyword: if the expression is false, the test fails.</li>
</ul>
~~~py title="example in the spirit of tests/test_volume.py"
import math
from reader3d.analyze import analyze_file

def test_holed_block(tmp_path):                      #«1»
    """100 x 60 x 20 block with a through hole of radius 10."""
    path = write_step(holed_block(), tmp_path / "block.step")  #«2»
    result = analyze_file(path)
    expected = 100 * 60 * 20 - math.pi * 10**2 * 20
    assert math.isclose(result["summary"]["volume"], expected, rel_tol=1e-6)  #«3»
~~~
<ol class="notes">
<li><code>tmp_path</code> is a <strong>fixture</strong> provided by pytest: a brand-new temporary folder, just by asking for it as a parameter.</li>
<li>We build a part whose volume we know <em>by calculation</em> (here with OpenCascade itself).</li>
<li><code>math.isclose</code>: decimal numbers are compared with a tolerance, never with strict <code>==</code>.</li>
</ol>
<h3>Fixtures and <code>conftest.py</code></h3>
<p>A <strong>fixture</strong> prepares something several tests need. They live in <code>conftest.py</code>, which pytest reads automatically:</p>
~~~py title="tests/conftest.py"
@pytest.fixture(scope="session", autouse=True)      #«1»
def generated_fixtures():
    """Write tests/fixtures/generated/ (tests/make_fixtures.py) when it is missing."""
    if not (GENERATED / "expected.json").exists():
        from make_fixtures import main
        main(GENERATED)
    return GENERATED
~~~
<ol class="notes">
<li><code>scope="session"</code> = prepared once for the whole test session; <code>autouse=True</code> = used by every test without asking.</li>
</ol>
<h3>Testing the server without starting it</h3>
<p>FastAPI provides a <code>TestClient</code> that sends fake requests to <code>app</code>:</p>
~~~py
from fastapi.testclient import TestClient
from reader3d.server import app

client = TestClient(app)
r = client.get("/api/formats")
assert r.status_code == 200
~~~
<h3>Running the tests</h3>
~~~bash
pytest                         # all tests (tests/ folder, see pyproject.toml)
pytest tests/test_volume.py    # a single file
pytest -k block                # only tests whose name contains "block"
pytest -x                      # stop at the first failure
~~~
~~~text
tests/test_server.py ........                      [ 30%]
tests/test_volume.py ...................F           [100%]
FAILED tests/test_volume.py::test_holed_block - assert False
~~~
<p>Each <code>.</code> is a passing test, <code>F</code> a failure, <code>E</code> an error during set-up.</p>
<div class="callout project"><strong>In 3D Reader</strong>: <code>tests/make_fixtures.py</code> makes Python compute the reference results (<code>expected.json</code>), then <code>npm test</code> checks that the JavaScript engine finds the same. The Python tests therefore also protect the browser engine.</div>`,
      },
      deep: {
        fr: `<h3>pytest, version contrôle qualité</h3>
<div class="callout analogy">
<p>Un test, c'est une <strong>pièce étalon</strong> passée sur le banc de mesure. Tu connais sa cote exacte (le bloc 100 × 60 × 20 percé Ø20 : volume connu par le calcul). Tu la mesures avec ton instrument (le code). Si l'instrument ne trouve pas la bonne valeur, il est déréglé : <strong>test rouge</strong>.</p>
<ul>
<li><code>assert</code> = la tolérance de la gamme de contrôle : « la cote doit être dans l'intervalle, sinon rebut ».</li>
<li><strong>Fixture</strong> = le montage de contrôle préparé avant la mesure (dossier temporaire, fichiers de référence).</li>
<li><code>conftest.py</code> = l'armoire des montages partagés par tout le labo.</li>
<li><code>pytest</code> = le technicien qui passe <em>toutes</em> les pièces étalons et donne le rapport.</li>
</ul>
</div>
<h4>Lire le rapport</h4>
~~~text
tests/test_volume.py ....F..          ← 6 bons, 1 mauvais
FAILED tests/test_volume.py::test_sphere
  assert 4188.79 == 4190.0            ← valeur trouvée vs valeur attendue
~~~
<ol>
<li>Repère le nom du test (<code>test_sphere</code>).</li>
<li>Compare les deux valeurs : l'écart est-il une erreur, ou une tolérance trop serrée ?</li>
<li>Relance juste ce test : <code>pytest -k sphere</code>.</li>
</ol>
<h4>Pourquoi jamais <code>==</code> avec des nombres à virgule ?</h4>
<p>L'ordinateur stocke les décimaux en binaire : <code>0.1 + 0.2</code> donne <code>0.30000000000000004</code>. C'est comme mesurer au micron une cote donnée au centième : il faut une <strong>tolérance</strong>. D'où <code>math.isclose(a, b, rel_tol=1e-6)</code> ou <code>pytest.approx</code>.</p>
<div class="callout tip">Un test qui échoue n'est pas une catastrophe : c'est le test qui fait son travail. Le vrai danger est le défaut que <em>personne</em> ne teste.</div>`,
        en: `<h3>pytest, quality-control version</h3>
<div class="callout analogy">
<p>A test is a <strong>reference part</strong> put on the measuring bench. You know its exact dimension (the 100 × 60 × 20 block with a Ø20 hole: volume known by calculation). You measure it with your instrument (the code). If the instrument does not find the right value, it is out of calibration: <strong>red test</strong>.</p>
<ul>
<li><code>assert</code> = the tolerance of the inspection plan: "the dimension must be within range, otherwise scrap".</li>
<li><strong>Fixture</strong> = the inspection jig prepared before measuring (temporary folder, reference files).</li>
<li><code>conftest.py</code> = the cabinet of jigs shared by the whole lab.</li>
<li><code>pytest</code> = the technician who runs <em>all</em> the reference parts and writes the report.</li>
</ul>
</div>
<h4>Reading the report</h4>
~~~text
tests/test_volume.py ....F..          ← 6 good, 1 bad
FAILED tests/test_volume.py::test_sphere
  assert 4188.79 == 4190.0            ← value found vs value expected
~~~
<ol>
<li>Find the test's name (<code>test_sphere</code>).</li>
<li>Compare both values: is the gap an error, or a tolerance that is too tight?</li>
<li>Rerun just that test: <code>pytest -k sphere</code>.</li>
</ol>
<h4>Why never <code>==</code> with decimal numbers?</h4>
<p>The computer stores decimals in binary: <code>0.1 + 0.2</code> gives <code>0.30000000000000004</code>. It is like measuring to the micron a dimension given to the hundredth: you need a <strong>tolerance</strong>. Hence <code>math.isclose(a, b, rel_tol=1e-6)</code> or <code>pytest.approx</code>.</p>
<div class="callout tip">A failing test is not a disaster: it is the test doing its job. The real danger is the defect <em>nobody</em> tests.</div>`,
      },
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'python-6',
      title: { fr: 'Processus isolés et moteur de référence', en: 'Isolated processes and the reference engine' },
      skills: ['python.process'],
      minutes: 12,
      body: {
        fr: `<h3>Le danger : du code natif qui plante</h3>
<p>OpenCascade est du C++ compilé. Face à certains fichiers mal formés (un IGES tronqué, par exemple), il peut <strong>planter net</strong> (<em>segmentation fault</em>) ou <strong>tourner en boucle</strong> sans fin. Un plantage en C++ ne lève pas une exception Python qu'on pourrait rattraper : il tue <em>tout le processus</em>. Si ce processus est le serveur web, tous les utilisateurs perdent la connexion.</p>
<h3>La parade : un processus enfant par analyse</h3>
~~~py title="reader3d/isolate.py"
"""Run an analysis in a child process.

OpenCascade is native code: some malformed files (for instance truncated IGES)
crash it with a segmentation fault, and others make it loop forever. Running
each analysis of the web server in its own process turns both cases into a
normal error instead of taking the whole server down. The child can also be
stopped at any time (the client went away), and its memory is bounded.
"""
~~~
<p>Un <span class="term" data-term="programme">processus</span> est un programme en cours d'exécution, avec <strong>sa propre mémoire</strong>. Si l'enfant plante, le parent (le serveur) le voit simplement disparaître et répond une erreur propre (422).</p>
~~~py title="reader3d/isolate.py (simplifié)"
receiver, sender = _CTX.Pipe(duplex=False)            #«1»
proc = _CTX.Process(target=_run, args=(sender, str(path), unit, quality, include_mesh, memory), daemon=True)
proc.start()                                          #«2»
deadline = time.monotonic() + timeout
while not receiver.poll(POLL_S):                      #«3»
    if cancel is not None and cancel.is_set():
        raise AnalysisCancelled("The analysis was cancelled")
    if time.monotonic() >= deadline:
        raise AnalysisCrashed(f"The analysis did not finish within {timeout:.0f} s")
try:
    status, payload = receiver.recv()                 #«4»
except EOFError:
    status, payload = "crashed", None                 #«5»
~~~
<ol class="notes">
<li>Un <strong>tuyau</strong> (<em>pipe</em>) : l'enfant écrit son résultat d'un côté, le parent lit de l'autre.</li>
<li>Démarrage de l'enfant, qui exécute <code>_run(...)</code> → <code>analyze_file(...)</code>.</li>
<li>Toutes les 0,5 s, le parent vérifie : l'utilisateur a-t-il annulé ? le délai (600 s) est-il dépassé ?</li>
<li>Le résultat arrive par le tuyau.</li>
<li>Fin de fichier sans message = l'enfant est mort en route : plantage.</li>
</ol>
<h3>Des exceptions sur mesure</h3>
~~~py
class AnalysisCrashed(RuntimeError): ...
class AnalysisCancelled(AnalysisCrashed): ...
~~~
<p>Le serveur les transforme en réponses HTTP : <code>AnalysisCrashed</code> → 422 « Could not read the file », <code>AnalysisCancelled</code> → 499.</p>
<div class="callout info"><strong>forkserver</strong> (Linux/macOS) démarre chaque enfant à partir d'un processus qui a <em>déjà</em> importé OpenCascade : l'isolement ne coûte que quelques millisecondes. Sous Windows, on utilise <code>spawn</code> (démarrage complet).</div>
<h3>Le même principe dans le navigateur</h3>
<p>Le moteur JavaScript applique la même idée avec un <strong>Web Worker</strong> : l'analyse tourne à part de la page. Si OpenCascade (WebAssembly) plante, <code>worker.js</code> signale une erreur <code>fatal</code>, et <code>client.js</code> jette le Worker et en recrée un neuf.</p>
<table><thead><tr><th></th><th>Moteur Python</th><th>Moteur navigateur</th></tr></thead><tbody>
<tr><td>Fichiers</td><td><code>reader3d/*.py</code></td><td><code>web/engine/*.js</code></td></tr>
<tr><td>OpenCascade via</td><td>OCP (natif)</td><td>opencascade.js (WebAssembly)</td></tr>
<tr><td>Maillages via</td><td>trimesh</td><td>lecteurs JS + three.js</td></tr>
<tr><td>Isolement</td><td>processus enfant</td><td>Web Worker</td></tr>
<tr><td>Rôle</td><td><strong>référence</strong></td><td>doit reproduire la référence</td></tr>
<tr><td>Où ça tourne</td><td>un serveur (ton PC)</td><td>le navigateur du visiteur (GitHub Pages)</td></tr>
</tbody></table>
<div class="callout project"><strong>Dans 3D Reader</strong> : le cahier des charges du moteur navigateur dit littéralement « The Python engine is the REFERENCE. The JS engine must reproduce its results. » — jusqu'aux textes des notes, identiques en anglais.</div>`,
        en: `<h3>The danger: native code that crashes</h3>
<p>OpenCascade is compiled C++. Faced with some malformed files (a truncated IGES, for instance), it can <strong>crash outright</strong> (<em>segmentation fault</em>) or <strong>loop forever</strong>. A C++ crash does not raise a Python exception you could catch: it kills <em>the whole process</em>. If that process is the web server, every user loses the connection.</p>
<h3>The defence: one child process per analysis</h3>
~~~py title="reader3d/isolate.py"
"""Run an analysis in a child process.

OpenCascade is native code: some malformed files (for instance truncated IGES)
crash it with a segmentation fault, and others make it loop forever. Running
each analysis of the web server in its own process turns both cases into a
normal error instead of taking the whole server down. The child can also be
stopped at any time (the client went away), and its memory is bounded.
"""
~~~
<p>A <span class="term" data-term="programme">process</span> is a running program, with <strong>its own memory</strong>. If the child crashes, the parent (the server) simply sees it disappear and answers with a clean error (422).</p>
~~~py title="reader3d/isolate.py (simplified)"
receiver, sender = _CTX.Pipe(duplex=False)            #«1»
proc = _CTX.Process(target=_run, args=(sender, str(path), unit, quality, include_mesh, memory), daemon=True)
proc.start()                                          #«2»
deadline = time.monotonic() + timeout
while not receiver.poll(POLL_S):                      #«3»
    if cancel is not None and cancel.is_set():
        raise AnalysisCancelled("The analysis was cancelled")
    if time.monotonic() >= deadline:
        raise AnalysisCrashed(f"The analysis did not finish within {timeout:.0f} s")
try:
    status, payload = receiver.recv()                 #«4»
except EOFError:
    status, payload = "crashed", None                 #«5»
~~~
<ol class="notes">
<li>A <strong>pipe</strong>: the child writes its result at one end, the parent reads at the other.</li>
<li>Starting the child, which runs <code>_run(...)</code> → <code>analyze_file(...)</code>.</li>
<li>Every 0.5 s, the parent checks: did the user cancel? is the deadline (600 s) passed?</li>
<li>The result arrives through the pipe.</li>
<li>End of file without a message = the child died on the way: a crash.</li>
</ol>
<h3>Custom exceptions</h3>
~~~py
class AnalysisCrashed(RuntimeError): ...
class AnalysisCancelled(AnalysisCrashed): ...
~~~
<p>The server turns them into HTTP responses: <code>AnalysisCrashed</code> → 422 "Could not read the file", <code>AnalysisCancelled</code> → 499.</p>
<div class="callout info"><strong>forkserver</strong> (Linux/macOS) starts each child from a process that has <em>already</em> imported OpenCascade: isolation costs only a few milliseconds. On Windows, <code>spawn</code> is used (a full start).</div>
<h3>The same principle in the browser</h3>
<p>The JavaScript engine applies the same idea with a <strong>Web Worker</strong>: the analysis runs apart from the page. If OpenCascade (WebAssembly) crashes, <code>worker.js</code> reports a <code>fatal</code> error, and <code>client.js</code> drops the Worker and creates a new one.</p>
<table><thead><tr><th></th><th>Python engine</th><th>Browser engine</th></tr></thead><tbody>
<tr><td>Files</td><td><code>reader3d/*.py</code></td><td><code>web/engine/*.js</code></td></tr>
<tr><td>OpenCascade via</td><td>OCP (native)</td><td>opencascade.js (WebAssembly)</td></tr>
<tr><td>Meshes via</td><td>trimesh</td><td>JS readers + three.js</td></tr>
<tr><td>Isolation</td><td>child process</td><td>Web Worker</td></tr>
<tr><td>Role</td><td><strong>reference</strong></td><td>must reproduce the reference</td></tr>
<tr><td>Runs on</td><td>a server (your PC)</td><td>the visitor's browser (GitHub Pages)</td></tr>
</tbody></table>
<div class="callout project"><strong>In 3D Reader</strong>: the browser engine's specification literally says "The Python engine is the REFERENCE. The JS engine must reproduce its results." — down to the note texts, identical in English.</div>`,
      },
      deep: {
        fr: `<h3>Les processus isolés, version cabine d'essai</h3>
<div class="callout analogy">
<p>Tu dois tester une coulée avec un alliage douteux qui risque d'exploser. Tu ne le fais pas au milieu de l'atelier : tu utilises une <strong>cabine d'essai blindée</strong>. Si ça explose, seule la cabine est perdue ; l'atelier continue de tourner, et tu notes « essai raté ».</p>
<ul>
<li>L'atelier = le <strong>processus parent</strong> (le serveur web).</li>
<li>La cabine = le <strong>processus enfant</strong>, une par fichier analysé.</li>
<li>Le passe-plat entre les deux = le <strong>tuyau</strong> (<em>pipe</em>) qui ramène le résultat.</li>
<li>Le chronomètre = le délai de 600 s : au-delà, on arrête l'essai.</li>
<li>Le bouton d'arrêt d'urgence = l'événement <code>cancel</code> (l'utilisateur a fermé l'onglet).</li>
</ul>
</div>
<h4>Les quatre issues possibles d'une analyse</h4>
<table><thead><tr><th>Ce qui se passe dans la cabine</th><th>Ce que voit le serveur</th><th>Réponse</th></tr></thead><tbody>
<tr><td>Calcul réussi</td><td><code>("ok", résultat)</code> dans le tuyau</td><td>200 + JSON</td></tr>
<tr><td>Fichier illisible (erreur Python)</td><td><code>("value_error", message)</code></td><td>422</td></tr>
<tr><td>Plantage C++</td><td>tuyau fermé sans message (<code>EOFError</code>)</td><td>422 « Could not read the file »</td></tr>
<tr><td>Boucle infinie</td><td>le délai expire</td><td>422 « did not finish within 600 s »</td></tr>
</tbody></table>
<h4>Pourquoi deux moteurs qui font la même chose ?</h4>
<ol>
<li>Le moteur <strong>Python</strong> est né le premier, il est éprouvé : c'est l'<em>étalon</em>.</li>
<li>Le moteur <strong>navigateur</strong> permet la version en ligne (GitHub Pages, sans serveur).</li>
<li>Les tests comparent les deux sur les mêmes fichiers. Si le JS s'écarte de l'étalon, la CI devient rouge.</li>
</ol>
<div class="callout tip">Retenir : <strong>isoler</strong> ce qui peut planter (processus enfant côté Python, Web Worker côté navigateur), et <strong>comparer</strong> à une référence ce qu'on réécrit.</div>`,
        en: `<h3>Isolated processes, test-booth version</h3>
<div class="callout analogy">
<p>You must test a pour with a dubious alloy that might explode. You do not do it in the middle of the shop: you use an <strong>armoured test booth</strong>. If it blows, only the booth is lost; the shop keeps running, and you write down "test failed".</p>
<ul>
<li>The shop = the <strong>parent process</strong> (the web server).</li>
<li>The booth = the <strong>child process</strong>, one per file analysed.</li>
<li>The hatch between them = the <strong>pipe</strong> that brings the result back.</li>
<li>The stopwatch = the 600 s deadline: beyond it, the test is stopped.</li>
<li>The emergency-stop button = the <code>cancel</code> event (the user closed the tab).</li>
</ul>
</div>
<h4>The four possible outcomes of an analysis</h4>
<table><thead><tr><th>What happens in the booth</th><th>What the server sees</th><th>Response</th></tr></thead><tbody>
<tr><td>Computation succeeded</td><td><code>("ok", result)</code> in the pipe</td><td>200 + JSON</td></tr>
<tr><td>Unreadable file (Python error)</td><td><code>("value_error", message)</code></td><td>422</td></tr>
<tr><td>C++ crash</td><td>pipe closed without a message (<code>EOFError</code>)</td><td>422 "Could not read the file"</td></tr>
<tr><td>Infinite loop</td><td>the deadline expires</td><td>422 "did not finish within 600 s"</td></tr>
</tbody></table>
<h4>Why two engines doing the same thing?</h4>
<ol>
<li>The <strong>Python</strong> engine came first and is proven: it is the <em>standard</em>.</li>
<li>The <strong>browser</strong> engine enables the online version (GitHub Pages, no server).</li>
<li>Tests compare both on the same files. If JS drifts from the standard, CI turns red.</li>
</ol>
<div class="callout tip">Remember: <strong>isolate</strong> what can crash (child process on the Python side, Web Worker in the browser), and <strong>compare</strong> what you rewrite against a reference.</div>`,
      },
    },
  ],
  questions: [
    // ---------------- python-1
    {
      id: 'python-q1', skill: 'python.packages', lesson: 'python-1', level: 1, type: 'mcq',
      prompt: { fr: 'Quel fichier fait d\'un dossier un <strong>paquet</strong> Python ?', en: 'Which file makes a folder a Python <strong>package</strong>?' },
      choices: { fr: ['<code>main.py</code>', '<code>__init__.py</code>', '<code>package.json</code>', '<code>setup.cfg</code>'], en: ['<code>main.py</code>', '<code>__init__.py</code>', '<code>package.json</code>', '<code>setup.cfg</code>'] },
      answer: 1,
      explain: { fr: '<code>__init__.py</code> marque le dossier comme paquet importable (<code>import reader3d</code>). <code>package.json</code>, c\'est le monde Node.js.', en: '<code>__init__.py</code> marks the folder as an importable package (<code>import reader3d</code>). <code>package.json</code> belongs to the Node.js world.' },
    },
    {
      id: 'python-q2', skill: 'python.packages', lesson: 'python-1', level: 1, type: 'mcq',
      prompt: { fr: 'Que fait <code>python -m reader3d analyze piece.step</code> ?', en: 'What does <code>python -m reader3d analyze part.step</code> do?' },
      choices: { fr: ['Il installe reader3d', 'Il exécute <code>reader3d/__main__.py</code> avec les arguments analyze et piece.step', 'Il ouvre piece.step dans un éditeur', 'Il lance les tests'], en: ['It installs reader3d', 'It runs <code>reader3d/__main__.py</code> with the arguments analyze and part.step', 'It opens part.step in an editor', 'It runs the tests'] },
      answer: 1,
      explain: { fr: '<code>-m</code> exécute un module ; pour un paquet, c\'est son <code>__main__.py</code>. <code>argparse</code> lit ensuite la commande et le fichier.', en: '<code>-m</code> runs a module; for a package, its <code>__main__.py</code>. <code>argparse</code> then reads the command and the file.' },
    },
    {
      id: 'python-q3', skill: 'python.packages', lesson: 'python-1', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque import à ce qu\'il fait.', en: 'Match each import to what it does.' },
      pairs: {
        fr: [['import json', 'charge tout le module json'], ['from pathlib import Path', 'prend seulement la classe Path'], ['import numpy as np', 'charge numpy sous le surnom np'], ['from .analyze import analyze_file', 'import relatif depuis le même paquet']],
        en: [['import json', 'loads the whole json module'], ['from pathlib import Path', 'takes only the Path class'], ['import numpy as np', 'loads numpy under the nickname np'], ['from .analyze import analyze_file', 'relative import from the same package']],
      },
      explain: { fr: 'Le point initial (<code>.analyze</code>) signifie « dans mon propre paquet ».', en: 'The leading dot (<code>.analyze</code>) means "in my own package".' },
    },
    // ---------------- python-2
    {
      id: 'python-q4', skill: 'python.syntax', lesson: 'python-2', level: 1, type: 'mcq',
      prompt: { fr: 'Qu\'affiche ce code ?', en: 'What does this code print?' },
      code: 'v = 196.37\nprint(f"Volume : {v:.1f} cm3")',
      lang: 'py',
      choices: { fr: ['Volume : {v:.1f} cm3', 'Volume : 196.37 cm3', 'Volume : 196.4 cm3', 'Une erreur'], en: ['Volume : {v:.1f} cm3', 'Volume : 196.37 cm3', 'Volume : 196.4 cm3', 'An error'] },
      answer: 2,
      explain: { fr: 'Le <code>f</code> active les trous <code>{ }</code> ; <code>:.1f</code> arrondit à une décimale : 196.37 → 196.4.', en: 'The <code>f</code> enables the <code>{ }</code> holes; <code>:.1f</code> rounds to one decimal: 196.37 → 196.4.' },
    },
    {
      id: 'python-q5', skill: 'python.syntax', lesson: 'python-2', level: 2, type: 'tf',
      prompt: { fr: 'Avec l\'annotation <code>volume: float | None</code>, Python refusera à l\'exécution de ranger un texte dans <code>volume</code>.', en: 'With the annotation <code>volume: float | None</code>, Python will refuse at run time to store text in <code>volume</code>.' },
      answer: false,
      explain: { fr: 'Les annotations ne sont pas vérifiées à l\'exécution : ce sont des indications pour les humains et les outils (éditeur, vérificateurs de types).', en: 'Annotations are not checked at run time: they are hints for humans and tools (editor, type checkers).' },
    },
    {
      id: 'python-q6', skill: 'python.syntax', lesson: 'python-2', level: 2, type: 'fill',
      prompt: { fr: 'Complète la compréhension qui garde le volume des corps fermés.', en: 'Fill in the comprehension that keeps the volume of closed bodies.' },
      code: 'volumes = [b.volume ____ b in bodies if b.closed]',
      lang: 'py',
      accept: ['for'],
      explain: { fr: 'Structure : <code>[expression for élément in collection if condition]</code>.', en: 'Structure: <code>[expression for item in collection if condition]</code>.' },
    },
    // ---------------- python-3
    {
      id: 'python-q7', skill: 'python.fastapi', lesson: 'python-3', level: 1, type: 'mcq',
      prompt: { fr: 'Que signifie <code>@app.post("/api/analyze")</code> au-dessus d\'une fonction ?', en: 'What does <code>@app.post("/api/analyze")</code> above a function mean?' },
      choices: { fr: ['La fonction envoie un e-mail', 'La fonction répond aux requêtes POST sur le chemin /api/analyze', 'La fonction est exécutée au démarrage', 'La fonction poste un message sur GitHub'], en: ['The function sends an email', 'The function answers POST requests on the /api/analyze path', 'The function runs at start-up', 'The function posts a message on GitHub'] },
      answer: 1,
      explain: { fr: 'Le décorateur de route relie une méthode HTTP (POST) et un chemin à la fonction Python.', en: 'The route decorator binds an HTTP method (POST) and a path to the Python function.' },
    },
    {
      id: 'python-q8', skill: 'python.fastapi', lesson: 'python-3', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque code HTTP renvoyé par <code>server.py</code> à sa situation.', en: 'Match each HTTP code returned by <code>server.py</code> to its situation.' },
      pairs: {
        fr: [['200', 'Analyse réussie, résultat JSON'], ['400', 'Extension de fichier non prise en charge'], ['413', 'Fichier trop gros'], ['422', 'Fichier illisible ou plantage d\'OpenCascade']],
        en: [['200', 'Analysis succeeded, JSON result'], ['400', 'Unsupported file extension'], ['413', 'File too large'], ['422', 'Unreadable file or OpenCascade crash']],
      },
      explain: { fr: 'Les codes 4xx signalent un problème lié à la requête ; 200 = tout va bien.', en: '4xx codes signal a problem with the request; 200 = all good.' },
    },
    {
      id: 'python-q9', skill: 'python.fastapi', lesson: 'python-3', level: 2, type: 'mcq',
      prompt: { fr: 'Quel est le rôle d\'<strong>uvicorn</strong> ?', en: 'What is the role of <strong>uvicorn</strong>?' },
      choices: { fr: ['Calculer les volumes', 'Écouter le réseau et transmettre les requêtes à l\'application FastAPI', 'Installer les paquets', 'Afficher la 3D'], en: ['Compute volumes', 'Listen on the network and pass requests to the FastAPI application', 'Install packages', 'Display the 3D'] },
      answer: 1,
      explain: { fr: 'FastAPI décrit les routes, uvicorn est le serveur qui les fait vivre : <code>uvicorn.run("reader3d.server:app", ...)</code>.', en: 'FastAPI describes the routes, uvicorn is the server that brings them to life: <code>uvicorn.run("reader3d.server:app", ...)</code>.' },
    },
    // ---------------- python-4
    {
      id: 'python-q10', skill: 'python.env', lesson: 'python-4', level: 1, type: 'order',
      prompt: { fr: 'Remets dans l\'ordre l\'installation du moteur Python sur un PC neuf.', en: 'Put in order the installation of the Python engine on a fresh PC.' },
      items: {
        fr: ['git clone du dépôt', 'python -m venv .venv', 'Activer l\'environnement', 'pip install -r requirements.txt', 'python -m reader3d serve'],
        en: ['git clone the repository', 'python -m venv .venv', 'Activate the environment', 'pip install -r requirements.txt', 'python -m reader3d serve'],
      },
      explain: { fr: 'Récupérer le code → créer la cellule → y entrer → l\'approvisionner → lancer.', en: 'Get the code → build the cell → step in → stock it → run.' },
    },
    {
      id: 'python-q11', skill: 'python.env', lesson: 'python-4', level: 1, type: 'tf',
      prompt: { fr: 'Le dossier <code>.venv/</code> doit être committé pour que les collègues aient les mêmes paquets.', en: 'The <code>.venv/</code> folder should be committed so colleagues get the same packages.' },
      answer: false,
      explain: { fr: 'On committe la <em>liste</em> (<code>requirements.txt</code>, <code>pyproject.toml</code>). Le venv est lourd et propre à chaque machine : il est dans <code>.gitignore</code>.', en: 'We commit the <em>list</em> (<code>requirements.txt</code>, <code>pyproject.toml</code>). The venv is heavy and machine-specific: it is in <code>.gitignore</code>.' },
    },
    {
      id: 'python-q12', skill: 'python.env', lesson: 'python-4', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque dépendance à son rôle.', en: 'Match each dependency to its role.' },
      pairs: {
        fr: [['cadquery-ocp', 'OpenCascade : STEP, volume exact'], ['numpy', 'calcul sur de grands tableaux de nombres'], ['trimesh', 'lecture des maillages STL, OBJ…'], ['fastapi', 'les routes du serveur web']],
        en: [['cadquery-ocp', 'OpenCascade: STEP, exact volume'], ['numpy', 'computing on large arrays of numbers'], ['trimesh', 'reading STL, OBJ… meshes'], ['fastapi', 'the web server routes']],
      },
      explain: { fr: 'Chaque paquet tiers apporte une brique ; <code>requirements.txt</code> les liste toutes.', en: 'Each third-party package brings a brick; <code>requirements.txt</code> lists them all.' },
    },
    // ---------------- python-5
    {
      id: 'python-q13', skill: 'python.tests', lesson: 'python-5', level: 1, type: 'mcq',
      prompt: { fr: 'Quel fichier pytest découvrira-t-il automatiquement comme fichier de tests ?', en: 'Which file will pytest automatically discover as a test file?' },
      choices: { fr: ['<code>volume_check.py</code>', '<code>test_volume.py</code>', '<code>volume.test</code>', '<code>tests.json</code>'], en: ['<code>volume_check.py</code>', '<code>test_volume.py</code>', '<code>volume.test</code>', '<code>tests.json</code>'] },
      answer: 1,
      explain: { fr: 'Convention : fichiers <code>test_*.py</code>, fonctions <code>test_*</code>.', en: 'Convention: <code>test_*.py</code> files, <code>test_*</code> functions.' },
    },
    {
      id: 'python-q14', skill: 'python.tests', lesson: 'python-5', level: 2, type: 'mcq',
      prompt: { fr: 'Pourquoi utiliser <code>math.isclose(a, b, rel_tol=1e-6)</code> plutôt que <code>a == b</code> pour un volume ?', en: 'Why use <code>math.isclose(a, b, rel_tol=1e-6)</code> rather than <code>a == b</code> for a volume?' },
      choices: { fr: ['C\'est plus rapide', 'Les nombres à virgule ont de petites erreurs d\'arrondi binaire', 'Parce que == n\'existe pas en Python', 'Pour comparer des textes'], en: ['It is faster', 'Decimal numbers carry tiny binary rounding errors', 'Because == does not exist in Python', 'To compare texts'] },
      answer: 1,
      explain: { fr: '<code>0.1 + 0.2 != 0.3</code> en binaire. Il faut une tolérance, comme sur une cote.', en: '<code>0.1 + 0.2 != 0.3</code> in binary. You need a tolerance, like on a dimension.' },
    },
    {
      id: 'python-q15', skill: 'python.tests', lesson: 'python-5', level: 2, type: 'tf',
      prompt: { fr: 'Une fixture définie dans <code>conftest.py</code> est disponible pour les tests du dossier sans qu\'ils l\'importent.', en: 'A fixture defined in <code>conftest.py</code> is available to the folder\'s tests without them importing it.' },
      answer: true,
      explain: { fr: 'pytest lit <code>conftest.py</code> tout seul. Un test demande une fixture simplement en la nommant en paramètre (ou <code>autouse=True</code> l\'applique à tous).', en: 'pytest reads <code>conftest.py</code> by itself. A test asks for a fixture simply by naming it as a parameter (or <code>autouse=True</code> applies it to all).' },
    },
    // ---------------- python-6
    {
      id: 'python-q16', skill: 'python.process', lesson: 'python-6', level: 1, type: 'mcq',
      prompt: { fr: 'Pourquoi le serveur lance-t-il chaque analyse dans un processus enfant ?', en: 'Why does the server run each analysis in a child process?' },
      choices: { fr: ['Pour aller plus vite', 'Pour qu\'un plantage d\'OpenCascade ne fasse pas tomber tout le serveur', 'Pour économiser de la mémoire', 'Parce que FastAPI l\'exige'], en: ['To go faster', 'So that an OpenCascade crash does not bring down the whole server', 'To save memory', 'Because FastAPI requires it'] },
      answer: 1,
      explain: { fr: 'Un plantage C++ tue le processus. Dans l\'enfant, seul l\'enfant meurt ; le serveur répond une erreur propre.', en: 'A C++ crash kills the process. In the child, only the child dies; the server answers a clean error.' },
    },
    {
      id: 'python-q17', skill: 'python.process', lesson: 'python-6', level: 2, type: 'match',
      prompt: { fr: 'Associe chaque situation à ce que voit le parent.', en: 'Match each situation to what the parent sees.' },
      pairs: {
        fr: [['Analyse réussie', '("ok", résultat) dans le tuyau'], ['Plantage C++', 'tuyau fermé sans message (EOFError)'], ['Boucle infinie', 'délai de 600 s dépassé'], ['Onglet fermé', 'l\'événement cancel est levé']],
        en: [['Analysis succeeded', '("ok", result) in the pipe'], ['C++ crash', 'pipe closed without a message (EOFError)'], ['Infinite loop', '600 s deadline passed'], ['Tab closed', 'the cancel event is set']],
      },
      explain: { fr: 'Le parent ne fait que surveiller le tuyau, l\'horloge et le bouton d\'annulation.', en: 'The parent only watches the pipe, the clock and the cancel button.' },
    },
    {
      id: 'python-q18', skill: 'python.process', lesson: 'python-6', level: 2, type: 'mcq',
      prompt: { fr: 'Dans le navigateur, quel est l\'équivalent du processus enfant ?', en: 'In the browser, what is the equivalent of the child process?' },
      choices: { fr: ['Un cookie', 'Un Web Worker', 'Le localStorage', 'Un onglet de plus'], en: ['A cookie', 'A Web Worker', 'localStorage', 'One more tab'] },
      answer: 1,
      explain: { fr: '<code>worker.js</code> fait tourner OpenCascade à part de la page ; en cas d\'erreur <code>fatal</code>, <code>client.js</code> recrée un Worker neuf.', en: '<code>worker.js</code> runs OpenCascade apart from the page; on a <code>fatal</code> error, <code>client.js</code> creates a fresh Worker.' },
    },
    // ---------------- extra
    {
      id: 'python-q19', skill: 'python.packages', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un module Python est simplement un fichier <code>.py</code>.', en: 'A Python module is simply a <code>.py</code> file.' },
      answer: true,
      explain: { fr: '<code>reader3d/cad.py</code> = module <code>reader3d.cad</code>.', en: '<code>reader3d/cad.py</code> = module <code>reader3d.cad</code>.' },
    },
    {
      id: 'python-q20', skill: 'python.packages', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Tu lances <code>python -m reader3d serve</code> et tu obtiens <code>ModuleNotFoundError: No module named \'trimesh\'</code>. Cause la plus probable ?', en: 'You run <code>python -m reader3d serve</code> and get <code>ModuleNotFoundError: No module named \'trimesh\'</code>. Most likely cause?' },
      choices: { fr: ['Le fichier STEP est corrompu', 'Les dépendances ne sont pas installées dans l\'environnement actif', 'trimesh est un fichier du dépôt supprimé', 'Le port 8000 est occupé'], en: ['The STEP file is corrupt', 'The dependencies are not installed in the active environment', 'trimesh is a deleted repository file', 'Port 8000 is busy'] },
      answer: 1,
      explain: { fr: 'trimesh est un paquet tiers : active le venv et lance <code>pip install -r requirements.txt</code>.', en: 'trimesh is a third-party package: activate the venv and run <code>pip install -r requirements.txt</code>.' },
    },
    {
      id: 'python-q21', skill: 'python.packages', extra: true, level: 3, type: 'line',
      prompt: { fr: 'Clique sur la ligne qui fait un import <strong>relatif</strong>.', en: 'Click the line that does a <strong>relative</strong> import.' },
      code: 'import os\nimport tempfile\nfrom pathlib import Path\nfrom fastapi import FastAPI\nfrom .analyze import SUPPORTED_EXTENSIONS',
      lang: 'py',
      answer: 4,
      explain: { fr: 'Le point devant <code>analyze</code> veut dire « module du même paquet que moi ».', en: 'The dot before <code>analyze</code> means "module of the same package as me".' },
    },
    {
      id: 'python-q22', skill: 'python.syntax', extra: true, level: 1, type: 'line',
      prompt: { fr: 'Clique sur la première ligne qui est <strong>en dehors</strong> du <code>if</code>.', en: 'Click the first line that is <strong>outside</strong> the <code>if</code>.' },
      code: 'volume = props.Mass()\nif volume < 0:\n    notes.append("sign corrected")\n    volume = -volume\ncom = props.CentreOfMass()',
      lang: 'py',
      answer: 4,
      explain: { fr: 'La dernière ligne revient à gauche : elle n\'est plus dans le bloc du <code>if</code> et s\'exécute toujours.', en: 'The last line goes back to the left: it is no longer in the <code>if</code> block and always runs.' },
    },
    {
      id: 'python-q23', skill: 'python.syntax', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que garantit <code>with target.open("wb") as out:</code> ?', en: 'What does <code>with target.open("wb") as out:</code> guarantee?' },
      choices: { fr: ['Le fichier est chiffré', 'Le fichier est refermé à la fin du bloc, même en cas d\'erreur', 'Le fichier est envoyé au serveur', 'Le fichier est en lecture seule'], en: ['The file is encrypted', 'The file is closed at the end of the block, even after an error', 'The file is sent to the server', 'The file is read-only'] },
      answer: 1,
      explain: { fr: '<code>with</code> = gestionnaire de contexte : il exécute toujours la fermeture. <code>"wb"</code> = écriture binaire.', en: '<code>with</code> = context manager: it always runs the closing step. <code>"wb"</code> = write binary.' },
    },
    {
      id: 'python-q24', skill: 'python.syntax', extra: true, level: 3, type: 'multi',
      prompt: { fr: 'Que fait <code>@dataclass</code> sur la classe <code>Body</code> ?', en: 'What does <code>@dataclass</code> do on the <code>Body</code> class?' },
      choices: { fr: ['Génère automatiquement le constructeur <code>__init__</code>', 'Génère un affichage lisible (<code>__repr__</code>)', 'Vérifie les types à l\'exécution', 'Permet la comparaison <code>==</code> champ par champ'], en: ['Generates the <code>__init__</code> constructor automatically', 'Generates a readable display (<code>__repr__</code>)', 'Checks types at run time', 'Enables field-by-field <code>==</code> comparison'] },
      answer: [0, 1, 3],
      explain: { fr: 'dataclass écrit pour toi <code>__init__</code>, <code>__repr__</code> et <code>__eq__</code> d\'après les champs annotés. Elle ne vérifie pas les types.', en: 'dataclass writes <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you from the annotated fields. It does not check types.' },
    },
    {
      id: 'python-q25', skill: 'python.fastapi', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Une fonction FastAPI qui renvoie un dictionnaire Python envoie du JSON au navigateur.', en: 'A FastAPI function returning a Python dictionary sends JSON to the browser.' },
      answer: true,
      explain: { fr: 'FastAPI sérialise automatiquement le dictionnaire en JSON.', en: 'FastAPI automatically serialises the dictionary to JSON.' },
    },
    {
      id: 'python-q26', skill: 'python.fastapi', extra: true, level: 2, type: 'mcq',
      prompt: { fr: 'Que permet <code>await</code> dans <code>chunk = await file.read(1024 * 1024)</code> ?', en: 'What does <code>await</code> allow in <code>chunk = await file.read(1024 * 1024)</code>?' },
      choices: { fr: ['De lire le fichier deux fois plus vite', 'De mettre la tâche en pause sans bloquer les autres requêtes', 'De compresser le fichier', 'D\'attendre exactement 1 seconde'], en: ['Read the file twice as fast', 'Pause the task without blocking other requests', 'Compress the file', 'Wait exactly 1 second'] },
      answer: 1,
      explain: { fr: 'Comme l\'opérateur qui lance le four et s\'occupe d\'autre chose : le serveur sert d\'autres visiteurs pendant la lecture.', en: 'Like the operator who starts the oven and does something else: the server serves other visitors while reading.' },
    },
    {
      id: 'python-q27', skill: 'python.fastapi', extra: true, level: 3, type: 'fill',
      prompt: { fr: 'Complète pour refuser une extension inconnue avec le code 400.', en: 'Fill in to refuse an unknown extension with code 400.' },
      code: 'if suffix not in SUPPORTED_EXTENSIONS:\n    ____ HTTPException(400, "Unsupported file type")',
      lang: 'py',
      accept: ['raise'],
      explain: { fr: '<code>raise</code> lève l\'exception ; FastAPI la convertit en réponse HTTP 400.', en: '<code>raise</code> throws the exception; FastAPI turns it into an HTTP 400 response.' },
    },
    {
      id: 'python-q28', skill: 'python.env', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Ton invite de commande affiche <code>(.venv)</code> au début. Qu\'est-ce que ça signifie ?', en: 'Your prompt shows <code>(.venv)</code> at the start. What does that mean?' },
      choices: { fr: ['Une erreur', 'L\'environnement virtuel du projet est activé', 'Tu es administrateur', 'Git est en cours'], en: ['An error', 'The project\'s virtual environment is activated', 'You are administrator', 'Git is running'] },
      answer: 1,
      explain: { fr: '<code>python</code> et <code>pip</code> désignent maintenant ceux de <code>.venv</code>.', en: '<code>python</code> and <code>pip</code> now mean those of <code>.venv</code>.' },
    },
    {
      id: 'python-q29', skill: 'python.env', extra: true, level: 2, type: 'fill',
      prompt: { fr: 'Commande pour installer toutes les dépendances listées dans le fichier :', en: 'Command to install every dependency listed in the file:' },
      code: 'pip install ____ requirements.txt',
      lang: 'bash',
      accept: ['-r', '--requirement'],
      explain: { fr: '<code>-r</code> = « lis la liste dans ce fichier ».', en: '<code>-r</code> = "read the list from this file".' },
    },
    {
      id: 'python-q30', skill: 'python.env', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Dans <code>requirements.txt</code>, que signifie <code>numpy&gt;=1.26</code> ?', en: 'In <code>requirements.txt</code>, what does <code>numpy&gt;=1.26</code> mean?' },
      choices: { fr: ['Exactement la version 1.26', 'La version 1.26 ou plus récente', 'Une version plus ancienne que 1.26', 'Au moins 1,26 Mo'], en: ['Exactly version 1.26', 'Version 1.26 or newer', 'A version older than 1.26', 'At least 1.26 MB'] },
      answer: 1,
      explain: { fr: '<code>&gt;=</code> fixe un minimum. <code>==1.26</code> figerait une version exacte.', en: '<code>&gt;=</code> sets a minimum. <code>==1.26</code> would pin an exact version.' },
    },
    {
      id: 'python-q31', skill: 'python.tests', extra: true, level: 1, type: 'mcq',
      prompt: { fr: 'Dans la sortie de pytest <code>....F..</code>, que représente <code>F</code> ?', en: 'In pytest output <code>....F..</code>, what does <code>F</code> stand for?' },
      choices: { fr: ['Un test réussi', 'Un test échoué', 'Un fichier', 'Une fixture'], en: ['A passing test', 'A failed test', 'A file', 'A fixture'] },
      answer: 1,
      explain: { fr: '<code>.</code> = réussi, <code>F</code> = échec d\'un <code>assert</code>, <code>E</code> = erreur pendant la préparation.', en: '<code>.</code> = passed, <code>F</code> = failed <code>assert</code>, <code>E</code> = error during set-up.' },
    },
    {
      id: 'python-q32', skill: 'python.tests', extra: true, level: 2, type: 'match',
      prompt: { fr: 'Associe chaque commande pytest à son effet.', en: 'Match each pytest command to its effect.' },
      pairs: {
        fr: [['pytest', 'lance tous les tests'], ['pytest tests/test_server.py', 'lance un seul fichier'], ['pytest -k sphere', 'lance les tests dont le nom contient sphere'], ['pytest -x', 's\'arrête au premier échec']],
        en: [['pytest', 'runs every test'], ['pytest tests/test_server.py', 'runs a single file'], ['pytest -k sphere', 'runs tests whose name contains sphere'], ['pytest -x', 'stops at the first failure']],
      },
      explain: { fr: 'Ces options servent à cibler vite un test qui échoue.', en: 'These options help you quickly target a failing test.' },
    },
    {
      id: 'python-q33', skill: 'python.tests', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Dans 3D Reader, à quoi servent les résultats générés par <code>tests/make_fixtures.py</code> ?', en: 'In 3D Reader, what are the results generated by <code>tests/make_fixtures.py</code> used for?' },
      choices: { fr: ['À remplir le chiffrage', 'De référence : le moteur JavaScript doit retrouver les mêmes valeurs', 'À publier le site', 'À entraîner l\'IA'], en: ['To fill in the costing', 'As a reference: the JavaScript engine must find the same values', 'To publish the site', 'To train the AI'] },
      answer: 1,
      explain: { fr: 'Python calcule <code>expected.json</code>, puis <code>npm test</code> compare les résultats du moteur JS à cette référence.', en: 'Python computes <code>expected.json</code>, then <code>npm test</code> compares the JS engine\'s results with that reference.' },
    },
    {
      id: 'python-q34', skill: 'python.process', extra: true, level: 1, type: 'tf',
      prompt: { fr: 'Un plantage « segmentation fault » dans OpenCascade peut être rattrapé par un simple <code>try/except</code> Python dans le même processus.', en: 'A "segmentation fault" crash in OpenCascade can be caught by a simple Python <code>try/except</code> in the same process.' },
      answer: false,
      explain: { fr: 'Un plantage natif tue le processus entier, <code>except</code> compris. D\'où l\'isolement dans un processus enfant.', en: 'A native crash kills the whole process, <code>except</code> included. Hence isolation in a child process.' },
    },
    {
      id: 'python-q35', skill: 'python.process', extra: true, level: 2, type: 'order',
      prompt: { fr: 'Remets dans l\'ordre le déroulé de <code>analyze_isolated</code>.', en: 'Put the steps of <code>analyze_isolated</code> in order.' },
      items: {
        fr: ['Créer un tuyau (Pipe)', 'Démarrer le processus enfant', 'Surveiller annulation et délai toutes les 0,5 s', 'Lire le résultat dans le tuyau', 'Transformer un éventuel plantage en erreur propre'],
        en: ['Create a pipe', 'Start the child process', 'Watch cancel and deadline every 0.5 s', 'Read the result from the pipe', 'Turn any crash into a clean error'],
      },
      explain: { fr: 'Le parent prépare le passe-plat, lance la cabine, surveille, récupère, puis interprète.', en: 'The parent prepares the hatch, starts the booth, watches, collects, then interprets.' },
    },
    {
      id: 'python-q36', skill: 'python.process', extra: true, level: 3, type: 'mcq',
      prompt: { fr: 'Pourquoi <code>isolate.py</code> utilise-t-il <code>forkserver</code> sous Linux ?', en: 'Why does <code>isolate.py</code> use <code>forkserver</code> on Linux?' },
      choices: { fr: ['Pour fonctionner sous Windows', 'Pour démarrer chaque enfant depuis un processus qui a déjà importé OpenCascade : quelques millisecondes au lieu d\'un démarrage complet', 'Pour partager la mémoire entre analyses', 'Pour envoyer les résultats par e-mail'], en: ['To work on Windows', 'To start each child from a process that already imported OpenCascade: a few milliseconds instead of a full start', 'To share memory between analyses', 'To email the results'] },
      answer: 1,
      explain: { fr: 'Importer OpenCascade est long. forkserver le fait une fois ; chaque enfant en hérite. Windows, lui, utilise <code>spawn</code>.', en: 'Importing OpenCascade is slow. forkserver does it once; each child inherits it. Windows uses <code>spawn</code> instead.' },
    },
    // ---------------- exam
    {
      id: 'python-q37', skill: 'python.packages', level: 2, type: 'mcq',
      prompt: { fr: 'Que déclare <code>reader3d = "reader3d.__main__:main"</code> dans <code>pyproject.toml</code> ?', en: 'What does <code>reader3d = "reader3d.__main__:main"</code> in <code>pyproject.toml</code> declare?' },
      choices: { fr: ['Une dépendance', 'Une commande <code>reader3d</code> qui appelle la fonction <code>main</code>', 'Un test', 'Une variable d\'environnement'], en: ['A dependency', 'A <code>reader3d</code> command that calls the <code>main</code> function', 'A test', 'An environment variable'] },
      answer: 1,
      explain: { fr: 'Section <code>[project.scripts]</code> : une fois installé, <code>reader3d analyze x.step</code> marche directement.', en: '<code>[project.scripts]</code> section: once installed, <code>reader3d analyze x.step</code> works directly.' },
    },
    {
      id: 'python-q38', skill: 'python.syntax', level: 1, type: 'mcq',
      prompt: { fr: 'En Python, qu\'est-ce qui délimite le contenu d\'un <code>if</code> ?', en: 'In Python, what delimits the body of an <code>if</code>?' },
      choices: { fr: ['Les accolades', 'L\'indentation', 'Le point-virgule', 'Le mot <code>end</code>'], en: ['Braces', 'Indentation', 'The semicolon', 'The word <code>end</code>'] },
      answer: 1,
      explain: { fr: 'Le décalage (4 espaces) fait partie de la syntaxe.', en: 'The indent (4 spaces) is part of the syntax.' },
    },
    {
      id: 'python-q39', skill: 'python.syntax', level: 2, type: 'mcq',
      prompt: { fr: 'Que signifie <code>-&gt; list[Body]</code> dans <code>def read_cad(path) -&gt; list[Body]:</code> ?', en: 'What does <code>-&gt; list[Body]</code> mean in <code>def read_cad(path) -&gt; list[Body]:</code>?' },
      choices: { fr: ['La fonction renvoie une liste d\'objets Body', 'La fonction modifie une liste', 'La fonction reçoit une liste', 'Une flèche dans l\'interface'], en: ['The function returns a list of Body objects', 'The function modifies a list', 'The function receives a list', 'An arrow in the UI'] },
      answer: 0,
      explain: { fr: 'La flèche annote le type de retour.', en: 'The arrow annotates the return type.' },
    },
    {
      id: 'python-q40', skill: 'python.fastapi', level: 2, type: 'multi',
      prompt: { fr: 'Quels éléments la route <code>/api/analyze</code> reçoit-elle ?', en: 'Which items does the <code>/api/analyze</code> route receive?' },
      choices: { fr: ['Le fichier (<code>UploadFile</code>)', 'L\'unité (<code>unit</code>)', 'La qualité (<code>quality</code>)', 'La clé API de Groq'], en: ['The file (<code>UploadFile</code>)', 'The unit (<code>unit</code>)', 'The quality (<code>quality</code>)', 'The Groq API key'] },
      answer: [0, 1, 2],
      explain: { fr: 'Un formulaire avec le fichier et deux champs. Aucune clé ne transite par là (les clés restent dans des variables d\'environnement côté serveur).', en: 'A form with the file and two fields. No key goes through here (keys stay in server-side environment variables).' },
    },
    {
      id: 'python-q41', skill: 'python.fastapi', level: 1, type: 'fill',
      prompt: { fr: 'Par défaut, sur quelle adresse locale écoute <code>python -m reader3d serve</code> ? (IP)', en: 'By default, on which local address does <code>python -m reader3d serve</code> listen? (IP)' },
      accept: ['127.0.0.1', 'localhost'],
      explain: { fr: '<code>--host</code> vaut <code>127.0.0.1</code> par défaut (« cette machine »), port 8000.', en: '<code>--host</code> defaults to <code>127.0.0.1</code> ("this machine"), port 8000.' },
    },
    {
      id: 'python-q42', skill: 'python.env', level: 2, type: 'mcq',
      prompt: { fr: 'Quelle commande crée un environnement virtuel dans le dossier <code>.venv</code> ?', en: 'Which command creates a virtual environment in the <code>.venv</code> folder?' },
      choices: { fr: ['<code>pip install venv</code>', '<code>python -m venv .venv</code>', '<code>npm init .venv</code>', '<code>git venv</code>'], en: ['<code>pip install venv</code>', '<code>python -m venv .venv</code>', '<code>npm init .venv</code>', '<code>git venv</code>'] },
      answer: 1,
      explain: { fr: '<code>venv</code> est un module de la bibliothèque standard, lancé avec <code>-m</code>.', en: '<code>venv</code> is a standard library module, run with <code>-m</code>.' },
    },
    {
      id: 'python-q43', skill: 'python.tests', level: 2, type: 'mcq',
      prompt: { fr: 'À quoi sert <code>TestClient(app)</code> de FastAPI ?', en: 'What is FastAPI\'s <code>TestClient(app)</code> for?' },
      choices: { fr: ['À envoyer de fausses requêtes au serveur sans le lancer pour de vrai', 'À mesurer la vitesse du réseau', 'À installer FastAPI', 'À tester le navigateur'], en: ['Sending fake requests to the server without really starting it', 'Measuring network speed', 'Installing FastAPI', 'Testing the browser'] },
      answer: 0,
      explain: { fr: 'Les tests du serveur (<code>tests/test_server.py</code>) appellent les routes directement, sans uvicorn ni réseau.', en: 'The server tests (<code>tests/test_server.py</code>) call the routes directly, without uvicorn or network.' },
    },
    {
      id: 'python-q44', skill: 'python.process', level: 2, type: 'tf',
      prompt: { fr: 'Dans 3D Reader, le moteur Python est la référence que le moteur JavaScript doit reproduire.', en: 'In 3D Reader, the Python engine is the reference the JavaScript engine must reproduce.' },
      answer: true,
      explain: { fr: 'C\'est écrit noir sur blanc dans la spécification du moteur navigateur, et vérifié par les tests croisés.', en: 'It is written in black and white in the browser engine specification, and checked by the cross-engine tests.' },
    },
    {
      id: 'python-q45', skill: 'python.process', level: 3, type: 'mcq',
      prompt: { fr: 'L\'utilisateur ferme l\'onglet pendant une analyse serveur. Que renvoie <code>server.py</code> ?', en: 'The user closes the tab during a server analysis. What does <code>server.py</code> return?' },
      choices: { fr: ['200', '400', '499 « The client closed the connection »', 'Rien, l\'analyse continue jusqu\'au bout'], en: ['200', '400', '499 "The client closed the connection"', 'Nothing, the analysis runs to the end'] },
      answer: 2,
      explain: { fr: 'L\'événement <code>cancel</code> tue l\'enfant et lève <code>AnalysisCancelled</code>, transformé en 499 (personne ne lira la réponse, mais le calcul est arrêté).', en: 'The <code>cancel</code> event kills the child and raises <code>AnalysisCancelled</code>, turned into 499 (nobody will read the answer, but the computation is stopped).' },
    },
    {
      id: 'python-q46', skill: 'python.packages', level: 1, type: 'tf',
      prompt: { fr: 'Le texte entre <code>"""…"""</code> juste sous une ligne <code>def</code> est une docstring qui documente la fonction.', en: 'Text between <code>"""…"""</code> right under a <code>def</code> line is a docstring documenting the function.' },
      answer: true,
      explain: { fr: 'Les docstrings sont la documentation officielle, lisible avec <code>help(fonction)</code>.', en: 'Docstrings are the official documentation, readable with <code>help(function)</code>.' },
    },
  ],
};
