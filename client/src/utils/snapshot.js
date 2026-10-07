// Data saved at build time by scripts/snapshot.mjs (see package.json predev/prebuild).
import snapshot from '../data/snapshot.json';

/** Returns build-time data for a cache key, or undefined if there is none. */
export const readSnapshot = (key) => snapshot?.data?.[key];