import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { createPageMetadata } from "@/lib/metadata";
import { getCafeSettingsForAdmin } from "@/lib/settings-data";

export const metadata: Metadata = createPageMetadata({
  title: "Ayarlar",
  path: "/admin/settings",
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const settings = await getCafeSettingsForAdmin();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Kafe Ayarları"
        description="İşletme bilgilerini, iletişim bağlantılarını ve logoyu yönetin."
        icon={Settings}
      />

      <AdminSettingsClient settings={settings} />
    </AdminShell>
  );
}
