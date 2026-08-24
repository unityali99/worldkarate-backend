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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const course_repository_1 = require("../repositories/course.repository");
const user_repository_1 = require("../repositories/user.repository");
const transaction_repository_1 = require("../repositories/transaction.repository");
const zarinpal_1 = require("../../utils/zarinpal");
class PaymentService {
    static checkout(user, rawCourseIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!rawCourseIds || rawCourseIds.length === 0) {
                return {
                    status: 400,
                    message: "سبد خرید خالی میباشد",
                };
            }
            const courseIdsAsNumber = rawCourseIds.map((id) => Number(id));
            const courses = yield course_repository_1.CourseRepository.findByIds(courseIdsAsNumber);
            if (courses.length === 0) {
                return {
                    status: 400,
                    message: "دوره های سبد خرید نامعتبر میباشد",
                };
            }
            const totalPrice = courses.reduce((acc, current) => acc + current.price, 0);
            for (const { id } of courses) {
                const alreadyEnrolled = yield user_repository_1.UserRepository.findUserCourseEnrollment(user.id, id);
                if (alreadyEnrolled) {
                    return {
                        status: 400,
                        message: "یک یا چند مورد از دوره های سبد خرید قبلا خریداری شده است",
                    };
                }
            }
            const paymentRequest = yield zarinpal_1.zarinpal.payments.create({
                amount: totalPrice,
                description: "آکادمی کاراته سنسی یاری",
                callback_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/verify`,
                email: user.email,
            });
            if (paymentRequest.data.code === 100) {
                const authority = paymentRequest.data.authority;
                const transaction = yield transaction_repository_1.TransactionRepository.createPendingTransaction({
                    userId: user.id,
                    totalPrice,
                    authority,
                    courseIds: courses.map((c) => c.id),
                });
                const paymentUrl = zarinpal_1.zarinpal.payments.getRedirectUrl(authority);
                return {
                    status: 200,
                    message: "در حال انتقال به درگاه پرداخت...",
                    paymentUrl,
                    authority,
                    transactionId: transaction.id,
                };
            }
            return {
                status: 400,
                message: "خطا در ایجاد درخواست پرداخت. لطفا دوباره تلاش کنید.",
                error: paymentRequest,
            };
        });
    }
    static verify(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_repository_1.TransactionRepository.findByAuthorityWithDetails(authority);
            if (!transaction) {
                return {
                    status: 404,
                    message: "تراکنش یافت نشد",
                };
            }
            const courses = transaction.transactionsOnCourses.map((tc) => tc.course);
            if (transaction.isPaid) {
                return {
                    status: 200,
                    isAlreadyPaid: true,
                    message: "پرداخت قبلا تایید شده است",
                    courses,
                    transaction,
                };
            }
            const verification = yield zarinpal_1.zarinpal.verifications.verify({
                amount: transaction.totalPrice,
                authority,
            });
            if (verification.data.code === 100) {
                const refId = String(verification.data.ref_id);
                yield transaction_repository_1.TransactionRepository.markAsPaid(transaction.id, refId);
                const courseIds = transaction.transactionsOnCourses.map((tc) => tc.courseId);
                yield user_repository_1.UserRepository.enrollCourses(transaction.userId, courseIds);
                return {
                    status: 200,
                    message: "پرداخت با موفقیت انجام شد",
                    courses,
                    transaction: {
                        transactionId: refId,
                        isPaid: true,
                        totalPrice: transaction.totalPrice,
                    },
                };
            }
            return {
                status: 400,
                message: "پرداخت ناموفق بود",
                error: verification.message || "خطا در تایید پرداخت",
            };
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map