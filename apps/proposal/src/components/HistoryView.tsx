import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney } from "@atelier/core";
import { db } from "../db";
import { accept, downloadPdf, proposalWhatsappLink, setStatus } from "../proposal";
import { acceptLink } from "../portal-links";
import { useProfile } from "../profile";
import type { ProposalStatus, SavedProposal } from "../types";

const BADGE: Record<ProposalStatus, string> = {
  Brouillon: "bg-slate-100 text-slate-500",
  "Envoyée": "bg-blue-100 text-blue-700",
  "Acceptée": "bg-green-100 text-green-700",
  "Refusée": "bg-red-100 text-red-600",
};

export default function HistoryView({ onOpen }: { onOpen: (p: SavedProposal) => void }) {
  const profile = useProfile();
  const clients = useLiveQuery(() => db.clients.toArray(), [], []);
  const props = useLiveQuery<SavedProposal[], SavedProposal[]>(
    () => db.proposals.orderBy("createdAt").reverse().toArray(),
    [],
    [],
  );

  async function onAccept(p: SavedProposal) {
    const name = window.prompt("Nom du client qui accepte la proposition :", p.clientName);
    if (!name?.trim()) return;
    const updated = await accept(p, name);
    downloadPdf(updated, profile);
  }

  function phoneOf(p: SavedProposal): string | undefined {
    return clients.find((c) => c.id === p.clientId)?.phone;
  }

  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
        Historique · {props.length} proposition{props.length > 1 ? "s" : ""}
      </div>
      {props.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">
          Aucune proposition. Créez-en une puis « Enregistrer ».
        </p>
      ) : (
        <ul className="divide-y">
          {props.map((p) => {
            const phone = phoneOf(p);
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    <span className={`mr-2 rounded px-2 py-0.5 text-xs ${BADGE[p.status]}`}>
                      {p.status}
                    </span>
                    {p.number} · {p.title || "Sans titre"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.clientName || "—"} · {p.date} · {formatMoney(p.total, p.currency)}
                    {p.acceptedName && (
                      <span className="ml-2 text-green-600">signé {p.acceptedName}</span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-3 text-sm">
                  <button className="text-blue-600 hover:underline" onClick={() => onOpen(p)}>
                    Ouvrir
                  </button>
                  {phone && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => {
                        if (p.status === "Brouillon") setStatus(p, "Envoyée");
                        window.open(proposalWhatsappLink(p, phone, acceptLink(profile, p)), "_blank");
                      }}
                    >
                      WhatsApp
                    </button>
                  )}
                  {p.status !== "Acceptée" && (
                    <button className="text-green-700 hover:underline" onClick={() => onAccept(p)}>
                      Accepter
                    </button>
                  )}
                  <button
                    className="text-slate-600 hover:underline"
                    onClick={() => downloadPdf(p, profile)}
                  >
                    PDF
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => p.id && db.proposals.delete(p.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
