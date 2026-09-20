import type { Currency } from "@atelier/core";

/** Profil de la boutique (ligne unique id=1). */
export interface ShopProfile {
  id?: number;
  name: string;
  address?: string;
  whatsappPhone?: string;
  /** Modèle de message de commande WhatsApp. {produit} et {prix} sont remplacés. */
  orderTemplate?: string;
  logoDataUrl?: string;
  accentColor: string;
  currency: Currency;
  notes?: string;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  reference?: string;
  available: boolean;
  imageDataUrl?: string;
  createdAt: number;
}
