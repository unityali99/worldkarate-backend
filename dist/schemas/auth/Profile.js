"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Profile = zod_1.z.object({
    firstName: zod_1.z
        .string({ invalid_type_error: "First name should be of type string" })
        .min(3, { message: "First name should be atleast 3 characters" })
        .max(20, "First name cannot be more than 20 characters")
        .regex(/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/, { message: "First name can only contain letters" })
        .optional(),
    lastName: zod_1.z
        .string({ invalid_type_error: "Last name should be of type string" })
        .min(3, { message: "Last name should be atleast 3 characters" })
        .max(20, "Last name cannot be more than 20 characters")
        .regex(/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/, { message: "Last name can only contain letters" })
        .optional(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" })
        .optional(),
});
exports.default = Profile;
//# sourceMappingURL=Profile.js.map