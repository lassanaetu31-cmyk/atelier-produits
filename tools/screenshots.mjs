// Génère les captures d'écran marketing du Proposal Generator (app #3).
// Pilote le vrai HTML du ZIP + le portail (file://) via le Chrome du système,
// active une vraie clé de licence, remplit des données réalistes, capture PNG.
// Sortie : marketing/screenshots/*.png
import { chromium } from "playwright";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Lire depuis la variable d'env : ATELIER_LICENSE_SECRET=... node tools/screenshots.mjs
const SECRET = process.env.ATELIER_LICENSE_SECRET ?? "";
const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function makeKey(product, buyer = "Studio Démo", plan = "pro", expiresAt = 0) {
  const body = b64url(Buffer.from(JSON.stringify({ product, buyer, plan, expiresAt }), "latin1"));
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  return `${body}.${sig}`;
}
const b64urlJson = (obj) =>
  Buffer.from(JSON.stringify(obj), "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const root = path.resolve(fileURLToPath(import.meta.url), "..", "..");
// Build screenshots : VITE_SKIP_AUTH=true (bypasse Firebase pour les captures)
const proposalHtml = path.join(root, "release", "Proposal-Generator-ss", "index.html");
const portalHtml = path.join(root, "apps", "portal", "dist", "index.html");
const outDir = path.join(root, "marketing", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const shot = async (page, file, opts = {}) => {
  const fp = path.join(outDir, file);
  await page.screenshot({ path: fp, ...opts });
  console.log("OK  " + path.relative(root, fp));
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  // ---------- APP OPÉRATEUR (desktop) ----------
  const ctx = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  // --- SCREEN 1 : Sélection de langue (LangPickerView) ---
  // Charge sans localStorage → SKIP_AUTH=true → directement LangPicker
  await page.goto(pathToFileURL(proposalHtml).href);
  // Attendre que la grille de langues soit visible
  await page.locator("text=Français").waitFor({ timeout: 8000 });
  await shot(page, "01-choix-langue.png");

  // Sélectionner Français et continuer
  await page.locator("button", { hasText: "Français" }).click();
  await page.getByRole("button").filter({ hasText: /continuer|continue/i }).click();

  // --- SCREEN 2 : MODÈLE MÉTIER + FORMULES 3 NIVEAUX ---
  await page.getByRole("button", { name: /télécharger|download/i }).waitFor({ timeout: 8000 });
  await page.getByRole("combobox").first().selectOption({ label: "Site web / dev" });
  await page.waitForTimeout(300);

  const formules = page.locator("section", { hasText: "Formules" }).first();
  const tierNames = formules.locator('input:not([type])');
  const tierPrices = formules.locator('input[type="number"]');
  const tierFeats = formules.locator("textarea");
  const nTiers = Math.min(3, await tierNames.count());
  const data = [
    ["Essentiel", "250000", "Site vitrine 3 pages\nFormulaire de contact\nMise en ligne"],
    ["Pro", "450000", "Jusqu'à 8 pages\nBlog + SEO de base\nGoogle Analytics"],
    ["Premium", "750000", "Site sur mesure\nE-commerce\nMaintenance 3 mois"],
  ];
  for (let i = 0; i < nTiers; i++) {
    await tierNames.nth(i).fill(data[i][0]);
    await tierPrices.nth(i).fill(data[i][1]);
    await tierFeats.nth(i).fill(data[i][2]);
  }
  if (nTiers > 1) await formules.locator('input[type="checkbox"]').nth(1).check();
  await page.mouse.wheel(0, -2000);
  await page.waitForTimeout(300);
  await shot(page, "02-modele-metier-formules.png", { fullPage: true });

  // --- SCREEN 4 : PROPOSITION PDF ---
  const [dl] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByRole("button", { name: /télécharger|download/i }).click(),
  ]);
  const pdfPath = path.join(outDir, "_proposition.pdf");
  await dl.saveAs(pdfPath);
  const pdfPage = await ctx.newPage();
  await pdfPage.setViewportSize({ width: 1000, height: 1300 });
  await pdfPage.goto(pathToFileURL(pdfPath).href);
  await pdfPage.waitForTimeout(2500);
  await shot(pdfPage, "03-proposition-pdf.png");
  await pdfPage.close();

  // --- SCREEN 4 : ADHÉRENTS ---
  await page.getByRole("button", { name: /adhérents|members/i }).click();
  const members = [
    ["ADH-001", "Awa Diallo"],
    ["ADH-002", "Modou Kane"],
    ["ADH-003", "Bineta Ndiaye"],
  ];
  for (const [mat, nom] of members) {
    await page.getByPlaceholder("Matricule", { exact: true }).fill(mat);
    await page.getByPlaceholder("Nom *", { exact: true }).fill(nom);
    await page.getByRole("button", { name: "Ajouter" }).click();
    await page.getByText(nom).first().waitFor({ timeout: 5000 });
  }
  await page.mouse.wheel(0, -2000);
  await page.waitForTimeout(300);
  await shot(page, "04-adherents.png", { fullPage: true });

  // --- SCREEN 5 : FORMULAIRE + RÉCEPTION ---
  const sub = {
    createdAt: Date.now(),
    formTitle: "Fiche de renseignement",
    name: "Fatou Sow",
    phone: "77 000 00 01",
    interests: ["Cours de cuisine"],
    recontact: ["Recevoir des infos"],
  };
  await page.goto(pathToFileURL(proposalHtml).href + "#reception=" + b64urlJson(sub));
  await page.reload();
  await page.getByText("Fatou Sow").first().waitFor({ timeout: 10000 });
  await page.waitForTimeout(300);
  await shot(page, "05-formulaire-reception.png", { fullPage: true });

  await ctx.close();

  // ---------- PORTAIL PUBLIC (mobile, sans licence) ----------
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
  });
  const mp = await mob.newPage();
  const base = pathToFileURL(portalHtml).href;

  // --- SCREEN 6 : Inscription (mobile) ---
  await mp.goto(`${base}?v=inscription&org=${encodeURIComponent("Club Karaté Dakar")}&to=221771234567`);
  await mp.getByText("Inscription — Club Karaté Dakar").waitFor({ timeout: 8000 });
  await mp.getByLabel("Nom / Prénom *").fill("Awa Diallo");
  await mp.waitForTimeout(300);
  await shot(mp, "06-portail-inscription-mobile.png");

  // --- SCREEN 7 : Acceptation de proposition (mobile) ---
  await mp.goto(
    `${base}?v=accept&org=Studio%20Démo&to=221770000000&num=PROP-2026-0001&title=${encodeURIComponent(
      "Refonte site web",
    )}&amount=700000&cur=XOF&days=30`,
  );
  await mp.getByText("Refonte site web").waitFor({ timeout: 8000 });
  await mp.getByLabel("Votre nom (bon pour accord)").fill("Modou Kane");
  await mp.waitForTimeout(300);
  await shot(mp, "07-portail-acceptation-mobile.png");

  await mob.close();
} finally {
  await browser.close();
}
console.log("\n✔ Captures dans marketing/screenshots/");
