import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so any rejected promise is forwarded to the
 * global error handler instead of becoming an unhandled rejection that hangs
 * the request (Express 4 does not catch async errors on its own).
 */
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => unknown,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
