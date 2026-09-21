# Notes vendeur — Proposal Generator

Même procédure que Invoice (voir `invoice-seller-checklist.md`), en changeant
l'identifiant produit et les fichiers.

## Commandes clés
- Build : `npm run build:proposal`
- Paquet ZIP : `powershell -File tools/pack-proposal.ps1` → `release/Proposal-Generator.zip`
- Générer une clé (produit = **proposal-generator**) :
  `npm run genkey -- proposal-generator "Nom Acheteur" pro 0`

## Rappels
- Le secret de licence est partagé avec Invoice/Catalog (même `LICENSE_SECRET`).
  Une clé `proposal-generator` n'ouvre QUE Proposal Generator (l'app vérifie l'id produit).
- Ne jamais livrer `tools/genkey.mjs` aux acheteurs.
- Pages produit : `proposal-chariow.md` (FCFA) et `proposal-lemonsqueezy.md` (USD).

## Argument de vente clé
- Réutilise ~80% du socle Invoice : coût de build quasi nul, marge maximale.
- Les 3 accélérateurs de conversion : **modèles métier** (gain de temps),
  **formules 3 niveaux** (panier moyen), **acceptation + WhatsApp** (closing).
