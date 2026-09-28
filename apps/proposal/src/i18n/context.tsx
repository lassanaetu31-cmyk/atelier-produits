import { createContext, useContext, useEffect, useState } from "react";
import type { LangCode } from "./translations";
import { T, LANGUAGES } from "./translations";

const STORAGE_KEY = "atelier_lang";

function detect(): LangCode {
  const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (saved && saved in T) return saved;
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser in T) return browser as LangCode;
  return "fr";
}

interface LangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  rtl: boolean;
}

const Ctx = createContext<LangCtx>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
  rtl: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detect);

  function setLang(l: LangCode) {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }

  const rtl = !!LANGUAGES[lang]?.rtl;

  useEffect(() => {
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang, rtl]);

  function t(key: string, vars?: Record<string, string | number>): string {
    const dict = T[lang] ?? T["fr"];
    let str = dict[key] ?? T["fr"][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  return <Ctx.Provider value={{ lang, setLang, t, rtl }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export const LANG_STORAGE_KEY = STORAGE_KEY;
