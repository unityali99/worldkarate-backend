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
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../../prisma/db"));
class UserRepository {
    static findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.findMany(params);
        });
    }
    static findById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.findUnique({ where: { id }, include });
        });
    }
    static findByEmail(email, include) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.findUnique({ where: { email }, include });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.create({ data });
        });
    }
    static updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.update({ where: { id }, data });
        });
    }
    static updateByEmail(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.update({ where: { email }, data });
        });
    }
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.delete({ where: { id } });
        });
    }
    static findUserCourseEnrollment(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.usersOnCourses.findUnique({
                where: { userId_courseId: { courseId, userId } },
            });
        });
    }
    static findEnrolledCourseIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.usersOnCourses.findMany({
                where: { userId },
                select: { courseId: true },
            });
        });
    }
    static enrollCourses(userId, courseIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.update({
                where: { id: userId },
                data: {
                    courses: {
                        createMany: {
                            data: courseIds.map((courseId) => ({ courseId })),
                            skipDuplicates: true,
                        },
                    },
                },
            });
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map