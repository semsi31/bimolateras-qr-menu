import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return createPageMetadata({
    title: "Ürün Düzenle",
    path: `/admin/products/${id}/edit`,
    noIndex: true,
  });
}

/** Edit product form — Phase 3. */
export default function AdminEditProductPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bimola-dark px-6">
      <p className="text-sm text-bimola-cream/60">Ürün düzenleme — yakında</p>
    </main>
  );
}
