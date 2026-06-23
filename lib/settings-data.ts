import { CONTACT, LOGO_PATH, SITE } from "@/lib/constants";
import { getPrismaClient } from "@/lib/db";

export type CafeSettingsData = {
  id?: string;
  cafeName: string;
  locationText: string;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  mapsUrl: string | null;
  logoUrl: string;
  updatedAt?: string;
};

export type AdminCafeSettingsData = CafeSettingsData & {
  error?: string;
};

export const defaultCafeSettings: CafeSettingsData = {
  cafeName: SITE.name,
  locationText: SITE.location,
  whatsappUrl: null,
  instagramUrl: null,
  mapsUrl: null,
  logoUrl: LOGO_PATH,
};

function normalizeOptionalUrl(value?: string | null) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function toSettingsData(settings: {
  id: string;
  cafeName: string;
  locationText: string;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  mapsUrl: string | null;
  logoUrl: string | null;
  updatedAt: Date;
}): CafeSettingsData {
  return {
    id: settings.id,
    cafeName: settings.cafeName,
    locationText: settings.locationText,
    whatsappUrl: normalizeOptionalUrl(settings.whatsappUrl),
    instagramUrl: normalizeOptionalUrl(settings.instagramUrl),
    mapsUrl: normalizeOptionalUrl(settings.mapsUrl),
    logoUrl: normalizeOptionalUrl(settings.logoUrl) ?? LOGO_PATH,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export async function getCafeSettingsForAdmin(): Promise<AdminCafeSettingsData> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      ...defaultCafeSettings,
      whatsappUrl: CONTACT.whatsapp,
      instagramUrl: CONTACT.instagram,
      mapsUrl: CONTACT.maps,
      error: "Database bağlantısı kurulamadı.",
    };
  }

  try {
    const settings = await prisma.cafeSettings.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!settings) {
      return defaultCafeSettings;
    }

    return toSettingsData(settings);
  } catch {
    return {
      ...defaultCafeSettings,
      error: "Kafe ayarları yüklenemedi.",
    };
  }
}

export async function getPublicCafeSettings(): Promise<CafeSettingsData> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return defaultCafeSettings;
  }

  try {
    const settings = await prisma.cafeSettings.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    return settings ? toSettingsData(settings) : defaultCafeSettings;
  } catch {
    return defaultCafeSettings;
  }
}

