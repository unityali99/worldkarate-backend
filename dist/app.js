"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const signup_1 = __importDefault(require("./src/auth/signup"));
const login_1 = __importDefault(require("./src/auth/login"));
const logout_1 = __importDefault(require("./src/auth/logout"));
const profile_1 = __importDefault(require("./src/auth/profile"));
const forgetPassword_1 = __importDefault(require("./src/auth/forgetPassword"));
const resetPassword_1 = __importDefault(require("./src/auth/resetPassword"));
const validateOTP_1 = __importDefault(require("./src/auth/validateOTP"));
const createCourse_1 = __importDefault(require("./src/courses/createCourse"));
const fetchCourses_1 = __importDefault(require("./src/courses/fetchCourses"));
const deleteCourse_1 = __importDefault(require("./src/courses/deleteCourse"));
const authorization_1 = require("./middleware/authorization");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use("/register", signup_1.default);
app.use("/login", login_1.default);
app.use("/forget-password", forgetPassword_1.default);
app.use("/validate-otp", validateOTP_1.default);
app.use("/reset-password", authorization_1.authorization, resetPassword_1.default);
app.use("/profile", authorization_1.authorization, profile_1.default);
app.use("/logout", authorization_1.authorization, logout_1.default);
app.use("/create-course", createCourse_1.default);
app.use("/fetch-courses", fetchCourses_1.default);
app.use("/delete-course", deleteCourse_1.default);
app.listen(port, () => {
    return console.log(`Listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map