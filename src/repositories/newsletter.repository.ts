import prisma from "../../prisma/db";

export class NewsletterRepository {
  static async findByEmail(email: string) {
    return prisma.newsletter.findUnique({ where: { email } });
  }

  static async create(email: string) {
    return prisma.newsletter.create({ data: { email } });
  }

  static async findAll() {
    return prisma.newsletter.findMany();
  }
}
