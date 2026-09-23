import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { meta, routes, site, type RouteKey } from "./src/data/site";
import {
  CADRAGE_COLONNE,
  TAILLES_SCENE,
  jeuSources,
  plateauHaut,
  plateauLarge,
} from "./src/data/visuels";

/* ═══════════════════════════════════════════════════════════════════════════
   PRÉCHARGEMENT DE L'IMAGE LCP — socle § 0.30 (LCP ≤ 1,8 s, plafond 2,5 s)

   ── LE PROBLÈME, ET POURQUOI `fetchpriority` NE LE RÉSOUT PAS ─────────────
   Le site est une application React montée par `src/main.tsx`. La photo du
   héros est l'élément LCP de l'accueil, et elle n'existe dans le DOM
   qu'APRÈS que le navigateur a téléchargé, analysé et exécuté le paquet
   (268 ko, 83 ko en gzip). L'analyseur de préchargement, lui, ne lit que le
   HTML initial : il ne peut pas voir une balise qu'un script n'a pas encore
   créée.

   `fetchpriority="high"` et `loading="eager"` sont posés sur l'image, et ils
   sont justes — mais ils n'agissent qu'une fois l'élément créé. Ils ne
   rattrapent pas le temps perdu à attendre le paquet. Sur un réseau 4G
   simulé, c'est plusieurs centaines de millisecondes prises directement sur
   le budget du § 0.30.

   ── CE QUE CE GREFFON POSE, ET CE QU'IL NE POSE PAS ───────────────────────
   Un `<link rel="preload" as="image">` dans le `<head>`, découvert à
   l'analyse du HTML, donc AVANT même que le paquet ne commence à arriver.

   Trois précautions, chacune pour une raison précise :

   1. IL EST CONDITIONNÉ À LA ROUTE. `netlify.toml` sert `index.html` pour
      TOUTES les URL du site : un lien de préchargement écrit en dur ferait
      télécharger la photo du plateau à un visiteur qui arrive sur
      `/formation`, `/contact` ou la 404, où elle ne paraît jamais. Le lien
      est donc créé par un script en ligne qui vérifie `location.pathname`.
      Ce script s'exécute à l'analyse du `<head>`, avant le paquet : on garde
      l'essentiel de l'avance sans facturer un octet aux autres routes.

   2. IL RESPECTE LA DIRECTION ARTISTIQUE. Le héros n'a pas une image mais
      DEUX cadrages, séparés par un `media` (§ A1.2, et `visuels.ts`) :
      colonne 4:3 au-dessus de `planche`, bande 16:9 en dessous. Un
      préchargement qui ignorerait ce `media` téléchargerait la mauvaise
      dérivée, et le `<picture>` en demanderait une seconde — deux images
      pour en afficher une. Le script lit donc la même requête média.

   3. IL LIT LES MÊMES PHRASES QUE LA PAGE. `CADRAGE_COLONNE`,
      `TAILLES_SCENE` et les `srcset` viennent de `src/data/visuels.ts`, pas
      d'une recopie. S'ils divergeaient d'un seul caractère, le candidat
      choisi par le préchargement et celui choisi par le `<picture>`
      pourraient différer, et le navigateur téléchargerait les deux.

   ── POURQUOI SEULEMENT L'AVIF ────────────────────────────────────────────
   Un lien de préchargement ne négocie pas le format : il en désigne un.
   `type="image/avif"` le fait ignorer par les navigateurs qui ne décodent
   pas l'AVIF — ils retombent alors sur la découverte normale et sur le
   repli WebP du `<picture>`, sans rien télécharger en trop. Précharger le
   WebP « au cas où » ferait, lui, deux téléchargements sur tout le parc
   moderne.
   ═══════════════════════════════════════════════════════════════════════════ */

