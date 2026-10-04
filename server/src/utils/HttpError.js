export class HttpError extends Error {
  /**
   * @param {number} status   HTTP status code
   * @param {string} message  Safe, user-facing message
   * @param {object} [details] Optional field-level details (e.g. validation errors)
   */
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}
