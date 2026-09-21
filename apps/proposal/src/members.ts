import {
  downloadMembersPdf,
  exportCsv,
  exportJson,
  normalizeHeader,
  parseCsvRows,
} from "@atelier/core";
import { db } from "./db";
import type { Member } from "./types";

export type DerivedStatus = "Payé" | "En retard" | "Non payé";

/** Statut affiché : payé, sinon en retard si échéance dépassée, sinon non payé. */
export function statusOf(m: Member): DerivedStatus {
  if (m.paid) return "Payé";
  if (m.expiresAt) {
    const today = new Date().toISOString().slice(0, 10);
    if (m.expiresAt < today) return "En retard";
  }
  return "Non payé";
}

export interface MemberStats {
  total: number;
  upToDate: number;
  late: number;
  recoveryRate: number;
}

export function computeStats(list: Member[]): MemberStats {
  const total = list.length;
  const upToDate = list.filter((m) => m.paid).length;
  const late = total - upToDate;
  const recoveryRate = total ? Math.round((upToDate / total) * 100) : 0;
  return { total, upToDate, late, recoveryRate };
}

// ---------------- Import CSV ----------------

type RawMember = Omit<Member, "id" | "createdAt">;

const TRUTHY = /^(oui|yes|paye|payé|paid|1|true|vrai|ok|a jour|à jour)$/i;

/** Parse un CSV d'adhérents. Détecte séparateur et colonnes. */
export function parseMembersCsv(text: string): RawMember[] {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return [];

  const idx = { matricule: -1, name: -1, email: -1, city: -1, type: -1, expires: -1, paid: -1 };
  rows[0].forEach((h, i) => {
    const n = normalizeHeader(h);
    if (idx.matricule < 0 && /(matricule|numero|ref|code)/.test(n)) idx.matricule = i;
    else if (idx.name < 0 && /(nom|name|prenom|adherent|membre)/.test(n)) idx.name = i;
    else if (idx.email < 0 && /mail/.test(n)) idx.email = i;
    else if (idx.city < 0 && /(ville|city|adresse|address)/.test(n)) idx.city = i;
    else if (idx.type < 0 && /(type|formule|abonnement|cotisation)/.test(n)) idx.type = i;
    else if (idx.expires < 0 && /(expire|expiration|echeance|fin|validite)/.test(n)) idx.expires = i;
    else if (idx.paid < 0 && /(statut|paye|paid|paiement|status)/.test(n)) idx.paid = i;
  });

  const hasHeader = Object.values(idx).some((v) => v >= 0);
  const cols = hasHeader
    ? idx
    : { matricule: 0, name: 1, email: 2, city: 3, type: 4, expires: 5, paid: 6 };
  const data = hasHeader ? rows.slice(1) : rows;
  const at = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");

  return data
    .map((r) => ({
      matricule: at(r, cols.matricule),
      name: at(r, cols.name),
      email: at(r, cols.email) || undefined,
      city: at(r, cols.city) || undefined,
      type: at(r, cols.type),
      expiresAt: at(r, cols.expires) || undefined,
      paid: TRUTHY.test(at(r, cols.paid)),
    }))
    .filter((m) => m.name || m.matricule);
}

/** Ajoute des adhérents en base, en ignorant les doublons (matricule ou nom) et les vides. */
export async function addMembers(list: RawMember[]): Promise<{ added: number; skipped: number }> {
  const existing = await db.members.toArray();
  const mats = new Set(existing.filter((m) => m.matricule).map((m) => m.matricule.toLowerCase()));
  const names = new Set(existing.map((m) => m.name.toLowerCase().trim()));
  const now = Date.now();
  const seen = new Set<string>();
  const toAdd: Member[] = [];

  for (const m of list) {
    const name = m.name.trim();
    const mat = m.matricule.trim();
    if (!name && !mat) continue;
    const key = (mat || name).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (mat && mats.has(mat.toLowerCase())) continue;
    if (!mat && names.has(name.toLowerCase())) continue;
    toAdd.push({ ...m, matricule: mat, name, createdAt: now });
  }
  if (toAdd.length) await db.members.bulkAdd(toAdd);
  return { added: toAdd.length, skipped: list.length - toAdd.length };
}

// ---------------- Export ----------------

export async function exportMembersCsv(): Promise<number> {
  const members = await db.members.orderBy("name").toArray();
  if (members.length === 0) return 0;
  exportCsv(
    members.map((m) => ({
      matricule: m.matricule,
      nom: m.name,
      email: m.email ?? "",
      ville: m.city ?? "",
      type: m.type,
      expire: m.expiresAt ?? "",
      statut: m.paid ? "Payé" : "Non payé",
    })),
    "adherents.csv",
  );
  return members.length;
}

export async function exportMembersJson(): Promise<number> {
  const members = await db.members.orderBy("name").toArray();
  if (members.length === 0) return 0;
  exportJson(members, "adherents.json");
  return members.length;
}

export async function exportMembersPdf(title: string, accentColor?: string): Promise<number> {
  const members = await db.members.orderBy("name").toArray();
  if (members.length === 0) return 0;
  downloadMembersPdf(
    title,
    accentColor,
    members.map((m) => ({
      matricule: m.matricule,
      name: m.name,
      email: m.email,
      city: m.city,
      type: m.type,
      expires: m.expiresAt,
      status: statusOf(m),
    })),
  );
  return members.length;
}

export function downloadMembersTemplate(): void {
  const csv =
    "matricule,nom,email,ville,type,expire,statut\n" +
    "ADH-001,Awa Diallo,awa@mail.com,Dakar,Annuel,2026-12-31,Payé\n" +
    "ADH-002,Modou Kane,,Thiès,Mensuel,2026-03-31,Non payé\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "modele-adherents.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
