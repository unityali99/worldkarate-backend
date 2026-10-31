"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl.includes("?") ? rawUrl.split("?")[0] : rawUrl;
// The adapter owns its own `pg` copy, so a `pg.Pool` created here fails its
// `instanceof` check and silently falls back to localhost. Pass the pool config instead.
const adapter = new adapter_pg_1.PrismaPg({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({ adapter });
};
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
//# sourceMappingURL=db.js.map