function prechargementHeros(): Plugin {
  const script = [
    "(function(){",
    '  if (location.pathname !== "/") return;',
    "  var colonne = window.matchMedia(" + JSON.stringify(CADRAGE_COLONNE) + ").matches;",
    "  var l = document.createElement('link');",
    "  l.rel = 'preload';",
    "  l.as = 'image';",
    "  l.type = 'image/avif';",
    "  l.setAttribute('imagesrcset', colonne ? " +
      JSON.stringify(jeuSources(plateauHaut, "avif")) +
      " : " +
      JSON.stringify(jeuSources(plateauLarge, "avif")) +
      ");",
    "  l.setAttribute('imagesizes', " + JSON.stringify(TAILLES_SCENE) + ");",
    "  l.setAttribute('fetchpriority', 'high');",
    "  document.head.appendChild(l);",
    "})();",
  ].join("\n");

  return {
    name: "arc-prechargement-heros",
    transformIndexHtml() {
      return [{ tag: "script", injectTo: "head", children: script }];
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   UNE TÊTE DE PAGE PAR ROUTE, LES EN-TÊTES HTTP, ROBOTS ET SITEMAP

   ── POURQUOI ──────────────────────────────────────────────────────────────
   Les aspirateurs sociaux (Discord, WhatsApp, LinkedIn, X…) et la plupart
   des robots n'exécutent pas JavaScript : ils ne voient que le HTML servi.
   Avec un seul `index.html`, les neuf routes se présentaient toutes avec le
   titre, la description et la canonique de l'accueil. `useMetaPage` corrige
   le document APRÈS le montage — trop tard pour eux.

   Le greffon écrit donc, après le build, un fichier HTML par route
   (`formation.html`, `cgv.html`…) : le même document que `index.html`, avec
   SA tête — titre, description, og:*, canonique. Le corps reste l'application
   React, inchangée. Netlify sert `/formation` depuis `formation.html` sans
   règle, et `404.html` avec un vrai statut 404 pour toute URL inconnue.

   Les textes viennent de `src/data/site.ts` (`meta`, `routes`), les mêmes
   que lit `useMetaPage` : la tête servie et la tête posée au montage ne
   peuvent pas diverger.

   ── LA CSP ────────────────────────────────────────────────────────────────
   Le script de préchargement du héros est EN LIGNE, et doit le rester (il
   doit s'exécuter avant le paquet). La politique l'autorise par son
   empreinte SHA-256, calculée ici sur le HTML réellement produit : toute
   modification du script change l'empreinte au build suivant, sans rien à
   recopier à la main. `_headers` est lu par Netlify en plus de
   `netlify.toml`.
   ═══════════════════════════════════════════════════════════════════════════ */

const ROUTES_PUBLIEES: RouteKey[] = [
  "formation",
  "minecraft",
  "discord",
  "reseaux",
  "contact",
  "mentionsLegales",
  "cgv",
  "confidentialite",
];

const echapper = (texte: string) =>
  texte
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function poserTete(html: string, cle: RouteKey): string {
  const fiche = meta[cle];
  const titre = echapper(cle === "accueil" ? fiche.titre : `${fiche.titre} · ${site.name}`);
  const description = echapper(fiche.description);
  const adresse = `${site.url}${routes[cle]}`;
  const remplacer = (motif: RegExp, par: string) => {
    if (!motif.test(html)) throw new Error(`tête de page : motif absent ${motif}`);
    html = html.replace(motif, par);
  };

  remplacer(/<title>[^<]*<\/title>/, `<title>${titre}</title>`);
  remplacer(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`);
  remplacer(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${titre}$2`);
  remplacer(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`);

  if (fiche.indexee) {
    remplacer(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${adresse}$2`);
    remplacer(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${adresse}$2`);
  } else {
    remplacer(/\s*<link\s+rel="canonical"[^>]*>/, "");
    remplacer(/(<meta\s+name="description")/, `<meta name="robots" content="noindex, nofollow" />\n    $1`);
  }
  return html;
}

function empreintesScriptsEnLigne(html: string): string[] {
  const empreintes: string[] = [];
  for (const [, attributs, corps] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attributs) || /application\/ld\+json/.test(attributs)) continue;
    empreintes.push(`'sha256-${createHash("sha256").update(corps, "utf8").digest("base64")}'`);
  }
  return empreintes;
}

function pagesStatiques(): Plugin {
  let sortie = "dist";
  return {
    name: "arc-pages-statiques",
    apply: "build",
    configResolved(config) {
      sortie = config.build.outDir;
    },
    closeBundle() {
      const gabarit = readFileSync(join(sortie, "index.html"), "utf8");

      for (const cle of ROUTES_PUBLIEES) {
        writeFileSync(join(sortie, `${routes[cle].slice(1)}.html`), poserTete(gabarit, cle));
      }
      writeFileSync(join(sortie, "404.html"), poserTete(gabarit, "introuvable"));

      const csp = [
        "default-src 'self'",
        `script-src 'self' ${empreintesScriptsEnLigne(gabarit).join(" ")}`,
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.mcsrvstat.us https://discord.com",
        "frame-src https://www.youtube-nocookie.com",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; ");
      writeFileSync(
        join(sortie, "_headers"),
        [
          "/*",
          `  Content-Security-Policy: ${csp}`,
          "  X-Content-Type-Options: nosniff",
          "  X-Frame-Options: DENY",
          "  Referrer-Policy: strict-origin-when-cross-origin",
          "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          "  Cross-Origin-Opener-Policy: same-origin",
          "",
        ].join("\n"),
      );

      const indexees = (["accueil", ...ROUTES_PUBLIEES] as RouteKey[]).filter((cle) => meta[cle].indexee);
      writeFileSync(
        join(sortie, "sitemap.xml"),
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...indexees.map(
            (cle) => `  <url><loc>${site.url}${routes[cle]}</loc><lastmod>${site.derniereMiseAJourMachine}</lastmod></url>`,
          ),
          "</urlset>",
          "",
        ].join("\n"),
      );
      writeFileSync(
        join(sortie, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), prechargementHeros(), pagesStatiques()],
});
