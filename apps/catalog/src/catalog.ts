import { buildCatalogPdf, formatMoney, qrDataUrl, whatsappLink } from "@atelier/core";
import { db } from "./db";
import { DEFAULT_PROFILE } from "./profile";
import type { Product, ShopProfile } from "./types";

/** Message de commande d'un produit à partir du modèle du profil. */
export function orderMessage(profile: ShopProfile, product: Product): string {
  const tmpl = profile.orderTemplate || DEFAULT_PROFILE.orderTemplate!;
  return tmpl
    .replace(/\{produit\}/g, product.name)
    .replace(/\{prix\}/g, formatMoney(product.price, profile.currency));
}

/** Lien WhatsApp prérempli pour commander un produit (vide si pas de numéro). */
export function productWaLink(profile: ShopProfile, product: Product): string {
  if (!profile.whatsappPhone) return "";
  return whatsappLink(profile.whatsappPhone, orderMessage(profile, product));
}

/** Génère et télécharge le QR code de commande d'un produit (PNG). */
export async function downloadProductQr(profile: ShopProfile, product: Product): Promise<void> {
  const link = productWaLink(profile, product);
  if (!link) return;
  const data = await qrDataUrl(link, 512);
  const slug = product.name.trim().replace(/\s+/g, "-").toLowerCase() || "produit";
  const a = document.createElement("a");
  a.href = data;
  a.download = `qr-${slug}.png`;
  a.click();
}

/** Génère et télécharge le catalogue PDF de tous les produits. Retourne le nb de produits. */
export async function downloadCatalogPdf(profile: ShopProfile): Promise<number> {
  const products = await db.products.orderBy("createdAt").toArray();
  const qr = profile.whatsappPhone
    ? await qrDataUrl(whatsappLink(profile.whatsappPhone, ""))
    : undefined;

  const doc = buildCatalogPdf(
    {
      name: profile.name,
      logoDataUrl: profile.logoDataUrl,
      accentColor: profile.accentColor,
      address: profile.address,
      whatsappPhone: profile.whatsappPhone,
      currency: profile.currency,
    },
    products.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      available: p.available,
      imageDataUrl: p.imageDataUrl,
    })),
    qr,
  );

  const slug = profile.name.trim().replace(/\s+/g, "-").toLowerCase() || "boutique";
  doc.save(`catalogue-${slug}.pdf`);
  return products.length;
}
