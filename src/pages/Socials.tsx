import { useEffect, useRef } from "react";
import {
  blocReseaux,
  meta,
  patreon,
  reseaux,
  reseauxOrdre,
  routes,
  site,
} from "../data/site";
import SocialIcon from "../components/ui/SocialIcon";
import FluxYouTube from "../components/reseaux/FluxYouTube";

/* ═══════════════════════════════════════════════════════════════════════════
   LES RÉSEAUX — route `/reseaux` · gabarit « grille de cartes » (§ 0.27)
   Les Archives du Professeur Chen — charte v1.0.0, lot L4

   Source : maquette `#v-reseaux` (l. 1193-1221), plus le bloc 03 de
   l'accueil (l. 825-865) dont cette page reprend deux choses que la vue
   dédiée avait perdues.

   ── TROIS ÉCARTS ASSUMÉS AVEC LA MAQUETTE ─────────────────────────────────

   1. UN `h1`, PAS UN `h2`. La maquette est un document unique à neuf vues :
      un seul `h1`, celui du hero de l'accueil. Le site est un routeur de
      huit pages, et chacune doit ouvrir sur son propre `h1`. `.h2` reste
      la classe TYPOGRAPHIQUE (`--fs-h2`), elle ne dit rien du niveau —
      d'où `<h1 class="h2">`.

   2. LE CHAPÔ ET LES GLOSES REVIENNENT. Sur l'accueil, les quatre cartes
      portent un `.reseau__d` et le bloc porte un `.lede` ; sur la vue
      dédiée, ni l'un ni l'autre. La page qui approfondit était donc plus
      pauvre que son teaser. Les deux sont repris de `blocReseaux.lede` et
      de `reseaux.*.description` — aucune copie nouvelle.

   3. LE SURTITRE PERD SON NUMÉRO. « 03 — Les réseaux » numérote une zone
      du plan au sol de l'ACCUEIL (A1.3, zone 03 « La galerie d'archives ») ;
      hors de cette page, le rang ne renvoie à rien. Le surtitre est donc
      `meta.reseaux.titre`, « Les réseaux ».

   ── CE QUE § 0.25 ET § 0.36 RETIRENT ──────────────────────────────────────

   Le tableau « Comment on publie » de l'ancienne page — « ~1 par semaine »,
   « Quotidien », « Plusieurs / semaine », « Hebdomadaire » — disparaît sans
   remplacement : ce sont des cadences invérifiables, sans source branchée.
   Rien dans `site.ts` ne les porte, et rien ne doit les réintroduire.

   ── LES GLYPHES DE PLATEFORME ─────────────────────────────────────────────

   Le chapitre 06 § 6.4 (famille `marque`) interdit de redessiner un logo
   tiers « au style maison » : silhouette pleine, prise au kit de son
   propriétaire, normalisée en `viewBox 0 0 24 24`. La maquette, elle, les
   avait retracés au trait 1,5 des Archives — c'est la déformation de
   marque que le § 6.4 nomme. `SocialIcon` porte les silhouettes pleines :
   il est conservé, et reçoit `.ico .ico--marque .ico--32 .ico--action`,
   qui neutralise le trait de `.ico` et lit `--accent`. `31-icones.css`
   ayant supprimé le `.reseau svg{width:26px}` de la maquette, c'est bien
   la page qui donne à l'icône sa taille servie — 32 px, un pas de la liste
   du § 0.13, là où 26 n'en est pas un.
   ═══════════════════════════════════════════════════════════════════════════ */

const FICHE = meta.reseaux;
const TITRE = `${FICHE.titre} · ${site.name}`;
const CANONIQUE = `${site.url}${routes.reseaux}`;

/* Données structurées — § 0.29 : `Organization` sur toutes les pages, une
   seule par page. C'est ici qu'elle compte le plus, parce que c'est la page
   qui déclare les comptes de la marque : `sameAs` est lu comme la liste
   officielle des profils. Les quatre réseaux plus Patreon. Le Discord n'y
   figure pas : une URL d'invitation n'est pas un profil public. */
const ORGANISATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/favicon.svg`,
  sameAs: [...reseauxOrdre.map((cle) => reseaux[cle].url), patreon.url],
  publisher: { "@type": "Organization", name: site.editeur },
};

/** Pose ou met à jour une balise `<meta>` du document. */
function poserMeta(attribut: "name" | "property", nom: string, contenu: string) {
  let balise = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribut}="${nom}"]`,
  );
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, nom);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", contenu);
}

