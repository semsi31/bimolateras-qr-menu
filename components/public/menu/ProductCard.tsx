"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Sparkles, Star } from "lucide-react";

import { withImageVersion } from "@/lib/image-version";
import type { MenuProduct } from "@/lib/mock-menu";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: MenuProduct;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

export function ProductCard({ product }: ProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageSrc = withImageVersion(product.imageUrl, product.updatedAt);

  useEffect(() => {
    setHasImageError(false);
  }, [imageSrc]);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={product.isAvailable ? { y: -3 } : undefined}
      whileTap={product.isAvailable ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "group overflow-hidden rounded-2xl border border-bimola-border bg-bimola-card shadow-soft transition-shadow duration-300 sm:rounded-[1.35rem]",
        product.isAvailable ? "hover:shadow-card" : "opacity-70 grayscale-[0.25]"
      )}
    >
      <div className="relative h-[124px] overflow-hidden border-b border-bimola-border/70 bg-bimola-cream-dark min-[390px]:h-[140px] sm:h-[150px] md:h-40 lg:h-44">
        {imageSrc && !hasImageError ? (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            loading="lazy"
            sizes="(min-width: 768px) 30vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#d4a57444,transparent_34%),radial-gradient(circle_at_70%_80%,#2b1a0f14,transparent_36%),linear-gradient(135deg,#fff9f2,#f6efe7_48%,#ede4d8)] p-4">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-bimola-gold/25 bg-bimola-card/75 shadow-card backdrop-blur sm:size-16">
              <div className="flex size-9 items-center justify-center rounded-full bg-bimola-cream shadow-soft sm:size-10">
                <Coffee className="size-4 text-bimola-gold sm:size-5" />
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1 p-2">
          {product.isPopular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bimola-dark/85 px-2 py-0.5 text-[9px] font-semibold text-bimola-cream backdrop-blur sm:text-[10px]">
              <Star className="size-2.5 fill-bimola-gold text-bimola-gold sm:size-3" />
              Popüler
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bimola-gold px-2 py-0.5 text-[9px] font-semibold text-bimola-cream shadow-gold sm:text-[10px]">
              <Sparkles className="size-2.5 sm:size-3" />
              Yeni
            </span>
          )}
          {!product.isAvailable && (
            <span className="ml-auto rounded-full bg-bimola-cream/90 px-2 py-0.5 text-[9px] font-semibold text-bimola-coffee sm:text-[10px]">
              Stokta yok
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        <div>
          <h3 className="line-clamp-1 font-heading text-base font-semibold leading-tight text-bimola-coffee sm:text-lg">
            {product.name}
          </h3>
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-bimola-coffee-muted sm:text-sm">
          {product.description}
        </p>
        <p className="mt-2 inline-flex rounded-full bg-bimola-cream-dark px-2.5 py-1 text-sm font-bold leading-none text-bimola-coffee sm:text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.article>
  );
}
