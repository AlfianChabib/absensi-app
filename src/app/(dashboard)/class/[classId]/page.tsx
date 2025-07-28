import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ClientPage from "./page.client";
import { StudentService } from "@/services/student.service";
import { AttendanceService } from "@/services/attendance.service";

export default async function page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["students", classId],
    queryFn: () => StudentService.getByClassId({ classId }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["attendances", classId],
    queryFn: () => AttendanceService.getAttendances({ classId }),
  });

  return (
    <div className="container relative my-2 pb-14 md:pb-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientPage />
      </HydrationBoundary>
    </div>
  );
}
