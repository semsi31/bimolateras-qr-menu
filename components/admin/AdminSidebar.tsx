"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Coffee,
  FolderTree,
  LogOut,
  Settings,
  Store,
  UtensilsCrossed,
} from "lucide-react";

import { PublicLogoImage } from "@/components/public/PublicLogoImage";
import { Button } from "@/components/ui/button";
import { LOGO_PATH, SITE } from "@/lib/constants";
import { withImageVersion } from "@/lib/image-version";
import type { CafeSettingsData } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  settings?: CafeSettingsData;
};

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Ürünler", icon: Coffee },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  { href: "/menu", label: "Menüye Git", icon: UtensilsCrossed },
] as const;

export function AdminSidebar({ settings }: AdminSidebarProps) {
  const pathname = usePathname();
  const cafeName = settings?.cafeName ?? SITE.shortName;
  const locationText = settings?.locationText ?? SITE.location;
  const logoUrl = settings?.logoUrl ?? LOGO_PATH;
  const logoSrc = withImageVersion(logoUrl, settings?.updatedAt) ?? LOGO_PATH;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-bimola-cream/10 bg-bimola-dark/90 p-5 shadow-card backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/admin" className="flex items-center gap-3">
        <div className="relative size-12 overflow-hidden rounded-2xl border border-bimola-gold/30 bg-bimola-card shadow-gold">
          <PublicLogoImage
            src={logoSrc}
            alt={`${cafeName} logosu`}
            sizes="48px"
            priority
          />
        </div>
        <div>
          <p className="line-clamp-2 font-heading text-xl font-semibold leading-none text-bimola-cream">
            {cafeName}
          </p>
          <p className="mt-1 text-xs text-bimola-cream/55">Admin Panel</p>
        </div>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5" aria-label="Admin">
        {adminLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-bimola-gold text-bimola-cream shadow-gold"
                  : "text-bimola-cream/70 hover:bg-bimola-cream/10 hover:text-bimola-cream"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-bimola-gold/20">
            <Store className="size-5 text-bimola-gold-light" />
          </div>
          <div>
            <p className="text-sm font-semibold text-bimola-cream">İşletme</p>
            <p className="text-xs text-bimola-cream/55">{locationText}</p>
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start text-bimola-cream/65 hover:bg-bimola-cream/10 hover:text-bimola-cream"
        >
          <Link href="/admin/logout">
            <LogOut className="size-4" />
            Çıkış Yap
          </Link>
        </Button>
      </div>
    </aside>
  );
}
