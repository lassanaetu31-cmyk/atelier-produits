import { useState } from "react";
import { DEFAULT_PROFILE, saveProfile, useProfile } from "../profile";
import type { CompanyProfile } from "../types";

const MAX_LOGO_BYTES = 500 * 1024; // 500 Ko : garde les PDF légers

export default function ProfileView() {
  const stored = useProfile();
  const [form, setForm] = useState<CompanyProfile>(stored);
  const [flash, setFlash] = useState("");
  const [err, setErr] = useState("");

  function patch(p: Partial<CompanyProfile>) {
    setForm((f) => ({ ...f, ...p }));
  }

  function onLogo(file?: File) {
    setErr("");
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setErr("Logo trop lourd (max 500 Ko). Compresse l'image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!form.name.trim()) {
      setErr("Le nom de l'entreprise est requis.");
      return;
    }
    await saveProfile(form);
    setFlash("Profil enregistré ✓");
    setTimeout(() => setFlash(""), 2500);
  }

  return (
    <section className="grid gap-4 rounded-xl border bg-white p-5">
      <h2 className="font-semibold">Profil de l'entreprise</h2>
      <p className="-mt-2 text-xs text-slate-400">
        Réutilisé automatiquement en en-tête de chaque facture / devis PDF.
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
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => onLogo(e.target.files?.[0])}
          />
          {form.logoDataUrl && (
            <button
              className="justify-self-start text-left text-xs text-red-500 hover:underline"
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
          placeholder="Nom de l'entreprise *"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Téléphone"
          value={form.phone ?? ""}
          onChange={(e) => patch({ phone: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Email"
          value={form.email ?? ""}
          onChange={(e) => patch({ email: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Adresse"
          value={form.address ?? ""}
          onChange={(e) => patch({ address: e.target.value })}
        />
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
        Notes de bas de page (conditions, mentions…)
        <textarea
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          rows={2}
          value={form.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value })}
        />
      </label>

      {err && <p className="text-sm font-medium text-red-500">{err}</p>}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          onClick={save}
        >
          Enregistrer le profil
        </button>
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>
    </section>
  );
}
