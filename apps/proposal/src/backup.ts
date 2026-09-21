import { db } from "./db";

interface Backup {
  app: string;
  version: number;
  exportedAt: string;
  clients: unknown[];
  proposals: unknown[];
  members: unknown[];
  submissions: unknown[];
  forms: unknown[];
  settings: unknown[];
  counters: unknown[];
}

const APP_TAG = "proposal-generator";

/** Exporte toutes les données (clients, propositions, adhérents, formulaires, profil, compteurs) en JSON. */
export async function exportBackup(): Promise<void> {
  const [clients, proposals, members, submissions, forms, settings, counters] = await Promise.all([
    db.clients.toArray(),
    db.proposals.toArray(),
    db.members.toArray(),
    db.submissions.toArray(),
    db.forms.toArray(),
    db.settings.toArray(),
    db.counters.toArray(),
  ]);
  const data: Backup = {
    app: APP_TAG,
    version: 3,
    exportedAt: new Date().toISOString(),
    clients,
    proposals,
    members,
    submissions,
    forms,
    settings,
    counters,
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sauvegarde-proposal-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Restaure une sauvegarde (remplace les données existantes). */
export async function importBackup(file: File): Promise<void> {
  const data = JSON.parse(await file.text()) as Partial<Backup>;
  if (data.app !== APP_TAG) throw new Error("Fichier de sauvegarde non reconnu.");
  await db.transaction(
    "rw",
    [db.clients, db.proposals, db.members, db.submissions, db.forms, db.settings, db.counters],
    async () => {
      await db.clients.clear();
      await db.clients.bulkPut((data.clients ?? []) as never[]);
      await db.proposals.clear();
      await db.proposals.bulkPut((data.proposals ?? []) as never[]);
      await db.members.clear();
      await db.members.bulkPut((data.members ?? []) as never[]);
      await db.submissions.clear();
      await db.submissions.bulkPut((data.submissions ?? []) as never[]);
      await db.forms.clear();
      await db.forms.bulkPut((data.forms ?? []) as never[]);
      await db.settings.clear();
      await db.settings.bulkPut((data.settings ?? []) as never[]);
      await db.counters.clear();
      await db.counters.bulkPut((data.counters ?? []) as never[]);
    },
  );
}
