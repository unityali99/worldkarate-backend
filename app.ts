import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import cookies from "cookie-parser";
import { isProduction } from "./utils/cookieOptions";
import authRoutes from "./src/routes/auth.routes";
import courseRoutes from "./src/routes/course.routes";
import paymentRoutes from "./src/routes/payment.routes";
import newsletterRoutes from "./src/routes/newsletter.routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: isProduction
    ? ["https://worldkarate.ir", "https://www.worldkarate.ir"]
    : true,
  credentials: true,
  optionsSuccessStatus: 200,
};
console.log("Environment:", process.env.ENV_MODE);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

// Mount Layered Application Routes
app.use(authRoutes);
app.use(courseRoutes);
app.use(paymentRoutes);
app.use(newsletterRoutes);

// Global fallbacks (must be mounted after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
