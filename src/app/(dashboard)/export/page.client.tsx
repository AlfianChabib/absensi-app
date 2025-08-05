"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { exportAttendanceParsers } from "@/lib/search-params";
import CustomDatePicker from "./_components/CustomDatePicker";
import { ExportService } from "@/services/export.service";
import { useState } from "react";
import { EXPORT_TYPES, ExportType } from "@/types/export";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FolderUp } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export default function ClientPage() {
  const now = new Date();
  const [{ classId, type }, setSearchParams] = useQueryStates(exportAttendanceParsers);
  const [limit, setLimit] = useState<{ from: Date; to: Date }>({ from: now, to: now });
  const [date, setDate] = useState<DateRange>(limit);

  const { mutate, isPending } = useMutation({
    mutationKey: ["export-attendances", classId, type, date],
    mutationFn: () =>
      ExportService.exportAttendances(classId, type as ExportType, date?.from as Date, date?.to as Date),
    onSuccess: (data) => {
      toast.success("Berhasil mengekspor data");
      console.log(data);
    },
  });

  const { data: classes } = useSuspenseQuery({
    queryKey: ["export-classes"],
    queryFn: () => ExportService.getClasses(),
  });

  const updateLimit = (classItem: (typeof classes)[0] | undefined, type: ExportType) => {
    if (!classItem) return;
    if (type === "attendances") {
      const firstDate = classItem.firstAttendance.date as Date;
      const lastDate = classItem.lastAttendance.date as Date;
      setLimit({ from: firstDate, to: lastDate });
      setDate({ from: firstDate, to: lastDate });
    } else if (type === "grades") {
      const firstDate = classItem.firstGrade.date as Date;
      const lastDate = classItem.lastGrade.date as Date;
      setLimit({ from: firstDate, to: lastDate });
      setDate({ from: firstDate, to: lastDate });
    }
  };

  return (
    <div className="py-2 space-y-2">
      <div className="grid grid-cols-1 md:gap-4 gap-2 md:grid-cols-2">
        <Select
          onValueChange={(value) => {
            setSearchParams({ classId: value });
            updateLimit(
              classes.find((cls) => cls.id === value),
              type
            );
          }}
          defaultValue={classId}
        >
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Pilih kelas" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id} className="capitalize">
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CustomDatePicker disabled={!classId} limit={limit} date={date} setDate={setDate} />
        <RadioGroup
          className="grid md:grid-cols-5 grid-cols-3 gap-2"
          defaultValue={type}
          onValueChange={(value: ExportType) => {
            setSearchParams({ type: value as ExportType });
            updateLimit(
              classes.find((cls) => cls.id === classId),
              value
            );
          }}
        >
          {Object.values(EXPORT_TYPES).map((item) => (
            <Label
              key={item}
              className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:text-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
            >
              <RadioGroupItem id={item} value={item} className="sr-only after:absolute after:inset-0" />
              <p className="text-sm leading-none font-medium">{item === "attendances" ? "Absen" : "Nilai"}</p>
            </Label>
          ))}
        </RadioGroup>
      </div>
      <Button className="w-full" onClick={() => mutate()} disabled={!classId || !type || !date || isPending}>
        <FolderUp />
        <span>Export</span>
      </Button>
    </div>
  );
}
