import { Suspense } from "react";
import ClientPage from "./page.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { exportAttendanceCache } from "@/lib/search-params";
import { ExportService } from "@/services/export.service";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  await exportAttendanceCache.parse(searchParams);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["export-classes"],
    queryFn: () => ExportService.getClasses(),
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ClientPage />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
