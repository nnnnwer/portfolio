import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

/** Normalized error thrown by every API call. */
export class ApiError extends Error {
  constructor(message, { status = 0, details, isNetworkError = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

export const api = axios.create({
  baseURL,
  // Free-tier servers can take close to a minute to wake from sleep.
  timeout: 70_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!error.response) {
      const timedOut = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
      return Promise.reject(
        new ApiError(
          timedOut
            ? 'The server took too long to respond. It may be starting up; try again in a moment.'
            : "Can't reach the server. Check your internet connection and try again.",
          { isNetworkError: true },
        ),
      );
    }

    const { status, data } = error.response;
    const message =
      data?.error?.message ||
      (status === 404 ? 'That content could not be found.' : `The server returned an error (${status}).`);

    return Promise.reject(new ApiError(message, { status, details: data?.error?.details }));
  },
);

/** Unwraps the { data } envelope used by every endpoint. */
export const unwrap = (response) => response.data?.data;
