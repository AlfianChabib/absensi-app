import { Class } from "@prisma/client";

export class ClassService {
  static async getClasses() {
    const response = await fetch("/api/class", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data as (Class & { _count: { students: number } })[];
  }

  static async getClass({ classId }: { classId: string }) {
    const response = await fetch(`/api/class/${classId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }

  static async deleteClass({ classId }: { classId: string }) {
    const response = await fetch(`/api/class/${classId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }
}
