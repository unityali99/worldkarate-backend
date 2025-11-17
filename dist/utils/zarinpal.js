"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zarinpal = void 0;
const zarinpal_node_sdk_1 = __importDefault(require("zarinpal-node-sdk"));
exports.zarinpal = new zarinpal_node_sdk_1.default({
    merchantId: process.env.ZARINPAL_MERCHANT_ID,
    sandbox: true,
    accessToken: process.env.ZARINPAL_ACCESS_TOKEN,
});
//# sourceMappingURL=zarinpal.js.map