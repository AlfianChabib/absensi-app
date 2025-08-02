import { AssessmentType } from "@prisma/client";
import z3 from "zod/v3";

export class GradeValidation {
  static create = z3.object({
    classId: z3.string(),
    date: z3.date(),
    type: z3.nativeEnum(AssessmentType, { message: "Tipe penilaian harus diisi" }),
    data: z3.array(
      z3.object({
        studentId: z3.string(),
        name: z3.string(),
        grade: z3.coerce
          .number()
          .min(0, { message: "Grade is required" })
          .max(100, { message: "Grade must be between 0 and 100" }),
      })
    ),
  });

  static update = z3.object({
    classId: z3.string(),
    date: z3.date(),
    type: z3.nativeEnum(AssessmentType, { message: "Tipe penilaian harus diisi" }),
    data: z3.array(
      z3.object({
        gradeId: z3.string(),
        name: z3.string(),
        grade: z3.coerce
          .number()
          .min(0, { message: "Grade is required" })
          .max(100, { message: "Grade must be between 0 and 100" }),
      })
    ),
  });
}

export type CreateGradeSchema = z3.infer<typeof GradeValidation.create>;
export type UpdateGradeSchema = z3.infer<typeof GradeValidation.update>;

//  z
//           .string()
//           .min(1, { error: "Grade is required" })
//           .transform((value) => (value === "" ? "" : Number(value)))
//           .refine((value) => !isNaN(Number(value)), {
//             message: "Please enter a valid number",
//           }),
