import { useState } from "react";
import ProductsView from "./components/ProductsView";
import ProfileView from "./components/ProfileView";
import { useProfile } from "./profile";
import { useLicense } from "./license-context";

type Tab = "products" | "catalog" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "products", label: "Produits" },
  { id: "catalog", label: "Catalogue" },
  { id: "profile", label: "Profil" },
];

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-400">
      {title} — à venir
    </div>
  );
}

export default function App() {
  const { license, deactivate } = useLicense();
  const profile = useProfile();
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Catalog Builder</h1>
            <p className="text-sm text-slate-500">Atelier Produits · app #2 · {profile.name}</p>
          </div>
          {license && (
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                Licence {license.plan}
              </span>
              <button className="hover:underline" onClick={deactivate}>
                Déconnecter
              </button>
            </span>
          )}
        </div>
        <nav className="mx-auto mt-4 flex max-w-4xl gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                tab === t.id ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        {tab === "products" && <ProductsView />}
        {tab === "catalog" && <Placeholder title="Catalogue PDF + WhatsApp" />}
        {tab === "profile" && <ProfileView />}
      </main>
    </div>
  );
}
