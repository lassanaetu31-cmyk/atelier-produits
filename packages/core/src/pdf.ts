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
