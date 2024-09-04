"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordRegex_1 = require("../../utils/passwordRegex");
const zod_1 = require("zod");
const requiredError = "لطفا رمز عبور خود را انتخاب کنید";
const regexError = "رمز عبور باید حداقل 8 کاراکتر شامل حداقل یک حرف و یک عدد باشد";
const ResetPassword = zod_1.z
    .object({
    newPassword: zod_1.z
        .string({ required_error: requiredError })
        .regex(passwordRegex_1.passwordRegex, regexError),
    repeatPassword: zod_1.z
        .string({ required_error: requiredError })
        .regex(passwordRegex_1.passwordRegex, regexError),
})
    .refine((data) => data.newPassword === data.repeatPassword, {
    message: "تکرار رمز عبور همخوانی ندارد",
    path: ["newPassword"],
});
exports.default = ResetPassword;
//# sourceMappingURL=ResetPassword.js.map