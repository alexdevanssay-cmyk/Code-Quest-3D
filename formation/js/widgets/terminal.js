// Simulated terminal (cmd, PowerShell or bash) on a fake copy of the 3D Reader
// repository. Nothing runs on the learner's machine: every command is imitated
// here, with the output the real tools print (in English, as they do), so the
// learner can try without fear of breaking anything.

import { escapeHtml } from '../render.js';

// ------------------------------------------------------------------ fake files

const FILES = {
  'README.md': '# 3D Reader\n\nA web application that opens 3D files (STEP and most other 3D formats), shows them\nin the browser, and computes the **real volume of material** of each part.\n\nOnline version: https://alexdevanssay-cmyk.github.io/3D-reader/',
  'package.json': '{\n  "name": "3d-reader-web",\n  "private": true,\n  "version": "0.2.0",\n  "type": "module",\n  "scripts": {\n    "vendor": "node scripts/build-web.mjs --vendor-only",\n    "build": "node scripts/build-web.mjs",\n    "serve": "node scripts/serve.mjs",\n    "test": "node --test tests/js/*.test.mjs",\n    "test:e2e": "node --test tests/e2e/*.test.mjs"\n  },\n  "devDependencies": {\n    "opencascade.js": "2.0.0-beta.b5ff984",\n    "playwright": "^1.56.1",\n    "three": "0.180.0"\n  }\n}',
  'package-lock.json': '{\n  "name": "3d-reader-web",\n  "lockfileVersion": 3,\n  "...": "exact versions of every dependency"\n}',
  '.gitignore': 'node_modules/\ndist/\n.venv/\n__pycache__/\nweb/vendor/opencascade/\n*.xlsm\n*.xlsx',
  'vercel.json': '{\n  "outputDirectory": "web",\n  "functions": { "api/ai.js": { "maxDuration": 60 } }\n}',
  'requirements.txt': 'cadquery-ocp>=8.0\nfastapi>=0.110\nuvicorn>=0.29\nnumpy>=1.26\ntrimesh>=4.0',
  'hello.js': "console.log('Bonjour depuis Node.js !');",
  'api/ai.js': '// AI gateway of 3D Reader (Vercel Node function)\nexport default async function handler(req, res) { /* … */ }',
  'api/README.md': '# AI gateway\nEnvironment variables: AI_API_KEY, READER3D_ACCESS_CODE …',
  'web/index.html': '<!doctype html>\n<html lang="fr">\n<head><meta charset="utf-8"><title>3D Reader</title></head>\n<body>…</body>\n</html>',
  'web/app.js': "// Page of 3D Reader: viewer, cards, tabs.\nimport * as THREE from 'three';",
  'web/style.css': ':root { --accent: #2f6fde; }',
  'web/i18n.js': '// Interface languages.\nconst STRINGS = { en: { … }, fr: { … } };',
  'web/engine/client.js': '// Main-thread API of the in-browser engine.\nlet worker = null;',
  'web/engine/worker.js': '// Module Web Worker running the heavy computations off the UI thread.',
  'web/engine/occt.js': '// Loading of OpenCascade compiled to WebAssembly.',
  'web/engine/cad.js': '// CAD analysis with OpenCascade (STEP, IGES, BREP).',
  'web/engine/summary.js': '// Totals and overall envelope of a set of bodies.',
  'reader3d/__init__.py': '"""3D Reader: Python engine (reference)."""',
  'reader3d/server.py': '"""FastAPI web server: serves the viewer and the analysis API."""',
  'reader3d/cad.py': '"""Exact (B-rep) reading of CAD files: STEP, IGES and BREP, via OpenCascade."""',
  'tests/js/summary.test.mjs': "import assert from 'node:assert/strict';\nimport { test } from 'node:test';",
  'tests/e2e/site.test.mjs': "// End-to-end tests of the built site in headless Chromium.",
  'tests/test_volume.py': 'def test_cube_volume():\n    assert abs(volume - 1000.0) < 1e-6',
  'scripts/build-web.mjs': '// Builds the static site into dist/.',
  'scripts/serve.mjs': '// Small static file server: http://localhost:8000',
  '.github/workflows/ci.yml': 'name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-24.04',
  '.github/workflows/pages.yml': 'name: Deploy to GitHub Pages',
};

function makeTree() {
  const root = { dir: true, kids: {} };
  const add = (path, content) => {
    const parts = path.split('/');
    let node = root;
    for (const p of parts.slice(0, -1)) node = node.kids[p] ||= { dir: true, kids: {} };
    node.kids[parts.at(-1)] = { dir: false, content };
  };
  add('Documents/notes.txt', 'Penser à relancer la CI.');
  add('Desktop/piece.step', 'ISO-10303-21; …');
  add('hello.js', FILES['hello.js']);
  for (const [p, c] of Object.entries(FILES)) add(`3D-reader/${p}`, c);
  return root;
}

const CMD_HOME = ['C:', 'Users', 'alex'];
const NIX_HOME = ['home', 'alex'];

// ------------------------------------------------------------------ session

