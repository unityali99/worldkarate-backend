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
const Profile_1 = __importDefault(require("../../schemas/auth/Profile"));
const db_1 = __importDefault(require("../../prisma/db"));
const createJwt_1 = require("../../utils/createJwt");
const cookieOptions_1 = require("../../utils/cookieOptions");
const router = (0, express_1.Router)();
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { email, firstName, lastName, user } = body;
        const validation = yield Profile_1.default.safeParseAsync(body);
        if (!validation.success)
            return res
                .status(400)
                .json({
                message: "لطفا اطلاعات را به درستی وارد کنید",
                error: validation.error.errors[0],
            })
                .send();
        const editedUser = yield db_1.default.user.update({
            where: { id: user.id },
            data: { email, firstName, lastName },
        });
        const newToken = (0, createJwt_1.createJwt)(editedUser);
        return res
            .cookie(createJwt_1.tokenCookieName, newToken, cookieOptions_1.cookieOptions)
            .status(200)
            .json({ message: "اطلاعات کاربری با موفقیت اصلاح شد" })
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
//# sourceMappingURL=profile.js.map