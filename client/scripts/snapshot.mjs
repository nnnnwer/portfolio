/**
 * Build-time snapshot: saves the portfolio data into src/data/snapshot.json so
 * first-time visitors see content instantly, even if the API server is asleep.
 * The site still refreshes the data from the API in the background.
 *
 * Runs automatically before `npm run dev` and `npm run build` (predev/prebuild).
 * It never fails the build: if the API can't be reached, it writes an empty
 * snapshot and the site simply loads data from the API as before.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/snapshot.json');

const onVercel = Boolean(process.env.VERCEL);
const API_URL = (
  process.env.SNAPSHOT_API_URL ||
  (onVercel ? 'https://portfolio-bydi.onrender.com/api' : 'http://localhost:5000/api')
).replace(/\/+$/, '');

// On Vercel the free Render server may be asleep, so allow time to wake it.
const WAKE_TIMEOUT_MS = onVercel ? 100_000 : 3_000;
const REQUEST_TIMEOUT_MS = 20_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path, timeoutMs = REQUEST_TIMEOUT_MS) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  const body = await response.json();
  if (body?.data === undefined) throw new Error(`${path} returned no data`);
  return body.data;
}

/** First request: keep retrying until the server wakes up or time runs out. */
async function getWhileWaking(path) {
  const deadline = Date.now() + WAKE_TIMEOUT_MS;
  let lastError;
  while (Date.now() < deadline) {
    try {
      return await get(path, Math.max(1_000, deadline - Date.now()));
    } catch (error) {
      lastError = error;
      if (!onVercel) break; // locally, fail fast if the server isn't running
      await sleep(5_000);
    }
  }
  throw lastError ?? new Error('Timed out waiting for the API');
}

async function collect() {
  const profile = await getWhileWaking('/profile');
  const [skills, projects, education, experience] = await Promise.all([
    get('/skills'),
    get('/projects'),
    get('/education'),
    get('/experience'),
  ]);

  // Keys match the cacheKey names used by useApi() in the pages.
  const data = {
    profile,
    skills,
    projects,
    education,
    'projects-featured': projects.filter((project) => project.featured),
    resume: { profile, education, experience, skills, projects },
  };

  const details = await Promise.allSettled(
    projects.map((project) => get(`/projects/${encodeURIComponent(project.slug)}`)),
  );
  details.forEach((result, index) => {
    if (result.status === 'fulfilled') data[`project:${projects[index].slug}`] = result.value;
  });

  return data;
}

async function main() {
  await mkdir(dirname(OUT_FILE), { recursive: true });
  const started = Date.now();

  try {
    const data = await collect();
    await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), data }));
    console.log(
      `[snapshot] Saved ${Object.keys(data).length} entries from ${API_URL} in ${Date.now() - started} ms`,
    );
  } catch (error) {
    await writeFile(OUT_FILE, JSON.stringify({ generatedAt: null, data: {} }));
    console.warn(`[snapshot] Skipped (${error.message}). The site will load data from the API at runtime.`);
  }
}

main();