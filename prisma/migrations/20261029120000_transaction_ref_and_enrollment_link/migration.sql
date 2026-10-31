-- `transactionId` never stored the transaction's own id: it was seeded with the
-- ZarinPal authority and then overwritten with the ZarinPal ref_id after payment.
-- Each field now has exactly one meaning.
ALTER TABLE "Transaction" RENAME COLUMN "transactionId" TO "gatewayRefId";
ALTER INDEX "Transaction_transactionId_key" RENAME TO "Transaction_gatewayRefId_key";
ALTER TABLE "Transaction" ALTER COLUMN "gatewayRefId" DROP NOT NULL;
DROP INDEX "Transaction_transactionId_idx";
CREATE INDEX "Transaction_gatewayRefId_idx" ON "Transaction"("gatewayRefId");

-- A real authority always comes from the gateway; never invent one locally.
ALTER TABLE "Transaction" ALTER COLUMN "authority" DROP DEFAULT;

-- Enrollments record which transaction granted them (null for non-purchase grants).
ALTER TABLE "UsersOnCourses" ADD COLUMN "transactionId" INTEGER;
CREATE INDEX "UsersOnCourses_transactionId_idx" ON "UsersOnCourses"("transactionId");
ALTER TABLE "UsersOnCourses" ADD CONSTRAINT "UsersOnCourses_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
