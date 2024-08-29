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

export default router;
