import { createSearchParamsCache, parseAsString, parseAsTimestamp } from "nuqs/server";

export const createAttendanceParsers = {
  date: parseAsTimestamp.withDefault(new Date()),
  classId: parseAsString.withDefault(""),
};

export const createAttendanceCache = createSearchParamsCache(createAttendanceParsers);
