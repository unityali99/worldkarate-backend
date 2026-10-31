import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../prisma/db", () => ({
  default: {
    transaction: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import prisma from "../prisma/db";
import { TransactionRepository } from "../src/repositories/transaction.repository";

describe("TransactionRepository payment references", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a pending transaction holding only the gateway authority", async () => {
    (prisma.transaction.create as any).mockResolvedValue({ id: 1 });

    await TransactionRepository.createPendingTransaction({
      userId: 7,
      totalPrice: 300_000,
      authority: "A00000000000000000000000000001234567",
      courses: [{ id: 3, price: 250_000 }],
    });

    const data = (prisma.transaction.create as any).mock.calls[0][0].data;
    expect(data.authority).toBe("A00000000000000000000000000001234567");
    // Regression: the retired `transactionId` column used to duplicate the
    // authority, so the same string lived in two unique columns.
    expect(data).not.toHaveProperty("transactionId");
    expect(data).not.toHaveProperty("gatewayRefId");
  });

  it("snapshots each course price at checkout", async () => {
    (prisma.transaction.create as any).mockResolvedValue({ id: 1 });

    await TransactionRepository.createPendingTransaction({
      userId: 7,
      totalPrice: 300_000,
      authority: "A00000000000000000000000000001234567",
      courses: [
        { id: 3, price: 100_000 },
        { id: 4, price: 200_000 },
      ],
    });

    const data = (prisma.transaction.create as any).mock.calls[0][0].data;
    expect(data.transactionsOnCourses.createMany.data).toEqual([
      { courseId: 3, priceAtPurchase: 100_000 },
      { courseId: 4, priceAtPurchase: 200_000 },
    ]);
  });

  it("writes ZarinPal's ref_id into gatewayRefId on verification", async () => {
    (prisma.transaction.update as any).mockResolvedValue({});

    await TransactionRepository.markAsPaid(42, "123456789");

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: { isPaid: true, gatewayRefId: "123456789" },
    });
  });
});
