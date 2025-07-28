import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;

  try {
    const attendances = await prisma.attendance.findMany({
      where: { classId: classId },
      orderBy: { date: "desc" },
    });
    console.log(attendances);

    return NextResponse.json({ data: attendances, message: "Success get attendances" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
