"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function ClientPage() {
  return (
    <div>
      <p>Login Google</p>
      <Button
        onClick={async () =>
          await authClient.signIn
            .social({
              provider: "google",
              callbackURL: "/",
            })
            .catch((error) => {
              console.error(error);
            })
        }
      >
        Sign In
      </Button>
    </div>
  );
}
