"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const OTP = zod_1.z.object({
    OTP: zod_1.z
        .number({ required_error: "کد یکبار مصرف را وارد کنید" })
        .min(1000, "کد باید 4 رقم باشد")
        .max(9999, "کد باید 4 رقم باشد"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" }),
});
exports.default = OTP;
//# sourceMappingURL=OTP.js.map