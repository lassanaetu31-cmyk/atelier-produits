import { db } from "./db";
import { b64urlDecode } from "./codec";
import type { Submission } from "./types";

/** Ajoute une réponse reçue en base, en évitant les doublons (même nom + même horodatage). */
async function store(sub: Submission): Promise<boolean> {
  const clean: Submission = {
    createdAt: sub.createdAt || Date.now(),
    formTitle: sub.formTitle,
    name: sub.name || "Sans nom",
    phone: sub.phone,
    email: sub.email,
    city: sub.city,
    structure: sub.structure,
    fonction: sub.fonction,
    interests: Array.isArray(sub.interests) ? sub.interests : [],
    recontact: Array.isArray(sub.recontact) ? sub.recontact : [],
    notes: sub.notes,
    signature: sub.signature,
  };
  const existing = await db.submissions.where("createdAt").equals(clean.createdAt).toArray();
  if (existing.some((e) => e.name === clean.name)) return false;
  await db.submissions.add(clean);
  return true;
}

/** Normalise un payload compact (clés courtes) ou complet en Submission. */
function normalize(raw: Record<string, unknown>): Submission {
  if ("n" in raw) {
    return {
      createdAt: (raw.a as number) || Date.now(),
      formTitle: (raw.ft as string) || "",
      name: (raw.n as string) || "Sans nom",
      phone: raw.p as string | undefined,
      email: raw.e as string | undefined,
      city: raw.ct as string | undefined,
      structure: raw.st as string | undefined,
      fonction: raw.fn as string | undefined,
      interests: (raw.i as string[]) || [],
      recontact: (raw.r as string[]) || [],
      notes: raw.no as string | undefined,
      signature: raw.si as string | undefined,
    };
  }
  return raw as unknown as Submission;
}

/** Extrait un payload de réception d'un texte collé (lien complet ou code brut). */
function extractPayload(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const m = s.match(/reception=([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]+$/.test(s) ? s : null;
}

/** Importe une réponse depuis un texte collé par l'opérateur. */
export async function importPasted(raw: string): Promise<boolean> {
  const payload = extractPayload(raw);
  if (!payload) return false;
  try {
    return await store(normalize(b64urlDecode<Record<string, unknown>>(payload)));
  } catch {
    return false;
  }
}

/**
 * À l'ouverture de l'app : si l'URL contient `#reception=<payload>` (lien tapé
 * par l'opérateur depuis WhatsApp), importe la réponse et nettoie l'URL.
 */
export async function importFromHash(): Promise<boolean> {
  const hash = location.hash || "";
  const m = hash.match(/reception=([A-Za-z0-9_-]+)/);
  if (!m) return false;
  let ok = false;
  try {
    ok = await store(normalize(b64urlDecode<Record<string, unknown>>(m[1])));
  } catch {
    ok = false;
  }
  history.replaceState(null, "", location.pathname + location.search);
  return ok;
}
