import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import register from "./src/auth/signup";
import login from "./src/auth/login";
import logout from "./src/auth/logout";
import profile from "./src/auth/profile";
import { authorization } from "./middleware/authorization";
import cookies from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookies());
app.use(helmet());

app.use("/register", register);
app.use("/login", login);
app.use("/profile", authorization, profile);
app.use("/logout", authorization, logout);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
