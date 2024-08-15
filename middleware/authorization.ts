import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/db";

export async function authorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  try {
    const decodedUser = jwt.verify(token as string, process.env.JWT_SECRET!);

    const user = await prisma?.user.findUnique({
      where: { email: (decodedUser as User).email },
    });

    if (!user) return res.json({ message: "User not found" }).status(400).end();

    req.body.user = user;
    next();
  } catch (error) {
    return res.json({ message: "Access Denied", error }).status(403).end();
  }
}
