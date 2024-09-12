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
const db_1 = __importDefault(require("../../../prisma/db"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield db_1.default.course.findMany();
        return res.status(200).json(courses);
    }
    catch (error) {
        return res.status(500).json({
            message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
            error,
        });
    }
}));
router.get("/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = Number(req.params.courseId);
    try {
        const course = yield db_1.default.course.findUnique({ where: { id: courseId } });
        if (!course)
            return res.status(404).json({ message: "دوره ای یافت نشد" }).send();
        return res.status(200).json(course);
    }
    catch (error) {
        return res
            .status(400)
            .json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" });
    }
}));
exports.default = router;
//# sourceMappingURL=fetchCourses.js.map