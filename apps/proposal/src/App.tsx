import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "./firebase";
import { LanguageProvider, useLang, LANG_STORAGE_KEY } from "./i18n/context";
import AuthView from "./components/AuthView";
import LangPickerView from "./components/LangPickerView";
import EditorView from "./components/EditorView";
import ClientsView from "./components/ClientsView";
import HistoryView from "./components/HistoryView";
import MembersView from "./components/MembersView";
import FormsView from "./components/FormsView";
import ProfileView from "./components/ProfileView";
import LicenseGate from "./components/LicenseGate";
import { importFromHash } from "./reception";
import type { SavedProposal } from "./types";

type Tab = "editor" | "clients" | "members" | "forms" | "history" | "profile";

const TABS: { id: Tab; labelKey: string }[] = [
  { id: "editor", labelKey: "nav.editor" },
  { id: "clients", labelKey: "nav.clients" },
  { id: "members", labelKey: "nav.members" },
  { id: "forms", labelKey: "nav.forms" },
  { id: "history", labelKey: "nav.history" },
  { id: "profile", labelKey: "nav.profile" },
];

function AppShell({ user }: { user: User }) {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("editor");
  const [loaded, setLoaded] = useState<SavedProposal | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    importFromHash().then((ok) => {
      if (ok) {
        setTab("forms");
        setBanner(t("app.banner"));
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

  const width = tab === "members" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white px-3 py-3 sm:px-6 sm:py-4">
        <div className={`mx-auto flex ${width} items-center justify-between`}>
          <div>
            <h1 className="text-lg font-bold text-blue-600 sm:text-xl">Proposal Generator</h1>
            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={newProposal}
            >
              {t("app.new")}
            </button>
            <button
              className="rounded-lg border px-2 py-2 text-xs text-slate-500 hover:bg-slate-50"
              onClick={() => signOut(auth)}
              title={t("auth.logout")}
            >
              ⎋
            </button>
          </div>
        </div>
        <nav className={`mx-auto mt-3 flex ${width} gap-0.5`}>
          {TABS.map((tab_item) => (
            <button
              key={tab_item.id}
              className={`flex-1 rounded-lg px-1 py-2 text-xs font-medium sm:px-3 sm:text-sm ${
                tab === tab_item.id ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setTab(tab_item.id)}
            >
              {t(tab_item.labelKey)}
            </button>
          ))}
        </nav>
      </header>

      {banner && (
        <div className="bg-green-50 px-4 py-2 text-center text-sm font-medium text-green-700">
          {banner}
        </div>
      )}

      <main className={`mx-auto ${width} px-3 py-6 sm:px-6`}>
        {tab === "editor" && (
          <EditorView key={editorKey} initial={loaded} onSaved={() => {}} />
        )}
        {tab === "clients" && <ClientsView />}
        {tab === "members" && <MembersView />}
        {tab === "forms" && <FormsView />}
        {tab === "history" && <HistoryView onOpen={openProposal} />}
        {tab === "profile" && <ProfileView />}
      </main>
    </div>
  );
}

function AppWithAuth() {
  const [user, setUser] = useState<User | null | "loading">("loading");
  const [langChosen, setLangChosen] = useState(() => !!localStorage.getItem(LANG_STORAGE_KEY));

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (user === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <AuthView />;
  if (!langChosen) return <LangPickerView onDone={() => setLangChosen(true)} />;

  return (
    <LicenseGate>
      <AppShell user={user} />
    </LicenseGate>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppWithAuth />
    </LanguageProvider>
  );
}
