import { EXPORT_TIME_TYPES } from "@/types/export";
import z from "zod";

export class ExportValidation {
  static attendances = z
    .object({
      classId: z.string(),
      curDate: z.date(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      type: z.enum(EXPORT_TIME_TYPES),
    })
    .check((ctx) => {
      if (ctx.value.type !== EXPORT_TIME_TYPES.CURRENT) {
        if (!ctx.value.startDate) {
          ctx.issues.push({
            code: "custom",
            message: "startDate is required",
            path: ["startDate"],
            input: ctx.value,
          });
        }
        if (!ctx.value.endDate) {
          ctx.issues.push({
            code: "custom",
            message: "endDate is required",
            path: ["endDate"],
            input: ctx.value,
          });
        }
      }
      if (ctx.value.startDate && ctx.value.endDate && ctx.value.startDate > ctx.value.endDate) {
        ctx.issues.push({
          code: "custom",
          message: "Tanggal mulai tidak boleh melebihi tanggal akhir.",
          input: ctx.value,
          path: ["endDate"],
        });
      }
    });
}

export type ExportAttendances = z.infer<typeof ExportValidation.attendances>;
