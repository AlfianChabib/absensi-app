import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { AttendanceResult } from "@/types/attendance";
import { CreateAttendanceSchema } from "@/validation/attendance.validation";
import { Attendance } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { user } = await getSession();

  try {
    const classes = await prisma.class.findMany({
      where: { userId: user.id },
      include: { attendances: true },
    });

    const groupedByClass = new Map<string, Attendance[]>();

    for (const item of classes) {
      if (item.attendances.length === 0) continue;
      for (const attendance of item.attendances) {
        const key = `${item.name}+${item.id}+${attendance.date}`;
        if (!groupedByClass.has(key)) {
          groupedByClass.set(key, []);
        }
        groupedByClass.get(key)?.push(attendance);
      }
    }

    const result: AttendanceResult[] = Array.from(groupedByClass)
      .map(([key, attendances]) => ({
        className: key.split("+")[0],
        classId: key.split("+")[1],
        date: key.split("+")[2],
        calc: {
          hadir: attendances.filter((a) => a.status === "HADIR").length,
          sakit: attendances.filter((a) => a.status === "SAKIT").length,
          izin: attendances.filter((a) => a.status === "IZIN").length,
          alfa: attendances.filter((a) => a.status === "ALFA").length,
        },
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ data: result, message: "Success get attendances" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("classId");
  const date = request.nextUrl.searchParams.get("date");
  const payload: CreateAttendanceSchema = await request.json();

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId! },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const attendances = await prisma.attendance.createMany({
      data: payload.data.map((data) => ({
        classId: existClass.id,
        studentId: data.studentId,
        date: new Date(date!),
        status: data.status,
      })),
      skipDuplicates: true,
    });
    return NextResponse.json({ data: attendances, message: "Success create attendance" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// export async function GET(request: NextRequest) {
//   const classId = request.nextUrl.searchParams.get("classId");
//   const date = request.nextUrl.searchParams.get("date");

//   try {
//     const existClass = await prisma.class.findUnique({
//       where: { id: classId! },
//     });

//     if (!existClass) {
//       return NextResponse.json({ error: "Class not found" }, { status: 404 });
//     }

//     const attendances = await prisma.attendance.count({
//       where: {
//         classId: existClass.id,
//         date: new Date(date!),
//       },
//     });

//     const students = await prisma.student.findMany({
//       where: { classId: existClass.id },
//     });

//     return NextResponse.json(
//       { data: { existAttendance: attendances, students }, message: "Success get attendances" },
//       { status: 200 }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log(error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }
// }
