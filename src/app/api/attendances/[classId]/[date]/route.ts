import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string; date: string }> }) {
  const { classId, date } = await params;

  try {
    const data = await prisma.attendance.findMany({
      where: {
        classId: classId,
        date: new Date(date),
      },
      include: { student: { select: { name: true } } },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
