"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { queryClient } from "@/lib/query-client";
import { StudentService } from "@/services/student.service";
import { CreateStudentSchema, StudentValidation } from "@/validation/student.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateStudentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { classId } = useParams<{ classId: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: StudentService.createStudent,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<CreateStudentSchema>({
    resolver: zodResolver(StudentValidation.create),
    defaultValues: {
      name: "",
      nis: "",
      gender: "MALE",
      classId,
    },
  });

  const handeSubmit = (payload: CreateStudentSchema) => {
    mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="fixed md:bottom-4 bottom-16 right-4 z-50">
        <Button variant="default" size={"icon"}>
          <Plus />
          <span className="sr-only">Create Class</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah murid</DialogTitle>
          <DialogDescription>Masukkan informasi murid baru</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handeSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama murid</FormLabel>
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
                  <FormLabel>NIS</FormLabel>
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
