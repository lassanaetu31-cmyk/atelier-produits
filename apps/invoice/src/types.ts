import type { Currency, LineItem } from "@atelier/core";

export interface Client {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: number;
}

export type DocKind = "Facture" | "Devis" | "Reçu" | "Proposition";

/** Document persisté dans l'historique (snapshot complet, rejouable). */
export interface SavedDocument {
  id?: number;
  number: string;
  kind: DocKind;
  clientId?: number;
  clientName: string;
  fromName: string;
  currency: Currency;
  items: LineItem[];
  taxRate: number;
  discountRate: number;
  shipping: number;
  total: number;
  date: string;
  createdAt: number;
  /** Si ce document est une facture issue d'un devis : id du devis source. */
  sourceId?: number;
  /** Si ce devis a été converti : id de la facture générée. */
  convertedToId?: number;
}
