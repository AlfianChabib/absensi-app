import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function getSession(): Promise<Session> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("No session found");
  }

  return session;
}
