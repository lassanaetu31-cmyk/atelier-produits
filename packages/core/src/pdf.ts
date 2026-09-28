// Génération PDF client-side. Coeur réutilisé : Invoice, Devis, Proposition, Catalogue, CV.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMoney, type Currency, type LineItem, type Totals } from "./money";

export interface Party {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface DocumentData {
  kind: "Facture" | "Devis" | "Reçu" | "Proposition";
  number: string;
  date: string;
  currency: Currency;
  logoDataUrl?: string;
  from: Party;
  to: Party;
  items: LineItem[];
  totals: Totals;
  notes?: string;
  accentColor?: string; // hex
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Construit le PDF d'un document commercial et le retourne (jsPDF). */
export function buildDocumentPdf(data: DocumentData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const accent = hexToRgb(data.accentColor ?? "#2563eb");
  const M = 15;
  let y = M;

  if (data.logoDataUrl) {
    try {
      const fmt = data.logoDataUrl.includes("image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(data.logoDataUrl, fmt, M, y, 28, 28);
    } catch {
      /* logo illisible: on ignore */
    }
  }

  doc.setFontSize(22);
  doc.setTextColor(...accent);
  doc.text(data.kind.toUpperCase(), 195, y + 8, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`N° ${data.number}`, 195, y + 15, { align: "right" });
  doc.text(data.date, 195, y + 20, { align: "right" });

  y += 34;
  doc.setTextColor(20);
  doc.setFontSize(11);
  doc.text(data.from.name, M, y);
  doc.setFontSize(9);
  doc.setTextColor(90);
  const fromLines = [data.from.address, data.from.phone, data.from.email].filter(Boolean) as string[];
  fromLines.forEach((l, i) => doc.text(l, M, y + 5 + i * 4));

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Adressé à", 120, y);
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(data.to.name, 120, y + 5);
  doc.setFontSize(9);
  doc.setTextColor(90);
  const toLines = [data.to.address, data.to.phone, data.to.email].filter(Boolean) as string[];
  toLines.forEach((l, i) => doc.text(l, 120, y + 10 + i * 4));

  y += 30;
  autoTable(doc, {
    startY: y,
    head: [["Description", "Qté", "Prix unit.", "Total"]],
    body: data.items.map((it: LineItem) => [
      it.description,
      String(it.quantity),
      formatMoney(it.unitPrice, data.currency),
      formatMoney(it.quantity * it.unitPrice, data.currency),
    ]),
    theme: "striped",
    headStyles: { fillColor: accent, textColor: 255 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: M, right: M },
  });

  // @ts-expect-error lastAutoTable ajouté par le plugin
  let ty = (doc.lastAutoTable?.finalY ?? y) + 8;
  const t = data.totals;
  const rows: [string, number][] = [["Sous-total", t.subtotal]];
  if (t.discount) rows.push(["Remise", -t.discount]);
  if (t.tax) rows.push(["Taxe", t.tax]);
  if (t.shipping) rows.push(["Livraison", t.shipping]);
  doc.setFontSize(10);
  doc.setTextColor(60);
  rows.forEach(([label, val]) => {
    doc.text(label, 140, ty);
    doc.text(formatMoney(val, data.currency), 195, ty, { align: "right" });
    ty += 6;
  });
  doc.setDrawColor(...accent);
  doc.line(140, ty, 195, ty);
  ty += 6;
  doc.setFontSize(13);
  doc.setTextColor(...accent);
  doc.text("TOTAL", 140, ty);
  doc.text(formatMoney(t.total, data.currency), 195, ty, { align: "right" });

  if (data.notes) {
    ty += 14;
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(doc.splitTextToSize(data.notes, 180), M, ty);
  }

  return doc;
}

/** Déclenche le téléchargement du PDF. */
export function downloadDocumentPdf(data: DocumentData): void {
  const doc = buildDocumentPdf(data);
  doc.save(`${data.kind}-${data.number}.pdf`);
}

// ------------------------------------------------------------------
// Proposition commerciale (app Proposal Generator)
// ------------------------------------------------------------------

export interface ProposalSection {
  title: string;
  body: string;
}

export interface ProposalTier {
  name: string;
  price: number;
  features: string[];
  highlighted?: boolean;
}

export interface ProposalPdfLabels {
  document: string;       // "PROPOSITION" / "PROPOSAL"
  validFor: string;       // "Valable {n} jours" — {n} replaced with days
  preparedFor: string;    // "Préparé pour"
  tiers: string;          // "FORMULES"
  investment: string;     // "INVESTISSEMENT"
  colDesc: string;        // "Prestation"
  colQty: string;         // "Qté"
  colUnit: string;        // "Prix unit."
  colTotal: string;       // "Total"
  subtotal: string;       // "Sous-total"
  discount: string;       // "Remise"
  tax: string;            // "Taxe"
  shipping: string;       // "Frais"
  total: string;          // "TOTAL"
  deposit: string;        // "Acompte de {rate}% à la signature : {amount}"
  provider: string;       // "Le prestataire"
  clientApproval: string; // "Le client (bon pour accord)"
  acceptedOn: string;     // "Accepté le {date}"
  signHere: string;       // "Nom, date et signature"
}

const FR_LABELS: ProposalPdfLabels = {
  document: "PROPOSITION",
  validFor: "Valable {n} jours",
  preparedFor: "Préparé pour",
  tiers: "FORMULES",
  investment: "INVESTISSEMENT",
  colDesc: "Prestation",
  colQty: "Qté",
  colUnit: "Prix unit.",
  colTotal: "Total",
  subtotal: "Sous-total",
  discount: "Remise",
  tax: "Taxe",
  shipping: "Frais",
  total: "TOTAL",
  deposit: "Acompte de {rate}% à la signature : {amount}",
  provider: "Le prestataire",
  clientApproval: "Le client (bon pour accord)",
  acceptedOn: "Accepté le {date}",
  signHere: "Nom, date et signature",
};

export interface ProposalData {
  number: string;
  title: string;
  date: string;
  validityDays?: number;
  currency: Currency;
  logoDataUrl?: string;
  accentColor?: string;
  from: Party;
  to: Party;
  sections: ProposalSection[];
  tiers?: ProposalTier[];
  items: LineItem[];
  totals: Totals;
  depositRate?: number;
  notes?: string;
  acceptedName?: string;
  acceptedDate?: string;
  labels?: Partial<ProposalPdfLabels>;
}

/**
 * Construit une proposition commerciale (sections narratives + paliers optionnels
 * + tableau investissement + acompte + bloc signature). Gère les sauts de page.
 */
export function buildProposalPdf(data: ProposalData): jsPDF {
  const L: ProposalPdfLabels = { ...FR_LABELS, ...data.labels };
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const accent = hexToRgb(data.accentColor ?? "#2563eb");
  const M = 15;
  const PW = 210;
  const PH = 297;
  const bottom = PH - M;
  let y = M;

  // Réserve `h` mm de hauteur, saute de page si besoin.
  const ensure = (h: number) => {
    if (y + h > bottom) {
      doc.addPage();
      y = M;
    }
  };

  // En-tête
  if (data.logoDataUrl) {
    try {
      const fmt = data.logoDataUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(data.logoDataUrl, fmt, M, y, 26, 26);
    } catch {
      /* logo illisible */
    }
  }
  doc.setFontSize(22);
  doc.setTextColor(...accent);
  doc.text(L.document, PW - M, y + 8, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`N° ${data.number}`, PW - M, y + 15, { align: "right" });
  doc.text(data.date, PW - M, y + 20, { align: "right" });
  if (data.validityDays) {
    doc.text(L.validFor.replace("{n}", String(data.validityDays)), PW - M, y + 25, { align: "right" });
  }
  y += 34;

  // Titre du projet
  doc.setFontSize(16);
  doc.setTextColor(20);
  const titleLines = doc.splitTextToSize(data.title || "Proposition commerciale", PW - 2 * M);
  doc.text(titleLines, M, y);
  y += titleLines.length * 7 + 3;

  // Parties (émetteur / client)
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(data.from.name, M, y);
  doc.setFontSize(9);
  doc.setTextColor(90);
  const fromLines = [data.from.address, data.from.phone, data.from.email].filter(Boolean) as string[];
  fromLines.forEach((l, i) => doc.text(l, M, y + 5 + i * 4));

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(L.preparedFor, 120, y);
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(data.to.name, 120, y + 5);
  doc.setFontSize(9);
  doc.setTextColor(90);
  const toLines = [data.to.address, data.to.phone, data.to.email].filter(Boolean) as string[];
  toLines.forEach((l, i) => doc.text(l, 120, y + 10 + i * 4));

  y += Math.max(fromLines.length, toLines.length + 1) * 4 + 14;

  // Sections narratives (problème / solution / livrables / planning / CGV…)
  for (const s of data.sections) {
    if (!s.title?.trim() && !s.body?.trim()) continue;
    ensure(16);
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text((s.title || "").toUpperCase(), M, y);
    y += 2;
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.4);
    doc.line(M, y, M + 22, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(s.body || "", PW - 2 * M) as string[];
    for (const line of lines) {
      ensure(5);
      doc.text(line, M, y);
      y += 5;
    }
    y += 6;
  }

  // Paliers tarifaires optionnels (Essentiel / Pro / Premium)
  const tiers = (data.tiers ?? []).slice(0, 3);
  if (tiers.length) {
    ensure(14);
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text(L.tiers, M, y);
    y += 2;
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.4);
    doc.line(M, y, M + 22, y);
    y += 8;

    const gap = 6;
    const colW = (PW - 2 * M - (tiers.length - 1) * gap) / tiers.length;
    // Hauteur = max features
    const maxFeat = Math.max(...tiers.map((t) => t.features.filter(Boolean).length));
    const cardH = 26 + maxFeat * 5 + 4;
    ensure(cardH);
    tiers.forEach((t, i) => {
      const x = M + i * (colW + gap);
      if (t.highlighted) {
        doc.setFillColor(...accent);
        doc.roundedRect(x, y, colW, cardH, 2, 2, "F");
      } else {
        doc.setDrawColor(215, 215, 215);
        doc.roundedRect(x, y, colW, cardH, 2, 2);
      }
      const light = t.highlighted;
      doc.setFontSize(11);
      doc.setTextColor(...(light ? ([255, 255, 255] as [number, number, number]) : accent));
      doc.text(doc.splitTextToSize(t.name, colW - 6).slice(0, 1), x + 3, y + 8);
      doc.setFontSize(13);
      doc.setTextColor(...(light ? ([255, 255, 255] as [number, number, number]) : ([20, 20, 20] as [number, number, number])));
      doc.text(formatMoney(t.price, data.currency), x + 3, y + 17);
      doc.setFontSize(8.5);
      doc.setTextColor(...(light ? ([240, 240, 240] as [number, number, number]) : ([90, 90, 90] as [number, number, number])));
      let fy = y + 24;
      for (const f of t.features.filter(Boolean)) {
        const fl = doc.splitTextToSize(`• ${f}`, colW - 6).slice(0, 1);
        doc.text(fl, x + 3, fy);
        fy += 5;
      }
    });
    y += cardH + 8;
  }

  // Tableau investissement (services)
  if (data.items.length) {
    ensure(24);
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text(L.investment, M, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [[L.colDesc, L.colQty, L.colUnit, L.colTotal]],
      body: data.items.map((it: LineItem) => [
        it.description,
        String(it.quantity),
        formatMoney(it.unitPrice, data.currency),
        formatMoney(it.quantity * it.unitPrice, data.currency),
      ]),
      theme: "striped",
      headStyles: { fillColor: accent, textColor: 255 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
      margin: { left: M, right: M },
    });
    // @ts-expect-error lastAutoTable ajouté par le plugin
    y = (doc.lastAutoTable?.finalY ?? y) + 8;

    const t = data.totals;
    const rows: [string, number][] = [[L.subtotal, t.subtotal]];
    if (t.discount) rows.push([L.discount, -t.discount]);
    if (t.tax) rows.push([L.tax, t.tax]);
    if (t.shipping) rows.push([L.shipping, t.shipping]);
    ensure(rows.length * 6 + 20);
    doc.setFontSize(10);
    doc.setTextColor(60);
    rows.forEach(([label, val]) => {
      doc.text(label, 140, y);
      doc.text(formatMoney(val, data.currency), 195, y, { align: "right" });
      y += 6;
    });
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.4);
    doc.line(140, y, 195, y);
    y += 6;
    doc.setFontSize(13);
    doc.setTextColor(...accent);
    doc.text(L.total, 140, y);
    doc.text(formatMoney(t.total, data.currency), 195, y, { align: "right" });
    y += 8;
    if (data.depositRate) {
      const deposit = (t.total * data.depositRate) / 100;
      doc.setFontSize(9);
      doc.setTextColor(110);
      doc.text(
        L.deposit
          .replace("{rate}", String(data.depositRate))
          .replace("{amount}", formatMoney(deposit, data.currency)),
        195,
        y,
        { align: "right" },
      );
      y += 8;
    }
  }

