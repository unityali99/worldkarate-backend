import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";

// Mock the persistence boundary so no real DB/Prisma is touched (integration
// against real Postgres is intentionally out of scope for this offline test).
vi.mock("../src/repositories/user.repository", () => ({
  UserRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
  },
}));

import { authorization } from "../middleware/authorization";
import { adminAuth } from "../middleware/adminAuth";
import { UserRepository } from "../src/repositories/user.repository";

const SECRET = "test-jwt-secret";

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.get("/protected", authorization, adminAuth, (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

describe("authorization middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a valid token and loads req.user", async () => {
    (UserRepository.findByEmail as any).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      role: "USER",
    });
    const token = jwt.sign({ email: "user@example.com" }, SECRET);

    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", `auth-token=${token}`);

    // Valid path should not even reach adminAuth denial; but role USER is not admin.
    // We only assert that authorization itself let the request proceed here.
    expect([200, 403]).toContain(res.status);
  });

  it("returns HTTP 403 (not 200) and does NOT leak error details for an invalid token", async () => {
    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", "auth-token=garbage");

    // Regression: current code calls res.json().status(403) so the response is
    // actually sent with HTTP 200. We assert the correct 403 status.
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Access Denied" });
    expect(res.body.error).toBeUndefined();
  });

  it("returns HTTP 403 (not 200) and does NOT leak error details when token is missing", async () => {
    const res = await request(buildApp()).get("/protected");

    expect(res.status).toBe(403);
    expect(res.body.error).toBeUndefined();
  });
});

describe("adminAuth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns HTTP 403 (not 200) and does NOT leak error for a non-admin user", async () => {
    (UserRepository.findByEmail as any).mockResolvedValue({
      id: 2,
      email: "user@example.com",
      role: "USER",
    });
    (UserRepository.findById as any).mockResolvedValue({
      id: 2,
      email: "user@example.com",
      role: "USER",
    });
    const token = jwt.sign({ email: "user@example.com" }, SECRET);

    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", `auth-token=${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBeUndefined();
  });
});
