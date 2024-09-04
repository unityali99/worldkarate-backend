"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ForgetPassword = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" }),
});
exports.default = ForgetPassword;
//# sourceMappingURL=ForgetPassword.js.map