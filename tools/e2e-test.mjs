// Test E2E : pilote le Chrome du système sur les fichiers RÉELS du ZIP (file://),
// active la licence avec une vraie clé, puis génère un PDF. Comme un acheteur.
import { chromium } from "playwright";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SECRET = "NcPaZ77WztD-PZEoLqnh8Q2IHvT5OfKpk8JnfFLS7Ew";
const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function makeKey(product, buyer = "Test E2E", plan = "pro", expiresAt = 0) {
  const body = b64url(Buffer.from(JSON.stringify({ product, buyer, plan, expiresAt }), "latin1"));
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  return `${body}.${sig}`;
}

const root = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const invoiceHtml = path.join(root, "release", "Invoice-Generator", "Invoice-Generator.html");
const catalogHtml = path.join(root, "release", "Catalog-Builder", "Catalog-Builder.html");

const results = [];
const log = (ok, msg) => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  // ---------------- INVOICE ----------------
  console.log("\n=== Invoice Generator ===");
  {
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(pathToFileURL(invoiceHtml).href);
    await page.getByPlaceholder("Coller la clé de licence").fill(makeKey("invoice-generator"));
    await page.getByRole("button", { name: "Activer" }).click();

    // Preuve d'activation : un élément qui n'existe qu'une fois déverrouillé
    const pdfBtn = page.getByRole("button", { name: "Télécharger le PDF" });
    await pdfBtn.waitFor({ timeout: 8000 });
    log(true, "activation licence (clé valide)");

    const [dl] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }),
      pdfBtn.click(),
    ]);
    const fp = await dl.path();
    const size = fp ? fs.statSync(fp).size : 0;
    log(
      !!fp && dl.suggestedFilename().endsWith(".pdf") && size > 1000,
      `PDF généré : ${dl.suggestedFilename()} (${size} octets)`,
    );

    // Import CSV de clients
    await page.getByRole("button", { name: "Clients" }).click();
    const csv =
      "nom,telephone,email,adresse\nAwa Diallo,771234567,awa@mail.com,Dakar\nModou Kane,770000000,,Thies\n";
    await page
      .locator('input[type="file"][accept*="vcf"]')
      .setInputFiles({ name: "clients.csv", mimeType: "text/csv", buffer: Buffer.from(csv) });
    const imported = await page
      .getByText(/client\(s\) import/)
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    const awa = await page
      .getByText("Awa Diallo")
      .first()
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    log(imported && awa, "import CSV clients (2 contacts créés automatiquement)");

    // Rejet d'une mauvaise clé (nouvel onglet vierge)
    const ctx2 = await browser.newContext();
    const page2 = await ctx2.newPage();
    await page2.goto(pathToFileURL(invoiceHtml).href);
    await page2.getByPlaceholder("Coller la clé de licence").fill("cle-bidon.invalide");
    await page2.getByRole("button", { name: "Activer" }).click();
    const rejected = await page2
      .getByText(/invalide/i)
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    log(rejected, "rejet d'une clé invalide");
    await ctx2.close();

    log(errors.length === 0, `aucune erreur JS${errors.length ? " : " + errors[0] : ""}`);
    await ctx.close();
  }

  // ---------------- CATALOG ----------------
  console.log("\n=== Catalog Builder ===");
  {
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(pathToFileURL(catalogHtml).href);
    await page.getByPlaceholder("Coller la clé de licence").fill(makeKey("catalog-builder"));
    await page.getByRole("button", { name: "Activer" }).click();

    const nameInput = page.getByPlaceholder("Nom du produit *");
    await nameInput.waitFor({ timeout: 8000 });
    log(true, "activation licence (clé valide)");

    await nameInput.fill("Sac en cuir");
    await page.getByPlaceholder("Prix").fill("25000");
    await page.getByRole("button", { name: "Ajouter" }).click();
    await page.getByText("Sac en cuir").first().waitFor({ timeout: 8000 });
    log(true, "produit ajouté (photo optionnelle)");

    await page.getByRole("button", { name: "Catalogue" }).click();
    const [dl] = await Promise.all([
      page.waitForEvent("download", { timeout: 20000 }),
      page.getByRole("button", { name: "Générer le catalogue PDF" }).click(),
    ]);
    const fp = await dl.path();
    const size = fp ? fs.statSync(fp).size : 0;
    log(
      !!fp && dl.suggestedFilename().endsWith(".pdf") && size > 1000,
      `catalogue PDF généré : ${dl.suggestedFilename()} (${size} octets)`,
    );

    log(errors.length === 0, `aucune erreur JS${errors.length ? " : " + errors[0] : ""}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r).length;
console.log(`\n${failed ? `${failed} test(s) EN ÉCHEC` : "✔ TOUS LES TESTS PASSENT"}`);
process.exit(failed ? 1 : 0);
