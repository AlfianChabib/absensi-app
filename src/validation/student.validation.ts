import { Gender } from "@prisma/client";
import { z } from "zod";

export class StudentValidation {
  static create = z.object({
    name: z.string().min(1),
    nis: z.string().min(1),
    classId: z.string().min(1),
    gender: z.enum(Gender),
  });

  static update = z.object({
    studentId: z.string().min(1),
    name: z.string().min(1),
    nis: z.string().min(1),
    gender: z.enum(Gender),
  });
}

export type CreateStudentSchema = z.infer<typeof StudentValidation.create>;
export type UpdateStudentSchema = z.infer<typeof StudentValidation.update>;
