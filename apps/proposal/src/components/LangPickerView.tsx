import { useState } from "react";
import { LANGUAGES, type LangCode } from "../i18n/translations";
import { useLang } from "../i18n/context";

export default function LangPickerView({ onDone }: { onDone: () => void }) {
  const { lang, setLang, t } = useLang();
  const [selected, setSelected] = useState<LangCode>(lang);

  function confirm() {
    setLang(selected);
    onDone();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">🌍 {t("lang.title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("lang.subtitle")}</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {(Object.entries(LANGUAGES) as [LangCode, { label: string; native: string }][]).map(([code, info]) => (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                selected === code
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="min-w-0 flex-1 text-left">
                <span className="block font-semibold">{info.native}</span>
                <span className="block text-xs text-slate-400">{info.label}</span>
              </span>
              {selected === code && <span className="text-blue-500">✓</span>}
            </button>
          ))}
        </div>

        <button
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          onClick={confirm}
        >
          {t("lang.continue")}
        </button>
      </div>
    </div>
  );
}
