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
import { useLang } from "../i18n/context";

const EMPTY: Omit<Member, "createdAt"> = {
  matricule: "",
  name: "",
  email: "",
  city: "",
  type: "Annuel",
  expiresAt: "",
  paid: false,
};

type Filter = "all" | "paid" | "unpaid";

export default function MembersView() {
  const { t } = useLang();
  const profile = useProfile();
  const members = useLiveQuery<Member[], Member[]>(
    () => db.members.orderBy("name").toArray(),
    [],
    [],
  );
  const [form, setForm] = useState<Omit<Member, "createdAt">>(EMPTY);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const inscription = inscriptionLink(profile, ["Mensuel", "Trimestriel", "Annuel"]);

  const BADGE: Record<DerivedStatus, string> = {
    "Payé": "bg-green-100 text-green-700",
    "En retard": "bg-red-100 text-red-600",
    "Non payé": "bg-amber-100 text-amber-700",
  };

  const statusLabel: Record<DerivedStatus, string> = {
    "Payé": t("members.statusPaid"),
    "En retard": t("members.statusLate"),
    "Non payé": t("members.statusUnpaid"),
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: t("members.filter.all") },
    { key: "paid", label: t("members.filter.paid") },
    { key: "unpaid", label: t("members.filter.unpaid") },
  ];

  async function copyLink() {
    if (!inscription) return;
    try {
      await navigator.clipboard.writeText(inscription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("members.copyPrompt"), inscription);
    }
  }

  const stats = useMemo(() => computeStats(members), [members]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter === "paid" && !m.paid) return false;
      if (filter === "unpaid" && m.paid) return false;
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
        setMsg(t("members.importNone"));
        return;
      }
      const { added, skipped } = await addMembers(list);
      setMsg(
        t("members.importOk", { added }) +
        (skipped ? t("members.importSkipped", { skipped }) : "") + ".",
      );
    } catch {
      setMsg(t("members.importBad"));
    }
  }

  async function onExport(kind: "csv" | "pdf" | "json") {
    const n =
      kind === "csv"
        ? await exportMembersCsv()
        : kind === "pdf"
          ? await exportMembersPdf(`${profile.name} — ${t("members.title")}`, profile.accentColor)
          : await exportMembersJson();
    if (n === 0) setMsg(t("members.exportNone"));
  }

  const activeFilterLabel = FILTERS.find((f) => f.key === filter)?.label ?? "";

  return (
    <div className="grid gap-6">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t("members.statsTotal")} value={stats.total} tone="slate" />
        <StatCard label={t("members.statsUpToDate")} value={stats.upToDate} tone="green" />
        <StatCard label={t("members.statsLate")} value={stats.late} tone="red" />
        <StatCard label={t("members.statsRecovery")} value={`${stats.recoveryRate}%`} tone="blue" />
      </section>

      {/* Search + filters */}
      <section className="flex flex-wrap items-center gap-3">
        <input
          className="min-w-[220px] flex-1 rounded-lg border px-3 py-2 text-sm"
          placeholder={t("members.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                filter === f.key ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Add / edit form */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{form.id ? t("members.editTitle") : t("members.newTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder={t("members.colMatricule")}
            value={form.matricule}
            onChange={(e) => patch({ matricule: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder={t("members.name")}
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder={t("members.email")}
            value={form.email ?? ""}
            onChange={(e) => patch({ email: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder={t("members.city")}
            value={form.city ?? ""}
            onChange={(e) => patch({ city: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder={t("members.typePlaceholder")}
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
            {t("members.expires")}
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
            {t("members.paidCheckbox")}
          </label>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={submit}
          >
            {form.id ? t("members.saveBtn") : t("members.addBtn")}
          </button>
          {form.id && (
            <button className="text-sm text-slate-500 hover:underline" onClick={() => setForm(EMPTY)}>
              {t("members.cancel")}
            </button>
          )}
        </div>
      </section>

      {/* Table */}
      <section className="overflow-x-auto rounded-xl border bg-white">
        <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
          {t("members.countLabel", { count: visible.length })}
          {filter !== "all" && <span className="text-slate-400">{t("members.activeFilter", { filter: activeFilterLabel })}</span>}
        </div>
        {visible.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">{t("members.empty")}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2">{t("members.colMatricule")}</th>
                <th className="px-4 py-2">{t("members.colName")}</th>
                <th className="px-4 py-2">{t("members.colCity")}</th>
                <th className="px-4 py-2">{t("members.colType")}</th>
                <th className="px-4 py-2">{t("members.colExpires")}</th>
                <th className="px-4 py-2">{t("members.colStatus")}</th>
                <th className="px-4 py-2 text-right">{t("members.colAction")}</th>
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
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE[st]}`}>
                        {statusLabel[st]}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-3">
                        <button
                          className={m.paid ? "text-amber-600 hover:underline" : "text-green-600 hover:underline"}
                          onClick={() => togglePaid(m)}
                        >
                          {m.paid ? t("members.markUnpaid") : t("members.markPaid")}
                        </button>
                        <button className="text-blue-600 hover:underline" onClick={() => setForm(m)}>
                          {t("members.edit")}
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => m.id && db.members.delete(m.id)}
                        >
                          {t("members.delete")}
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

      {/* Registration link */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{t("members.linkTitle")}</h2>
        {portalReady(profile) ? (
          <>
            <p className="-mt-1 text-xs text-slate-400">{t("members.linkDesc")}</p>
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
                {copied ? t("members.copied") : t("members.copy")}
              </button>
              <a
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                href={inscription ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                {t("members.testLink")}
              </a>
            </div>
          </>
        ) : (
          <p className="-mt-1 text-xs text-slate-400">{t("members.noPortal")}</p>
        )}
      </section>

      {/* Import / export */}
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{t("members.trackingTitle")}</h2>
        <p className="-mt-1 text-xs text-slate-400">{t("members.trackingDesc")}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">
            {t("members.importCsv")}
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
            {t("members.exportCsv")}
          </button>
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
            onClick={() => onExport("pdf")}
          >
            {t("members.exportPdfLabel")}
          </button>
          <button
            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
            onClick={() => onExport("json")}
          >
            {t("members.exportJsonLabel")}
          </button>
          <button className="text-slate-500 hover:underline" onClick={downloadMembersTemplate}>
            {t("members.downloadTemplate")}
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
