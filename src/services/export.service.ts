import { CalculatedAttendance, CalculatedGrade, EXPORT_TYPES, ExportType } from "@/types/export";
import { Attendance, Class, Grade } from "@prisma/client";
import { getUnixTime } from "date-fns";

type AttendanceDate = Pick<Attendance, "date" | "classId">;
type GradeDate = Pick<Grade, "date" | "classId">;

type ExportResultMap = {
  [EXPORT_TYPES.ATTENDANCES]: CalculatedAttendance[];
  [EXPORT_TYPES.GRADES]: CalculatedGrade[];
};

export class ExportService {
  static async getClasses() {
    const response = await fetch("/api/export/classes", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as (Class & { _count: { students: number } } & {
      firstAttendance: AttendanceDate;
      lastAttendance: AttendanceDate;
      firstGrade: GradeDate;
      lastGrade: GradeDate;
    })[];
  }

  static async exportAttendances(classId: string, type: ExportType, startDate: Date, endDate: Date) {
    const response = await fetch(`/api/export/${type}/downlaod`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId,
        type,
        startDate,
        endDate,
      }),
    });

    const data = await response.json();
    return data.data as string;
  }

  static async getCalculated<T extends ExportType>(
    classId: string,
    type: T,
    startDate: Date,
    endDate: Date
  ): Promise<ExportResultMap[T]> {
    const params = new URLSearchParams({
      classId,
      startDate: getUnixTime(startDate).toString(),
      endDate: getUnixTime(endDate).toString(),
    });

    const response = await fetch(`/api/export/${type}/calculated?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as ExportResultMap[T];
  }
}
