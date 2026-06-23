import type { Metadata } from "next";
import { Coffee } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminProductsPageData } from "@/lib/admin-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ürün Yönetimi",
  path: "/admin/products",
  noIndex: true,
});

export default async function AdminProductsPage() {
  const data = await getAdminProductsPageData();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Ürün Yönetimi"
        description="Ürünleri database üzerinde ekleyin, düzenleyin, filtreleyin ve durumlarını yönetin."
        icon={Coffee}
      />
      <AdminProductsClient
        products={data.products}
        categories={data.categories}
        error={data.error}
      />
    </AdminShell>
  );
}
