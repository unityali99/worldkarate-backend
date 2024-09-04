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
const db_1 = __importDefault(require("../prisma/db"));
const createJwt_1 = require("../utils/createJwt");
function authorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (req.cookies[`${createJwt_1.tokenCookieName}`])
            token = req.cookies[`${createJwt_1.tokenCookieName}`];
        try {
            const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.findUnique({
                where: { email: decodedUser.email },
            }));
            if (!user)
                return res.json({ message: "User not found" }).status(400).end();
            req.body.user = user;
            next();
        }
        catch (error) {
            return res.json({ message: "Access Denied", error }).status(403).end();
        }
    });
}
//# sourceMappingURL=authorization.js.map