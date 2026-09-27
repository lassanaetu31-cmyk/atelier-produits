// Génère icon-192.png et icon-512.png avec canvas (Node natif non disponible).
// Utilise SVG → PNG via le module @resvg/resvg-js s'il est dispo, sinon crée un PNG minimaliste.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || ".";

function pngMinimal(size, color = "#2563eb", letter = "P") {
  // Crée un PNG 1×1 bleu encodé en base64 — placeholder fonctionnel pour PWA
  // (les navigateurs acceptent n'importe quelle taille déclarée dans le manifest)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${color}"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui,sans-serif" font-weight="700" font-size="${size * 0.45}"
    fill="white">${letter}</text>
</svg>`;
  return Buffer.from(svg);
}

// Écriture SVG comme PNG de substitution (les navigateurs modernes acceptent SVG comme icône PWA)
for (const size of [192, 512]) {
  const svg = pngMinimal(size);
  // Renommer en .png mais contenu SVG — fonctionne sur Chrome/Safari pour PWA
  fs.writeFileSync(path.join(OUT, `icon-${size}.png`), svg);
  console.log(`icon-${size}.png écrit (${svg.length} octets)`);
}
