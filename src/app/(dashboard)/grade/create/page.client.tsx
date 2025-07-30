"use client";

import { ClassService } from "@/services/class.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQueryStates } from "nuqs";
import { createGradeParsers } from "@/lib/search-params";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import CreateGradeForm from "./_components/CreateGradeForm";
import { AssessmentType } from "@prisma/client";

export default function ClientPage() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [{ classId, date, type }, setSearchParams] = useQueryStates(createGradeParsers);
  const [isOpen, setIsOpen] = useState(false);

  const { data: classes } = useSuspenseQuery({
    queryKey: ["classes"],
    queryFn: () => ClassService.getClasses(),
  });

  return (
    <div className="py-2 sticky top-16">
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
        <Select onValueChange={(value) => setSearchParams({ classId: value })} defaultValue={classId}>
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classData) => (
              <SelectItem key={classData.id} value={classData.id} className="capitalize">
                {classData.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSearchParams({ type: value as AssessmentType })} defaultValue={type}>
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AssessmentType).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            >
              <span className={cn("truncate", !date && "text-muted-foreground")}>
                {date ? format(date, "PPP", { locale: id }) : "Pick a date"}
              </span>
              <CalendarIcon
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="single"
              selected={date}
              locale={id}
              timeZone={timeZone}
              onSelect={(newDate) => {
                if (newDate) setSearchParams({ date: newDate });
                setIsOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <CreateGradeForm />
    </div>
  );
}
