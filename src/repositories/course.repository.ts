import prisma from "../../prisma/db";
import { Prisma } from "@prisma/client";

export class CourseRepository {
  static async findAll(params?: {
    where?: Prisma.CourseWhereInput;
    include?: Prisma.CourseInclude;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }) {
    return prisma.course.findMany(params);
  }

  static async findById(id: number, include?: Prisma.CourseInclude) {
    return prisma.course.findUnique({ where: { id }, include });
  }

  static async findByIds(ids: number[]) {
    return prisma.course.findMany({ where: { id: { in: ids } } });
  }

  static async findByUserId(userId: number) {
    return prisma.course.findMany({ where: { users: { some: { userId } } } });
  }

  static async findByInstructorId(instructorId: number) {
    return prisma.course.findMany({ where: { instructorId } });
  }

  static async create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data });
  }

  static async updateById(id: number, data: Prisma.CourseUpdateInput) {
    return prisma.course.update({ where: { id }, data });
  }

  static async deleteById(id: number) {
    return prisma.course.delete({ where: { id } });
  }
}
