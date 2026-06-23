"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

import { PublicLogoImage } from "@/components/public/PublicLogoImage";
import { SITE } from "@/lib/constants";
import type { CafeSettingsData } from "@/lib/settings-data";

type MenuHeaderProps = {
  settings?: CafeSettingsData;
};

export function MenuHeader({ settings }: MenuHeaderProps) {
  const cafeName = settings?.cafeName ?? SITE.name;
  const locationText = settings?.locationText ?? SITE.location;

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden rounded-b-[1.75rem] bg-bimola-dark px-4 pb-6 pt-5 text-bimola-cream shadow-card sm:mx-auto sm:mt-4 sm:max-w-5xl sm:rounded-[2rem] sm:px-8 sm:pb-8 sm:pt-7"
    >
      <div
        aria-hidden
        className="absolute -right-16 -top-20 size-52 rounded-full bg-bimola-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-20 size-60 rounded-full bg-bimola-cream/10 blur-3xl"
      />

      <div className="relative flex items-start gap-3.5 sm:gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          className="relative size-16 shrink-0 overflow-hidden rounded-[1.15rem] border border-bimola-gold/30 bg-bimola-cream/5 shadow-gold min-[390px]:size-20 sm:size-24 sm:rounded-2xl"
        >
          <PublicLogoImage
            src={settings?.logoUrl}
            updatedAt={settings?.updatedAt}
            alt={`${cafeName} logosu`}
            priority
            sizes="96px"
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-bimola-gold/30 bg-bimola-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bimola-gold-light shadow-soft">
            <Sparkles className="size-3" />
            QR Menü
          </div>
          <h1 className="font-heading text-[1.65rem] font-semibold leading-[0.98] tracking-tight text-bimola-cream min-[390px]:text-3xl sm:text-5xl">
            {cafeName}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-bimola-cream/75 min-[390px]:text-sm sm:mt-3 sm:text-base">
            Manzara, kahve ve keyifli bir mola. Menümüzü telefonunuzdan hızlıca
            inceleyebilirsiniz.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-bimola-cream/10 bg-bimola-cream/10 px-2.5 py-1.5 text-[11px] font-medium text-bimola-cream/85 shadow-soft sm:mt-4 sm:text-xs">
            <MapPin className="size-3.5 text-bimola-gold-light" />
            {locationText}
          </p>
        </div>
      </div>
    </motion.header>
  );
}
