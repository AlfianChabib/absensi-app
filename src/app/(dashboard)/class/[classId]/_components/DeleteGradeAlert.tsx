"use client";

import { GradeResult } from "@/app/api/grades/route";
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
import { GradeService } from "@/services/grade.service";
import { useMutation } from "@tanstack/react-query";
import { getUnixTime } from "date-fns";
import { toast } from "sonner";

type Props = {
  grade: GradeResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteGradeAlert({ grade, open, onOpenChange }: Props) {
  const { mutate: deleteGrade, isPending } = useMutation({
    mutationFn: () =>
      GradeService.delete({ classId: grade.classId, date: getUnixTime(grade.date), type: grade.assessmentType }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus penilaian ini</AlertDialogTitle>
          <AlertDialogDescription>
            Semua data penilaian akan dihapus. Apakah anda yakin ingin menghapus penilaian ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteGrade();
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
