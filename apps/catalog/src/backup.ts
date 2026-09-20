import { db } from "./db";

interface Backup {
  app: string;
  version: number;
  exportedAt: string;
  products: unknown[];
  settings: unknown[];
}

const APP_TAG = "catalog-builder";

/** Exporte toutes les données (produits + profil) en un fichier JSON. */
export async function exportBackup(): Promise<void> {
  const [products, settings] = await Promise.all([db.products.toArray(), db.settings.toArray()]);
  const data: Backup = {
    app: APP_TAG,
    version: 1,
    exportedAt: new Date().toISOString(),
    products,
    settings,
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sauvegarde-catalog-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Restaure une sauvegarde (remplace les données existantes). */
export async function importBackup(file: File): Promise<void> {
  const data = JSON.parse(await file.text()) as Partial<Backup>;
  if (data.app !== APP_TAG) throw new Error("Fichier de sauvegarde non reconnu.");
  await db.transaction("rw", db.products, db.settings, async () => {
    await db.products.clear();
    await db.products.bulkPut((data.products ?? []) as never[]);
    await db.settings.clear();
    await db.settings.bulkPut((data.settings ?? []) as never[]);
  });
}
