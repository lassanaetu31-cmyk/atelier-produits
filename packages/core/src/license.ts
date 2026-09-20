// Licence offline (module #10 intégré au socle).
// v1 : clé signée vérifiable sans serveur -> livraison automatique, activation locale.
// v2 : validation serveur + gestion appareils/expiration côté API.

export interface LicensePayload {
  product: string;
  buyer: string;
  plan: "lite" | "pro" | "agency";
  /** Timestamp d'expiration (ms). 0 = à vie. */
  expiresAt: number;
}

export interface LicenseCheck {
  valid: boolean;
  reason?: string;
  payload?: LicensePayload;
}

// Secret de démo. En prod : signer côté vendeur, ne PAS exposer le secret dans le binaire client v2.
const DEMO_SECRET = "atelier-produits-v1";

async function hmac(data: string, secret = DEMO_SECRET): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) =>
    ({ "+": "-", "/": "_", "=": "" })[c] as string,
  );
}

/** Génère une clé de licence (usage vendeur). Format: BASE64URL(payload).SIGNATURE */
export async function generateLicense(payload: LicensePayload, secret?: string): Promise<string> {
  const body = btoa(JSON.stringify(payload)).replace(/[+/=]/g, (c) =>
    ({ "+": "-", "/": "_", "=": "" })[c] as string,
  );
  const sig = await hmac(body, secret);
  return `${body}.${sig}`;
}

/** Vérifie une clé (usage app cliente). */
export async function verifyLicense(key: string, secret?: string): Promise<LicenseCheck> {
  const parts = key.trim().split(".");
  if (parts.length !== 2) return { valid: false, reason: "Format de clé invalide" };
  const [body, sig] = parts;
  const expected = await hmac(body, secret);
  if (sig !== expected) return { valid: false, reason: "Signature invalide" };
  let payload: LicensePayload;
  try {
    const pad = body.replace(/-/g, "+").replace(/_/g, "/");
    payload = JSON.parse(atob(pad));
  } catch {
    return { valid: false, reason: "Données illisibles" };
  }
  if (payload.expiresAt !== 0 && Date.now() > payload.expiresAt) {
    return { valid: false, reason: "Licence expirée", payload };
  }
  return { valid: true, payload };
}

const STORE_KEY = "atelier.license";

export function saveLicense(key: string): void {
  localStorage.setItem(STORE_KEY, key);
}

export function loadLicense(): string | null {
  return localStorage.getItem(STORE_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(STORE_KEY);
}
