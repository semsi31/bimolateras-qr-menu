import { LandingPageClient } from "@/components/public/LandingPageClient";
import { getPublicCafeSettings } from "@/lib/settings-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getPublicCafeSettings();

  return <LandingPageClient settings={settings} />;
}
