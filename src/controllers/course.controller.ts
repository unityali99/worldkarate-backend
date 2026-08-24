import { Request, Response } from "express";
import { CourseService } from "../services/course.service";

export class CourseController {
  static async getAll(req: Request, res: Response) {
    try {
      const courses = await CourseService.getAllCourses();
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
    }
  }

  static async getById(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    try {
      const result = await CourseService.getCourseById(courseId);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message }).send();
      }
      return res.status(200).json(result.course);
    } catch (error) {
      return res.status(400).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await CourseService.createCourse(req.body);
      return res.status(200).json(result).send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.courseId);
      const result = await CourseService.deleteCourse(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
    }
  }

  static async getUserCourses(req: Request, res: Response) {
    try {
      const user = req.user || req.body.user;
      const courses = await CourseService.getUserCourses(user.id);
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
    }
  }

  static async getAdminCoursesByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const result = await CourseService.getAdminCoursesByEmail(email);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      return res.status(200).json(result.courses);
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error });
    }
  }
}
