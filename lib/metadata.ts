import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = SITE.description,
  path = "",
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.name;
  const url = `${SITE.url}${path}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title ?? SITE.name,
      description,
      url,
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
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
      images: ["/logo.png"],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
