import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useLang } from "../i18n/context";

export default function AuthView() {
  const { t } = useLang();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function withGoogle() {
    setErr("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: unknown) {
      setErr(t("auth.error.generic"));
    } finally {
      setLoading(false);
    }
  }

  async function withEmail() {
    setErr("");
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
        setErr(t("auth.error.invalid"));
      } else if (code.includes("weak-password")) {
        setErr(t("auth.error.weak"));
      } else if (code.includes("email-already-in-use")) {
        setErr(t("auth.error.used"));
      } else {
        setErr(t("auth.error.generic"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Proposal Generator</h1>
        <p className="mt-1 text-sm text-slate-500">Atelier Produits</p>

        <h2 className="mt-6 text-lg font-semibold text-slate-800">
          {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
        </h2>

        <button
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          onClick={withGoogle}
          disabled={loading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t("auth.google")}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">{t("auth.or")}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-3">
          <input
            type="email"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && withEmail()}
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && withEmail()}
          />
        </div>

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

        <button
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={withEmail}
          disabled={loading}
        >
          {mode === "signin" ? t("auth.signin") : t("auth.signup")}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
          <button
            className="font-medium text-blue-600 hover:underline"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }}
          >
            {mode === "signin" ? t("auth.signup") : t("auth.signin")}
          </button>
        </p>
      </div>
    </div>
  );
}
