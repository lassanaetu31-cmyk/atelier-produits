# Portail public — hébergement (une seule fois, par le vendeur)

Le portail (`apps/portal`) est un **fichier HTML unique** hébergé **une seule fois**.
Tous les acheteurs (Proposal, Catalog, etc.) partagent la même URL : leurs liens
portent leurs infos en paramètres (`?v=...&org=...&to=...`). **Zéro backend, zéro
hébergement par acheteur.**

## Build
```
npm run build:portal        # -> apps/portal/dist/index.html
```

## Déployer (au choix, gratuit)
- **Cloudflare Pages / Netlify / Vercel** : glisser `apps/portal/dist/` → une URL type
  `https://atelier-portail.pages.dev`.
- **GitHub Pages** : pousser `index.html` sur une branche `gh-pages`.
- N'importe quel hébergement statique (même un sous-dossier de ton site).

## Donner l'URL aux acheteurs
Chaque acheteur colle cette URL dans **Profil > Portail public** (+ son numéro
WhatsApp). L'app génère alors ses liens :
- `…/?v=inscription&org=<nom>&to=<whatsapp>&types=Mensuel,Annuel`
- `…/?v=accept&org=<nom>&to=<whatsapp>&num=<réf>&title=<titre>&amount=<montant>&cur=XOF&days=30`

## Sécurité / vie privée
- Le portail n'envoie **aucune donnée** à un serveur : à la validation, il ouvre
  simplement WhatsApp avec un message prérempli vers le numéro de l'opérateur.
- Les paramètres sont visibles dans l'URL (nom de l'org, numéro WhatsApp) — ne rien
  y mettre de confidentiel.

## Évolution (plus tard)
Si un acheteur veut que les inscriptions/acceptations **tombent automatiquement**
dans son app (sans recopie), c'est le passage à un backend léger (Supabase /
Cloudflare) → offre SaaS en abonnement. Non nécessaire pour le lancement.
