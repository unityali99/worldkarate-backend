import { Request, Response, Router } from "express";
import prisma from "../../prisma/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
      error,
    });
  }
});

router.get("/:courseId", async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course)
      return res.status(404).json({ message: "دوره ای یافت نشد" }).send();

    return res.status(200).json(course);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" });
  }
});

export default router;
