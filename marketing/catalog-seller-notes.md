# Notes vendeur — Catalog Builder

Même procédure que Invoice (voir `invoice-seller-checklist.md`), en changeant
l'identifiant produit et les fichiers.

## Commandes clés
- Build : `npm run build:catalog`
- Paquet ZIP : `powershell -File tools/pack-catalog.ps1` → `release/Catalog-Builder.zip`
- Générer une clé (produit = **catalog-builder**) :
  `npm run genkey -- catalog-builder "Nom Acheteur" pro 0`

## Rappels
- Le secret de licence est partagé avec Invoice (même `LICENSE_SECRET`).
  Une clé `catalog-builder` n'ouvre QUE Catalog Builder (l'app vérifie l'id produit).
- Ne jamais livrer `tools/genkey.mjs` aux acheteurs.
- Pages produit : `catalog-chariow.md` (FCFA) et `catalog-lemonsqueezy.md` (USD).
