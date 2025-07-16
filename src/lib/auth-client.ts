import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
});

export type Session = typeof authClient.$Infer.Session;

export const { signUp, signIn, signOut, useSession, getSession } = authClient;
