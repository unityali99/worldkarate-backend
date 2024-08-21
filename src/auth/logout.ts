import { Request, Response, Router } from "express";
import { tokenCookieName } from "../../utils/createJwt";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  res.clearCookie(tokenCookieName, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "با موفقیت خارج شدید" });
});

export default router;
