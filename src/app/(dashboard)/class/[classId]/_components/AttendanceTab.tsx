"use client";

import { AttendanceService } from "@/services/attendance.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function AttendanceTab() {
  const { classId } = useParams<{ classId: string }>();

  const { data } = useSuspenseQuery({
    queryKey: ["attendances", classId],
    queryFn: () => AttendanceService.getAttendances({ classId }),
  });

  console.log(data);

  return <div>AttendanceTab</div>;
}
