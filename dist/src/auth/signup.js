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
const Register_1 = __importDefault(require("../../schemas/auth/Register"));
const db_1 = __importDefault(require("../../prisma/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateUniqueString_1 = require("../../utils/generateUniqueString");
const capitlizeFirstLetter_1 = __importDefault(require("../../utils/capitlizeFirstLetter"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { email, firstName, lastName, password } = body;
        const validation = yield Register_1.default.safeParseAsync(body);
        if (!validation.success)
            return res
                .status(400)
                .json({
                message: "لطفا اطلاعات را به درستی وارد کنید",
                error: validation.error.errors[0],
            })
                .send();
        const user = yield db_1.default.user.findUnique({ where: { email } });
        if (user)
            return res
                .status(409)
                .json({
                message: "حساب کاربری قبلا ایجاد شده است",
            })
                .send();
        const encryptedPass = yield bcrypt_1.default.hash(password, Number(process.env.ROUNDS) || 10);
        const verificationKey = (0, generateUniqueString_1.generateUniqueString)(83);
        const newUser = yield db_1.default.user.create({
            data: {
                email,
                firstName: (0, capitlizeFirstLetter_1.default)(firstName),
                lastName: (0, capitlizeFirstLetter_1.default)(lastName),
                password: encryptedPass,
                verificationKey: verificationKey,
            },
        });
        return res
            .status(200)
            .json({ message: "حساب کاربری با موفقیت ایجاد شد", verificationKey })
            .send();
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
//# sourceMappingURL=signup.js.map