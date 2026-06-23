import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireAdminSession } from "@/lib/auth";
import { getCafeSettingsForAdmin } from "@/lib/settings-data";

type AdminShellProps = {
  children: React.ReactNode;
};

export async function AdminShell({ children }: AdminShellProps) {
  await requireAdminSession();
  const settings = await getCafeSettingsForAdmin();

  return (
    <div className="min-h-dvh bg-bimola-dark text-bimola-cream">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#b8864b24,transparent_28rem),radial-gradient(circle_at_bottom_right,#fff9f20f,transparent_24rem)]" />
      <div className="relative flex min-h-dvh">
        <AdminSidebar settings={settings} />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <AdminTopbar settings={settings} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
