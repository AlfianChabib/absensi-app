import { AttendanceStatus } from "@prisma/client";
import z from "zod";

export class AttendanceValidation {
  static create = z.object({
    date: z.date(),
    classId: z.string().min(1),
    data: z.array(
      z.object({
        studentId: z.string().min(1),
        name: z.string().min(1),
        status: z.enum(AttendanceStatus),
      })
    ),
  });

  static update = z.object({
    date: z.date(),
    classId: z.string().min(1),
    data: z.array(
      z.object({
        attendanceId: z.string().min(1),
        name: z.string().min(1),
        status: z.enum(AttendanceStatus),
      })
    ),
  });

  static delete = z.object({
    date: z.string().min(1),
    classId: z.string().min(1),
  });
}

export type CreateAttendanceSchema = z.infer<typeof AttendanceValidation.create>;
export type UpdateAttendanceSchema = z.infer<typeof AttendanceValidation.update>;
export type DeleteAttendanceSchema = z.infer<typeof AttendanceValidation.delete>;
