import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;

  try {
    const students = await prisma.student.findMany({
      where: { classId: classId },
    });
    return NextResponse.json({ data: students, message: "Success get students" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
