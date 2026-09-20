import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { downloadCatalogPdf } from "../catalog";
import { useProfile } from "../profile";

export default function CatalogView() {
  const profile = useProfile();
  const count = useLiveQuery(() => db.products.count(), [], 0);
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      await downloadCatalogPdf(profile);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Catalogue PDF</h2>
        <p className="text-sm text-slate-500">
          Génère un catalogue A4 (grille 2 colonnes) avec vos produits, votre logo et vos couleurs.
          {profile.whatsappPhone
            ? " Un QR code de commande WhatsApp est ajouté en en-tête."
            : ""}
        </p>

        <ul className="grid gap-1 text-sm text-slate-600">
          <li>• {count} produit{count > 1 ? "s" : ""} inclus</li>
          <li>• Devise : {profile.currency}</li>
          <li>
            • WhatsApp :{" "}
            {profile.whatsappPhone ? (
              profile.whatsappPhone
            ) : (
              <span className="text-amber-600">non renseigné (onglet Profil) — pas de QR</span>
            )}
          </li>
        </ul>

        <div>
          <button
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={generate}
            disabled={busy || count === 0}
          >
            {busy ? "Génération…" : "Générer le catalogue PDF"}
          </button>
          {count === 0 && (
            <p className="mt-2 text-sm text-slate-400">Ajoutez d'abord des produits.</p>
          )}
        </div>
      </section>
    </div>
  );
}
