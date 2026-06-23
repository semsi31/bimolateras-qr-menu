"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

import { ContactButtons } from "@/components/public/ContactButtons";
import { Hero } from "@/components/public/Hero";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import type { CafeSettingsData } from "@/lib/settings-data";

type LandingPageClientProps = {
  settings: CafeSettingsData;
};

export function LandingPageClient({ settings }: LandingPageClientProps) {
  return (
    <main className="relative flex min-h-dvh flex-col">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-bimola-gold/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-bimola-coffee/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16">
        <Hero className="mb-8" settings={settings} />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10 max-w-sm text-center text-base leading-relaxed text-bimola-coffee-muted text-balance sm:text-lg"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-10 w-full max-w-xs"
        >
          <Button asChild size="lg" className="w-full">
            <Link href="/menu">
              <UtensilsCrossed className="size-5" />
              Menüyü Gör
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <ContactButtons contacts={settings} />
        </motion.div>
      </div>

      <footer className="relative border-t border-bimola-border/60 py-6 text-center">
        <p className="text-xs text-bimola-coffee-muted">
          © {new Date().getFullYear()} {settings.cafeName}
        </p>
      </footer>
    </main>
  );
}

