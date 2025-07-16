"use client";

import { Session, useSession } from "@/lib/auth-client";
import { createContext, useContext, useMemo } from "react";

const SessionContext = createContext<Session | null>(null);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();

  const session = useMemo(() => {
    if (data) return data;
    return null;
  }, [data]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return session;
}
