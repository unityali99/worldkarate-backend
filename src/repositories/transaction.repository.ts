import prisma from "../../prisma/db";

export class TransactionRepository {
  static async findById(id: number) {
    return prisma.transaction.findUnique({ where: { id } });
  }

  static async findByAuthority(authority: string) {
    return prisma.transaction.findUnique({ where: { authority } });
  }

  static async findByAuthorityWithDetails(authority: string) {
    return prisma.transaction.findUnique({
      where: { authority },
      include: {
        user: true,
        transactionsOnCourses: { include: { course: true } },
      },
    });
  }

  static async findByUserId(userId: number) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { transactionsOnCourses: { include: { course: true } } },
    });
  }

  static async createPendingTransaction(params: {
    userId: number;
    totalPrice: number;
    authority: string;
    courseIds: number[];
  }) {
    const { userId, totalPrice, authority, courseIds } = params;
    return prisma.transaction.create({
      data: {
        isPaid: false,
        transactionId: authority,
        totalPrice,
        authority,
        user: { connect: { id: userId } },
        transactionsOnCourses: {
          createMany: {
            data: courseIds.map((courseId) => ({ courseId })),
          },
        },
      },
    });
  }

  static async markAsPaid(id: number, refId: string) {
    return prisma.transaction.update({
      where: { id },
      data: { isPaid: true, transactionId: refId },
    });
  }
}
