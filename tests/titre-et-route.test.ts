import { describe, expect, it } from "vitest";
import { cleDeRoute, meta, routes, site, titrePage } from "../src/data/site";
import type { RouteKey } from "../src/data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LE TITRE D'UNE PAGE, ET LA CLÉ D'UN CHEMIN

   `cleDeRoute` est devenue critique en devenant la source de l'annonce de
   changement de page. `Layout` lisait `document.title`, ce qui marchait tant
   que la page était montée avant lui ; les routes étant désormais
   paresseuses, c'est la surface d'attente qui est montée à cet instant et le
   titre serait celui de la page QU'ON QUITTE. Si `cleDeRoute` se trompe,
   personne ne le voit : seul un lecteur d'écran entend l'erreur.
   ═══════════════════════════════════════════════════════════════════════════ */

const CLES = Object.keys(routes) as RouteKey[];

describe("titrePage", () => {
  it("ne suffixe pas l'accueil, qui porte déjà le nom du site", () => {
    expect(titrePage("accueil")).toBe(meta.accueil.titre);
    expect(titrePage("accueil")).not.toMatch(/·/);
  });

  it("suffixe toutes les autres, § 0.29", () => {
    for (const cle of CLES.filter((c) => c !== "accueil")) {
      expect(titrePage(cle)).toBe(`${meta[cle].titre} · ${site.name}`);
    }
  });

  it("ne rend jamais de titre vide", () => {
    for (const cle of CLES) expect(titrePage(cle).trim().length).toBeGreaterThan(0);
  });
});

describe("cleDeRoute", () => {
  it("retrouve chaque route déclarée", () => {
    for (const cle of CLES) expect(cleDeRoute(routes[cle])).toBe(cle);
  });

  it("tient la racine, qui ne se rogne pas", () => {
    expect(cleDeRoute("/")).toBe("accueil");
  });

  it("ignore une barre oblique finale — /contact/ n'est pas une autre page", () => {
    expect(cleDeRoute("/contact/")).toBe("contact");
    expect(cleDeRoute("/cgv//")).toBe("cgv");
  });

  it("rend `introuvable` sur un chemin inconnu, comme `path=\"*\"`", () => {
    expect(cleDeRoute("/nimporte-quoi")).toBe("introuvable");
    expect(cleDeRoute("/formation/module-42")).toBe("introuvable");
  });

  it("annonce donc le bon titre pour chaque route, sans rien monter", () => {
    expect(titrePage(cleDeRoute("/cgv"))).toBe(`${meta.cgv.titre} · ${site.name}`);
    expect(titrePage(cleDeRoute("/"))).toBe(meta.accueil.titre);
    expect(titrePage(cleDeRoute("/page-morte"))).toBe(`${meta.introuvable.titre} · ${site.name}`);
  });
});
