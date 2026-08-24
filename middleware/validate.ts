import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (
  schema: ZodSchema,
  customMessage?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validation = await schema.safeParseAsync(req.body);
    if (!validation.success) {
      if (customMessage) {
        return res.status(400).json({ message: customMessage }).send();
      }
      const firstError = validation.error.errors[0];
      return res
        .status(400)
        .json({
          message: firstError.message || "لطفا اطلاعات را به درستی وارد کنید",
          error: firstError,
        })
        .send();
    }
    next();
  };
};
