import prisma from "../prisma/db";

export async function generateUniqueTransactionId(): Promise<string> {
  let transactionId: string;
  do {
    transactionId = Math.floor(10000 + Math.random() * 90000).toString();
  } while (await prisma.transaction.findUnique({ where: { transactionId } }));

  return transactionId;
}
