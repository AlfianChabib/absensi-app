import prisma from "@/lib/db";
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
