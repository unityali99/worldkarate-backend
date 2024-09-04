import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/db";

export async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id }: User = req.body.user;
  try {
    const { isAdmin } = await prisma.user.findUnique({ where: { id } });

    if (!isAdmin)
      return res.status(403).json({ message: "Access Denied" }).send();

    next();
  } catch (error) {
    res.json({ message: "Access Denied", error }).status(403).end();
  }
}
