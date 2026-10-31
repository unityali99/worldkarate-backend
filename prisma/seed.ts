import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "./db";
import { generateUniqueString } from "../utils/generateUniqueString";
import { buildAdminSeedData } from "./adminSeedData";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@worldkarate.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123456";
  const firstName = process.env.ADMIN_FIRSTNAME || "Admin";
  const lastName = process.env.ADMIN_LASTNAME || "User";

  const encryptedPassword = await bcrypt.hash(
    password,
    Number(process.env.ROUNDS) || 10,
  );

  const { create, update } = buildAdminSeedData(
    { email, firstName, lastName, passwordHash: encryptedPassword },
    generateUniqueString(83),
  );

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { email },
      data: update,
    });
    console.log(
      `✅ Admin user '${email}' updated successfully! (ID: ${updated.id}, Role: ${updated.role})`,
    );
  } else {
    const created = await prisma.user.create({
      data: create,
    });
    console.log(
      `✅ Admin user '${email}' created successfully! (ID: ${created.id}, Role: ${created.role})`,
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
