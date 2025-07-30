import prisma from "@/lib/db";
import { AssessmentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("classId");
  const date = request.nextUrl.searchParams.get("date");
  const type = request.nextUrl.searchParams.get("type");

  if (!classId || !date) {
    return NextResponse.json({ error: "Missing classId or date" }, { status: 400 });
  }

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId! },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const grades = await prisma.grade.count({
      where: { classId: existClass.id, date: new Date(date), assessmentType: type as AssessmentType },
    });

    const students = await prisma.student.findMany({
      where: { classId: existClass.id },
    });

    return NextResponse.json(
      { data: { existGrade: grades, students }, message: "Success get grades" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
