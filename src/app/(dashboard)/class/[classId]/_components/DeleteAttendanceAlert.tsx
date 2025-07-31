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
import { AttendanceService } from "@/services/attendance.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  classId: string;
  date: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteAttendanceAlert({ classId, date, open, onOpenChange }: Props) {
  const { mutate: deleteAttendance, isPending } = useMutation({
    mutationFn: () => AttendanceService.deleteAttendance({ classId, date: new Date(date) }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      queryClient.invalidateQueries({ queryKey: ["students-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["session-attendances"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus absen ini</AlertDialogTitle>
          <AlertDialogDescription>
            Semua data absen akan dihapus. Apakah anda yakin ingin menghapus absen ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteAttendance();
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
