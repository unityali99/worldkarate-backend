import { Role, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../src/repositories/user.repository";

export async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userPayload: User | undefined = req.user;
  if (!userPayload) {
    return res.status(403).json({ message: "Access Denied" }).send();
  }

  try {
    const user = await UserRepository.findById(userPayload.id);

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.INSTRUCTOR))
      return res.status(403).json({ message: "Access Denied" }).send();

    next();
  } catch (error) {
    // Do not leak the underlying error to the client.
    res.status(403).json({ message: "Access Denied" }).end();
  }
}
