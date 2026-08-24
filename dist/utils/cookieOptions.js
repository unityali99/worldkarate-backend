"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.isProduction = void 0;
exports.isProduction = process.env.ENV_MODE === "production";
exports.cookieOptions = Object.assign(Object.assign({ httpOnly: true, secure: exports.isProduction, sameSite: "lax", path: "/" }, (exports.isProduction && { domain: "worldkarate.ir" })), { maxAge: 10 * 24 * 60 * 60 * 1000 });
//# sourceMappingURL=cookieOptions.js.map