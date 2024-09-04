"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const passwordRegex_1 = require("../../utils/passwordRegex");
const Register = zod_1.z.object({
    firstName: zod_1.z
        .string({ invalid_type_error: "First name should be of type string" })
        .min(3, { message: "First name should be atleast 3 characters" })
        .max(20, "First name cannot be more than 20 characters"),
    lastName: zod_1.z
        .string({ invalid_type_error: "Last name should be of type string" })
        .min(3, { message: "Last name should be atleast 3 characters" })
        .max(20, "Last name cannot be more than 20 characters"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" }),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .regex(passwordRegex_1.passwordRegex),
});
exports.default = Register;
//# sourceMappingURL=Register.js.map