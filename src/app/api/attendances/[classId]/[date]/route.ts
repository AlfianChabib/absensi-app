import prisma from "@/lib/db";
import { UpdateAttendanceSchema } from "@/validation/attendance.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string; date: string }> }) {
  const { classId, date } = await params;

  try {
    const data = await prisma.attendance.findMany({
      where: {
        classId: classId,
        date: new Date(date),
      },
      include: {
        student: {
          select: { name: true },
        },
        class: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ classId: string; date: string }> }) {
  const { classId, date } = await params;
  const payload: UpdateAttendanceSchema = await request.json();

  try {
    for (const item of payload.data) {
      await prisma.attendance.update({
        where: {
          classId: classId,
          date: new Date(date),
          id: item.attendanceId,
        },
        data: {
          status: item.status,
        },
      });
    }

    return NextResponse.json({ message: "Success update attendance" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ classId: string; date: string }> }) {
  const { classId, date } = await params;

  try {
    await prisma.attendance.deleteMany({
      where: {
        classId: classId,
        date: new Date(date),
      },
    });

    return NextResponse.json({ message: "Success delete attendance" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
