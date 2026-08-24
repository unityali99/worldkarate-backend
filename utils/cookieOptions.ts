import { CookieOptions } from "express";

export const isProduction = process.env.ENV_MODE === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction, // Only secure in production (HTTPS required)
  sameSite: "lax",
  path: "/",
  // Only set domain in production when both frontend and backend are on same domain
  ...(isProduction && { domain: "worldkarate.ir" }),
  maxAge: 10 * 24 * 60 * 60 * 1000,
};
