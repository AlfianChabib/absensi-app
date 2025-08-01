import { AssessmentType } from "@prisma/client";

type ValidGradeSlug = {
  classId: string;
  date: number;
  type: AssessmentType;
};

function isValidGradeSlug(slug: string[]): slug is [string, string, AssessmentType] {
  return slug.length === 3;
}

export function parseGradeSlug(slug: string[]): ValidGradeSlug | null {
  if (!isValidGradeSlug(slug)) {
    return null;
  }

  if (slug.length !== 3) return null;

  const [classId, date, type] = slug;

  const timestamp = parseInt(date);
  if (isNaN(timestamp)) return null;

  if (!classId || !date || !type) return null;

  if (AssessmentType[type] === undefined) return null;

  return { classId, date: timestamp, type };
}
