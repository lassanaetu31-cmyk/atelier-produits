import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Portail public : UN seul index.html hébergeable n'importe où (Pages, Netlify…).
// Hébergé UNE fois par le vendeur ; chaque opérateur partage un lien paramétré (?v=...).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
