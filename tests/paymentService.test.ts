import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/repositories/course.repository", () => ({
  CourseRepository: { findByIds: vi.fn() },
}));
vi.mock("../src/repositories/user.repository", () => ({
  UserRepository: { findUserCourseEnrollment: vi.fn(), enrollCourses: vi.fn() },
}));
vi.mock("../src/repositories/transaction.repository", () => ({
  TransactionRepository: {
    createPendingTransaction: vi.fn(),
    findByAuthorityWithDetails: vi.fn(),
    markAsPaid: vi.fn(),
  },
}));
vi.mock("../utils/zarinpal", () => ({
  zarinpal: {
    payments: { create: vi.fn(), getRedirectUrl: vi.fn() },
    verifications: { verify: vi.fn() },
  },
}));

import { PaymentService } from "../src/services/payment.service";
import { CourseRepository } from "../src/repositories/course.repository";
import { UserRepository } from "../src/repositories/user.repository";
import { TransactionRepository } from "../src/repositories/transaction.repository";
import { zarinpal } from "../utils/zarinpal";

const AUTHORITY = "A00000000000000000000000000001234567";

const pendingTransaction = {
  id: 42,
  isPaid: false,
  totalPrice: 300_000,
  authority: AUTHORITY,
  userId: 7,
  transactionsOnCourses: [
    { courseId: 1, course: { id: 1, title: "kata" } },
    { courseId: 2, course: { id: 2, title: "kumite" } },
  ],
};

describe("PaymentService.checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the internal transaction id under `transactionId`", async () => {
    (CourseRepository.findByIds as any).mockResolvedValue([
      { id: 1, price: 100_000 },
      { id: 2, price: 200_000 },
    ]);
    (UserRepository.findUserCourseEnrollment as any).mockResolvedValue(null);
    (zarinpal.payments.create as any).mockResolvedValue({
      data: { code: 100, authority: AUTHORITY },
    });
    (zarinpal.payments.getRedirectUrl as any).mockReturnValue(
      `https://gateway/pay/${AUTHORITY}`,
    );
    (TransactionRepository.createPendingTransaction as any).mockResolvedValue({
      id: 42,
    });

    const result: any = await PaymentService.checkout(
      { id: 7, email: "user@example.com" } as any,
      ["1", "2"],
    );

    expect(TransactionRepository.createPendingTransaction).toHaveBeenCalledWith(
      {
        userId: 7,
        totalPrice: 300_000,
        authority: AUTHORITY,
        courses: [
          { id: 1, price: 100_000 },
          { id: 2, price: 200_000 },
        ],
      },
    );
    expect(result.status).toBe(200);
    expect(result.transactionId).toBe(42);
  });
});

describe("PaymentService.verify", () => {
  beforeEach(() => vi.clearAllMocks());

  it("links the granted enrollments to the transaction and exposes `refId`", async () => {
    (TransactionRepository.findByAuthorityWithDetails as any).mockResolvedValue(
      pendingTransaction,
    );
    (zarinpal.verifications.verify as any).mockResolvedValue({
      data: { code: 100, ref_id: 123456789 },
    });

    const result: any = await PaymentService.verify(AUTHORITY);

    expect(TransactionRepository.markAsPaid).toHaveBeenCalledWith(
      42,
      "123456789",
    );
    expect(UserRepository.enrollCourses).toHaveBeenCalledWith(7, [1, 2], 42);
    expect(result.status).toBe(200);
    expect(result.transaction.refId).toBe("123456789");
    // The key used to hold ZarinPal's ref_id, which collided with the meaning
    // it had in the checkout response (the internal transaction id).
    expect(result.transaction).not.toHaveProperty("transactionId");
  });

  it("charges the frozen totalPrice instead of the current course price", async () => {
    (TransactionRepository.findByAuthorityWithDetails as any).mockResolvedValue({
      ...pendingTransaction,
      transactionsOnCourses: [
        { courseId: 1, course: { id: 1, title: "kata", price: 9_999_999 } },
        { courseId: 2, course: { id: 2, title: "kumite", price: 9_999_999 } },
      ],
    });
    (zarinpal.verifications.verify as any).mockResolvedValue({
      data: { code: 100, ref_id: 123456789 },
    });

    await PaymentService.verify(AUTHORITY);

    expect(zarinpal.verifications.verify).toHaveBeenCalledWith({
      amount: 300_000,
      authority: AUTHORITY,
    });
    // The catalog is never re-read once the order exists.
    expect(CourseRepository.findByIds).not.toHaveBeenCalled();
  });

  it("does not enroll twice when the payment was already verified", async () => {
    (TransactionRepository.findByAuthorityWithDetails as any).mockResolvedValue(
      {
        ...pendingTransaction,
        isPaid: true,
        gatewayRefId: "123456789",
      },
    );

    const result: any = await PaymentService.verify(AUTHORITY);

    expect(zarinpal.verifications.verify).not.toHaveBeenCalled();
    expect(UserRepository.enrollCourses).not.toHaveBeenCalled();
    expect(result.isAlreadyPaid).toBe(true);
  });
});
