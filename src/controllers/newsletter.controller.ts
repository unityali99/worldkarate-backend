import { Request, Response } from "express";
import { NewsletterService } from "../services/newsletter.service";

export class NewsletterController {
  static async subscribe(req: Request, res: Response) {
    try {
      const result = await NewsletterService.subscribe(req.body.email);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      return res.status(200).json({ message: result.message });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error })
        .send();
    }
  }
}
