// Formatage monétaire + calculs commerciaux réutilisés par toutes les apps.

export type Currency = "XOF" | "USD" | "EUR";

const LOCALES: Record<Currency, string> = {
  XOF: "fr-FR",
  USD: "en-US",
  EUR: "fr-FR",
};

/** Formate un montant. XOF sans décimales (FCFA), USD/EUR avec 2 décimales. */
export function formatMoney(amount: number, currency: Currency = "XOF"): string {
  const digits = currency === "XOF" ? 0 : 2;
  const value = new Intl.NumberFormat(LOCALES[currency], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(amount);
  return currency === "XOF" ? `${value} FCFA` : `${value} ${currency}`;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface TotalsOptions {
  /** Remise en pourcentage (0-100). */
  discountRate?: number;
  /** Taux de taxe/TVA en pourcentage (0-100). */
  taxRate?: number;
  /** Frais de livraison (montant fixe). */
  shipping?: number;
}

/** Calcule les totaux d'un document (facture, devis, proposition). */
export function computeTotals(items: LineItem[], opts: TotalsOptions = {}): Totals {
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const discount = subtotal * ((opts.discountRate ?? 0) / 100);
  const taxable = subtotal - discount;
  const tax = taxable * ((opts.taxRate ?? 0) / 100);
  const shipping = opts.shipping ?? 0;
  const total = taxable + tax + shipping;
  return { subtotal, discount, taxable, tax, shipping, total };
}

/** Marge et bénéfice à partir d'un prix d'achat/vente (module Inventory). */
export function computeMargin(buyPrice: number, sellPrice: number, quantity = 1) {
  const profitUnit = sellPrice - buyPrice;
  const marginRate = sellPrice > 0 ? (profitUnit / sellPrice) * 100 : 0;
  return {
    profitUnit,
    profitTotal: profitUnit * quantity,
    marginRate,
    stockValue: buyPrice * quantity,
  };
}
