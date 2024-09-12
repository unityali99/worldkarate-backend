import { Request, Response, Router } from "express";
import Course, { CourseType } from "../../../schemas/Course";
import prisma from "../../../prisma/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: CourseType = req.body;

    const validation = await Course.safeParseAsync(body);

    if (!validation.success)
      return res
        .status(400)
        .json({ message: validation.error.errors[0] })
        .send();

    const { description, img, price, title, link } = body;

    const course = await prisma.course.create({
      data: { description, title, img, price },
    });

    return res
      .status(200)
      .json({ message: "دوره با موفقیت ایجاد شد", course })
      .send();
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
        error,
      })
      .send();
  }
});

export default router;
