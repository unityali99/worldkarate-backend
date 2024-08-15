import { z } from "zod";

const ForgetPassword = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
});

export type ForgetPasswordType = z.infer<typeof ForgetPassword>;

export default ForgetPassword;
