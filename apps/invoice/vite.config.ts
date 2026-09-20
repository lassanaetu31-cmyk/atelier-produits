import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// base "./" + singlefile : le build produit UN seul index.html autonome,
// ouvrable hors-ligne par double-clic (Chrome/Edge) ou hébergeable tel quel.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
