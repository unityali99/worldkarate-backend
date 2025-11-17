"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
const envMode_1 = require("./envMode");
const isProduction = envMode_1.envMode === "production";
exports.cookieOptions = Object.assign(Object.assign({ httpOnly: true, secure: true, sameSite: "lax", path: "/" }, (isProduction && { domain: "worldkarate.ir" })), { maxAge: 10 * 24 * 60 * 60 * 1000 });
//# sourceMappingURL=cookieOptions.js.map