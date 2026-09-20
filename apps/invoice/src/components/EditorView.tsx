import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney, type Currency, type LineItem } from "@atelier/core";
import { db } from "../db";
import { convertToInvoice, downloadPdf, makeNumber, totalsOf } from "../invoice";
import { useProfile } from "../profile";
import type { DocKind, SavedDocument } from "../types";

const CURRENCY: Currency = "XOF";
const KINDS: DocKind[] = ["Facture", "Devis", "Reçu", "Proposition"];

function blankDraft(): SavedDocument {
  return {
    number: makeNumber("Facture"),
    kind: "Facture",
    clientName: "",
    fromName: "Ma Boutique",
    currency: CURRENCY,
    items: [{ description: "Produit / service", quantity: 1, unitPrice: 10000 }],
    taxRate: 0,
    discountRate: 0,
    shipping: 0,
    total: 0,
    date: new Date().toLocaleDateString("fr-FR"),
    createdAt: Date.now(),
  };
}

export default function EditorView({
  initial,
  onSaved,
  onOpen,
}: {
  initial: SavedDocument | null;
  onSaved: () => void;
  onOpen: (doc: SavedDocument) => void;
}) {
  const clients = useLiveQuery(() => db.clients.orderBy("name").toArray(), [], []);
  const profile = useProfile();
  const [draft, setDraft] = useState<SavedDocument>(initial ?? blankDraft());
  const [flash, setFlash] = useState("");

  const totals = useMemo(() => totalsOf(draft), [draft]);

  function patch(p: Partial<SavedDocument>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function changeKind(kind: DocKind) {
    // Nouveau document : on aligne le numéro sur le type. Document existant : on garde le numéro.
    setDraft((d) => ({ ...d, kind, number: d.id ? d.number : makeNumber(kind) }));
  }

  async function convert() {
    const invoice = await convertToInvoice({ ...draft, fromName: profile.name, total: totals.total });
    onOpen(invoice);
  }
  function updateItem(i: number, p: Partial<LineItem>) {
    setDraft((d) => ({ ...d, items: d.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) }));
  }
  function addItem() {
    setDraft((d) => ({ ...d, items: [...d.items, { description: "", quantity: 1, unitPrice: 0 }] }));
  }
  function removeItem(i: number) {
    setDraft((d) => ({ ...d, items: d.items.filter((_, idx) => idx !== i) }));
  }

  function pickClient(value: string) {
    if (value === "") {
      patch({ clientId: undefined });
      return;
    }
    const c = clients.find((x) => x.id === Number(value));
    if (c) patch({ clientId: c.id, clientName: c.name });
  }

  async function save() {
    const record: SavedDocument = { ...draft, fromName: profile.name, total: totals.total };
    if (record.id) {
      await db.documents.put(record);
    } else {
      const id = await db.documents.add(record);
      setDraft({ ...record, id });
    }
    setFlash("Enregistré dans l'historique ✓");
    setTimeout(() => setFlash(""), 2500);
    onSaved();
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-xl border bg-white p-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm">
            Type de document
            <select
              className="mt-1 w-full rounded border bg-white px-3 py-2"
              value={draft.kind}
              onChange={(e) => changeKind(e.target.value as DocKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Numéro
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={draft.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </label>
        </div>

        {draft.kind === "Devis" && draft.convertedToId && (
          <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Ce devis a déjà été converti en facture.
          </p>
        )}
        {draft.sourceId && (
          <p className="rounded bg-blue-50 px-3 py-2 text-xs text-blue-700">
            Facture issue d'un devis.
          </p>
        )}

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Émetteur</span>
          <span className="font-medium">{profile.name}</span>
        </div>

        <label className="text-sm">
          Client
          <select
            className="mt-1 w-full rounded border bg-white px-3 py-2"
            value={draft.clientId ?? ""}
            onChange={(e) => pickClient(e.target.value)}
          >
            <option value="">— Saisie libre —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {draft.clientId === undefined && (
          <label className="text-sm">
            Nom du client
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={draft.clientName}
              onChange={(e) => patch({ clientName: e.target.value })}
            />
          </label>
        )}

        <div className="grid gap-2">
          {draft.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_70px_110px_32px] items-center gap-2">
              <input
                className="rounded border px-2 py-1.5 text-sm"
                placeholder="Description"
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
              />
              <input
                className="rounded border px-2 py-1.5 text-right text-sm"
                type="number"
                min={0}
                value={it.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
              />
              <input
                className="rounded border px-2 py-1.5 text-right text-sm"
                type="number"
                min={0}
                value={it.unitPrice}
                onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
              />
              <button
                className="rounded bg-red-50 py-1.5 text-red-500 hover:bg-red-100"
                onClick={() => removeItem(i)}
                title="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
          <button className="justify-self-start text-sm text-blue-600 hover:underline" onClick={addItem}>
            + Ligne
          </button>
        </div>

        <label className="text-sm">
          Taxe (%)
          <input
            className="ml-2 w-20 rounded border px-2 py-1"
            type="number"
            min={0}
            value={draft.taxRate}
            onChange={(e) => patch({ taxRate: Number(e.target.value) })}
          />
        </label>
      </section>

      <section className="flex items-center justify-between rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Sous-total {formatMoney(totals.subtotal, draft.currency)}
          {totals.tax > 0 && <> · Taxe {formatMoney(totals.tax, draft.currency)}</>}
        </div>
        <div className="text-lg font-bold text-blue-600">
          Total {formatMoney(totals.total, draft.currency)}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          onClick={() => downloadPdf({ ...draft, fromName: profile.name, total: totals.total }, profile)}
        >
          Télécharger le PDF
        </button>
        <button
          className="rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          onClick={save}
        >
          Enregistrer dans l'historique
        </button>
        {draft.kind === "Devis" && draft.id && !draft.convertedToId && (
          <button
            className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            onClick={convert}
          >
            Convertir en facture
          </button>
        )}
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>
    </div>
  );
}
