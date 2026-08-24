"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookieOptions_1 = require("./utils/cookieOptions");
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const course_routes_1 = __importDefault(require("./src/routes/course.routes"));
const payment_routes_1 = __importDefault(require("./src/routes/payment.routes"));
const newsletter_routes_1 = __importDefault(require("./src/routes/newsletter.routes"));
require("dotenv").config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: cookieOptions_1.isProduction
        ? ["https://worldkarate.ir", "https://www.worldkarate.ir"]
        : true,
    credentials: true,
    optionsSuccessStatus: 200,
};
console.log("Environment:", process.env.ENV_MODE);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
// Mount Layered Application Routes
app.use(auth_routes_1.default);
app.use(course_routes_1.default);
app.use(payment_routes_1.default);
app.use(newsletter_routes_1.default);
app.listen(port, () => {
    return console.log(`Listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map