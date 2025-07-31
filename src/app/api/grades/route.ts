import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { CreateGradeSchema } from "@/validation/grade.validation";
import { AssessmentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GradeResult = {
  className: string;
  classId: string;
  date: Date;
  assessmentType: AssessmentType;
  stats: {
    a: number; // 90 - 100
    b: number; // 80 - 89
    c: number; // 70 - 79
    d: number; // 60 - 69
    e: number; // 0 - 59
  };
};

export async function GET() {
  const { user } = await getSession();

  try {
    const data = await prisma.grade.findMany({
      where: { class: { userId: user.id } },
      include: { class: true },
    });

    const groupedByClassDateAssesmentType = new Map<string, typeof data>();

    for (const item of data) {
      const key = `${item.class.name}+${item.class.id}+${item.assessmentType}+${item.date}`;
      if (!groupedByClassDateAssesmentType.has(key)) {
        groupedByClassDateAssesmentType.set(key, []);
      }
      groupedByClassDateAssesmentType.get(key)?.push(item);
    }

    const result: GradeResult[] = Array.from(groupedByClassDateAssesmentType).map(([key, grade]) => ({
      className: key.split("+")[0],
      classId: key.split("+")[1],
      date: new Date(key.split("+")[3]),
      assessmentType: key.split("+")[2] as AssessmentType,
      stats: {
        a: grade.filter((g) => g.score >= 90 && g.score <= 100).length,
        b: grade.filter((g) => g.score >= 80 && g.score <= 89).length,
        c: grade.filter((g) => g.score >= 70 && g.score <= 79).length,
        d: grade.filter((g) => g.score >= 60 && g.score <= 69).length,
        e: grade.filter((g) => g.score >= 0 && g.score <= 59).length,
      },
    }));

    return NextResponse.json({ data: result, message: "Success get grades" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  const payload: CreateGradeSchema = await request.json();

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: payload.classId },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    console.log(payload);

    for (const item of payload.data) {
      await prisma.grade.create({
        data: {
          studentId: item.studentId,
          classId: existClass.id,
          date: new Date(payload.date),
          assessmentType: payload.type,
          score: item.grade,
        },
      });
    }

    // await prisma.grade.createMany({
    //   data: payload.data.map((item) => ({
    //     studentId: item.studentId,
    //     classId: existClass.id,
    //     date: new Date(payload.date),
    //     assessmentType: payload.type,
    //     score: item.grade,
    //   })),
    //   skipDuplicates: true,
    // });

    return NextResponse.json({ message: "Success create grade" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
