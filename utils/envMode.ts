type Environment = "development" | "production";

export const envMode: Environment = process.env.ENV_MODE as Environment;
