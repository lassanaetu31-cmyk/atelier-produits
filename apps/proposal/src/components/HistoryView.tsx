import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney } from "@atelier/core";
import { db } from "../db";
import { accept, downloadPdf, proposalWhatsappLink } from "../proposal";
import { acceptLink } from "../portal-links";
import { useProfile } from "../profile";
import { useLang } from "../i18n/context";
import type { ProposalStatus, SavedProposal } from "../types";

function statusClass(s: ProposalStatus) {
  return {
    "Brouillon": "bg-slate-100 text-slate-500",
    "Envoyée": "bg-blue-100 text-blue-700",
    "Acceptée": "bg-green-100 text-green-700",
    "Refusée": "bg-red-100 text-red-600",
  }[s] ?? "bg-slate-100 text-slate-500";
}

export default function HistoryView({ onOpen }: { onOpen: (p: SavedProposal) => void }) {
  const { t } = useLang();
  const profile = useProfile();
  const clients = useLiveQuery(() => db.clients.toArray(), [], []);
  const props = useLiveQuery<SavedProposal[], SavedProposal[]>(
    () => db.proposals.orderBy("createdAt").reverse().toArray(),
    [],
    [],
  );

  async function onAccept(p: SavedProposal) {
    const name = window.prompt(t("history.acceptPrompt"), p.clientName);
    if (!name?.trim()) return;
    const updated = await accept(p, name);
    downloadPdf(updated, profile);
  }

  function phoneOf(p: SavedProposal): string | undefined {
    return clients.find((c) => c.id === p.clientId)?.phone;
  }

  const statusLabel: Record<ProposalStatus, string> = {
    "Brouillon": t("status.draft"),
    "Envoyée": t("status.sent"),
    "Acceptée": t("status.accepted"),
    "Refusée": t("status.refused"),
  };

  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
        {t("history.title")} · {props.length}
      </div>
      {props.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">{t("history.empty")}</p>
      ) : (
        <ul className="divide-y">
          {props.map((p) => {
            const phone = phoneOf(p);
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <button className="text-left" onClick={() => onOpen(p)}>
                    <p className="truncate font-medium">{p.title || t("history.title")}</p>
                    <p className="text-xs text-slate-400">
                      {p.number && <span className="mr-2">{p.number}</span>}
                      {p.clientName && <span className="mr-2">{p.clientName}</span>}
                      {formatMoney(p.total, p.currency)}
                    </p>
                  </button>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(p.status)}`}>
                    {statusLabel[p.status]}
                  </span>
                  <button className="text-xs text-blue-600 hover:underline" onClick={() => onOpen(p)}>{t("history.open")}</button>
                  <button className="text-xs text-green-600 hover:underline" onClick={() => onAccept(p)}>{t("history.accept")}</button>
                  <button className="text-xs text-slate-500 hover:underline" onClick={() => downloadPdf(p, profile)}>{t("history.pdf")}</button>
                  {phone && (
                    <a className="text-xs text-slate-500 hover:underline" href={proposalWhatsappLink(p, phone, acceptLink(profile, p))} target="_blank" rel="noreferrer">
                      {t("history.send")}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
