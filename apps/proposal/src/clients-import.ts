import { exportCsv, normalizePhone } from "@atelier/core";
import { db } from "./db";

export interface RawContact {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

// ---------------- CSV ----------------

function splitCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function headerMap(headers: string[]) {
  const idx = { name: -1, phone: -1, email: -1, address: -1 };
  headers.forEach((h, i) => {
    const n = norm(h);
    if (idx.name < 0 && /(nom|name|client|prenom)/.test(n)) idx.name = i;
    else if (idx.phone < 0 && /(tel|phone|numero|whatsapp|contact|mobile)/.test(n)) idx.phone = i;
    else if (idx.email < 0 && /mail/.test(n)) idx.email = i;
    else if (idx.address < 0 && /(adresse|address|ville|city)/.test(n)) idx.address = i;
  });
  return idx;
}

/** Parse un CSV de clients. Détecte le séparateur (`,` ou `;`) et les colonnes. */
export function parseCsvClients(text: string): RawContact[] {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];
  const delim = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows = lines.map((l) => splitCsvLine(l, delim));

  const map = headerMap(rows[0]);
  const hasHeader = map.name >= 0 || map.phone >= 0 || map.email >= 0 || map.address >= 0;
  const cols = hasHeader ? map : { name: 0, phone: 1, email: 2, address: 3 };
  const data = hasHeader ? rows.slice(1) : rows;

  return data
    .map((r) => ({
      name: (cols.name >= 0 ? r[cols.name] : "") ?? "",
      phone: cols.phone >= 0 ? r[cols.phone] : undefined,
      email: cols.email >= 0 ? r[cols.email] : undefined,
      address: cols.address >= 0 ? r[cols.address] : undefined,
    }))
    .filter((c) => c.name.trim());
}

// ---------------- vCard (.vcf export des contacts du téléphone) ----------------

/** Parse un fichier vCard (contacts téléphone) en clients. */
export function parseVcfClients(text: string): RawContact[] {
  const cards = text.split(/BEGIN:VCARD/i).slice(1);
  return cards
    .map((block) => {
      const lines = block.split(/\r?\n/);
      let name = "";
      let phone = "";
      let email = "";
      let address = "";
      for (const line of lines) {
        const fn = line.match(/^FN[^:]*:(.+)/i);
        if (fn) name = fn[1].trim();
        if (!name) {
          const n = line.match(/^N[^:]*:(.+)/i);
          if (n) {
            const p = n[1].split(";");
            name = [p[1], p[0]].filter(Boolean).join(" ").trim();
          }
        }
        const tel = line.match(/^TEL[^:]*:(.+)/i);
        if (tel && !phone) phone = tel[1].trim();
        const em = line.match(/^EMAIL[^:]*:(.+)/i);
        if (em && !email) email = em[1].trim();
        const adr = line.match(/^ADR[^:]*:(.+)/i);
        if (adr && !address) address = adr[1].split(";").filter(Boolean).join(" ").trim();
      }
      return { name, phone, email, address };
    })
    .filter((c) => c.name.trim());
}

// ---------------- Enregistrement ----------------

/** Ajoute des contacts en base, en ignorant les doublons (téléphone ou nom) et les vides. */
export async function addContacts(list: RawContact[]): Promise<{ added: number; skipped: number }> {
  const existing = await db.clients.toArray();
  const phones = new Set(existing.filter((c) => c.phone).map((c) => normalizePhone(c.phone!)));
  const names = new Set(existing.map((c) => c.name.toLowerCase().trim()));
  const now = Date.now();
  const seen = new Set<string>();
  const toAdd = [] as { name: string; phone?: string; email?: string; address?: string; createdAt: number }[];

  for (const c of list) {
    const name = c.name.trim();
    if (!name) continue;
    const ph = c.phone?.trim() ? normalizePhone(c.phone) : "";
    const key = ph || name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (ph && phones.has(ph)) continue;
    if (!ph && names.has(name.toLowerCase())) continue;
    toAdd.push({
      name,
      phone: c.phone?.trim() || undefined,
      email: c.email?.trim() || undefined,
      address: c.address?.trim() || undefined,
      createdAt: now,
    });
  }
  if (toAdd.length) await db.clients.bulkAdd(toAdd);
  return { added: toAdd.length, skipped: list.length - toAdd.length };
}

// ---------------- Export / modèle ----------------

export async function exportClientsCsv(): Promise<number> {
  const clients = await db.clients.orderBy("name").toArray();
  if (clients.length === 0) return 0;
  exportCsv(
    clients.map((c) => ({
      nom: c.name,
      telephone: c.phone ?? "",
      email: c.email ?? "",
      adresse: c.address ?? "",
    })),
    "clients.csv",
  );
  return clients.length;
}

export function downloadCsvTemplate(): void {
  const csv = "nom,telephone,email,adresse\nAwa Diallo,771234567,awa@mail.com,Dakar\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "modele-clients.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
