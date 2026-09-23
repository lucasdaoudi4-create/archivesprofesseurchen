import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { poserTete } from "../outils/tete-de-page";
import { meta, routes, site } from "../src/data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LA TÊTE DE PAGE PAR ROUTE — `poserTete`, greffon `pagesStatiques`

   POURQUOI CE TEST. Les aspirateurs sociaux et la plupart des robots
   n'exécutent pas JavaScript : ils ne voient que le HTML servi. `poserTete`
   est donc le SEUL endroit qui leur donne un titre, une description et une
   canonique justes. Il travaille par expressions régulières sur un document
   existant — une forme qui casse en silence si le gabarit bouge.

   LE GABARIT DU TEST EST LE VRAI `index.html`, pas une imitation. C'est ce
   qui donne sa valeur au test : retirer la canonique ou renommer une balise
   dans le gabarit fait échouer ici, avant de faire échouer le build.
   ═══════════════════════════════════════════════════════════════════════════ */

const GABARIT = readFileSync("index.html", "utf8");

const valeurDe = (html: string, motif: RegExp) => html.match(motif)?.[1];
const titreDe = (html: string) => valeurDe(html, /<title>([^<]*)<\/title>/);
const canoniqueDe = (html: string) => valeurDe(html, /<link\s+rel="canonical"\s+href="([^"]*)"/);
const ogUrlDe = (html: string) => valeurDe(html, /<meta\s+property="og:url"\s+content="([^"]*)"/);
const descriptionDe = (html: string) =>
  valeurDe(html, /<meta\s+name="description"\s+content="([^"]*)"/);

describe("poserTete — une route indexée", () => {
  const html = poserTete(GABARIT, "cgv");

  it("porte son propre titre, suffixé du nom du site", () => {
    expect(titreDe(html)).toBe(`${meta.cgv.titre} · ${site.name}`);
  });

  it("se déclare à SON adresse, pas à celle de l'accueil", () => {
    const adresse = `${site.url}${routes.cgv}`;
    expect(canoniqueDe(html)).toBe(adresse);
    expect(ogUrlDe(html)).toBe(adresse);
    expect(canoniqueDe(GABARIT)).not.toBe(adresse); // le gabarit portait l'accueil
  });

  it("reprend sa description, et la même des deux côtés", () => {
    expect(descriptionDe(html)).toBe(meta.cgv.description);
    expect(valeurDe(html, /<meta\s+property="og:description"\s+content="([^"]*)"/)).toBe(
      meta.cgv.description,
    );
  });

  it("ne porte aucun `robots` — elle doit être indexée", () => {
    expect(html).not.toMatch(/<meta\s+name="robots"/);
  });
});

describe("poserTete — la page introuvable", () => {
  const html = poserTete(GABARIT, "introuvable");

  it("porte un `noindex`", () => {
    expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
  });

  it("N'A PLUS de canonique : une URL introuvable n'est l'adresse de rien", () => {
    expect(html).not.toMatch(/rel="canonical"/);
  });

  it("renvoie son `og:url` sur l'accueil plutôt que sur une adresse morte", () => {
    expect(ogUrlDe(html)).toBe(`${site.url}/`);
  });
});

describe("poserTete — la garde", () => {
  it("lève si le gabarit a perdu une balise, au lieu de servir une tête muette", () => {
    const ampute = GABARIT.replace(/<link\s+rel="canonical"[^>]*>/, "");
    expect(() => poserTete(ampute, "cgv")).toThrow(/motif absent/);
  });

  it("échappe ce qu'elle injecte", () => {
    const html = poserTete(GABARIT, "cgv");
    const titre = titreDe(html) ?? "";
    expect(titre).not.toMatch(/[<>]/);
    // Un guillemet non échappé dans une description fermerait l'attribut.
    for (const cle of ["accueil", "formation", "cgv", "confidentialite"] as const) {
      const d = descriptionDe(poserTete(GABARIT, cle)) ?? "";
      expect(d).not.toMatch(/(?<!&quot;)"/);
    }
  });
});
