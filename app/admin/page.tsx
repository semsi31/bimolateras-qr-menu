import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Coffee,
  FolderTree,
  Plus,
  Settings,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Button } from "@/components/ui/button";
import { getAdminDashboardData } from "@/lib/admin-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Panel",
  description: "Bİ'MOLA TERAS CAFE yönetim paneli.",
  path: "/admin",
  noIndex: true,
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

const quickActions = [
  {
    href: "/admin/products",
    label: "Yeni ürün ekle",
    description: "Menüye yeni bir ürün kartı oluştur.",
    icon: Plus,
  },
  {
    href: "/admin/categories",
    label: "Yeni kategori ekle",
    description: "Menü bölümlerini düzenle ve sırala.",
    icon: FolderTree,
  },
  {
    href: "/menu",
    label: "Menüyü görüntüle",
    description: "Public QR menüyü müşteri gözüyle aç.",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/settings",
    label: "Ayarlara git",
    description: "Logo, iletişim ve işletme bilgilerini güncelle.",
    icon: Settings,
  },
] as const;

export default async function AdminPage() {
  const { stats, recentProducts, error } = await getAdminDashboardData();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Dashboard"
        description="QR menü içeriğini hızlıca kontrol etmek için sade yönetim özeti."
        icon={Sparkles}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/menu">
                <UtensilsCrossed className="size-4" />
                Menüyü Gör
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/products">
                <Plus className="size-4" />
                Ürün Ekle
              </Link>
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-5 rounded-2xl border border-[#c45c4a]/25 bg-[#c45c4a]/12 px-4 py-3 text-sm text-[#f1b4aa]">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Toplam Ürün"
          value={stats.totalProducts}
          description="Database içinde kayıtlı toplam ürün."
          icon={Coffee}
        />
        <AdminStatCard
          title="Aktif Ürün"
          value={stats.activeProducts}
          description="Public menüde görünmeye hazır aktif ürünler."
          icon={UtensilsCrossed}
        />
        <AdminStatCard
          title="Kategori"
          value={stats.categoryCount}
          description="Database içindeki menü kategorileri."
          icon={FolderTree}
        />
        <AdminStatCard
          title="Stokta Yok"
          value={stats.unavailableProducts}
          description="Stokta yok olarak işaretlenen ürünler."
          icon={AlertTriangle}
        />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-bimola-cream">
                Son Eklenen Ürünler
              </h2>
              <p className="mt-1 text-sm text-bimola-cream/55">
                Database üzerinden en son oluşturulan ürünler.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link
                href="/admin/products"
                className="text-bimola-gold-light hover:text-bimola-cream"
              >
                Tümü
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/35 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-bimola-cream">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-bimola-cream/50">
                    {product.categoryName}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-bimola-gold/15 px-3 py-1 text-sm font-bold text-bimola-gold-light">
                  {formatPrice(product.price)}
                </p>
              </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-bimola-cream/15 bg-bimola-dark/25 p-5 text-center text-sm text-bimola-cream/55">
                Henüz ürün bulunmuyor.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-bimola-gold/20 bg-bimola-gold/10 p-5 shadow-gold">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bimola-gold-light">
            Hızlı İşlemler
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-bimola-cream">
            Yönetim kısayolları
          </h2>
          <p className="mt-2 text-sm leading-6 text-bimola-cream/62">
            En sık kullanılan admin adımlarına tek dokunuşla ulaşın.
          </p>

          <div className="mt-5 grid gap-3">
            {quickActions.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/35 p-3 text-bimola-cream transition-colors hover:border-bimola-gold/35 hover:bg-bimola-dark/55"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bimola-gold/20 text-bimola-gold-light transition-colors group-hover:bg-bimola-gold group-hover:text-bimola-cream">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-bimola-cream/52">
                    {description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
