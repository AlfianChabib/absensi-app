import { Suspense } from "react";
import ClientPage from "./page.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GradeService } from "@/services/grade.service";

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["grades"],
    queryFn: () => GradeService.getAll({}),
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
