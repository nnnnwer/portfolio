import { useCallback, useEffect, useRef, useState } from 'react';

const SLOW_AFTER_MS = 5000;

/**
 * Runs an async fetcher with loading / error / data state.
 * - fetcher(signal) receives an AbortSignal; stale requests are cancelled.
 * - `slow` turns true when a request takes longer than 5s (e.g. a sleeping server).
 * - `retry()` runs the request again.
 */
export function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true });
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, error: null, loading: true }));
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === 'CanceledError') return;
        setState({ data: undefined, error, loading: false });
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, slow, retry };
}
