import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

export const tokenCookieName = "auth-token";
export const createJwt = (user: {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "10d") as unknown as SignOptions["expiresIn"];

  return jwt.sign(
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn },
  );
};
