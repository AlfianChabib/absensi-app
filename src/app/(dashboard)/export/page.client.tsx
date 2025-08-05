"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { exportAttendanceParsers } from "@/lib/search-params";
import { ExportTimeType } from "@/types/export";
import CustomDatePicker from "./_components/CustomDatePicker";
import { ExportService } from "@/services/export.service";

export default function ClientPage() {
  const [{ classId, curDate }, setSearchParams] = useQueryStates(exportAttendanceParsers);

  const { data: classes } = useSuspenseQuery({
    queryKey: ["export-classes"],
    queryFn: () => ExportService.getClasses(),
  });

  console.log(classes);

  const items = [
    { value: "all", label: "Semua" },
    { value: "week", label: "Minggu ini" },
    { value: "month", label: "Bulan ini" },
    { value: "range", label: "Kustom" },
  ] as { value: ExportTimeType; label: string }[];

  if (curDate) items.push({ value: "current", label: "Sekarang" });

  return (
    <div className="py-2">
      <div className="grid grid-cols-1 md:gap-4 gap-2 md:grid-cols-2">
        <Select onValueChange={(value) => setSearchParams({ classId: value })} defaultValue={classId}>
          <SelectTrigger className="w-full">
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
        <CustomDatePicker
          disabled={!classId}
          limit={{
            from: classes.find((cls) => cls.id === classId)?.firstAttendance?.date as Date,
            to: classes.find((cls) => cls.id === classId)?.lastAttendance?.date as Date,
          }}
        />
        {/* <RadioGroup
          className="grid md:grid-cols-5 grid-cols-3 gap-2"
          defaultValue={type}
          onValueChange={(value: ExportTimeType) => {
            if (value === "current") {
              setSearchParams({ type: value as ExportTimeType, startDate: curDate, endDate: curDate });
            } else {
              setSearchParams({ type: value as ExportTimeType });
            }
          }}
        >
          {items.map((item) => (
            <Label
              key={`${id}-${item.value}`}
              className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:text-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
            >
              <RadioGroupItem
                id={`${id}-${item.value}`}
                value={item.value}
                className="sr-only after:absolute after:inset-0"
              />
              <p className="text-sm leading-none font-medium">{item.label}</p>
            </Label>
          ))}
        </RadioGroup> */}
        {/* <DateRangePicker /> */}
      </div>
    </div>
  );
}
