import { buildCatalogPdf, qrDataUrl, whatsappLink } from "@atelier/core";
import { db } from "./db";
import type { ShopProfile } from "./types";

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
