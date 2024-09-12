import { Request, Response, Router } from "express";
import {
  default as Newsletter,
  ForgetPasswordType as NewsletterType,
} from "../../schemas/auth/ForgetPassword";
import prisma from "../../prisma/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: NewsletterType = req.body;
    const validation = await Newsletter.safeParseAsync(body);

    if (!validation.success)
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });

    const existing = await prisma.newsletter.findUnique({
      where: { email: body.email },
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "ایمیل وارد شده در خبرنامه ثبت نام شده است" });

    const newsLetterEmail = await prisma.newsletter.create({
      data: { email: body.email },
    });

    return res
      .status(200)
      .json({ message: "ایمیل با موفقیت به لیست خبرنامه اضافه شد" });
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
