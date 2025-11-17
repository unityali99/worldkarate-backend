/*
  Warnings:

  - You are about to drop the column `paymentRefId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authority]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transaction_isPaid_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentRefId",
ADD COLUMN     "authority" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TransactionsOnCourses" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UsersOnCourses" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_authority_key" ON "Transaction"("authority");

-- CreateIndex
CREATE INDEX "Transaction_authority_idx" ON "Transaction"("authority");
