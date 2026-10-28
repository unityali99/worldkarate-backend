import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorization } from "../../middleware/authorization";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

router.post(
  "/payment/checkout",
  authorization,
  asyncHandler(PaymentController.checkout),
);
router.post("/payment/verify", asyncHandler(PaymentController.verify));

export default router;
