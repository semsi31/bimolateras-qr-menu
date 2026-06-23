import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Button } from "@/components/ui/button";
import { getCurrentAdminSession } from "@/lib/auth";
import { LOGO_PATH, SITE } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";

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
          <div className="relative mx-auto size-20 overflow-hidden rounded-3xl border border-bimola-gold/30 bg-bimola-card shadow-gold">
            <Image
              src={LOGO_PATH}
              alt={`${SITE.name} logosu`}
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-bimola-cream">
            Admin Giriş
          </h1>
          <p className="mt-2 text-sm leading-6 text-bimola-cream/58">
            {SITE.name} yönetim paneli için giriş ekranı.
          </p>
        </div>

        <AdminLoginForm nextPath={next} />

        <div className="mt-5 rounded-2xl border border-bimola-gold/20 bg-bimola-gold/10 p-4 text-center">
          <p className="text-xs leading-5 text-bimola-cream/62">
            Bu giriş demo/development kullanımı içindir. Production ortamında
            ADMIN_EMAIL, ADMIN_PASSWORD ve AUTH_SECRET değerlerini değiştirin.
          </p>
        </div>

        <Button asChild variant="ghost" className="mt-4 w-full">
          <Link href="/admin">Dashboard önizlemesine dön</Link>
        </Button>
      </section>
    </main>
  );
}
