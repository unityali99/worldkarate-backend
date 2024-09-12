import { Request, Response, Router } from "express";
import { User } from "@prisma/client";
import prisma from "../../prisma/db";
import { generateUniqueTransactionId } from "../../utils/generateUniqueTransactionId";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
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
            message: "یکی یا چند تا از دوره های سبد خرید قبلا خریداری شده اند",
          })
          .send();
    }

    const transactionId = await generateUniqueTransactionId();
    const transaction = await prisma.transaction.create({
      data: {
        isPaid: true,
        transactionId,
        totalPrice,
        user: { connect: { id: user.id } },
        TransactionsOnCourses: { createMany: { data: [...validCourseIds] } },
      },
    });

    const newUserOnCourse = await prisma.user.update({
      where: { id: user.id },
      data: { courses: { createMany: { data: [...validCourseIds] } } },
    });

    res
      .status(200)
      .json({ message: "پرداخت با موفقیت انجام شد", courses, transaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message:
          "پرداخت با خطا مواجه شد. درصورت برداشت از حساب، مبلغ کسر شده حداکثر تا 72 ساعت به حساب شما بازگشت خواهد خورد",
        error,
      })
      .send();
  }
});

export default router;
