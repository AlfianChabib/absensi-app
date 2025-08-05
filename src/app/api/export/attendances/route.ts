import prisma from "@/lib/db";
import { EXPORT_TIME_TYPES } from "@/types/export";
import { ExportAttendances } from "@/validation/export.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const payload: ExportAttendances = await request.json();

  try {
    const data = await prisma.attendance.findMany({
      where: {
        classId: payload.classId,
        date:
          payload.type === EXPORT_TIME_TYPES.CURRENT
            ? payload.curDate
            : {
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

export async function POST(request: NextRequest) {
  const payload: ExportAttendances = await request.json();

  try {
    const data = await prisma.attendance.findMany({
      where: {
        classId: payload.classId,
        date:
          payload.type === EXPORT_TIME_TYPES.CURRENT
            ? payload.startDate
            : {
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
