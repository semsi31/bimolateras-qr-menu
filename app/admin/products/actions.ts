"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth";
import type { AdminProductRow } from "@/lib/admin-data";
import { getPrismaClient } from "@/lib/db";
import { uploadProductImageToR2 } from "@/lib/r2";
import { slugify } from "@/lib/slug";
import { validateProductForm } from "@/lib/validators";

export type AdminActionResult = {
  ok: boolean;
  message: string;
  product?: AdminProductRow;
};

export type ProductImageUploadActionResult =
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

async function getUniqueProductSlug(name: string, excludeId?: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return slugify(name);
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let index = 2;

  while (
    await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

function revalidateAdminProductViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
}

function toAdminProductRow(product: {
  id: string;
  categoryId: string;
  category: {
    name: string;
  };
  name: string;
  slug: string;
  description: string | null;
  price: {
    toNumber: () => number;
  };
  imageUrl: string | null;
  isActive: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  updatedAt: Date;
}): AdminProductRow {
  return {
    id: product.id,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: product.price.toNumber(),
    imageUrl: product.imageUrl ?? "",
    isActive: product.isActive,
    isAvailable: product.isAvailable,
    isPopular: product.isPopular,
    isNew: product.isNew,
    sortOrder: product.sortOrder,
    updatedAt: product.updatedAt.toISOString(),
  };
}

function getProductImageUploadErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
  }

  if (
    error.message.includes("R2 env eksik") ||
    error.message.includes("R2_")
  ) {
    console.error("[uploadProductImageAction]", {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    });

    return "Görsel yükleme ayarları eksik. Lütfen teknik destek ile iletişime geçin.";
  }

  if (
    error.message.includes("Boş dosya") ||
    error.message.includes("en fazla") ||
    error.message.includes("Sadece JPG")
  ) {
    return error.message;
  }

  console.error("[uploadProductImageAction]", {
    name: error.name,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  });

  return "Görsel yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.";
}

export async function createProductAction(
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const parsed = validateProductForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const category = await prisma.category.findUnique({
    where: {
      id: parsed.data.categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return { ok: false, message: "Seçilen kategori bulunamadı." };
  }

  const createdProduct = await prisma.product.create({
    data: {
      ...parsed.data,
      slug: await getUniqueProductSlug(parsed.data.name),
    },
    include: {
      category: true,
    },
  });

  revalidateAdminProductViews();
  return {
    ok: true,
    message: "Ürün eklendi.",
    product: toAdminProductRow(createdProduct),
  };
}

export async function updateProductAction(
  productId: string,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const parsed = validateProductForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      imageUrl: true,
    },
  });

  if (!existingProduct) {
    return { ok: false, message: "Ürün bulunamadı." };
  }

  const nextImageUrl =
    parsed.data.imageUrl && parsed.data.imageUrl.trim().length > 0
      ? parsed.data.imageUrl
      : existingProduct.imageUrl;

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...parsed.data,
      imageUrl: nextImageUrl,
      slug: await getUniqueProductSlug(parsed.data.name, productId),
    },
    include: {
      category: true,
    },
  });

  revalidateAdminProductViews();
  return {
    ok: true,
    message: "Ürün güncellendi.",
    product: toAdminProductRow(updatedProduct),
  };
}

export async function deleteProductAction(
  productId: string
): Promise<AdminActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  revalidateAdminProductViews();
  return { ok: true, message: "Ürün silindi." };
}

export async function toggleProductFieldAction(
  productId: string,
  field: "isActive" | "isAvailable" | "isPopular" | "isNew",
  value: boolean
): Promise<AdminActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      [field]: value,
    },
  });

  revalidateAdminProductViews();
  return { ok: true, message: "Ürün durumu güncellendi." };
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<ProductImageUploadActionResult> {
  await requireAdminSession();

  const file = formData.get("file");
  const productName = String(formData.get("productName") ?? "").trim();

  if (!(file instanceof File)) {
    return { ok: false, message: "Yüklenecek görsel bulunamadı." };
  }

  try {
    const result = await uploadProductImageToR2(file, productName);

    return {
      ok: true,
      message: "Görsel yüklendi.",
      url: result.url,
      key: result.key,
    };
  } catch (error) {
    return {
      ok: false,
      message: getProductImageUploadErrorMessage(error),
    };
  }
}
