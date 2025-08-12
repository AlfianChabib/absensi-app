import { ClassService } from "@/services/class.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CLientPage from "./page.client";
import CreateClassDialog from "./_components/CreateClassDialog";

export const dynamic = "force-dynamic";

export default async function page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="container relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CLientPage />
      </HydrationBoundary>
      <CreateClassDialog />
    </div>
  );
}
