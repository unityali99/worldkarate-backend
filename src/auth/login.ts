import { Request, Response, Router } from "express";
import Login, { LoginType } from "../../schemas/auth/Login";
import prisma from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createJwt, tokenCookieName } from "../../utils/createJwt";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: LoginType = req.body;
    const validation = await Login.safeParseAsync(body);
    const { email, password } = body;

    if (!validation.success)
      return res
        .status(400)
        .json({
          message: "نام کاربری یا رمز عبور صحیح نمیباشد",
          error: validation.error.errors[0],
        })
        .send();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res
        .status(403)
        .json({
          message: "نام کاربری یا رمز عبور صحیح نمیباشد",
        })
        .send();

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res
        .status(403)
        .json({
          message: "نام کاربری یا رمز عبور صحیح نمیباشد",
        })
        .send();

    const jwtToken = createJwt(user);

    return res
      .cookie(tokenCookieName, jwtToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "ورود موفقیت آمیز بود",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      })
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
