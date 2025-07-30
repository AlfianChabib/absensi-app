import { SearchParams } from "nuqs/server";
import ClientPage from "./page.client";
import { createGradeCache } from "@/lib/search-params";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ClassService } from "@/services/class.service";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();
  await createGradeCache.parse(searchParams);

  await queryClient.prefetchQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientPage />
      </HydrationBoundary>
    </div>
  );
}
