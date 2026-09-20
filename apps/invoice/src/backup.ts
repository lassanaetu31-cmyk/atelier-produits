import { db } from "./db";

interface Backup {
  app: string;
  version: number;
  exportedAt: string;
  clients: unknown[];
  documents: unknown[];
  settings: unknown[];
  counters: unknown[];
}

const APP_TAG = "invoice-generator";

/** Exporte toutes les données (clients, documents, profil, compteurs) en un fichier JSON. */
export async function exportBackup(): Promise<void> {
  const [clients, documents, settings, counters] = await Promise.all([
    db.clients.toArray(),
    db.documents.toArray(),
    db.settings.toArray(),
    db.counters.toArray(),
  ]);
  const data: Backup = {
    app: APP_TAG,
    version: 1,
    exportedAt: new Date().toISOString(),
    clients,
    documents,
    settings,
    counters,
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sauvegarde-invoice-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Restaure une sauvegarde (remplace les données existantes). */
export async function importBackup(file: File): Promise<void> {
  const data = JSON.parse(await file.text()) as Partial<Backup>;
  if (data.app !== APP_TAG) throw new Error("Fichier de sauvegarde non reconnu.");
  await db.transaction("rw", db.clients, db.documents, db.settings, db.counters, async () => {
    await db.clients.clear();
    await db.clients.bulkPut((data.clients ?? []) as never[]);
    await db.documents.clear();
    await db.documents.bulkPut((data.documents ?? []) as never[]);
    await db.settings.clear();
    await db.settings.bulkPut((data.settings ?? []) as never[]);
    await db.counters.clear();
    await db.counters.bulkPut((data.counters ?? []) as never[]);
  });
}
