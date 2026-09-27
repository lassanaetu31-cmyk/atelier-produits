import { useState } from "react";
import { exportBackup, importBackup } from "../backup";
import { DEFAULT_PROFILE, saveProfile, useProfile } from "../profile";
import type { CompanyProfile } from "../types";

const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2 Mo

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
      setErr("Le nom de votre activité est requis.");
      return;
    }
    await saveProfile(form);
    setFlash("Profil enregistré ✓");
    setTimeout(() => setFlash(""), 2500);
  }

  async function restore(file?: File) {
    if (!file) return;
    if (!confirm("Restaurer cette sauvegarde remplacera toutes les données actuelles. Continuer ?")) {
      return;
    }
    try {
      await importBackup(file);
      alert("Sauvegarde restaurée. La page va se recharger.");
      location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Restauration impossible.");
    }
  }

  return (
    <section className="grid gap-4 rounded-xl border bg-white p-5">
      <h2 className="font-semibold">Profil du prestataire</h2>
      <p className="-mt-2 text-xs text-slate-400">
        Réutilisé automatiquement en en-tête et au bloc signature de chaque proposition PDF.
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
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-center font-medium hover:bg-slate-50">
            Choisir un logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
          </label>
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Nom / activité *"
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
        Mentions de bas de page (CGV courtes, coordonnées bancaires…)
        <textarea
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          rows={2}
          value={form.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value })}
        />
      </label>

      <div className="grid gap-3 border-t pt-4">
        <h3 className="text-sm font-semibold">Portail public (liens client)</h3>
        <p className="-mt-1 text-xs text-slate-400">
          Permet à vos clients de s'inscrire ou d'accepter une proposition depuis un simple lien,
          sans rien installer : leur réponse vous revient par WhatsApp.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Numéro WhatsApp (ex. 221771234567)"
            value={form.whatsappPhone ?? ""}
            onChange={(e) => patch({ whatsappPhone: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="URL du portail (https://…)"
            value={form.portalUrl ?? ""}
            onChange={(e) => patch({ portalUrl: e.target.value })}
          />
        </div>
        <p className="-mt-1 text-xs text-slate-400">
          L'URL du portail vous est communiquée par le vendeur (hébergé une seule fois). Laissez vide
          si vous ne l'utilisez pas encore.
        </p>
      </div>

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
