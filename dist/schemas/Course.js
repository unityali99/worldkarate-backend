"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Course = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(5, "Title should not be less than 5 characters")
        .max(50, "Title should not be more than 50 characters"),
    description: zod_1.z
        .string({ required_error: "Description is required" })
        .min(20, "Description should not be less than 20 characters")
        .max(150, "Description should not be more than 150 characters"),
    price: zod_1.z
        .number({ required_error: "Number is requried" })
        .nonnegative("Price can't be negative"),
    img: zod_1.z.string({ required_error: "Course image is required" }),
});
exports.default = Course;
//# sourceMappingURL=Course.js.map