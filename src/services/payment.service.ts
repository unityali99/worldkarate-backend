import { User } from "@prisma/client";
import { CourseRepository } from "../repositories/course.repository";
import { UserRepository } from "../repositories/user.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { zarinpal } from "../../utils/zarinpal";

export class PaymentService {
  static async checkout(user: User, rawCourseIds: string[]) {
    if (!rawCourseIds || rawCourseIds.length === 0) {
      return {
        status: 400 as const,
        message: "سبد خرید خالی میباشد",
      };
    }

    const courseIdsAsNumber = rawCourseIds.map((id) => Number(id));
    const courses = await CourseRepository.findByIds(courseIdsAsNumber);

    if (courses.length === 0) {
      return {
        status: 400 as const,
        message: "دوره های سبد خرید نامعتبر میباشد",
      };
    }

    const totalPrice = courses.reduce(
      (acc, current) => acc + current.price,
      0
    );

    for (const { id } of courses) {
      const alreadyEnrolled = await UserRepository.findUserCourseEnrollment(
        user.id,
        id
      );
      if (alreadyEnrolled) {
        return {
          status: 400 as const,
          message: "یک یا چند مورد از دوره های سبد خرید قبلا خریداری شده است",
        };
      }
    }

    const paymentRequest = await zarinpal.payments.create({
      amount: totalPrice,
      description: "آکادمی کاراته سنسی یاری",
      callback_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/verify`,
      email: user.email,
    });

    if (paymentRequest.data.code === 100) {
      const authority = paymentRequest.data.authority;

      const transaction = await TransactionRepository.createPendingTransaction({
        userId: user.id,
        totalPrice,
        authority,
        courseIds: courses.map((c) => c.id),
      });

      const paymentUrl = zarinpal.payments.getRedirectUrl(authority);

      return {
        status: 200 as const,
        message: "در حال انتقال به درگاه پرداخت...",
        paymentUrl,
        authority,
        transactionId: transaction.id,
      };
    }

    return {
      status: 400 as const,
      message: "خطا در ایجاد درخواست پرداخت. لطفا دوباره تلاش کنید.",
      error: paymentRequest,
    };
  }

  static async verify(authority: string) {
    const transaction = await TransactionRepository.findByAuthorityWithDetails(
      authority
    );

    if (!transaction) {
      return {
        status: 404 as const,
        message: "تراکنش یافت نشد",
      };
    }

    const courses = transaction.transactionsOnCourses.map((tc) => tc.course);

    if (transaction.isPaid) {
      return {
        status: 200 as const,
        isAlreadyPaid: true,
        message: "پرداخت قبلا تایید شده است",
        courses,
        transaction,
      };
    }

    const verification = await zarinpal.verifications.verify({
      amount: transaction.totalPrice,
      authority,
    });

    if (verification.data.code === 100) {
      const refId = String(verification.data.ref_id);

      await TransactionRepository.markAsPaid(transaction.id, refId);

      const courseIds = transaction.transactionsOnCourses.map(
        (tc) => tc.courseId
      );
      await UserRepository.enrollCourses(transaction.userId, courseIds);

      return {
        status: 200 as const,
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
      status: 400 as const,
      message: "پرداخت ناموفق بود",
      error: verification.message || "خطا در تایید پرداخت",
    };
  }
}
