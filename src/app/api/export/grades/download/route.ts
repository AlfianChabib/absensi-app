import { exportGrade } from "@/helpers/export/grade";
import prisma from "@/lib/db";
import { ExportAttendances } from "@/validation/export.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload: ExportAttendances = await request.json();

  try {
    const classData = await prisma.class.findUnique({ where: { id: payload.classId } });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: { classId: classData.id },
      include: { grade: { where: { date: { gte: payload.startDate, lte: payload.endDate } } } },
    });

    const buffer = await exportGrade({ students, classData });
    const headers = new Headers();
    headers.append("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.append("Content-Disposition", 'attachment; filename="daftar-absen.xlsx"');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
