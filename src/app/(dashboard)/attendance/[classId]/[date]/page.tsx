import { AttendanceService } from "@/services/attendance.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fromUnixTime } from "date-fns";
import ClientPage from "./page.client";

export default async function page({ params }: { params: Promise<{ classId: string; date: string }> }) {
  const { classId, date } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["attendances", classId, date],
    queryFn: () => AttendanceService.getByClassIdAndDate({ classId, date: fromUnixTime(parseInt(date)) }),
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientPage />
      </HydrationBoundary>
    </div>
  );
}
