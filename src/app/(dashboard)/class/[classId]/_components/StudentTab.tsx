import { studentColumn } from "@/components/tables/columns/studentColumn";
import { StudentsTable } from "@/components/tables/StudentsTable";
import { StudentService } from "@/services/student.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function StudentTab() {
  const { classId } = useParams<{ classId: string }>();

  const { data } = useSuspenseQuery({
    queryKey: ["students", classId],
    queryFn: () => StudentService.getByClassId({ classId }),
  });

  return (
    <div className="flex w-full">
      <StudentsTable columns={studentColumn} data={data} />
    </div>
  );
}
