"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const authorization_1 = require("../../middleware/authorization");
const adminAuth_1 = require("../../middleware/adminAuth");
const validate_1 = require("../../middleware/validate");
const Course_1 = __importDefault(require("../../schemas/Course"));
const router = (0, express_1.Router)();
// Public course fetching
router.get("/fetch-course", course_controller_1.CourseController.getAll);
router.get("/fetch-course/:courseId", course_controller_1.CourseController.getById);
// Admin course management
router.post("/create-course", authorization_1.authorization, adminAuth_1.adminAuth, (0, validate_1.validate)(Course_1.default), course_controller_1.CourseController.create);
router.delete("/delete-course/:courseId", authorization_1.authorization, adminAuth_1.adminAuth, course_controller_1.CourseController.delete);
router.get("/admin/fetch-course/:email", authorization_1.authorization, adminAuth_1.adminAuth, course_controller_1.CourseController.getAdminCoursesByEmail);
// User enrolled courses
router.get("/user/fetch-course", authorization_1.authorization, course_controller_1.CourseController.getUserCourses);
exports.default = router;
//# sourceMappingURL=course.routes.js.map