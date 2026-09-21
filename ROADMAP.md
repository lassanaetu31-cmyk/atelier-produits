# Atelier Produits Digitaux — Roadmap

Propriétaire : Lassana Coulibaly · Objectif : construire 10 apps sur **1 socle réutilisable**, vendre en FCFA (Afrique) + USD (International), livraison automatique sans intervention par vente.

---

## Principe : 1 socle, 10 modules

Ne pas construire 10 apps isolées. Construire **1 socle commun** (`packages/core`) réutilisé par chaque app (`apps/*`). Coût marginal qui s'effondre app après app.

```
SOCLE COMMUN (packages/core) — build 1 fois
├── PDF          → factures, devis, propositions, catalogues, CV
├── Export       → CSV / ZIP
├── WhatsApp     → lien prérempli + QR
├── Money        → format FCFA / USD, calc marge/taxe/remise
├── Licence      → clé offline, activation, expiration
├── Storage      → local-first (IndexedDB / SQLite)
└── UI           → composants partagés (Tailwind)
```

**Stack :** Vite + React + TypeScript + Tailwind · local-first (zéro hébergement = pur produit digital zippable) · PDF client-side.

---

## Les 10 apps (ordre de construction)

| # | App | Statut | Diff | Prix Afrique | Prix Int'l | Modules socle réutilisés |
|---|-----|--------|------|--------------|-----------|--------------------------|
| 1 | **Invoice + Quote Generator** ⭐ PRIORITÉ | ✅ MVP vendable | 5 | 12–35k FCFA | $19–59 | PDF, Money, Storage, Licence |
| 2 | WhatsApp Catalog Builder | ✅ MVP vendable | 5 | 7,5–25k | $19–49 | PDF, WhatsApp, Storage |
| 3 | **Proposal Generator** | ✅ MVP vendable | 5 | 10–30k | $19–69 | PDF, Money, Storage, WhatsApp, Licence |
| 4 | Inventory + Profit Calculator | ⏳ | 4 | 15–35k | $15–49 | Money, Export, Storage |
| 5 | Link-in-Bio Business Builder | ⏳ | 6 | 10–25k | $19–79 | WhatsApp, Storage |
| 6 | WhatsApp Sales Assistant | ⏳ | 6 | 15–35k | $29–79 | WhatsApp, Storage |
| 7 | Social Media Content Engine | ⏳ | 7 | 10–30k | $29–99 | Export, Storage |
| 8 | Booking / Salon Manager | ⏳ | 7 | 15–40k | $49–149 | WhatsApp, Storage, Licence |
| 9 | CRM WhatsApp Lite | ⏳ | 8 | 25–60k | $39–129 | WhatsApp, Export, Storage |
| 10 | Licence + Delivery System | ⏳ (socle) | 8 | — | $49–199 | intégré au socle dès le départ |

Légende statut : ✅ fini · 🔨 en cours · ⏳ à venir

### Pourquoi Invoice en priorité (et pas le #10 seul)
- Diff 5/10 = produit vendable le plus vite → valider le marché avant de sur-construire.
- Réutilise le module **PDF** dont 5 autres apps ont besoin → on le construit une fois ici.
- La **Licence** est intégrée comme module léger (clé offline) dès le socle, pas comme SaaS séparé.

---

## Où déposer / vendre (plateformes)

| Marché | Plateforme(s) | Rôle | Paiement | Type produit |
|--------|--------------|------|----------|--------------|
| 🇸🇳 Afrique franco | **Chariow + Selar** | volume, prix FCFA | Mobile Money / local | app + bundle |
| 🌍 International | **Lemon Squeezy** (principal) | logiciels + licences + SaaS, payout bancaire Sénégal OK | USD/EUR | app + licence |
| 🌍 Templates simples | Gumroad + Payhip | secondaire | Stripe/PayPal | templates/ebooks |
| 👨‍💻 Devs / entreprises | **CodeCanyon (Envato)** | vendre le CODE générique 1x → licences répétées | USD | code source |
| 🛒 Marchands e-com | Shopify App Store | **phase 2** (review stricte, OAuth) | via Shopify | plugin |

