import prisma from "@/lib/db";
import { CreateAttendanceSchema } from "@/validation/attendance.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("classId");
  const date = request.nextUrl.searchParams.get("date");

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId! },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const attendances = await prisma.attendance.count({
      where: { classId: existClass.id, date: new Date(date!) },
    });

    const students = await prisma.student.findMany({
      where: { classId: existClass.id },
    });

    return NextResponse.json(
      { data: { existAttendance: attendances, students }, message: "Success get attendances" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("classId");
  const date = request.nextUrl.searchParams.get("date");
  const payload: CreateAttendanceSchema = await request.json();

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId! },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const attendances = await prisma.attendance.createMany({
      data: payload.data.map((data) => ({
        classId: existClass.id,
        studentId: data.studentId,
        date: new Date(date!),
        status: data.status,
      })),
      skipDuplicates: true,
    });
    return NextResponse.json({ data: attendances, message: "Success create attendance" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
