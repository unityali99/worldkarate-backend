import "dotenv/config";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "./db";
import { generateUniqueString } from "../utils/generateUniqueString";
import capitalizeFirstLetter from "../utils/capitlizeFirstLetter";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@worldkarate.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123456";
  const firstName = process.env.ADMIN_FIRSTNAME || "Admin";
  const lastName = process.env.ADMIN_LASTNAME || "User";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const encryptedPassword = await bcrypt.hash(
    password,
    Number(process.env.ROUNDS) || 10
  );

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: Role.ADMIN,
        verified: true,
        password: encryptedPassword,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
      },
    });
    console.log(`✅ Admin user '${email}' updated successfully! (ID: ${updated.id}, Role: ${updated.role})`);
  } else {
    const verificationKey = generateUniqueString(83);
    const created = await prisma.user.create({
      data: {
        email,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        password: encryptedPassword,
        role: Role.ADMIN,
        verified: true,
        verificationKey,
      },
    });
    console.log(`✅ Admin user '${email}' created successfully! (ID: ${created.id}, Role: ${created.role})`);
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
