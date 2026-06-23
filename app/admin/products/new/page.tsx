import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Yeni Ürün",
  path: "/admin/products/new",
  noIndex: true,
});

/** New product form — Phase 3. */
export default function AdminNewProductPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bimola-dark px-6">
      <p className="text-sm text-bimola-cream/60">Yeni ürün — yakında</p>
    </main>
  );
}
