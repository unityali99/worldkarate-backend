"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const authorization_1 = require("../../middleware/authorization");
const router = (0, express_1.Router)();
router.post("/payment/checkout", authorization_1.authorization, payment_controller_1.PaymentController.checkout);
router.post("/payment/verify", payment_controller_1.PaymentController.verify);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map