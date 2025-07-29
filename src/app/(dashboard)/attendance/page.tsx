import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import ClientPage from "./page.client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container relative">
      <div>{session?.user.email}</div>
      <Suspense fallback={<div suppressHydrationWarning={true}>Loading...</div>}>
        <ClientPage />
      </Suspense>
      <Link
        href={"/attendance/create"}
        className={buttonVariants({ size: "icon", className: "fixed md:bottom-4 bottom-16 right-4 z-50" })}
      >
        <Plus />
      </Link>
    </div>
  );
}
