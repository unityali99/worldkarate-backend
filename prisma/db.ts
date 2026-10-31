import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl.includes("?") ? rawUrl.split("?")[0] : rawUrl;

// The adapter owns its own `pg` copy, so a `pg.Pool` created here fails its
// `instanceof` check and silently falls back to localhost. Pass the pool config instead.
const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
