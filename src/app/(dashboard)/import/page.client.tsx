"use client";
import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Papa from "papaparse";
import { useMutation } from "@tanstack/react-query";
import { ImportService } from "@/services/import.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/query-client";

const headerMap = ["nis", "nama", "gender"];

export default function ClientPage() {
  const maxSize = 10 * 1024 * 1024;
  const router = useRouter();
  const [data, setData] = useState<{
    className: string;
    description: string;
    length: number;
  }>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { file: File; className: string; description: string }) => ImportService.import(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      router.push("/import");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({
    maxSize,
    accept: "text/csv",
    maxFiles: 1,
    onFilesAdded: (files) => {
      if (files.length === 0) return;
      const { file } = files[0];
      Papa.parse<{ nis: string; nama: string; gender: string }>(file as File, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header, index) => {
          return headerMap[index];
        },
        complete: (results) => {
          setData({
            className: results.data[0].nama!,
            description: results.data[1].nama!,
            length: results.data.length - 4,
          });
        },
      });
    },
  });

  const file = files[0];

  return (
    <div className="my-2 md:my-4">
      <div className="flex flex-col gap-2">
        {/* Drop area */}
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="bg-primary/10 border-input hover:bg-primary/20 data-[dragging=true]:bg-primary/20 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
        >
          <input {...getInputProps()} className="sr-only" aria-label="Upload file" disabled={Boolean(file)} />

          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <UploadIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload CSV file</p>
            <p className="text-muted-foreground text-sm">
              Drag & drop or click to browse CSV file (max. {formatBytes(maxSize)})
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}

        {/* File list */}
        {file && (
          <div className="space-y-2">
            <div
              key={file.id}
              className="flex flex-col items-center justify-between gap-2 rounded-xl border bg-accent/20 overflow-hidden pb-2"
            >
              <div className="flex items-center justify-between gap-2 w-full px-4 py-2 bg-accent/50 border-b">
                <div className="flex items-center gap-3 overflow-hidden">
                  <PaperclipIcon className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{file.file.name}</p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  onClick={() => removeFile(files[0]?.id)}
                  aria-label="Remove file"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
              {data && (
                <div className="flex flex-col text-[13px] w-full px-3">
                  <p>Nama Kelas : {data.className}</p>
                  <p>Deskripsi : {data.description}</p>
                  <p>Jumlah Murid : {data.length}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {data && (
          <Button
            size="sm"
            disabled={isPending}
            className="w-full"
            onClick={() =>
              mutate({
                file: file.file as File,
                className: data.className,
                description: data.description,
              })
            }
            aria-label="Import"
          >
            Import
          </Button>
        )}
      </div>
    </div>
  );
}
