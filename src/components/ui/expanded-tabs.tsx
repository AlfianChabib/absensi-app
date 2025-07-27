"use client";

import * as React from "react";
import { AnimatePresence, motion, Transition } from "framer-motion";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

interface Tab {
  title: string;
  icon: LucideIcon;
  href?: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandedTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 } as Transition;

export function ExpandedTabs({ tabs, className, activeColor = "text-primary", onChange }: ExpandedTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const handleSelect = (index: number, href?: string) => {
    router.push(href ?? "");
    setSelected(index);
    onChange?.(index);
  };

  React.useEffect(() => {
    tabs.forEach((tab, index) => {
      if (tab.type !== "separator") {
        if (tab.href?.split("/")[1] === segment) {
          setSelected(index);
          onChange?.(index);
        }
      }
    });
  }, [tabs, segment, onChange]);

  const Separator = () => <div className=" h-[24px] w-[1.2px] bg-border" aria-hidden="true" />;

  return (
    <div className={cn("flex gap-2 items-center rounded-2xl border bg-background p-1 shadow-sm ", className)}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }
        const Icon = tab.icon;
        return (
          <motion.div
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index, tab.href)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              selected === index
                ? cn("bg-muted", activeColor)
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={20} />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="leading-4"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
