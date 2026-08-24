import { Router } from "express";
import { NewsletterController } from "../controllers/newsletter.controller";
import { validate } from "../../middleware/validate";
import ForgetPassword from "../../schemas/auth/ForgetPassword";

const router = Router();

router.post(
  "/register-newsletter",
  validate(ForgetPassword),
  NewsletterController.subscribe
);

export default router;
