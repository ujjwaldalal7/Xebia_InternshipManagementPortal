// ──────────────────────────────────────────────────────
// Custom Error Class — AppError
// ──────────────────────────────────────────────────────

/**
 * Custom application error with HTTP status code.
 * Thrown in services and caught by the global error handler.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
