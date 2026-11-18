// Site-wide configuration for BEYOND.

/**
 * TODO: replace with the real BEYOND WhatsApp Business number.
 * International format, digits only, no "+" or spaces (e.g. India: 91XXXXXXXXXX).
 */
export const WHATSAPP_NUMBER = "910000000000";

export const EDITION_SIZE = 300;


/** Canonical URL. Set NEXT_PUBLIC_SITE_URL once beyondwatches.in is live; falls back to the Vercel production URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://beyondwatches.vercel.app");

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const padNo = (n: number) => String(n).padStart(3, "0");
