/* ═══════════════════════════════════════════════════════════════════════════
   FABRIQUE DES DÉRIVÉES — `node outils/derivees-visuels.mjs`
   Les Archives du Professeur Chen — charte ARC v1.0.0

   Ce fichier est la RECETTE des images de `public/img/`. Il n'est pas un
   utilitaire de confort : il est la seule trace écrite du recadrage exact,
   de l'échelle de largeurs et des qualités d'encodage employés. Sans lui,
   republier une dérivée en -v02 obligerait à retrouver ces valeurs à l'œil,
   et le § 7.10.4 de la charte — « une correction d'étalonnage crée v04, elle
   n'écrase pas v03 » — ne serait pas tenable.

   ── LES MASTERS NE SONT PAS DANS LE DÉPÔT ─────────────────────────────────
   `visuels/` est ignoré par le `.gitignore` : 127 Mo de PNG jusqu'à 8192 px,
   et le dépôt du site est PUBLIC. Le script échoue proprement si les masters
   manquent — c'est le comportement attendu sur une machine qui ne les a pas.

   ── SHARP N'EST PAS UNE DÉPENDANCE DU SITE ────────────────────────────────
   Le site ne construit pas ses images au build : les dérivées sont
   versionnées. `sharp` n'a donc rien à faire dans `package.json`, où il
   pèserait 30 Mo pour un outil qu'on lance trois fois par an. Le script le
   cherche dans `node_modules/`, puis dans le cache de `npx`, et dit quoi
   faire s'il ne le trouve pas.

   ── LES CHOIX QUE CE FICHIER FIGE, ET POURQUOI ────────────────────────────

   RECADRAGE DU PLATEAU EN 4:3 — `left: 580`, et non 0.
   Le master fait 5440 × 3072. Le 4:3 en prend 4096 × 3072, donc 1344 px de
   largeur partent. Les livrer depuis le bord GAUCHE (`left: 0`) posait
   l'enseigne au néon à 64 % de la largeur du cadre et tranchait le pilier
   d'émail bordeaux de droite dans sa largeur — ce que le § 7.13.1 interdit
   nommément : « un recadrage ne coupe jamais un visage, une enseigne néon
   lisible ou un pilier bordeaux dans sa largeur ». Le centre de l'enseigne
   est mesuré à 2628 px du bord gauche du master ; `left: 2628 − 4096/2 =
   580` la pose exactement au milieu du cadre 4:3, ce qui est le point focal
   `50 %` de la table du § 7.13.1 pour `ARC · DEC — 01`, et rend au cadre la
   symétrie latérale qui fait toute la valeur du plan (§ 7.6, `ARC · CAM — 01`).

   RECADRAGE DU PLATEAU EN 16:9 — `top: 0`.
   5440 / (16/9) = 3060 : douze pixels de hauteur partent. Ils partent du
   BAS, parce que le plafond lumineux et l'enseigne vivent en haut du cadre
   et que le sol n'a rien à dire.

   LE NARRATEUR NE SE RECADRE PAS. Les deux masters du narrateur sont déjà
   carrés (2048² et 8192²) et les cadres de l'interface sont carrés : il n'y
   a aucun recadrage à faire, donc aucun point focal à poser.

   ÉCHELLE DE LARGEURS — § 7.13.5 : « srcset aux largeurs 640, 960, 1280,
   1600, 1920, 2560 ». Elle est reprise telle quelle pour les cadrages de
   scène. Le portrait garde en plus 320 et 480 : il est servi dans un cadre
   de 437 px au plus, et sans ces deux barreaux un téléphone en DPR 2
   téléchargerait 640 px pour en afficher 320.

   QUALITÉS — § 7.13.5 : « AVIF en premier (qualité ≈ 55), WebP en repli
   (≈ 78), JPEG (82) en dernier recours ». Les dérivées livrées jusqu'ici
   étaient encodées en dessous (AVIF ≈ 50, WebP ≈ 75, JPEG ≈ 75) ; le budget
   du § 0.30 laisse largement la place (héros ≤ 260 ko, la plus lourde des
   dérivées AVIF du héros pèse un tiers de cela), donc on encode aux valeurs
   que la charte écrit.
   ═══════════════════════════════════════════════════════════════════════════ */