### Priorité canaux
1. **Lemon Squeezy** = colonne vertébrale (licences + payout Sénégal). Tous les produits en $.
2. **Chariow + Selar** en parallèle, même app en FCFA.
3. **CodeCanyon** pour 3 produits « code source » : Invoice, Catalog, Booking.
4. **Shopify** = phase 2 seulement.

### À éviter au départ
- Gumroad comme canal principal (payout pays-dépendant, ni Wise ni Payoneer).
- Creative Market (pur design, hors logique logiciel).

⚠️ Vérifier avant lancement : doc API licence de chaque plateforme, conditions de payout Sénégal à jour, mentions légales factures selon pays cible.

---

## Packaging vente

1. **Unitaire** — chaque app, sa licence.
2. **Bundle « Business Starter Africa »** — Invoice + Catalog + Inventory + CRM + templates + guides PDF. Offre Premium 75k FCFA / $149. Pas un dev = ZIP + licences groupées.

---

## App #2 — Catalog Builder : plan MVP (pas à pas)

1. **Profil boutique** — nom, logo, couleur, numéro WhatsApp, modèle de message de commande (onglet Profil) + sauvegarde/restauration.
2. **Produits** — CRUD (photo compressée, nom, prix, description, catégorie, référence, disponibilité).
3. **Catalogue PDF** — mise en page grille avec images/prix (nouveau `buildCatalogPdf` dans le socle) + QR du contact WhatsApp.
4. **Commande WhatsApp** — bouton/lien prérempli par produit (`{produit}`/`{prix}`) + QR par produit.
5. **Licence** — déjà en place (gate, produit `catalog-builder`). Packaging identique à Invoice.

> Note archi : `LicenseGate` + `license-context` sont dupliqués Invoice/Catalog/Proposal (petits fichiers). Refactor futur possible : extraire un paquet `packages/ui` React partagé.

## App #3 — Proposal Generator : plan MVP (pas à pas)

Réutilise ~80% du socle Invoice (PDF, Money, Storage, Licence, clients, backup). Les fonctions « irrésistibles » sont ce qui le distingue d'un simple mode de facture :

1. **Socle PDF étendu** — `buildProposalPdf`/`downloadProposalPdf` dans `core/pdf.ts` : sections narratives (saut de page géré), paliers optionnels en cartes, tableau investissement, acompte, bloc signature (bon pour accord), mentions/CGV. Invoice + Catalog rebuild OK (non-régression).
2. **Modèles métier 1-clic** (`templates.ts`) — dev/web, design, marketing, conseil, photo : titre + sections (problème/solution/livrables/planning/CGV) + services pré-remplis → proposition en 2 min au lieu de 30.
3. **Formules à 3 niveaux** (Essentiel/Pro/Premium) optionnelles → good-better-best, panier moyen ↑.
4. **Acompte (%) + validité (jours)** → cash à la signature + urgence.
5. **Statut + acceptation en ligne** — Brouillon/Envoyée/Acceptée/Refusée dans l'historique ; « Accepter » saisit le nom du signataire → PDF signé (nom + date).
6. **Envoi WhatsApp prérempli** (socle `whatsappLink`) depuis l'éditeur et l'historique ; passage auto en « Envoyée ».
7. **Clients** — CRUD + import CSV/vCard + export (réutilise `clients-import` et le socle CSV).
8. **Packaging** — build fichier unique hors-ligne, docs acheteur (`release-assets/proposal/`), pages produit Chariow + Lemon Squeezy + notes vendeur (`marketing/`), `tools/pack-proposal.ps1` → `release/Proposal-Generator.zip`. Couvert par le test E2E (activation, modèle, PDF réel).

## Licence — avant de vendre (important)

- Licence **v1 = HMAC offline** (clé signée, vérifiée sans serveur). Génération vendeur : `npm run genkey -- invoice-generator "Nom Acheteur" pro 0`.
- ⚠️ **Changer le secret** avant la 1ʳᵉ vente : définir `ATELIER_LICENSE_SECRET` (tool) ET la même valeur dans `packages/core/src/license.ts`. Sinon des clés génériques circulent.
- Limite v1 : le secret est présent dans le bundle client → un acheteur avancé peut forger une clé. Acceptable pour lancer (livraison manuelle de clé sur Chariow/Lemon Squeezy). **v2** = signature asymétrique (Ed25519, clé privée hors bundle) ou validation serveur.
- L'outil `tools/genkey.mjs` ne doit **jamais** être livré aux acheteurs.

