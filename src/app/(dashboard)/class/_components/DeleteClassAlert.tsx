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
import { ClassService } from "@/services/class.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteClassAlert({ classId, open, onOpenChange }: Props) {
  const { mutate: deleteClass, isPending } = useMutation({
    mutationFn: () => ClassService.deleteClass({ classId }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus kelas ini</AlertDialogTitle>
          <AlertDialogDescription>
            Semua data kelas akan dihapus. Apakah anda yakin ingin menghapus kelas ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteClass();
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
