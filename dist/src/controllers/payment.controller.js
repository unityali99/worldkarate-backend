"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
class PaymentController {
    static checkout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user || req.body.user;
                const { courseIds } = req.body;
                const result = yield payment_service_1.PaymentService.checkout(user, courseIds);
                if (result.status !== 200) {
                    return res.status(result.status).json(result).send();
                }
                return res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                const gatewayError = error &&
                    typeof error === "object" &&
                    "response" in error &&
                    error.response &&
                    typeof error.response === "object" &&
                    "data" in error.response
                    ? error.response.data
                    : undefined;
                return res
                    .status(500)
                    .json({
                    message: "خطا در پردازش درخواست پرداخت",
                    error: gatewayError ||
                        (error instanceof Error ? error.message : "خطای نامشخص"),
                })
                    .send();
            }
        });
    }
    static verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { authority } = req.body;
                const result = yield payment_service_1.PaymentService.verify(authority);
                if (result.status !== 200) {
                    return res.status(result.status).json(result);
                }
                return res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "خطا در تایید پرداخت",
                    error: ((_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) || (error === null || error === void 0 ? void 0 : error.message) || "خطای نامشخص",
                });
            }
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map