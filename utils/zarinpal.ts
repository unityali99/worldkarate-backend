import ZarinPal from "zarinpal-node-sdk";

export const isZarinpalSandbox =
  process.env.ZARINPAL_SANDBOX === "true" ||
  process.env.ENV_MODE === "development";

// Validate required environment variables
if (!process.env.ZARINPAL_MERCHANT_ID) {
  throw new Error("ZARINPAL_MERCHANT_ID environment variable is required");
}

if (!process.env.ZARINPAL_ACCESS_TOKEN) {
  throw new Error("ZARINPAL_ACCESS_TOKEN environment variable is required");
}

export const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  sandbox: isZarinpalSandbox,
  accessToken: process.env.ZARINPAL_ACCESS_TOKEN,
});
