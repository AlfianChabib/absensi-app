/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `class` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `assessmentType` to the `grades` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('TUGAS', 'ULANGAN_HARIAN', 'UTS', 'UAS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_userId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "class" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "assessmentType" "AssessmentType" NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';

-- CreateIndex
CREATE UNIQUE INDEX "attendances_studentId_date_key" ON "attendances"("studentId", "date");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
