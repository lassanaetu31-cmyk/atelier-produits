import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { ShopProfile } from "./types";

export const DEFAULT_PROFILE: ShopProfile = {
  id: 1,
  name: "Ma Boutique",
  accentColor: "#4f46e5",
  currency: "XOF",
  orderTemplate: "Bonjour, je souhaite commander : {produit} ({prix}).",
};

export function useProfile(): ShopProfile {
  return useLiveQuery(() => db.settings.get(1), [], undefined) ?? DEFAULT_PROFILE;
}

export async function saveProfile(p: ShopProfile): Promise<void> {
  await db.settings.put({ ...p, id: 1 });
}
