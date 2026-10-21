// Points the data-term ids used in the lessons at the ids of glossary.js.
//   node formation/tools/remap-terms.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const MAP = {
  webassembly: 'wasm', worker: 'web-worker', repository: 'repo', depot: 'repo', serveur: 'client-serveur', server: 'client-serveur',
  client: 'client-serveur', object: 'objet', function: 'fonction', array: 'tableau', interpreter: 'interpreteur',
  'github-pages': 'pages', 'environment-variable': 'env-var', 'es-module': 'module', engine: 'moteur', exception: 'exception',
  compilation: 'compiler', compiler: 'compiler', pointeur: 'pointer', reference: 'reference', classe: 'class', decorateur: 'decorator',
  decorator: 'decorator', package: 'package-python', paquet: 'package-python', 'type-hint': 'type', process: 'processus', test: 'test-unitaire',
};
for (const f of readdirSync(dir).filter((x) => x.endsWith('.js') && !['index.js', 'glossary.js'].includes(x))) {
  const p = join(dir, f);
  const s = readFileSync(p, 'utf8');
  const out = s.replace(/data-term="([^"]+)"/g, (all, id) => (MAP[id] && MAP[id] !== id ? `data-term="${MAP[id]}"` : all));
  if (out !== s) writeFileSync(p, out);
}
