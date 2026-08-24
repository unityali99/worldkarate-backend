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
exports.CourseRepository = void 0;
const db_1 = __importDefault(require("../../prisma/db"));
class CourseRepository {
    static findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.findMany(params);
        });
    }
    static findById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.findUnique({ where: { id }, include });
        });
    }
    static findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.findMany({ where: { id: { in: ids } } });
        });
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.findMany({ where: { users: { some: { userId } } } });
        });
    }
    static findByInstructorId(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.findMany({ where: { instructorId } });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.create({ data });
        });
    }
    static updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.update({ where: { id }, data });
        });
    }
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.course.delete({ where: { id } });
        });
    }
}
exports.CourseRepository = CourseRepository;
//# sourceMappingURL=course.repository.js.map