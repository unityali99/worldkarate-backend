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
// Payment verification callback endpoint
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { authority } = req.body;
        // const auth = authority as string;
        // if (!auth || typeof auth !== "string") {
        //   console.log("Missing or invalid authority:", {
        //     authority,
        //   });
        //   return res.status(400).json({
        //     status: "error",
        //     message: "پارامترهای پرداخت نامعتبر است",
        //   });
        // }
        // Find the transaction by authority
        const transaction = yield db_1.default.transaction.findUnique({
            where: { authority },
            include: {
                user: true,
                transactionsOnCourses: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!transaction) {
            return res.status(404).json({
                status: "error",
                message: "تراکنش یافت نشد",
            });
        }
        // If transaction is already paid, return success
        if (transaction.isPaid) {
            const courses = transaction.transactionsOnCourses.map((tc) => tc.course);
            return res.status(200).json({
                status: "success",
                message: "پرداخت قبلا تایید شده است",
                courses,
                transaction,
            });
        }
        // Verify payment with Zarinpal
        const verification = yield zarinpal_1.zarinpal.verifications.verify({
            amount: transaction.totalPrice,
            authority,
        });
        console.log(verification);
        if (verification.data.code === 100) {
            // Payment successful - update transaction as paid
            const refId = String(verification.data.ref_id);
            yield db_1.default.transaction.update({
                where: { id: transaction.id },
                data: {
                    isPaid: true,
                    transactionId: refId, // Store Zarinpal's refId
                },
            });
            // Add courses to user
            const courseIds = transaction.transactionsOnCourses.map((tc) => ({
                courseId: tc.courseId,
            }));
            yield db_1.default.user.update({
                where: { id: transaction.userId },
                data: {
                    courses: {
                        createMany: {
                            data: courseIds,
                            skipDuplicates: true, // Skip if user already has the course
                        },
                    },
                },
            });
            const courses = transaction.transactionsOnCourses.map((tc) => tc.course);
            // Return success response
            return res.status(200).json({
                message: "پرداخت با موفقیت انجام شد",
                courses,
                transaction: {
                    transactionId: refId,
                    isPaid: true,
                    totalPrice: transaction.totalPrice,
                },
            });
        }
        else {
            // Payment failed
            return res.status(400).json({
                message: "پرداخت ناموفق بود",
                error: verification.message || "خطا در تایید پرداخت",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "خطا در تایید پرداخت",
            error: ((_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) || (error === null || error === void 0 ? void 0 : error.message) || "خطای نامشخص",
        });
    }
}));
exports.default = router;
//# sourceMappingURL=verify.js.map