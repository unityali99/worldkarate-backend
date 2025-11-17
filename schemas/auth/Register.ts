import { z } from "zod";
import { passwordRegex } from "../../utils/passwordRegex";

const Register = z.object({
  firstName: z
    .string({ invalid_type_error: "First name should be of type string" })
    .min(3, { message: "Firstname should be atleast 3 characters" })
    .regex(/^[\p{Letter}\s]*$/u, {
      message: "First name can only contain letters",
    })

    .max(20, "First name cannot be more than 20 characters"),
  lastName: z
    .string({ invalid_type_error: "Last name should be of type string" })
    .min(3, { message: "Lastname should be atleast 3 characters" })
    .regex(/^[\p{Letter}\s]*$/u, {
      message: "Last name can only contain letters",
    })
    .max(20, "Last name cannot be more than 20 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex),
});

export type RegisterType = z.infer<typeof Register>;

export default Register;
