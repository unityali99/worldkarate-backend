"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    const randomNum = Math.random() * 9000;
    return Math.floor(1000 + randomNum);
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=generateOtp.js.map