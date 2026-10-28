"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Tunable via .env (fall back to safe defaults when unset).
const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15;
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 50;
/**
 * Basic brute-force protection for credential/OTP endpoints. Skipped in the
 * test environment so regression tests are not affected by throttling.
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: windowMinutes * 60 * 1000,
    limit: maxRequests, // per IP per window
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: {
        message: "تعداد درخواست‌ها بیش از حد مجاز است. لطفا کمی بعد تلاش کنید",
    },
});
//# sourceMappingURL=rateLimit.js.map