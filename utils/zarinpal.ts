import ZarinPal from "zarinpal-node-sdk";

// Validate required environment variables
if (!process.env.ZARINPAL_MERCHANT_ID) {
  throw new Error("ZARINPAL_MERCHANT_ID environment variable is required");
}

if (!process.env.ZARINPAL_ACCESS_TOKEN) {
  throw new Error("ZARINPAL_ACCESS_TOKEN environment variable is required");
}

export const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  sandbox: process.env.ENV_MODE === "development", // Use sandbox in development
  accessToken: process.env.ZARINPAL_ACCESS_TOKEN,
});
