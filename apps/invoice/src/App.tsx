import { useMemo, useState } from "react";
import {
  computeTotals,
  downloadDocumentPdf,
  formatMoney,
  type Currency,
  type LineItem,
} from "@atelier/core";

// Scaffold minimal fonctionnel : prouve le câblage socle (Money + PDF).
// On enrichit pas à pas : clients, historique, devis->facture, licence, templates.

export default function App() {
  const [currency] = useState<Currency>("XOF");
  const [fromName, setFromName] = useState("Ma Boutique");
  const [toName, setToName] = useState("Client");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<LineItem[]>([
    { description: "Produit / service", quantity: 1, unitPrice: 10000 },
  ]);

  const totals = useMemo(
    () => computeTotals(items, { taxRate }),
    [items, taxRate],
  );

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function exportPdf() {
    downloadDocumentPdf({
      kind: "Facture",
      number: `F-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("fr-FR"),
      currency,
      from: { name: fromName },
      to: { name: toName },
      items,
      totals,
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-blue-600">Invoice Generator</h1>
        <p className="text-sm text-slate-500">Atelier Produits · app #1 · scaffold</p>
      </header>

      <main className="mx-auto grid max-w-3xl gap-6 p-6">
        <section className="grid gap-4 rounded-xl border bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm">
              Émetteur
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
            </label>
            <label className="text-sm">
              Client
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-2">
            {items.map((it, i) => (
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
            <button
              className="justify-self-start text-sm text-blue-600 hover:underline"
              onClick={addItem}
            >
              + Ligne
            </button>
          </div>

          <label className="text-sm">
            Taxe (%)
            <input
              className="ml-2 w-20 rounded border px-2 py-1"
              type="number"
              min={0}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
          </label>
        </section>

        <section className="flex items-center justify-between rounded-xl border bg-white p-5">
          <div className="text-sm text-slate-500">
            Sous-total {formatMoney(totals.subtotal, currency)}
            {totals.tax > 0 && <> · Taxe {formatMoney(totals.tax, currency)}</>}
          </div>
          <div className="text-lg font-bold text-blue-600">
            Total {formatMoney(totals.total, currency)}
          </div>
        </section>

        <button
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          onClick={exportPdf}
        >
          Télécharger la facture PDF
        </button>
      </main>
    </div>
  );
}
