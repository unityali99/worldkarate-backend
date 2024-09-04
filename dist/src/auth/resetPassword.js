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
const express_1 = require("express");
const ResetPassword_1 = __importDefault(require("../../schemas/auth/ResetPassword"));
const db_1 = __importDefault(require("../../prisma/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validation = yield ResetPassword_1.default.safeParseAsync(body);
        if (!validation.success)
            return res
                .status(400)
                .json({
                message: validation.error.errors[0],
            })
                .send();
        const encryptedPass = yield bcrypt_1.default.hash(body.newPassword, Number(process.env.ROUNDS) || 10);
        const editedUser = yield db_1.default.user.update({
            where: { email: body.user.email },
            data: { password: encryptedPass },
        });
        return res
            .status(200)
            .json({ message: "رمز عبور با موفقیت تغییر پیدا کرد" })
            .send();
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
            message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
            error,
        })
            .send();
    }
}));
exports.default = router;
//# sourceMappingURL=resetPassword.js.map