export function createSession(shell, { cwd = 'repo' } = {}) {
  const home = shell === 'bash' ? NIX_HOME : CMD_HOME;
  const fs = { dir: true, kids: {} };
  let node = fs;
  for (const p of home) node = node.kids[p] = { dir: true, kids: {} };
  Object.assign(node.kids, makeTree().kids);
  return {
    shell,
    fs,
    home,
    cwd: cwd === 'home' ? [...home] : [...home, '3D-reader'],
    prev: null,
    env: {
      PATH: shell === 'bash' ? '/usr/local/bin:/usr/bin:/bin' : 'C:\\Windows\\system32;C:\\Windows;C:\\Program Files\\nodejs\\;C:\\Program Files\\Git\\cmd;C:\\Python311\\',
      USERNAME: 'alex',
      USER: 'alex',
      HOME: shell === 'bash' ? '/home/alex' : 'C:\\Users\\alex',
      USERPROFILE: 'C:\\Users\\alex',
      OS: shell === 'bash' ? 'Linux' : 'Windows_NT',
      NODE_ENV: 'development',
    },
    git: { cloned: true, branch: 'main', branches: ['main'], upstream: { main: 'origin/main' }, modified: ['web/app.js'], staged: [], commits: [{ sha: '906ebf4', msg: 'Parting card: the undercut as a sentence' }, { sha: '7144ee5', msg: 'Feeding system and casting yield' }, { sha: '03a27c5', msg: 'Merge pull request #34' }], ahead: 0 },
    npmInstalled: false,
    built: false,
    history: [],
  };
}

const sep = (s) => (s.shell === 'bash' ? '/' : '\\');

export function cwdString(s) {
  if (s.shell === 'bash') {
    const p = `/${s.cwd.join('/')}`;
    const h = `/${s.home.join('/')}`;
    return p.startsWith(h) ? `~${p.slice(h.length)}` : p;
  }
  return s.cwd.length === 1 ? `${s.cwd[0]}\\` : s.cwd.join('\\');
}

function fullPath(s, parts = s.cwd) {
  if (s.shell === 'bash') return `/${parts.join('/')}`;
  return parts.length === 1 ? `${parts[0]}\\` : parts.join('\\');
}

export function prompt(s) {
  if (s.shell === 'bash') return `alex@pc:${cwdString(s)}$ `;
  if (s.shell === 'powershell') return `PS ${cwdString(s)}> `;
  return `${cwdString(s)}>`;
}

