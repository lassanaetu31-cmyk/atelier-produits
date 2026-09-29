#!/usr/bin/env node
// Générateur de clés de licence — usage VENDEUR uniquement (ne pas distribuer aux acheteurs).
// Reproduit exactement la signature HMAC de packages/core/src/license.ts (licence v1 offline).
//
// Usage :
//   node tools/genkey.mjs "Nom Acheteur"
// Exemple :
//   node tools/genkey.mjs "Boutique Awa"   -> clé à vie pour proposal-generator
//
// Secret : ATELIER_LICENSE_SECRET (doit correspondre à VITE_LICENSE_SECRET dans .env.local).

import crypto from "node:crypto";

const SECRET = process.env.ATELIER_LICENSE_SECRET;
if (!SECRET) {
  console.error("\n⛔  Définir ATELIER_LICENSE_SECRET avant de générer des clés.");
  console.error("    Exemple : $env:ATELIER_LICENSE_SECRET='votre-secret' ; node tools/genkey.mjs \"Nom\"\n");
  process.exit(1);
}

const [, , buyer = "Client", plan = "pro", days = "0"] = process.argv;
const product = "proposal-generator";

const nbDays = Number(days) || 0;
const expiresAt = nbDays > 0 ? Date.now() + nbDays * 86400000 : 0;
const payload = { product, buyer, plan, expiresAt };

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const body = b64url(Buffer.from(JSON.stringify(payload), "latin1"));
const sig = b64url(crypto.createHmac("sha256", SECRET).update(body).digest());
const key = `${body}.${sig}`;

console.log("\nProduit  :", product);
console.log("Acheteur :", buyer);
console.log("Plan     :", plan);
console.log("Expire   :", expiresAt ? new Date(expiresAt).toISOString().slice(0, 10) : "jamais (à vie)");
console.log("\nCLÉ DE LICENCE :\n" + key + "\n");
