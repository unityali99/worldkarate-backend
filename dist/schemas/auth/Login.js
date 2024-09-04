"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const passwordRegex_1 = require("../../utils/passwordRegex");
const Login = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" }),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .regex(passwordRegex_1.passwordRegex),
});
exports.default = Login;
//# sourceMappingURL=Login.js.map