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
exports.TransactionRepository = void 0;
const db_1 = __importDefault(require("../../prisma/db"));
class TransactionRepository {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.transaction.findUnique({ where: { id } });
        });
    }
    static findByAuthority(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.transaction.findUnique({ where: { authority } });
        });
    }
    static findByAuthorityWithDetails(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.transaction.findUnique({
                where: { authority },
                include: {
                    user: true,
                    transactionsOnCourses: { include: { course: true } },
                },
            });
        });
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.transaction.findMany({
                where: { userId },
                include: { transactionsOnCourses: { include: { course: true } } },
            });
        });
    }
    static createPendingTransaction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, totalPrice, authority, courseIds } = params;
            return db_1.default.transaction.create({
                data: {
                    isPaid: false,
                    transactionId: authority,
                    totalPrice,
                    authority,
                    user: { connect: { id: userId } },
                    transactionsOnCourses: {
                        createMany: {
                            data: courseIds.map((courseId) => ({ courseId })),
                        },
                    },
                },
            });
        });
    }
    static markAsPaid(id, refId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.transaction.update({
                where: { id },
                data: { isPaid: true, transactionId: refId },
            });
        });
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map