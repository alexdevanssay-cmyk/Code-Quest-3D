// The JSON lab parser agrees with JSON.parse and names the usual mistakes.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { jsonMission } from '../js/widgets/jsonlab-check.js';
import { jsonMessage, parseJson } from '../js/widgets/jsonlab.js';

const SAMPLES = [
  '{}', '[]', '0', '-0.5e+3', '"a\\u00e9\\n"', 'true', 'null', ' { "a" : [1, 2, {"b": null}] } ',
  '{"a":1,}', '[1,2,]', "{'a':1}", '{a:1}', '{"a":1 // c\n}', '{"a" 1}', '{"a":1 "b":2}', '{"a":undefined}',
  '{"a":True}', '007', '+1', '.5', '1.', '"abc', '"a\nb"', '"\\x"', '{"a":1}}', '', '[1 2]', '{"a":NaN}', '-', '1e', '{"a":1,"a":2}',
];

test('valid exactly when JSON.parse accepts, with the same value', () => {
  for (const s of SAMPLES) {
    let expected;
    let ok = true;
    try { expected = JSON.parse(s); } catch { ok = false; }
    const r = parseJson(s);
    assert.equal(r.ok, ok, JSON.stringify(s));
    if (ok) assert.deepEqual(r.value, expected, s);
  }
});

test('beginner mistakes are named, at the right place', () => {
  const cases = {
    '{"a":1,}': ['trailing', 1, 7],
    "{'a':1}": ['single', 1, 2],
    '{a:1}': ['unquoted', 1, 2],
    '{\n  "a": 1 // note\n}': ['comment', 2, 10],
    '{"a":1 "b":2}': ['comma', 1, 8],
    '{"a" 1}': ['colon', 1, 6],
    '{"a":undefined}': ['word', 1, 6],
    '007': ['number', 1, 1],
    '"a\nb"': ['control', 1, 3],
    '{"a":1': ['end', 1, 7],
    '{"a":1}}': ['extra', 1, 8],
  };
  for (const [s, [code, line, col]] of Object.entries(cases)) {
    const r = parseJson(s);
    assert.deepEqual([r.code, r.line, r.col], [code, line, col], JSON.stringify(s));
    assert.match(jsonMessage(r, 'fr'), /ligne \d+, colonne \d+ — ./);
  }
});

test('duplicate keys are a warning, not an error', () => {
  const r = parseJson('{"a":1,"a":2}');
  assert.equal(r.ok, true);
  assert.equal(r.warnings[0].key, 'a');
});

test('missions on a parsed value', () => {
  const v = { bodies: [{ volume: 12 }, { volume: 3 }], closed: true };
  assert.ok(jsonMission({}, v));
  assert.ok(jsonMission({ path: 'bodies.0.volume', type: 'number' }, v));
  assert.ok(jsonMission({ path: 'bodies', type: 'array', minLength: 2 }, v));
  assert.ok(jsonMission({ path: 'closed', equals: true }, v));
  assert.ok(jsonMission({ path: 'color', exists: false }, v));
  assert.ok(!jsonMission({ path: 'bodies.2' }, v));
  assert.ok(!jsonMission({ path: 'bodies', length: 3 }, v));
});
