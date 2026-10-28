import rateLimit from "express-rate-limit";

// Tunable via .env (fall back to safe defaults when unset).
const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15;
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 50;

/**
 * Basic brute-force protection for credential/OTP endpoints. Skipped in the
 * test environment so regression tests are not affected by throttling.
 */
export const authLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  limit: maxRequests, // per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    message: "تعداد درخواست‌ها بیش از حد مجاز است. لطفا کمی بعد تلاش کنید",
  },
});
