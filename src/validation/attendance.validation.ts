import { AttendanceStatus } from "@prisma/client";
import z from "zod";

export class AttendanceValidation {
  static create = z.object({
    date: z.string().min(1),
    classId: z.string().min(1),
    data: z.array(
      z.object({
        studentId: z.string().min(1),
        name: z.string().min(1),
        status: z.enum(AttendanceStatus),
      })
    ),
  });
}

export type CreateAttendanceSchema = z.infer<typeof AttendanceValidation.create>;
