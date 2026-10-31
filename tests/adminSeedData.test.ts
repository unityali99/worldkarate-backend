import { describe, it, expect } from "vitest";
import { Role } from "@prisma/client";
import { buildAdminSeedData } from "../prisma/adminSeedData";

describe("buildAdminSeedData", () => {
  const { create, update } = buildAdminSeedData(
    {
      email: "admin@worldkarate.com",
      firstName: "ali",
      lastName: "AHMADI",
      passwordHash: "$2b$04$fakehash",
    },
    "verification-key-123",
  );

  it("marks the seeded user as an admin through role AND the isAdmin flag", () => {
    expect(create.role).toBe(Role.ADMIN);
    expect(create.isAdmin).toBe(true);
    // Regression: the seed used to set role = ADMIN but leave isAdmin = false,
    // so the seeded admin looked like a normal user to the panel.
    expect(update.role).toBe(Role.ADMIN);
    expect(update.isAdmin).toBe(true);
  });

  it("keeps the admin verified and normalises the names", () => {
    expect(create.verified).toBe(true);
    expect(update.verified).toBe(true);
    expect(create.firstName).toBe("Ali");
    expect(create.lastName).toBe("Ahmadi");
    expect(create.email).toBe("admin@worldkarate.com");
  });

  it("only assigns a verification key when creating the user", () => {
    expect(create.verificationKey).toBe("verification-key-123");
    expect(update).not.toHaveProperty("verificationKey");
  });
});
