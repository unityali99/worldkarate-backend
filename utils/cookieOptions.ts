import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  domain: "worldkarate-courses.onrender.com/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