  // Bloc signature (bon pour accord)
  ensure(38);
  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  const colW = (PW - 2 * M - 10) / 2;
  const sy = y;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(L.provider, M, sy);
  doc.text(L.clientApproval, M + colW + 10, sy);
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.text(data.from.name, M, sy + 7);
  if (data.acceptedName) {
    doc.setTextColor(...accent);
    doc.text(data.acceptedName, M + colW + 10, sy + 7);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(L.acceptedOn.replace("{date}", data.acceptedDate ?? ""), M + colW + 10, sy + 12);
  } else {
    doc.setDrawColor(190, 190, 190);
    doc.line(M + colW + 10, sy + 12, M + 2 * colW + 10, sy + 12);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(L.signHere, M + colW + 10, sy + 16);
  }
  y = sy + 22;

  // Notes / CGV
  if (data.notes) {
    ensure(16);
    doc.setFontSize(8);
    doc.setTextColor(120);
    const nl = doc.splitTextToSize(data.notes, PW - 2 * M) as string[];
    for (const line of nl) {
      ensure(4);
      doc.text(line, M, y);
      y += 4;
    }
  }

  return doc;
}

/** Déclenche le téléchargement du PDF de proposition. */
export function downloadProposalPdf(data: ProposalData): void {
  buildProposalPdf(data).save(`Proposition-${data.number}.pdf`);
}

// ------------------------------------------------------------------
// Liste d'adhérents / suivi cotisations (module Membres)
// ------------------------------------------------------------------

export interface MemberPdfRow {
  matricule: string;
  name: string;
  email?: string;
  city?: string;
  type?: string;
  expires?: string;
  status: string;
}

/** Construit un PDF de la liste des adhérents (tableau + résumé recouvrement). */
export function buildMembersPdf(
  title: string,
  accentColor: string | undefined,
  rows: MemberPdfRow[],
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const accent = hexToRgb(accentColor ?? "#2563eb");
  const M = 14;

  doc.setFontSize(16);
  doc.setTextColor(...accent);
  doc.text(title || "Liste des adhérents", M, 18);

  const paid = rows.filter((r) => r.status === "Payé").length;
  const rate = rows.length ? Math.round((paid / rows.length) * 100) : 0;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`${rows.length} adhérents · ${paid} à jour · taux de recouvrement ${rate}%`, M, 24);
  doc.text(new Date().toLocaleDateString("fr-FR"), 196, 24, { align: "right" });

