import { computeTotals, downloadDocumentPdf, type Totals } from "@atelier/core";
import { db } from "./db";
import type { DocKind, SavedDocument } from "./types";

const PREFIX: Record<DocKind, string> = {
  Facture: "F",
  Devis: "D",
  "Reçu": "R",
  Proposition: "P",
};

/** Numéro provisoire par préfixe (numérotation séquentielle propre = point 4). */
export function makeNumber(kind: DocKind): string {
  return `${PREFIX[kind]}-${Date.now().toString().slice(-6)}`;
}

/** Crée une facture à partir d'un devis, la persiste, et marque le devis comme converti. */
export async function convertToInvoice(devis: SavedDocument): Promise<SavedDocument> {
  const invoice: SavedDocument = {
    ...devis,
    id: undefined,
    kind: "Facture",
    number: makeNumber("Facture"),
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

/** Régénère et télécharge le PDF d'un document sauvegardé (réutilisé par éditeur + historique). */
export function downloadPdf(doc: SavedDocument): void {
  downloadDocumentPdf({
    kind: doc.kind,
    number: doc.number,
    date: doc.date,
    currency: doc.currency,
    from: { name: doc.fromName },
    to: { name: doc.clientName },
    items: doc.items,
    totals: totalsOf(doc),
  });
}
