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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const createJwt_1 = require("../../utils/createJwt");
const cookieOptions_1 = require("../../utils/cookieOptions");
class AuthController {
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.AuthService.signup(req.body);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message }).send();
                }
                return res
                    .status(200)
                    .json({ message: result.message, verificationKey: result.verificationKey })
                    .send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" }).send();
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.AuthService.login(req.body);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message }).send();
                }
                return res
                    .cookie(createJwt_1.tokenCookieName, result.token, cookieOptions_1.cookieOptions)
                    .status(200)
                    .json({ message: result.message, user: result.user })
                    .send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
            }
        });
    }
    static logout(req, res) {
        return res
            .cookie(createJwt_1.tokenCookieName, "", cookieOptions_1.cookieOptions)
            .status(200)
            .json({ message: "با موفقیت خارج شدید" })
            .send();
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.AuthService.forgotPassword(req.body.email);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message }).send();
                }
                return res.status(200).json({ message: result.message, OTP: result.OTP }).send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
            }
        });
    }
    static validateOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.AuthService.validateOtp(req.body.email, req.body.OTP);
                if (result.status !== 200) {
                    return res.status(result.status).json({ message: result.message });
                }
                return res
                    .cookie(createJwt_1.tokenCookieName, result.token, cookieOptions_1.cookieOptions)
                    .status(200)
                    .json({ message: result.message });
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید" }).send();
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user || req.body.user;
                const result = yield auth_service_1.AuthService.resetPassword(user.email, req.body.newPassword);
                return res.status(result.status).json({ message: result.message }).send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
            }
        });
    }
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user || req.body.user;
                const result = yield auth_service_1.AuthService.updateProfile(user, req.body);
                return res
                    .cookie(createJwt_1.tokenCookieName, result.token, cookieOptions_1.cookieOptions)
                    .status(200)
                    .json({ message: result.message })
                    .send();
            }
            catch (error) {
                return res.status(500).json({ message: "خطا در سرور. لطفا به پشتیبانی پیام دهید", error }).send();
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map