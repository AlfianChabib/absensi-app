import ClientPage from "./page.client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { AttendanceService } from "@/services/attendance.service";
import { Suspense } from "react";

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["session-attendances"],
    queryFn: () => AttendanceService.getAll(),
  });

  return (
    <div className="container relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ClientPage />
        </Suspense>
      </HydrationBoundary>
      <Link
        href={"/attendance/create"}
        className={buttonVariants({ size: "icon", className: "fixed md:bottom-4 bottom-16 right-4 z-50" })}
      >
        <Plus />
      </Link>
    </div>
  );
}
