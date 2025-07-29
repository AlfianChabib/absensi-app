import { AttendanceResult } from "@/types/attendance";
import { CreateAttendanceSchema, UpdateAttendanceSchema } from "@/validation/attendance.validation";
import { Attendance, Student } from "@prisma/client";

export class AttendanceService {
  static async getAll() {
    const response = await fetch(`/api/attendances`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as AttendanceResult[];
  }

  static async getAttendances({ classId }: { classId: string }) {
    const response = await fetch(`/api/class/${classId}/attendances`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as AttendanceResult[];
  }

  static async getStudentsAttendance({ classId, date }: { classId: string; date: Date }) {
    const response = await fetch(`/api/attendances/student?classId=${classId}&date=${date}`, {
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

  static async getByClassIdAndDate({ classId, date }: { classId: string; date: Date }) {
    const response = await fetch(`/api/attendances/${classId}/${date}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as (Attendance & { student: { name: string } })[];
  }

  static async updateAttendance(payload: UpdateAttendanceSchema) {
    const response = await fetch(`/api/attendances`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  }
}
