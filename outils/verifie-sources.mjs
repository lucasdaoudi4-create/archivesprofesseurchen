/* ═══════════════════════════════════════════════════════════════════════════
   GARDE-FOU D'AVANT-BUILD — aucun JS compilé ne doit masquer sa source

   POURQUOI CE FICHIER EXISTE. Vite résout `X.js` AVANT `X.ts`. Un fichier
   compilé laissé sur le disque à côté de sa source prend donc silencieusement
   sa place, et le build reste vert en servant du code périmé.

   Ce n'est pas une hypothèse : le 23 septembre 2026, un `vite.config.js` du
   5 septembre masquait `vite.config.ts` et désactivait TOUT le greffon
   `pagesStatiques` — donc la CSP, les en-têtes de sécurité, le sitemap et les
   pages par route. Le build passait. Rien ne le signalait.

   LA CI NE SUFFIT PAS. Ces fichiers sont ignorés par git : `git ls-files` ne
   les voit pas, et un checkout propre ne les a jamais. Le danger est
   exclusivement LOCAL, là où l'on itère — c'est donc `npm run build` qui doit
   échouer, pas seulement `ubuntu-latest`.

   `tsconfig.node.json` écrit désormais hors de `src/` (`outDir`), ce qui
   empêche la réapparition ; ce garde-fou attrape ce qui traîne encore, et
   toute régression de ce réglage.
   ═══════════════════════════════════════════════════════════════════════════ */

import { readdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const RACINE = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** Les seules déclarations légitimes : celle que Vite fournit au projet. */
const TOLERES = new Set(["src/vite-env.d.ts"]);

/** Les racines inspectées. `node_modules` et `dist` n'en font pas partie. */
const ZONES = ["src"];

/** Les compilés isolés qui ont déjà mordu, hors de `src/`. */
const RACINE_SURVEILLEE = ["vite.config.js", "vite.config.d.ts"];

function parcourir(dossier, trouves = []) {
  for (const entree of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) {
      parcourir(chemin, trouves);
      continue;
    }
    if (!/\.(js|d\.ts)$/.test(entree.name)) continue;
    const relatif = relative(RACINE, chemin).split(sep).join("/");
    if (TOLERES.has(relatif)) continue;
    trouves.push(relatif);
  }
  return trouves;
}

const fautifs = [];
for (const zone of ZONES) {
  const dossier = join(RACINE, zone);
  if (existsSync(dossier)) fautifs.push(...parcourir(dossier));
}
for (const nom of RACINE_SURVEILLEE) {
  if (existsSync(join(RACINE, nom))) fautifs.push(nom);
}

if (fautifs.length > 0) {
  console.error("\n  JS COMPILÉ À CÔTÉ DE SES SOURCES — le build est annulé.\n");
  for (const f of fautifs) console.error(`    ${f}`);
  console.error(
    "\n  Vite résout `.js` avant `.ts` : ces fichiers masquent leur source et\n" +
      "  le build servirait du code périmé sans rien signaler. Supprimez-les\n" +
      "  (ils sont ignorés par git, donc régénérables), puis relancez.\n",
  );
  process.exit(1);
}
