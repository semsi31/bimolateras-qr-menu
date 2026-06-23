"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { uploadLogoToR2 } from "@/lib/r2";
import { LOGO_PATH } from "@/lib/constants";

export type SettingsActionResult = {
  ok: boolean;
  message: string;
};

export type LogoUploadActionResult =
  | {
      ok: true;
      message: string;
      url: string;
      key: string;
    }
  | {
      ok: false;
      message: string;
    };

function normalizeRequiredText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizeOptionalUrl(value: FormDataEntryValue | null) {
  const trimmed = String(value ?? "").trim();

  return trimmed ? trimmed : null;
}

function isExternalUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function isValidOptionalExternalUrl(value: string | null) {
  return !value || isExternalUrl(value);
}

function isValidLogoUrl(value: string) {
  return value.startsWith("/") || isExternalUrl(value);
}

function logActionError(actionName: string, error: unknown) {
  const errorInfo =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          ...(process.env.NODE_ENV === "development"
            ? { stack: error.stack }
            : {}),
        }
      : {
          name: "UnknownError",
          message: String(error),
        };

  console.error(`[${actionName}]`, errorInfo);
}

function logValidationError(actionName: string, details: Record<string, string>) {
  console.warn(`[${actionName}] validation failed`, details);
}

async function ensureAdminSession(actionName: string) {
  try {
    await requireAdminSession();

    return true;
  } catch (error) {
    logActionError(actionName, error);

    return false;
  }
}

function stripPreviewQuery(value: string) {
  try {
    const url = new URL(value);

    url.searchParams.delete("preview");
    url.searchParams.delete("v");

    return url.toString();
  } catch {
    const [path, query = ""] = value.split("?");

    if (!query) return value;

    const params = new URLSearchParams(query);
    params.delete("preview");
    params.delete("v");
    const nextQuery = params.toString();

    return nextQuery ? `${path}?${nextQuery}` : path;
  }
}

function normalizeLogoUrl(value: FormDataEntryValue | null) {
  const trimmed = normalizeRequiredText(value);

  return trimmed ? stripPreviewQuery(trimmed) : LOGO_PATH;
}

function revalidateSettingsViews() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
}

function getLogoUploadErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
  }

  if (
    error.message.includes("R2 env eksik") ||
    error.message.includes("R2_")
  ) {
    return "Görsel yükleme ayarları eksik. Lütfen teknik destek ile iletişime geçin.";
  }

  if (
    error.message.includes("Boş dosya") ||
    error.message.includes("en fazla") ||
    error.message.includes("Sadece JPG")
  ) {
    return error.message;
  }

  return "Görsel yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.";
}

export async function updateCafeSettingsAction(
  formData: FormData
): Promise<SettingsActionResult> {
  const actionName = "updateCafeSettingsAction";
  const hasSession = await ensureAdminSession(actionName);

  if (!hasSession) {
    return {
      ok: false,
      message: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
    };
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const cafeName = normalizeRequiredText(formData.get("cafeName"));
  const locationText = normalizeRequiredText(formData.get("locationText"));
  const whatsappUrl = normalizeOptionalUrl(formData.get("whatsappUrl"));
  const instagramUrl = normalizeOptionalUrl(formData.get("instagramUrl"));
  const mapsUrl = normalizeOptionalUrl(formData.get("mapsUrl"));
  const logoUrl = normalizeLogoUrl(formData.get("logoUrl"));

  if (!cafeName) {
    logValidationError(actionName, { cafeName: "empty" });
    return { ok: false, message: "Kafe adı boş olamaz." };
  }

  if (!locationText) {
    logValidationError(actionName, { locationText: "empty" });
    return { ok: false, message: "Konum metni boş olamaz." };
  }

  if (
    !isValidOptionalExternalUrl(whatsappUrl) ||
    !isValidOptionalExternalUrl(instagramUrl) ||
    !isValidOptionalExternalUrl(mapsUrl)
  ) {
    logValidationError(actionName, {
      contactUrls: "Contact URL alanları http:// veya https:// ile başlamalı.",
    });
    return {
      ok: false,
      message: "Link alanları http:// veya https:// ile başlamalı.",
    };
  }

  if (logoUrl.startsWith("blob:") || logoUrl.startsWith("data:")) {
    logValidationError(actionName, {
      logoUrl: "blob/data URL cannot be persisted",
    });
    return {
      ok: false,
      message: "Yeni logoyu kullanmak için önce logoyu yükleyin.",
    };
  }

  if (!isValidLogoUrl(logoUrl)) {
    logValidationError(actionName, {
      logoUrl: "Logo URL /, http:// veya https:// ile başlamalı.",
    });
    return {
      ok: false,
      message: "Logo bağlantısı geçersiz. Lütfen logoyu tekrar yükleyin.",
    };
  }

  try {
    const existingSettings = await prisma.cafeSettings.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

    const data = {
      cafeName,
      locationText,
      whatsappUrl,
      instagramUrl,
      mapsUrl,
      logoUrl,
    };

    const savedSettings = existingSettings
      ? await prisma.cafeSettings.update({
          where: {
            id: existingSettings.id,
          },
          data,
          select: {
            id: true,
          },
        })
      : await prisma.cafeSettings.create({
          data,
          select: {
            id: true,
          },
        });

    await prisma.cafeSettings.deleteMany({
      where: {
        id: {
          not: savedSettings.id,
        },
      },
    });

    revalidateSettingsViews();

    return { ok: true, message: "Kafe ayarları kaydedildi." };
  } catch (error) {
    logActionError(actionName, error);

    return {
      ok: false,
      message: "Database ayar kaydı güncellenemedi.",
    };
  }
}

export async function uploadLogoAction(
  formData: FormData
): Promise<LogoUploadActionResult> {
  const actionName = "uploadLogoAction";
  const hasSession = await ensureAdminSession(actionName);

  if (!hasSession) {
    return {
      ok: false,
      message: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    logValidationError(actionName, { file: "missing" });
    return { ok: false, message: "Yüklenecek logo bulunamadı." };
  }

  try {
    const result = await uploadLogoToR2(file);

    return {
      ok: true,
      message: "Logo yüklendi.",
      url: result.url,
      key: result.key,
    };
  } catch (error) {
    logActionError(actionName, error);

    return {
      ok: false,
      message: getLogoUploadErrorMessage(error),
    };
  }
}

