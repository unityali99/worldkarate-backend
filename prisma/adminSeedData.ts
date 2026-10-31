import { Prisma, Role } from "@prisma/client";
import capitalizeFirstLetter from "../utils/capitlizeFirstLetter";

export type AdminSeedInput = {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
};

/**
 * Builds the create/update payloads for the initial admin user.
 *
 * `role` and the legacy `isAdmin` flag are both written here so the rule
 * "an ADMIN is also isAdmin" cannot drift between the two code paths of the seed.
 */
export function buildAdminSeedData(
  input: AdminSeedInput,
  verificationKey: string,
) {
  const identity = {
    email: input.email,
    firstName: capitalizeFirstLetter(input.firstName),
    lastName: capitalizeFirstLetter(input.lastName),
    password: input.passwordHash,
    role: Role.ADMIN,
    isAdmin: true,
    verified: true,
  };

  return {
    create: { ...identity, verificationKey } satisfies Prisma.UserCreateInput,
    update: identity satisfies Prisma.UserUpdateInput,
  };
}
