import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Absen Siswa",
  title: {
    default: "Absen Siswa",
    template: "%s - Absen Siswa",
  },
  description: "Aplikasi Absen Siswa",
  keywords: "Absen Siswa, Absen, Siswa",
  appleWebApp: {
    title: "Absen Siswa",
    statusBarStyle: "black",
    capable: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-center" richColors={true} />
        {children}
      </body>
    </html>
  );
}
