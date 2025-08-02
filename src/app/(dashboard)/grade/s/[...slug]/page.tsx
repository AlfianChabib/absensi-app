import { notFound } from "next/navigation";
import ClientPage from "./page.client";
import { parseGradeSlug } from "@/helpers/slug";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GradeService } from "@/services/grade.service";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function page({ params }: Props) {
  const { slug } = await params;
  const parsedSlug = parseGradeSlug(slug);

  if (!parsedSlug) return notFound();

  const { classId, date, type } = parsedSlug;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["grade", classId, date, type],
    queryFn: () => GradeService.getByClassIdDateType({ classId, date, type }),
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ClientPage params={parsedSlug} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
