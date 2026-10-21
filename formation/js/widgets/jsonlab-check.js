// Missions of the JSON lab (shared by the page and the content validator).

/** Value at a path like "bodies.0.volume" (array indices are numbers), or undefined. */
export function at(value, path) {
  if (path == null || path === '') return value;
  let v = value;
  for (const key of String(path).split('.')) {
    if (v === null || typeof v !== 'object' || !(key in v)) return undefined;
    v = v[key];
  }
  return v;
}

export function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

/**
 * Is a mission met by the parsed value? A mission is
 * { path?, exists?, type?, equals?, length?, minLength? } (all conditions given must hold).
 */
export function jsonMission(m, value) {
  const v = at(value, m.path);
  if (m.exists === false) return v === undefined;
  if (v === undefined) return false;
  if (m.type && typeOf(v) !== m.type) return false;
  if ('equals' in m && JSON.stringify(v) !== JSON.stringify(m.equals)) return false;
  if (m.length != null && (v?.length ?? (typeOf(v) === 'object' ? Object.keys(v).length : undefined)) !== m.length) return false;
  if (m.minLength != null && !((v?.length ?? (typeOf(v) === 'object' ? Object.keys(v).length : -1)) >= m.minLength)) return false;
  return true;
}
