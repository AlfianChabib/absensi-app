"use client";

import { Button } from "@/components/ui/button";
import { ExportType } from "@/types/export";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FolderUp, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DownloadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classId?: string;
  exportType: ExportType;
  startDate?: Date;
  endDate?: Date;
  namaKelas: string;
}

export default function DownloadButton({
  classId,
  exportType,
  startDate,
  endDate,
  namaKelas,
  ...props
}: DownloadButtonProps) {
  const [isLoading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/export/${exportType}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId, type: exportType, startDate, endDate }),
      });

      if (!response.ok) {
        // Anda bisa menambahkan notifikasi error yang lebih baik di sini (misalnya menggunakan react-hot-toast)
        throw new Error("Gagal mengunduh file. Status: " + response.status);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${exportType === "attendances" ? "daftar-absen" : "nilai-kelas"}_${format(
        startDate as Date,
        "PPP",
        { locale: id }
      )}_${format(endDate as Date, "PPP", {
        locale: id,
      })}_${namaKelas}.xlsx`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Berhasil mengekspor data");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleDownload}
      disabled={isLoading || !classId || !exportType || !startDate || !endDate}
      className="w-full"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <FolderUp />}
      <span>Export</span>
    </Button>
  );
}
