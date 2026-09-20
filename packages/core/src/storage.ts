// Storage local-first (IndexedDB via Dexie). Base par app, tables déclarées par l'app.
import Dexie, { type Table } from "dexie";

/** Fabrique une base Dexie typée. Chaque app définit ses tables. */
export function createDb<T extends Record<string, string>>(
  name: string,
  schema: T,
  version = 1,
): Dexie & Record<keyof T, Table> {
  const db = new Dexie(name);
  db.version(version).stores(schema);
  return db as Dexie & Record<keyof T, Table>;
}

/** Sérialise n'importe quelle donnée en Blob JSON téléchargeable (sauvegarde). */
export function exportJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename);
}

/** Export CSV simple à partir d'un tableau d'objets. */
export function exportCsv(rows: Record<string, unknown>[], filename: string): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv" }), filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
