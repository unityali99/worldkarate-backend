import { z } from "zod";

const OTP = z.object({
  OTP: z
    .number({ required_error: "کد یکبار مصرف را وارد کنید" })
    .min(1000, "کد باید 4 رقم باشد")
    .max(9999, "کد باید 4 رقم باشد"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
});

export type OTPType = z.infer<typeof OTP>;

export default OTP;
