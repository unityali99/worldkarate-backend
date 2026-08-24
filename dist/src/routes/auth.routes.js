"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authorization_1 = require("../../middleware/authorization");
const validate_1 = require("../../middleware/validate");
const Register_1 = __importDefault(require("../../schemas/auth/Register"));
const Login_1 = __importDefault(require("../../schemas/auth/Login"));
const ForgetPassword_1 = __importDefault(require("../../schemas/auth/ForgetPassword"));
const OTP_1 = __importDefault(require("../../schemas/auth/OTP"));
const ResetPassword_1 = __importDefault(require("../../schemas/auth/ResetPassword"));
const Profile_1 = __importDefault(require("../../schemas/auth/Profile"));
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(Register_1.default), auth_controller_1.AuthController.signup);
router.post("/login", (0, validate_1.validate)(Login_1.default), auth_controller_1.AuthController.login);
router.post("/logout", authorization_1.authorization, auth_controller_1.AuthController.logout);
router.put("/forget-password", (0, validate_1.validate)(ForgetPassword_1.default, "ایمیل صحیح نمیباشد"), auth_controller_1.AuthController.forgotPassword);
router.post("/validate-otp", (0, validate_1.validate)(OTP_1.default, "ایمیل صحیح نمیباشد"), auth_controller_1.AuthController.validateOtp);
router.put("/reset-password", authorization_1.authorization, (0, validate_1.validate)(ResetPassword_1.default), auth_controller_1.AuthController.resetPassword);
router.put("/profile", authorization_1.authorization, (0, validate_1.validate)(Profile_1.default), auth_controller_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map