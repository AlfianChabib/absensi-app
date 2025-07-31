/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date,assessmentType]` on the table `grades` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "grades_studentId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "grades_studentId_date_assessmentType_key" ON "grades"("studentId", "date", "assessmentType");
