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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const newsletter_repository_1 = require("../repositories/newsletter.repository");
class NewsletterService {
    static subscribe(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield newsletter_repository_1.NewsletterRepository.findByEmail(email);
            if (existing) {
                return {
                    status: 400,
                    message: "ایمیل وارد شده در خبرنامه ثبت نام شده است",
                };
            }
            yield newsletter_repository_1.NewsletterRepository.create(email);
            return {
                status: 200,
                message: "ایمیل با موفقیت به لیست خبرنامه اضافه شد",
            };
        });
    }
}
exports.NewsletterService = NewsletterService;
//# sourceMappingURL=newsletter.service.js.map