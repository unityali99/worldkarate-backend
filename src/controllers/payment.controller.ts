import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  static async checkout(req: Request, res: Response) {
    try {
      const user = req.user || req.body.user;
      const { courseIds } = req.body;

      const result = await PaymentService.checkout(user, courseIds);

      if (result.status !== 200) {
        return res.status(result.status).json(result).send();
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "خطا در پردازش درخواست پرداخت" })
        .send();
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const { authority } = req.body;
      const result = await PaymentService.verify(authority);

      if (result.status !== 200) {
        return res.status(result.status).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: "خطا در تایید پرداخت",
      });
    }
  }
}
