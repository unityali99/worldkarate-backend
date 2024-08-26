import { Request, Response, Router } from "express";
import ForgetPassword, {
  ForgetPasswordType,
} from "../../schemas/ForgetPassword";
import prisma from "../../prisma/db";
import { generateOtp } from "../../utils/generateOtp";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: ForgetPasswordType = req.body;

    const validation = await ForgetPassword.safeParseAsync(body);

    if (!validation.success)
      return res
        .status(400)
        .json({
          message: "ایمیل صحیح نمیباشد",
        })
        .send();

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user)
      return res
        .status(404)
        .json({
          message: "ایمیل صحیح نمیباشد",
        })
        .send();

    const OTP = generateOtp();

    await prisma.user.update({ where: { email: body.email }, data: { OTP } });

    return res
      .status(200)
      .json({ message: "کد با موفقیت به شما ایمیل شد", OTP })
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
