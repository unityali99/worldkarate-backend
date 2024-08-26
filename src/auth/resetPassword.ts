import { Request, Response, Router } from "express";
import ResetPassword, { ResetPasswordType } from "../../schemas/ResetPassword";
import prisma from "../../prisma/db";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: ResetPasswordType & { user: User } = req.body;

    const validation = await ResetPassword.safeParseAsync(body);

    if (!validation.success)
      return res
        .status(400)
        .json({
          message: validation.error.errors[0],
        })
        .send();

    const encryptedPass = await bcrypt.hash(
      body.newPassword,
      Number(process.env.ROUNDS) || 10
    );

    const editedUser = await prisma.user.update({
      where: { email: body.user.email },
      data: { password: encryptedPass },
    });

    return res
      .status(200)
      .json({ message: "رمز عبور با موفقیت تغییر پیدا کرد" })
      .send();
  } catch (error) {
    console.log(error);
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
