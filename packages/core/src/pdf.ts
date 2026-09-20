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
