"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import type { MenuCategory } from "@/lib/mock-menu";
import { cn } from "@/lib/utils";

type CategoryTabsProps = {
  categories: MenuCategory[];
  activeCategoryId: string;
  onCategoryClick: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  activeCategoryId,
  onCategoryClick,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const activeTab = tabRefs.current.get(activeCategoryId);
    const container = scrollContainerRef.current;

    if (!activeTab || !container) {
      return;
    }

    const targetScrollLeft =
      activeTab.offsetLeft - container.clientWidth / 2 + activeTab.offsetWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    });
  }, [activeCategoryId]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="sticky top-0 z-30 border-y border-bimola-border/70 bg-bimola-cream/90 px-3 py-2.5 shadow-card backdrop-blur-xl sm:top-3 sm:mx-auto sm:max-w-5xl sm:rounded-2xl sm:border sm:px-4"
      aria-label="Menü kategorileri"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bimola-cream via-bimola-cream/90 to-transparent sm:rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bimola-cream via-bimola-cream/90 to-transparent sm:rounded-r-2xl" />

      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex gap-1.5 overflow-x-auto px-1"
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              ref={(element) => {
                if (element) {
                  tabRefs.current.set(category.id, element);
                } else {
                  tabRefs.current.delete(category.id);
                }
              }}
              type="button"
              onClick={() => onCategoryClick(category.id)}
              className={cn(
                "relative shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-200 sm:px-3.5 sm:text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bimola-gold",
                isActive
                  ? "border-bimola-coffee text-bimola-cream"
                  : "border-bimola-border/80 bg-bimola-card/90 text-bimola-coffee-muted hover:border-bimola-gold/40 hover:text-bimola-coffee"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-category-pill"
                  className="absolute inset-0 rounded-full bg-bimola-coffee shadow-gold ring-1 ring-bimola-gold/30"
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                />
              )}
              <span className="relative z-10">{category.name}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
