"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { validateCategoryForm } from "@/lib/validators";

export type CategoryActionResult = {
  ok: boolean;
  message: string;
};

async function getUniqueCategorySlug(name: string, excludeId?: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return slugify(name);
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let index = 2;

  while (
    await prisma.category.findFirst({
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

function revalidateCategoryViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/menu");
}

export async function createCategoryAction(
  formData: FormData
): Promise<CategoryActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const parsed = validateCategoryForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  await prisma.category.create({
    data: {
      ...parsed.data,
      slug: await getUniqueCategorySlug(parsed.data.name),
    },
  });

  revalidateCategoryViews();
  return { ok: true, message: "Kategori eklendi." };
}

export async function updateCategoryAction(
  categoryId: string,
  formData: FormData
): Promise<CategoryActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const parsed = validateCategoryForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...parsed.data,
      slug: await getUniqueCategorySlug(parsed.data.name, categoryId),
    },
  });

  revalidateCategoryViews();
  return { ok: true, message: "Kategori güncellendi." };
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<CategoryActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  const productCount = await prisma.product.count({
    where: {
      categoryId,
    },
  });

  if (productCount > 0) {
    return {
      ok: false,
      message:
        "Bu kategoride ürün var. Silmeden önce ürünleri başka kategoriye taşıyın veya silin.",
    };
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  revalidateCategoryViews();
  return { ok: true, message: "Kategori silindi." };
}

export async function toggleCategoryActiveAction(
  categoryId: string,
  isActive: boolean
): Promise<CategoryActionResult> {
  await requireAdminSession();
  const prisma = getPrismaClient();

  if (!prisma) {
    return { ok: false, message: "Database bağlantısı bulunamadı." };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isActive,
    },
  });

  revalidateCategoryViews();
  return { ok: true, message: "Kategori durumu güncellendi." };
}
