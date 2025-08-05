import z from "zod";

export class ExportValidation {
  static attendances = z.object({
    classId: z.string(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });
}

export type ExportAttendances = z.infer<typeof ExportValidation.attendances>;
