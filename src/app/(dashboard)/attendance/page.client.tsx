"use client";

import { AttendanceService } from "@/services/attendance.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default function ClientPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["session-attendances"],
    queryFn: () => AttendanceService.getAll(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
      {data.map((item) => (
        <Link
          href={`/attendance/create?classId=${item.classId}&date=${item.date}`}
          key={item.date}
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
  );
}
