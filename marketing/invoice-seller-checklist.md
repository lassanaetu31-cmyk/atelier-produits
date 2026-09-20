# Checklist vendeur — lancer Invoice Generator

## 1. Sécuriser la licence (À FAIRE UNE FOIS, avant la 1ʳᵉ vente)
- [ ] Choisir un secret fort et le garder privé.
- [ ] Le définir dans `packages/core/src/license.ts` (remplacer `DEMO_SECRET`).
- [ ] Utiliser le MÊME secret pour générer les clés :
      `ATELIER_LICENSE_SECRET="mon-secret-fort" npm run genkey -- invoice-generator "Nom Acheteur" pro 0`
- [ ] Rebuild : `npm run build:invoice`
- [ ] Reconstruire le ZIP (voir plus bas).
- ⚠️ Ne JAMAIS inclure `tools/genkey.mjs` dans le ZIP livré aux acheteurs.

## 2. Construire le paquet de livraison
- [ ] `npm run build:invoice` (produit `apps/invoice/dist/index.html`)
- [ ] Lancer l'assemblage du ZIP (script fourni) → `release/Invoice-Generator.zip`
- [ ] Tester : dézipper, ouvrir `Invoice-Generator.html` dans Chrome, activer avec une clé de test, générer un PDF.

## 3. Créer les produits
### Chariow (FCFA)
- [ ] Nouveau produit fichier → coller `marketing/invoice-chariow.md`
- [ ] Uploader `release/Invoice-Generator.zip`
- [ ] Ajouter 4–6 captures d'écran
- [ ] Définir les 3 offres (12k / 20k / 45k)

### Lemon Squeezy (USD, international)
- [ ] New product → Digital + License keys → coller `marketing/invoice-lemonsqueezy.md`
- [ ] Uploader le même ZIP
- [ ] Prix Lite/Pro/Agency ($19/$39/$99)

## 4. Livraison des clés (par vente)
Deux options :
- **Manuel (simple pour démarrer)** : à chaque commande, générer une clé avec
  `npm run genkey` et l'envoyer à l'acheteur (message/email de la plateforme).
- **Automatique (plus tard)** : utiliser le système de clés natif de la
  plateforme si compatible avec la vérification de l'app (sinon rester manuel,
  ou passer à la licence v2 serveur).

## 5. Captures d'écran à préparer
- Éditeur avec quelques lignes remplies
- PDF généré (ouvert)
- Onglet Historique avec plusieurs documents
- Onglet Profil (logo + couleur)
- Écran d'activation de licence

## Rappels
- Prix = hypothèses à tester, ajuster selon les retours.
- Prévoir une petite vidéo de démo (30–60 s) : ça augmente la conversion.
