import { Request, Response, Router } from "express";
import ForgetPassword, {
  ForgetPasswordType,
} from "../../schemas/ForgetPassword";
import prisma from "../../prisma/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const body: ForgetPasswordType = req.body;

  const validation = await ForgetPassword.safeParseAsync(body);

  if (!validation.success)
    return res.status(400).json({
      message: "ایمیل صحیح نمیباشد",
    });

  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user)
    return res.status(404).json({
      message: "ایمیل صحیح نمیباشد",
    });

  const OTP = generateOtp();

  await prisma.user.update({ where: { email: body.email }, data: { OTP } });

  return res.status(200).json({ message: "کد با موفقیت به شما ایمیل شد", OTP });
});
