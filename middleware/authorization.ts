import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../src/repositories/user.repository";
import { tokenCookieName } from "../utils/createJwt";

export async function authorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token: string;
  if (req.cookies[`${tokenCookieName}`])
    token = req.cookies[`${tokenCookieName}`];
  try {
    const decodedUser = jwt.verify(token as string, process.env.JWT_SECRET!);

    const user = await UserRepository.findByEmail((decodedUser as User).email);

    if (!user) return res.status(400).json({ message: "User not found" }).end();

    req.user = user;
    req.body.user = user;
    next();
  } catch (error) {
    return res.json({ message: "Access Denied", error }).status(403).end();
  }
}
