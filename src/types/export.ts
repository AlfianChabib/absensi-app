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
