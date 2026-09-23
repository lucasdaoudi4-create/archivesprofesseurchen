import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { empreintesScriptsEnLigne } from "../outils/tete-de-page";

/* ═══════════════════════════════════════════════════════════════════════════
   L'EMPREINTE QUI AUTORISE LE SCRIPT EN LIGNE — angle mort par excellence

   Le préchargement du héros est un script EN LIGNE, et doit le rester : il
   doit s'exécuter avant le paquet. La CSP ne l'autorise donc pas par origine
   mais par empreinte SHA-256, recalculée à chaque build sur le HTML produit.

   CE QUI REND CE CALCUL DANGEREUX : s'il se trompe, RIEN N'ÉCHOUE. Le build
   passe, `_headers` est écrit, le site se déploie — et le navigateur bloque
   silencieusement le script en production. On ne le découvre qu'en regardant
   la console d'un vrai visiteur.

   Deux pièges précis sont testés ici, parce qu'ils produisent tous deux une
   politique FAUSSE sans rien casser :
     · compter un script `src=` — il est autorisé par `'self'`, son empreinte
       n'a rien à faire là ;
     · compter un bloc `application/ld+json` — ce sont des données, pas du
       script ; la CSP ne les exécute jamais.
   ═══════════════════════════════════════════════════════════════════════════ */

const sha = (corps: string) => `'sha256-${createHash("sha256").update(corps, "utf8").digest("base64")}'`;

describe("empreintesScriptsEnLigne", () => {
  it("empreinte un script en ligne, et l'empreinte est juste", () => {
    const corps = 'console.log("bonjour");';
    expect(empreintesScriptsEnLigne(`<script>${corps}</script>`)).toEqual([sha(corps)]);
  });

  it("ignore un script servi par `src` — il relève de `'self'`", () => {
    expect(empreintesScriptsEnLigne('<script type="module" src="/assets/index.js"></script>')).toEqual([]);
  });

  it("ignore les données structurées — la CSP ne les exécute pas", () => {
    expect(
      empreintesScriptsEnLigne('<script type="application/ld+json">{"@type":"Organization"}</script>'),
    ).toEqual([]);
  });

  it("rend une expression de source CSP, guillemets compris", () => {
    const [e] = empreintesScriptsEnLigne("<script>0</script>");
    expect(e).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
  });

  it("suit le script : une virgule de plus change l'empreinte", () => {
    const a = empreintesScriptsEnLigne("<script>const x = 1</script>");
    const b = empreintesScriptsEnLigne("<script>const x = 2</script>");
    expect(a).not.toEqual(b);
  });

  /* Le vrai `index.html` SOURCE ne porte aucun script en ligne : celui du
     préchargement est injecté au build par le greffon `prechargementHeros`.
     C'est pourquoi la correspondance entre l'empreinte écrite dans
     `_headers` et le script RÉELLEMENT servi se vérifie après le build, sur
     `dist/`, et pas ici — `outils/verifie-dist.mjs` la recalcule à chaque
     `npm run build`. Ce test-ci garde le partage honnête. */
  it("ne trouve rien dans le gabarit source : le script est injecté au build", () => {
    const html = readFileSync("index.html", "utf8");
    expect(html).toMatch(/<script type="module"/); // le paquet, servi par `src`
    expect(empreintesScriptsEnLigne(html)).toEqual([]);
  });
});
