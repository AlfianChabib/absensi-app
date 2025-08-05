import { AssessmentType } from "@prisma/client";
import { createSearchParamsCache, parseAsString, parseAsStringEnum, parseAsTimestamp } from "nuqs/server";
import { EXPORT_TIME_TYPES } from "@/types/export";

export const createAttendanceParsers = {
  date: parseAsTimestamp.withDefault(new Date()),
  classId: parseAsString.withDefault(""),
};

export const createGradeParsers = {
  date: parseAsTimestamp.withDefault(new Date()),
  classId: parseAsString.withDefault(""),
  type: parseAsStringEnum(Object.values(AssessmentType)).withDefault(AssessmentType.TUGAS),
};

export const exportAttendanceParsers = {
  classId: parseAsString.withDefault(""),
  type: parseAsStringEnum(Object.values(EXPORT_TIME_TYPES)).withDefault(EXPORT_TIME_TYPES.CURRENT),
  startDate: parseAsTimestamp,
  endDate: parseAsTimestamp,
  curDate: parseAsTimestamp.withDefault(new Date()),
};

export const createAttendanceCache = createSearchParamsCache(createAttendanceParsers);
export const createGradeCache = createSearchParamsCache(createGradeParsers);
export const exportAttendanceCache = createSearchParamsCache(exportAttendanceParsers);
