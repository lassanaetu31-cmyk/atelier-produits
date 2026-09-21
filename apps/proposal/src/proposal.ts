import { computeTotals, downloadProposalPdf, formatMoney, whatsappLink, type Totals } from "@atelier/core";
import { db } from "./db";
import type { CompanyProfile, ProposalStatus, SavedProposal } from "./types";

/**
 * Numéro séquentiel atomique par année : ex. PROP-2026-0001.
 * La transaction rw garantit l'unicité même en cas d'appels concurrents.
 */
export async function nextNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `Proposition-${year}`;
  let value = 1;
  await db.transaction("rw", db.counters, async () => {
    const row = await db.counters.get(key);
    value = (row?.value ?? 0) + 1;
    await db.counters.put({ key, value });
  });
  return `PROP-${year}-${String(value).padStart(4, "0")}`;
}

export function totalsOf(
  p: Pick<SavedProposal, "services" | "taxRate" | "discountRate">,
): Totals {
  return computeTotals(p.services, { taxRate: p.taxRate, discountRate: p.discountRate });
}

/** Régénère et télécharge le PDF d'une proposition. Identité émetteur = profil. */
export function downloadPdf(p: SavedProposal, profile: CompanyProfile): void {
  downloadProposalPdf({
    number: p.number,
    title: p.title,
    date: p.date,
    validityDays: p.validityDays,
    currency: p.currency,
    logoDataUrl: profile.logoDataUrl,
    accentColor: profile.accentColor,
    from: {
      name: p.fromName || profile.name,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
    },
    to: { name: p.clientName },
    sections: p.sections,
    tiers: p.tiers,
    items: p.services,
    totals: totalsOf(p),
    depositRate: p.depositRate,
    notes: profile.notes,
    acceptedName: p.acceptedName,
    acceptedDate: p.acceptedAt ? new Date(p.acceptedAt).toLocaleDateString("fr-FR") : undefined,
  });
}

/**
 * Lien WhatsApp prérempli pour envoyer la proposition à un client.
 * Si `acceptUrl` est fourni (portail public configuré), ajoute le lien d'acceptation 1-clic.
 */
export function proposalWhatsappLink(p: SavedProposal, phone: string, acceptUrl?: string | null): string {
  const msg =
    `Bonjour ${p.clientName || ""},\n\n` +
    `Voici ma proposition « ${p.title || "commerciale"} » (réf. ${p.number}).\n` +
    `Montant : ${formatMoney(p.total, p.currency)}.` +
    (p.validityDays ? ` Offre valable ${p.validityDays} jours.` : "") +
    (acceptUrl ? `\n\nPour accepter en 1 clic : ${acceptUrl}` : "") +
    `\n\nJe reste disponible pour en discuter. Merci !`;
  return whatsappLink(phone, msg);
}

/** Met à jour le statut d'une proposition persistée. */
export async function setStatus(p: SavedProposal, status: ProposalStatus): Promise<void> {
  if (p.id) await db.proposals.update(p.id, { status });
}

/** Marque une proposition comme acceptée (signature en ligne : nom + horodatage). */
export async function accept(p: SavedProposal, name: string): Promise<SavedProposal> {
  const acceptedName = name.trim();
  const acceptedAt = Date.now();
  const updated: SavedProposal = { ...p, status: "Acceptée", acceptedName, acceptedAt };
  if (p.id) {
    await db.proposals.update(p.id, { status: "Acceptée", acceptedName, acceptedAt });
  }
  return updated;
}
