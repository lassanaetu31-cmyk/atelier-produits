import { useMemo, useState } from "react";
import { formatMoney, whatsappLink, type Currency } from "@atelier/core";

/** Paramètres lus dans l'URL (?v=inscription&org=...&to=...). */
function useParams() {
  return useMemo(() => new URLSearchParams(location.search), []);
}

export default function App() {
  const p = useParams();
  const v = p.get("v");
  const accent = "#" + (p.get("accent")?.replace("#", "") || "2563eb");

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto w-full max-w-md">
        {v === "inscription" ? (
          <Inscription params={p} accent={accent} />
        ) : v === "accept" ? (
          <Accept params={p} accent={accent} />
        ) : (
          <Landing />
        )}
        <p className="mt-6 text-center text-xs text-slate-400">
          Propulsé par Atelier · aucune donnée n'est envoyée à un serveur
        </p>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-white p-6 shadow-sm">{children}</div>;
}

function Landing() {
  return (
    <Card>
      <h1 className="text-lg font-bold text-blue-600">Portail Atelier</h1>
      <p className="mt-2 text-sm text-slate-500">
        Ce lien est incomplet. Ouvrez le lien exact qu'on vous a partagé
        (inscription ou proposition à accepter).
      </p>
    </Card>
  );
}

// -------------------- Inscription adhérent --------------------

function Inscription({ params, accent }: { params: URLSearchParams; accent: string }) {
  const org = params.get("org") || "l'organisation";
  const to = params.get("to") || "";
  const types = (params.get("types") || "Mensuel,Trimestriel,Annuel")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const [f, setF] = useState({ name: "", phone: "", email: "", city: "", type: types[0] || "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, val: string) => setF((s) => ({ ...s, [k]: val }));

  function submit() {
    if (!f.name.trim()) return setErr("Votre nom est requis.");
    if (!to) return setErr("Lien mal configuré (numéro manquant).");
    const msg =
      `Nouvelle inscription — ${org}\n\n` +
      `Nom : ${f.name}\n` +
      (f.phone ? `Téléphone : ${f.phone}\n` : "") +
      (f.email ? `Email : ${f.email}\n` : "") +
      (f.city ? `Ville : ${f.city}\n` : "") +
      (f.type ? `Type d'adhésion : ${f.type}\n` : "");
    window.location.href = whatsappLink(to, msg);
  }

  return (
    <Card>
      <h1 className="text-lg font-bold" style={{ color: accent }}>
        Inscription — {org}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Remplissez ce formulaire, puis envoyez : votre inscription part par WhatsApp.
      </p>

      <div className="mt-4 grid gap-3">
        <Field label="Nom / Prénom *" value={f.name} onChange={(v) => set("name", v)} />
        <Field label="Téléphone" value={f.phone} onChange={(v) => set("phone", v)} type="tel" />
        <Field label="Email" value={f.email} onChange={(v) => set("email", v)} type="email" />
        <Field label="Ville" value={f.city} onChange={(v) => set("city", v)} />
        {types.length > 0 && (
          <label className="text-sm">
            Type d'adhésion
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

      <button
        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={submit}
      >
        Envoyer mon inscription
      </button>
    </Card>
  );
}

// -------------------- Acceptation de proposition --------------------

function Accept({ params, accent }: { params: URLSearchParams; accent: string }) {
  const org = params.get("org") || "le prestataire";
  const to = params.get("to") || "";
  const num = params.get("num") || "";
  const title = params.get("title") || "Proposition commerciale";
  const cur = (params.get("cur") as Currency) || "XOF";
  const amount = Number(params.get("amount") || "0");
  const days = params.get("days");
  const [name, setName] = useState(params.get("client") || "");
  const [err, setErr] = useState("");

  function accept() {
    if (!name.trim()) return setErr("Indiquez votre nom pour valider.");
    if (!to) return setErr("Lien mal configuré (numéro manquant).");
    const msg =
      `Bonjour ${org},\n\n` +
      `J'accepte la proposition « ${title} »` +
      (num ? ` (réf. ${num})` : "") +
      (amount ? `, montant ${formatMoney(amount, cur)}` : "") +
      `.\nBon pour accord — ${name}, le ${new Date().toLocaleDateString("fr-FR")}.`;
    window.location.href = whatsappLink(to, msg);
  }

  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-400">Proposition de {org}</p>
      <h1 className="mt-1 text-lg font-bold" style={{ color: accent }}>
        {title}
      </h1>
      <div className="mt-3 grid gap-1 text-sm text-slate-600">
        {num && <div>Référence : {num}</div>}
        {amount > 0 && (
          <div>
            Montant : <span className="font-semibold">{formatMoney(amount, cur)}</span>
          </div>
        )}
        {days && <div className="text-slate-400">Offre valable {days} jours</div>}
      </div>

      <label className="mt-4 block text-sm">
        Votre nom (bon pour accord)
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

      <button
        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={accept}
      >
        J'accepte cette proposition
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        Votre acceptation est envoyée au prestataire par WhatsApp.
      </p>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        className="mt-1 w-full rounded-lg border px-3 py-2"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
