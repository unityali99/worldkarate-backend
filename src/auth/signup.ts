import { Request, Response, Router } from "express";
import Register, { RegisterType } from "../../schemas/Register";
import prisma from "../../prisma/db";
import bcrypt from "bcrypt";
import { generateUniqueString } from "../../utils/generateUniqueString";
import capitalizeFirstLetter from "../../utils/capitlizeFirstLetter";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: RegisterType = req.body;
    const { email, firstName, lastName, password } = body;
    const validation = await Register.safeParseAsync(body);

    if (!validation.success)
      return res
        .status(400)
        .json({
          message: "لطفا اطلاعات را به درستی وارد کنید",
          error: validation.error.errors[0],
        })
        .send();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user)
      return res
        .status(409)
        .json({
          message: "حساب کاربری قبلا ایجاد شده است",
        })
        .send();

    const encryptedPass = await bcrypt.hash(
      password,
      Number(process.env.ROUNDS) || 10
    );

    const verificationKey = generateUniqueString(83);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        password: encryptedPass,
        verificationKey: verificationKey,
      },
    });
    return res
      .status(200)
      .json({ message: "حساب کاربری با موفقیت ایجاد شد", verificationKey })
      .send();
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
