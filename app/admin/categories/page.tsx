import type { Metadata } from "next";
import { FolderTree } from "lucide-react";

import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCategoriesPageData } from "@/lib/admin-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Kategori Yönetimi",
  path: "/admin/categories",
  noIndex: true,
});

export default async function AdminCategoriesPage() {
  const data = await getAdminCategoriesPageData();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Kategori Yönetimi"
        description="Kategorileri database üzerinde ekleyin, düzenleyin ve aktif/pasif yönetin."
        icon={FolderTree}
      />
      <AdminCategoriesClient
        categories={data.categories}
        error={data.error}
      />
    </AdminShell>
  );
}
