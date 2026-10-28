import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../src/repositories/user.repository";
import { tokenCookieName } from "../utils/createJwt";

export async function authorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token: string | undefined = req.cookies?.[tokenCookieName];
  if (!token) {
    return res.status(403).json({ message: "Access Denied" }).end();
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await UserRepository.findByEmail((decodedUser as User).email);

    if (!user) return res.status(403).json({ message: "Access Denied" }).end();

    req.user = user;
    next();
  } catch (error) {
    // Do not leak the underlying JWT/verification error to the client.
    return res.status(403).json({ message: "Access Denied" }).end();
  }
}
