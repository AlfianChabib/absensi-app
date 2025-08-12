"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { exportAttendanceParsers } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { DateRange, OnSelectHandler } from "react-day-picker";

export default function DateRangePicker() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [{ startDate, endDate }, setSearchParams] = useQueryStates(exportAttendanceParsers);

  const handleSelect: OnSelectHandler<undefined | DateRange> = (selected) => {
    if (selected) {
      if (selected.from === selected.to) {
        setSearchParams({ startDate: selected.from, endDate: selected.from });
      } else {
        setSearchParams({ startDate: selected.from, endDate: selected.to });
      }
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !startDate && "text-muted-foreground")}>
              {startDate ? (
                endDate ? (
                  startDate === endDate ? (
                    format(startDate, "LLL dd, y")
                  ) : (
                    <>
                      {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
                    </>
                  )
                ) : (
                  format(startDate, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </span>
            <CalendarIcon
              size={16}
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="center">
          <Calendar
            mode="range"
            timeZone={timeZone}
            locale={id}
            selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
