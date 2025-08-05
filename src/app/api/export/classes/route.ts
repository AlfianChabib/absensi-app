import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const { user } = await getSession();

  try {
    const classes = await prisma.class.findMany({
      where: { userId: user.id },
      include: { _count: { select: { students: true } } },
    });

    if (classes.length === 0) {
      return NextResponse.json({ data: [], message: "success" }, { status: 200 });
    }

    const classIds = classes.map((classItem) => classItem.id);

    const [firstAttendances, lastAttendances, firstGrades, lastGrades] = await Promise.all([
      prisma.attendance.findMany({
        where: { classId: { in: classIds } },
        distinct: ["classId"],
        orderBy: [{ classId: "asc" }, { date: "asc" }],
        select: { date: true, classId: true },
      }),
      prisma.attendance.findMany({
        where: { classId: { in: classIds } },
        distinct: ["classId"],
        orderBy: [{ classId: "asc" }, { date: "desc" }],
        select: { date: true, classId: true },
      }),
      prisma.grade.findMany({
        where: { classId: { in: classIds } },
        distinct: ["classId"],
        orderBy: [{ classId: "asc" }, { date: "asc" }],
        select: { date: true, classId: true },
      }),
      prisma.grade.findMany({
        where: { classId: { in: classIds } },
        distinct: ["classId"],
        orderBy: [{ classId: "asc" }, { date: "desc" }],
        select: { date: true, classId: true },
      }),
    ]);

    const firstAttendanceMap = new Map(firstAttendances.map((att) => [att.classId, att]));
    const lastAttendanceMap = new Map(lastAttendances.map((att) => [att.classId, att]));
    const lastGradeMap = new Map(lastGrades.map((att) => [att.classId, att]));
    const firstGradeMap = new Map(firstGrades.map((att) => [att.classId, att]));

    const finalResults = classes.map((cls) => {
      return {
        ...cls,
        firstAttendance: firstAttendanceMap.get(cls.id),
        lastAttendance: lastAttendanceMap.get(cls.id),
        lastGrade: lastGradeMap.get(cls.id),
        firstGrade: firstGradeMap.get(cls.id),
      };
    });

    return NextResponse.json({ data: finalResults, message: "success" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || error.toString() }, { status: 500 });
    }
  }
}
