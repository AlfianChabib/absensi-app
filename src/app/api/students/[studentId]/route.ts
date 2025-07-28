import prisma from "@/lib/db";
import { UpdateStudentSchema } from "@/validation/student.validation";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  try {
    const students = await prisma.student.findUnique({
      where: { id: studentId },
    });
    return NextResponse.json({ data: students, message: "Success get student" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  try {
    const student: UpdateStudentSchema = await request.json();
    const students = await prisma.student.update({
      where: { id: studentId },
      data: { name: student.name, gender: student.gender, nis: student.nis },
    });
    return NextResponse.json({ data: students, message: "Success update student" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  try {
    const students = await prisma.student.delete({
      where: { id: studentId },
    });
    return NextResponse.json({ data: students, message: "Success delete student" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
