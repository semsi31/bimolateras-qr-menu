"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Coffee,
  FolderTree,
  LogOut,
  Menu,
  Settings,
  UtensilsCrossed,
} from "lucide-react";

import { logoutAction } from "@/app/admin/logout/actions";
import { PublicLogoImage } from "@/components/public/PublicLogoImage";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import type { CafeSettingsData } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

type AdminTopbarProps = {
  settings?: CafeSettingsData;
};

const mobileLinks = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Ürünler", icon: Coffee },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  { href: "/menu", label: "Menü", icon: UtensilsCrossed },
] as const;

export function AdminTopbar({ settings }: AdminTopbarProps) {
  const pathname = usePathname();
  const cafeName = settings?.cafeName ?? SITE.shortName;

  return (
    <header className="sticky top-0 z-30 border-b border-bimola-cream/10 bg-bimola-dark/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-bimola-gold/30 bg-bimola-cream/5 shadow-gold">
            <PublicLogoImage
              src={settings?.logoUrl}
              updatedAt={settings?.updatedAt}
              alt={`${cafeName} logosu`}
              sizes="40px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-semibold leading-none text-bimola-cream">
              {cafeName}
            </p>
            <p className="mt-1 text-xs text-bimola-cream/55">Admin Panel</p>
          </div>
        </Link>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-bimola-cream/70 hover:bg-bimola-cream/10 hover:text-bimola-cream"
          aria-label="Mobil admin menüsü"
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <nav
        aria-label="Mobil admin navigasyon"
        className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3"
      >
        {mobileLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                isActive
                  ? "border-bimola-gold bg-bimola-gold text-bimola-cream shadow-gold"
                  : "border-bimola-cream/10 bg-bimola-cream/5 text-bimola-cream/70"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-bimola-cream/10 bg-bimola-cream/5 px-3 py-2 text-xs font-semibold text-bimola-cream/70"
          >
            <LogOut className="size-3.5" />
            Çıkış
          </button>
        </form>
      </nav>
    </header>
  );
}