import { createRequire } from "node:module";
import { existsSync, mkdirSync, statSync } from "node:fs";

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MASTERS = join(RACINE, "visuels");
const SORTIE = join(RACINE, "public", "img");

/* ── Trouver sharp ───────────────────────────────────────────────────────── */

function chargerSharp() {
  try {
    return require("sharp");
  } catch {
    /* Le cache de `npx` en garde une copie dès qu'on a lancé `npx sharp-cli`
       une fois. C'est un chemin d'opportunité, pas un contrat : s'il n'y est
       pas, on le dit clairement plutôt que d'échouer sur un `MODULE_NOT_FOUND`. */
    try {
      const cache = execSync("npm config get cache", { encoding: "utf8" }).trim();
      const npx = join(cache, "_npx");
      for (const dossier of readdirSync(npx)) {
        const chemin = join(npx, dossier, "node_modules", "sharp");
        if (existsSync(chemin)) return require(chemin);
      }
    } catch {
      /* on tombe dans le message ci-dessous */
    }
  }
  console.error(
    "\n  sharp est introuvable.\n\n" +
      "  Ce script en a besoin, mais le site n'en dépend pas : les dérivées sont\n" +
      "  versionnées dans public/img/ et aucune n'est fabriquée au build.\n\n" +
      "  Installe-le le temps de la fabrique, puis retire-le :\n" +
      "      npm i -D sharp && node outils/derivees-visuels.mjs && npm rm sharp\n",
  );
  process.exit(1);
}

const sharp = chargerSharp();

/* ── Les encodages, dans l'ordre du § 7.13.5 ─────────────────────────────── */

/* `plafond` : la largeur au-delà de laquelle l'encodage n'est plus produit.
   Le JPEG s'arrête à 1600 px — jumeau du `PLAFOND_JPEG` de
   `src/data/visuels.ts`, et les deux ne doivent pas diverger. Motif : le
   JPEG est « le dernier recours » du § 7.13.5, celui du navigateur qui ne
   décode ni AVIF ni WebP. Ce parc-là ne tourne sur aucun écran de 2560 px,
   et lui fabriquer des dérivées de tête ajouterait 800 ko de fichiers que
   personne ne demande, sur un dépôt public. */
const ENCODAGES = [
  { ext: "avif", plafond: Infinity, appliquer: (p) => p.avif({ quality: 55, effort: 6 }) },
  { ext: "webp", plafond: Infinity, appliquer: (p) => p.webp({ quality: 78, effort: 6 }) },
  { ext: "jpg", plafond: 1600, appliquer: (p) => p.jpeg({ quality: 82, mozjpeg: true, progressive: true }) },
];

/* ── Les visuels ─────────────────────────────────────────────────────────────
   `base`     racine du nom ARC (§ 0.19), sans format ni extension ;
   `master`   le fichier de `visuels/`, tel que l'auteur l'a nommé ;
   `recadre`  la boîte à extraire du master AVANT toute réduction, ou `null`
              quand le master est déjà au rapport de forme visé ;
   `ratio`    [largeur, hauteur] du rapport, pour calculer les hauteurs ;
   `largeurs` l'échelle servie, du § 7.13.5.                                 */

const VISUELS = [
  {
    base: "arc-dec-plateau-principal",
    master: "Banière.png",
    recadre: { left: 0, top: 0, width: 5440, height: 3060 },
    ratio: [16, 9],
    largeurs: [640, 960, 1280, 1600, 1920, 2560],
  },
  {
    base: "arc-dec-plateau-principal",
    master: "Banière.png",
    recadre: { left: 580, top: 0, width: 4096, height: 3072 },
    ratio: [4, 3],
    largeurs: [640, 960, 1280, 1600, 1920, 2560],
  },
  {
    base: "arc-nar-portrait",
    master: "PDP FR.png",
    recadre: null,
    ratio: [1, 1],
    largeurs: [320, 480, 640, 960, 1280, 1440],
  },
  {
    base: "arc-nar-plan-de-face",
    master: "Plan de face FR.png",
    recadre: null,
    ratio: [1, 1],
    largeurs: [640, 960, 1280, 1600],
  },
];

