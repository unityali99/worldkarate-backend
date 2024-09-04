"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueString = void 0;
const generateUniqueString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characters.length);
        result += characters[index];
    }
    return result;
};
exports.generateUniqueString = generateUniqueString;
//# sourceMappingURL=generateUniqueString.js.map