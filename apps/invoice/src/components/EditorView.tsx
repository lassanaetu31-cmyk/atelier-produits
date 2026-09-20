import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney, type Currency, type LineItem } from "@atelier/core";
import { db } from "../db";
import { downloadPdf, totalsOf } from "../invoice";
import type { SavedDocument } from "../types";

const CURRENCY: Currency = "XOF";

function blankDraft(): SavedDocument {
  return {
    number: `F-${Date.now().toString().slice(-6)}`,
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
}: {
  initial: SavedDocument | null;
  onSaved: () => void;
}) {
  const clients = useLiveQuery(() => db.clients.orderBy("name").toArray(), [], []);
  const [draft, setDraft] = useState<SavedDocument>(initial ?? blankDraft());
  const [flash, setFlash] = useState("");

  const totals = useMemo(() => totalsOf(draft), [draft]);

  function patch(p: Partial<SavedDocument>) {
    setDraft((d) => ({ ...d, ...p }));
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
    const record: SavedDocument = { ...draft, total: totals.total };
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
            Émetteur
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={draft.fromName}
              onChange={(e) => patch({ fromName: e.target.value })}
            />
          </label>
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
        </div>

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
          onClick={() => downloadPdf({ ...draft, total: totals.total })}
        >
          Télécharger le PDF
        </button>
        <button
          className="rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          onClick={save}
        >
          Enregistrer dans l'historique
        </button>
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>
    </div>
  );
}
