import jwt from "jsonwebtoken";

export const tokenCookieName = "auth-token";
export const createJwt = (user: {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}) => {
  return jwt.sign(
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET
  );
};
