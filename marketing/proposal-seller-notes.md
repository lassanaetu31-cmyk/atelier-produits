# Notes vendeur — Proposal Generator (runbook de lancement)

## Ressources
- Code (privé) : https://github.com/lassanaetu31-cmyk/atelier-produits
- App (lien secret — ne pas publier) : https://proposal.lassi.tech/
- Pages produit : `proposal-chariow.md` (FCFA), `proposal-lemonsqueezy.md` (USD)

## Modèle de protection : lien secret
L'app est accessible à quiconque a le lien. Le lien n'est pas indexé et n'est jamais publié publiquement.
**À livrer uniquement après paiement confirmé.**

## À livrer à l'acheteur
1. Le lien : https://proposal.lassi.tech/
2. Instructions : créer un compte (Google ou email), choisir la langue, c'est prêt.

## Livraison Gumroad (automatique)
Coller le lien dans le champ "Content" du produit Gumroad — Gumroad l'envoie automatiquement après paiement.

## Livraison Chariow (manuelle)
Envoyer le lien par message (WhatsApp / email) dès que le paiement Wave/OM est confirmé.

## Prix
| Offre | FCFA | USD |
|-------|------|-----|
| Solo (lancement) | 17 500 | $29 |
| Pro | 25 000 | $49 |
| Agence / Asso | 45 000 | $79 |

## Flux acheteur (premier lancement)
1. Ouvre https://proposal.lassi.tech/
2. Connexion Google ou email/password (compte gratuit Firebase)
3. Choix de la langue (16 langues disponibles)
4. Accès direct à l'app — aucune clé requise

## Checklist avant la 1ʳᵉ vente
- [x] App déployée sur Vercel (proposal.lassi.tech)
- [x] LicenseGate supprimée — accès libre après connexion
- [x] 8 captures d'écran générées (`marketing/screenshots/`)
- [ ] Lien configuré dans Gumroad (champ Content)
- [ ] Page produit publiée : Gumroad (USD) et Chariow (FCFA)
- [ ] Moyen de paiement configuré sur chaque plateforme
- [ ] Test sur vrai Android : Chrome, langue, app fonctionnelle

## Rappels
- Ne jamais poster le lien https://proposal.lassi.tech/ publiquement (réseaux sociaux, Product Hunt, etc.) — toujours rediriger vers la page Gumroad/Chariow.
- Pour les screenshots : `VITE_SKIP_AUTH=true npx vite build` dans `apps/proposal`, puis `node tools/screenshots.mjs`.
- Permalink Gumroad : `kmmsac` (lassiapp.gumroad.com/l/kmmsac).
