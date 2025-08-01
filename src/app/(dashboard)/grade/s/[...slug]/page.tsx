import { notFound } from "next/navigation";
import ClientPage from "./page.client";
import { parseGradeSlug } from "@/helpers/slug";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function page({ params }: Props) {
  const { slug } = await params;
  const parsedSlug = parseGradeSlug(slug);

  if (!parsedSlug) return notFound();

  const { classId, date, type } = parsedSlug;

  return (
    <div className="container">
      <p>
        {classId}
        {date}
        {type}
      </p>
      <ClientPage params={parsedSlug} />
    </div>
  );
}
