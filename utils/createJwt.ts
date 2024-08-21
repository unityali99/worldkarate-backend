import jwt from "jsonwebtoken";

export const tokenCookieName = "auth-token";
export const createJwt = (user: {
  email: string;
  firstName: string;
  lastName: string;
}) => {
  return jwt.sign(
    { email: user.email, firstName: user.firstName, lastName: user.lastName },
    process.env.JWT_SECRET
  );
};
