import { IMAGE_CDN_BASE } from "@/lib/constants";
import { getPrismaClient } from "@/lib/db";
import {
  menuCategories,
  menuProducts,
  type MenuCategory,
  type MenuProduct,
} from "@/lib/mock-menu";
import {
  getPublicCafeSettings,
  type CafeSettingsData,
} from "@/lib/settings-data";

export type PublicMenuData = {
  categories: MenuCategory[];
  products: MenuProduct[];
  settings: CafeSettingsData;
  source: "database" | "mock";
};

const featuredCategory: MenuCategory = {
  id: "featured",
  name: "Öne Çıkanlar",
  description: "Bİ'MOLA misafirlerinin en sevdiği lezzetler.",
  sortOrder: 0,
  featuredOnly: true,
};

const fallbackImageUrl = `${IMAGE_CDN_BASE}/products/placeholder.webp`;

function getMockMenuData(): PublicMenuData {
  const activeProducts = menuProducts
    .filter((product) => product.isActive ?? true)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  return {
    categories: [...menuCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    products: activeProducts,
    settings: {
      cafeName: "Bİ'MOLA TERAS CAFE",
      locationText: "Hatay / Yayladağı",
      whatsappUrl: null,
      instagramUrl: null,
      mapsUrl: null,
      logoUrl: "/logo.png",
    },
    source: "mock",
  };
}

export async function getActiveCategories(): Promise<MenuCategory[]> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return menuCategories;
  }

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return categories.map((category) => ({
    id: category.slug,
    name: category.name,
    description: category.description ?? "",
    sortOrder: category.sortOrder,
  }));
}

export async function getActiveProducts(): Promise<MenuProduct[]> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return menuProducts;
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
      },
    },
    include: {
      category: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return products.map((product) => ({
    id: product.slug,
    categoryId: product.category.slug,
    name: product.name,
    description: product.description ?? "",
    price: product.price.toNumber(),
    imageUrl: product.imageUrl ?? fallbackImageUrl,
    updatedAt: product.updatedAt.toISOString(),
    isActive: product.isActive,
    isAvailable: product.isAvailable,
    isPopular: product.isPopular,
    isNew: product.isNew,
    sortOrder: product.sortOrder,
  }));
}

export async function getPublicMenuData(): Promise<PublicMenuData> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return getMockMenuData();
  }

  try {
    const [settings, categories, products] = await Promise.all([
      getPublicCafeSettings(),
      getActiveCategories(),
      getActiveProducts(),
    ]);

    const hasFeaturedProducts = products.some(
      (product) => product.isPopular === true
    );

    return {
      settings,
      categories: hasFeaturedProducts
        ? [featuredCategory, ...categories]
        : categories,
      products,
      source: "database",
    };
  } catch (error) {
    console.error("Failed to load menu data from database.", error);
    return getMockMenuData();
  }
}
