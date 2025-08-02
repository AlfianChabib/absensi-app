import prisma from "@/lib/db";
import { UpdateGradeSchema } from "@/validation/grade.validation";
import { AssessmentType } from "@prisma/client";
import { fromUnixTime } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; date: string; type: string }> }
) {
  const { classId, date, type } = await params;

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const grades = await prisma.grade.findMany({
      where: {
        class: { id: existClass.id },
        date: fromUnixTime(parseInt(date)),
        assessmentType: type as AssessmentType,
      },
      include: { student: { select: { name: true } } },
    });

    return NextResponse.json(
      {
        data: { grades: grades, class: existClass },
        message: "Success get grades",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; date: string; type: string }> }
) {
  const { classId } = await params;

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const payload: UpdateGradeSchema = await request.json();

    for (const item of payload.data) {
      await prisma.grade.update({
        where: { id: item.gradeId },
        data: {
          score: item.grade,
        },
      });
    }

    return NextResponse.json({ message: "Success update grade" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; date: string; type: string }> }
) {
  const { classId, date, type } = await params;

  try {
    await prisma.grade.deleteMany({
      where: {
        class: { id: classId },
        date: fromUnixTime(parseInt(date)),
        assessmentType: type as AssessmentType,
      },
    });

    return NextResponse.json({ message: "Success delete grade" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
