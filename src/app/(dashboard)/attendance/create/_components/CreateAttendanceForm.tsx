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
      queryClient.invalidateQueries({ queryKey: ["session-attendances"] });
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
      date,
      data: [],
    },
  });

  useEffect(() => {
    if (data && data.students.length > 0) {
      form.setValue(
        "data",
        data.students.map((student) => ({ studentId: student.id, name: student.name, status: "HADIR" }))
      );
    }
  }, [form, data]);

  useEffect(() => {
    if (classId) {
      form.setValue("classId", classId);
    }
    if (date) {
      form.setValue("date", date);
    }
  }, [form, classId, date]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "data",
    keyName: "id",
  });

  const handleSubit = (payload: CreateAttendanceSchema) => {
    mutate(payload);
    console.log(payload);
  };

  if (data && data.existAttendance > 0 && data.students.length > 0) {
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
      <div className="flex justify-between items-center border rounded-md p-1 my-2 sticky top-18 shadow-xs bg-background z-50">
        <p className="text-sm text-muted-foreground leading-4">{data?.students.length} Siswa</p>
        <div className="space-x-2 flex text-primary">
          {ATTENDANCE_STATUS.map((item) => (
            <p
              key={item.value}
              className="capitalize border border-primary rounded-sm size-[30px] text-center place-content-center leading-4"
            >
              {item.label.at(0)}
            </p>
          ))}
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubit)}
        className="flex flex-col w-full mt-2 gap-2 mb-14 md:mb-2 relative"
      >
        {fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`data.${index}.status`}
            render={({ field: itemField }) => (
              <FormItem className="flex items-center justify-between w-full border p-1 rounded-md">
                <FormLabel className="whitespace-pre-wrap md:text-base">{field.name}</FormLabel>
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
        <Button type="submit" disabled={isPending} className="sticky bottom-14 md:bottom-4 w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
