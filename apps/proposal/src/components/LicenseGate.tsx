import { useEffect, useState, type ReactNode } from "react";
import {
  clearLicense,
  loadLicense,
  saveLicense,
  verifyLicense,
  type LicensePayload,
} from "@atelier/core";
import { LicenseContext, PRODUCT_ID, PRODUCT_NAME, GUMROAD_PERMALINK } from "../license-context";
import { useLang } from "../i18n/context";

type Status = "checking" | "locked" | "unlocked";

const WA_NUMBER = "221761890003";

export default function LicenseGate({ children, buyer }: { children: ReactNode; buyer: string }) {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("checking");
  const [license, setLicense] = useState<LicensePayload | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const stored = loadLicense();
      if (!stored) return setStatus("locked");
      const res = await verifyLicense(stored, GUMROAD_PERMALINK);
      if (res.valid && (res.payload?.product === PRODUCT_ID || res.payload?.product === GUMROAD_PERMALINK)) {
        setLicense(res.payload);
        setStatus("unlocked");
      } else {
        setStatus("locked");
      }
    })();
  }, []);

  async function activate() {
    setError("");
    const key = keyInput.trim();
    const res = await verifyLicense(key, GUMROAD_PERMALINK);
    if (!res.valid) return setError(res.reason ?? t("license.invalidKey"));
    if (res.payload?.product !== PRODUCT_ID && res.payload?.product !== GUMROAD_PERMALINK) {
      return setError(t("license.wrongProduct"));
    }
    saveLicense(key);
    setLicense(res.payload);
    setStatus("unlocked");
  }

  function deactivate() {
    clearLicense();
    setLicense(null);
    setKeyInput("");
    setStatus("locked");
  }

  const waText = encodeURIComponent(`Hello, my name is: ${buyer}\nI purchased ${PRODUCT_NAME} and I would like to receive my activation key.`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  if (status === "checking") {
    return <div className="grid min-h-screen place-items-center text-slate-400">{t("license.loading")}</div>;
  }

  if (status === "locked") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-blue-600">{PRODUCT_NAME}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("license.subtitle")}</p>
          <input
            className="mt-4 w-full rounded border px-3 py-2 font-mono text-sm"
            placeholder={t("license.placeholder")}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && activate()}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={activate}
            disabled={!keyInput.trim()}
          >
            {t("license.activate")}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2.5 font-semibold text-green-600 hover:bg-green-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("license.askKey")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <LicenseContext.Provider value={{ license, deactivate }}>{children}</LicenseContext.Provider>
  );
}
