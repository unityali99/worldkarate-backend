import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  domain: "worldkarate.ir",
  maxAge: 100 * 24 * 60 * 60 * 1000,
};
