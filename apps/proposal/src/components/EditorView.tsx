import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney, type Currency, type LineItem } from "@atelier/core";
import { db } from "../db";
import { downloadPdf, nextNumber, proposalWhatsappLink, totalsOf } from "../proposal";
import { acceptLink } from "../portal-links";
import { useProfile } from "../profile";
import { EXTRA_SECTIONS, TEMPLATES } from "../templates";
import type { ProposalStatus, SavedProposal } from "../types";

const CURRENCY: Currency = "XOF";
const STATUSES: ProposalStatus[] = ["Brouillon", "Envoyée", "Acceptée", "Refusée"];

function blankDraft(): SavedProposal {
  const t = TEMPLATES[0];
  return {
    number: "",
    title: "",
    clientName: "",
    fromName: "",
    currency: CURRENCY,
    sections: t.sections.map((s) => ({ ...s })),
    services: t.services.map((s) => ({ ...s })),
    tiers: [],
    taxRate: 0,
    discountRate: 0,
    depositRate: 30,
    validityDays: 30,
    status: "Brouillon",
    total: 0,
    date: new Date().toLocaleDateString("fr-FR"),
    createdAt: Date.now(),
  };
}

export default function EditorView({
  initial,
  onSaved,
}: {
  initial: SavedProposal | null;
  onSaved: () => void;
}) {
  const clients = useLiveQuery(() => db.clients.orderBy("name").toArray(), [], []);
  const profile = useProfile();
  const [draft, setDraft] = useState<SavedProposal>(initial ?? blankDraft());
  const [flash, setFlash] = useState("");

  const totals = useMemo(() => totalsOf(draft), [draft]);
  const selectedClient = clients.find((c) => c.id === draft.clientId);

  function patch(p: Partial<SavedProposal>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function applyTemplate(id: string) {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setDraft((d) => ({
      ...d,
      title: t.title,
      sections: t.sections.map((s) => ({ ...s })),
      services: t.services.map((s) => ({ ...s })),
      tiers: (t.tiers ?? []).map((x) => ({ ...x, features: [...x.features] })),
    }));
  }

  // -------- sections --------
  function updateSection(i: number, p: Partial<{ title: string; body: string }>) {
    setDraft((d) => ({ ...d, sections: d.sections.map((s, idx) => (idx === i ? { ...s, ...p } : s)) }));
  }
  function addSection() {
    setDraft((d) => ({ ...d, sections: [...d.sections, { title: "Section", body: "" }] }));
  }
  function addSuggestedSection(i: number) {
    const s = EXTRA_SECTIONS[i];
    if (!s) return;
    setDraft((d) => ({ ...d, sections: [...d.sections, { ...s }] }));
  }
  function removeSection(i: number) {
    setDraft((d) => ({ ...d, sections: d.sections.filter((_, idx) => idx !== i) }));
  }

  // -------- services --------
  function updateItem(i: number, p: Partial<LineItem>) {
    setDraft((d) => ({ ...d, services: d.services.map((it, idx) => (idx === i ? { ...it, ...p } : it)) }));
  }
  function addItem() {
    setDraft((d) => ({ ...d, services: [...d.services, { description: "", quantity: 1, unitPrice: 0 }] }));
  }
  function removeItem(i: number) {
    setDraft((d) => ({ ...d, services: d.services.filter((_, idx) => idx !== i) }));
  }

  // -------- tiers (formules) --------
  function addTier() {
    setDraft((d) => ({ ...d, tiers: [...d.tiers, { name: "Formule", price: 0, features: [] }] }));
  }
  function updateTier(i: number, p: Partial<{ name: string; price: number; features: string[]; highlighted: boolean }>) {
    setDraft((d) => ({ ...d, tiers: d.tiers.map((t, idx) => (idx === i ? { ...t, ...p } : t)) }));
  }
  function removeTier(i: number) {
    setDraft((d) => ({ ...d, tiers: d.tiers.filter((_, idx) => idx !== i) }));
  }

  function pickClient(value: string) {
    if (value === "") return patch({ clientId: undefined });
    const c = clients.find((x) => x.id === Number(value));
    if (c) patch({ clientId: c.id, clientName: c.name });
  }

  async function persist(): Promise<SavedProposal> {
    let record: SavedProposal = { ...draft, fromName: profile.name, total: totals.total };
    if (record.id) {
      await db.proposals.put(record);
    } else {
      if (!record.number.trim()) record.number = await nextNumber();
      const id = await db.proposals.add(record);
      record = { ...record, id };
    }
    setDraft(record);
    return record;
  }

  async function save() {
    await persist();
    setFlash("Enregistré dans l'historique ✓");
    setTimeout(() => setFlash(""), 2500);
    onSaved();
  }

  async function pdf() {
    downloadPdf(await persist(), profile);
  }

  async function sendWhatsApp() {
    if (!selectedClient?.phone) {
      setFlash("Sélectionnez un client enregistré avec un numéro de téléphone.");
      setTimeout(() => setFlash(""), 3000);
      return;
    }
    const saved = await persist();
    if (saved.status === "Brouillon") {
      await db.proposals.update(saved.id!, { status: "Envoyée" });
      setDraft({ ...saved, status: "Envoyée" });
    }
    window.open(proposalWhatsappLink(saved, selectedClient.phone, acceptLink(profile, saved)), "_blank");
  }

  return (
    <div className="grid gap-6">
      {/* En-tête : modèle + méta */}
      <section className="grid gap-4 rounded-xl border bg-white p-5">
        <label className="text-sm">
          Partir d'un modèle métier <span className="text-slate-400">(remplit tout en 1 clic)</span>
          <select
            className="mt-1 w-full rounded border bg-white px-3 py-2"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) applyTemplate(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">— Choisir un modèle —</option>
            {TEMPLATES.filter((t) => t.id !== "blank").map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Titre du projet
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="Ex. Création de votre site web"
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm">
            Numéro
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="Auto à l'enregistrement"
              value={draft.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Statut
            <select
              className="mt-1 w-full rounded border bg-white px-3 py-2"
              value={draft.status}
              onChange={(e) => patch({ status: e.target.value as ProposalStatus })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Prestataire</span>
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
      </section>

      {/* Sections narratives */}
      <section className="grid gap-4 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Sections de la proposition</h2>
        {draft.sections.map((s, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border px-2 py-1.5 text-sm font-medium"
                value={s.title}
                onChange={(e) => updateSection(i, { title: e.target.value })}
              />
              <button
                className="rounded bg-red-50 px-2 py-1.5 text-red-500 hover:bg-red-100"
                onClick={() => removeSection(i)}
                title="Supprimer la section"
              >
                ×
              </button>
            </div>
            <textarea
              className="w-full rounded border px-2 py-1.5 text-sm"
              rows={4}
              placeholder="Rédigez le contenu de cette section…"
              value={s.body}
              onChange={(e) => updateSection(i, { body: e.target.value })}
            />
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <button className="text-sm text-blue-600 hover:underline" onClick={addSection}>
            + Section vierge
          </button>
          <select
            className="rounded-lg border bg-white px-3 py-2 text-sm"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value !== "") addSuggestedSection(Number(e.target.value));
              e.target.value = "";
            }}
          >
            <option value="">+ Ajouter une section suggérée…</option>
            {EXTRA_SECTIONS.map((s, i) => (
              <option key={s.title} value={i}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Formules (paliers tarifaires) */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            Formules <span className="text-xs font-normal text-slate-400">(optionnel — offre à 3 choix)</span>
          </h2>
          <button className="text-sm text-blue-600 hover:underline" onClick={addTier} disabled={draft.tiers.length >= 3}>
            + Formule
          </button>
        </div>
        {draft.tiers.length === 0 ? (
          <p className="text-xs text-slate-400">
            Ajoutez 2 ou 3 formules (Essentiel / Pro / Premium) : le client choisit, votre panier moyen monte.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {draft.tiers.map((t, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-1">
                  <input
                    className="w-full rounded border px-2 py-1 text-sm font-medium"
                    value={t.name}
                    onChange={(e) => updateTier(i, { name: e.target.value })}
                  />
                  <button
                    className="rounded bg-red-50 px-2 py-1 text-red-500 hover:bg-red-100"
                    onClick={() => removeTier(i)}
                  >
                    ×
                  </button>
                </div>
                <input
                  className="w-full rounded border px-2 py-1 text-right text-sm"
                  type="number"
                  min={0}
                  value={t.price}
                  onChange={(e) => updateTier(i, { price: Number(e.target.value) })}
                />
                <textarea
                  className="w-full rounded border px-2 py-1 text-xs"
                  rows={4}
                  placeholder="Une caractéristique par ligne"
                  value={t.features.join("\n")}
                  onChange={(e) => updateTier(i, { features: e.target.value.split("\n") })}
                />
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={!!t.highlighted}
                    onChange={(e) => updateTier(i, { highlighted: e.target.checked })}
                  />
                  Mettre en avant
                </label>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Investissement (services) */}
      <section className="grid gap-4 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Investissement (détail chiffré)</h2>
        <div className="grid gap-2">
          {draft.services.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_70px_120px_32px] items-center gap-2">
              <input
                className="rounded border px-2 py-1.5 text-sm"
                placeholder="Prestation"
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
              >
                ×
              </button>
            </div>
          ))}
          <button className="justify-self-start text-sm text-blue-600 hover:underline" onClick={addItem}>
            + Ligne
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label>
            Remise (%)
            <input
              className="ml-2 w-20 rounded border px-2 py-1"
              type="number"
              min={0}
              max={100}
              value={draft.discountRate}
              onChange={(e) => patch({ discountRate: Number(e.target.value) })}
            />
          </label>
          <label>
            Taxe (%)
            <input
              className="ml-2 w-20 rounded border px-2 py-1"
              type="number"
              min={0}
              value={draft.taxRate}
              onChange={(e) => patch({ taxRate: Number(e.target.value) })}
            />
          </label>
          <label>
            Acompte (%)
            <input
              className="ml-2 w-20 rounded border px-2 py-1"
              type="number"
              min={0}
              max={100}
              value={draft.depositRate}
              onChange={(e) => patch({ depositRate: Number(e.target.value) })}
            />
          </label>
          <label>
            Validité (jours)
            <input
              className="ml-2 w-20 rounded border px-2 py-1"
              type="number"
              min={0}
              value={draft.validityDays}
              onChange={(e) => patch({ validityDays: Number(e.target.value) })}
            />
          </label>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Sous-total {formatMoney(totals.subtotal, draft.currency)}
          {totals.discount > 0 && <> · Remise −{formatMoney(totals.discount, draft.currency)}</>}
          {totals.tax > 0 && <> · Taxe {formatMoney(totals.tax, draft.currency)}</>}
          {draft.depositRate > 0 && (
            <> · Acompte {formatMoney((totals.total * draft.depositRate) / 100, draft.currency)}</>
          )}
        </div>
        <div className="text-lg font-bold text-blue-600">
          Total {formatMoney(totals.total, draft.currency)}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          onClick={pdf}
        >
          Télécharger le PDF
        </button>
        <button
          className="rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          onClick={save}
        >
          Enregistrer
        </button>
        <button
          className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-40"
          onClick={sendWhatsApp}
          disabled={!selectedClient?.phone}
          title={selectedClient?.phone ? "" : "Client enregistré avec téléphone requis"}
        >
          Envoyer par WhatsApp
        </button>
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>
    </div>
  );
}
