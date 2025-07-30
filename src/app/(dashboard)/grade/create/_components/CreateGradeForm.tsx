"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/query-client";
import { createGradeParsers } from "@/lib/search-params";
import { GradeService } from "@/services/grade.service";
import { CreateGradeSchema, GradeValidation } from "@/validation/grade.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateGradeForm() {
  const [{ classId, date, type }] = useQueryStates(createGradeParsers);

  const { mutate, isPending } = useMutation({
    mutationFn: GradeService.createGrade,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students-grade"] });
      toast.success(data.message);
    },
  });

  const { data } = useQuery({
    queryKey: ["students-grade", classId, date, type],
    queryFn: () => GradeService.getStudentsGrade({ classId, type, date: date }),
    enabled: !!classId,
  });

  const form = useForm<CreateGradeSchema>({
    resolver: zodResolver(GradeValidation.create),
    defaultValues: {
      classId,
      date: new Date(date).toISOString(),
      data: [],
    },
  });

  useEffect(() => {
    if (data && data.students.length > 0) {
      form.setValue(
        "data",
        data.students.map((student) => ({ studentId: student.id, name: student.name, grade: 0 }))
      );
    }
  }, [form, data]);

  useEffect(() => {
    if (classId) {
      form.setValue("classId", classId);
    }
    if (date) {
      form.setValue("date", new Date(date).toISOString());
    }
    if (type) {
      form.setValue("type", type);
    }
  }, [form, classId, date, type]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "data",
    keyName: "id",
  });

  const handleSubmit = (payload: CreateGradeSchema) => {
    console.log(payload);
    mutate(payload);
  };

  if (data && data.existGrade > 0 && data.students.length > 0) {
    return (
      <div className="flex flex-col mt-2 p-2 justify-center items-center border border-dashed rounded-md h-20 border-primary">
        <p>Absen pada tangal {format(new Date(date), "PPP", { locale: id })} sudah dibuat.</p>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex flex-col mt-2 p-2 justify-center items-center border border-dashed rounded-md h-20 border-primary">
        <p>Silahkan pilih kelas terlebih dahulu</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col w-full mt-2 gap-2 mb-14 md:mb-2 relative"
      >
        <div className="flex justify-between items-center border rounded-md sticky top-18 shadow-xs bg-background z-50 p-2">
          {/* <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormLabel>Tipe Penilaian</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe penilaian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(AssessmentType).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <p className="text-sm text-muted-foreground leading-4">{data?.students.length} Siswa</p>
        </div>
        {fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`data.${index}.grade`}
            render={({ field: itemField }) => (
              <FormItem className="flex items-center justify-between w-full border p-1 rounded-md">
                <FormLabel className="whitespace-pre-wrap md:text-base">{field.name}</FormLabel>
                <FormControl>
                  <Input {...itemField} type="number" className="w-20" inputMode="numeric" min={0} max={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isPending} className="sticky bottom-14 md:bottom-4 w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
