import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authorization } from "../../middleware/authorization";
import { adminAuth } from "../../middleware/adminAuth";
import { validate } from "../../middleware/validate";
import Course from "../../schemas/Course";

const router = Router();

// Public course fetching
router.get("/fetch-course", CourseController.getAll);
router.get("/fetch-course/:courseId", CourseController.getById);

// Admin course management
router.post(
  "/create-course",
  authorization,
  adminAuth,
  validate(Course),
  CourseController.create
);
router.delete(
  "/delete-course/:courseId",
  authorization,
  adminAuth,
  CourseController.delete
);
router.get(
  "/admin/fetch-course/:email",
  authorization,
  adminAuth,
  CourseController.getAdminCoursesByEmail
);

// User enrolled courses
router.get(
  "/user/fetch-course",
  authorization,
  CourseController.getUserCourses
);

export default router;
