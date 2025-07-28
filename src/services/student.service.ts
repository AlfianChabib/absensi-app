import { UpdateStudentSchema } from "@/validation/student.validation";
import { Student } from "@prisma/client";

export class StudentService {
  static async getByClassId({ classId }: { classId: string }) {
    const response = await fetch(`/api/class/${classId}/students`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as Student[];
  }

  static async deleteStudent({ studentId }: { studentId: string }) {
    const response = await fetch(`/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }

  static async createStudent({ student }: { student: Student }) {
    const response = await fetch(`/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const data = await response.json();
    return data;
  }

  static async updateStudent(payload: UpdateStudentSchema) {
    const response = await fetch(`/api/students/${payload.studentId}`, {
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
