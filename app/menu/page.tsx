import type { Metadata } from "next";

import { MenuExperience } from "@/components/public/menu/MenuExperience";
import { SITE } from "@/lib/constants";
import { getPublicMenuData } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: {
    absolute: "Bİ'MOLA TERAS CAFE | QR Menü",
  },
  description: "Hatay Yayladağı Bİ'MOLA TERAS CAFE dijital QR menüsü.",
  alternates: {
    canonical: `${SITE.url}/menu`,
  },
  openGraph: {
    title: "Bİ'MOLA TERAS CAFE | QR Menü",
    description: "Hatay Yayladağı Bİ'MOLA TERAS CAFE dijital QR menüsü.",
    url: `${SITE.url}/menu`,
    siteName: SITE.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuPage() {
  const menuData = await getPublicMenuData();

  return (
    <MenuExperience
      categories={menuData.categories}
      products={menuData.products}
      settings={menuData.settings}
    />
  );
}
