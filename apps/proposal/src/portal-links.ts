import type { CompanyProfile, SavedProposal } from "./types";

/** Le portail est-il configuré (URL + numéro WhatsApp) ? */
export function portalReady(profile: CompanyProfile): boolean {
  return Boolean(profile.portalUrl?.trim() && profile.whatsappPhone?.trim());
}

function base(profile: CompanyProfile, view: string): URL | null {
  if (!portalReady(profile)) return null;
  const url = new URL(profile.portalUrl!.trim());
  url.searchParams.set("v", view);
  url.searchParams.set("org", profile.name);
  url.searchParams.set("to", profile.whatsappPhone!.trim());
  if (profile.accentColor) url.searchParams.set("accent", profile.accentColor.replace("#", ""));
  return url;
}

/** Lien public d'inscription des adhérents (à partager : bio, statut WhatsApp, flyer…). */
export function inscriptionLink(profile: CompanyProfile, types?: string[]): string | null {
  const url = base(profile, "inscription");
  if (!url) return null;
  if (types?.length) url.searchParams.set("types", types.join(","));
  return url.toString();
}

/** Lien public d'acceptation d'une proposition (1 tap → WhatsApp au prestataire). */
export function acceptLink(profile: CompanyProfile, p: SavedProposal): string | null {
  const url = base(profile, "accept");
  if (!url) return null;
  url.searchParams.set("num", p.number);
  if (p.title) url.searchParams.set("title", p.title);
  url.searchParams.set("amount", String(Math.round(p.total)));
  url.searchParams.set("cur", p.currency);
  if (p.validityDays) url.searchParams.set("days", String(p.validityDays));
  if (p.clientName) url.searchParams.set("client", p.clientName);
  return url.toString();
}
