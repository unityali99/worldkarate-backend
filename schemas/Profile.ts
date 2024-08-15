import { z } from "zod";

const Profile = z.object({
  firstName: z
    .string({ invalid_type_error: "First name should be of type string" })
    .min(3, { message: "First name should be atleast 3 characters" })
    .max(20, "First name cannot be more than 20 characters")
    .optional(),
  lastName: z
    .string({ invalid_type_error: "Last name should be of type string" })
    .min(3, { message: "Last name should be atleast 3 characters" })
    .max(20, "Last name cannot be more than 20 characters")
    .optional(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" })
    .optional(),
});

export type ProfileType = z.infer<typeof Profile>;

export default Profile;
