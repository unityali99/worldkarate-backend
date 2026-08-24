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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repositories/user.repository");
const createJwt_1 = require("../../utils/createJwt");
const generateOtp_1 = require("../../utils/generateOtp");
const generateUniqueString_1 = require("../../utils/generateUniqueString");
const capitlizeFirstLetter_1 = __importDefault(require("../../utils/capitlizeFirstLetter"));
class AuthService {
    static signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield user_repository_1.UserRepository.findByEmail(data.email);
            if (existing) {
                return {
                    status: 409,
                    message: "حساب کاربری قبلا ایجاد شده است",
                };
            }
            const encryptedPass = yield bcrypt_1.default.hash(data.password, Number(process.env.ROUNDS) || 10);
            const verificationKey = (0, generateUniqueString_1.generateUniqueString)(83);
            yield user_repository_1.UserRepository.create({
                email: data.email,
                firstName: (0, capitlizeFirstLetter_1.default)(data.firstName),
                lastName: (0, capitlizeFirstLetter_1.default)(data.lastName),
                password: encryptedPass,
                verificationKey,
            });
            return {
                status: 200,
                message: "حساب کاربری با موفقیت ایجاد شد",
                verificationKey,
            };
        });
    }
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.findByEmail(data.email);
            if (!user) {
                return {
                    status: 403,
                    message: "نام کاربری یا رمز عبور صحیح نمیباشد",
                };
            }
            const isValid = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isValid) {
                return {
                    status: 403,
                    message: "نام کاربری یا رمز عبور صحیح نمیباشد",
                };
            }
            const token = (0, createJwt_1.createJwt)(user);
            const responseUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            };
            return {
                status: 200,
                message: "ورود موفقیت آمیز بود",
                token,
                user: responseUser,
            };
        });
    }
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.findByEmail(email);
            if (!user) {
                return {
                    status: 404,
                    message: "ایمیل صحیح نمیباشد",
                };
            }
            const OTP = (0, generateOtp_1.generateOtp)();
            yield user_repository_1.UserRepository.updateByEmail(email, { OTP });
            return {
                status: 200,
                message: "کد با موفقیت به شما ایمیل شد",
                OTP,
            };
        });
    }
    static validateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.findByEmail(email);
            if (!user) {
                return {
                    status: 400,
                    message: "ایمیل صحیح نمیباشد",
                };
            }
            if (user.OTP !== otp) {
                return {
                    status: 400,
                    message: "کد یکبار مصرف صحیح نمیباشد",
                };
            }
            const token = (0, createJwt_1.createJwt)(user);
            return {
                status: 200,
                message: "لطفا رمز عبور خود را انتخاب نمایید",
                token,
            };
        });
    }
    static resetPassword(email, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedPass = yield bcrypt_1.default.hash(newPass, Number(process.env.ROUNDS) || 10);
            yield user_repository_1.UserRepository.updateByEmail(email, { password: encryptedPass });
            return {
                status: 200,
                message: "رمز عبور با موفقیت تغییر پیدا کرد",
            };
        });
    }
    static updateProfile(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const editedUser = yield user_repository_1.UserRepository.updateById(user.id, {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            const token = (0, createJwt_1.createJwt)(editedUser);
            return {
                status: 200,
                message: "اطلاعات کاربری با موفقیت اصلاح شد",
                token,
                user: editedUser,
            };
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map