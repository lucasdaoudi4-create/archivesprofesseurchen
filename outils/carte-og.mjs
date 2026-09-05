/* ═══════════════════════════════════════════════════════════════════════════
   FABRIQUE DE LA CARTE DE PARTAGE — `node outils/carte-og.mjs`
   Les Archives du Professeur Chen — charte ARC v1.0.0

   Produit `public/img/arc-og-accueil-1200x630-v01.jpg`, la vignette que les
   aspirateurs de métadonnées affichent quand un lien du site est partagé.

   ── POURQUOI CE N'EST PAS UN SIMPLE RECADRAGE ─────────────────────────────
   § 7.10.3 : « Sur les cartes OG et les vignettes de module, le texte est
   toujours composé en HTML/CSS ou en design par-dessus l'image. » La carte
   n'est donc pas une photo réduite : c'est une PAGE, composée dans les
   fontes du site, et capturée. `outils/carte-og.html` EST cette page ; ce
   script ne fait que la nourrir, la rendre et l'encoder.

   Ce que la carte ne fait PAS : recomposer le nom du site. Il est déjà dans
   la photo, en néon, et A1.2 n'admet qu'une enseigne par écran. La plaque
   bordeaux porte l'offre et l'adresse, sur `--scrim-og rgba(58,17,24,.90)`
   que le chapitre 07 mesure à 11,44:1 avec `--blanc-50` et 8,96:1 avec le
   néon.

   ── LES TROIS ÉTAPES ──────────────────────────────────────────────────────
   1. Le fond. Le master `visuels/Banière.png` (5440 × 3072) est recadré en
      1,91:1 — `ARC · FMT — 08` — soit 5440 × 2856, pris par le HAUT : le
      plafond lumineux et l'enseigne vivent en haut du cadre, le sol n'a rien
      à dire. Réduit à 2400 × 1260, c'est-à-dire au double du format final,
      pour que la capture suréchantillonne.
   2. Le rendu. Chrome sans interface capture la page à 2400 × 1260, avec les
      fontes de `public/fonts/`. Un serveur statique éphémère la sert : un
      `file://` n'autoriserait pas le chargement des `@font-face`.
   3. L'encodage. Réduction à 1200 × 630 et JPEG — obligatoire, § 7.10.1 :
      « beaucoup d'aspirateurs de métadonnées sociales ne décodent pas
      [l'AVIF ni le WebP] et n'afficheraient aucune vignette ». Sous-
      échantillonnage 4:4:4 : le texte blanc sur bordeaux est du contour net,
      un 4:2:0 y laisserait des franges. Plafond du format : 300 ko.
   ═══════════════════════════════════════════════════════════════════════════ */

import { createRequire } from "node:module";
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile, execSync } from "node:child_process";
import { promisify } from "node:util";

/* `execFile` PROMISIFIÉ, et surtout pas `execFileSync` : le serveur qui
   sert la page à Chrome tourne dans CE processus. Un appel synchrone bloque
   la boucle d'événements de Node, le serveur ne répond plus, et Chrome
   attend une page qui n'arrivera jamais. */
const lancer = promisify(execFile);

const require = createRequire(import.meta.url);
const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const MASTER = join(RACINE, "visuels", "Banière.png");
const PAGE = join(ICI, "carte-og.html");
const SORTIE = join(RACINE, "public", "img", "arc-og-accueil-1200x630-v01.jpg");

const LARGEUR = 1200;
const HAUTEUR = 630;
const K = 2; // le facteur de suréchantillonnage, jumeau du `--k` de la page

/* ── sharp, cherché comme dans `derivees-visuels.mjs` ────────────────────── */

function chargerSharp() {
  try {
    return require("sharp");
  } catch {
    try {
      const npx = join(execSync("npm config get cache", { encoding: "utf8" }).trim(), "_npx");
      for (const d of readdirSync(npx)) {
        const c = join(npx, d, "node_modules", "sharp");
        if (existsSync(c)) return require(c);
      }
    } catch {
      /* message ci-dessous */
    }
  }
  console.error("\n  sharp est introuvable — `npm i -D sharp`, puis relance.\n");
  process.exit(1);
}

/* ── Chrome, cherché là où les trois systèmes le posent ──────────────────── */

function trouverChrome() {
  const candidats = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const trouve = candidats.find((c) => existsSync(c));
  if (trouve) return trouve;
  console.error(
    "\n  Chrome est introuvable.\n\n" +
      "  La carte se compose en HTML dans les fontes du site (§ 7.10.3) : il faut\n" +
      "  un navigateur pour la rendre. Indique-le par CHROME_PATH :\n" +
      '      CHROME_PATH="/chemin/vers/chrome" node outils/carte-og.mjs\n',
  );
  process.exit(1);
}

/* ── Un serveur statique le temps d'une capture ──────────────────────────── */

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

function servir(fichiers, port) {
  const serveur = createServer((req, res) => {
    const cle = req.url.split("?")[0];
    const chemin = fichiers[cle];
    if (!chemin || !existsSync(chemin)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(chemin)] ?? "application/octet-stream" });
    res.end(readFileSync(chemin));
  });
  return new Promise((ok) => serveur.listen(port, "127.0.0.1", () => ok(serveur)));
}

/* ── Fabrique ────────────────────────────────────────────────────────────── */

const sharp = chargerSharp();

if (!existsSync(MASTER)) {
  console.error(
    `\n  ${MASTER} est absent.\n\n` +
      "  Les masters ne sont pas versionnés (dépôt public) : demande-les à\n" +
      "  l'auteur et dépose-les dans visuels/ avant de relancer.\n",
  );
  process.exit(1);
}

const fondTemporaire = join(ICI, ".carte-og-fond.jpg");
const captureTemporaire = join(ICI, ".carte-og-capture.png");

console.log("  1/3  recadrage 1,91:1 du master (ARC · FMT — 08)…");
await sharp(MASTER, { limitInputPixels: 8192 * 8192 * 2 })
  .extract({ left: 0, top: 0, width: 5440, height: 2856 })
  .resize(LARGEUR * K, HAUTEUR * K, { kernel: "lanczos3" })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(fondTemporaire);

const PORT = 8791;
const serveur = await servir(
  {
    "/": PAGE,
    "/index.html": PAGE,
    "/og-fond.jpg": fondTemporaire,
    "/fonts/fraunces-roman.woff2": join(RACINE, "public", "fonts", "fraunces-roman.woff2"),
    "/fonts/space-mono-400.woff2": join(RACINE, "public", "fonts", "space-mono-400.woff2"),
  },
  PORT,
);

console.log("  2/3  rendu de la page dans Chrome sans interface…");
try {
  await lancer(trouverChrome(), [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--force-device-scale-factor=1",
    `--window-size=${LARGEUR * K},${HAUTEUR * K}`,
    `--screenshot=${captureTemporaire}`,
    `http://127.0.0.1:${PORT}/index.html`,
  ]);
} finally {
  serveur.close();
}

console.log("  3/3  réduction et encodage JPEG…");
await sharp(captureTemporaire)
  .resize(LARGEUR, HAUTEUR, { fit: "fill", kernel: "lanczos3" })
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(SORTIE);

unlinkSync(fondTemporaire);
unlinkSync(captureTemporaire);

const poids = Math.round(statSync(SORTIE).size / 1024);
console.log(`\n  arc-og-accueil-1200x630-v01.jpg — ${poids} ko (plafond FMT — 08 : 300 ko)\n`);
if (poids > 300) {
  console.error("  AU-DESSUS DU PLAFOND. Baisse la qualité JPEG avant de publier.\n");
  process.exit(1);
}
