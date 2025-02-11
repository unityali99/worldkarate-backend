import { CookieOptions } from "express";
import { envMode } from "./envMode";

const isProduction = envMode === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  ...(isProduction && { domain: "worldkarate.ir" }),
  maxAge: 100 * 24 * 60 * 60 * 1000,
};