## Journal

- 2026-09-20 — Setup monorepo + socle `core` + scaffold app Invoice (priorité #1).
- 2026-09-20 — Invoice point 1 : clients (CRUD) + historique persistant (Dexie), navigation Éditeur/Clients/Historique, ouvrir/rejouer/PDF depuis l'historique.
- 2026-09-20 — Invoice point 2 : types de document (Facture/Devis/Reçu/Proposition), numérotation par préfixe, conversion Devis → Facture (éditeur + historique) avec lien source/converti.
- 2026-09-20 — Invoice point 3 : profil entreprise persistant (logo, infos, couleur d'accent, notes) via onglet Profil, réutilisé en en-tête de chaque PDF ; détection format image (PNG/JPEG) dans le socle.
- 2026-09-20 — Invoice point 4 : numérotation séquentielle atomique par type+année (F-2026-0001) via store counters (Dexie v3, transaction rw), attribution à l'enregistrement ; remise (%) + livraison exposées dans l'éditeur et le total.
- 2026-09-20 — Invoice point 5 : écran de licence au démarrage (LicenseGate + contexte), activation par clé, badge plan + déconnexion ; outil vendeur `tools/genkey.mjs` (HMAC, cross-compat WebCrypto vérifiée). **MVP Invoice vendable.**
- 2026-09-20 — Invoice **packaging (option A)** : build fichier unique hors-ligne (`vite-plugin-singlefile`, base relative), sauvegarde/restauration des données (onglet Profil), docs acheteur (`release-assets/invoice/`), pages produit Chariow + Lemon Squeezy + checklist vendeur (`marketing/`), script `tools/pack-invoice.ps1` → `release/Invoice-Generator.zip` (367 Ko).
- 2026-09-20 — Sécurisation licence : secret de production HMAC dans `license.ts` + `genkey.mjs`.
- 2026-09-20 — App #2 Catalog Builder : **fondation** (workspace, licence gate produit `catalog-builder`, db products/settings, profil boutique, shell 3 onglets). Build fichier unique OK.
- 2026-09-20 — Catalog point 1 : onglet Profil boutique (logo, couleur, n° WhatsApp, devise, modèle de message de commande avec aperçu + test lien WhatsApp) + sauvegarde/restauration (backup.ts). Réutilise `whatsappLink`/`formatMoney` du socle.
- 2026-09-20 — Catalog point 2 : onglet Produits (CRUD complet : photo compressée, prix, catégorie, référence, description, disponibilité) en grille. Nouveau `resizeImageDataUrl` dans le socle (canvas, JPEG) réutilisable.
- 2026-09-20 — Catalog point 3 : catalogue PDF (nouveau `buildCatalogPdf` dans le socle — grille 2 colonnes, en-tête logo/couleur, QR WhatsApp) + onglet Catalogue (génération, résumé produits/devise/WhatsApp). Invoice reste OK après modif du socle.
- 2026-09-20 — Catalog point 4 : commande WhatsApp par produit (bouton lien prérempli `{produit}`/`{prix}` + téléchargement QR PNG par produit) dans l'onglet Produits.
- 2026-09-20 — Catalog **packaging (point 5)** : docs acheteur (`release-assets/catalog/`), pages produit Chariow + Lemon Squeezy + notes vendeur (`marketing/`), script `tools/pack-catalog.ps1` → `release/Catalog-Builder.zip` (~360 Ko). Clé de test `catalog-builder` OK. **MVP Catalog vendable.**
- 2026-09-20 — **Test E2E (option D)** : `tools/e2e-test.mjs` (Playwright, Chrome système, `file://`) valide sur les 2 ZIP : activation par clé, rejet clé invalide, génération PDF réelle, ajout produit (IndexedDB sous file://), zéro erreur JS. `npm run test:e2e`. Confirme que le modèle "1 fichier hors-ligne" fonctionne dans Chrome.
- 2026-09-20 — Invoice : import clients en masse (CSV délimiteur auto `,`/`;` + colonnes détectées, ou fichier contacts `.vcf` du téléphone), création auto anti-doublons (téléphone/nom), export CSV + modèle. Couvert par le test E2E. ZIP repackagé.
- 2026-09-20 — Socle : parseur CSV extrait dans `core/csv.ts` (`parseCsvRows`, `normalizeHeader`) réutilisé. Catalog : import produits CSV (colonnes détectées, prix/disponibilité parsés, anti-doublons réf/nom), export CSV + modèle. Couvert par le test E2E (2 produits). Les 2 ZIP rebuild/repackagés.
- 2026-09-21 — **App #3 Proposal Generator : MVP vendable.** Nouveau `apps/proposal` (workspace, licence gate produit `proposal-generator`, db proposals/clients/settings/counters, shell 4 onglets). Socle étendu : `buildProposalPdf`/`downloadProposalPdf` (sections narratives avec sauts de page, paliers en cartes, tableau investissement, acompte, bloc signature, CGV) — Invoice + Catalog non régressés. Réutilise clients/backup/profil/CSV du socle Invoice (~80%).
- 2026-09-21 — Proposal, fonctions « irrésistibles » : modèles métier 1-clic (`templates.ts` : web/design/marketing/conseil/photo), formules à 3 niveaux (Essentiel/Pro/Premium), acompte % + validité jours, statut (Brouillon/Envoyée/Acceptée/Refusée) + acceptation en ligne (PDF signé nom+date), envoi WhatsApp prérempli. Numérotation séquentielle atomique `PROP-2026-0001`.
- 2026-09-21 — Proposal packaging : docs acheteur (`release-assets/proposal/`), pages produit Chariow + Lemon Squeezy + notes vendeur (`marketing/`), `tools/pack-proposal.ps1` → `release/Proposal-Generator.zip` (~374 Ko). Test E2E étendu (3ᵉ bloc : activation clé `proposal-generator`, application d'un modèle métier, génération PDF réelle de 16,7 Ko sous file://) — **tous les tests passent**.
- 2026-09-21 — Proposal, module **Adhérents** (suivi cotisations, inspiré d'un panneau admin) : onglet dédié, table Dexie `members` (db v2, backup v2 mis à jour), saisie manuelle CRUD (matricule, nom, email, ville, type, échéance, payé), statut dérivé (Payé/Non payé/En retard si échéance dépassée), 4 compteurs (total, à jour, en retard, taux de recouvrement), recherche + filtres, « Marquer payé » 1-clic. Imports/exports : CSV (colonnes détectées, anti-doublons matricule/nom, modèle), PDF liste imprimable (nouveau `buildMembersPdf`/`downloadMembersPdf` dans le socle, coloration du statut), `adherents.json`. E2E étendu (saisie manuelle + PDF liste). Invoice + Catalog non régressés.
- 2026-09-21 — **Portail public (web) — approche WhatsApp zéro backend.** Constat : l'app hors-ligne convient à l'opérateur, mais le client final ne téléchargera jamais un fichier pour commander/s'inscrire. Solution : nouveau `apps/portal` (fichier HTML unique, **sans licence**, hébergé UNE fois par le vendeur), piloté par l'URL — `?v=inscription` (formulaire adhésion) et `?v=accept` (résumé proposition + « J'accepte »). À la validation, ouvre un **message WhatsApp prérempli** vers l'opérateur (aucune donnée serveur). Chaque opérateur partage un lien paramétré (nom, numéro, détails) → zéro hébergement par acheteur.
- 2026-09-21 — Proposal câblé au portail : profil `whatsappPhone` + `portalUrl` (onglet Profil), générateur `portal-links.ts` (`inscriptionLink`/`acceptLink`), bloc « Lien d'inscription public » (copier/tester) dans Adhérents, lien « Accepter en 1 clic » ajouté au message WhatsApp d'envoi de proposition (éditeur + historique). Note d'hébergement `marketing/portal-hosting.md`. E2E : 4ᵉ contexte (portail) — rendu paramétré + inscription et acceptation → wa.me préremplis (route interceptée). **Tous les tests passent.** Pivot possible plus tard vers backend léger (auto-sync) = offre SaaS.
