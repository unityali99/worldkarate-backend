import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

vi.mock("../src/repositories/user.repository", () => ({
  UserRepository: { findByEmail: vi.fn() },
}));

import { AuthService } from "../src/services/auth.service";
import { UserRepository } from "../src/repositories/user.repository";

describe("AuthService.login (key flow)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects an unknown email with 403 and a generic message", async () => {
    (UserRepository.findByEmail as any).mockResolvedValue(null);

    const result = await AuthService.login({
      email: "nobody@example.com",
      password: "Aa1!aaaa",
    });

    expect(result.status).toBe(403);
    expect(result.message).toBe("نام کاربری یا رمز عبور صحیح نمیباشد");
  });

  it("issues a valid JWT for correct credentials", async () => {
    const hash = bcrypt.hashSync("Aa1!aaaa", 4);
    (UserRepository.findByEmail as any).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      firstName: "Ali",
      lastName: "Ahmadi",
      password: hash,
      role: "USER",
    });

    const result = await AuthService.login({
      email: "user@example.com",
      password: "Aa1!aaaa",
    });

    expect(result.status).toBe(200);
    const decoded: any = jwt.verify(result.token!, "test-jwt-secret");
    expect(decoded.email).toBe("user@example.com");
  });
});