  autoTable(doc, {
    startY: 28,
    head: [["Matricule", "Nom / Prénom", "Email", "Ville", "Type", "Expire", "Statut"]],
    body: rows.map((r) => [
      r.matricule || "—",
      r.name,
      r.email ?? "",
      r.city ?? "",
      r.type ?? "",
      r.expires ?? "",
      r.status,
    ]),
    theme: "striped",
    headStyles: { fillColor: accent, textColor: 255 },
    styles: { fontSize: 8, cellPadding: 1.5 },
    margin: { left: M, right: M },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 6) {
        const v = String(data.cell.raw);
        if (v === "Payé") data.cell.styles.textColor = [22, 140, 70];
        else if (v === "En retard") data.cell.styles.textColor = [200, 50, 50];
        else data.cell.styles.textColor = [150, 120, 0];
      }
    },
  });

  return doc;
}

/** Déclenche le téléchargement du PDF de la liste des adhérents. */
export function downloadMembersPdf(
  title: string,
  accentColor: string | undefined,
  rows: MemberPdfRow[],
): void {
  buildMembersPdf(title, accentColor, rows).save("adherents.pdf");
}

// ------------------------------------------------------------------
// Catalogue produits (app Catalog Builder)
// ------------------------------------------------------------------

export interface CatalogShop {
  name: string;
  logoDataUrl?: string;
  accentColor?: string;
  address?: string;
  whatsappPhone?: string;
  currency: Currency;
}

