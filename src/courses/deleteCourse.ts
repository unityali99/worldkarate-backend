import { Request, Response, Router } from "express";
import prisma from "../../prisma/db";

const router = Router();

router.delete("/:courseId", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.courseId);

    await prisma.course.delete({ where: { id } });

    return res.status(200).json({ message: "دوره با موفقیت حذف شد" });
  } catch (error) {
    return res.status(500).json({
      message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
      error,
    });
  }
});

export default router;
