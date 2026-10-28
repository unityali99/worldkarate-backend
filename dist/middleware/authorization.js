"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = authorization;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../src/repositories/user.repository");
const createJwt_1 = require("../utils/createJwt");
function authorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[createJwt_1.tokenCookieName];
        if (!token) {
            return res.status(403).json({ message: "Access Denied" }).end();
        }
        try {
            const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_repository_1.UserRepository.findByEmail(decodedUser.email);
            if (!user)
                return res.status(403).json({ message: "Access Denied" }).end();
            req.user = user;
            next();
        }
        catch (error) {
            // Do not leak the underlying JWT/verification error to the client.
            return res.status(403).json({ message: "Access Denied" }).end();
        }
    });
}
//# sourceMappingURL=authorization.js.map