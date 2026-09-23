import { createHash } from "node:crypto";
import { meta, routes, site, type RouteKey } from "../src/data/site";

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

export const ROUTES_PUBLIEES: RouteKey[] = [
  "formation",
  "minecraft",
  "discord",
  "reseaux",
  "contact",
  "mentionsLegales",
  "cgv",
  "confidentialite",
];

export const echapper = (texte: string) =>
  texte
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function poserTete(html: string, cle: RouteKey): string {
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

export function empreintesScriptsEnLigne(html: string): string[] {
  const empreintes: string[] = [];
  for (const [, attributs, corps] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attributs) || /application\/ld\+json/.test(attributs)) continue;
    empreintes.push(`'sha256-${createHash("sha256").update(corps, "utf8").digest("base64")}'`);
  }
  return empreintes;
}
