import type { CompanyProfile, SavedProposal } from "./types";
import type { LangCode } from "./i18n/translations";

const PORTAL_URL = "https://portal.lassi.tech/";

/** Le portail est-il configuré (numéro de téléphone présent) ? */
export function portalReady(profile: CompanyProfile): boolean {
  return Boolean(profile.phone?.trim() || profile.whatsappPhone?.trim());
}

function phoneFor(profile: CompanyProfile): string {
  return (profile.phone?.trim() || profile.whatsappPhone?.trim()) ?? "";
}

function base(profile: CompanyProfile, view: string, lang?: LangCode): URL | null {
  if (!portalReady(profile)) return null;
  const url = new URL(PORTAL_URL);
  url.searchParams.set("v", view);
  url.searchParams.set("org", profile.name);
  url.searchParams.set("to", phoneFor(profile));
  if (profile.accentColor) url.searchParams.set("accent", profile.accentColor.replace("#", ""));
  if (lang && lang !== "fr") url.searchParams.set("lang", lang);
  return url;
}

/** Lien public d'inscription des adhérents (à partager : bio, statut WhatsApp, flyer…). */
export function inscriptionLink(profile: CompanyProfile, types?: string[], lang?: LangCode): string | null {
  const url = base(profile, "inscription", lang);
  if (!url) return null;
  if (types?.length) url.searchParams.set("types", types.join(","));
  return url.toString();
}

/** Lien public d'acceptation d'une proposition (1 tap → WhatsApp au prestataire). */
export function acceptLink(profile: CompanyProfile, p: SavedProposal, lang?: LangCode): string | null {
  const url = base(profile, "accept", lang);
  if (!url) return null;
  url.searchParams.set("num", p.number);
  if (p.title) url.searchParams.set("title", p.title);
  url.searchParams.set("amount", String(Math.round(p.total)));
  url.searchParams.set("cur", p.currency);
  if (p.validityDays) url.searchParams.set("days", String(p.validityDays));
  if (p.clientName) url.searchParams.set("client", p.clientName);
  return url.toString();
}
