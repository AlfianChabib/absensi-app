import { Attendance, Class } from "@prisma/client";

type AttendanceDate = Pick<Attendance, "date" | "classId">;

export class ExportService {
  static async getClasses() {
    const response = await fetch("/api/export/classes", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    return data.data as (Class & { _count: { students: number } } & {
      firstAttendance: AttendanceDate;
      lastAttendance: AttendanceDate;
    })[];
  }
}
