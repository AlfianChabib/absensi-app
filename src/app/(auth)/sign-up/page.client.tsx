"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { AuthValidation, Register } from "@/validation/auth.validation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ClientPage({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const form = useForm<Register>({
    resolver: zodResolver(AuthValidation.register),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  function onSubmit(values: Register) {
    startTransition(() => {
      authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.username,
        },
        {
          onSuccess() {
            router.push("/sign-in");
            toast.success("Sign up your email successfully, sign in now.");
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
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Register with your Email and Password</CardDescription>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
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
          Have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
