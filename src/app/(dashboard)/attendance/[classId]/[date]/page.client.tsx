"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { queryClient } from "@/lib/query-client";
import { AttendanceService } from "@/services/attendance.service";
import { ATTENDANCE_STATUS } from "@/utils/constants";
import { AttendanceValidation, UpdateAttendanceSchema } from "@/validation/attendance.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ClientPage() {
  const { classId, date } = useParams<{ classId: string; date: string }>();
  const [edit, setedit] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: AttendanceService.updateAttendance,
    onSuccess: (data) => {
      setedit(false);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["attendances", classId, date] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: ["attendances", classId, date],
    queryFn: () => AttendanceService.getByClassIdAndDate({ classId, date: fromUnixTime(parseInt(date)) }),
  });

  const form = useForm<UpdateAttendanceSchema>({
    resolver: zodResolver(AttendanceValidation.update),
    defaultValues: {
      classId,
      date: fromUnixTime(parseInt(date)),
      data: data.map((item) => ({ attendanceId: item.id, name: item.student.name, status: item.status })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "data",
    keyName: "id",
  });

  const handeSubmit = (payload: UpdateAttendanceSchema) => {
    mutate(payload);
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between border p-2">
        <h1 className="capitalize">{data[0].class.name}</h1>
        <p>{format(new Date(fromUnixTime(parseInt(date))), "PPP", { locale: id })}</p>
      </div>
      <div className="flex justify-between items-center border rounded-md p-1 mt-2 sticky top-18 shadow-xs bg-background z-50">
        <p className="text-sm text-muted-foreground leading-4">{data?.length} Siswa</p>
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
      <Form {...form}>
        <form
          className="flex flex-col w-full mt-2 gap-2 mb-14 md:mb-2 relative"
          onSubmit={form.handleSubmit(handeSubmit)}
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
                            <RadioGroupItem
                              value={item.value}
                              className="after:absolute after:inset-0"
                              disabled={!edit}
                            />
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
