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
const Course_1 = __importDefault(require("../../../schemas/Course"));
const db_1 = __importDefault(require("../../../prisma/db"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validation = yield Course_1.default.safeParseAsync(body);
        if (!validation.success)
            return res
                .status(400)
                .json({ message: validation.error.errors[0] })
                .send();
        const { description, img, price, title, link } = body;
        const course = yield db_1.default.course.create({
            data: { description, title, img, price },
        });
        return res
            .status(200)
            .json({ message: "دوره با موفقیت ایجاد شد", course })
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
//# sourceMappingURL=createCourse.js.map