import { ContactButtons } from "@/components/public/ContactButtons";
import { SITE } from "@/lib/constants";
import type { CafeSettingsData } from "@/lib/settings-data";

type MenuFooterProps = {
  settings?: CafeSettingsData;
};

export function MenuFooter({ settings }: MenuFooterProps) {
  const cafeName = settings?.cafeName ?? SITE.name;

  return (
    <footer className="px-4 pb-8 pt-4 sm:px-0">
      <div className="rounded-3xl border border-bimola-border bg-bimola-card p-5 text-center shadow-soft sm:p-8">
        <h2 className="font-heading text-2xl font-semibold text-bimola-coffee">
          {cafeName}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-bimola-coffee-muted">
          Yayladağı&apos;nda kahve, teras ve keyifli mola. Güncel menümüz için
          bizi takip edin veya konum üzerinden ziyaret edin.
        </p>
        <ContactButtons className="mt-5" size="sm" contacts={settings} />
      </div>
      <p className="mt-6 text-center text-xs text-bimola-coffee-muted">
        © {new Date().getFullYear()} {cafeName}. QR menü deneyimi.
      </p>
    </footer>
  );
}
