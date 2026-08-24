import { NewsletterRepository } from "../repositories/newsletter.repository";

export class NewsletterService {
  static async subscribe(email: string) {
    const existing = await NewsletterRepository.findByEmail(email);
    if (existing) {
      return {
        status: 400 as const,
        message: "ایمیل وارد شده در خبرنامه ثبت نام شده است",
      };
    }

    await NewsletterRepository.create(email);
    return {
      status: 200 as const,
      message: "ایمیل با موفقیت به لیست خبرنامه اضافه شد",
    };
  }
}