/** Path parts of a path typed by the learner (relative or absolute), or null. */
function resolve(s, path) {
  if (path == null || path === '') return [...s.cwd];
  let p = path.replace(/^["']|["']$/g, '');
  let parts;
  if (s.shell === 'bash') {
    if (p === '~' || p.startsWith('~/')) p = `/${s.home.join('/')}${p.slice(1)}`;
    parts = p.startsWith('/') ? [] : [...s.cwd];
    p = p.replace(/^\/+/, '');
  } else {
    p = p.replace(/\//g, '\\');
    if (/^[a-z]:/i.test(p)) {
      parts = [p.slice(0, 2).toUpperCase()];
      p = p.slice(2);
    } else if (p.startsWith('~')) {
      parts = [...s.home];
      p = p.slice(1);
    } else parts = p.startsWith('\\') ? [s.cwd[0]] : [...s.cwd];
    p = p.replace(/^\\+/, '');
  }
  for (const seg of p.split(/[\\/]+/)) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      if (parts.length > (s.shell === 'bash' ? 0 : 1)) parts.pop();
    } else parts.push(seg);
  }
  // Real names (case of the fake files) where they exist.
  const real = [];
  let n = s.fs;
  for (const seg of parts) {
    const key = n?.kids && Object.keys(n.kids).find((k) => (s.shell === 'bash' ? k === seg : k.toLowerCase() === seg.toLowerCase()));
    real.push(key || seg);
    n = key ? n.kids[key] : null;
  }
  return real;
}

function get(s, parts) {
  let n = s.fs;
  for (const seg of parts) {
    if (!n?.dir || !n.kids[seg]) return null;
    n = n.kids[seg];
  }
  return n;
}

function inRepo(s) {
  const i = s.cwd.indexOf('3D-reader');
  return i >= 0 && s.cwd.slice(0, i).join('/') === s.home.join('/');
}

// ------------------------------------------------------------------ parsing

export function tokenize(line) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

function expandVars(s, text) {
  if (s.shell === 'cmd') return text.replace(/%(\w+)%/g, (all, k) => findEnv(s, k) ?? all);
  if (s.shell === 'bash') return text.replace(/\$(\w+)|\$\{(\w+)\}/g, (all, a, b) => s.env[a || b] ?? '');
  return text.replace(/\$env:(\w+)/gi, (all, k) => findEnv(s, k) ?? '');
}

function findEnv(s, k) {
  const key = Object.keys(s.env).find((x) => x.toLowerCase() === k.toLowerCase());
  return key ? s.env[key] : undefined;
}

// ------------------------------------------------------------------ commands

const NOT_FOUND = {
  cmd: (c) => `'${c}' is not recognized as an internal or external command,\noperable program or batch file.`,
  powershell: (c) => `${c} : The term '${c}' is not recognized as the name of a cmdlet, function, script file, or operable program.\nCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
  bash: (c) => `bash: ${c}: command not found`,
};

function listing(s, parts, args) {
  const n = get(s, parts);
  if (!n) return { err: s.shell === 'bash' ? `ls: cannot access '${args[0]}': No such file or directory` : s.shell === 'cmd' ? 'File Not Found' : `Get-ChildItem : Cannot find path '${fullPath(s, parts)}' because it does not exist.` };
  if (!n.dir) return { out: parts.at(-1) };
  const all = args.some((a) => /^-(a|la|al|force)$/i.test(a));
  const names = Object.keys(n.kids).filter((k) => all || s.shell === 'cmd' || !k.startsWith('.')).sort((a, b) => a.localeCompare(b));
  if (s.shell === 'bash') {
    if (args.some((a) => /^-\w*l/.test(a))) return { out: names.map((k) => `${n.kids[k].dir ? 'drwxr-xr-x' : '-rw-r--r--'}  alex alex ${String(n.kids[k].dir ? 4096 : (n.kids[k].content || '').length).padStart(5)} Oct 21 09:00 ${k}`).join('\n') };
    return { out: names.map((k) => (n.kids[k].dir ? `${k}/` : k)).join('  ') };
  }
  if (s.shell === 'cmd') {
    const lines = names.map((k) => `21/10/2026  09:00    ${n.kids[k].dir ? '<DIR>         ' : String((n.kids[k].content || '').length).padStart(14)} ${k}`);
    return { out: ` Volume in drive C has no label.\n\n Directory of ${fullPath(s, parts)}\n\n21/10/2026  09:00    <DIR>          .\n21/10/2026  09:00    <DIR>          ..\n${lines.join('\n')}\n               ${names.filter((k) => !n.kids[k].dir).length} File(s)\n               ${names.filter((k) => n.kids[k].dir).length + 2} Dir(s)` };
  }
  const rows = names.map((k) => `${n.kids[k].dir ? 'd----' : '-a---'}        21/10/2026     09:00 ${n.kids[k].dir ? '      ' : String((n.kids[k].content || '').length).padStart(6)} ${k}`);
  return { out: `\n    Directory: ${fullPath(s, parts)}\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n${rows.join('\n')}\n` };
}

function changeDir(s, arg) {
  if (arg == null) {
    if (s.shell === 'cmd') return { out: fullPath(s) };
    if (s.shell === 'bash') arg = '~';
    else return {};
  }
  if (s.shell === 'cmd' && /^\/d$/i.test(arg)) return {};
  if (arg === '-' && s.shell !== 'cmd') {
    if (!s.prev) return s.shell === 'bash' ? { err: 'bash: cd: OLDPWD not set' } : {};
    arg = fullPath(s, s.prev);
  }
  const parts = resolve(s, arg);
  const n = get(s, parts);
  if (!n) {
    return { err: s.shell === 'bash' ? `bash: cd: ${arg}: No such file or directory` : s.shell === 'cmd' ? 'The system cannot find the path specified.' : `Set-Location : Cannot find path '${fullPath(s, parts)}' because it does not exist.` };
  }
  if (!n.dir) return { err: s.shell === 'bash' ? `bash: cd: ${arg}: Not a directory` : 'The directory name is invalid.' };
  s.prev = s.cwd;
  s.cwd = parts;
  return s.shell === 'bash' && arg === fullPath(s, parts) && s.history.at(-1)?.trim() === 'cd -' ? { out: fullPath(s) } : {};
}

function readFile(s, arg, cmd) {
  if (!arg) return { err: s.shell === 'cmd' ? 'The syntax of the command is incorrect.' : `${cmd}: missing file name` };
  const n = get(s, resolve(s, arg));
  if (!n) return { err: s.shell === 'bash' ? `cat: ${arg}: No such file or directory` : s.shell === 'cmd' ? 'The system cannot find the file specified.' : `Get-Content : Cannot find path '${fullPath(s, resolve(s, arg))}' because it does not exist.` };
  if (n.dir) return { err: s.shell === 'bash' ? `cat: ${arg}: Is a directory` : 'Access is denied.' };
  return { out: n.content };
}

function makeDir(s, name) {
  if (!name) return { err: 'missing directory name' };
  const parts = resolve(s, name);
  const parent = get(s, parts.slice(0, -1));
  if (!parent?.dir) return { err: 'The system cannot find the path specified.' };
  if (parent.kids[parts.at(-1)]) return { err: s.shell === 'bash' ? `mkdir: cannot create directory '${name}': File exists` : `A subdirectory or file ${name} already exists.` };
  parent.kids[parts.at(-1)] = { dir: true, kids: {} };
  if (s.shell === 'powershell') return { out: `\n    Directory: ${fullPath(s, parts.slice(0, -1))}\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd----        21/10/2026     09:00                ${parts.at(-1)}\n` };
  return {};
}

function touch(s, name, content = '') {
  const parts = resolve(s, name);
  const parent = get(s, parts.slice(0, -1));
  if (!parent?.dir) return { err: 'No such file or directory' };
  parent.kids[parts.at(-1)] ||= { dir: false, content };
  return {};
}

const WHERE = {
  node: ['C:\\Program Files\\nodejs\\node.exe', '/usr/bin/node'],
  npm: ['C:\\Program Files\\nodejs\\npm.cmd', '/usr/bin/npm'],
  npx: ['C:\\Program Files\\nodejs\\npx.cmd', '/usr/bin/npx'],
  git: ['C:\\Program Files\\Git\\cmd\\git.exe', '/usr/bin/git'],
  python: ['C:\\Python311\\python.exe', '/usr/bin/python'],
  python3: [null, '/usr/bin/python3'],
  pip: ['C:\\Python311\\Scripts\\pip.exe', '/usr/bin/pip'],
  code: ['C:\\Users\\alex\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\\code.cmd', '/usr/bin/code'],
  pytest: ['C:\\Python311\\Scripts\\pytest.exe', '/usr/bin/pytest'],
  claude: ['C:\\Users\\alex\\AppData\\Roaming\\npm\\claude.cmd', '/usr/local/bin/claude'],
};

function git(s, args) {
  const g = s.git;
  const sub = args[0];
  const needRepo = () => (inRepo(s) ? null : { err: 'fatal: not a git repository (or any of the parent directories): .git' });
  switch (sub) {
    case undefined:
    case 'help':
    case '--help':
      return { out: 'usage: git <command> [<args>]\n\n   clone     Clone a repository into a new directory\n   status    Show the working tree status\n   add       Add file contents to the index\n   commit    Record changes to the repository\n   switch    Switch branches\n   branch    List, create, or delete branches\n   log       Show commit logs\n   diff      Show changes\n   pull      Fetch from and integrate with another repository\n   push      Update remote refs along with associated objects' };
    case '--version':
    case 'version':
      return { out: 'git version 2.47.1' };
    case 'clone': {
      const url = args[1];
      if (!url) return { err: 'fatal: You must specify a repository to clone.' };
      const name = args[2] || url.replace(/\.git$/, '').split('/').pop();
      const here = get(s, s.cwd);
      if (!here.kids[name]) here.kids[name] = makeTree().kids['3D-reader'];
      return { out: `Cloning into '${name}'...\nremote: Enumerating objects: 4213, done.\nremote: Counting objects: 100% (4213/4213), done.\nReceiving objects: 100% (4213/4213), 12.31 MiB | 8.20 MiB/s, done.\nResolving deltas: 100% (2871/2871), done.` };
    }
    case 'status': {
      const e = needRepo();
      if (e) return e;
      const up = g.upstream[g.branch];
      let out = `On branch ${g.branch}\n`;
      if (up) out += g.ahead ? `Your branch is ahead of '${up}' by ${g.ahead} commit(s).\n  (use "git push" to publish your local commits)\n` : `Your branch is up to date with '${up}'.\n`;
      if (g.staged.length) out += `\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n${g.staged.map((f) => `\tmodified:   ${f}`).join('\n')}\n`;
      if (g.modified.length) out += `\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n${g.modified.map((f) => `\tmodified:   ${f}`).join('\n')}\n`;
      if (!g.staged.length && !g.modified.length) out += '\nnothing to commit, working tree clean';
      return { out: out.trimEnd() };
    }
    case 'add': {
      const e = needRepo();
      if (e) return e;
      const what = args.slice(1);
      if (!what.length) return { err: 'Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?' };
      const take = what.some((w) => w === '.' || w === '-A' || w === '--all') ? [...g.modified] : g.modified.filter((f) => what.some((w) => f === w.replace(/\\/g, '/') || f.endsWith(`/${w}`)));
      if (!take.length && !g.modified.length) return {};
      if (!take.length) return { err: `fatal: pathspec '${what[0]}' did not match any files` };
      g.modified = g.modified.filter((f) => !take.includes(f));
      g.staged.push(...take);
      return {};
    }
    case 'commit': {
      const e = needRepo();
      if (e) return e;
      const mi = args.findIndex((a) => a === '-m' || a === '-am');
      if (args.includes('-am')) { g.staged.push(...g.modified); g.modified = []; }
      if (mi < 0 || !args[mi + 1]) return { err: 'Aborting commit due to empty commit message.\nhint: use git commit -m "your message"' };
      if (!g.staged.length) return { err: `On branch ${g.branch}\nnothing to commit, working tree clean` };
      const sha = Math.random().toString(16).slice(2, 9);
      const n = g.staged.length;
      g.commits.unshift({ sha, msg: args[mi + 1] });
      g.staged = [];
      g.ahead++;
      return { out: `[${g.branch} ${sha}] ${args[mi + 1]}\n ${n} file${n > 1 ? 's' : ''} changed, 12 insertions(+), 3 deletions(-)` };
    }
    case 'log': {
      const e = needRepo();
      if (e) return e;
      if (args.includes('--oneline')) return { out: g.commits.map((c, i) => `${c.sha} ${i === 0 ? `(HEAD -> ${g.branch}${g.upstream[g.branch] && !g.ahead ? `, ${g.upstream[g.branch]}` : ''}) ` : ''}${c.msg}`).join('\n') };
      return { out: g.commits.map((c, i) => `commit ${c.sha}${'0'.repeat(33)}${i === 0 ? ` (HEAD -> ${g.branch})` : ''}\nAuthor: Alex <alex@example.com>\nDate:   Tue Oct 21 09:00:00 2026 +0200\n\n    ${c.msg}\n`).join('\n') };
    }
    case 'branch': {
      const e = needRepo();
      if (e) return e;
      if (args[1] && !args[1].startsWith('-')) {
        if (g.branches.includes(args[1])) return { err: `fatal: a branch named '${args[1]}' already exists` };
        g.branches.push(args[1]);
        return {};
      }
      const list = args.includes('-a') ? [...g.branches, 'remotes/origin/main', 'remotes/origin/claude/3d-reader-uxw782'] : g.branches;
      return { out: list.map((b) => `${b === g.branch ? '*' : ' '} ${b}`).join('\n') };
    }
    case 'switch':
    case 'checkout': {
      const e = needRepo();
      if (e) return e;
      const create = args.includes('-c') || args.includes('-b');
      const name = args.filter((a, i) => i > 0 && !a.startsWith('-'))[0];
      if (!name) return { err: `fatal: missing branch name; try -${sub === 'switch' ? 'c' : 'b'}` };
      if (create) {
        if (g.branches.includes(name)) return { err: `fatal: a branch named '${name}' already exists` };
        g.branches.push(name);
        g.branch = name;
        g.ahead = 0;
        return { out: `Switched to a new branch '${name}'` };
      }
      if (!g.branches.includes(name)) {
        if (name === 'claude/3d-reader-uxw782') {
          g.branches.push(name);
          g.upstream[name] = `origin/${name}`;
          g.branch = name;
          return { out: `branch '${name}' set up to track 'origin/${name}'.\nSwitched to a new branch '${name}'` };
        }
        return { err: sub === 'switch' ? `fatal: invalid reference: ${name}` : `error: pathspec '${name}' did not match any file(s) known to git` };
      }
      g.branch = name;
      return { out: `Switched to branch '${name}'` };
    }
    case 'push': {
      const e = needRepo();
      if (e) return e;
      const u = args.includes('-u') || args.includes('--set-upstream');
      if (!g.upstream[g.branch] && !u) return { err: `fatal: The current branch ${g.branch} has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ${g.branch}\n` };
      if (u) g.upstream[g.branch] = `origin/${g.branch}`;
      const n = g.ahead;
      g.ahead = 0;
      return { out: `Enumerating objects: ${5 + n * 3}, done.\nWriting objects: 100% (${3 + n * 2}/${3 + n * 2}), 1.02 KiB | 1.02 MiB/s, done.\nTo https://github.com/alexdevanssay-cmyk/3D-reader.git\n   ${g.commits[1]?.sha || '0000000'}..${g.commits[0].sha}  ${g.branch} -> ${g.branch}${u ? `\nbranch '${g.branch}' set up to track 'origin/${g.branch}'.` : ''}` };
    }
    case 'pull':
    case 'fetch': {
      const e = needRepo();
      if (e) return e;
      return { out: sub === 'fetch' ? 'From https://github.com/alexdevanssay-cmyk/3D-reader\n * [new branch]      claude/3d-reader-uxw782 -> origin/claude/3d-reader-uxw782' : 'Already up to date.' };
    }
    case 'diff': {
      const e = needRepo();
      if (e) return e;
      if (!g.modified.length) return {};
      return { out: 'diff --git a/web/app.js b/web/app.js\nindex 3f2a1c0..8b9d4e2 100644\n--- a/web/app.js\n+++ b/web/app.js\n@@ -12,7 +12,7 @@\n-const DEFAULT_LANG = "en";\n+const DEFAULT_LANG = "fr";' };
    }
    case 'merge':
      return needRepo() || { out: `Already up to date.` };
    case 'remote':
      return needRepo() || { out: args.includes('-v') ? 'origin\thttps://github.com/alexdevanssay-cmyk/3D-reader.git (fetch)\norigin\thttps://github.com/alexdevanssay-cmyk/3D-reader.git (push)' : 'origin' };
    default:
      return { err: `git: '${sub}' is not a git command. See 'git --help'.` };
  }
}

