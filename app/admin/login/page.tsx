import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { PublicLogoImage } from "@/components/public/PublicLogoImage";
import { getCurrentAdminSession } from "@/lib/auth";
import { SITE } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";
import { getPublicCafeSettings } from "@/lib/settings-data";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Giriş",
  path: "/admin/login",
  noIndex: true,
});

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await getCurrentAdminSession();

  if (session) {
    redirect("/admin");
  }

  const { next } = await searchParams;
  const settings = await getPublicCafeSettings();
  const cafeName = settings.cafeName ?? SITE.name;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bimola-dark px-5 py-10">
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-bimola-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 right-0 size-80 rounded-full bg-bimola-cream/10 blur-3xl"
      />

      <section className="relative w-full max-w-md rounded-[2rem] border border-bimola-cream/10 bg-bimola-cream/[0.06] p-6 shadow-card backdrop-blur sm:p-8">
        <div className="text-center">
          <div className="relative mx-auto size-24 overflow-hidden rounded-3xl border border-bimola-gold/30 bg-bimola-dark/25 shadow-gold ring-1 ring-bimola-cream/10">
            <PublicLogoImage
              src={settings.logoUrl}
              updatedAt={settings.updatedAt}
              alt={`${cafeName} logosu`}
              priority
              sizes="96px"
              variant="flush"
            />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-bimola-cream">
            Admin Giriş
          </h1>
          <p className="mt-2 text-sm leading-6 text-bimola-cream/58">
            {cafeName} yönetim paneli için giriş ekranı.
          </p>
        </div>

        <AdminLoginForm nextPath={next} />
      </section>
    </main>
  );
}
