"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zarinpal = exports.isZarinpalSandbox = void 0;
const zarinpal_node_sdk_1 = __importDefault(require("zarinpal-node-sdk"));
exports.isZarinpalSandbox = process.env.ZARINPAL_SANDBOX === "true" ||
    process.env.ENV_MODE === "development";
// Validate required environment variables
if (!process.env.ZARINPAL_MERCHANT_ID) {
    throw new Error("ZARINPAL_MERCHANT_ID environment variable is required");
}
if (!process.env.ZARINPAL_ACCESS_TOKEN) {
    throw new Error("ZARINPAL_ACCESS_TOKEN environment variable is required");
}
exports.zarinpal = new zarinpal_node_sdk_1.default({
    merchantId: process.env.ZARINPAL_MERCHANT_ID,
    sandbox: exports.isZarinpalSandbox,
    accessToken: process.env.ZARINPAL_ACCESS_TOKEN,
});
//# sourceMappingURL=zarinpal.js.map