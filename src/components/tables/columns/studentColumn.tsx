import StudentAction from "@/app/(dashboard)/class/[classId]/_components/StudentActions";
import { Student } from "@prisma/client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const colummHelper = createColumnHelper<Student>();

export const studentColumn = [
  colummHelper.accessor("nis", {
    header: "NIS",
    cell: (info) => info.getValue(),
    size: 100,
  }),
  colummHelper.accessor("name", {
    header: "Nama",
    cell: (info) => <span className="whitespace-pre-wrap">{info.getValue()}</span>,
    size: 400,
  }),
  colummHelper.accessor("gender", {
    header: "L/P",
    cell: (info) => <p>{info.getValue() === "MALE" ? "L" : "P"}</p>,
    size: 100,
  }),
  colummHelper.display({
    id: "actions",
    cell: ({ row }) => <StudentAction student={row.original} />,
    size: 50,
  }),
] as ColumnDef<Student>[];
