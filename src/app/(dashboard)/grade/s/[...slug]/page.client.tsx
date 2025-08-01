"use client";

import { AssessmentType } from "@prisma/client";

type Slug = {
  classId: string;
  date: number;
  type: AssessmentType;
};

export default function ClientPage({ params }: { params: Slug }) {
  const { classId, date, type } = params;

  return (
    <div>
      {classId}
      {date}
      {type}
    </div>
  );
}
