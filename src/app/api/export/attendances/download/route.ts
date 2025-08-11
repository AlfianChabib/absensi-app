import { exportAttendance2 } from "@/helpers/export/attendance";
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
      include: {
        attendance: {
          where: { date: { gte: payload.startDate, lte: payload.endDate } },
          orderBy: { date: "asc" },
        },
      },
    });

    const buffer = await exportAttendance2({ students, classData });
    const headers = new Headers();
    headers.append("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.append("Content-Disposition", 'attachment; filename="daftar-absen.xlsx"');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
