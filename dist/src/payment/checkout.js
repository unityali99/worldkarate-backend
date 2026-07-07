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
const zarinpal_1 = require("../../utils/zarinpal");
const authorization_1 = require("../../middleware/authorization");
const router = (0, express_1.Router)();
router.post("/", authorization_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    message: "یک یا چند مورد از دوره های سبد خرید قبلا خریداری شده است",
                })
                    .send();
        }
        // Create payment request with Zarinpal FIRST to get the authority
        const paymentRequest = yield zarinpal_1.zarinpal.payments.create({
            amount: totalPrice,
            description: `آکادمی کاراته سنسی یاری`,
            callback_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/verify`,
            email: user.email,
        });
        console.log("Payment request response:", JSON.stringify(paymentRequest, null, 2));
        if (paymentRequest.data.code === 100) {
            // Get authority from Zarinpal response
            const authority = paymentRequest.data.authority;
            // Create transaction record (initially unpaid) with Zarinpal's authority
            const transaction = yield db_1.default.transaction.create({
                data: {
                    isPaid: false,
                    transactionId: authority, // Store authority as transactionId
                    totalPrice,
                    authority,
                    user: { connect: { id: user.id } },
                    transactionsOnCourses: { createMany: { data: [...validCourseIds] } },
                },
            });
            // Payment request successful, return payment URL
            const paymentUrl = zarinpal_1.zarinpal.payments.getRedirectUrl(authority);
            console.log("Payment URL:", paymentUrl);
            // Return payment URL in response
            return res.status(200).json({
                message: "در حال انتقال به درگاه پرداخت...",
                paymentUrl,
                authority,
                transactionId: transaction.id,
            });
        }
        else {
            // Payment request failed
            return res.status(400).json({
                message: "خطا در ایجاد درخواست پرداخت. لطفا دوباره تلاش کنید.",
                error: paymentRequest,
            });
        }
    }
    catch (error) {
        console.log(error);
        const gatewayError = error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response
            ? error.response.data
            : undefined;
        return res
            .status(500)
            .json({
            message: "خطا در پردازش درخواست پرداخت",
            error: gatewayError ||
                (error instanceof Error ? error.message : "خطای نامشخص"),
        })
            .send();
    }
}));
exports.default = router;
//# sourceMappingURL=checkout.js.map