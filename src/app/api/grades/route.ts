import prisma from "@/lib/db";
import { CreateGradeSchema } from "@/validation/grade.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload: CreateGradeSchema = await request.json();

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: payload.classId },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    await prisma.grade.createMany({
      data: payload.data.map((item) => ({
        studentId: item.studentId,
        classId: existClass.id,
        date: new Date(payload.date),
        assessmentType: payload.type,
        score: item.grade,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Success create grade" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
