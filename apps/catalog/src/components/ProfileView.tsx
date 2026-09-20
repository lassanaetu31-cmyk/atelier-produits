import { useState } from "react";
import { formatMoney, whatsappLink, type Currency } from "@atelier/core";
import { exportBackup, importBackup } from "../backup";
import { DEFAULT_PROFILE, saveProfile, useProfile } from "../profile";
import type { ShopProfile } from "../types";

const MAX_LOGO_BYTES = 500 * 1024;
const CURRENCIES: Currency[] = ["XOF", "USD", "EUR"];

/** Aperçu du message de commande à partir du modèle. */
function previewMessage(template: string, currency: Currency): string {
  return (template || DEFAULT_PROFILE.orderTemplate!)
    .replace(/\{produit\}/g, "Sac en cuir")
    .replace(/\{prix\}/g, formatMoney(25000, currency));
}

export default function ProfileView() {
  const stored = useProfile();
  const [form, setForm] = useState<ShopProfile>(stored);
  const [flash, setFlash] = useState("");
  const [err, setErr] = useState("");

  function patch(p: Partial<ShopProfile>) {
    setForm((f) => ({ ...f, ...p }));
  }

  function onLogo(file?: File) {
    setErr("");
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setErr("Logo trop lourd (max 500 Ko).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!form.name.trim()) {
      setErr("Le nom de la boutique est requis.");
      return;
    }
    await saveProfile(form);
    setFlash("Profil enregistré ✓");
    setTimeout(() => setFlash(""), 2500);
  }

  async function restore(file?: File) {
    if (!file) return;
    if (!confirm("Restaurer remplacera toutes les données actuelles. Continuer ?")) return;
    try {
      await importBackup(file);
      alert("Sauvegarde restaurée. La page va se recharger.");
      location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Restauration impossible.");
    }
  }

  const waTest = form.whatsappPhone ? whatsappLink(form.whatsappPhone, "Test") : "";

  return (
    <section className="grid gap-4 rounded-xl border bg-white p-5">
      <h2 className="font-semibold">Profil de la boutique</h2>
      <p className="-mt-2 text-xs text-slate-400">
        Ces infos apparaissent sur le catalogue et les messages de commande.
      </p>

      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-slate-50">
          {form.logoDataUrl ? (
            <img src={form.logoDataUrl} alt="logo" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">Logo</span>
          )}
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <input type="file" accept="image/png,image/jpeg" onChange={(e) => onLogo(e.target.files?.[0])} />
          {form.logoDataUrl && (
            <button
              className="text-left text-xs text-red-500 hover:underline"
              onClick={() => patch({ logoDataUrl: undefined })}
            >
              Retirer le logo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Nom de la boutique *"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Numéro WhatsApp (ex: 771234567)"
          value={form.whatsappPhone ?? ""}
          onChange={(e) => patch({ whatsappPhone: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Adresse"
          value={form.address ?? ""}
          onChange={(e) => patch({ address: e.target.value })}
        />
        <select
          className="rounded border bg-white px-3 py-2 text-sm"
          value={form.currency}
          onChange={(e) => patch({ currency: e.target.value as Currency })}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              Devise : {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          Couleur d'accent
          <input
            type="color"
            className="h-8 w-12 cursor-pointer rounded border"
            value={form.accentColor}
            onChange={(e) => patch({ accentColor: e.target.value })}
          />
        </label>
        <button
          className="text-xs text-slate-400 hover:underline"
          onClick={() => patch({ accentColor: DEFAULT_PROFILE.accentColor })}
        >
          Réinitialiser
        </button>
      </div>

      <label className="text-sm">
        Modèle de message de commande
        <textarea
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          rows={2}
          value={form.orderTemplate ?? ""}
          onChange={(e) => patch({ orderTemplate: e.target.value })}
          placeholder={DEFAULT_PROFILE.orderTemplate}
        />
        <span className="text-xs text-slate-400">
          Variables : <code>{"{produit}"}</code> et <code>{"{prix}"}</code>.
        </span>
      </label>

      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Aperçu message : « {previewMessage(form.orderTemplate ?? "", form.currency)} »
        {waTest && (
          <>
            {" "}
            ·{" "}
            <a className="text-indigo-600 hover:underline" href={waTest} target="_blank" rel="noreferrer">
              tester le lien WhatsApp
            </a>
          </>
        )}
      </div>

      {err && <p className="text-sm font-medium text-red-500">{err}</p>}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          onClick={save}
        >
          Enregistrer le profil
        </button>
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>

      <div className="mt-2 grid gap-2 border-t pt-4">
        <h3 className="text-sm font-semibold">Sauvegarde des données</h3>
        <p className="-mt-1 text-xs text-slate-400">
          Vos données restent sur cet appareil. Exportez une sauvegarde régulièrement.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
            onClick={() => exportBackup()}
          >
            Exporter une sauvegarde
          </button>
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">
            Restaurer une sauvegarde
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => restore(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
