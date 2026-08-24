import { CourseRepository } from "../repositories/course.repository";
import { UserRepository } from "../repositories/user.repository";
import { CourseType } from "../../schemas/Course";

export class CourseService {
  static async getAllCourses() {
    return CourseRepository.findAll();
  }

  static async getCourseById(courseId: number) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      return {
        status: 404 as const,
        message: "دوره ای یافت نشد",
      };
    }
    return {
      status: 200 as const,
      course,
    };
  }

  static async createCourse(data: CourseType) {
    const { description, img, price, title, link } = data;
    const course = await CourseRepository.create({
      description,
      title,
      img,
      price,
      link,
    });
    return {
      status: 200 as const,
      message: "دوره با موفقیت ایجاد شد",
      course,
    };
  }

  static async deleteCourse(courseId: number) {
    await CourseRepository.deleteById(courseId);
    return {
      status: 200 as const,
      message: "دوره با موفقیت حذف شد",
    };
  }

  static async getUserCourses(userId: number) {
    return CourseRepository.findByUserId(userId);
  }

  static async getAdminCoursesByEmail(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return {
        status: 400 as const,
        message: "کاربری با این ایمل وجود ندارد",
      };
    }

    const userOnCourses = await UserRepository.findEnrolledCourseIds(user.id);
    const courseIds = userOnCourses.map((c) => c.courseId);
    const courses = await CourseRepository.findByIds(courseIds);

    return {
      status: 200 as const,
      courses,
    };
  }
}
