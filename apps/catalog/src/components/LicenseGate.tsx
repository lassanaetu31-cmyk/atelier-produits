import { useEffect, useState, type ReactNode } from "react";
import {
  clearLicense,
  loadLicense,
  saveLicense,
  verifyLicense,
  type LicensePayload,
} from "@atelier/core";
import { LicenseContext, PRODUCT_ID, PRODUCT_NAME } from "../license-context";

type Status = "checking" | "locked" | "unlocked";

export default function LicenseGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [license, setLicense] = useState<LicensePayload | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const stored = loadLicense();
      if (!stored) return setStatus("locked");
      const res = await verifyLicense(stored);
      if (res.valid && res.payload?.product === PRODUCT_ID) {
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
    const res = await verifyLicense(key);
    if (!res.valid) return setError(res.reason ?? "Clé invalide.");
    if (res.payload?.product !== PRODUCT_ID) {
      return setError("Cette clé n'est pas valide pour ce produit.");
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

  if (status === "checking") {
    return <div className="grid min-h-screen place-items-center text-slate-400">Chargement…</div>;
  }

  if (status === "locked") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-indigo-600">{PRODUCT_NAME}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Entrez votre clé de licence pour activer le logiciel.
          </p>
          <input
            className="mt-4 w-full rounded border px-3 py-2 font-mono text-sm"
            placeholder="Coller la clé de licence"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && activate()}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={activate}
            disabled={!keyInput.trim()}
          >
            Activer
          </button>
          <p className="mt-4 text-xs text-slate-400">
            Acheté sans clé ? Contactez le vendeur avec votre reçu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LicenseContext.Provider value={{ license, deactivate }}>{children}</LicenseContext.Provider>
  );
}
