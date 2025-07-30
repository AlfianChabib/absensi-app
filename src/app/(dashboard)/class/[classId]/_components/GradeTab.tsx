"use client";

import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function GradeTab() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">grade</div>
      <Link
        href={"/grade/create"}
        className={buttonVariants({ size: "icon", className: "fixed md:bottom-4 bottom-16 right-4 z-50" })}
      >
        <Plus />
      </Link>
    </div>
  );
}
