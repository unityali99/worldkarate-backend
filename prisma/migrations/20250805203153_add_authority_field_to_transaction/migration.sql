-- DropIndex
DROP INDEX "Transaction_authority_key";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "authority" DROP DEFAULT;
