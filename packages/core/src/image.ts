// Compression/redimensionnement d'image côté navigateur (canvas).
// Réutilisé par Catalog (photos produits), logos, etc. Garde les données et PDF légers.

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Lecture du fichier impossible"));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible"));
    img.src = src;
  });
}

/**
 * Redimensionne une image (côté plus long <= maxSize) et la renvoie en JPEG data URL.
 * @param maxSize taille max du plus grand côté (px)
 * @param quality qualité JPEG 0..1
 */
export async function resizeImageDataUrl(file: File, maxSize = 1000, quality = 0.72): Promise<string> {
  const img = await loadImage(await readFileAsDataUrl(file));
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
