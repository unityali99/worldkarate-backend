"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwt = exports.tokenCookieName = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.tokenCookieName = "auth-token";
const createJwt = (user) => {
    return jsonwebtoken_1.default.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET);
};
exports.createJwt = createJwt;
//# sourceMappingURL=createJwt.js.map