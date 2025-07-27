"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { queryClient } from "@/lib/query-client";
import { StudentService } from "@/services/student.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteStudentAlert({ studentId, open, onOpenChange }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => StudentService.deleteStudent({ studentId }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus murid ini</AlertDialogTitle>
          <AlertDialogDescription>
            Semua data murid akan dihapus. Apakah anda yakin ingin menghapus murid ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            disabled={isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
