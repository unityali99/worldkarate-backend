-- Freeze the price paid for each course at checkout time, so later catalog
-- price changes cannot rewrite the history of existing orders.
ALTER TABLE "TransactionsOnCourses" ADD COLUMN "priceAtPurchase" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "TransactionsOnCourses" ALTER COLUMN "priceAtPurchase" DROP DEFAULT;
