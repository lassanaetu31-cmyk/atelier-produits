import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useProfile } from "../profile";
import { inscriptionLink, portalReady } from "../portal-links";
import {
  addMembers,
  computeStats,
  downloadMembersTemplate,
  exportMembersCsv,
  exportMembersJson,
  exportMembersPdf,
  parseMembersCsv,
  statusOf,
  type DerivedStatus,
} from "../members";
import type { Member } from "../types";

const EMPTY: Omit<Member, "createdAt"> = {
  matricule: "",
  name: "",
  email: "",
  city: "",
  type: "Annuel",
  expiresAt: "",
  paid: false,
};

type Filter = "Tous" | "Payé" | "Non payé";

const BADGE: Record<DerivedStatus, string> = {
  "Payé": "bg-green-100 text-green-700",
  "En retard": "bg-red-100 text-red-600",
  "Non payé": "bg-amber-100 text-amber-700",
};

export default function MembersView() {
  const profile = useProfile();
  const members = useLiveQuery<Member[], Member[]>(
    () => db.members.orderBy("name").toArray(),
    [],
    [],
  );
  const [form, setForm] = useState<Omit<Member, "createdAt">>(EMPTY);
  const [filter, setFilter] = useState<Filter>("Tous");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const inscription = inscriptionLink(profile, ["Mensuel", "Trimestriel", "Annuel"]);

  async function copyLink() {
    if (!inscription) return;
    try {
      await navigator.clipboard.writeText(inscription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez ce lien :", inscription);
    }
  }

  const stats = useMemo(() => computeStats(members), [members]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter === "Payé" && !m.paid) return false;
      if (filter === "Non payé" && m.paid) return false;
      if (!q) return true;
      return [m.matricule, m.name, m.email, m.city].some((v) =>
        (v ?? "").toLowerCase().includes(q),
      );
    });
  }, [members, filter, query]);

  function patch(p: Partial<Member>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function submit() {
    if (!form.name.trim() && !form.matricule.trim()) return;
    if (form.id) {
      await db.members.update(form.id, form);
    } else {
      await db.members.add({ ...form, createdAt: Date.now() });
    }
    setForm(EMPTY);
  }

  async function togglePaid(m: Member) {
    if (m.id) await db.members.update(m.id, { paid: !m.paid });
  }

  async function onImport(file?: File) {
    if (!file) return;
    setMsg("");
    try {
      const list = parseMembersCsv(await file.text());
      if (list.length === 0) {
        setMsg("Aucun adhérent trouvé dans le fichier.");
        return;
      }
      const { added, skipped } = await addMembers(list);
      setMsg(`${added} adhérent(s) importé(s)${skipped ? `, ${skipped} ignoré(s) (doublons/vides)` : ""}.`);
    } catch {
      setMsg("Fichier illisible. Utilisez un CSV (matricule, nom, email, ville, type, expire, statut).");
    }
  }

  async function onExport(kind: "csv" | "pdf" | "json") {
    const n =
      kind === "csv"
        ? await exportMembersCsv()
        : kind === "pdf"
          ? await exportMembersPdf(`${profile.name} — Adhérents`, profile.accentColor)
          : await exportMembersJson();
    if (n === 0) setMsg("Aucun adhérent à exporter.");
  }

  return (
    <div className="grid gap-6">
      {/* Statistiques */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Adhérents" value={stats.total} tone="slate" />
        <StatCard label="À jour" value={stats.upToDate} tone="green" />
        <StatCard label="En retard" value={stats.late} tone="red" />
        <StatCard label="Taux de recouvrement" value={`${stats.recoveryRate}%`} tone="blue" />
      </section>

      {/* Recherche + filtres */}
      <section className="flex flex-wrap items-center gap-3">
        <input
          className="min-w-[220px] flex-1 rounded-lg border px-3 py-2 text-sm"
          placeholder="Rechercher (nom, matricule, email, ville…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-1">
          {(["Tous", "Payé", "Non payé"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                filter === f ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Formulaire ajout / édition */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{form.id ? "Modifier l'adhérent" : "Nouvel adhérent"}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Matricule"
            value={form.matricule}
            onChange={(e) => patch({ matricule: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Nom / Prénom *"
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email ?? ""}
            onChange={(e) => patch({ email: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Ville"
            value={form.city ?? ""}
            onChange={(e) => patch({ city: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Type (Mensuel, Annuel…)"
            list="member-types"
            value={form.type}
            onChange={(e) => patch({ type: e.target.value })}
          />
          <datalist id="member-types">
            <option value="Mensuel" />
            <option value="Trimestriel" />
            <option value="Annuel" />
          </datalist>
          <label className="text-xs text-slate-500">
            Expire le
            <input
              className="mt-0.5 w-full rounded border px-3 py-1.5 text-sm"
              type="date"
              value={form.expiresAt ?? ""}
              onChange={(e) => patch({ expiresAt: e.target.value })}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={(e) => patch({ paid: e.target.checked })}
            />
            Cotisation réglée
          </label>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={submit}
          >
            {form.id ? "Enregistrer" : "Ajouter"}
          </button>
          {form.id && (
            <button className="text-sm text-slate-500 hover:underline" onClick={() => setForm(EMPTY)}>
              Annuler
            </button>
          )}
        </div>
      </section>

      {/* Tableau */}
      <section className="overflow-x-auto rounded-xl border bg-white">
        <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
          {visible.length} adhérent{visible.length > 1 ? "s" : ""}
          {filter !== "Tous" && <span className="text-slate-400"> · filtre {filter}</span>}
        </div>
        {visible.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">Aucun adhérent.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2">Matricule</th>
                <th className="px-4 py-2">Nom / Prénom</th>
                <th className="px-4 py-2">Ville</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Expire</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((m) => {
                const st = statusOf(m);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{m.matricule || "—"}</td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{m.name}</div>
                      {m.email && <div className="text-xs text-slate-400">{m.email}</div>}
                    </td>
                    <td className="px-4 py-2 text-slate-500">{m.city || "—"}</td>
                    <td className="px-4 py-2 text-slate-500">{m.type || "—"}</td>
                    <td className="px-4 py-2 text-slate-500">{m.expiresAt || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE[st]}`}>{st}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-3">
                        <button
                          className={m.paid ? "text-amber-600 hover:underline" : "text-green-600 hover:underline"}
                          onClick={() => togglePaid(m)}
                        >
                          {m.paid ? "Marquer non payé" : "Marquer payé"}
                        </button>
                        <button className="text-blue-600 hover:underline" onClick={() => setForm(m)}>
                          Modifier
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => m.id && db.members.delete(m.id)}
                        >
                          Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Lien d'inscription public */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Lien d'inscription public</h2>
        {portalReady(profile) ? (
          <>
            <p className="-mt-1 text-xs text-slate-400">
              Partagez ce lien (bio, statut WhatsApp, flyer, QR). Vos adhérents s'inscrivent sans
              rien installer — leur inscription vous arrive par WhatsApp, à recopier ici.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                readOnly
                className="min-w-[240px] flex-1 rounded-lg border bg-slate-50 px-3 py-2 font-mono text-xs"
                value={inscription ?? ""}
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={copyLink}
              >
                {copied ? "Copié ✓" : "Copier le lien"}
              </button>
              <a
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                href={inscription ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                Tester
              </a>
            </div>
          </>
        ) : (
          <p className="-mt-1 text-xs text-slate-400">
            Renseignez votre numéro WhatsApp et l'URL du portail dans l'onglet{" "}
            <span className="font-medium">Profil</span> pour activer le lien d'inscription public.
          </p>
        )}
      </section>

      {/* Fichier de suivi */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Fichier de suivi</h2>
        <p className="-mt-1 text-xs text-slate-400">
          Saisissez vos adhérents à la main, ou importez un CSV. Exportez la liste à jour quand vous
          voulez. Tout reste sur cet appareil.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">
            Importer un CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                onImport(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
            onClick={() => onExport("csv")}
          >
            Exporter CSV
          </button>
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
            onClick={() => onExport("pdf")}
          >
            Télécharger PDF
          </button>
          <button
            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
            onClick={() => onExport("json")}
          >
            Télécharger adhérents.json
          </button>
          <button className="text-slate-500 hover:underline" onClick={downloadMembersTemplate}>
            Modèle CSV
          </button>
        </div>
        {msg && <p className="text-sm font-medium text-green-600">{msg}</p>}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "slate" | "green" | "red" | "blue";
}) {
  const color = {
    slate: "text-slate-700",
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  }[tone];
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
