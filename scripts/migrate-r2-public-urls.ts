import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";

const OLD_R2_BASE = "https://pub-4c07a5cc64524d38858a923ee88f6d74.r2.dev";
const newR2BaseValue = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
const databaseUrl = process.env.DATABASE_URL;

if (!newR2BaseValue) {
  throw new Error("R2_PUBLIC_BASE_URL is required");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const NEW_R2_BASE = newR2BaseValue;

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

function stripQuery(url: string) {
  return url.split("?")[0];
}

function migrateUrl(url: string | null | undefined) {
  if (!url) {
    return url;
  }

  const cleanUrl = stripQuery(url.trim());

  if (!cleanUrl || cleanUrl.startsWith("blob:") || cleanUrl.startsWith("data:")) {
    return url;
  }

  if (!cleanUrl.startsWith(OLD_R2_BASE)) {
    return cleanUrl;
  }

  return cleanUrl.replace(OLD_R2_BASE, NEW_R2_BASE);
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      imageUrl: true,
    },
  });

  let productsUpdated = 0;

  for (const product of products) {
    const migratedImageUrl = migrateUrl(product.imageUrl);

    if (migratedImageUrl !== product.imageUrl) {
      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          imageUrl: migratedImageUrl,
        },
      });

      productsUpdated += 1;
    }
  }

  const settingsRows = await prisma.cafeSettings.findMany({
    select: {
      id: true,
      logoUrl: true,
    },
  });

  let logoUpdated = false;

  for (const settings of settingsRows) {
    const migratedLogoUrl = migrateUrl(settings.logoUrl);

    if (migratedLogoUrl !== settings.logoUrl) {
      await prisma.cafeSettings.update({
        where: {
          id: settings.id,
        },
        data: {
          logoUrl: migratedLogoUrl,
        },
      });

      logoUpdated = true;
    }
  }

  const remainingOldProductImages = await prisma.product.count({
    where: {
      imageUrl: {
        startsWith: OLD_R2_BASE,
      },
    },
  });
  const remainingOldLogos = await prisma.cafeSettings.count({
    where: {
      logoUrl: {
        startsWith: OLD_R2_BASE,
      },
    },
  });

  console.log(`Products checked: ${products.length}`);
  console.log(`Products updated: ${productsUpdated}`);
  console.log(`CafeSettings logo updated: ${logoUpdated ? "yes" : "no"}`);
  console.log(`Remaining old product images: ${remainingOldProductImages}`);
  console.log(`Remaining old logos: ${remainingOldLogos}`);
  console.log(`Old base: ${OLD_R2_BASE}`);
  console.log(`New base: ${NEW_R2_BASE}`);
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
