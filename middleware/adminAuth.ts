import { Role, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../src/repositories/user.repository";

export async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userPayload: User = req.user || req.body.user;
  try {
    const user = await UserRepository.findById(userPayload.id);

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.INSTRUCTOR))
      return res.status(403).json({ message: "Access Denied" }).send();

    next();
  } catch (error) {
    res.json({ message: "Access Denied", error }).status(403).end();
  }
}
