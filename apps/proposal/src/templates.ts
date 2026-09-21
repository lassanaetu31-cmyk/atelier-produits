import type { LineItem, ProposalSection, ProposalTier } from "@atelier/core";

/** Modèle métier pré-rempli : supprime les 30 min de rédaction (proposition en 2 min). */
export interface ProposalTemplate {
  id: string;
  label: string;
  title: string;
  sections: ProposalSection[];
  services: LineItem[];
  tiers?: ProposalTier[];
}

const CGV =
  "Devis valable selon la durée indiquée. Acompte à la commande, solde à la livraison. " +
  "Le projet démarre à réception de l'acompte. Toute prestation hors périmètre fera l'objet d'un avenant.";

export const TEMPLATES: ProposalTemplate[] = [
  {
    id: "blank",
    label: "Vierge",
    title: "",
    sections: [
      { title: "Contexte & problème", body: "" },
      { title: "Solution proposée", body: "" },
      { title: "Livrables", body: "" },
      { title: "Planning", body: "" },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [{ description: "Prestation", quantity: 1, unitPrice: 250000 }],
  },
  {
    id: "web",
    label: "Site web / dev",
    title: "Création de votre site web",
    sections: [
      {
        title: "Contexte & problème",
        body: "Votre présence en ligne actuelle ne convertit pas vos visiteurs en clients et ne reflète pas la qualité de votre offre. Vous perdez des prospects faute d'un site rapide, clair et crédible.",
      },
      {
        title: "Solution proposée",
        body: "Je conçois et développe un site moderne, rapide et optimisé mobile, pensé pour convertir : structure claire, appels à l'action, référencement de base et prise de contact WhatsApp intégrée.",
      },
      {
        title: "Livrables",
        body: "- Maquette validée avant développement\n- Site responsive (5 pages)\n- Formulaire de contact + WhatsApp\n- Référencement de base (SEO on-page)\n- Formation à la prise en main (30 min)",
      },
      {
        title: "Planning",
        body: "Semaine 1 : cadrage + maquette. Semaines 2-3 : développement. Semaine 4 : contenus, tests et mise en ligne. Délai total estimé : 4 semaines.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Conception & maquette", quantity: 1, unitPrice: 150000 },
      { description: "Développement site (5 pages)", quantity: 1, unitPrice: 450000 },
      { description: "Mise en ligne + formation", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      {
        name: "Essentiel",
        price: 400000,
        features: ["Site 3 pages", "Responsive mobile", "Contact WhatsApp"],
      },
      {
        name: "Pro",
        price: 700000,
        highlighted: true,
        features: ["Site 5 pages", "SEO de base", "Blog", "Formation incluse"],
      },
      {
        name: "Premium",
        price: 1200000,
        features: ["Pages illimitées", "SEO avancé", "Maintenance 3 mois", "Support prioritaire"],
      },
    ],
  },
  {
    id: "design",
    label: "Design / branding",
    title: "Identité visuelle de votre marque",
    sections: [
      {
        title: "Contexte & problème",
        body: "Votre marque manque de cohérence visuelle : logo, couleurs et supports ne renvoient pas une image professionnelle et mémorable, ce qui fragilise votre crédibilité.",
      },
      {
        title: "Solution proposée",
        body: "Je crée une identité visuelle complète et cohérente : logo, palette, typographies et déclinaisons sur vos supports clés, livrée avec une charte simple à utiliser.",
      },
      {
        title: "Livrables",
        body: "- Logo (3 propositions, 2 tours de révision)\n- Charte graphique (couleurs, typo, usages)\n- Fichiers sources + exports web/print\n- Modèles réseaux sociaux",
      },
      {
        title: "Planning",
        body: "Semaine 1 : recherche + pistes. Semaine 2 : sélection + révisions. Semaine 3 : finalisation et livraison des fichiers. Délai estimé : 3 semaines.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Recherche & concepts logo", quantity: 1, unitPrice: 120000 },
      { description: "Charte graphique", quantity: 1, unitPrice: 90000 },
      { description: "Déclinaisons supports", quantity: 1, unitPrice: 60000 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing / réseaux",
    title: "Gestion de vos réseaux sociaux",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vos réseaux sociaux sont irréguliers et ne génèrent ni engagement ni ventes. Le manque de constance et de stratégie freine votre visibilité.",
      },
      {
        title: "Solution proposée",
        body: "Je prends en charge votre stratégie et votre présence : calendrier éditorial, création de contenus et publication régulière, avec un suivi des résultats chaque mois.",
      },
      {
        title: "Livrables",
        body: "- Stratégie + calendrier éditorial mensuel\n- 12 publications / mois (visuels + textes)\n- Community management (réponses)\n- Rapport de performance mensuel",
      },
      {
        title: "Planning",
        body: "Engagement mensuel reconductible. Démarrage sous 5 jours ouvrés après signature.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Gestion réseaux sociaux (forfait mensuel)", quantity: 1, unitPrice: 200000 },
    ],
    tiers: [
      {
        name: "Starter",
        price: 150000,
        features: ["8 posts / mois", "1 réseau", "Rapport mensuel"],
      },
      {
        name: "Croissance",
        price: 300000,
        highlighted: true,
        features: ["16 posts / mois", "2 réseaux", "Stories", "Community management"],
      },
      {
        name: "Performance",
        price: 500000,
        features: ["Posts illimités", "3 réseaux", "Publicité incluse", "Reporting avancé"],
      },
    ],
  },
  {
    id: "consulting",
    label: "Conseil / formation",
    title: "Mission de conseil",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vous faites face à un enjeu que vos équipes n'ont pas le temps ou l'expertise de traiter, ce qui ralentit votre croissance.",
      },
      {
        title: "Solution proposée",
        body: "Je vous accompagne avec une mission cadrée : diagnostic, recommandations actionnables et accompagnement à la mise en œuvre.",
      },
      {
        title: "Livrables",
        body: "- Diagnostic écrit\n- Plan d'action priorisé\n- Sessions d'accompagnement\n- Support de synthèse",
      },
      {
        title: "Planning",
        body: "Phase 1 : diagnostic (1 semaine). Phase 2 : recommandations (1 semaine). Phase 3 : accompagnement (selon forfait).",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Journée de conseil", quantity: 3, unitPrice: 150000 },
    ],
  },
  {
    id: "photo",
    label: "Photo / vidéo",
    title: "Prestation photo / vidéo",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vos visuels actuels ne mettent pas en valeur vos produits/services et nuisent à vos ventes en ligne.",
      },
      {
        title: "Solution proposée",
        body: "Je réalise une séance professionnelle (préparation, prise de vue, retouche) pour des visuels prêts à l'emploi sur votre site et vos réseaux.",
      },
      {
        title: "Livrables",
        body: "- Séance photo/vidéo (½ journée)\n- Sélection + retouche de 20 visuels\n- Formats web + réseaux sociaux\n- Livraison sous 7 jours",
      },
      {
        title: "Planning",
        body: "Séance planifiée sous 10 jours. Livraison des fichiers retouchés sous 7 jours après la séance.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Séance photo (½ journée)", quantity: 1, unitPrice: 120000 },
      { description: "Retouche (20 visuels)", quantity: 1, unitPrice: 80000 },
    ],
  },
];
