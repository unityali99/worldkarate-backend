import { Request, Response, Router } from "express";
import { tokenCookieName } from "../../utils/createJwt";
import { cookieOptions } from "../../utils/cookieOptions";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  res
    .cookie(tokenCookieName, "", cookieOptions)
    .status(200)
    .json({ message: "با موفقیت خارج شدید" })
    .send();
});

export default router;
