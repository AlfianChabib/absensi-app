import { ClassService } from "@/services/class.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CLientPage from "./page.client";

export default async function page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CLientPage />
      </HydrationBoundary>
    </div>
  );
}