/* ── L'aplat de chargement — § 7.13.5 ────────────────────────────────────────
   « Placeholder : aplat de couleur pris dans la table LQIP des tokens, pas de
   flou progressif, pas d'effet de balayage. » AUCUNE vignette n'est donc
   fabriquée, et ce script n'écrit AUCUN aplat : la table est celle du bloc
   Tokens du chapitre 07, elle vit dans `src/styles/01-tokens-couleur.css`
   (`--lqip-dec01`, `--lqip-nar`), et une image ne redéfinit pas une couleur
   du système.

   Ce que la fabrique fait quand même : MESURER la couleur dominante de
   chaque visuel et la rapporter à l'écran, à côté du jeton correspondant.
   C'est un contrôle, pas une source : si les deux s'écartent trop, c'est à
   l'auteur d'arbitrer le jeton dans la charte, pas au script de le contourner. */

const JETONS_LQIP = {
  "arc-dec-plateau-principal": ["--lqip-dec01", "#DCE0E2"],
  "arc-nar-portrait": ["--lqip-nar", "#9EA5A9"],
  "arc-nar-plan-de-face": ["--lqip-nar", "#9EA5A9"],
};

async function aplat(pipeline) {
  const { dominant } = await pipeline.clone().stats();
  const hex = (n) => Math.round(n).toString(16).padStart(2, "0");
  return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`.toUpperCase();
}

/* ── Fabrique ────────────────────────────────────────────────────────────── */

async function fabriquer() {
  if (!existsSync(MASTERS)) {
    console.error(
      `\n  ${MASTERS} est absent.\n\n` +
        "  Les masters ne sont pas versionnés (127 Mo, dépôt public) : demande-les\n" +
        "  à l'auteur et dépose-les dans visuels/ avant de relancer.\n",
    );
    process.exit(1);
  }
  mkdirSync(SORTIE, { recursive: true });

  const aplats = {};
  let ecrits = 0;
  let octets = 0;

  for (const v of VISUELS) {
    const source = join(MASTERS, v.master);
    if (!existsSync(source)) {
      console.error(`  master manquant : ${v.master}`);
      process.exit(1);
    }

    const base = sharp(source, { limitInputPixels: 8192 * 8192 * 2 });
    const cadre = v.recadre ? base.clone().extract(v.recadre) : base.clone();

    /* Une seule mesure d'aplat par racine ARC : les deux cadrages du plateau
       montrent la même scène, ils n'ont pas deux couleurs de chargement. */
    if (!aplats[v.base]) aplats[v.base] = await aplat(cadre);

    for (const l of v.largeurs) {
      const h = Math.round((l * v.ratio[1]) / v.ratio[0]);
      const reduit = cadre.clone().resize(l, h, { fit: "fill", kernel: "lanczos3" });

      for (const enc of ENCODAGES) {
        if (l > enc.plafond) continue;
        const nom = `${v.base}-${l}x${h}-v01.${enc.ext}`;
        const chemin = join(SORTIE, nom);
        await enc.appliquer(reduit.clone()).toFile(chemin);
        const poids = statSync(chemin).size;
        ecrits += 1;
        octets += poids;
        console.log(`  ${nom.padEnd(46)} ${String(Math.round(poids / 1024)).padStart(5)} ko`);
      }
    }
  }

  console.log(`\n  ${ecrits} dérivées, ${(octets / 1024 / 1024).toFixed(2)} Mo au total.\n`);

  /* Le contrôle d'aplat : mesuré à gauche, jeton de la charte à droite.
     Aucun fichier n'est écrit — voir le pavé au-dessus de `aplat()`. */
  console.log("  Aplats de chargement — mesuré · jeton (01-tokens-couleur.css) :");
  for (const [base, mesure] of Object.entries(aplats)) {
    const [jeton, valeur] = JETONS_LQIP[base] ?? ["—", "—"];
    console.log(`    ${base.padEnd(28)} ${mesure}   ${jeton} ${valeur}`);
  }
  console.log("");
}

await fabriquer();
