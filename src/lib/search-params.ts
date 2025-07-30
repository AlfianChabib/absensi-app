import { AssessmentType } from "@prisma/client";
import { createSearchParamsCache, parseAsString, parseAsStringEnum, parseAsTimestamp } from "nuqs/server";

export const createAttendanceParsers = {
  date: parseAsTimestamp.withDefault(new Date()),
  classId: parseAsString.withDefault(""),
};

export const createGradeParsers = {
  date: parseAsTimestamp.withDefault(new Date()),
  classId: parseAsString.withDefault(""),
  type: parseAsStringEnum(Object.values(AssessmentType)).withDefault(AssessmentType.TUGAS),
};

export const createAttendanceCache = createSearchParamsCache(createAttendanceParsers);
export const createGradeCache = createSearchParamsCache(createGradeParsers);
