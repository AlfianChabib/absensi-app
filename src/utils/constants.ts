import { FileInput, FileText, FolderUp, Logs, School } from "lucide-react";

export const NAVIGATION_LINKS = [
  { href: "/class", label: "Kelas", icon: School },
  { href: "/attendance", label: "Absen", icon: Logs },
  { href: "/grade", label: "Nilai", icon: FileText },
  { href: "/export", label: "Export", icon: FolderUp },
  { href: "/import", label: "Import", icon: FileInput },
];

export const TABS = [
  { title: "Kelas", icon: School, href: "/class" },
  { type: "separator" as const },
  { title: "Absen", icon: Logs, href: "/attendance" },
  { type: "separator" as const },
  { title: "Nilai", icon: FileText, href: "/grade" },
  { type: "separator" as const },
  { title: "Export", icon: FolderUp, href: "/export" },
  { type: "separator" as const },
  { title: "Import", icon: FileInput, href: "/import" },
];

export const ATTENDANCE_STATUS = [
  { value: "HADIR", label: "Hadir" },
  { value: "IZIN", label: "Izin" },
  { value: "SAKIT", label: "Sakit" },
  { value: "ALFA", label: "Alfa" },
];

export const AssessmentType = {
  TUGAS: "Tugas",
  ULANGAN_HARIAN: "Ulangan Harian",
  UTS: "UTS",
  UAS: "UAS",
};
