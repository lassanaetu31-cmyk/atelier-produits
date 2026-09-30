import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { exportBackup, importBackup } from "../backup";
import { DEFAULT_PROFILE, saveProfile } from "../profile";
import { db } from "../db";
import { useLang } from "../i18n/context";
import { LANGUAGES, type LangCode } from "../i18n/translations";
import type { CompanyProfile } from "../types";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export default function ProfileView() {
  const { t, lang, setLang } = useLang();
  const stored = useLiveQuery(() => db.settings.get(1), []);
  const [form, setForm] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const [flash, setFlash] = useState("");
  const [err, setErr] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (stored !== undefined && !initialized.current) {
      initialized.current = true;
      setForm(stored ?? DEFAULT_PROFILE);
    }
  }, [stored]);

  function patch(p: Partial<CompanyProfile>) {
    setForm((f) => ({ ...f, ...p }));
  }

  function onLogo(file?: File) {
    setErr("");
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setErr(t("profile.err.logo"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!form.name.trim()) {
      setErr(t("profile.err.name"));
      return;
    }
    await saveProfile(form);
    setFlash(t("profile.saved"));
    setTimeout(() => setFlash(""), 2500);
  }

  async function restore(file?: File) {
    if (!file) return;
    if (!confirm(t("profile.restore.confirm"))) return;
    try {
      await importBackup(file);
      alert(t("profile.restore.done"));
      location.reload();
    } catch {
      setErr(t("profile.restore.err"));
    }
  }

  return (
    <section className="grid gap-4 rounded-xl border bg-white p-5">
      <h2 className="font-semibold">{t("profile.title")}</h2>
      <p className="-mt-2 text-xs text-slate-400">{t("profile.desc")}</p>

      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-slate-50">
          {form.logoDataUrl ? (
            <img src={form.logoDataUrl} alt="logo" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">{t("profile.logo")}</span>
          )}
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-center font-medium hover:bg-slate-50">
            {t("profile.chooseLogo")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
          </label>
          {form.logoDataUrl && (
            <button
              className="text-left text-xs text-red-500 hover:underline"
              onClick={() => patch({ logoDataUrl: undefined })}
            >
              {t("profile.removeLogo")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input className="rounded border px-3 py-2 text-sm" placeholder={t("profile.name")} value={form.name} onChange={(e) => patch({ name: e.target.value })} />
        <input className="rounded border px-3 py-2 text-sm" placeholder={t("profile.phone")} value={form.phone ?? ""} onChange={(e) => patch({ phone: e.target.value })} />
        <input className="rounded border px-3 py-2 text-sm" placeholder={t("profile.email")} value={form.email ?? ""} onChange={(e) => patch({ email: e.target.value })} />
        <input className="rounded border px-3 py-2 text-sm" placeholder={t("profile.address")} value={form.address ?? ""} onChange={(e) => patch({ address: e.target.value })} />
      </div>

      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          {t("profile.accent")}
          <input type="color" className="h-8 w-12 cursor-pointer rounded border" value={form.accentColor} onChange={(e) => patch({ accentColor: e.target.value })} />
        </label>
        <button className="text-xs text-slate-400 hover:underline" onClick={() => patch({ accentColor: DEFAULT_PROFILE.accentColor })}>
          {t("profile.accentReset")}
        </button>
      </div>

      <label className="text-sm">
        {t("profile.notes")}
        <textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={2} value={form.notes ?? ""} onChange={(e) => patch({ notes: e.target.value })} />
      </label>

      {/* Langue */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">{t("profile.lang")}</label>
        <select
          className="rounded border bg-white px-3 py-2 text-sm"
          value={lang}
          onChange={(e) => setLang(e.target.value as LangCode)}
        >
          {(Object.entries(LANGUAGES) as [LangCode, { native: string; label: string }][]).map(([code, info]) => (
            <option key={code} value={code}>{info.native} — {info.label}</option>
          ))}
        </select>
      </div>


      {err && <p className="text-sm font-medium text-red-500">{err}</p>}
      <div className="flex items-center gap-3">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={save}>
          {t("profile.save")}
        </button>
        {flash && <span className="text-sm font-medium text-green-600">{flash}</span>}
      </div>

      <div className="mt-2 grid gap-2 border-t pt-4">
        <h3 className="text-sm font-semibold">{t("profile.backup.title")}</h3>
        <p className="-mt-1 text-xs text-slate-400">{t("profile.backup.desc")}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50" onClick={() => exportBackup()}>
            {t("profile.backup.export")}
          </button>
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">
            {t("profile.backup.restore")}
            <input type="file" accept="application/json" className="hidden" onChange={(e) => restore(e.target.files?.[0])} />
          </label>
        </div>
      </div>
    </section>
  );
}
