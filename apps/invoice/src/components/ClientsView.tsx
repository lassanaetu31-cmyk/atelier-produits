import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import type { Client } from "../types";

const EMPTY: Omit<Client, "createdAt"> = { name: "", phone: "", email: "", address: "" };

export default function ClientsView() {
  const clients = useLiveQuery(() => db.clients.orderBy("name").toArray(), [], []);
  const [form, setForm] = useState<Omit<Client, "createdAt">>(EMPTY);

  async function submit() {
    if (!form.name.trim()) return;
    if (form.id) {
      await db.clients.update(form.id, form);
    } else {
      await db.clients.add({ ...form, createdAt: Date.now() });
    }
    setForm(EMPTY);
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{form.id ? "Modifier le client" : "Nouveau client"}</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Nom *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Téléphone"
            value={form.phone ?? ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Adresse"
            value={form.address ?? ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
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

      <section className="rounded-xl border bg-white">
        <div className="border-b px-5 py-3 text-sm font-semibold text-slate-500">
          {clients.length} client{clients.length > 1 ? "s" : ""}
        </div>
        {clients.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">Aucun client enregistré.</p>
        ) : (
          <ul className="divide-y">
            {clients.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-slate-400">
                    {[c.phone, c.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button className="text-blue-600 hover:underline" onClick={() => setForm(c)}>
                    Modifier
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => c.id && db.clients.delete(c.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
