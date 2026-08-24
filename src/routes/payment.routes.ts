import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorization } from "../../middleware/authorization";

const router = Router();

router.post("/payment/checkout", authorization, PaymentController.checkout);
router.post("/payment/verify", PaymentController.verify);

export default router;
