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
exports.adminAuth = adminAuth;
const db_1 = __importDefault(require("../prisma/db"));
function adminAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.body.user;
        try {
            const { isAdmin } = yield db_1.default.user.findUnique({ where: { id } });
            if (!isAdmin)
                return res.status(403).json({ message: "Access Denied" }).send();
            next();
        }
        catch (error) {
            res.json({ message: "Access Denied", error }).status(403).end();
        }
    });
}
//# sourceMappingURL=adminAuth.js.map