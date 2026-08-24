"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const course_service_1 = require("../services/course.service");
class CourseController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield course_service_1.CourseService.getAllCourses();
                return res.status(200).json(courses);
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = Number(req.params.courseId);
            try {
                const result = yield course_service_1.CourseService.getCourseById(courseId);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message }).send();
                }
                return res.status(200).json(result.course);
            }
            catch (error) {
                return res.status(400).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield course_service_1.CourseService.createCourse(req.body);
                return res.status(200).json(result).send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.courseId);
                const result = yield course_service_1.CourseService.deleteCourse(id);
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
            }
        });
    }
    static getUserCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user || req.body.user;
                const courses = yield course_service_1.CourseService.getUserCourses(user.id);
                return res.status(200).json(courses);
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
            }
        });
    }
    static getAdminCoursesByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email;
                const result = yield course_service_1.CourseService.getAdminCoursesByEmail(email);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message });
                }
                return res.status(200).json(result.courses);
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
            }
        });
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map