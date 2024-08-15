import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import register from "./src/auth/signup";
import login from "./src/auth/login";
import profile from "./src/auth/profile";
import { authorization } from "./middleware/authorization";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(cors(corsOptions));

app.use("/register", register);
app.use("/login", login);
app.use("/profile", authorization, profile);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
