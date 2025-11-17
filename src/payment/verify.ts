import { Request, Response, Router } from "express";
import prisma from "../../prisma/db";
import { zarinpal } from "../../utils/zarinpal";

// Payment verification callback endpoint
const router = Router();

router.post("/", async (req: Request, res: Response) => {
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
    const transaction = await prisma.transaction.findUnique({
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
    const verification = await zarinpal.verifications.verify({
      amount: transaction.totalPrice,
      authority,
    });

    console.log(verification);

    if (verification.data.code === 100) {
      // Payment successful - update transaction as paid
      const refId = verification.data.ref_id;

      await prisma.transaction.update({
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
      await prisma.user.update({
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
    } else {
      // Payment failed
      return res.status(400).json({
        message: "پرداخت ناموفق بود",
        error: verification.message || "خطا در تایید پرداخت",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "خطا در تایید پرداخت",
      error: error?.data?.errors?.[0] || error?.message || "خطای نامشخص",
    });
  }
});

export default router;
