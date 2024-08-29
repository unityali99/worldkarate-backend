import { passwordRegex } from "../../utils/passwordRegex";
import { z } from "zod";

const requiredError = "لطفا رمز عبور خود را انتخاب کنید";
const regexError =
  "رمز عبور باید حداقل 8 کاراکتر شامل حداقل یک حرف و یک عدد باشد";

const ResetPassword = z
  .object({
    newPassword: z
      .string({ required_error: requiredError })
      .regex(passwordRegex, regexError),
    repeatPassword: z
      .string({ required_error: requiredError })
      .regex(passwordRegex, regexError),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "تکرار رمز عبور همخوانی ندارد",
    path: ["newPassword"],
  });

export type ResetPasswordType = z.infer<typeof ResetPassword>;

export default ResetPassword;
