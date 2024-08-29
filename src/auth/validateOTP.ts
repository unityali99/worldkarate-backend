import { Request, Response, Router } from "express";
import OTP, { OTPType } from "../../schemas/auth/OTP";
import prisma from "../../prisma/db";
import { createJwt, tokenCookieName } from "../../utils/createJwt";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: OTPType = req.body;
    const validation = await OTP.safeParseAsync(body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!validation.success || !user)
      return res.status(400).json({ message: "ایمیل صحیح نمیباشد" });

    const isOtpValid = body.OTP === user.OTP;

    if (!isOtpValid)
      return res.status(400).json({ message: "کد یکبار مصرف صحیح نمیباشد" });

    const { email, firstName, lastName } = user;
    const jwt = createJwt({ email, firstName, lastName });

    return res
      .cookie(tokenCookieName, jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "لطفا رمز عبور خود را انتخاب نمایید" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "خطا در سرور. لطفا به پشتیبانی پیام دهید",
      })
      .send();
  }
});

export default router;
