"use client";

import { motion } from "framer-motion";

import { EmptyState } from "@/components/public/menu/EmptyState";
import { ProductCard } from "@/components/public/menu/ProductCard";
import type { MenuCategory, MenuProduct } from "@/lib/mock-menu";

type ProductSectionProps = {
  category: MenuCategory;
  products: MenuProduct[];
};

export function ProductSection({ category, products }: ProductSectionProps) {
  return (
    <section
      id={category.id}
      className="scroll-mt-24 px-4 py-5 sm:scroll-mt-32 sm:px-0 sm:py-6"
      aria-labelledby={`${category.id}-title`}
    >
      <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-4 sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bimola-gold">
            Menü
          </p>
          <h2
            id={`${category.id}-title`}
            className="mt-0.5 font-heading text-2xl font-semibold leading-tight text-bimola-coffee sm:text-3xl"
          >
            {category.name}
          </h2>
          <p className="mt-0.5 text-sm leading-6 text-bimola-coffee-muted">
            {category.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-bimola-border bg-bimola-card px-2.5 py-1 text-[11px] font-medium text-bimola-coffee-muted sm:px-3 sm:text-xs">
          {products.length} ürün
        </span>
      </div>

      {products.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
