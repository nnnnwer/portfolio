// Saves API responses in the visitor's browser so returning visitors see the
// page instantly, even while the free-tier server is waking up.
const PREFIX = 'portfolio-cache:v1:';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // forget saved data after 7 days

export function readCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    const { savedAt, data } = JSON.parse(raw);
    if (typeof savedAt !== 'number' || Date.now() - savedAt > MAX_AGE_MS) {
      localStorage.removeItem(PREFIX + key);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

export function writeCache(key, data) {
  if (data === undefined) return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage full or blocked (private mode): the site still works without it.
  }
}

export function removeCache(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore storage errors.
  }
}