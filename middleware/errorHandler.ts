import { Request, Response, NextFunction } from "express";

/** Generic, user-safe message for unexpected server errors. */
const SERVER_ERROR_MESSAGE = "خطا در سرور. لطفا به پشتیبانی پیام دهید";

/**
 * 404 catch-all mounted after all routes so unmatched paths get a consistent
 * JSON response instead of Express's default HTML error page.
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "Not Found" });
}

/**
 * Central error handler. Logs the real error server-side but returns only a
 * safe, generic message to the client (never the raw error / stack).
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = typeof err?.statusCode === "number" ? err.statusCode : 500;

  // For explicit client errors we may pass through a safe message; for 5xx we
  // always return the generic message to avoid leaking internals.
  const message =
    status < 500 && typeof err?.message === "string"
      ? err.message
      : SERVER_ERROR_MESSAGE;

  return res.status(status).json({ message });
}
