import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { tokenCookieName } from "../../utils/createJwt";
import { cookieOptions } from "../../utils/cookieOptions";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message }).send();
      }
      return res
        .status(200)
        .json({ message: result.message, verificationKey: result.verificationKey })
        .send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" }).send();
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message }).send();
      }
      return res
        .cookie(tokenCookieName, result.token, cookieOptions)
        .status(200)
        .json({ message: result.message, user: result.user })
        .send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
    }
  }

  static logout(req: Request, res: Response) {
    return res
      .cookie(tokenCookieName, "", cookieOptions)
      .status(200)
      .json({ message: "با موفقیت خارج شدید" })
      .send();
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message }).send();
      }
      return res.status(200).json({ message: result.message, OTP: result.OTP }).send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
    }
  }

  static async validateOtp(req: Request, res: Response) {
    try {
      const result = await AuthService.validateOtp(req.body.email, req.body.OTP);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      return res
        .cookie(tokenCookieName, result.token, cookieOptions)
        .status(200)
        .json({ message: result.message });
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" }).send();
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const user = req.user || req.body.user;
      const result = await AuthService.resetPassword(user.email, req.body.newPassword);
      return res.status(result.status).json({ message: result.message }).send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const user = req.user || req.body.user;
      const result = await AuthService.updateProfile(user, req.body);
      return res
        .cookie(tokenCookieName, result.token, cookieOptions)
        .status(200)
        .json({ message: result.message })
        .send();
    } catch (error) {
      return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
    }
  }
}
