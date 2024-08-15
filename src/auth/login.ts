import { Request, Response, Router } from "express";
import Login, { LoginType } from "../../schemas/Login";
import prisma from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: LoginType = req.body;
    const validation = await Login.safeParseAsync(body);
    const { email, password } = body;

    if (!validation.success)
      return res.status(400).json({
        message: "نام کاربری یا رمز عبور صحیح نمیباشد",
        error: validation.error.errors[0],
      });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(403).json({
        message: "نام کاربری یا رمز عبور صحیح نمیباشد",
      });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res.status(403).json({
        message: "نام کاربری یا رمز عبور صحیح نمیباشد",
      });

    const jwtToken = jwt.sign(
      { email: user.email, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "ورود موفقیت آمیز بود",
      jwt: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
      error,
    });
  }
});

export default router;
