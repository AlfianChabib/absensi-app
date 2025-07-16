import { FileText, FolderUp, House, HouseIcon, Logs } from "lucide-react";

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home", icon: HouseIcon },
  { href: "/grade", label: "Nilai", icon: FileText },
  { href: "/attendance", label: "Absen", icon: Logs },
  { href: "/export", label: "Export", icon: FolderUp },
];

export const TABS = [
  { title: "Home", icon: House, href: "/" },
  { type: "separator" as const },
  { title: "Absen", icon: Logs, href: "/attendance" },
  { type: "separator" as const },
  { title: "Nilai", icon: FileText, href: "/grade" },
  { type: "separator" as const },
  { title: "Export", icon: FolderUp, href: "/export" },
];
