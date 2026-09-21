import { useMemo, useState } from "react";
import { formatMoney, whatsappLink, type Currency } from "@atelier/core";

/** Paramètres lus dans l'URL (?v=inscription&org=...&to=...). */
function useParams() {
  return useMemo(() => new URLSearchParams(location.search), []);
}

// base64url compatible Unicode (identique à l'app opérateur).
function b64urlEncode(obj: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function b64urlDecode<T>(s: string): T {
  return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))))) as T;
}

interface FormConfig {
  title: string;
  subtitle?: string;
  interests: string[];
  recontact: string[];
  askStructure: boolean;
  consentText: string;
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
        ) : v === "fiche" ? (
          <Fiche params={p} accent={accent} />
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

// -------------------- Fiche de renseignement (formulaire en ligne) --------------------

const DEFAULT_CFG: FormConfig = {
  title: "Fiche de renseignement & de contact",
  interests: [],
  recontact: [],
  askStructure: true,
  consentText: "J'accepte que mes coordonnées soient utilisées afin d'être recontacté(e).",
};

function Fiche({ params, accent }: { params: URLSearchParams; accent: string }) {
  const org = params.get("org") || "";
  const to = params.get("to") || "";
  const app = params.get("app") || "";
  const cfg = useMemo<FormConfig>(() => {
    try {
      const raw = params.get("cfg");
      return raw ? { ...DEFAULT_CFG, ...b64urlDecode<FormConfig>(raw) } : DEFAULT_CFG;
    } catch {
      return DEFAULT_CFG;
    }
  }, [params]);

  const [f, setF] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    structure: "",
    fonction: "",
    notes: "",
    signature: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [recontact, setRecontact] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, val: string) => setF((s) => ({ ...s, [k]: val }));
  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  function submit() {
    if (!f.name.trim()) return setErr("Votre nom est requis.");
    if (!f.phone.trim()) return setErr("Votre téléphone est requis.");
    if (!consent) return setErr("Merci de cocher l'autorisation de contact.");
    if (!to) return setErr("Lien mal configuré (numéro manquant).");

    const sub = {
      createdAt: Date.now(),
      formTitle: cfg.title,
      name: f.name.trim(),
      phone: f.phone.trim() || undefined,
      email: f.email.trim() || undefined,
      city: f.city.trim() || undefined,
      structure: f.structure.trim() || undefined,
      fonction: f.fonction.trim() || undefined,
      interests,
      recontact,
      notes: f.notes.trim() || undefined,
      signature: f.signature.trim() || undefined,
    };

    const receptionLink = app ? `${app}#reception=${b64urlEncode(sub)}` : "";
    const msg =
      `Nouvelle réponse — ${cfg.title}${org ? ` (${org})` : ""}\n\n` +
      `Nom : ${sub.name}\n` +
      `Téléphone : ${sub.phone}\n` +
      (sub.email ? `Email : ${sub.email}\n` : "") +
      (sub.city ? `Ville : ${sub.city}\n` : "") +
      (sub.structure ? `Structure : ${sub.structure}\n` : "") +
      (sub.fonction ? `Fonction : ${sub.fonction}\n` : "") +
      (interests.length ? `Intérêts : ${interests.join(", ")}\n` : "") +
      (recontact.length ? `Recontact : ${recontact.join(", ")}\n` : "") +
      (sub.notes ? `Notes : ${sub.notes}\n` : "") +
      (receptionLink ? `\nAjouter à mon tableau de bord : ${receptionLink}` : "");

    window.location.href = whatsappLink(to, msg);
  }

  return (
    <div className="grid gap-4">
      <div className="text-center">
        <h1 className="text-xl font-bold" style={{ color: accent }}>
          {cfg.title}
        </h1>
        {cfg.subtitle && <p className="mt-1 text-sm text-slate-500">{cfg.subtitle}</p>}
        {org && <p className="mt-1 text-xs text-slate-400">{org}</p>}
      </div>

      <Card>
        <SectionTitle n={1} accent={accent}>
          Vos coordonnées
        </SectionTitle>
        <div className="mt-3 grid gap-3">
          <Field label="Nom / Prénom *" value={f.name} onChange={(v) => set("name", v)} />
          <Field label="Téléphone *" value={f.phone} onChange={(v) => set("phone", v)} type="tel" />
          <Field label="Email" value={f.email} onChange={(v) => set("email", v)} type="email" />
          <Field label="Ville / Commune" value={f.city} onChange={(v) => set("city", v)} />
          {cfg.askStructure && (
            <>
              <Field label="Structure / Organisation" value={f.structure} onChange={(v) => set("structure", v)} />
              <Field label="Fonction" value={f.fonction} onChange={(v) => set("fonction", v)} />
            </>
          )}
        </div>
      </Card>

      {cfg.interests.length > 0 && (
        <Card>
          <SectionTitle n={2} accent={accent}>
            Ce qui vous intéresse
          </SectionTitle>
          <div className="mt-3 grid gap-2">
            {cfg.interests.map((it) => (
              <Check key={it} label={it} checked={interests.includes(it)} onChange={() => toggle(interests, setInterests, it)} />
            ))}
          </div>
        </Card>
      )}

      {cfg.recontact.length > 0 && (
        <Card>
          <SectionTitle n={3} accent={accent}>
            Pour mieux vous recontacter
          </SectionTitle>
          <div className="mt-3 grid gap-2">
            {cfg.recontact.map((it) => (
              <Check key={it} label={it} checked={recontact.includes(it)} onChange={() => toggle(recontact, setRecontact, it)} />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle n={4} accent={accent}>
          Notes / échange
        </SectionTitle>
        <textarea
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
          rows={3}
          placeholder="Vos remarques, besoins, questions…"
          value={f.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Card>

      <Card>
        <SectionTitle n={5} accent={accent}>
          Autorisation de contact
        </SectionTitle>
        <label className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>{cfg.consentText}</span>
        </label>
        <div className="mt-3">
          <Field label="Signature (nom pour validation)" value={f.signature} onChange={(v) => set("signature", v)} />
        </div>
      </Card>

      {err && <p className="text-center text-sm text-red-500">{err}</p>}

      <button
        className="w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={submit}
      >
        Envoyer ma fiche
      </button>
      <p className="text-center text-xs text-slate-400">
        Votre réponse est envoyée par WhatsApp. Vos données ne transitent par aucun serveur.
      </p>
    </div>
  );
}

function SectionTitle({ n, accent, children }: { n: number; accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: accent }}
      >
        {n}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{children}</h2>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
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
