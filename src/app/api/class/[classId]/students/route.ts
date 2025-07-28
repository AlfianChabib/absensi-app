import prisma from "@/lib/db";
import { CreateStudentSchema } from "@/validation/student.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;

  try {
    const students = await prisma.student.findMany({
      where: { classId: classId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: students, message: "Success get students" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;

  try {
    const student: CreateStudentSchema = await request.json();
    const students = await prisma.student.create({
      data: {
        name: student.name,
        gender: student.gender,
        nis: student.nis,
        class: { connect: { id: classId } },
      },
    });
    return NextResponse.json({ data: students, message: "Success create student" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
