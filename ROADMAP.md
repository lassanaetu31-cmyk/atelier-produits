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
| 2 | WhatsApp Catalog Builder | ⏳ | 5 | 7,5–25k | $19–49 | PDF, WhatsApp, Storage |
| 3 | Proposal Generator | ⏳ | 5 | 10–30k | $19–69 | PDF, Money, Storage |
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
