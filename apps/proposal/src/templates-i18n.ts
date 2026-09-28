import type { LangCode } from "./i18n/translations";
import {
  TEMPLATES as TEMPLATES_FR,
  EXTRA_SECTIONS as EXTRA_SECTIONS_FR,
  SECTION_VARIANTS as SECTION_VARIANTS_FR,
  type ProposalTemplate,
} from "./templates";
import type { ProposalSection } from "@atelier/core";

const CGV_EN =
  "Quote valid for the duration indicated. Deposit due on order, balance on delivery. " +
  "Work starts upon receipt of deposit. Any out-of-scope work will be covered by a change order.";

const TEMPLATES_EN: ProposalTemplate[] = [
  {
    id: "blank",
    label: "Blank",
    title: "",
    sections: [
      { title: "Context & problem", body: "" },
      { title: "Proposed solution", body: "" },
      { title: "Deliverables", body: "" },
      { title: "Timeline", body: "" },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [{ description: "Service", quantity: 1, unitPrice: 250000 }],
  },
  {
    id: "web",
    label: "Website / dev",
    title: "Your new website",
    sections: [
      {
        title: "Context & problem",
        body: "Your current online presence is not converting visitors into clients and does not reflect the quality of your offer. You are losing prospects due to a slow, unclear, or untrustworthy website.",
      },
      {
        title: "Proposed solution",
        body: "I design and develop a modern, fast, mobile-optimised website built to convert: clear structure, calls to action, basic SEO, and integrated WhatsApp contact.",
      },
      {
        title: "Deliverables",
        body: "- Validated mockup before development\n- Responsive site (5 pages)\n- Contact form + WhatsApp\n- Basic on-page SEO\n- Handover training (30 min)",
      },
      {
        title: "Timeline",
        body: "Week 1: scoping + mockup. Weeks 2–3: development. Week 4: content, testing, and go-live. Estimated total: 4 weeks.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Design & mockup", quantity: 1, unitPrice: 150000 },
      { description: "Website development (5 pages)", quantity: 1, unitPrice: 450000 },
      { description: "Go-live + training", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      { name: "Essential", price: 400000, features: ["3-page site", "Mobile responsive", "WhatsApp contact"] },
      { name: "Pro", price: 700000, highlighted: true, features: ["5-page site", "Basic SEO", "Blog", "Training included"] },
      { name: "Premium", price: 1200000, features: ["Unlimited pages", "Advanced SEO", "3-month maintenance", "Priority support"] },
    ],
  },
  {
    id: "design",
    label: "Design / branding",
    title: "Your brand visual identity",
    sections: [
      {
        title: "Context & problem",
        body: "Your brand lacks visual consistency: logo, colours, and materials do not project a professional, memorable image, undermining your credibility.",
      },
      {
        title: "Proposed solution",
        body: "I create a complete, cohesive visual identity: logo, colour palette, typography, and key collateral — delivered with a simple brand guide.",
      },
      {
        title: "Deliverables",
        body: "- Logo (3 concepts, 2 revision rounds)\n- Brand guide (colours, typography, usage)\n- Source files + web/print exports\n- Social media templates",
      },
      {
        title: "Timeline",
        body: "Week 1: research + directions. Week 2: selection + revisions. Week 3: finalisation and file delivery. Estimated: 3 weeks.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Logo research & concepts", quantity: 1, unitPrice: 120000 },
      { description: "Brand guide", quantity: 1, unitPrice: 90000 },
      { description: "Collateral adaptations", quantity: 1, unitPrice: 60000 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing / social media",
    title: "Social media management",
    sections: [
      {
        title: "Context & problem",
        body: "Your social media presence is inconsistent and generates neither engagement nor sales. Lack of strategy and regularity is limiting your visibility.",
      },
      {
        title: "Proposed solution",
        body: "I take charge of your strategy and presence: editorial calendar, content creation, regular publishing, and monthly performance reporting.",
      },
      {
        title: "Deliverables",
        body: "- Strategy + monthly editorial calendar\n- 12 posts / month (visuals + copy)\n- Community management (replies)\n- Monthly performance report",
      },
      {
        title: "Timeline",
        body: "Monthly rolling engagement. Start within 5 business days of signing.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Social media management (monthly flat fee)", quantity: 1, unitPrice: 200000 },
    ],
    tiers: [
      { name: "Starter", price: 150000, features: ["8 posts / month", "1 network", "Monthly report"] },
      { name: "Growth", price: 300000, highlighted: true, features: ["16 posts / month", "2 networks", "Stories", "Community management"] },
      { name: "Performance", price: 500000, features: ["Unlimited posts", "3 networks", "Ads included", "Advanced reporting"] },
    ],
  },
  {
    id: "consulting",
    label: "Consulting / training",
    title: "Consulting engagement",
    sections: [
      {
        title: "Context & problem",
        body: "You are facing a challenge your teams do not have the time or expertise to address, which is slowing your growth.",
      },
      {
        title: "Proposed solution",
        body: "I support you with a structured engagement: diagnosis, actionable recommendations, and implementation support.",
      },
      {
        title: "Deliverables",
        body: "- Written diagnosis\n- Prioritised action plan\n- Support sessions\n- Summary document",
      },
      {
        title: "Timeline",
        body: "Phase 1: diagnosis (1 week). Phase 2: recommendations (1 week). Phase 3: support (as per package).",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Consulting day", quantity: 3, unitPrice: 150000 },
    ],
  },
  {
    id: "photo",
    label: "Photo / video",
    title: "Photo / video production",
    sections: [
      {
        title: "Context & problem",
        body: "Your current visuals do not showcase your products/services well and are hurting your online sales.",
      },
      {
        title: "Proposed solution",
        body: "I deliver a professional shoot (prep, photography, retouching) for ready-to-use visuals on your website and social media.",
      },
      {
        title: "Deliverables",
        body: "- Photo/video session (½ day)\n- Selection + retouching of 20 visuals\n- Web + social media formats\n- Delivery within 7 days",
      },
      {
        title: "Timeline",
        body: "Session scheduled within 10 days. Retouched files delivered within 7 days after the session.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Photo session (½ day)", quantity: 1, unitPrice: 120000 },
      { description: "Retouching (20 visuals)", quantity: 1, unitPrice: 80000 },
    ],
  },
  {
    id: "rh",
    label: "HR / recruitment",
    title: "Recruitment & HR support",
    sections: [
      {
        title: "Context & problem",
        body: "Finding the right profiles and managing staff takes time you do not have, with the risk of costly mis-hires and non-compliance.",
      },
      {
        title: "Proposed solution",
        body: "I manage the end-to-end process: defining the role, targeted sourcing, pre-screening, interviews, and onboarding — securing the administrative side.",
      },
      {
        title: "Deliverables",
        body: "- Validated job description\n- Short-list of qualified candidates\n- Interview reports\n- Contract templates and onboarding procedure",
      },
      {
        title: "Timeline",
        body: "Week 1: scoping + sourcing. Weeks 2–3: interviews + short-list. Week 4: final selection and onboarding.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Role definition & job description", quantity: 1, unitPrice: 100000 },
      { description: "Sourcing & pre-screening", quantity: 1, unitPrice: 250000 },
      { description: "Interviews & short-list", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Recruitment", price: 350000, features: ["1 role", "Short-list of 3 profiles", "Interview guide"] },
      { name: "Recruitment+", price: 600000, highlighted: true, features: ["1 role", "Short-list of 5 profiles", "Onboarding", "Replacement guarantee"] },
      { name: "Outsourced HR", price: 400000, features: ["Monthly flat fee", "Payroll & contracts", "Compliance", "Support"] },
    ],
  },
  {
    id: "immobilier",
    label: "Real estate",
    title: "Sale / rental mandate for your property",
    sections: [
      {
        title: "Context & problem",
        body: "Selling or renting your property at the right price and quickly requires expertise, visibility, and time to manage viewings and negotiation.",
      },
      {
        title: "Proposed solution",
        body: "I handle everything: realistic valuation, property staging, multi-platform listing, viewing organisation, negotiation, and support through to signing.",
      },
      {
        title: "Deliverables",
        body: "- Argued property valuation\n- Photo shoot + professional listing\n- Listing on key channels + networks\n- Viewing reports\n- Support through signing",
      },
      {
        title: "Timeline",
        body: "Week 1: valuation, photos, and listing. From week 2: distribution and viewings. Negotiation and signing once an offer is accepted.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Valuation & sale file", quantity: 1, unitPrice: 100000 },
      { description: "Photo shoot & professional listing", quantity: 1, unitPrice: 80000 },
      { description: "Distribution, viewings & negotiation", quantity: 1, unitPrice: 250000 },
    ],
    tiers: [
      { name: "Distribution", price: 150000, features: ["Professional listing", "Photos", "30-day distribution"] },
      { name: "Full mandate", price: 500000, highlighted: true, features: ["Valuation", "Photos + listing", "Viewings & negotiation", "Signing support"] },
      { name: "Property management", price: 60000, features: ["Monthly fee", "Rent collection", "Tenant follow-up", "Inventories"] },
    ],
  },
  {
    id: "evenementiel",
    label: "Events",
    title: "Event organisation",
    sections: [
      {
        title: "Context & problem",
        body: "Running a successful event means coordinating many suppliers and tight logistics, under high pressure on the day.",
      },
      {
        title: "Proposed solution",
        body: "I design and coordinate your event from A to Z: concept, budget, supplier selection, logistics, and on-site coordination on the day.",
      },
      {
        title: "Deliverables",
        body: "- Concept + detailed budget\n- Supplier selection and management\n- Logistics schedule\n- On-site coordination on the day",
      },
      {
        title: "Timeline",
        body: "Based on the event date: scoping, supplier booking, preparation, then on-site coordination on the day.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Concept & budget", quantity: 1, unitPrice: 150000 },
      { description: "Supplier coordination", quantity: 1, unitPrice: 200000 },
      { description: "On-site coordination", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Advisory", price: 150000, features: ["Concept", "Budget", "Supplier list"] },
      { name: "Coordination", price: 400000, highlighted: true, features: ["Concept + budget", "Supplier management", "Day-of coordination"] },
      { name: "Full service", price: 800000, features: ["Everything included", "Décor", "On-site team", "Issue management"] },
    ],
  },
  {
    id: "btp",
    label: "Construction / works",
    title: "Works quote",
    sections: [
      {
        title: "Context & problem",
        body: "You need works carried out to professional standards, on time and on budget, with no unpleasant surprises.",
      },
      {
        title: "Proposed solution",
        body: "After an on-site survey, I propose a controlled execution: quality materials, skilled labour, site supervision, and handover on schedule.",
      },
      {
        title: "Deliverables",
        body: "- Survey and technical study\n- Supplies and materials\n- Works execution\n- Site handover + warranty",
      },
      {
        title: "Timeline",
        body: "Start upon receipt of deposit. Site duration estimated by scope, with regular progress updates.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Survey & study", quantity: 1, unitPrice: 150000 },
      { description: "Supplies & materials", quantity: 1, unitPrice: 1200000 },
      { description: "Labour & execution", quantity: 1, unitPrice: 900000 },
    ],
  },
  {
    id: "traiteur",
    label: "Catering",
    title: "Catering service",
    sections: [
      {
        title: "Context & problem",
        body: "You want to delight your guests with impeccable service, without having to manage the cooking, service, and logistics on the day.",
      },
      {
        title: "Proposed solution",
        body: "I offer a menu tailored to your event and budget, with preparation, dressing, service, and equipment — you just enjoy the moment.",
      },
      {
        title: "Deliverables",
        body: "- Personalised menu (starter, main, dessert)\n- Service staff\n- Tableware and equipment\n- Post-service clean-up",
      },
      {
        title: "Timeline",
        body: "Menu confirmed and deposit paid at least 7 days before. Delivery and service on the event day.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Menu (per person)", quantity: 50, unitPrice: 7500 },
      { description: "Service & staff", quantity: 1, unitPrice: 100000 },
      { description: "Equipment & tableware rental", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "coaching",
    label: "Coaching",
    title: "Coaching programme",
    sections: [
      {
        title: "Context & problem",
        body: "You have a goal to reach but lack the method, perspective, or consistency to sustain it over time.",
      },
      {
        title: "Proposed solution",
        body: "I support you with a structured programme: clear objectives, regular sessions, concrete exercises, and between-session follow-up.",
      },
      {
        title: "Deliverables",
        body: "- Initial assessment + objectives\n- Individual sessions\n- Personalised action plan\n- Between-session support and materials",
      },
      {
        title: "Timeline",
        body: "Multi-week programme, one session per week, with a mid-programme check-in.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Individual session", quantity: 6, unitPrice: 25000 },
      { description: "Materials & follow-up", quantity: 1, unitPrice: 50000 },
    ],
    tiers: [
      { name: "Discovery", price: 75000, features: ["3 sessions", "Action plan"] },
      { name: "Programme", price: 200000, highlighted: true, features: ["8 sessions", "Materials", "WhatsApp follow-up"] },
      { name: "Intensive", price: 350000, features: ["12 sessions", "Unlimited follow-up", "Final assessment"] },
    ],
  },
  {
    id: "compta",
    label: "Accounting / legal",
    title: "Accounting & advisory engagement",
    sections: [
      {
        title: "Context & problem",
        body: "Managing accounts and filing obligations takes time and exposes you to errors and penalties.",
      },
      {
        title: "Proposed solution",
        body: "I handle your bookkeeping and filings, with ongoing advice to run your business with peace of mind.",
      },
      {
        title: "Deliverables",
        body: "- Up-to-date bookkeeping\n- Tax and social filings\n- Periodic financial statements\n- Advisory and regular reviews",
      },
      {
        title: "Timeline",
        body: "Monthly rolling engagement. First month: catch-up on existing records; then regular ongoing maintenance.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Bookkeeping (monthly flat fee)", quantity: 1, unitPrice: 150000 },
      { description: "Tax & social filings", quantity: 1, unitPrice: 100000 },
      { description: "Advisory & support", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "it",
    label: "IT / maintenance",
    title: "IT maintenance contract",
    sections: [
      {
        title: "Context & problem",
        body: "IT failures and slowdowns block your operations, and the security of your data is not guaranteed.",
      },
      {
        title: "Proposed solution",
        body: "I upgrade your systems then provide preventive maintenance and reactive support to keep your tools reliable and secure.",
      },
      {
        title: "Deliverables",
        body: "- Audit & compliance\n- Backups and security\n- Monthly preventive maintenance\n- Support and troubleshooting",
      },
      {
        title: "Timeline",
        body: "Audit and upgrade in month 1, then monthly rolling maintenance contract.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Audit & compliance", quantity: 1, unitPrice: 150000 },
      { description: "Maintenance (monthly flat fee)", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      { name: "Basic", price: 60000, features: ["Monthly maintenance", "Message support", "Backups"] },
      { name: "Pro", price: 120000, highlighted: true, features: ["Priority support", "On-site visit", "Enhanced security"] },
      { name: "Unlimited", price: 250000, features: ["Unlimited support", "On-call", "24/7 monitoring"] },
    ],
  },
  {
    id: "formation",
    label: "Professional training",
    title: "Training programme",
    sections: [
      {
        title: "Context & problem",
        body: "Your teams need to upskill quickly, but generic courses are poorly suited to your reality.",
      },
      {
        title: "Proposed solution",
        body: "I design a bespoke training, alternating theory and practice, with materials and an assessment to anchor learning.",
      },
      {
        title: "Deliverables",
        body: "- Bespoke training programme\n- Session facilitation\n- Training materials\n- Assessment + certificate",
      },
      {
        title: "Timeline",
        body: "Programme validated before start, then sessions run on agreed days with a final assessment.",
      },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Instructional design", quantity: 1, unitPrice: 150000 },
      { description: "Facilitation (day)", quantity: 2, unitPrice: 150000 },
      { description: "Materials & assessment", quantity: 1, unitPrice: 60000 },
    ],
  },
];

const EXTRA_SECTIONS_EN: ProposalSection[] = [
  {
    title: "About me",
    body: "Introduce yourself in a few lines: your background, your speciality, and what sets you apart. Reassure the client they are in good hands.",
  },
  {
    title: "References & past work",
    body: "Mention 2 or 3 representative projects or clients, each with a concrete result (e.g. '+30% in sales', 'delivered in 3 weeks').",
  },
  {
    title: "Our methodology",
    body: "Describe your working steps (scoping → execution → validation → delivery). A clear process reassures and justifies your price.",
  },
  {
    title: "Why choose us",
    body: "List 3 to 5 reasons to trust you: expertise, responsiveness, proximity, result guarantee, post-delivery support.",
  },
  {
    title: "Payment terms",
    body: "Specify the deposit on order, balance on delivery, and accepted payment methods (mobile money, bank transfer, cash).",
  },
  {
    title: "Guarantees",
    body: "State what you guarantee: revisions included, on-time delivery, satisfaction, post-delivery support for a given period.",
  },
  {
    title: "Next steps",
    body: "Explain how to start: approve this proposal, pay the deposit, kick-off meeting. Make it easy to take action.",
  },
  {
    title: "Frequently asked questions",
    body: "Pre-answer the 2–3 most common objections (timelines, price, ownership of deliverables) to remove last-minute hesitation.",
  },
];

const CGV_EN_VARIANT2 = "50% deposit on order, balance on delivery. Reasonable revisions included; beyond that, billed separately.";
const CGV_EN_VARIANT3 = "Payment due within 15 days of invoice. Late payment may incur penalties as permitted by applicable law.";
const CGV_EN_VARIANT4 = "Deliverables remain the property of the service provider until full payment; rights are transferred to the client after full settlement.";
const CGV_EN_VARIANT5 = "Prices fixed for the validity period of the offer. Ancillary costs (travel, licences, printing) billed separately if applicable.";

const SECTION_VARIANTS_EN: Record<string, string[]> = {
  "Context & problem": [
    "You are losing time and opportunities due to the lack of a solution adapted to your current situation.",
    "Your organisation faces a challenge that is slowing your growth and consuming valuable resources.",
    "The absence of internal tools or expertise exposes you to errors and a loss of efficiency.",
    "Your clients expect a level of quality and responsiveness that your current setup cannot deliver.",
    "The problem is not a lack of will, but the absence of a structured approach to move things forward.",
  ],
  "Proposed solution": [
    "I offer a turnkey service, designed for your reality, with measurable results at every stage.",
    "My approach combines a proven method with adaptation to your context, for a concrete and lasting result.",
    "I take charge of the entire project: you save time and focus on your core business.",
    "We move forward in steps validated together, to stay in control of budget, timelines, and quality.",
    "A simple, professional, and scalable solution that meets your immediate need while preparing for what's next.",
  ],
  "Deliverables": [
    "- Main deliverable per agreed specification\n- Getting-started documentation\n- Revisions included\n- Post-delivery support",
    "- A completed and tested solution\n- Source files\n- User guide\n- A training session",
    "- Service delivered on time\n- Regular progress updates\n- Final delivery + warranty",
    "- Ready-to-use output\n- Formats adapted to your uses\n- Onboarding support",
    "- All agreed items\n- A clear summary\n- Transfer of rights to deliverables after full payment",
  ],
  "Timeline": [
    "Start upon receipt of deposit. Delivery estimated by scope, with regular check-ins.",
    "Project organised in phases: scoping, execution, validation, delivery. Timelines confirmed at kick-off.",
    "A quick first version, then adjustments until your final sign-off.",
    "Schedule adapted to your constraints, with a firm delivery date agreed together.",
    "Recurring rolling engagement, start within a few days of signing.",
  ],
  "Terms & conditions": [
    CGV_EN,
    CGV_EN_VARIANT2,
    CGV_EN_VARIANT3,
    CGV_EN_VARIANT4,
    CGV_EN_VARIANT5,
  ],
};

function pickLang(lang: LangCode): "fr" | "en" {
  return lang === "fr" ? "fr" : "en";
}

export function getTemplates(lang: LangCode): ProposalTemplate[] {
  return pickLang(lang) === "fr" ? TEMPLATES_FR : TEMPLATES_EN;
}

export function getExtraSections(lang: LangCode): ProposalSection[] {
  return pickLang(lang) === "fr" ? EXTRA_SECTIONS_FR : EXTRA_SECTIONS_EN;
}

export function getSectionVariants(lang: LangCode): Record<string, string[]> {
  return pickLang(lang) === "fr" ? SECTION_VARIANTS_FR : SECTION_VARIANTS_EN;
}
