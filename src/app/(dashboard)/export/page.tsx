import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import ClientPage from "./page.client";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container">
      <div>{session?.user.email}</div>
      <Suspense fallback={<div suppressHydrationWarning={true}>Loading...</div>}>
        <ClientPage />
      </Suspense>
    </div>
  );
}
