import { computeTotals, downloadDocumentPdf, type Totals } from "@atelier/core";
import type { SavedDocument } from "./types";

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
