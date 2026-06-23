"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.isProduction = void 0;
const envMode_1 = require("./envMode");
exports.isProduction = envMode_1.envMode === "production";
exports.cookieOptions = Object.assign(Object.assign({ httpOnly: true, secure: exports.isProduction, sameSite: "lax", path: "/" }, (exports.isProduction && { domain: "worldkarate.ir" })), { maxAge: 10 * 24 * 60 * 60 * 1000 });
//# sourceMappingURL=cookieOptions.js.map