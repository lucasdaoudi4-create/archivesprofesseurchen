/* ═══════════════════════════════════════════════════════════════════════════
   GARDE-FOU D'APRÈS-BUILD — le greffon `pagesStatiques` a bien tout produit

   POURQUOI. Le greffon écrit les têtes de page par route, `_headers` (donc la
   CSP et les en-têtes de sécurité), `robots.txt`, `sitemap.xml` et `404.html`.
   S'il ne tourne pas, Vite ne s'en aperçoit pas : il n'a rien à produire de
   son côté, et le build reste vert. C'est exactement ce qui est arrivé le
   23 septembre 2026 (voir `verifie-sources.mjs`). Un site déployé sans CSP ni
   en-têtes de sécurité, avec un build vert, est le pire des deux mondes.

   LA LISTE N'EST PAS ÉCRITE EN DUR. Elle est DÉDUITE de `dist/sitemap.xml` :
   chaque URL annoncée doit avoir son fichier servi. Ajouter une route à
   `site.ts` fait donc grandir la vérification toute seule, et une route
   annoncée sans page devient une erreur au lieu d'un 404 découvert en ligne.
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = join(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "dist");
const fautes = [];
const exige = (condition, message) => { if (!condition) fautes.push(message); };
const lire = (nom) => (existsSync(join(DIST, nom)) ? readFileSync(join(DIST, nom), "utf8") : null);

/* ── 1 · Les fichiers de tête ──────────────────────────────────────────── */
for (const nom of ["index.html", "sitemap.xml", "robots.txt", "_headers", "404.html"]) {
  exige(lire(nom) !== null, `dist/${nom} manque`);
}

/* ── 2 · Une page servie par URL annoncée au sitemap ───────────────────── */
const sitemap = lire("sitemap.xml");
if (sitemap) {
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  exige(urls.length > 0, "sitemap.xml n'annonce aucune URL");
  for (const url of urls) {
    const chemin = new URL(url).pathname;
    const fichier = chemin === "/" ? "index.html" : `${chemin.slice(1)}.html`;
    const page = lire(fichier);
    exige(page !== null, `${url} est au sitemap, mais dist/${fichier} manque`);
    if (!page) continue;
    // Une page indexée se déclare à SON adresse, pas à celle d'une autre.
    const canonique = page.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    exige(canonique === url, `dist/${fichier} : canonique « ${canonique} » au lieu de « ${url} »`);
    exige(!/<meta name="robots"/.test(page), `dist/${fichier} est au sitemap ET porte un robots`);
  }
  // La date doit être complète : `2026-09` est valide au sens W3C, mais les
  // moteurs préfèrent le jour, et c'est le format que `site.ts` déclare.
  const dates = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  for (const d of dates) exige(/^\d{4}-\d{2}-\d{2}$/.test(d), `lastmod « ${d} » n'est pas une date complète`);
}

/* ── 3 · La page introuvable ───────────────────────────────────────────── */
const p404 = lire("404.html");
if (p404) {
  exige(/<meta name="robots" content="noindex/.test(p404), "404.html ne porte pas de noindex");
  exige(!/rel="canonical"/.test(p404), "404.html porte une canonique — une URL introuvable n'est l'adresse de rien");
}

/* ── 4 · Les en-têtes de sécurité ──────────────────────────────────────── */
const headers = lire("_headers");
if (headers) {
  for (const entete of [
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) exige(headers.includes(entete), `_headers : ${entete} absent`);

  // L'empreinte du script en ligne est le point fragile : si elle n'est plus
  // calculée, la CSP bloque le préchargement du héros SANS que rien n'échoue
  // au build. On vérifie qu'il y en a une, et qu'elle correspond vraiment au
  // script servi.
  const empreinte = headers.match(/script-src[^;]*'(sha256-[^']+)'/)?.[1];
  exige(Boolean(empreinte), "_headers : script-src ne porte aucune empreinte sha256");
  exige(!/'unsafe-inline'/.test(headers), "_headers : la CSP autorise 'unsafe-inline'");

  const index = lire("index.html");
  if (empreinte && index) {
    const { createHash } = await import("node:crypto");
    const enLigne = [...index.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attrs]) => !/\bsrc=/.test(attrs) && !/application\/ld\+json/.test(attrs))
      .map(([, , corps]) => `sha256-${createHash("sha256").update(corps, "utf8").digest("base64")}`);
    exige(
      enLigne.includes(empreinte),
      `_headers : l'empreinte ${empreinte} ne correspond à aucun script en ligne de index.html`,
    );
  }
}

if (fautes.length > 0) {
  console.error("\n  LE BUILD EST INCOMPLET — le greffon `pagesStatiques` n'a pas tout produit.\n");
  for (const f of fautes) console.error(`    · ${f}`);
  console.error("\n  Premier réflexe : un `.js` compilé masque-t-il `vite.config.ts` ?\n");
  process.exit(1);
}

console.log(`  ✓ dist vérifié — ${[...(sitemap ?? "").matchAll(/<loc>/g)].length} pages, en-têtes et empreinte CSP`);
