-- Course content and authoring models: sections, lessons, per-lesson HLS keys,
-- watch progress, karate styles, article-style content blocks, instructor profiles,
-- and soft deletes. Generated with
-- `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HEADING', 'TEXT', 'IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isForAnyStyle" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImg" TEXT,
    "position" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImg" TEXT,
    "position" INTEGER NOT NULL,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "assetPrefix" TEXT,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonKey" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "wrappedKey" BYTEA NOT NULL,
    "iv" BYTEA NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'aes-256-gcm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "positionSec" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "Style" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseStyle" (
    "courseId" INTEGER NOT NULL,
    "styleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseStyle_pkey" PRIMARY KEY ("courseId","styleId")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" SERIAL NOT NULL,
    "type" "BlockType" NOT NULL,
    "body" TEXT NOT NULL,
    "caption" TEXT,
    "position" INTEGER NOT NULL,
    "courseId" INTEGER,
    "sectionId" INTEGER,
    "lessonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorProfile" (
    "userId" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT,
    "rank" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_courseId_position_key" ON "Section"("courseId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_sectionId_position_key" ON "Lesson"("sectionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "LessonKey_lessonId_key" ON "LessonKey"("lessonId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Style_slug_key" ON "Style"("slug");

-- CreateIndex
CREATE INDEX "CourseStyle_styleId_idx" ON "CourseStyle"("styleId");

-- CreateIndex
CREATE INDEX "ContentBlock_courseId_position_idx" ON "ContentBlock"("courseId", "position");

-- CreateIndex
CREATE INDEX "ContentBlock_sectionId_position_idx" ON "ContentBlock"("sectionId", "position");

-- CreateIndex
CREATE INDEX "ContentBlock_lessonId_position_idx" ON "ContentBlock"("lessonId", "position");

-- CreateIndex
CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonKey" ADD CONSTRAINT "LessonKey_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStyle" ADD CONSTRAINT "CourseStyle_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStyle" ADD CONSTRAINT "CourseStyle_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorProfile" ADD CONSTRAINT "InstructorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
