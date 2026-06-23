import { getPrismaClient } from "@/lib/db";

export type AdminProductRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export type AdminDashboardData = {
  stats: {
    totalProducts: number;
    activeProducts: number;
    categoryCount: number;
    unavailableProducts: number;
  };
  recentProducts: Array<{
    id: string;
    name: string;
    categoryName: string;
    price: number;
  }>;
  error?: string;
};

const databaseError = "Database bağlantısı kurulamadı.";

export async function getAdminProductsPageData() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      products: [] as AdminProductRow[],
      categories: [] as AdminCategoryRow[],
      error: databaseError,
    };
  }

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    ]);

    const productRows = products.map((product) => ({
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
    }));

    return {
      products: productRows,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        productCount: category._count.products,
      })),
    };
  } catch {
    return {
      products: [] as AdminProductRow[],
      categories: [] as AdminCategoryRow[],
      error: "Ürün verileri yüklenemedi.",
    };
  }
}

export async function getAdminCategoriesPageData() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      categories: [] as AdminCategoryRow[],
      error: databaseError,
    };
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        productCount: category._count.products,
      })),
    };
  } catch {
    return {
      categories: [] as AdminCategoryRow[],
      error: "Kategori verileri yüklenemedi.",
    };
  }
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      stats: {
        totalProducts: 0,
        activeProducts: 0,
        categoryCount: 0,
        unavailableProducts: 0,
      },
      recentProducts: [],
      error: databaseError,
    };
  }

  try {
    const [
      totalProducts,
      activeProducts,
      categoryCount,
      unavailableProducts,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.product.count({ where: { isAvailable: false } }),
      prisma.product.findMany({
        take: 5,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      stats: {
        totalProducts,
        activeProducts,
        categoryCount,
        unavailableProducts,
      },
      recentProducts: recentProducts.map((product) => ({
        id: product.id,
        name: product.name,
        categoryName: product.category.name,
        price: product.price.toNumber(),
      })),
    };
  } catch {
    return {
      stats: {
        totalProducts: 0,
        activeProducts: 0,
        categoryCount: 0,
        unavailableProducts: 0,
      },
      recentProducts: [],
      error: "Dashboard verileri yüklenemedi.",
    };
  }
}
