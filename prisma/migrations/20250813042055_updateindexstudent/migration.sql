/*
  Warnings:

  - A unique constraint covering the columns `[name,nis]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "students_name_nis_key" ON "students"("name", "nis");
