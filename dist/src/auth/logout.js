"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createJwt_1 = require("../../utils/createJwt");
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    res.clearCookie(createJwt_1.tokenCookieName, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: "با موفقیت خارج شدید" });
});
exports.default = router;
//# sourceMappingURL=logout.js.map