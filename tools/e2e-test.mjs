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
// base64url d'un objet JSON (comme codec.ts / portail).
const b64urlJson = (obj) =>
  Buffer.from(JSON.stringify(obj), "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const root = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const invoiceHtml = path.join(root, "release", "Invoice-Generator", "Invoice-Generator.html");
const catalogHtml = path.join(root, "release", "Catalog-Builder", "Catalog-Builder.html");
const proposalHtml = path.join(root, "release", "Proposal-Generator", "Proposal-Generator.html");
const portalHtml = path.join(root, "apps", "portal", "dist", "index.html");

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

    // Import CSV de produits
    const pcsv =
      "nom,prix,categorie,disponible\nMontre classique,45000,Montres,oui\nCeinture,8000,Accessoires,non\n";
    await page
      .locator('input[type="file"][accept=".csv,text/csv"]')
      .setInputFiles({ name: "produits.csv", mimeType: "text/csv", buffer: Buffer.from(pcsv) });
    const pImported = await page
      .getByText(/produit\(s\) import/)
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    const montre = await page
      .getByText("Montre classique")
      .first()
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    log(pImported && montre, "import CSV produits (2 produits créés automatiquement)");

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

  // ---------------- PROPOSAL ----------------
  console.log("\n=== Proposal Generator ===");
  {
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(pathToFileURL(proposalHtml).href);
    await page.getByPlaceholder("Coller la clé de licence").fill(makeKey("proposal-generator"));
    await page.getByRole("button", { name: "Activer" }).click();

    const pdfBtn = page.getByRole("button", { name: "Télécharger le PDF" });
    await pdfBtn.waitFor({ timeout: 8000 });
    log(true, "activation licence (clé valide)");

    // Modèle métier 1-clic : remplit le titre du projet
    await page.getByRole("combobox").first().selectOption({ label: "Site web / dev" });
    const titled = await page
      .getByPlaceholder("Ex. Création de votre site web")
      .inputValue()
      .then((v) => v.length > 0)
      .catch(() => false);
    log(titled, "modèle métier appliqué (proposition pré-remplie)");

    const [dl] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }),
      pdfBtn.click(),
    ]);
    const fp = await dl.path();
    const size = fp ? fs.statSync(fp).size : 0;
    log(
      !!fp && dl.suggestedFilename().endsWith(".pdf") && size > 1000,
      `proposition PDF générée : ${dl.suggestedFilename()} (${size} octets)`,
    );

    // Module Adhérents : saisie manuelle + export PDF
    await page.getByRole("button", { name: "Adhérents" }).click();
    await page.getByPlaceholder("Matricule", { exact: true }).fill("ADH-001");
    await page.getByPlaceholder("Nom / Prénom *").fill("Awa Diallo");
    await page.getByRole("button", { name: "Ajouter" }).click();
    const memberAdded = await page
      .getByText("Awa Diallo")
      .first()
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    log(memberAdded, "adhérent ajouté manuellement");

    const [mdl] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }),
      page.getByRole("button", { name: "Télécharger PDF" }).click(),
    ]);
    const mfp = await mdl.path();
    const msize = mfp ? fs.statSync(mfp).size : 0;
    log(
      !!mfp && mdl.suggestedFilename().endsWith(".pdf") && msize > 1000,
      `liste adhérents PDF générée : ${mdl.suggestedFilename()} (${msize} octets)`,
    );

    log(errors.length === 0, `aucune erreur JS${errors.length ? " : " + errors[0] : ""}`);
    await ctx.close();
  }

  // ---------------- RÉCEPTION FORMULAIRE (lien #reception dans le dashboard) ----------------
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const sub = {
      createdAt: Date.now(),
      formTitle: "Fiche test",
      name: "Fatou Sow",
      phone: "770000001",
      interests: ["Cours de cuisine"],
      recontact: [],
    };
    // Ouvre directement le lien de réception, puis active la licence (le hash survit).
    await page.goto(pathToFileURL(proposalHtml).href + "#reception=" + b64urlJson(sub));
    await page.getByPlaceholder("Coller la clé de licence").fill(makeKey("proposal-generator"));
    await page.getByRole("button", { name: "Activer" }).click();
    await page.getByRole("button", { name: "Formulaire" }).click();
    const received = await page
      .getByText("Fatou Sow")
      .first()
      .waitFor({ timeout: 6000 })
      .then(() => true)
      .catch(() => false);
    log(received, "réception : réponse importée via le lien (#reception)");
    await ctx.close();
  }

  // ---------------- PORTAL PUBLIC (client, sans licence) ----------------
  console.log("\n=== Portail public ===");
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // Intercepte la redirection wa.me pour capturer le lien sans sortir sur Internet.
    let waUrl = "";
    await page.route("**/wa.me/**", async (route) => {
      waUrl = route.request().url();
      await route.fulfill({ status: 200, contentType: "text/html", body: "ok" });
    });

    const base = pathToFileURL(portalHtml).href;
    await page.goto(`${base}?v=inscription&org=${encodeURIComponent("Club Test")}&to=221771234567`);
    await page.getByText("Inscription — Club Test").waitFor({ timeout: 8000 });
    log(true, "portail : page d'inscription rendue (lien paramétré)");

    await page.getByLabel("Nom / Prénom *").fill("Awa Diallo");
    await Promise.all([
      page.waitForURL(/wa\.me/, { timeout: 8000 }),
      page.getByRole("button", { name: "Envoyer mon inscription" }).click(),
    ]);
    const okInscr = waUrl.includes("wa.me/221771234567") && /Awa/.test(decodeURIComponent(waUrl));
    log(okInscr, "portail : inscription -> WhatsApp prérempli vers l'admin");

    // Vue acceptation
    waUrl = "";
    await page.goto(
      `${base}?v=accept&org=Studio&to=221770000000&num=PROP-2026-0001&title=${encodeURIComponent(
        "Site web",
      )}&amount=700000&cur=XOF&days=30`,
    );
    await page.getByText("Site web").waitFor({ timeout: 8000 });
    await page.getByLabel("Votre nom (bon pour accord)").fill("Modou Kane");
    await Promise.all([
      page.waitForURL(/wa\.me/, { timeout: 8000 }),
      page.getByRole("button", { name: "J'accepte cette proposition" }).click(),
    ]);
    const okAccept = waUrl.includes("wa.me/221770000000") && /accepte/i.test(decodeURIComponent(waUrl));
    log(okAccept, "portail : acceptation -> WhatsApp prérempli vers le prestataire");

    // Vue fiche (formulaire en ligne)
    waUrl = "";
    const cfg = b64urlJson({
      title: "Fiche test",
      interests: ["Cours de cuisine", "Partenariat"],
      recontact: ["Recevoir des infos"],
      askStructure: true,
      consentText: "J'autorise le contact",
    });
    await page.goto(
      `${base}?v=fiche&org=Asso&to=221771112222&app=${encodeURIComponent("https://x.app/")}&cfg=${cfg}`,
    );
    await page.getByText("Fiche test").first().waitFor({ timeout: 8000 });
    await page.getByLabel("Nom / Prénom *").fill("Fatou Sow");
    await page.getByLabel("Téléphone *").fill("770000001");
    await page.locator("label", { hasText: "J'autorise le contact" }).getByRole("checkbox").check();
    await Promise.all([
      page.waitForURL(/wa\.me/, { timeout: 8000 }),
      page.getByRole("button", { name: "Envoyer ma fiche" }).click(),
    ]);
    const decoded = decodeURIComponent(waUrl);
    const okFiche =
      waUrl.includes("wa.me/221771112222") && /Fatou/.test(decoded) && /reception=/.test(decoded);
    log(okFiche, "portail : fiche -> WhatsApp + lien de réception dashboard");

    log(errors.length === 0, `aucune erreur JS${errors.length ? " : " + errors[0] : ""}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r).length;
console.log(`\n${failed ? `${failed} test(s) EN ÉCHEC` : "✔ TOUS LES TESTS PASSENT"}`);
process.exit(failed ? 1 : 0);
