"use client";

import { buttonVariants } from "@/components/ui/button";
import { GradeService } from "@/services/grade.service";
import { AssessmentType } from "@/utils/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, getUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GradeTab() {
  const { classId } = useParams<{ classId: string }>();

  const { data } = useSuspenseQuery({
    queryKey: ["grades", classId],
    queryFn: () => GradeService.getAll({ classId }),
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, index) => (
          <Link
            href={`/grade/s/${item.classId}/${getUnixTime(item.date)}/${item.assessmentType}`}
            key={index}
            className="border rounded-sm p-2 w-full bg-secondary/50 shadow-xs border-primary/20 space-y-1"
          >
            <div className="flex items-center justify-between">
              <h1 className="capitalize font-medium">
                {item.className} - <span>{AssessmentType[item.assessmentType]}</span>
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <p>{format(new Date(item.date), "PPP", { locale: id })}</p>
              <div className="flex text-sm gap-2 text-muted-foreground">
                <p>A: {item.stats.a}</p>
                <p>B: {item.stats.b}</p>
                <p>C: {item.stats.c}</p>
                <p>D: {item.stats.d}</p>
                <p>E: {item.stats.e}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href={"/grade/create"}
        className={buttonVariants({ size: "icon", className: "fixed md:bottom-4 bottom-16 right-4 z-50" })}
      >
        <Plus />
      </Link>
    </div>
  );
}
