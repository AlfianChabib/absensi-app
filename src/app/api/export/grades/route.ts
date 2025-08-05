import prisma from "@/lib/db";
import { ExportAttendances } from "@/validation/export.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload: ExportAttendances = await request.json();

  try {
    const data = await prisma.grade.findMany({
      where: {
        classId: payload.classId,
        date: {
          gte: payload.startDate,
          lte: payload.endDate,
        },
      },
    });

    return NextResponse.json({ data, message: "success" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
