import { CreateAttendanceSchema } from "@/validation/attendance.validation";
import { Student } from "@prisma/client";

export class AttendanceService {
  static async getAttendances({ classId }: { classId: string }) {
    const response = await fetch(`/api/class/${classId}/attendances`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as unknown[];
  }

  static async getStudentsAttendance({ classId, date }: { classId: string; date: string }) {
    const response = await fetch(`/api/attendances?classId=${classId}&date=${date}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as { existAttendance: number; students: Student[] };
  }

  static async createAttendance(payload: CreateAttendanceSchema) {
    const response = await fetch(`/api/attendances?classId=${payload.classId}&date=${payload.date}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  }
}
