"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradeService } from "@/services/grade.service";
import { GradeValidation, UpdateGradeSchema } from "@/validation/grade.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssessmentType } from "@prisma/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AssessmentType as AssessmentTypeMap } from "@/utils/constants";
import { useState } from "react";
import { queryClient } from "@/lib/query-client";

type Slug = {
  classId: string;
  date: number;
  type: AssessmentType;
};

export default function ClientPage({ params }: { params: Slug }) {
  const { classId, date, type } = params;
  const [edit, setedit] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: GradeService.updateGrade,
    onSuccess: (data) => {
      queryClient.cancelQueries({ queryKey: ["grades"] });
      queryClient.cancelQueries({ queryKey: ["grade", classId, date, type] });
      toast.success(data.message);
      setedit(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: ["grade", classId, date, type],
    queryFn: () => GradeService.getByClassIdDateType({ classId, date, type }),
  });

  const form = useForm<UpdateGradeSchema>({
    resolver: zodResolver(GradeValidation.update),
    defaultValues: {
      classId,
      date: fromUnixTime(date),
      type,
      data: data.grades.map((item) => ({
        gradeId: item.id,
        name: item.student.name,
        grade: item.score,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "data",
    keyName: "id",
  });

  const handleSubmit = (payload: UpdateGradeSchema) => {
    mutate(payload);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col w-full mt-2 gap-2 mb-14 md:mb-2 relative"
        >
          <div className="flex flex-col w-full gap-2 items-center border rounded-md sticky top-18 shadow-xs bg-background z-50 p-2">
            <div className="flex w-full items-center justify-between">
              <h1 className="capitalize">{data.class.name}</h1>
              <p className="text-sm text-muted-foreground leading-4">
                {format(fromUnixTime(date), "PPPP", { locale: id })}
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <p>{AssessmentTypeMap[type]}</p>
              <p className="text-sm text-muted-foreground leading-4">{data.grades.length} Siswa</p>
            </div>
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
                    <Input
                      {...itemField}
                      type="number"
                      className="w-20"
                      inputMode="numeric"
                      disabled={!edit}
                      min={0}
                      max={100}
                      onKeyDown={(e) => {
                        const blockedKeys = ["+", "-", "e", "E", ".", ","];
                        if (blockedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        const numValue = parseInt(value);
                        if (numValue > 100) {
                          value = "100";
                        } else if (numValue < 0) {
                          value = "0";
                        }
                        itemField.onChange(value);
                      }}
                      onFocus={() => {
                        if (itemField.value === 0) {
                          itemField.onChange("");
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          itemField.onChange(0);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {edit ? (
            <div className="sticky flex bottom-14 md:bottom-4 w-full gap-2">
              <Button variant={"outline"} onClick={() => setedit(false)} disabled={!edit} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                Save
              </Button>
            </div>
          ) : (
            <Button onClick={() => setedit(true)} className="sticky bottom-14 md:bottom-4 w-full">
              Edit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
