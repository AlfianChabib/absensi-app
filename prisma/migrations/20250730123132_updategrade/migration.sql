/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `grades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "grades_studentId_date_key" ON "grades"("studentId", "date");

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
