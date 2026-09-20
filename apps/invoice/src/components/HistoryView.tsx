import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney } from "@atelier/core";
import { db } from "../db";
import { downloadPdf } from "../invoice";
import type { SavedDocument } from "../types";

export default function HistoryView({ onOpen }: { onOpen: (doc: SavedDocument) => void }) {
  const docs = useLiveQuery(
    () => db.documents.orderBy("createdAt").reverse().toArray(),
    [],
    [],
  );

  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
        Historique · {docs.length} document{docs.length > 1 ? "s" : ""}
      </div>
      {docs.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">
          Aucun document. Crée une facture puis « Enregistrer dans l'historique ».
        </p>
      ) : (
        <ul className="divide-y">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-medium">
                  <span className="mr-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {d.kind}
                  </span>
                  {d.number} · {d.clientName}
                </p>
                <p className="text-xs text-slate-400">
                  {d.date} · {formatMoney(d.total, d.currency)}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button className="text-blue-600 hover:underline" onClick={() => onOpen(d)}>
                  Ouvrir
                </button>
                <button className="text-slate-600 hover:underline" onClick={() => downloadPdf(d)}>
                  PDF
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => d.id && db.documents.delete(d.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
