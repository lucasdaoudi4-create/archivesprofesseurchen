import { useEffect } from "react";
import { meta, routes, site, titrePage, type RouteKey } from "../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   MÉTADONNÉES DE PAGE — socle §0.29
   Les Archives du Professeur Chen — charte v1.0.0

   Le site est une application à routes et `index.html` ne porte qu'un seul
   `<title>` : celui de l'accueil. Toute page interne servait donc jusqu'ici
   le titre de l'accueil, et `Layout.tsx` — qui ANNONCE `document.title` au
   changement de route (§0.28) — annonçait « Les Archives du Professeur Chen »
   sur les dix routes. Ce crochet pose le titre AVANT que la coquille ne le
   lise : les effets d'un enfant s'exécutent avant ceux de son parent.

   Il ne pose que ce dont une route interne a besoin et que la coquille ne
   peut pas deviner :
     · `document.title`, au gabarit « {Titre} · {nom du site} » du §0.29,
       sauf sur l'accueil dont le titre est le nom seul ;
     · la description, et `og:title` / `og:description` qui lui sont
       IDENTIQUES (§0.29) ;
     · la canonique absolue, sans paramètre de campagne, et `og:url` ;
     · `robots`, posé seulement sur une page non indexée, et RETIRÉ sinon —
       sans quoi un passage par `/404` laisserait un `noindex` collé à la
       page suivante.

   C'est le SEUL endroit du site qui écrit ces balises. Six copies locales
   existaient (accueil, Discord, réseaux, contact, pages légales, et ce
   crochet) ; elles avaient divergé — `/minecraft` et `/404` gardaient la
   canonique de l'accueil, les pages légales son `og:url`.

   Une page non indexée perd sa canonique : une URL introuvable ne doit pas
   se déclarer l'adresse de référence de quoi que ce soit.

   `donnees` : l'objet JSON-LD de la page (une seule donnée structurée par
   page, § 0.29), posé au montage et retiré au démontage.

   Ce qu'il ne touche pas : `theme-color`, `og:image`, `og:type`, `og:locale`,
   `og:site_name` et `twitter:card`, qui sont communs à tout le site et vivent
   dans `index.html`.
   ═══════════════════════════════════════════════════════════════════════════ */

function poserBalise(attribut: "name" | "property", cle: string, valeur: string) {
  const selecteur = `meta[${attribut}="${cle}"]`;
  let balise = document.head.querySelector<HTMLMetaElement>(selecteur);
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, cle);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", valeur);
}

function retirerBalise(attribut: "name" | "property", cle: string) {
  document.head.querySelector(`meta[${attribut}="${cle}"]`)?.remove();
}

function poserCanonique(href: string) {
  let lien = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!lien) {
    lien = document.createElement("link");
    lien.rel = "canonical";
    document.head.appendChild(lien);
  }
  lien.href = href;
}

function retirerCanonique() {
  document.head.querySelector('link[rel="canonical"]')?.remove();
}

export default function useMetaPage(cle: RouteKey, donnees?: object) {
  /* ── POURQUOI LA SÉRIALISATION A LIEU ICI, ET PAS DANS L'EFFET ──────────
     L'effet ne dépendait que de `cle`, et un commentaire affirmait que
     `donnees` était « une constante de module chez chaque appelant » — avec
     un `eslint-disable` pour le faire taire, dans un dépôt qui n'avait pas
     ESLint. C'était vrai des deux appelants du jour, et de personne d'autre :
     un appelant qui passerait un objet construit dans le rendu aurait vu ses
     données structurées figées à leur première valeur, sans le moindre signe.

     La chaîne, elle, se compare PAR VALEUR. L'effet se rejoue quand les
     données changent vraiment, jamais quand seule leur identité change.
     L'invariante n'a plus à être affirmée : elle n'existe plus.            */
  const charge = donnees ? JSON.stringify(donnees) : null;

  useEffect(() => {
    const fiche = meta[cle];
    const titre = titrePage(cle);
    const canonique = `${site.url}${routes[cle] === "/" ? "/" : routes[cle]}`;

    document.title = titre;
    poserBalise("name", "description", fiche.description);
    poserBalise("property", "og:title", titre);
    poserBalise("property", "og:description", fiche.description);

    if (fiche.indexee) {
      poserBalise("property", "og:url", canonique);
      poserCanonique(canonique);
      retirerBalise("name", "robots");
    } else {
      poserBalise("property", "og:url", `${site.url}/`);
      retirerCanonique();
      poserBalise("name", "robots", "noindex, nofollow");
    }

    if (!charge) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = charge;
    document.head.appendChild(script);
    return () => script.remove();
  }, [cle, charge]);
}
