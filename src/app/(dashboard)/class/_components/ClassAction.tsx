"use client";

import { Class } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import DeleteClassAlert from "./DeleteClassAlert";

type ClassActionProps = {
  kelas: Class & { _count: { students: number } };
};

export default function ClassAction({ kelas }: ClassActionProps) {
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
          <DropdownMenuItem onSelect={() => handleOpenAlert()}>Hapus Kelas</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteClassAlert classId={kelas.id} open={alertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}
