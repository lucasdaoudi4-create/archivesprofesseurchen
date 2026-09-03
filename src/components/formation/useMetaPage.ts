import { useEffect } from "react";
import { meta, routes, site, type RouteKey } from "../../data/site";

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

export default function useMetaPage(cle: RouteKey) {
  useEffect(() => {
    const fiche = meta[cle];
    const titre = cle === "accueil" ? fiche.titre : `${fiche.titre} · ${site.name}`;
    const canonique = `${site.url}${routes[cle]}`;

    document.title = titre;
    poserBalise("name", "description", fiche.description);
    poserBalise("property", "og:title", titre);
    poserBalise("property", "og:description", fiche.description);
    poserBalise("property", "og:url", canonique);
    poserCanonique(canonique);

    if (fiche.indexee) retirerBalise("name", "robots");
    else poserBalise("name", "robots", "noindex, nofollow");
  }, [cle]);
}
