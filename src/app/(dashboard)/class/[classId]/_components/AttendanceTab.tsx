"use client";

import { buttonVariants } from "@/components/ui/button";
import { AttendanceService } from "@/services/attendance.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, getUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AttendanceTab() {
  const { classId } = useParams<{ classId: string }>();

  const { data } = useSuspenseQuery({
    queryKey: ["attendances", classId],
    queryFn: () => AttendanceService.getAttendances({ classId }),
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item) => (
          <Link
            key={item.date}
            href={`/attendance/${classId}/${getUnixTime(item.date)}`}
            className="border rounded-sm p-2 w-full bg-secondary/50 shadow-xs border-primary/20 space-y-1"
          >
            <div className="flex items-center justify-between">
              <h1 className="capitalize font-medium">{item.className}</h1>
              <p>{format(new Date(item.date), "PPP", { locale: id })}</p>
            </div>
            <div className="flex text-sm gap-2 text-muted-foreground">
              <p>Hadir: {item.calc.hadir}</p>
              <p>Sakit: {item.calc.sakit}</p>
              <p>Izin: {item.calc.izin}</p>
              <p>Alfa: {item.calc.alfa}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href={"/attendance/create"}
        className={buttonVariants({ size: "icon", className: "fixed md:bottom-4 bottom-16 right-4 z-50" })}
      >
        <Plus />
      </Link>
    </div>
  );
}
