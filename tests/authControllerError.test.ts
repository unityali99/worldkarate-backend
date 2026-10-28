import { describe, it, expect, vi } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";

// Simulate an unexpected internal failure inside the auth service.
vi.mock("../src/services/auth.service", () => ({
  AuthService: {
    login: vi.fn(() => {
      throw new Error("SECRET_INTERNAL_DB_CONNECTION_STRING");
    }),
  },
}));

import { AuthController } from "../src/controllers/auth.controller";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post("/login", AuthController.login);
  return app;
}

describe("AuthController.login error handling", () => {
  it("returns 500 with a generic message and does NOT leak the internal error", async () => {
    const res = await request(buildApp())
      .post("/login")
      .send({ email: "user@example.com", password: "whatever" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("خطا در سرور. لطفا به پشتیبانی پیام دهید");
    // Regression: current controller returns { message, error } — leaking the
    // thrown Error to the client. The raw error must not be present.
    expect(res.body.error).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain(
      "SECRET_INTERNAL_DB_CONNECTION_STRING",
    );
  });
});