/** Pose ou met à jour le `<link rel="canonical">`. Absolu, sans paramètre. */
function poserCanonique(href: string) {
  let balise = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!balise) {
    balise = document.createElement("link");
    balise.rel = "canonical";
    document.head.appendChild(balise);
  }
  balise.href = href;
}

export default function Socials() {
  const racine = useRef<HTMLDivElement>(null);

  /* ── Le titre et les métadonnées, § 0.29 ────────────────────────────────
     Le § 0.28 exige que le titre soit posé « par la page, EN AMONT » :
     l'effet d'un enfant s'exécute avant celui de son parent, donc quand
     `Layout` lit `document.title` pour l'annoncer, cette ligne est déjà
     passée. Le site n'a aucun mécanisme de titre par page — `index.html`
     n'en porte qu'un, celui de l'accueil ; il est posé ici, sans
     dépendance ajoutée. */
  useEffect(() => {
    document.title = TITRE;
    poserCanonique(CANONIQUE);
    poserMeta("name", "description", FICHE.description);
    poserMeta("name", "robots", FICHE.indexee ? "index, follow" : "noindex, nofollow");
    poserMeta("property", "og:title", TITRE);
    poserMeta("property", "og:description", FICHE.description);
    poserMeta("property", "og:url", CANONIQUE);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ORGANISATION);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  /* ── La révélation au défilement — `.rv` / `.rv.on` ─────────────────────
     `04-tokens-motion.css` masque `.rv` et ne le rend qu'avec `.on`. Sans
     observateur, une page entière resterait invisible. L'observation
     émettant une première fois pour TOUT ce qu'elle observe, ce qui est
     déjà dans le cadre à l'arrivée de route reçoit `.on` immédiatement :
     aucun traitement séparé n'est nécessaire.

     Rien ici pour `prefers-reduced-motion` : `99-preferences.css` remet
     déjà `.rv` à `opacity:1`, sans passer par le JavaScript. */
  useEffect(() => {
    const cibles = racine.current?.querySelectorAll<HTMLElement>(".rv");
    if (!cibles) return;

    if (!("IntersectionObserver" in window)) {
      cibles.forEach((cible) => cible.classList.add("on"));
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;
          entree.target.classList.add("on");
          observateur.unobserve(entree.target);
        });
      },
      { threshold: 0.12 },
    );

    cibles.forEach((cible) => observateur.observe(cible));
    return () => observateur.disconnect();
  }, []);

  return (
    <div ref={racine}>
      {/* ═══════════ OÙ L'ON PUBLIE ═══════════ */}
      <section className="bande" aria-labelledby="t-reseaux">
        <div className="wrap">
          <div className="tete rv">
            <p className="eyebrow">{FICHE.titre}</p>
            <h1 className="h2" id="t-reseaux">
              {blocReseaux.titre}
            </h1>
            <p className="lede">{blocReseaux.lede}</p>
          </div>

          <div className="reseaux rv">
            {reseauxOrdre.map((cle) => {
              const compte = reseaux[cle];
              return (
                <a
                  key={cle}
                  className="reseau"
                  href={compte.url}
                  target="_blank"
                  rel="noopener"
                >
                  <SocialIcon type={cle} className="ico ico--marque ico--32 ico--action" />
                  <div>
                    <div className="reseau__n">{compte.label}</div>
                    <div className="reseau__h">{compte.handle}</div>
                    <div className="reseau__d">{compte.description}</div>
                    <span className="sr-only"> (nouvel onglet)</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ LE FIL DE LA CHAÎNE ═══════════
          La bande entière est conditionnée au `channelId` : sans lui, la
          façade ne rend rien, et une tête de section seule serait la
          « promesse d'un fil » sans fil (addendum 08 § 8.11.2). */}
      {reseaux.youtube.channelId && (
        <section className="bande bande--teinte" aria-labelledby="t-fil">
          <div className="wrap">
            <div className="tete rv">
              <p className="eyebrow">{reseaux.youtube.label}</p>
              <h2 className="h2" id="t-fil">
                {reseaux.youtube.description}
              </h2>
            </div>

            <div className="rv">
              <FluxYouTube />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
