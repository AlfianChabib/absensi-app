import { FileText, FolderUp, Logs, School } from "lucide-react";

export const NAVIGATION_LINKS = [
  { href: "/class", label: "Kelas", icon: School },
  { href: "/attendance", label: "Absen", icon: Logs },
  { href: "/grade", label: "Nilai", icon: FileText },
  { href: "/import", label: "Import", icon: FolderUp },
];

export const TABS = [
  { title: "Kelas", icon: School, href: "/class" },
  { type: "separator" as const },
  { title: "Absen", icon: Logs, href: "/attendance" },
  { type: "separator" as const },
  { title: "Nilai", icon: FileText, href: "/grade" },
  { type: "separator" as const },
  { title: "Import", icon: FolderUp, href: "/import" },
];
