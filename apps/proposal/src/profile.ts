import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { CompanyProfile } from "./types";

export const DEFAULT_PROFILE: CompanyProfile = {
  id: 1,
  name: "Mon activité",
  accentColor: "#2563eb",
};

/** Profil live (réactif). Retourne le défaut tant qu'aucun profil n'est enregistré. */
export function useProfile(): CompanyProfile {
  return useLiveQuery(() => db.settings.get(1), [], undefined) ?? DEFAULT_PROFILE;
}

export async function saveProfile(p: CompanyProfile): Promise<void> {
  await db.settings.put({ ...p, id: 1 });
}

/** Migration : remplace l'ancienne URL GitHub Pages par portal.lassi.tech */
export async function migratePortalUrl(): Promise<void> {
  const p = await db.settings.get(1);
  if (p?.portalUrl?.includes("github.io")) {
    await db.settings.put({ ...p, portalUrl: "https://portal.lassi.tech/" });
  }
}
