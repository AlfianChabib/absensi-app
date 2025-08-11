"use client";

import UserMenu from "../navbar-components/user-menu";
import { Suspense } from "react";
import UserMenuFallback from "../navbar-components/avatar-fallback";
import NavigatorMenu from "../navbar-components/navigator-menu";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b h-16 px-4 md:px-6 fixed top-0 bg-background w-full border-primary/50 z-50">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex gap-2 items-center">
            <Image src={"/logo.png"} alt="Logo" width={20} height={20} className="w-10 h-10 rounded-full" />
            <span className="font-medium text-foreground">Absen Siswa</span>
          </div>
        </div>
        <NavigatorMenu />
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* <Button size="sm" className="text-sm max-sm:aspect-square max-sm:p-0">
            <PlusIcon className="opacity-60 sm:-ms-1" size={16} aria-hidden="true" />
            <span className="max-sm:sr-only">Post</span>
          </Button> */}
          <Suspense fallback={<UserMenuFallback />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
