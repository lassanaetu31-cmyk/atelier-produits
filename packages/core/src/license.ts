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

// Secret injecté à la compilation via VITE_LICENSE_SECRET (jamais dans le dépôt).
const LICENSE_SECRET: string =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env: Record<string, string> }).env
    ? (import.meta as unknown as { env: Record<string, string> }).env.VITE_LICENSE_SECRET ?? ""
    : "") || "change-me-set-VITE_LICENSE_SECRET";

async function hmac(data: string, secret = LICENSE_SECRET): Promise<string> {
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

/**
 * Vérifie une clé Gumroad via leur API publique.
 * permalink = identifiant du produit dans l'URL Gumroad (ex: "proposal-generator").
 */
export async function verifyGumroadLicense(
  key: string,
  permalink: string,
): Promise<LicenseCheck> {
  try {
    const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ product_permalink: permalink, license_key: key.trim() }),
    });
    const data = (await res.json()) as {
      success: boolean;
      message?: string;
      purchase?: { email: string; product_name: string; variants?: string };
    };
    if (!data.success) return { valid: false, reason: data.message ?? "Clé invalide" };
    const payload: LicensePayload = {
      product: permalink,
      buyer: data.purchase?.email ?? "",
      plan: "pro",
      expiresAt: 0,
    };
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "Impossible de vérifier (réseau)" };
  }
}

/** Vérifie une clé — Gumroad d'abord, puis HMAC offline (clés manuelles). */
export async function verifyLicense(
  key: string,
  gumroadPermalink?: string,
  secret?: string,
): Promise<LicenseCheck> {
  // Clé Gumroad : format UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  const isGumroad = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(
    key.trim(),
  );
  if (isGumroad && gumroadPermalink) {
    return verifyGumroadLicense(key, gumroadPermalink);
  }

  // Clé HMAC manuelle : format BASE64URL.SIGNATURE
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
