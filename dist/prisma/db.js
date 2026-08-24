"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl.includes("?") ? rawUrl.split("?")[0] : rawUrl;
const pool = new pg_1.Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({ adapter });
};
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
//# sourceMappingURL=db.js.map