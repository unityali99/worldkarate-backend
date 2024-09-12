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
const db_1 = __importDefault(require("../../prisma/db"));
const generateUniqueTransactionId_1 = require("../../utils/generateUniqueTransactionId");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { user, courseIds } = body;
        if (courseIds.length === 0)
            return res.status(400).json({ message: "سبد خرید خالی میباشد" }).send();
        const courseIdsAsNumber = courseIds.map((id) => Number(id));
        const courses = yield db_1.default.course.findMany({
            where: { id: { in: courseIdsAsNumber } },
        });
        if (courses.length === 0)
            return res
                .status(400)
                .json({ message: "دوره های سبد خرید نامعتبر میباشد" })
                .send();
        const totalPrice = courses.reduce((accumulator, currentVal) => accumulator + currentVal.price, 0);
        const validCourseIds = courses.map((c) => ({ courseId: c.id }));
        for (const { id } of courses) {
            const userOnCourse = yield db_1.default.usersOnCourses.findUnique({
                where: { userId_courseId: { courseId: id, userId: user.id } },
            });
            if (userOnCourse)
                return res
                    .status(400)
                    .json({
                    message: "یکی یا چند تا از دوره های سبد خرید قبلا خریداری شده اند",
                })
                    .send();
        }
        const transactionId = yield (0, generateUniqueTransactionId_1.generateUniqueTransactionId)();
        const transaction = yield db_1.default.transaction.create({
            data: {
                isPaid: true,
                transactionId,
                totalPrice,
                user: { connect: { id: user.id } },
                TransactionsOnCourses: { createMany: { data: [...validCourseIds] } },
            },
        });
        const newUserOnCourse = yield db_1.default.user.update({
            where: { id: user.id },
            data: { courses: { createMany: { data: [...validCourseIds] } } },
        });
        res
            .status(200)
            .json({ message: "پرداخت با موفقیت انجام شد", courses, transaction });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
            message: "پرداخت با خطا مواجه شد. درصورت برداشت از حساب، مبلغ کسر شده حداکثر تا 72 ساعت به حساب شما بازگشت خواهد خورد",
            error,
        })
            .send();
    }
}));
exports.default = router;
//# sourceMappingURL=checkout.js.map