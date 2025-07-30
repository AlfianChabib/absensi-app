import prisma from "@/lib/db";
import { AttendanceResult } from "@/types/attendance";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
//   const { classId } = await params;

//   try {
//     const existClass = await prisma.class.findUnique({
//       where: { id: classId },
//     });

//     if (!existClass) {
//       return NextResponse.json({ error: "Class not found" }, { status: 404 });
//     }
//     const attendances = await prisma.attendance.findMany({
//       where: { classId: classId },
//     });

//     const map = new Map<string, Attendance[]>();

//     for (const attendance of attendances) {
//       const date = attendance.date.toDateString();
//       if (!map.has(date)) {
//         map.set(date, []);
//       }
//       map.get(date)?.push(attendance);
//     }

//     const result: AttendanceResult[] = [];

//     for (const [date, attendance] of map) {
//       const calc = {
//         hadir: attendance.filter((attendance) => attendance.status === "HADIR").length,
//         sakit: attendance.filter((attendance) => attendance.status === "SAKIT").length,
//         izin: attendance.filter((attendance) => attendance.status === "IZIN").length,
//         alfa: attendance.filter((attendance) => attendance.status === "ALFA").length,
//       };

//       result.push({
//         className: existClass.name,
//         classId: existClass.id,
//         date,
//         calc,
//       });
//     }

//     return NextResponse.json({ data: result, message: "Success get attendances" }, { status: 200 });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }
// }

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;

  try {
    const existClass = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, name: true },
    });

    if (!existClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { classId },
      select: { date: true, status: true },
      orderBy: { date: "desc" },
    });

    // Group by date
    const grouped = attendances.reduce<Record<string, { status: string }[]>>((acc, curr) => {
      const date = curr.date.toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(curr);
      return acc;
    }, {});

    const result: AttendanceResult[] = Object.entries(grouped).map(([date, attendance]) => ({
      className: existClass.name,
      classId: existClass.id,
      date,
      calc: {
        hadir: attendance.filter((a) => a.status === "HADIR").length,
        sakit: attendance.filter((a) => a.status === "SAKIT").length,
        izin: attendance.filter((a) => a.status === "IZIN").length,
        alfa: attendance.filter((a) => a.status === "ALFA").length,
      },
    }));

    return NextResponse.json({ data: result, message: "Success get attendances" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
