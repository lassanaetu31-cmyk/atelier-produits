import { useEffect, useState } from "react";
import EditorView from "./components/EditorView";
import ClientsView from "./components/ClientsView";
import HistoryView from "./components/HistoryView";
import MembersView from "./components/MembersView";
import FormsView from "./components/FormsView";
import ProfileView from "./components/ProfileView";
import { useLicense } from "./license-context";
import { importFromHash } from "./reception";
import type { SavedProposal } from "./types";

type Tab = "editor" | "clients" | "members" | "forms" | "history" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "editor", label: "Éditeur" },
  { id: "clients", label: "Clients" },
  { id: "members", label: "Adhérents" },
  { id: "forms", label: "Formulaire" },
  { id: "history", label: "Historique" },
  { id: "profile", label: "Profil" },
];

export default function App() {
  const { license, deactivate } = useLicense();
  const [tab, setTab] = useState<Tab>("editor");
  const [loaded, setLoaded] = useState<SavedProposal | null>(null);
  // Clé de remontage : force EditorView à se réinitialiser sur "Nouveau" / "Ouvrir".
  const [editorKey, setEditorKey] = useState(0);
  const [banner, setBanner] = useState("");

  // Lien de réception tapé depuis WhatsApp (#reception=…) : importe la réponse au démarrage.
  useEffect(() => {
    importFromHash().then((ok) => {
      if (ok) {
        setTab("forms");
        setBanner("Nouvelle réponse au formulaire reçue ✓");
        setTimeout(() => setBanner(""), 4000);
      }
    });
  }, []);

  function newProposal() {
    setLoaded(null);
    setEditorKey((k) => k + 1);
    setTab("editor");
  }

  function openProposal(p: SavedProposal) {
    setLoaded(p);
    setEditorKey((k) => k + 1);
    setTab("editor");
  }

  // L'onglet Adhérents affiche un tableau : conteneur élargi.
  const width = tab === "members" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white px-6 py-4">
        <div className={`mx-auto flex ${width} items-center justify-between`}>
          <div>
            <h1 className="text-xl font-bold text-blue-600">Proposal Generator</h1>
            <p className="text-sm text-slate-500">Atelier Produits · app #3</p>
          </div>
          <div className="flex items-center gap-3">
            {license && (
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                  Licence {license.plan}
                </span>
                <button className="hover:underline" onClick={deactivate} title="Déconnecter la licence">
                  Déconnecter
                </button>
              </span>
            )}
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={newProposal}
            >
              + Nouvelle
            </button>
          </div>
        </div>
        <nav className={`mx-auto mt-4 flex ${width} gap-1`}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                tab === t.id ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {banner && (
        <div className={`mx-auto ${width} px-6 pt-4`}>
          <div className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            {banner}
          </div>
        </div>
      )}

      <main className={`mx-auto ${width} p-6`}>
        {tab === "editor" && <EditorView key={editorKey} initial={loaded} onSaved={() => setTab("history")} />}
        {tab === "clients" && <ClientsView />}
        {tab === "members" && <MembersView />}
        {tab === "forms" && <FormsView />}
        {tab === "history" && <HistoryView onOpen={openProposal} />}
        {tab === "profile" && <ProfileView />}
      </main>
    </div>
  );
}
