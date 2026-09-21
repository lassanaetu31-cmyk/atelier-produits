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
  {
    id: "rh",
    label: "RH / recrutement",
    title: "Accompagnement recrutement & RH",
    sections: [
      {
        title: "Contexte & problème",
        body: "Recruter les bons profils et gérer le personnel vous prend un temps que vous n'avez pas, avec le risque d'erreurs de casting coûteuses et de non-conformité.",
      },
      {
        title: "Solution proposée",
        body: "Je prends en charge le processus de bout en bout : définition du besoin, sourcing ciblé, présélection, entretiens et intégration, en sécurisant la partie administrative.",
      },
      {
        title: "Livrables",
        body: "- Fiche de poste validée\n- Short-list de candidats qualifiés\n- Comptes-rendus d'entretien\n- Modèles de contrat et procédure d'onboarding",
      },
      {
        title: "Planning",
        body: "Semaine 1 : cadrage + sourcing. Semaines 2-3 : entretiens + short-list. Semaine 4 : sélection finale et intégration.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Définition du besoin & fiche de poste", quantity: 1, unitPrice: 100000 },
      { description: "Sourcing & présélection", quantity: 1, unitPrice: 250000 },
      { description: "Entretiens & short-list", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Recrutement", price: 350000, features: ["1 poste", "Short-list 3 profils", "Grille d'entretien"] },
      {
        name: "Recrutement +",
        price: 600000,
        highlighted: true,
        features: ["1 poste", "Short-list 5 profils", "Intégration", "Garantie remplacement"],
      },
      { name: "RH externalisée", price: 400000, features: ["Forfait mensuel", "Paie & contrats", "Conformité", "Support"] },
    ],
  },
  {
    id: "immobilier",
    label: "Immobilier",
    title: "Mandat de vente / mise en location de votre bien",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vendre ou louer votre bien au bon prix et rapidement demande de l'expertise, de la visibilité et du temps pour gérer les visites et la négociation.",
      },
      {
        title: "Solution proposée",
        body: "Je m'occupe de tout : estimation réaliste, mise en valeur du bien, diffusion multi-plateformes, organisation des visites, négociation et accompagnement jusqu'à la signature.",
      },
      {
        title: "Livrables",
        body: "- Estimation argumentée du bien\n- Reportage photo + annonce professionnelle\n- Diffusion sur les canaux clés + réseaux\n- Comptes-rendus de visites\n- Accompagnement à la signature",
      },
      {
        title: "Planning",
        body: "Semaine 1 : estimation, photos et annonce. À partir de la semaine 2 : diffusion et visites. Négociation et signature dès qu'une offre est retenue.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Estimation & dossier de vente", quantity: 1, unitPrice: 100000 },
      { description: "Reportage photo & annonce pro", quantity: 1, unitPrice: 80000 },
      { description: "Diffusion, visites & négociation", quantity: 1, unitPrice: 250000 },
    ],
    tiers: [
      { name: "Diffusion", price: 150000, features: ["Annonce pro", "Photos", "Diffusion 30 jours"] },
      {
        name: "Mandat complet",
        price: 500000,
        highlighted: true,
        features: ["Estimation", "Photos + annonce", "Visites & négociation", "Suivi signature"],
      },
      { name: "Gestion locative", price: 60000, features: ["Forfait mensuel", "Encaissement loyers", "Suivi locataire", "États des lieux"] },
    ],
  },
  {
    id: "evenementiel",
    label: "Événementiel",
    title: "Organisation de votre événement",
    sections: [
      {
        title: "Contexte & problème",
        body: "Organiser un événement réussi demande de coordonner de nombreux prestataires et une logistique serrée, sous forte pression le jour J.",
      },
      {
        title: "Solution proposée",
        body: "Je conçois et coordonne votre événement de A à Z : concept, budget, sélection des prestataires, logistique et coordination sur place le jour J.",
      },
      {
        title: "Livrables",
        body: "- Concept + budget détaillé\n- Sélection et gestion des prestataires\n- Rétroplanning logistique\n- Coordination sur place le jour J",
      },
      {
        title: "Planning",
        body: "Selon la date de l'événement : cadrage, réservation des prestataires, préparation, puis coordination le jour J.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Conception & budget", quantity: 1, unitPrice: 150000 },
      { description: "Coordination prestataires", quantity: 1, unitPrice: 200000 },
      { description: "Coordination jour J", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Conseil", price: 150000, features: ["Concept", "Budget", "Liste prestataires"] },
      { name: "Coordination", price: 400000, highlighted: true, features: ["Concept + budget", "Gestion prestataires", "Jour J"] },
      { name: "Clé en main", price: 800000, features: ["Tout inclus", "Décoration", "Équipe sur place", "Gestion imprévus"] },
    ],
  },
  {
    id: "btp",
    label: "BTP / travaux",
    title: "Devis travaux",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vous avez besoin de travaux réalisés dans les règles de l'art, dans les délais et le budget annoncés, sans mauvaises surprises.",
      },
      {
        title: "Solution proposée",
        body: "Après étude sur site, je vous propose une exécution maîtrisée : matériaux de qualité, main d'œuvre qualifiée, suivi de chantier et réception dans les délais.",
      },
      {
        title: "Livrables",
        body: "- Métré et étude technique\n- Fournitures et matériaux\n- Exécution des travaux\n- Réception de chantier + garantie",
      },
      {
        title: "Planning",
        body: "Démarrage à réception de l'acompte. Durée du chantier estimée selon l'ampleur des travaux, avec points d'étape réguliers.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Étude & métré", quantity: 1, unitPrice: 150000 },
      { description: "Fournitures & matériaux", quantity: 1, unitPrice: 1200000 },
      { description: "Main d'œuvre & exécution", quantity: 1, unitPrice: 900000 },
    ],
  },
  {
    id: "traiteur",
    label: "Traiteur / restauration",
    title: "Prestation traiteur",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vous voulez régaler vos invités avec un service impeccable, sans avoir à gérer la cuisine, le service et la logistique le jour de l'événement.",
      },
      {
        title: "Solution proposée",
        body: "Je propose un menu adapté à votre événement et votre budget, avec préparation, dressage, service et matériel — vous n'avez qu'à profiter.",
      },
      {
        title: "Livrables",
        body: "- Menu personnalisé (entrée, plat, dessert)\n- Personnel de service\n- Vaisselle et matériel\n- Nettoyage après service",
      },
      {
        title: "Planning",
        body: "Menu validé et acompte au plus tard 7 jours avant. Livraison et service le jour de l'événement.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Menu (par personne)", quantity: 50, unitPrice: 7500 },
      { description: "Service & personnel", quantity: 1, unitPrice: 100000 },
      { description: "Location matériel & vaisselle", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "coaching",
    label: "Coaching",
    title: "Programme d'accompagnement",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vous avez un objectif à atteindre mais manquez de méthode, de recul ou de constance pour le tenir dans la durée.",
      },
      {
        title: "Solution proposée",
        body: "Je vous accompagne avec un programme structuré : objectifs clairs, séances régulières, exercices concrets et suivi entre les séances.",
      },
      {
        title: "Livrables",
        body: "- Bilan initial + objectifs\n- Séances individuelles\n- Plan d'action personnalisé\n- Suivi et supports entre séances",
      },
      {
        title: "Planning",
        body: "Programme sur plusieurs semaines, à raison d'une séance par semaine, avec un point d'étape à mi-parcours.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Séance individuelle", quantity: 6, unitPrice: 25000 },
      { description: "Supports & suivi", quantity: 1, unitPrice: 50000 },
    ],
    tiers: [
      { name: "Découverte", price: 75000, features: ["3 séances", "Plan d'action"] },
      { name: "Programme", price: 200000, highlighted: true, features: ["8 séances", "Supports", "Suivi WhatsApp"] },
      { name: "Intensif", price: 350000, features: ["12 séances", "Suivi illimité", "Bilan final"] },
    ],
  },
  {
    id: "compta",
    label: "Comptabilité / juridique",
    title: "Mission comptable & conseil",
    sections: [
      {
        title: "Contexte & problème",
        body: "La gestion comptable et les obligations déclaratives vous font perdre du temps et vous exposent à des erreurs et pénalités.",
      },
      {
        title: "Solution proposée",
        body: "Je prends en charge votre comptabilité et vos déclarations, avec un conseil régulier pour piloter votre activité en toute sérénité.",
      },
      {
        title: "Livrables",
        body: "- Tenue comptable à jour\n- Déclarations fiscales et sociales\n- États financiers périodiques\n- Conseil et points réguliers",
      },
      {
        title: "Planning",
        body: "Prestation mensuelle reconductible. Reprise de l'existant le premier mois, puis suivi régulier.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Tenue comptable (forfait mensuel)", quantity: 1, unitPrice: 150000 },
      { description: "Déclarations fiscales & sociales", quantity: 1, unitPrice: 100000 },
      { description: "Conseil & accompagnement", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "it",
    label: "Informatique / maintenance",
    title: "Contrat de maintenance informatique",
    sections: [
      {
        title: "Contexte & problème",
        body: "Les pannes et lenteurs informatiques bloquent votre activité, et la sécurité de vos données n'est pas garantie.",
      },
      {
        title: "Solution proposée",
        body: "Je mets votre parc à niveau puis assure une maintenance préventive et un support réactif pour garder vos outils fiables et sécurisés.",
      },
      {
        title: "Livrables",
        body: "- Audit & mise en conformité\n- Sauvegardes et sécurité\n- Maintenance préventive mensuelle\n- Support et dépannage",
      },
      {
        title: "Planning",
        body: "Audit et mise à niveau le premier mois, puis contrat de maintenance mensuel reconductible.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Audit & mise en conformité", quantity: 1, unitPrice: 150000 },
      { description: "Maintenance (forfait mensuel)", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      { name: "Basique", price: 60000, features: ["Maintenance mensuelle", "Support par message", "Sauvegardes"] },
      { name: "Pro", price: 120000, highlighted: true, features: ["Support prioritaire", "Intervention sur site", "Sécurité renforcée"] },
      { name: "Illimité", price: 250000, features: ["Support illimité", "Astreinte", "Supervision 24/7"] },
    ],
  },
  {
    id: "formation",
    label: "Formation pro",
    title: "Programme de formation",
    sections: [
      {
        title: "Contexte & problème",
        body: "Vos équipes doivent monter en compétences rapidement, mais les formations génériques sont peu adaptées à votre réalité.",
      },
      {
        title: "Solution proposée",
        body: "Je conçois une formation sur mesure, alternant théorie et pratique, avec des supports et une évaluation pour ancrer les acquis.",
      },
      {
        title: "Livrables",
        body: "- Programme pédagogique sur mesure\n- Animation des sessions\n- Supports de formation\n- Évaluation + attestation",
      },
      {
        title: "Planning",
        body: "Conception validée avant démarrage, puis animation sur les journées convenues et évaluation en fin de parcours.",
      },
      { title: "Conditions (CGV)", body: CGV },
    ],
    services: [
      { description: "Conception pédagogique", quantity: 1, unitPrice: 150000 },
      { description: "Animation (journée)", quantity: 2, unitPrice: 150000 },
      { description: "Supports & évaluation", quantity: 1, unitPrice: 60000 },
    ],
  },
];

/**
 * Bibliothèque de sections suggérées, piochables en 1 clic dans l'éditeur
 * (en plus des sections du modèle). Adaptez le texte à votre cas.
 */
export const EXTRA_SECTIONS: ProposalSection[] = [
  {
    title: "À propos de moi",
    body: "Présentez-vous en quelques lignes : votre parcours, votre spécialité et ce qui vous distingue. Rassurez le client sur le fait qu'il est entre de bonnes mains.",
  },
  {
    title: "Références & réalisations",
    body: "Citez 2 ou 3 projets ou clients représentatifs, avec un résultat concret à chaque fois (ex. « +30% de ventes », « livré en 3 semaines »).",
  },
  {
    title: "Notre méthodologie",
    body: "Décrivez vos étapes de travail (cadrage → réalisation → validation → livraison). Un process clair rassure et justifie votre prix.",
  },
  {
    title: "Pourquoi nous choisir",
    body: "Listez 3 à 5 raisons de vous faire confiance : expertise, réactivité, proximité, garantie de résultat, accompagnement après livraison.",
  },
  {
    title: "Modalités de paiement",
    body: "Précisez l'acompte à la commande, le solde à la livraison et les moyens de paiement acceptés (mobile money, virement, espèces).",
  },
  {
    title: "Garanties",
    body: "Indiquez ce que vous garantissez : révisions incluses, respect des délais, satisfaction, support après livraison pendant une période donnée.",
  },
  {
    title: "Prochaines étapes",
    body: "Expliquez comment démarrer : validation de cette proposition, versement de l'acompte, réunion de lancement. Facilitez le passage à l'action.",
  },
  {
    title: "Questions fréquentes",
    body: "Répondez d'avance aux 2-3 objections les plus courantes (délais, prix, propriété des livrables) pour lever les derniers freins.",
  },
];
