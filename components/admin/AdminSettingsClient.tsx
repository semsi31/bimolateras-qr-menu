"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Save } from "lucide-react";

import {
  updateCafeSettingsAction,
  uploadLogoAction,
  type SettingsActionResult,
} from "@/app/admin/settings/actions";
import { Button } from "@/components/ui/button";
import type { AdminCafeSettingsData } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

type AdminSettingsClientProps = {
  settings: AdminCafeSettingsData;
};

type MessageState = SettingsActionResult | null;
const allowedLogoImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxLogoSize = 2 * 1024 * 1024;

function getClientActionErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? `${fallback}: ${error.message}` : fallback;
}

export function AdminSettingsClient({ settings }: AdminSettingsClientProps) {
  const [cafeName, setCafeName] = useState(settings.cafeName);
  const [locationText, setLocationText] = useState(settings.locationText);
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl ?? "");
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl ?? "");
  const [mapsUrl, setMapsUrl] = useState(settings.mapsUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [localLogoPreview, setLocalLogoPreview] = useState("");
  const [uploadedLogoPreviewUrl, setUploadedLogoPreviewUrl] = useState("");
  const [selectedLogoName, setSelectedLogoName] = useState("");
  const [message, setMessage] = useState<MessageState>(
    settings.error ? { ok: false, message: settings.error } : null
  );
  const [uploadMessage, setUploadMessage] = useState<MessageState>(null);
  const [isSavePending, startSaveTransition] = useTransition();
  const [isUploadPending, startUploadTransition] = useTransition();
  const previewUrl =
    localLogoPreview || uploadedLogoPreviewUrl || logoUrl || "/logo.png";

  useEffect(() => {
    return () => {
      if (localLogoPreview) {
        URL.revokeObjectURL(localLogoPreview);
      }
    };
  }, [localLogoPreview]);

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setUploadMessage(null);
    setUploadedLogoPreviewUrl("");

    if (!file) {
      setSelectedLogoName("");
      setLocalLogoPreview("");
      return;
    }

    if (file.size > maxLogoSize) {
      event.target.value = "";
      setSelectedLogoName("");
      setUploadMessage({
        ok: false,
        message:
          "Logo en fazla 2 MB olabilir. Lütfen daha küçük bir görsel seçin.",
      });
      return;
    }

    if (!allowedLogoImageTypes.includes(file.type)) {
      event.target.value = "";
      setSelectedLogoName("");
      setUploadMessage({
        ok: false,
        message: "Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.",
      });
      return;
    }

    setSelectedLogoName(file.name);
    setLocalLogoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.set("file", file);

    startUploadTransition(async () => {
      const result = await uploadLogoAction(formData).catch((error) => ({
        ok: false,
        message: getClientActionErrorMessage(
          error,
          "İşlem tamamlanamadı. Lütfen tekrar deneyin."
        ),
      }));

      setUploadMessage(result);

      if (result.ok && "url" in result) {
        setLogoUrl(result.url);
        setUploadedLogoPreviewUrl(`${result.url}?preview=${Date.now()}`);
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploadPending) {
      setMessage({
        ok: false,
        message: "Logo yükleniyor. Lütfen tamamlanmasını bekleyin.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);

    startSaveTransition(async () => {
      const result = await updateCafeSettingsAction(formData).catch((error) => ({
        ok: false,
        message: getClientActionErrorMessage(
          error,
          "Ayar kaydetme işlemi başlatılamadı"
        ),
      }));

      setMessage(result);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <section className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-5 shadow-soft">
        <p className="text-sm font-semibold text-bimola-cream">
          Logo Önizleme
        </p>
        <div className="mt-4 rounded-3xl border border-bimola-gold/20 bg-bimola-dark/35 p-6 text-center">
          <div className="mx-auto size-32 overflow-hidden rounded-3xl border border-bimola-gold/30 bg-bimola-card shadow-gold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`${cafeName} logosu`}
              className="size-full object-cover"
            />
          </div>
          <p className="mt-4 font-heading text-2xl font-semibold text-bimola-cream">
            {cafeName || "Bİ'MOLA TERAS CAFE"}
          </p>
          <p className="mt-2 break-all text-sm text-bimola-cream/55">
            {logoUrl && logoUrl !== "/logo.png"
              ? "Logo bağlantısı oluşturuldu."
              : "Varsayılan logo kullanılıyor."}
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-bimola-cream/15 bg-bimola-dark/30 p-4">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoFileChange}
            className="block w-full text-sm text-bimola-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-bimola-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-bimola-cream hover:file:bg-bimola-gold-light"
          />
          {selectedLogoName && (
            <p className="mt-3 text-xs text-bimola-cream/55">
              Seçilen logo: {selectedLogoName}
            </p>
          )}
          {isUploadPending && (
            <p className="mt-3 text-xs font-semibold text-bimola-gold-light">
              Logo yükleniyor...
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-bimola-cream/45">
            JPG, PNG veya WEBP yükleyebilirsiniz. Maksimum 2 MB.
          </p>
          {uploadMessage && (
            <p
              className={cn(
                "mt-3 rounded-2xl border px-3 py-2 text-xs",
                uploadMessage.ok
                  ? "border-bimola-success/25 bg-bimola-success/15 text-[#bce0b6]"
                  : "border-[#c45c4a]/25 bg-[#c45c4a]/12 text-[#f1b4aa]"
              )}
            >
              {uploadMessage.message}
            </p>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-5 shadow-soft"
      >
        {message && (
          <p
            className={cn(
              "mb-4 rounded-2xl border px-3 py-2 text-sm",
              message.ok
                ? "border-bimola-success/25 bg-bimola-success/15 text-[#bce0b6]"
                : "border-[#c45c4a]/25 bg-[#c45c4a]/12 text-[#f1b4aa]"
            )}
          >
            {message.message}
          </p>
        )}

        <input type="hidden" name="logoUrl" value={logoUrl || "/logo.png"} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              Kafe adı
            </span>
            <input
              name="cafeName"
              value={cafeName}
              onChange={(event) => setCafeName(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              Konum
            </span>
            <input
              name="locationText"
              value={locationText}
              onChange={(event) => setLocationText(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              WhatsApp bağlantısı
            </span>
            <input
              name="whatsappUrl"
              type="url"
              placeholder="https://wa.me/90..."
              value={whatsappUrl}
              onChange={(event) => setWhatsappUrl(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              Instagram bağlantısı
            </span>
            <input
              name="instagramUrl"
              type="url"
              placeholder="https://instagram.com/..."
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              Google Maps bağlantısı
            </span>
            <input
              name="mapsUrl"
              type="url"
              placeholder="https://maps.google.com/..."
              value={mapsUrl}
              onChange={(event) => setMapsUrl(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-bimola-cream/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-bimola-cream/45">
            Logo yükledikten sonra ayarlara kaydetmeyi unutmayın.
          </p>
          <Button type="submit" disabled={isSavePending || isUploadPending}>
            <Save className="size-4" />
            {isSavePending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}

