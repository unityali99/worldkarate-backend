/*
  Warnings:

  - A unique constraint covering the columns `[authority]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_authority_key" ON "Transaction"("authority");