function npm(s, args) {
  const sub = args[0];
  if (sub === '-v' || sub === '--version') return { out: '11.6.2' };
  const pkg = get(s, [...s.cwd, 'package.json']);
  if (!pkg && sub) return { err: `npm error code ENOENT\nnpm error path ${fullPath(s)}${sep(s)}package.json\nnpm error enoent Could not read package.json: no such file or directory` };
  switch (sub) {
    case 'install':
    case 'i':
    case 'ci':
      s.npmInstalled = true;
      get(s, s.cwd).kids.node_modules ||= { dir: true, kids: { three: { dir: true, kids: {} }, playwright: { dir: true, kids: {} }, 'opencascade.js': { dir: true, kids: {} } } };
      return { out: `\nadded 412 packages, and audited 413 packages in ${sub === 'ci' ? 9 : 14}s\n\nfound 0 vulnerabilities` };
    case 'test':
    case 't':
      if (!s.npmInstalled) return { err: "Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'three' imported from web/engine/summary.js\n(hint: run npm ci first)" };
      return { out: '> 3d-reader-web@0.2.0 test\n> node --test tests/js/*.test.mjs\n\n✔ summarize: totals of two cubes (3.1ms)\n✔ minVolumeBox: rotated box (41.7ms)\n✔ parting: plane of a plate (120.4ms)\n…\nℹ tests 791\nℹ pass 791\nℹ fail 0\nℹ duration_ms 48211' };
    case 'serve':
    case 'start':
      return npm(s, ['run', 'serve']);
    case 'run': {
      const script = args[1];
      if (!script) return { out: 'Scripts available in 3d-reader-web@0.2.0 via `npm run-script`:\n  vendor\n  build\n  serve\n  test\n  test:e2e' };
      if (!['vendor', 'build', 'serve', 'test', 'test:e2e'].includes(script)) return { err: `npm error Missing script: "${script}"\n\nnpm error To see a list of scripts, run:\nnpm error   npm run` };
      if (!s.npmInstalled) return { err: "Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'opencascade.js'\n(hint: run npm ci first)" };
      if (script === 'build' || script === 'vendor') {
        s.built = true;
        get(s, s.cwd).kids.dist ||= { dir: true, kids: { 'index.html': { dir: false, content: '<!doctype html>…' } } };
        return { out: `> 3d-reader-web@0.2.0 ${script}\n> node scripts/build-web.mjs\n\nvendor: three 0.180.0, opencascade.js (wasm 50.3 MB → 11.9 MB gzip)\nsite written to dist/ (base path /)` };
      }
      if (script === 'serve') return { out: '> 3d-reader-web@0.2.0 serve\n> node scripts/serve.mjs\n\n3D Reader: http://localhost:8000/  (Ctrl+C to stop)' };
      if (script === 'test') return npm(s, ['test']);
      return { out: '> node --test tests/e2e/*.test.mjs\n\n✔ site: opens a STEP file and shows its volume (8.2s)\n…\nℹ tests 105\nℹ pass 105\nℹ fail 0' };
    }
    case undefined:
      return { out: 'npm <command>\n\nUsage:\nnpm install        install all the dependencies in your project\nnpm test           run this project\'s tests\nnpm run <foo>      run the script named <foo>' };
    default:
      return { err: `Unknown command: "${sub}"` };
  }
}

