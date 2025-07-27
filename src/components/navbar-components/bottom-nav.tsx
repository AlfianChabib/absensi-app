"use client";

import { TABS } from "@/utils/constants";
import { ExpandedTabs } from "../ui/expanded-tabs";

export default function BottomNav() {
  return (
    <div className="md:hidden flex w-full flex-col items-center justify-center fixed bottom-2">
      <ExpandedTabs tabs={TABS} />
    </div>
  );
}
