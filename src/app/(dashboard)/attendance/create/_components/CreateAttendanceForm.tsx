"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { queryClient } from "@/lib/query-client";
import { createAttendanceParsers } from "@/lib/search-params";
import { AttendanceService } from "@/services/attendance.service";
import { ATTENDANCE_STATUS } from "@/utils/constants";
import { AttendanceValidation, CreateAttendanceSchema } from "@/validation/attendance.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { format } from "date-fns";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { id } from "date-fns/locale";

export default function CreateAttendanceForm() {
  const [{ classId, date }] = useQueryStates(createAttendanceParsers);

  const { mutate, isPending } = useMutation({
    mutationFn: AttendanceService.createAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      queryClient.invalidateQueries({ queryKey: ["students-attendance"] });
      toast.success(data.message);
    },
  });

  const { data } = useQuery({
    queryKey: ["students-attendance", classId, date],
    queryFn: () => AttendanceService.getStudentsAttendance({ classId, date: date }),
    enabled: !!classId,
  });

  const form = useForm<CreateAttendanceSchema>({
    resolver: zodResolver(AttendanceValidation.create),
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
        data.students.map((student) => ({ studentId: student.id, name: student.name, status: "HADIR" }))
      );
    } else {
      form.setValue("data", []);
    }
  }, [form, data]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "data",
    keyName: "id",
  });

  const handleSubit = (payload: CreateAttendanceSchema) => {
    mutate(payload);
    console.log(payload);
  };

  if (data && data.existAttendance > 0) {
    return (
      <div className="flex flex-col mt-2 p-2 justify-center items-center border border-dashed rounded-md h-20 border-primary">
        <p>Absen pada tangal {format(new Date(date), "PPP", { locale: id })} sudah dibuat.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubit)} className="flex flex-col w-full mt-2 gap-2 mb-14 relative">
        {fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`data.${index}.status`}
            render={({ field: itemField }) => (
              <FormItem className="flex items-center justify-between w-full">
                <FormLabel className="pl-2 whitespace-pre-wrap">{field.name}</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex flex-wrap gap-2"
                    defaultValue={itemField.value}
                    onValueChange={itemField.onChange}
                  >
                    {ATTENDANCE_STATUS.map((item) => (
                      <div
                        key={`${item.value}`}
                        className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-1.5 shadow-xs outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value={item.value} className="after:absolute after:inset-0" />
                          <FormLabel className="md:block hidden">{item.label}</FormLabel>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isPending} className="sticky bottom-14 w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
