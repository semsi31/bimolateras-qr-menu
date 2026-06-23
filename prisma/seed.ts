import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { CONTACT, LOGO_PATH, SITE } from "../lib/constants";
import { PrismaClient } from "../lib/generated/prisma/client";
import { adminCategories, menuProducts } from "../lib/mock-menu";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });
const demoAdminEmail = process.env.ADMIN_EMAIL ?? "admin@bimolateras.com";
const demoAdminPassword = process.env.ADMIN_PASSWORD ?? "Bimola2026!";

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cafeSettings.deleteMany();

  const categoryIdBySlug = new Map<string, string>();

  for (const category of adminCategories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.id,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });

    categoryIdBySlug.set(category.id, createdCategory.id);
  }

  for (const product of menuProducts) {
    const categoryId = categoryIdBySlug.get(product.categoryId);

    if (!categoryId) {
      continue;
    }

    await prisma.product.create({
      data: {
        categoryId,
        name: product.name,
        slug: product.id,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        isActive: product.isActive ?? true,
        isAvailable: product.isAvailable,
        isPopular: product.isPopular,
        isNew: product.isNew,
        sortOrder: product.sortOrder,
      },
    });
  }

  await prisma.cafeSettings.create({
    data: {
      cafeName: SITE.name,
      locationText: SITE.location,
      whatsappUrl: CONTACT.whatsapp,
      instagramUrl: CONTACT.instagram,
      mapsUrl: CONTACT.maps,
      logoUrl: LOGO_PATH,
    },
  });

  const passwordHash = await bcrypt.hash(demoAdminPassword, 12);

  await prisma.adminUser.upsert({
    where: {
      email: demoAdminEmail,
    },
    update: {
      name: "Bİ'MOLA TERAS Admin",
      passwordHash,
    },
    create: {
      email: demoAdminEmail,
      name: "Bİ'MOLA TERAS Admin",
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
