import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/* ═══════════════════════════════════════════════════════════════════════════
   LE DOUBLET NETLIFY — le contrat qui casse sans prévenir

   Netlify détecte les formulaires dans le HTML STATIQUE livré, jamais dans le
   DOM rendu par React. Le formulaire de contact existe donc EN DEUX
   EXEMPLAIRES :

     · dans `index.html`, une copie masquée que le robot de compilation lit —
       c'est elle, et elle seule, qui déclare le formulaire côté Netlify ;
     · dans `Contact.tsx`, le vrai formulaire, qui poste en
       `application/x-www-form-urlencoded` avec `form-name` en tête.

   CE QUI ARRIVE QUAND ILS DIVERGENT : rien de visible. Ajoutez un champ au
   formulaire React sans l'ajouter à `index.html`, et Netlify accepte l'envoi
   mais JETTE le champ inconnu. Le visiteur voit sa confirmation, vous ne
   recevez jamais l'information. Aucune erreur, aucun test de build, rien.

   Ce test est le seul endroit qui tient les deux moitiés ensemble.
   ═══════════════════════════════════════════════════════════════════════════ */

const INDEX = readFileSync("index.html", "utf8");
const CONTACT = readFileSync("src/pages/Contact.tsx", "utf8");

/** Le source, débarrassé de ses commentaires : ce dépôt documente son contrat
 *  DANS les commentaires, et les noms de champs cités s'y liraient comme de
 *  vrais champs. */
const sansCommentaires = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/** Les champs, et pas le formulaire lui-même : `<form name="contact">` porte
 *  un `name` qui nomme le formulaire, pas une donnée envoyée. */
const champsDe = (source: string) =>
  new Set(
    [...source.replace(/<form[^>]*>/g, "").matchAll(/name="([a-z-]+)"/g)].map((m) => m[1]),
  );

const FORMULAIRE_STATIQUE =
  INDEX.match(/<form name="contact"[\s\S]*?<\/form>/)?.[0] ?? "";

describe("le formulaire déclaré dans index.html", () => {
  it("existe, sinon Netlify ne connaît aucun formulaire", () => {
    expect(FORMULAIRE_STATIQUE).not.toBe("");
  });

  it("porte les quatre attributs du contrat", () => {
    expect(FORMULAIRE_STATIQUE).toMatch(/data-netlify="true"/);
    expect(FORMULAIRE_STATIQUE).toMatch(/netlify-honeypot="bot-field"/);
    expect(FORMULAIRE_STATIQUE).toMatch(/name="bot-field"/);
    expect(FORMULAIRE_STATIQUE).toMatch(/\bhidden\b/);
  });
});

describe("le formulaire React de /contact", () => {
  const source = sansCommentaires(CONTACT);

  it("poste sous le même nom que celui déclaré", () => {
    const nom = source.match(/const NOM_FORMULAIRE = "([^"]+)"/)?.[1];
    expect(nom).toBe("contact");
  });

  it("envoie `form-name` en tête, sans quoi Netlify refuse l'envoi", () => {
    expect(source).toMatch(/"form-name":\s*NOM_FORMULAIRE/);
    expect(source).toMatch(/name="form-name"/);
  });

  it("poste en `x-www-form-urlencoded`, le seul encodage accepté ici", () => {
    expect(source).toMatch(/application\/x-www-form-urlencoded/);
  });
});

describe("les deux moitiés du doublet", () => {
  it("déclarent EXACTEMENT les mêmes champs", () => {
    const statiques = champsDe(FORMULAIRE_STATIQUE);
    const reels = champsDe(sansCommentaires(CONTACT));
    // `form-name` est propre à l'envoi React : Netlify le lit, ne le déclare pas.
    reels.delete("form-name");

    const oublies = [...reels].filter((c) => !statiques.has(c));
    const orphelins = [...statiques].filter((c) => !reels.has(c));

    expect(oublies, "champs postés par React mais non déclarés à Netlify — ils seront JETÉS").toEqual([]);
    expect(orphelins, "champs déclarés à Netlify que React ne poste plus").toEqual([]);
  });
});
