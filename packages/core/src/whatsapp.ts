// Génération de liens WhatsApp préremplis + QR. Réutilisé par Catalog, CRM, Sales Assistant, Booking.
import QRCode from "qrcode";

/** Normalise un numéro en format international sans + ni espaces (ex: 221771234567). */
export function normalizePhone(raw: string, defaultCountry = "221"): string {
  let n = raw.replace(/[^\d+]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  else if (n.startsWith("00")) n = n.slice(2);
  else if (!n.startsWith(defaultCountry)) n = defaultCountry + n.replace(/^0+/, "");
  return n;
}

/** Construit un lien wa.me avec message prérempli. */
export function whatsappLink(phone: string, message = "", country?: string): string {
  const num = normalizePhone(phone, country);
  const base = `https://wa.me/${num}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Génère un QR code (data URL PNG) vers n'importe quelle URL/texte. */
export async function qrDataUrl(data: string, size = 512): Promise<string> {
  return QRCode.toDataURL(data, { width: size, margin: 1, errorCorrectionLevel: "M" });
}
