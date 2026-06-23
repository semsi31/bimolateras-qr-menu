/**
 * Site-wide constants for Bİ'MOLA TERAS CAFE.
 * Contact URLs will be managed via SiteSettings in a later phase.
 */

export const SITE = {
  name: "Bİ'MOLA TERAS CAFE",
  shortName: "Bİ'MOLA TERAS",
  description:
    "Hatay Yayladağı Bİ'MOLA TERAS CAFE dijital menüsü. Kahveler, içecekler, tatlılar ve aperatifler.",
  tagline: "Yayladağı'nda kahvenin en keyifli molası.",
  location: "Hatay / Yayladağı",
  url: "https://bimolateras.com",
} as const;

export const CONTACT = {
  instagram: "https://instagram.com/bimolateras",
  whatsapp: "https://wa.me/905000000000",
  maps: "https://maps.google.com/?q=Bimola+Teras+Yayladagi",
} as const;

/** Cloudflare R2 public base URL for product images (direct load, no Vercel proxy). */
export const IMAGE_CDN_BASE = "https://images.bimolateras.com";

export const LOGO_PATH = "/logo.png";
