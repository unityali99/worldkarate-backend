"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const validate_1 = require("../../middleware/validate");
const ForgetPassword_1 = __importDefault(require("../../schemas/auth/ForgetPassword"));
const router = (0, express_1.Router)();
router.post("/register-newsletter", (0, validate_1.validate)(ForgetPassword_1.default), newsletter_controller_1.NewsletterController.subscribe);
exports.default = router;
//# sourceMappingURL=newsletter.routes.js.map