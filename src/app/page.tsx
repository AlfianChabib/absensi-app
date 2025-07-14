import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div>
        <p>Not authenticated</p>
        <Link href="/sign-in">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
    </div>
  );
}