function run(s, argv, t) {
  const [raw, ...args] = argv;
  const c = raw.toLowerCase().replace(/\.exe$/, '');
  const sh = s.shell;
  // Commands of every shell (programs installed on the machine).
  if (c === 'git') return git(s, args);
  if (c === 'npm') return npm(s, args);
  if (c === 'npx') {
    if (args[0] === 'playwright') return { out: args[1] === 'install' ? 'Downloading Chromium 141.0 … done' : 'Running 105 tests using 4 workers\n  105 passed (2.1m)' };
    return { out: `npx: running ${args[0] || '?'}…` };
  }
  if (c === 'node') {
    if (args[0] === '-v' || args[0] === '--version') return { out: 'v24.11.0' };
    if (!args[0]) return { out: 'Welcome to Node.js v24.11.0.\nType ".help" for more information.\n> (simulated: type a file name, e.g. node hello.js)' };
    const f = get(s, resolve(s, args[0]));
    if (!f || f.dir) return { err: `node:internal/modules/cjs/loader:1228\n  throw err;\n  ^\n\nError: Cannot find module '${fullPath(s, resolve(s, args[0]))}'` };
    const logs = [...f.content.matchAll(/console\.log\((['"`])(.*?)\1\)/g)].map((m) => m[2]);
    return { out: logs.join('\n') };
  }
  if (c === 'python' || c === 'python3' || c === 'py') {
    if (args[0] === '--version' || args[0] === '-V') return { out: 'Python 3.11.9' };
    if (args[0] === '-m' && args[1] === 'venv') return touch(s, args[2] || '.venv') || {};
    if (args[0] === '-m' && args[1] === 'pytest') return run(s, ['pytest'], t);
    if (args[0] === '-m' && args[1] === 'reader3d') return { out: 'INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)' };
    return { out: 'Python 3.11.9\n>>> (simulated)' };
  }
  if (c === 'pip' || c === 'pip3') {
    if (args[0] === '--version') return { out: 'pip 24.0 from C:\\Python311\\Lib\\site-packages\\pip (python 3.11)' };
    if (args[0] === 'install') return { out: 'Collecting cadquery-ocp>=8.0\nCollecting fastapi>=0.110\n…\nSuccessfully installed cadquery-ocp-8.0.0 fastapi-0.115.0 numpy-2.1.0 trimesh-4.5.0 uvicorn-0.32.0' };
    return { out: 'Usage: pip <command> [options]' };
  }
  if (c === 'pytest') return inRepo(s) ? { out: '============ test session starts ============\ncollected 64 items\n\ntests/test_volume.py ........................   [ 37%]\ntests/test_server.py ........................   [100%]\n\n============ 64 passed in 21.47s ============' } : { out: 'no tests ran in 0.01s' };
  if (c === 'code') return { out: t('term.vscode') };
  if (c === 'claude') return { out: t('term.claude') };
  if (c === 'whoami') return { out: sh === 'bash' ? 'alex' : 'pc\\alex' };
  if (c === 'help' && sh !== 'cmd') return { out: t(`term.help.${sh}`) };
  if (c === 'history' || (sh === 'powershell' && (c === 'get-history' || c === 'h'))) return { out: s.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') };

  if (sh === 'cmd') {
    switch (c) {
      case 'dir': return listing(s, resolve(s, args.find((a) => !a.startsWith('/'))), args);
      case 'cd': case 'chdir': return changeDir(s, args.filter((a) => !/^\/d$/i.test(a)).join(' ') || undefined);
      case 'type': return readFile(s, args[0], 'type');
      case 'echo': return { out: args.length ? expandVars(s, argv.slice(1).join(' ')) : 'ECHO is on.' };
      case 'cls': return { clear: true };
      case 'mkdir': case 'md': return makeDir(s, args[0]);
      case 'where': {
        const w = WHERE[args[0]?.toLowerCase()]?.[0];
        return w ? { out: w } : { err: `INFO: Could not find files for the given pattern(s).` };
      }
      case 'set':
        if (!args.length) return { out: Object.entries(s.env).map(([k, v]) => `${k}=${v}`).join('\n') };
        if (argv.slice(1).join(' ').includes('=')) {
          const [k, ...v] = argv.slice(1).join(' ').split('=');
          s.env[k.trim()] = v.join('=');
          return {};
        }
        return { out: Object.entries(s.env).filter(([k]) => k.toLowerCase().startsWith(args[0].toLowerCase())).map(([k, v]) => `${k}=${v}`).join('\n') || `Environment variable ${args[0]} not defined` };
      case 'ver': return { out: '\nMicrosoft Windows [Version 10.0.26100.4652]' };
      case 'help': return { out: t('term.help.cmd') };
      case 'copy': case 'del': case 'ren': case 'move': return { out: '        1 file(s) processed. (simulated)' };
      case 'exit': return { out: t('term.exit') };
      case 'powershell': return { out: t('term.switch') };
      default: return { err: NOT_FOUND.cmd(raw) };
    }
  }

  if (sh === 'powershell') {
    const named = (name) => {
      const i = args.findIndex((a) => a.toLowerCase() === name);
      return i >= 0 ? args[i + 1] : undefined;
    };
    const positional = args.filter((a, i) => !a.startsWith('-') && !(i > 0 && args[i - 1].startsWith('-') && !/^-(force|recurse)$/i.test(args[i - 1])));
    if (/^\$env:\w+$/i.test(raw) && args[0] === '=') {
      s.env[raw.slice(5)] = args.slice(1).join(' ');
      return {};
    }
    if (/^\$env:\w+$/i.test(raw)) return { out: findEnv(s, raw.slice(5)) ?? '' };
    switch (c) {
      case 'get-childitem': case 'ls': case 'dir': case 'gci': return listing(s, resolve(s, named('-path') ?? positional[0]), args);
      case 'set-location': case 'cd': case 'sl': case 'chdir': return changeDir(s, named('-path') ?? positional[0] ?? undefined);
      case 'get-location': case 'pwd': case 'gl': return { out: `\nPath\n----\n${fullPath(s)}\n` };
      case 'get-content': case 'cat': case 'type': case 'gc': return readFile(s, named('-path') ?? positional[0], 'Get-Content');
      case 'write-output': case 'echo': case 'write': case 'write-host': return { out: expandVars(s, argv.slice(1).join(' ')) };
      case 'new-item': case 'ni': {
        const name = named('-name') ?? named('-path') ?? positional[0];
        if (/directory/i.test(named('-itemtype') || '')) return makeDir(s, name);
        touch(s, name);
        return { out: `\n    Directory: ${fullPath(s)}\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n-a---        21/10/2026     09:00              0 ${name}\n` };
      }
      case 'mkdir': case 'md': return makeDir(s, positional[0]);
      case 'clear-host': case 'cls': case 'clear': return { clear: true };
      case 'get-command': case 'gcm': {
        const w = WHERE[positional[0]?.toLowerCase()];
        if (w?.[0]) return { out: `\nCommandType     Name              Version    Source\n-----------     ----              -------    ------\nApplication     ${positional[0]}.exe          0.0.0.0    ${w[0]}\n` };
        if (/^[a-z]+-[a-z]+$/i.test(positional[0] || '')) return { out: `\nCommandType     Name                Version    Source\n-----------     ----                -------    ------\nCmdlet          ${positional[0]}     7.0.0.0    Microsoft.PowerShell.Management\n` };
        return { err: NOT_FOUND.powershell(positional[0] || '?') };
      }
      case 'get-help': case 'help': case 'man': return { out: positional[0] ? `\nNAME\n    ${positional[0]}\n\nSYNOPSIS\n    ${t('term.synopsis')}\n\nSYNTAX\n    ${positional[0]} [[-Path] <string[]>] [<CommonParameters>]\n\nREMARKS\n    Get-Help ${positional[0]} -Examples` : t('term.help.powershell') };
      case 'get-executionpolicy': return { out: 'RemoteSigned' };
      case 'set-executionpolicy': return { out: t('term.policy') };
      case 'get-process': case 'ps': case 'gps': return { out: '\nHandles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\n-------  ------    -----      -----     ------     --  -- -----------\n    812      54   210344     198220      12.42   4120   1 chrome\n    301      22    81220      64012       2.10   9876   1 Code\n    150      12    40112      33108       0.85   5544   1 node' };
      case 'get-date': return { out: new Date().toString() };
      case 'test-path': return { out: get(s, resolve(s, positional[0])) ? 'True' : 'False' };
      case 'remove-item': case 'rm': case 'del': return { out: t('term.safe') };
      case 'exit': return { out: t('term.exit') };
      default: return { err: NOT_FOUND.powershell(raw) };
    }
  }

  // bash
  switch (c) {
    case 'ls': case 'll': return listing(s, resolve(s, args.find((a) => !a.startsWith('-'))), c === 'll' ? ['-la'] : args);
    case 'cd': return changeDir(s, args[0]);
    case 'pwd': return { out: fullPath(s) };
    case 'cat': case 'less': case 'head': return readFile(s, args.find((a) => !a.startsWith('-')), c);
    case 'echo': return { out: expandVars(s, argv.slice(1).join(' ')) };
    case 'mkdir': return makeDir(s, args.find((a) => !a.startsWith('-')));
    case 'touch': return touch(s, args[0]);
    case 'which': {
      const w = WHERE[args[0]]?.[1];
      return w ? { out: w } : { err: '' };
    }
    case 'env': case 'printenv': return { out: Object.entries(s.env).map(([k, v]) => `${k}=${v}`).join('\n') };
    case 'export': {
      const [k, ...v] = argv.slice(1).join(' ').split('=');
      if (!k) return { out: Object.entries(s.env).map(([a, b]) => `declare -x ${a}="${b}"`).join('\n') };
      s.env[k.trim()] = v.join('=').replace(/^["']|["']$/g, '');
      return {};
    }
    case 'clear': return { clear: true };
    case 'rm': return { out: t('term.safe') };
    case 'source': return { out: '(.venv) ' + t('term.venv') };
    case 'uname': return { out: 'Linux' };
    case 'exit': return { out: t('term.exit') };
    default: return { err: NOT_FOUND.bash(raw) };
  }
}

/** Runs one command line (with && chains and a final grep-like filter). */
export function execute(s, line, t = (k) => k) {
  const text = line.trim();
  if (!text) return { out: '' };
  s.history.push(text);
  const outs = [];
  let ok = true;
  let clear = false;
  const chain = s.shell === 'cmd' ? text.split(/\s*&&?\s*/) : text.split(/\s*(?:&&|;)\s*/);
  for (const part of chain) {
    if (!part) continue;
    const [cmdPart, ...pipes] = part.split(/\s*\|\s*/);
    const argv = tokenize(s.shell === 'powershell' && /^\$env:/i.test(cmdPart) ? cmdPart.replace(/\s*=\s*/, ' = ') : expandVars(s, cmdPart));
    let r = argv.length ? run(s, argv, t) : {};
    if (r.out != null && pipes.length) {
      for (const p of pipes) {
        const [f, ...pat] = tokenize(p);
        if (/^(grep|findstr|select-string|sls)$/i.test(f)) {
          const needle = pat.filter((x) => !x.startsWith('-') && !x.startsWith('/')).join(' ').toLowerCase();
          r = { out: r.out.split('\n').filter((l) => l.toLowerCase().includes(needle)).join('\n') };
        } else if (/^(more|less|out-host|sort|sort-object)$/i.test(f)) {
          if (/^sort/i.test(f)) r = { out: r.out.split('\n').sort().join('\n') };
        } else if (/^(measure-object|measure|wc)$/i.test(f)) {
          const n = r.out.split('\n').filter(Boolean).length;
          r = { out: s.shell === 'bash' ? String(n) : `\nCount    : ${n}\n` };
        }
      }
    }
    if (r.clear) {
      clear = true;
      outs.length = 0;
    }
    if (r.out) outs.push({ text: r.out });
    if (r.err != null) {
      if (r.err) outs.push({ text: r.err, err: true });
      ok = false;
      break;
    }
  }
  return { lines: outs, ok, clear };
}

// ------------------------------------------------------------------ widget

/**
 * Mounts a terminal in `el`. `missions` (optional) are checked in order;
 * onMission(doneCount) is called when one is completed.
 */
export function mountTerminal(el, { shell, cwd, intro, missions = [], done = 0, onMission, lang, t }) {
  const s = createSession(shell, { cwd });
  let reached = Math.min(done, missions.length);
  const L = (v) => (v && typeof v === 'object' ? v[lang] ?? v.fr : v || '');
  const title = { cmd: 'Invite de commandes — cmd.exe', powershell: 'Windows PowerShell', bash: 'bash — Linux' }[shell];
  el.className = `terminal-widget shell-${shell}`;
  el.innerHTML = `
    ${intro ? `<p class="term-intro">${L(intro)}</p>` : ''}
    ${missions.length ? `<ol class="missions"></ol>` : ''}
    <div class="term-window" role="region" aria-label="${escapeHtml(title)}">
      <div class="term-bar"><span class="dots"><i></i><i></i><i></i></span><span>${escapeHtml(title)}</span><button type="button" class="term-reset" title="${escapeHtml(t('term.reset'))}">↺</button></div>
      <div class="term-screen" tabindex="-1"><div class="term-out"></div>
        <label class="term-line"><span class="term-prompt"></span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="${escapeHtml(t('term.input'))}"></label>
      </div>
    </div>
    <p class="term-tip muted">${escapeHtml(t('term.tip'))}</p>`;
  const out = el.querySelector('.term-out');
  const input = el.querySelector('input');
  const promptEl = el.querySelector('.term-prompt');
  const list = el.querySelector('.missions');
  const screen = el.querySelector('.term-screen');
  let session = s;
  let hIndex = -1;
  const banner = {
    cmd: 'Microsoft Windows [Version 10.0.26100.4652]\n(c) Microsoft Corporation. All rights reserved.\n',
    powershell: 'Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n',
    bash: 'Linux pc 6.8.0 x86_64 GNU/Linux\n',
  }[shell];
  const print = (text, cls = '') => {
    const pre = document.createElement('pre');
    pre.className = cls;
    pre.textContent = text;
    out.append(pre);
  };
  const renderMissions = () => {
    if (!list) return;
    list.innerHTML = missions.map((m, i) => `<li class="${i < reached ? 'done' : i === reached ? 'current' : ''}">${i < reached ? '✅' : i === reached ? '👉' : '⬜'} ${L(m)}</li>`).join('') + (reached >= missions.length ? `<li class="all-done">🎉 ${escapeHtml(t('term.allDone'))}</li>` : '');
  };
  const reset = () => {
    session = createSession(shell, { cwd });
    out.innerHTML = '';
    print(banner, 'muted');
    promptEl.textContent = prompt(session);
  };
  reset();
  renderMissions();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const h = session.history;
      if (!h.length) return;
      e.preventDefault();
      hIndex = e.key === 'ArrowUp' ? (hIndex < 0 ? h.length - 1 : Math.max(0, hIndex - 1)) : hIndex < 0 ? -1 : hIndex + 1;
      if (hIndex >= h.length) hIndex = -1;
      input.value = hIndex < 0 ? '' : h[hIndex];
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const words = input.value.split(' ');
      const last = words.at(-1);
      const dirParts = last.split(/[\\/]/);
      const base = resolve(session, dirParts.slice(0, -1).join(sep(session)) || '.');
      const n = get(session, base);
      const match = n?.dir && Object.keys(n.kids).find((k) => k.toLowerCase().startsWith(dirParts.at(-1).toLowerCase()));
      if (match) {
        dirParts[dirParts.length - 1] = match + (n.kids[match].dir ? sep(session) : '');
        words[words.length - 1] = dirParts.join(sep(session));
        input.value = words.join(' ');
      }
      return;
    }
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
      return;
    }
    if (e.key !== 'Enter') return;
    const line = input.value;
    input.value = '';
    hIndex = -1;
    print(prompt(session) + line, 'cmdline');
    const r = execute(session, line, t);
    if (r.clear) out.innerHTML = '';
    for (const l of r.lines) print(l.text, l.err ? 'err' : '');
    promptEl.textContent = prompt(session);
    if (reached < missions.length && line.trim()) {
      let re;
      try { re = new RegExp(missions[reached].match, 'i'); } catch { re = null; }
      if (re?.test(line.trim()) && r.ok) {
        reached++;
        renderMissions();
        print(`✔ ${t('term.missionOk')}`, 'ok');
        onMission?.(reached);
      } else if (re?.test(line.trim())) {
        print(`✘ ${t('term.missionErr')}`, 'warn');
      }
    }
    screen.scrollTop = screen.scrollHeight;
  });
  el.querySelector('.term-reset').addEventListener('click', () => {
    reset();
    input.focus();
  });
  screen.addEventListener('click', () => input.focus());
}
