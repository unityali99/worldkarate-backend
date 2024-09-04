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
const Login_1 = __importDefault(require("../../schemas/auth/Login"));
const db_1 = __importDefault(require("../../prisma/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createJwt_1 = require("../../utils/createJwt");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validation = yield Login_1.default.safeParseAsync(body);
        const { email, password } = body;
        if (!validation.success)
            return res
                .status(400)
                .json({
                message: "نام کاربری یا رمز عبور صحیح نمیباشد",
                error: validation.error.errors[0],
            })
                .send();
        const user = yield db_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res
                .status(403)
                .json({
                message: "نام کاربری یا رمز عبور صحیح نمیباشد",
            })
                .send();
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid)
            return res
                .status(403)
                .json({
                message: "نام کاربری یا رمز عبور صحیح نمیباشد",
            })
                .send();
        const jwtToken = (0, createJwt_1.createJwt)(user);
        return res
            .cookie(createJwt_1.tokenCookieName, jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
            .status(200)
            .json({
            message: "ورود موفقیت آمیز بود",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        })
            .send();
    }
    catch (error) {
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
//# sourceMappingURL=login.js.map