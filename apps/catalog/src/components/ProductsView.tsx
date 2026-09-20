import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatMoney, resizeImageDataUrl } from "@atelier/core";
import { db } from "../db";
import { useProfile } from "../profile";
import type { Product } from "../types";

const EMPTY: Omit<Product, "createdAt"> = {
  name: "",
  price: 0,
  category: "",
  reference: "",
  description: "",
  available: true,
};

export default function ProductsView() {
  const profile = useProfile();
  const products = useLiveQuery(() => db.products.orderBy("createdAt").reverse().toArray(), [], []);
  const [form, setForm] = useState<Omit<Product, "createdAt"> & { id?: number }>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function patch(p: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function onImage(file?: File) {
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      patch({ imageDataUrl: await resizeImageDataUrl(file) });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Image invalide.");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!form.name.trim()) return setErr("Le nom du produit est requis.");
    setErr("");
    if (form.id) {
      const { id, ...rest } = form;
      await db.products.update(id, rest);
    } else {
      await db.products.add({ ...form, createdAt: Date.now() });
    }
    setForm(EMPTY);
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">{form.id ? "Modifier le produit" : "Nouveau produit"}</h2>

        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-50">
            {form.imageDataUrl ? (
              <img src={form.imageDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-slate-400">Photo</span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => onImage(e.target.files?.[0])} />
            {busy && <span className="text-xs text-slate-400">Compression…</span>}
            {form.imageDataUrl && (
              <button
                className="text-left text-xs text-red-500 hover:underline"
                onClick={() => patch({ imageDataUrl: undefined })}
              >
                Retirer la photo
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Nom du produit *"
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-right text-sm"
            type="number"
            min={0}
            placeholder="Prix"
            value={form.price}
            onChange={(e) => patch({ price: Number(e.target.value) })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Catégorie"
            value={form.category ?? ""}
            onChange={(e) => patch({ category: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Référence"
            value={form.reference ?? ""}
            onChange={(e) => patch({ reference: e.target.value })}
          />
        </div>

        <textarea
          className="rounded border px-3 py-2 text-sm"
          rows={2}
          placeholder="Description"
          value={form.description ?? ""}
          onChange={(e) => patch({ description: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => patch({ available: e.target.checked })}
          />
          Disponible
        </label>

        {err && <p className="text-sm font-medium text-red-500">{err}</p>}
        <div className="flex gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={submit}
            disabled={busy}
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
          {products.length} produit{products.length > 1 ? "s" : ""}
        </div>
        {products.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">Aucun produit. Ajoutez votre premier article.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            {products.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-lg border">
                <div className="aspect-square bg-slate-50">
                  {p.imageDataUrl ? (
                    <img src={p.imageDataUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-300">Sans photo</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-sm font-semibold text-indigo-600">
                    {formatMoney(p.price, profile.currency)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {p.category || "—"}
                    {!p.available && <span className="ml-1 text-red-400">· indisponible</span>}
                  </p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <button className="text-indigo-600 hover:underline" onClick={() => setForm(p)}>
                      Modifier
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => p.id && db.products.delete(p.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