export interface CatalogProduct {
  name: string;
  price: number;
  category?: string;
  available: boolean;
  imageDataUrl?: string;
}

/**
 * Construit un catalogue produits en grille (2 colonnes).
 * @param qrDataUrl QR (PNG data URL) du contact WhatsApp, généré en amont (optionnel).
 */
export function buildCatalogPdf(
  shop: CatalogShop,
  products: CatalogProduct[],
  qrDataUrl?: string,
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const accent = hexToRgb(shop.accentColor ?? "#4f46e5");
  const PW = 210;
  const PH = 297;
  const M = 12;

  // En-tête
  let hx = M;
  if (shop.logoDataUrl) {
    try {
      const fmt = shop.logoDataUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(shop.logoDataUrl, fmt, M, M, 22, 22);
      hx = M + 27;
    } catch {
      /* logo illisible */
    }
  }
  doc.setFontSize(20);
  doc.setTextColor(...accent);
  doc.text(shop.name, hx, M + 9);
  doc.setFontSize(9);
  doc.setTextColor(110);
  const contact = [shop.whatsappPhone && `WhatsApp : ${shop.whatsappPhone}`, shop.address]
    .filter(Boolean)
    .join("  ·  ");
  if (contact) doc.text(contact, hx, M + 16);

  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, "PNG", PW - M - 22, M, 22, 22);
      doc.setFontSize(7);
      doc.setTextColor(130);
      doc.text("Commander", PW - M - 11, M + 25, { align: "center" });
    } catch {
      /* qr illisible */
    }
  }

  doc.setDrawColor(...accent);
  doc.line(M, M + 30, PW - M, M + 30);

  // Grille
  const cols = 2;
  const gapX = 8;
  const gapY = 8;
  const colW = (PW - 2 * M - gapX) / cols;
  const imgH = 50;
  const cardH = imgH + 24;
  const bottom = PH - M;

  let y = M + 36;
  let col = 0;

  for (const p of products) {
    if (y + cardH > bottom) {
      doc.addPage();
      y = M;
      col = 0;
    }
    const x = M + col * (colW + gapX);

    doc.setDrawColor(225, 225, 225);
    doc.roundedRect(x, y, colW, cardH, 2, 2);

    if (p.imageDataUrl) {
      try {
        const fmt = p.imageDataUrl.includes("image/png") ? "PNG" : "JPEG";
        doc.addImage(p.imageDataUrl, fmt, x + 1, y + 1, colW - 2, imgH, undefined, "FAST");
      } catch {
        /* image illisible */
      }
    } else {
      doc.setFillColor(245, 245, 245);
      doc.rect(x + 1, y + 1, colW - 2, imgH, "F");
    }

    const tx = x + 3;
    let ty = y + imgH + 7;
    doc.setFontSize(10);
    doc.setTextColor(30);
    const nameLines = doc.splitTextToSize(p.name, colW - 6).slice(0, 2);
    doc.text(nameLines, tx, ty);
    ty += nameLines.length * 4.5 + 1;
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text(formatMoney(p.price, shop.currency), tx, ty);
    if (!p.available) {
      doc.setFontSize(8);
      doc.setTextColor(200, 60, 60);
      doc.text("indisponible", x + colW - 3, y + imgH + 7, { align: "right" });
    }

    col++;
    if (col >= cols) {
      col = 0;
      y += cardH + gapY;
    }
  }

  return doc;
}
