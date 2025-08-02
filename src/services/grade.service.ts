import { GradeResult } from "@/app/api/grades/route";
import { CreateGradeSchema, UpdateGradeSchema } from "@/validation/grade.validation";
import { AssessmentType, Class, Grade, Student } from "@prisma/client";

export class GradeService {
  static async getAll({ classId }: { classId?: string }) {
    const response = await fetch(`/api/grades${classId ? `?classId=${classId}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as GradeResult[];
  }

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

  static async getByClassIdDateType(payload: { classId: string; date: number; type: AssessmentType }) {
    const response = await fetch(`/api/grades/${payload.classId}/${payload.date}/${payload.type}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as { grades: (Grade & { student: { name: string } })[]; class: Class };
  }

  static async updateGrade(payload: UpdateGradeSchema) {
    const response = await fetch(`/api/grades/${payload.classId}/${payload.date}/${payload.type}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  }

  static async delete(payload: { classId: string; date: number; type: AssessmentType }) {
    const response = await fetch(`/api/grades/${payload.classId}/${payload.date}/${payload.type}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }
}
