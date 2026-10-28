import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authorization } from "../../middleware/authorization";
import { adminAuth } from "../../middleware/adminAuth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import Course from "../../schemas/Course";

const router = Router();

// Public course fetching
router.get("/fetch-course", asyncHandler(CourseController.getAll));
router.get("/fetch-course/:courseId", asyncHandler(CourseController.getById));

// Admin course management
router.post(
  "/create-course",
  authorization,
  adminAuth,
  validate(Course),
  asyncHandler(CourseController.create),
);
router.delete(
  "/delete-course/:courseId",
  authorization,
  adminAuth,
  asyncHandler(CourseController.delete),
);
router.get(
  "/admin/fetch-course/:email",
  authorization,
  adminAuth,
  asyncHandler(CourseController.getAdminCoursesByEmail),
);

// User enrolled courses
router.get(
  "/user/fetch-course",
  authorization,
  asyncHandler(CourseController.getUserCourses),
);

export default router;
