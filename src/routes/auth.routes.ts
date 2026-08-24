import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorization } from "../../middleware/authorization";
import { validate } from "../../middleware/validate";
import Register from "../../schemas/auth/Register";
import Login from "../../schemas/auth/Login";
import ForgetPassword from "../../schemas/auth/ForgetPassword";
import OTP from "../../schemas/auth/OTP";
import ResetPassword from "../../schemas/auth/ResetPassword";
import Profile from "../../schemas/auth/Profile";

const router = Router();

router.post("/register", validate(Register), AuthController.signup);
router.post("/login", validate(Login), AuthController.login);
router.post("/logout", authorization, AuthController.logout);
router.put("/forget-password", validate(ForgetPassword, "ایمیل صحیح نمیباشد"), AuthController.forgotPassword);
router.post("/validate-otp", validate(OTP, "ایمیل صحیح نمیباشد"), AuthController.validateOtp);
router.put("/reset-password", authorization, validate(ResetPassword), AuthController.resetPassword);
router.put("/profile", authorization, validate(Profile), AuthController.updateProfile);

export default router;
