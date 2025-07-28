import { createAttendanceCache } from "@/lib/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ClientPage from "./page.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ClassService } from "@/services/class.service";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();
  await createAttendanceCache.parse(searchParams);

  await queryClient.prefetchQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="container relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ClientPage />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
