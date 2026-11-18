// Site-wide configuration for BEYOND.

/**
 * TODO: replace with the real BEYOND WhatsApp Business number.
 * International format, digits only, no "+" or spaces (e.g. India: 91XXXXXXXXXX).
 */
export const WHATSAPP_NUMBER = "910000000000";

export const EDITION_SIZE = 300;


export const SITE_URL = "https://beyondwatches.in";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const padNo = (n: number) => String(n).padStart(3, "0");
