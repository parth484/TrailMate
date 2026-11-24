/**
 * Normalize a value into a valid array.
 * Handles arrays, `{ data: [...] }` wrappers, null, undefined, strings, and unexpected objects.
 */
export const toSafeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && Array.isArray(value.data)) {
    return value.data;
  }
  return [];
};

/**
 * Check whether a value is a non-null plain object (not an array or primitive).
 */
export const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Safely read and parse JSON from localStorage, returning fallback on missing or malformed data.
 */
export const safeReadStorage = (key, fallback, validator = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
};
