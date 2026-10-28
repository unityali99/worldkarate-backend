import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorization } from "../../middleware/authorization";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authLimiter } from "../../middleware/rateLimit";
import Register from "../../schemas/auth/Register";
import Login from "../../schemas/auth/Login";
import ForgetPassword from "../../schemas/auth/ForgetPassword";
import OTP from "../../schemas/auth/OTP";
import ResetPassword from "../../schemas/auth/ResetPassword";
import Profile from "../../schemas/auth/Profile";

const router = Router();

router.post(
  "/register",
  validate(Register),
  asyncHandler(AuthController.signup),
);
router.post(
  "/login",
  authLimiter,
  validate(Login),
  asyncHandler(AuthController.login),
);
router.post("/logout", authorization, asyncHandler(AuthController.logout));
router.put(
  "/forget-password",
  authLimiter,
  validate(ForgetPassword, "ایمیل صحیح نمیباشد"),
  asyncHandler(AuthController.forgotPassword),
);
router.post(
  "/validate-otp",
  authLimiter,
  validate(OTP, "ایمیل صحیح نمیباشد"),
  asyncHandler(AuthController.validateOtp),
);
router.put(
  "/reset-password",
  authorization,
  validate(ResetPassword),
  asyncHandler(AuthController.resetPassword),
);
router.put(
  "/profile",
  authorization,
  validate(Profile),
  asyncHandler(AuthController.updateProfile),
);

export default router;
