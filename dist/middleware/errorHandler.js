"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
/** Generic, user-safe message for unexpected server errors. */
const SERVER_ERROR_MESSAGE = "خطا در سرور. لطفا به پشتیبانی پیام دهید";
/**
 * 404 catch-all mounted after all routes so unmatched paths get a consistent
 * JSON response instead of Express's default HTML error page.
 */
function notFoundHandler(req, res) {
    res.status(404).json({ message: "Not Found" });
}
/**
 * Central error handler. Logs the real error server-side but returns only a
 * safe, generic message to the client (never the raw error / stack).
 */
function errorHandler(err, req, res, next) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    const status = typeof (err === null || err === void 0 ? void 0 : err.statusCode) === "number" ? err.statusCode : 500;
    // For explicit client errors we may pass through a safe message; for 5xx we
    // always return the generic message to avoid leaking internals.
    const message = status < 500 && typeof (err === null || err === void 0 ? void 0 : err.message) === "string"
        ? err.message
        : SERVER_ERROR_MESSAGE;
    return res.status(status).json({ message });
}
//# sourceMappingURL=errorHandler.js.map