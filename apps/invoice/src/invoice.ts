import { computeTotals, downloadDocumentPdf, type Totals } from "@atelier/core";
import { db } from "./db";
import type { CompanyProfile, DocKind, SavedDocument } from "./types";

const PREFIX: Record<DocKind, string> = {
  Facture: "F",
  Devis: "D",
  "Reçu": "R",
  Proposition: "P",
};

/**
 * Numéro séquentiel atomique par type et par année : ex. F-2026-0001.
 * La transaction rw garantit l'unicité même en cas d'appels concurrents.
 */
export async function nextNumber(kind: DocKind): Promise<string> {
  const year = new Date().getFullYear();
  const key = `${kind}-${year}`;
  let value = 1;
  await db.transaction("rw", db.counters, async () => {
    const row = await db.counters.get(key);
    value = (row?.value ?? 0) + 1;
    await db.counters.put({ key, value });
  });
  return `${PREFIX[kind]}-${year}-${String(value).padStart(4, "0")}`;
}

/** Crée une facture à partir d'un devis, la persiste, et marque le devis comme converti. */
export async function convertToInvoice(devis: SavedDocument): Promise<SavedDocument> {
  const invoice: SavedDocument = {
    ...devis,
    id: undefined,
    kind: "Facture",
    number: await nextNumber("Facture"),
    date: new Date().toLocaleDateString("fr-FR"),
    createdAt: Date.now(),
    sourceId: devis.id,
    convertedToId: undefined,
  };
  const id = await db.documents.add(invoice);
  invoice.id = id;
  if (devis.id) await db.documents.update(devis.id, { convertedToId: id });
  return invoice;
}

export function totalsOf(doc: Pick<SavedDocument, "items" | "taxRate" | "discountRate" | "shipping">): Totals {
  return computeTotals(doc.items, {
    taxRate: doc.taxRate,
    discountRate: doc.discountRate,
    shipping: doc.shipping,
  });
}

/** Régénère et télécharge le PDF d'un document. Identité émetteur = profil entreprise. */
export function downloadPdf(doc: SavedDocument, profile: CompanyProfile): void {
  downloadDocumentPdf({
    kind: doc.kind,
    number: doc.number,
    date: doc.date,
    currency: doc.currency,
    logoDataUrl: profile.logoDataUrl,
    accentColor: profile.accentColor,
    notes: profile.notes,
    from: {
      name: doc.fromName || profile.name,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
    },
    to: { name: doc.clientName },
    items: doc.items,
    totals: totalsOf(doc),
  });
}
