import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import register from "./src/auth/signup";
import login from "./src/auth/login";
import logout from "./src/auth/logout";
import profile from "./src/auth/profile";
import forgetPassword from "./src/auth/forgetPassword";
import resetPassword from "./src/auth/resetPassword";
import validateOtp from "./src/auth/validateOTP";
import createCourse from "./src/courses/crud/createCourse";
import fetchCourses from "./src/courses/crud/fetchCourses";
import fetchUserCourses from "./src/courses/user/fetchUserCourses";
import adminFetchCourses from "./src/courses/admin/adminFetchCourses";
import deleteCourse from "./src/courses/crud/deleteCourse";
import registerNewsletter from "./src/newsletter/registerNewsletter";
import checkout from "./src/payment/checkout";
import { authorization } from "./middleware/authorization";
import cookies from "cookie-parser";
import { adminAuth } from "./middleware/adminAuth";

require("dotenv").config();

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

// Authorization
app.use("/register", register);
app.use("/login", login);
app.use("/forget-password", forgetPassword);
app.use("/validate-otp", validateOtp);
app.use("/reset-password", authorization, resetPassword);
app.use("/profile", authorization, profile);
app.use("/logout", authorization, logout);

// CRUD
app.use("/fetch-course", fetchCourses);
app.use("/create-course", authorization, adminAuth, createCourse);
app.use("/delete-course", authorization, adminAuth, deleteCourse);
app.use("/admin/fetch-course", authorization, adminAuth, adminFetchCourses);
app.use("/user/fetch-course", authorization, fetchUserCourses);

// Others
app.use("/register-newsletter", registerNewsletter);
app.use("/checkout", authorization, checkout);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
