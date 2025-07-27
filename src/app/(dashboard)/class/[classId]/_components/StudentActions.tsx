"use client";

import { Student } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import DeleteStudentAlert from "./DeleteStudentAlert";

type StudentActionProps = {
  student: Student;
};

export default function StudentAction({ student }: StudentActionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleOpenAlert = () => {
    setDropdownOpen(false);
    setTimeout(() => setAlertOpen(true), 10);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu modal={false} open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleOpenAlert()}>Hapus Murid</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteStudentAlert studentId={student.id} open={alertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}
