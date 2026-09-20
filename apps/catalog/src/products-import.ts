import { exportCsv, normalizeHeader, parseCsvRows } from "@atelier/core";
import { db } from "./db";

export interface RawProduct {
  name: string;
  price: number;
  category?: string;
  reference?: string;
  description?: string;
  available: boolean;
}

function parsePrice(v?: string): number {
  if (!v) return 0;
  const n = Number(v.replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function parseAvailable(v?: string): boolean {
  if (v == null || v.trim() === "") return true;
  const n = normalizeHeader(v);
  return !/(non|no|false|0|indispo|rupture|out)/.test(n);
}

function headerMap(headers: string[]) {
  const idx = { name: -1, price: -1, category: -1, reference: -1, description: -1, available: -1 };
  headers.forEach((h, i) => {
    const n = normalizeHeader(h);
    if (idx.name < 0 && /(nom|name|produit|article|designation|libelle)/.test(n)) idx.name = i;
    else if (idx.price < 0 && /(prix|price|montant|tarif)/.test(n)) idx.price = i;
    else if (idx.category < 0 && /(categorie|category|rayon)/.test(n)) idx.category = i;
    else if (idx.reference < 0 && /(reference|^ref$|sku|code)/.test(n)) idx.reference = i;
    else if (idx.description < 0 && /(description|detail)/.test(n)) idx.description = i;
    else if (idx.available < 0 && /(disponible|dispo|available|stock|statut)/.test(n)) idx.available = i;
  });
  return idx;
}

/** Parse un CSV de produits (colonnes détectées, ou ordre nom/prix/catégorie/réf/description). */
export function parseCsvProducts(text: string): RawProduct[] {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return [];
  const map = headerMap(rows[0]);
  const hasHeader = Object.values(map).some((v) => v >= 0);
  const cols = hasHeader
    ? map
    : { name: 0, price: 1, category: 2, reference: 3, description: 4, available: -1 };
  const data = hasHeader ? rows.slice(1) : rows;

  return data
    .map((r) => ({
      name: (cols.name >= 0 ? r[cols.name] : "")?.trim() ?? "",
      price: parsePrice(cols.price >= 0 ? r[cols.price] : undefined),
      category: cols.category >= 0 ? r[cols.category]?.trim() : undefined,
      reference: cols.reference >= 0 ? r[cols.reference]?.trim() : undefined,
      description: cols.description >= 0 ? r[cols.description]?.trim() : undefined,
      available: parseAvailable(cols.available >= 0 ? r[cols.available] : undefined),
    }))
    .filter((p) => p.name);
}

/** Ajoute des produits, en ignorant les doublons (référence ou nom) et les vides. */
export async function addProducts(list: RawProduct[]): Promise<{ added: number; skipped: number }> {
  const existing = await db.products.toArray();
  const refs = new Set(existing.filter((p) => p.reference).map((p) => p.reference!.toLowerCase()));
  const names = new Set(existing.map((p) => p.name.toLowerCase().trim()));
  const now = Date.now();
  const seen = new Set<string>();
  const toAdd = [] as (RawProduct & { createdAt: number })[];

  for (const p of list) {
    const name = p.name.trim();
    if (!name) continue;
    const ref = p.reference?.trim().toLowerCase() ?? "";
    const key = ref || name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (ref && refs.has(ref)) continue;
    if (!ref && names.has(name.toLowerCase())) continue;
    toAdd.push({ ...p, name, createdAt: now });
  }
  if (toAdd.length) await db.products.bulkAdd(toAdd);
  return { added: toAdd.length, skipped: list.length - toAdd.length };
}

export async function exportProductsCsv(): Promise<number> {
  const products = await db.products.orderBy("name").toArray();
  if (products.length === 0) return 0;
  exportCsv(
    products.map((p) => ({
      nom: p.name,
      prix: p.price,
      categorie: p.category ?? "",
      reference: p.reference ?? "",
      description: p.description ?? "",
      disponible: p.available ? "oui" : "non",
    })),
    "produits.csv",
  );
  return products.length;
}

export function downloadCsvTemplate(): void {
  const csv =
    "nom,prix,categorie,reference,description,disponible\nSac en cuir,25000,Sacs,SAC-01,Cuir véritable,oui\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "modele-produits.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
