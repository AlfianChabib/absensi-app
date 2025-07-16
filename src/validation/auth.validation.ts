import z from "zod";

export class AuthValidation {
  static register = z.object({
    email: z.email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  static login = z.object({
    email: z.email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });
}

export type Register = z.infer<typeof AuthValidation.register>;
export type Login = z.infer<typeof AuthValidation.login>;
