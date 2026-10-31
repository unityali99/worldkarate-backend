"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAdminSeedData = buildAdminSeedData;
const client_1 = require("@prisma/client");
const capitlizeFirstLetter_1 = __importDefault(require("../utils/capitlizeFirstLetter"));
/**
 * Builds the create/update payloads for the initial admin user.
 *
 * `role` and the legacy `isAdmin` flag are both written here so the rule
 * "an ADMIN is also isAdmin" cannot drift between the two code paths of the seed.
 */
function buildAdminSeedData(input, verificationKey) {
    const identity = {
        email: input.email,
        firstName: (0, capitlizeFirstLetter_1.default)(input.firstName),
        lastName: (0, capitlizeFirstLetter_1.default)(input.lastName),
        password: input.passwordHash,
        role: client_1.Role.ADMIN,
        isAdmin: true,
        verified: true,
    };
    return {
        create: Object.assign(Object.assign({}, identity), { verificationKey }),
        update: identity,
    };
}
//# sourceMappingURL=adminSeedData.js.map