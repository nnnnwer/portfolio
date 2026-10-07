import { useCallback, useEffect, useRef, useState } from 'react';
import { readCache, removeCache, writeCache } from '../utils/cache';
import { readSnapshot } from '../utils/snapshot';

const SLOW_AFTER_MS = 5000;

/** Newest saved copy first (this browser), then the copy built into the site. */
const readSaved = (key) => {
  if (!key) return undefined;
  const cached = readCache(key);
  return cached !== undefined ? cached : readSnapshot(key);
};

/**
 * Runs an async fetcher with loading / error / data state.
 * - fetcher(signal) receives an AbortSignal; stale requests are cancelled.
 * - `slow` turns true when a request takes longer than 5s (e.g. a sleeping server).
 * - `retry()` runs the request again.
 * - options.cacheKey: show saved data instantly (from this browser, or from the
 *   snapshot built into the site), then refresh it in the background.
 *   If the refresh fails, the saved data stays on screen.
 */
export function useApi(fetcher, deps = [], { cacheKey } = {}) {
  const [state, setState] = useState(() => ({
    data: readSaved(cacheKey),
    error: null,
    loading: true,
  }));
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    const cached = readSaved(cacheKey);

    setState((prev) => ({ data: cacheKey ? cached : prev.data, error: null, loading: true }));
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        if (cacheKey) writeCache(cacheKey, data);
        setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === 'CanceledError') return;

        // The item no longer exists: forget it and show the error.
        if (error?.status === 404 && cacheKey) removeCache(cacheKey);

        setState((prev) =>
          cacheKey && prev.data !== undefined && error?.status !== 404
            ? { ...prev, loading: false } // keep showing saved data
            : { data: undefined, error, loading: false },
        );
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, slow, retry };
}