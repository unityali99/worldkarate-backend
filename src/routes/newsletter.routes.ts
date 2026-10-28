import { Router } from "express";
import { NewsletterController } from "../controllers/newsletter.controller";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import ForgetPassword from "../../schemas/auth/ForgetPassword";

const router = Router();

router.post(
  "/register-newsletter",
  validate(ForgetPassword),
  asyncHandler(NewsletterController.subscribe),
);

export default router;
