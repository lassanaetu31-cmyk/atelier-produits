import { useState } from "react";
import EditorView from "./components/EditorView";
import ClientsView from "./components/ClientsView";
import HistoryView from "./components/HistoryView";
import type { SavedDocument } from "./types";

type Tab = "editor" | "clients" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "editor", label: "Éditeur" },
  { id: "clients", label: "Clients" },
  { id: "history", label: "Historique" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("editor");
  const [loaded, setLoaded] = useState<SavedDocument | null>(null);
  // Clé de remontage: force EditorView à se réinitialiser sur "Nouveau" ou "Ouvrir".
  const [editorKey, setEditorKey] = useState(0);

  function newDocument() {
    setLoaded(null);
    setEditorKey((k) => k + 1);
    setTab("editor");
  }

  function openDocument(doc: SavedDocument) {
    setLoaded(doc);
    setEditorKey((k) => k + 1);
    setTab("editor");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Invoice Generator</h1>
            <p className="text-sm text-slate-500">Atelier Produits · app #1</p>
          </div>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={newDocument}
          >
            + Nouveau
          </button>
        </div>
        <nav className="mx-auto mt-4 flex max-w-3xl gap-1">
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

      <main className="mx-auto max-w-3xl p-6">
        {tab === "editor" && (
          <EditorView key={editorKey} initial={loaded} onSaved={() => setTab("history")} />
        )}
        {tab === "clients" && <ClientsView />}
        {tab === "history" && <HistoryView onOpen={openDocument} />}
      </main>
    </div>
  );
}
