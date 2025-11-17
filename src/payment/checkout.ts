import { Request, Response, Router } from "express";
import { User } from "@prisma/client";
import prisma from "../../prisma/db";
import { zarinpal } from "../../utils/zarinpal";
import { authorization } from "../../middleware/authorization";
import { isProduction } from "../../utils/cookieOptions";

const router = Router();

router.post("/", authorization, async (req: Request, res: Response) => {
  try {
    const body: { courseIds: string[]; user: User } = req.body;

    const { user, courseIds } = body;

    if (courseIds.length === 0)
      return res.status(400).json({ message: "سبد خرید خالی میباشد" }).send();

    const courseIdsAsNumber = courseIds.map((id) => Number(id));
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIdsAsNumber } },
    });

    if (courses.length === 0)
      return res
        .status(400)
        .json({ message: "دوره های سبد خرید نامعتبر میباشد" })
        .send();

    const totalPrice = courses.reduce(
      (accumulator, currentVal) => accumulator + currentVal.price,
      0
    );
    const validCourseIds = courses.map((c) => ({ courseId: c.id }));

    for (const { id } of courses) {
      const userOnCourse = await prisma.usersOnCourses.findUnique({
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
    const paymentRequest = await zarinpal.payments.create({
      amount: totalPrice,
      description: `آکادمی کاراته سنسی یاری`,
      callback_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/verify`,
      email: user.email,
    });

    console.log(
      "Payment request response:",
      JSON.stringify(paymentRequest, null, 2)
    );

    if (paymentRequest.data.code === 100) {
      // Get authority from Zarinpal response
      const authority = paymentRequest.data.authority;

      // Create transaction record (initially unpaid) with Zarinpal's authority
      const transaction = await prisma.transaction.create({
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
      // Use sandbox URL for development, production URL for production
      const baseUrl = isProduction
        ? "https://www.zarinpal.com/pg/StartPay"
        : "https://sandbox.zarinpal.com/pg/StartPay";
      const paymentUrl = `${baseUrl}/${authority}`;
      console.log("Payment URL:", paymentUrl);

      // Return payment URL in response
      return res.status(200).json({
        message: "در حال انتقال به درگاه پرداخت...",
        paymentUrl,
        authority,
        transactionId: transaction.id,
      });
    } else {
      // Payment request failed
      return res.status(400).json({
        message: "خطا در ایجاد درخواست پرداخت. لطفا دوباره تلاش کنید.",
        error: paymentRequest,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "خطا در پردازش درخواست پرداخت",
        error: error instanceof Error ? error.message : "خطای نامشخص",
      })
      .send();
  }
});

export default router;
