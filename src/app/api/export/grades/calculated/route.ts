import prisma from "@/lib/db";
import { fromUnixTime, getUnixTime } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("classId");
  const startDate = request.nextUrl.searchParams.get("startDate");
  const endDate = request.nextUrl.searchParams.get("endDate");

  if (!classId || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    const classData = await prisma.class.findUnique({ where: { id: classId } });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: { classId: classData.id },
      include: {
        grade: { where: { date: { gte: fromUnixTime(Number(startDate)), lte: fromUnixTime(Number(endDate)) } } },
      },
    });

    const setDates = new Set<string>();

    students.forEach((student) => {
      student.grade.forEach((grade) => {
        setDates.add(`${getUnixTime(grade.date)}-${grade.assessmentType}`);
      });
    });

    const data = students.map((student) => {
      const avg = student.grade.reduce((acc, cur) => acc + cur.score, 0) / Array.from(setDates).length;
      return {
        studentId: student.id,
        name: student.name,
        gender: student.gender,
        nis: student.nis,
        avg,
      };
    });
    return NextResponse.json({ data: data, message: "success" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
