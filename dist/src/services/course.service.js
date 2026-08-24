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
exports.CourseService = void 0;
const course_repository_1 = require("../repositories/course.repository");
const user_repository_1 = require("../repositories/user.repository");
class CourseService {
    static getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return course_repository_1.CourseRepository.findAll();
        });
    }
    static getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield course_repository_1.CourseRepository.findById(courseId);
            if (!course) {
                return {
                    status: 404,
                    message: "دوره ای یافت نشد",
                };
            }
            return {
                status: 200,
                course,
            };
        });
    }
    static createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, img, price, title, link } = data;
            const course = yield course_repository_1.CourseRepository.create({
                description,
                title,
                img,
                price,
                link,
            });
            return {
                status: 200,
                message: "دوره با موفقیت ایجاد شد",
                course,
            };
        });
    }
    static deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield course_repository_1.CourseRepository.deleteById(courseId);
            return {
                status: 200,
                message: "دوره با موفقیت حذف شد",
            };
        });
    }
    static getUserCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return course_repository_1.CourseRepository.findByUserId(userId);
        });
    }
    static getAdminCoursesByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.findByEmail(email);
            if (!user) {
                return {
                    status: 400,
                    message: "کاربری با این ایمل وجود ندارد",
                };
            }
            const userOnCourses = yield user_repository_1.UserRepository.findEnrolledCourseIds(user.id);
            const courseIds = userOnCourses.map((c) => c.courseId);
            const courses = yield course_repository_1.CourseRepository.findByIds(courseIds);
            return {
                status: 200,
                courses,
            };
        });
    }
}
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map