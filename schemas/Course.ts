import { z } from "zod";

const Course = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(5, "Title should not be less than 5 characters")
    .max(50, "Title should not be more than 50 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(20, "Description should not be less than 20 characters")
    .max(150, "Description should not be more than 150 characters"),
  price: z
    .number({ required_error: "Number is requried" })
    .nonnegative("Price can't be negative"),
  img: z.string({ required_error: "Course image is required" }),
});

export type CourseType = z.infer<typeof Course>;

export default Course;
