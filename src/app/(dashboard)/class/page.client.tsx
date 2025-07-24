"use client";

import { ClassService } from "@/services/class.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import ClassAction from "./_components/ClassAction";

export default function CLientPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2 mt-2">
      {data.map((item) => (
        <Link
          key={item.id}
          href={`/class/${item.id}`}
          className="border rounded-sm p-2 w-full bg-secondary/50 shadow-xs border-primary/20"
        >
          <div className="flex items-center justify-between">
            <h1 className="capitalize text-lg font-medium">{item.name}</h1>
            <ClassAction kelas={item} />
          </div>
          <div className="flex justify-between items-end text-muted-foreground">
            <p>{item.description}</p>
            <span className="text-sm">{item._count.students} Siswa</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
