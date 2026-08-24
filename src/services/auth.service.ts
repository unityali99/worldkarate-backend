import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { createJwt } from "../../utils/createJwt";
import { generateOtp } from "../../utils/generateOtp";
import { generateUniqueString } from "../../utils/generateUniqueString";
import capitalizeFirstLetter from "../../utils/capitlizeFirstLetter";
import { RegisterType } from "../../schemas/auth/Register";
import { ProfileType } from "../../schemas/auth/Profile";

export class AuthService {
  static async signup(data: RegisterType) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      return {
        status: 409 as const,
        message: "حساب کاربری قبلا ایجاد شده است",
      };
    }

    const encryptedPass = await bcrypt.hash(
      data.password,
      Number(process.env.ROUNDS) || 10
    );
    const verificationKey = generateUniqueString(83);

    await UserRepository.create({
      email: data.email,
      firstName: capitalizeFirstLetter(data.firstName),
      lastName: capitalizeFirstLetter(data.lastName),
      password: encryptedPass,
      verificationKey,
    });

    return {
      status: 200 as const,
      message: "حساب کاربری با موفقیت ایجاد شد",
      verificationKey,
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      return {
        status: 403 as const,
        message: "نام کاربری یا رمز عبور صحیح نمیباشد",
      };
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return {
        status: 403 as const,
        message: "نام کاربری یا رمز عبور صحیح نمیباشد",
      };
    }

    const token = createJwt(user);
    const responseUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return {
      status: 200 as const,
      message: "ورود موفقیت آمیز بود",
      token,
      user: responseUser,
    };
  }

  static async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return {
        status: 404 as const,
        message: "ایمیل صحیح نمیباشد",
      };
    }

    const OTP = generateOtp();
    await UserRepository.updateByEmail(email, { OTP });

    return {
      status: 200 as const,
      message: "کد با موفقیت به شما ایمیل شد",
      OTP,
    };
  }

  static async validateOtp(email: string, otp: number) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return {
        status: 400 as const,
        message: "ایمیل صحیح نمیباشد",
      };
    }

    if (user.OTP !== otp) {
      return {
        status: 400 as const,
        message: "کد یکبار مصرف صحیح نمیباشد",
      };
    }

    const token = createJwt(user);
    return {
      status: 200 as const,
      message: "لطفا رمز عبور خود را انتخاب نمایید",
      token,
    };
  }

  static async resetPassword(email: string, newPass: string) {
    const encryptedPass = await bcrypt.hash(
      newPass,
      Number(process.env.ROUNDS) || 10
    );
    await UserRepository.updateByEmail(email, { password: encryptedPass });

    return {
      status: 200 as const,
      message: "رمز عبور با موفقیت تغییر پیدا کرد",
    };
  }

  static async updateProfile(user: User, data: ProfileType) {
    const editedUser = await UserRepository.updateById(user.id, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    const token = createJwt(editedUser);

    return {
      status: 200 as const,
      message: "اطلاعات کاربری با موفقیت اصلاح شد",
      token,
      user: editedUser,
    };
  }
}
