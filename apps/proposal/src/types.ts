import type { Currency, LineItem, ProposalSection, ProposalTier } from "@atelier/core";

/** Profil du prestataire (ligne unique id=1). Réutilisé en en-tête de chaque proposition. */
export interface CompanyProfile {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logoDataUrl?: string;
  accentColor: string;
  notes?: string;
  /** Numéro WhatsApp recevant inscriptions / acceptations depuis le portail public. */
  whatsappPhone?: string;
  /** URL du portail public hébergé (ex. https://mon-portail.pages.dev). */
  portalUrl?: string;
}

export interface Client {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: number;
}

/** Compteur séquentiel par année, clé = `Proposition-${year}`. */
export interface Counter {
  key: string;
  value: number;
}

/** Adhérent / abonné (module suivi des cotisations). */
export interface Member {
  id?: number;
  matricule: string;
  name: string;
  email?: string;
  city?: string;
  /** Type d'adhésion (Mensuel / Trimestriel / Annuel / libre). */
  type: string;
  /** Date d'échéance au format YYYY-MM-DD. */
  expiresAt?: string;
  /** Cotisation réglée. */
  paid: boolean;
  createdAt: number;
}

export type ProposalStatus = "Brouillon" | "Envoyée" | "Acceptée" | "Refusée";

/** Proposition persistée (snapshot complet, rejouable). */
export interface SavedProposal {
  id?: number;
  number: string;
  title: string;
  clientId?: number;
  clientName: string;
  fromName: string;
  currency: Currency;
  /** Sections narratives : problème / solution / livrables / planning / CGV… */
  sections: ProposalSection[];
  /** Tableau investissement. */
  services: LineItem[];
  /** Paliers optionnels (Essentiel / Pro / Premium). Vide = pas de formules. */
  tiers: ProposalTier[];
  taxRate: number;
  discountRate: number;
  /** Acompte à la signature (%). */
  depositRate: number;
  /** Validité de l'offre (jours). */
  validityDays: number;
  status: ProposalStatus;
  total: number;
  date: string;
  createdAt: number;
  /** Acceptation en ligne : nom du signataire + horodatage. */
  acceptedName?: string;
  acceptedAt?: number;
}
