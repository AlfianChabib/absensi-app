"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentTab from "./_components/StudentTab";
import AttendanceTab from "./_components/AttendanceTab";
import { Suspense } from "react";
import GradeTab from "./_components/GradeTab";

export default function ClientPage() {
  return (
    <div className="flex w-full flex-col gap-6 py-2">
      <Tabs defaultValue="students">
        <TabsList className="bg-accent rounded-sm md:w-fit w-full shadow-xs">
          <TabsTrigger value="students">Murid</TabsTrigger>
          <TabsTrigger value="attendances">Absen</TabsTrigger>
          <TabsTrigger value="grades">Nilai</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Suspense>
            <StudentTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="attendances">
          <Suspense>
            <AttendanceTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="grades">
          <Suspense>
            <GradeTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
