-- CreateEnum
CREATE TYPE "LessonProcessState" AS ENUM ('NONE', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "failureInfo" TEXT,
ADD COLUMN     "masterKey" TEXT,
ADD COLUMN     "processState" "LessonProcessState" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "processingSince" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lesson_processState_idx" ON "Lesson"("processState");
