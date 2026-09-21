import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { b64urlEncode } from "./codec";
import { portalReady } from "./portal-links";
import type { CompanyProfile, FormConfig } from "./types";

export const DEFAULT_FORM: FormConfig = {
  id: 1,
  title: "Fiche de renseignement & de contact",
  subtitle: "",
  interests: [
    "Découvrir vos services / produits",
    "Demande de devis / projet",
    "Partenariat / collaboration",
    "Recevoir des informations",
  ],
  recontact: [
    "Je souhaite recevoir des informations sur vos offres.",
    "Je souhaite être recontacté(e) pour un projet.",
    "Je souhaite être informé(e) de vos événements.",
  ],
  askStructure: true,
  consentText:
    "J'accepte que mes coordonnées soient utilisées uniquement afin d'être recontacté(e) dans le cadre des informations et propositions présentées.",
};

/** Config du formulaire (live). Défaut tant qu'aucune config n'est enregistrée. */
export function useFormConfig(): FormConfig {
  return useLiveQuery(() => db.forms.get(1), [], undefined) ?? DEFAULT_FORM;
}

export async function saveFormConfig(cfg: FormConfig): Promise<void> {
  await db.forms.put({ ...cfg, id: 1 });
}

/** Lien public du formulaire en ligne (à partager). Embarque la config + le retour dashboard. */
export function ficheLink(profile: CompanyProfile, cfg: FormConfig): string | null {
  if (!portalReady(profile)) return null;
  const url = new URL(profile.portalUrl!.trim());
  url.searchParams.set("v", "fiche");
  url.searchParams.set("org", profile.name);
  url.searchParams.set("to", profile.whatsappPhone!.trim());
  if (profile.accentColor) url.searchParams.set("accent", profile.accentColor.replace("#", ""));
  url.searchParams.set("cfg", b64urlEncode(cfg));
  // Lien de réception : n'a de sens que si l'app opérateur tourne sur le web (https).
  if (typeof location !== "undefined" && /^https?:$/.test(location.protocol)) {
    url.searchParams.set("app", location.origin + location.pathname);
  }
  return url.toString();
}
