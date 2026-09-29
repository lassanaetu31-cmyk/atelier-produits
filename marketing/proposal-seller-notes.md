# Notes vendeur — Proposal Generator (runbook de lancement)

## Ressources
- Code (privé) : https://github.com/lassanaetu31-cmyk/atelier-produits
- App déployée (Vercel) : https://proposal.lassi.tech/
- Pages produit : `proposal-chariow.md` (FCFA), `proposal-lemonsqueezy.md` (USD)

## Fabriquer le ZIP à livrer (Chariow / ventes manuelles)
```
cd apps/proposal && npm run build
# -> apps/proposal/dist/index.html
# Copier dans release/Proposal-Generator/ puis zipper
```
Le ZIP contient : `Proposal-Generator.html`, `LISEZ-MOI.txt`, `CONDITIONS.txt`.

## Licences

### Gumroad (automatique)
La clé UUID générée par Gumroad à l'achat fonctionne directement dans l'app.
L'acheteur colle sa clé UUID dans l'écran de licence — aucune action vendeur.

### Chariow / ventes manuelles (clé HMAC)
```
npm run genkey -- proposal-generator "Nom Acheteur" pro 0      # à vie
npm run genkey -- proposal-generator "Nom Acheteur" pro 365    # 1 an
```
Secret dans `apps/proposal/.env.local` (VITE_LICENSE_SECRET). Ne jamais livrer `genkey.mjs`.

## À livrer à l'acheteur (Chariow)
1. Le ZIP `Proposal-Generator.zip`
2. Sa clé HMAC générée avec genkey
3. URL portail : https://proposal.lassi.tech/ (à coller dans Profil > Portail public avec son WhatsApp)

## Prix
| Offre | FCFA | USD |
|-------|------|-----|
| Solo (lancement) | 17 500 | $29 |
| Pro | 25 000 | $49 |
| Agence / Asso | 45 000 | $79 |

## Flux acheteur (premier lancement)
1. Ouvre le HTML dans Chrome/Edge (ou https://proposal.lassi.tech/)
2. Connexion Google ou email/password (compte gratuit Firebase)
3. Choix de la langue (16 langues disponibles)
4. Colle sa clé de licence (UUID Gumroad ou clé HMAC)
5. Accès à l'app

## Checklist avant la 1ʳᵉ vente
- [x] Secret HMAC de production changé (`apps/proposal/.env.local`)
- [x] App déployée sur Vercel (proposal.lassi.tech)
- [x] 8 captures d'écran générées (`marketing/screenshots/`)
- [x] Vérification Gumroad UUID intégrée dans `verifyLicense`
- [ ] Page produit publiée : Gumroad (USD) et Chariow (FCFA)
- [ ] Moyen de paiement configuré sur chaque plateforme
- [ ] Test achat complet sur Gumroad (clé UUID → activation dans l'app)
- [ ] Test sur vrai Android : Chrome, langue, licence, PDF, portail

## Rappels
- Chaque app a son propre `.env.local` avec son propre `VITE_LICENSE_SECRET`.
- Le secret HMAC n'est PAS dans le code source — uniquement dans `.env.local` (non commité).
- Pour les screenshots : `VITE_SKIP_AUTH=true npx vite build` dans `apps/proposal`, puis `node tools/screenshots.mjs`.
- Permalink Gumroad : `kmmsac` (lassiapp.gumroad.com/l/kmmsac).
