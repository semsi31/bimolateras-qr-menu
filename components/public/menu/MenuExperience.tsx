"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { CategoryTabs } from "@/components/public/menu/CategoryTabs";
import { EmptyState } from "@/components/public/menu/EmptyState";
import { MenuFooter } from "@/components/public/menu/MenuFooter";
import { MenuHeader } from "@/components/public/menu/MenuHeader";
import { ProductSection } from "@/components/public/menu/ProductSection";
import type { MenuCategory, MenuProduct } from "@/lib/mock-menu";
import type { CafeSettingsData } from "@/lib/settings-data";

type MenuExperienceProps = {
  categories: MenuCategory[];
  products: MenuProduct[];
  settings?: CafeSettingsData;
};

export function MenuExperience({
  categories,
  products,
  settings,
}: MenuExperienceProps) {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const [activeCategoryId, setActiveCategoryId] = useState(
    sortedCategories[0]?.id ?? ""
  );

  const categoryProducts = useMemo(
    () =>
      sortedCategories.map((category) => ({
        category,
        products: category.featuredOnly
          ? products
              .filter((product) => product.isPopular === true)
              .sort(
                (a, b) =>
                  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
              )
          : products
              .filter((product) => product.categoryId === category.id)
              .sort(
                (a, b) =>
                  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
              ),
      })),
    [products, sortedCategories]
  );

  useEffect(() => {
    setActiveCategoryId(sortedCategories[0]?.id ?? "");
  }, [sortedCategories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveCategoryId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sortedCategories.forEach((category) => {
      const section = document.getElementById(category.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sortedCategories]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    document.getElementById(categoryId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-dvh bg-[radial-gradient(circle_at_top,#d4a57422,transparent_34rem),linear-gradient(180deg,#f6efe7,#fff9f2_48%,#f6efe7)]"
    >
      <MenuHeader settings={settings} />
      <div className="h-3 sm:h-4" />
      {sortedCategories.length > 0 && (
        <CategoryTabs
          categories={sortedCategories}
          activeCategoryId={activeCategoryId}
          onCategoryClick={handleCategoryClick}
        />
      )}
      <div className="mx-auto w-full max-w-5xl pb-8 pt-1 sm:pt-2">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(({ category, products }) => (
            <ProductSection
              key={category.id}
              category={category}
              products={products}
            />
          ))
        ) : (
          <div className="px-4 py-8">
            <EmptyState
              title="Menü henüz hazır değil."
              description="Aktif kategori veya ürün bulunamadı."
            />
          </div>
        )}
        <MenuFooter settings={settings} />
      </div>
    </motion.main>
  );
}
