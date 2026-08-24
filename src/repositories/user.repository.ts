import prisma from "../../prisma/db";
import { Prisma } from "@prisma/client";

export class UserRepository {
  static async findAll(params?: {
    where?: Prisma.UserWhereInput;
    include?: Prisma.UserInclude;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return prisma.user.findMany(params);
  }

  static async findById(id: number, include?: Prisma.UserInclude) {
    return prisma.user.findUnique({ where: { id }, include });
  }

  static async findByEmail(email: string, include?: Prisma.UserInclude) {
    return prisma.user.findUnique({ where: { email }, include });
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  static async updateById(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  static async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { email }, data });
  }

  static async deleteById(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  static async findUserCourseEnrollment(userId: number, courseId: number) {
    return prisma.usersOnCourses.findUnique({
      where: { userId_courseId: { courseId, userId } },
    });
  }

  static async findEnrolledCourseIds(userId: number) {
    return prisma.usersOnCourses.findMany({
      where: { userId },
      select: { courseId: true },
    });
  }

  static async enrollCourses(userId: number, courseIds: number[]) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        courses: {
          createMany: {
            data: courseIds.map((courseId) => ({ courseId })),
            skipDuplicates: true,
          },
        },
      },
    });
  }
}
