import { Attendance, Student } from "@prisma/client";

export const EXPORT_TIME_TYPES = {
  ALL: "all",
  WEEK: "week",
  MONTH: "month",
  RANGE: "range",
  CURRENT: "current",
} as const;

export type ExportTimeType = (typeof EXPORT_TIME_TYPES)[keyof typeof EXPORT_TIME_TYPES];

export const EXPORT_TYPES = {
  ATTENDANCES: "attendances",
  GRADES: "grades",
} as const;

export type ExportType = (typeof EXPORT_TYPES)[keyof typeof EXPORT_TYPES];

export type StudentWithAttendance = Student & { attendance: Attendance[] };

export type CalculatedAttendance = {
  studentId: string;
  name: string;
  gender: string;
  calc: {
    HADIR: number;
    ALFA: number;
    IZIN: number;
    SAKIT: number;
  };
};
