import { z } from "zod";

const Profile = z.object({
  firstName: z
    .string({ invalid_type_error: "First name should be of type string" })
    .min(3, { message: "First name should be atleast 3 characters" })
    .max(20, "First name cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/,
      { message: "First name can only contain letters" }
    )

    .optional(),
  lastName: z
    .string({ invalid_type_error: "Last name should be of type string" })
    .min(3, { message: "Last name should be atleast 3 characters" })
    .max(20, "Last name cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/,
      { message: "Last name can only contain letters" }
    )

    .optional(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" })
    .optional(),
});

export type ProfileType = z.infer<typeof Profile>;

export default Profile;
