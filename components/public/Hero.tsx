"use client";

import { motion } from "framer-motion";

import { PublicLogoImage } from "@/components/public/PublicLogoImage";
import { withImageVersion } from "@/lib/image-version";
import { LOGO_PATH, SITE } from "@/lib/constants";
import type { CafeSettingsData } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
  showLocation?: boolean;
  settings?: CafeSettingsData;
};

export function Hero({ className, showLocation = true, settings }: HeroProps) {
  const cafeName = settings?.cafeName ?? SITE.name;
  const locationText = settings?.locationText ?? SITE.location;
  const logoUrl = settings?.logoUrl ?? LOGO_PATH;
  const logoSrc = withImageVersion(logoUrl, settings?.updatedAt) ?? LOGO_PATH;

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("flex flex-col items-center text-center", className)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="relative mb-6 size-28 overflow-hidden rounded-full border-2 border-bimola-border bg-bimola-card shadow-card sm:size-32"
      >
        <PublicLogoImage
          src={logoSrc}
          alt={`${cafeName} logosu`}
          priority
          sizes="128px"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-heading text-3xl font-semibold tracking-tight text-bimola-coffee sm:text-4xl"
      >
        {cafeName}
      </motion.h1>

      {showLocation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2 text-sm text-bimola-coffee-muted"
        >
          {locationText}
        </motion.p>
      )}
    </motion.header>
  );
}
