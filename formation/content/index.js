// Manifest of the course: every module, in the order of the path.
import start from './start.js';
import basics from './basics.js';
import js from './js.js';
import json from './json.js';
import web from './web.js';
import cpp from './cpp.js';
import python from './python.js';
import network from './network.js';
import env from './env.js';
import git from './git.js';
import quality from './quality.js';
import glossary from './glossary.js';

export const MODULES = [start, basics, js, json, web, cpp, python, network, env, git, quality].sort((a, b) => a.order - b.order);
export const GLOSSARY = glossary;
