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
const OTP_1 = __importDefault(require("../../schemas/auth/OTP"));
const db_1 = __importDefault(require("../../prisma/db"));
const createJwt_1 = require("../../utils/createJwt");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validation = yield OTP_1.default.safeParseAsync(body);
        const user = yield db_1.default.user.findUnique({ where: { email: body.email } });
        if (!validation.success || !user)
            return res.status(400).json({ message: "ایمیل صحیح نمیباشد" });
        const isOtpValid = body.OTP === user.OTP;
        if (!isOtpValid)
            return res.status(400).json({ message: "کد یکبار مصرف صحیح نمیباشد" });
        const { email, firstName, lastName } = user;
        const jwt = (0, createJwt_1.createJwt)({ email, firstName, lastName });
        return res
            .cookie(createJwt_1.tokenCookieName, jwt, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
            .status(200)
            .json({ message: "لطفا رمز عبور خود را انتخاب نمایید" });
    }
    catch (error) {
        return res
            .status(500)
            .json({
            message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
        })
            .send();
    }
}));
exports.default = router;
//# sourceMappingURL=validateOTP.js.map