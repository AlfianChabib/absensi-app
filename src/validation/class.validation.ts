import z from "zod";

export class ClassValidation {
  static create = z.object({
    name: z.string().min(2, {
      message: "Class name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Class description must be at least 2 characters.",
    }),
  });
}
