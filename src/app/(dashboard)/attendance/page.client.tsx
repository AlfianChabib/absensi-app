"use client";

import { useSession } from "@/lib/auth-client";

export default function ClientPage() {
  const { data: session } = useSession();

  return (
    <div suppressHydrationWarning={true}>
      <p>{session?.user.name}</p>
    </div>
  );
}
