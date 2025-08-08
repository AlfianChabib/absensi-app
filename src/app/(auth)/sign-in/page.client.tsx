"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthValidation, Login } from "@/validation/auth.validation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";

export default function ClientPage({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(AuthValidation.login),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: Login) {
    startTransition(() => {
      authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess() {
            router.push("/");
            toast.success("Sign in successfully, welcome back.");
          },
          onError(error) {
            toast.error(error.error.message);
          },
        }
      );
    });
  }

  return (
    <div className={cn("flex flex-col gap-6 max-w-lg w-full", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>Sign-In with your Email and Password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormDescription>This is your email address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
