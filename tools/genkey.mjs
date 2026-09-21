#!/usr/bin/env node
// Générateur de clés de licence — usage VENDEUR uniquement (ne pas distribuer aux acheteurs).
// Reproduit exactement la signature HMAC de packages/core/src/license.ts (licence v1 offline).
//
// Usage :
//   node tools/genkey.mjs <product> <buyer> <plan> <days>
// Exemples :
//   node tools/genkey.mjs invoice-generator "Boutique Awa" pro 0      -> licence à vie
//   node tools/genkey.mjs invoice-generator "Client Test" lite 365    -> expire dans 365 jours
//
// Secret : défini via ATELIER_LICENSE_SECRET, sinon valeur par défaut (à changer avant de vendre).

import crypto from "node:crypto";

// DOIT rester identique à LICENSE_SECRET dans packages/core/src/license.ts.
const SECRET = process.env.ATELIER_LICENSE_SECRET || "p9ykXGFa39nyyjrnAaoA4PJFNL9hAiBNA9jQ97vk0eU";

const [, , product = "invoice-generator", buyer = "Client", plan = "pro", days = "0"] =
  process.argv;

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
