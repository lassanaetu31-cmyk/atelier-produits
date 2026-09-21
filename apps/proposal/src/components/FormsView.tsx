import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { exportCsv } from "@atelier/core";
import { db } from "../db";
import { useProfile } from "../profile";
import { DEFAULT_FORM, ficheLink, saveFormConfig, useFormConfig } from "../form-config";
import { portalReady } from "../portal-links";
import { importPasted } from "../reception";
import type { FormConfig, Submission } from "../types";

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export default function FormsView() {
  const profile = useProfile();
  const stored = useFormConfig();
  const [cfg, setCfg] = useState<FormConfig>(stored);
  const [flash, setFlash] = useState("");
  const [copied, setCopied] = useState(false);
  const [paste, setPaste] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const subs = useLiveQuery<Submission[], Submission[]>(
    () => db.submissions.orderBy("createdAt").reverse().toArray(),
    [],
    [],
  );

  // Le lien partagé utilise la config ENREGISTRÉE (stored), pas le brouillon en cours d'édition.
  const shareLink = ficheLink(profile, stored);

  function patch(p: Partial<FormConfig>) {
    setCfg((c) => ({ ...c, ...p }));
  }

  async function save() {
    await saveFormConfig(cfg);
    setFlash("Formulaire enregistré ✓");
    setTimeout(() => setFlash(""), 2500);
  }

  async function copy() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez ce lien :", shareLink);
    }
  }

  async function doImport() {
    const ok = await importPasted(paste);
    setFlash(ok ? "Réponse importée ✓" : "Rien à importer (lien/code invalide ou doublon).");
    if (ok) setPaste("");
    setTimeout(() => setFlash(""), 3000);
  }

  function exportSubs() {
    if (subs.length === 0) return setFlash("Aucune réponse à exporter.");
    exportCsv(
      subs.map((s) => ({
        date: new Date(s.createdAt).toLocaleString("fr-FR"),
        nom: s.name,
        telephone: s.phone ?? "",
        email: s.email ?? "",
        ville: s.city ?? "",
        structure: s.structure ?? "",
        fonction: s.fonction ?? "",
        interets: s.interests.join(" | "),
        recontact: s.recontact.join(" | "),
        notes: s.notes ?? "",
      })),
      "reponses-formulaire.csv",
    );
  }

  return (
    <div className="grid gap-6">
      {/* Réception des réponses */}
      <section className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <span className="text-sm font-semibold text-slate-500">
            Réception · {subs.length} réponse{subs.length > 1 ? "s" : ""}
          </span>
          <button className="text-sm text-blue-600 hover:underline" onClick={exportSubs}>
            Exporter CSV
          </button>
        </div>
        {subs.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">
            Aucune réponse pour l'instant. Partagez le lien du formulaire ci-dessous. Les réponses
            reçues par WhatsApp s'ajoutent ici quand vous ouvrez le lien de réception (ou collez-le).
          </p>
        ) : (
          <ul className="divide-y">
            {subs.map((s) => (
              <li key={s.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <button
                    className="min-w-0 text-left"
                    onClick={() => setOpen(open === s.id ? null : (s.id ?? null))}
                  >
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(s.createdAt).toLocaleString("fr-FR")}
                      {s.phone && <> · {s.phone}</>}
                      {s.city && <> · {s.city}</>}
                    </p>
                  </button>
                  <button
                    className="shrink-0 text-sm text-red-500 hover:underline"
                    onClick={() => s.id && db.submissions.delete(s.id)}
                  >
                    Suppr.
                  </button>
                </div>
                {open === s.id && (
                  <div className="mt-2 grid gap-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {s.email && <div>Email : {s.email}</div>}
                    {s.structure && <div>Structure : {s.structure}</div>}
                    {s.fonction && <div>Fonction : {s.fonction}</div>}
                    {s.interests.length > 0 && <div>Intérêts : {s.interests.join(", ")}</div>}
                    {s.recontact.length > 0 && <div>Recontact : {s.recontact.join(", ")}</div>}
                    {s.notes && <div>Notes : {s.notes}</div>}
                    {s.signature && <div>Signature : {s.signature}</div>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-2 border-t px-5 py-4">
          <label className="text-xs font-medium text-slate-500">
            Coller une réponse reçue (lien ou code de réception)
          </label>
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
              placeholder="Collez ici le lien de réception reçu par WhatsApp…"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
            />
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
              onClick={doImport}
              disabled={!paste.trim()}
            >
              Importer
            </button>
          </div>
        </div>
      </section>

      {/* Lien du formulaire */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Lien du formulaire en ligne</h2>
        {portalReady(profile) ? (
          <>
            <p className="-mt-1 text-xs text-slate-400">
              Partagez ce lien (bio, statut WhatsApp, flyer, QR). La personne le remplit sans rien
              installer ; sa réponse vous revient par WhatsApp avec un lien qui l'ajoute ici.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                readOnly
                className="min-w-[240px] flex-1 rounded-lg border bg-slate-50 px-3 py-2 font-mono text-xs"
                value={shareLink ?? ""}
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={copy}
              >
                {copied ? "Copié ✓" : "Copier"}
              </button>
              <a
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                href={shareLink ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                Tester
              </a>
            </div>
            <p className="-mt-1 text-xs text-slate-400">
              Le lien utilise le formulaire <span className="font-medium">enregistré</span>. Pensez à
              enregistrer vos modifications ci-dessous avant de le partager.
            </p>
          </>
        ) : (
          <p className="-mt-1 text-xs text-slate-400">
            Renseignez votre numéro WhatsApp et l'URL du portail dans l'onglet{" "}
            <span className="font-medium">Profil</span> pour activer le lien du formulaire.
          </p>
        )}
      </section>

      {/* Configuration du formulaire */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Contenu du formulaire</h2>
          <button
            className="text-xs text-slate-400 hover:underline"
            onClick={() => setCfg({ ...DEFAULT_FORM })}
          >
            Réinitialiser
          </button>
        </div>
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Titre du formulaire"
          value={cfg.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="Sous-titre (optionnel)"
          value={cfg.subtitle ?? ""}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
        <label className="text-sm">
          Ce qui vous intéresse <span className="text-slate-400">(une option par ligne)</span>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            rows={4}
            value={cfg.interests.join("\n")}
            onChange={(e) => patch({ interests: lines(e.target.value) })}
          />
        </label>
        <label className="text-sm">
          Pour mieux vous recontacter <span className="text-slate-400">(une option par ligne)</span>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            rows={3}
            value={cfg.recontact.join("\n")}
            onChange={(e) => patch({ recontact: lines(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cfg.askStructure}
            onChange={(e) => patch({ askStructure: e.target.checked })}
          />
          Demander la structure / organisation et la fonction
        </label>
        <label className="text-sm">
          Texte de consentement
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            rows={2}
            value={cfg.consentText}
            onChange={(e) => patch({ consentText: e.target.value })}
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={save}
          >
            Enregistrer le formulaire
          </button>
          {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
        </div>
      </section>
    </div>
  );
}
