"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createJwt_1 = require("../../utils/createJwt");
const cookieOptions_1 = require("../../utils/cookieOptions");
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    res
        .cookie(createJwt_1.tokenCookieName, "", cookieOptions_1.cookieOptions)
        .status(200)
        .json({ message: "با موفقیت خارج شدید" })
        .send();
});
exports.default = router;
//# sourceMappingURL=logout.js.map