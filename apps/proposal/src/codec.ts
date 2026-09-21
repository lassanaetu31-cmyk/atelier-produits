// Encodage base64url compatible Unicode (accents) — partagé app opérateur / portail.

export function b64urlEncode(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode<T>(s: string): T {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(decodeURIComponent(escape(atob(b64)))) as T;
}
