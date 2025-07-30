import { CreateGradeSchema } from "@/validation/grade.validation";
import { AssessmentType, Student } from "@prisma/client";

export class GradeService {
  static async getStudentsGrade({ classId, date, type }: { classId: string; date: Date; type: AssessmentType }) {
    const response = await fetch(`/api/grades/student?classId=${classId}&date=${date}&type=${type}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as { existGrade: number; students: Student[] };
  }

  static async createGrade(payload: CreateGradeSchema) {
    const response = await fetch(`/api/grades`, {
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
