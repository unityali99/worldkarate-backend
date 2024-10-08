import { Request, Response, Router } from "express";
import prisma from "../../../prisma/db";

const router = Router();

router.get("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user)
      return res.status(400).json({ message: "کاربری با این ایمل وجود ندارد" });

    const userOnCourses = await prisma.usersOnCourses.findMany({
      where: { userId: user.id },
    });
    const courseIds = userOnCourses.map((c) => c.userId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
      error,
    });
  }
});
export default router;
