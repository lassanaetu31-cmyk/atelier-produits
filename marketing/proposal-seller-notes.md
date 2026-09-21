# Notes vendeur — Proposal Generator (runbook de lancement)

## Ressources
- Code (privé) : https://github.com/lassanaetu31-cmyk/atelier-produits
- Portail public (formulaires/inscriptions clients) : https://lassanaetu31-cmyk.github.io/atelier-portail/
- Pages produit : `proposal-chariow.md` (FCFA), `proposal-lemonsqueezy.md` (USD)

## Fabriquer le produit à livrer
```
npm run build:proposal           # apps/proposal/dist/index.html
powershell -File tools/pack-proposal.ps1   # -> release/Proposal-Generator.zip
```
Le ZIP contient : `Proposal-Generator.html`, `LISEZ-MOI.txt`, `CONDITIONS.txt`.

## Générer une clé de licence (à chaque vente)
```
npm run genkey -- proposal-generator "Nom Acheteur" pro 0      # à vie
npm run genkey -- proposal-generator "Nom Acheteur" pro 365    # 1 an
```
Produit = **proposal-generator**. Ne JAMAIS livrer `tools/genkey.mjs` aux acheteurs.

## À livrer à l'acheteur
1. Le ZIP `Proposal-Generator.zip`.
2. Sa clé de licence.
3. Le lien du portail (ci-dessus) — à coller dans Profil > Portail public,
   avec son numéro WhatsApp, pour activer inscriptions / formulaires / acceptation.

## Prix
| Offre | FCFA | USD |
|-------|------|-----|
| Solo (lancement) | 15 000 | $29 |
| Pro | 25 000 | $49 |
| Agence / Asso | 45 000 | $79 |
> Lancer à 15 000 / $29 (early bird), remonter vers 20–25k / $39 après quelques ventes + avis.

## Checklist avant la 1ʳᵉ vente
- [x] Secret de licence de production changé (fait).
- [x] Portail hébergé (GitHub Pages, live).
- [ ] 5–6 captures d'écran (modèles, PDF, Adhérents, Formulaire, portail mobile).
- [ ] Page produit publiée : Lemon Squeezy (USD) et/ou Chariow/Selar (FCFA).
- [ ] Moyen de paiement configuré (Mobile Money via Chariow ; carte via Lemon Squeezy).
- [ ] Test sur un vrai Android : ouvrir le HTML, activer une clé, générer un PDF, tester un lien portail.
- [ ] Process de livraison prêt (générer la clé + envoyer ZIP + clé + lien portail).

## Rappels
- Secret de licence partagé avec Invoice/Catalog (même `LICENSE_SECRET`). Une clé
  `proposal-generator` n'ouvre QUE cette app (vérif de l'id produit).
- Repo privé obligatoire (le secret est dans le code).
- Mettre à jour le portail après un changement de code : voir `portal-hosting.md`.
