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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = adminAuth;
const client_1 = require("@prisma/client");
const user_repository_1 = require("../src/repositories/user.repository");
function adminAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPayload = req.user || req.body.user;
        try {
            const user = yield user_repository_1.UserRepository.findById(userPayload.id);
            if (!user || (user.role !== client_1.Role.ADMIN && user.role !== client_1.Role.INSTRUCTOR))
                return res.status(403).json({ message: "Access Denied" }).send();
            next();
        }
        catch (error) {
            res.json({ message: "Access Denied", error }).status(403).end();
        }
    });
}
//# sourceMappingURL=adminAuth.js.map