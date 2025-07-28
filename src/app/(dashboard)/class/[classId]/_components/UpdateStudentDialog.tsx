"use client";

import { StudentValidation, UpdateStudentSchema } from "@/validation/student.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Student } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { StudentService } from "@/services/student.service";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";

type UpdateStudentDialogProps = {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpdateStudentDialog({ student, open, onOpenChange }: UpdateStudentDialogProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: StudentService.updateStudent,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const form = useForm<UpdateStudentSchema>({
    resolver: zodResolver(StudentValidation.update),
    defaultValues: {
      studentId: student.id,
      name: student.name,
      nis: student.nis,
      gender: student.gender,
    },
  });

  const handeSubmit = (payload: UpdateStudentSchema) => {
    mutate(payload);
    console.log(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update murid</DialogTitle>
          <DialogDescription>Update informasi murid.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handeSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama kelas</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi kelas</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-2"
                    >
                      {Object.values(Gender).map((gender) => (
                        <FormItem
                          key={gender}
                          className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={gender} className="after:absolute after:inset-0" />
                            <FormLabel>{gender === "MALE" ? "Laki-laki" : "Perempuan"}</FormLabel>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
