import { Request, Response, Router } from "express";
import Profile, { ProfileType } from "../../schemas/auth/Profile";
import { User } from "@prisma/client";
import prisma from "../../prisma/db";
import { createJwt, tokenCookieName } from "../../utils/createJwt";
import { cookieOptions } from "../../utils/cookieOptions";

const router = Router();

router.put("/", async (req: Request, res: Response) => {
  try {
    const body: ProfileType & { user: User } = req.body;
    const { email, firstName, lastName, user } = body;
    const validation = await Profile.safeParseAsync(body);
    if (!validation.success)
      return res
        .status(400)
        .json({
          message: "لطفا اطلاعات را به درستی وارد کنید",
          error: validation.error.errors[0],
        })
        .send();

    const editedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email, firstName, lastName },
    });
    const newToken = createJwt(editedUser);

    return res
      .cookie(tokenCookieName, newToken, cookieOptions)
      .status(200)
      .json({ message: "اطلاعات کاربری با موفقیت اصلاح شد" })
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
