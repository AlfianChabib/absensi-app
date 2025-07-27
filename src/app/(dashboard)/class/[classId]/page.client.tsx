"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentTab from "./_components/StudentTab";

export default function ClientPage() {
  return (
    <div className="flex w-full flex-col gap-6 ">
      <Tabs defaultValue="students">
        <TabsList className="bg-accent rounded-sm w-full shadow-xs">
          <TabsTrigger value="students">Murid</TabsTrigger>
          <TabsTrigger value="attendances">Absen</TabsTrigger>
          <TabsTrigger value="grades">Nilai</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <StudentTab />
        </TabsContent>
        <TabsContent value="attendances"></TabsContent>
        <TabsContent value="grades"></TabsContent>
      </Tabs>
    </div>
  );
}
