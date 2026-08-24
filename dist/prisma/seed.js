"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("./db"));
const generateUniqueString_1 = require("../utils/generateUniqueString");
const capitlizeFirstLetter_1 = __importDefault(require("../utils/capitlizeFirstLetter"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.ADMIN_EMAIL || "admin@worldkarate.com";
        const password = process.env.ADMIN_PASSWORD || "Admin123456";
        const firstName = process.env.ADMIN_FIRSTNAME || "Admin";
        const lastName = process.env.ADMIN_LASTNAME || "User";
        const existingUser = yield db_1.default.user.findUnique({
            where: { email },
        });
        const encryptedPassword = yield bcrypt_1.default.hash(password, Number(process.env.ROUNDS) || 10);
        if (existingUser) {
            const updated = yield db_1.default.user.update({
                where: { email },
                data: {
                    role: client_1.Role.ADMIN,
                    verified: true,
                    password: encryptedPassword,
                    firstName: (0, capitlizeFirstLetter_1.default)(firstName),
                    lastName: (0, capitlizeFirstLetter_1.default)(lastName),
                },
            });
            console.log(`✅ Admin user '${email}' updated successfully! (ID: ${updated.id}, Role: ${updated.role})`);
        }
        else {
            const verificationKey = (0, generateUniqueString_1.generateUniqueString)(83);
            const created = yield db_1.default.user.create({
                data: {
                    email,
                    firstName: (0, capitlizeFirstLetter_1.default)(firstName),
                    lastName: (0, capitlizeFirstLetter_1.default)(lastName),
                    password: encryptedPassword,
                    role: client_1.Role.ADMIN,
                    verified: true,
                    verificationKey,
                },
            });
            console.log(`✅ Admin user '${email}' created successfully! (ID: ${created.id}, Role: ${created.role})`);
        }
    });
}
main()
    .catch((e) => {
    console.error("❌ Error creating admin user:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$disconnect();
}));
//# sourceMappingURL=seed.js.map