import { Link } from "react-router-dom";
import {
  blocPaliers,
  encartProduction,
  formation,
  libelleAcces,
  module01,
  paliers,
  paliersPayants,
  patreon,
  routes,
} from "../data/site";
import { type CSSProperties } from "react";
import {
  TAILLES_NOTICE,
  chemin,
  jeuSources,
  narrateurPlanDeFace,
  repli,
  secours,
} from "../data/visuels";
import CartePalier from "../components/formation/CartePalier";
import ComparatifPaliers from "../components/formation/ComparatifPaliers";
import Faq from "../components/formation/Faq";
import PictoSection from "../components/formation/PictoSection";
import SommaireModule from "../components/formation/SommaireModule";
import useMetaPage from "../components/formation/useMetaPage";
import { useRevelation } from "../hooks/useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FORMATION — route `/formation` · socle §0.27
   Les Archives du Professeur Chen — charte v1.0.0

   Deux bandes, et deux seulement :

     1 · LE MODULE OUVERT AUJOURD'HUI — la notice du Module 01, son sommaire
         en huit chapitres, et l'encart qui dit ce qui arrive ensuite.
     2 · TROIS NIVEAUX D'ACCÈS — les trois paliers avec leur montant, le
         comparatif ligne à ligne, et l'aveu de ce qui est en production.

   ── CE QUE LE §0.36 A PURGÉ DE CETTE PAGE ────────────────────────────────

   Rien de ce qui suit n'est repris, et rien ne le remplace : les trois
   témoignages d'élèves (prénoms sous licence, résultats invérifiables), les
   six cartes à émojis, le catalogue des sept modules + bonus dont un seul
   est attesté, et les quatre compteurs du hero — « 7+ modules », « 50h+ de
   contenu », « Privé », « 1:1 » — qui n'avaient aucune source. Le tutoiement
   part avec eux : la copy est au vouvoiement (01-fondations §6.1).

   Le hero centré à sceau, halos et champ d'étincelles disparaît aussi :
   l'Amendement 1 §A1.2 réserve le hero en split à l'accueil, et §A1.2
   interdit toute enseigne redessinée hors de la photo. Une page interne
   ouvre sur sa tête de bloc — pictogramme, surtitre, `h1`, chapô.

   ── UN SEUL `h1`, ET IL PORTE LA CLASSE `.h2` ────────────────────────────

   `.h2` est une classe TYPOGRAPHIQUE (`--fs-h2`), pas un niveau. La maquette
   est une application à vues empilées et n'a qu'un `h1`, celui du hero de
   l'accueil ; avec un routeur, chaque page porte le sien. D'où
   `<h1 className="h2">`, et la hiérarchie qui descend sans saut de niveau :
   h1 · h2 (le module, les paliers) · h3 (le sommaire, les cartes, le
   comparatif).

   ── CE QUI EST VIVANT ICI ────────────────────────────────────────────────

   Le lien Patreon, et lui seul. Aucun relevé, aucun compteur, aucune API.
   Les deux boutons internes visent des routes déclarées dans `site.ts` :
   `routes.module01` pour « Ouvrir le module ». Voir « À signaler ».

   ── LA PLANCHE DE LA NOTICE ──────────────────────────────────────────────

   `.notice` est une grille à deux colonnes dont la seconde, `.notice__v`,
   EST un emplacement visuel : sans image elle se replie en une colonne, et
   la notice perd la moitié de son dessin. La composition en demande donc
   une, et c'est le seul emplacement de cette page qui en demande une.

   C'est `narrateurPlanDeFace` qui l'occupe — le narrateur derrière la
   paillasse, un carnet ouvert : la notice d'un module de méthode montre
   quelqu'un au travail, pas une pièce vide. Le cadrage est carré, la
   colonne est haute : `object-fit: cover` de `.notice__v img` recadre, et
   c'est pour cela que le visuel est déclaré avec trois dérivées jusqu'à
   1280 px.

   Le visuel vient de `src/data/visuels.ts` et de lui seul : aucun chemin
   n'est composé ici. `heroPhoto` ne sert plus cette colonne — cette
   variable est l'interrupteur de la PHOTO DU PLATEAU, qui appartient au
   hero de l'accueil (A1.2) et n'a jamais eu de raison d'illustrer une
   notice de module.

   ── LA FOIRE AUX QUESTIONS ───────────────────────────────────────────────

   `faq` était écrit dans `site.ts` et rendu nulle part. Il l'est désormais,
   en `.accordion` (ARC · CMP — 39), à la FIN de la seconde bande et AVANT
   le bouton d'abonnement : une FAQ répond aux objections avant l'achat, pas
   après. Le composant vit dans `components/formation/Faq.tsx`.

   Elle n'ouvre pas une troisième bande : c'est un sous-bloc de la bande des
   paliers, avec son `h3 sous`, comme « Le sommaire du module » l'est de la
   première. Les deux bandes de l'en-tête restent deux.
   ═══════════════════════════════════════════════════════════════════════════ */

/* La largeur SERVIE de la planche de la notice ne se déclare plus ici.
   C'est LA MÊME grille et LA MÊME phrase que la notice de l'accueil, et les
   deux fichiers portaient chacun un commentaire disant qu'ils ne devaient
   pas diverger. Un commentaire ne tient pas deux fichiers d'accord :
   `TAILLES_NOTICE` de `src/data/visuels.ts` est désormais le seul endroit
   où la phrase existe, et les deux pages la lisent. */

export default function Formation() {
  useRevelation();
  useMetaPage("formation");

  return (
    <div>
      {/* ══════════════ 1 · LE MODULE OUVERT AUJOURD'HUI ══════════════ */}
      <section className="bande" aria-labelledby="titre-formation">
        <div className="wrap">
          <div className="tete" data-rv>
            <PictoSection nom={formation.pictogramme} />
            <p className="eyebrow">{formation.surtitre}</p>
            <h1 className="h2" id="titre-formation">
              {formation.titre}
            </h1>
            <p className="lede">{formation.lede}</p>
          </div>

          {/* La notice de module. `.notice__g` compose `.pilier-email` : le
              montant d'émail est une MATIÈRE, jamais un dégradé recopié —
              sinon `forced-colors` ne le voit plus (30-composants.css §11).

              La notice garde ses deux colonnes : `.notice__v` est servi par
              `narrateurPlanDeFace`, déclaré dans `src/data/visuels.ts`. */}
          <div className="notice" data-rv>
            <div className="notice__g pilier-email">
              <div className="flex flex-wrap items-center gap-serre">
                <span className="code-arc">{module01.chapo}</span>
                <span className="etat etat--ouvert">{libelleAcces.ouvert}</span>
              </div>

              <h2 className="notice__t h3">
                {module01.titre}
                <em>{module01.sousTitre}</em>
              </h2>

              <p className="notice__d">{module01.resume}</p>

              {/* Les dispositifs du module — un `.jeton` par entrée. Ce sont
                  bien les dispositifs, pas les outils : l'accueil vend la
                  chaîne, cette page vend la méthode. */}
              <div className="notice__m">
                {module01.composants.map((composant) => (
                  <span className="jeton" key={composant}>
                    {composant}
                  </span>
                ))}
              </div>

              <div className="hero__b">
                <Link className="btn" to={routes.module01}>
                  {formation.ctaModule}
                  <span className="btn__f" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* La planche de la notice. Trois encodages, du meilleur au plus
                compatible : aucun navigateur ne reste sans image. `sizes`
                décrit la colonne réelle — la moitié d'un `.wrap` de 1140 px
                au-dessus de paillasse(980), la largeur du `.wrap` en dessous,
                où `.notice` se replie en une colonne. */}
            {/* ── DEUX TOKENS, ET UN CHOIX DE PRIORITÉ ────────────────────
                `--cadrage` : la notice de CETTE page sert le narrateur, pas le
                plateau. Le point focal du § 7.13.1 n'est donc pas celui du
                défaut de `.notice__v img` (qui est celui de l'accueil) mais
                `30% 34%`, « cale le visage, pas le buste ». Sans lui, le repli
                16:9 sur téléphone décapitait l'enseigne du mur du fond.
                `--aplat` : l'aplat de chargement du narrateur (§ 7.13.5). */}
            <div
              className="notice__v"
              style={
                {
                  "--cadrage": "30% 34%",
                  "--aplat": narrateurPlanDeFace.aplat,
                } as CSSProperties
              }
            >
              {/* `contents` : la feuille écrit `.notice__v img{block-size:100%}`,
                  et ce pourcentage se résout contre le parent de BOÎTE. Un
                  `<picture>` en ligne, de hauteur automatique, couperait la
                  chaîne. `display: contents` le retire de l'arbre de boîtes
                  et l'image redevient enfant direct de `.notice__v`. */}
              <picture className="contents">
                <source
                  type="image/avif"
                  srcSet={jeuSources(narrateurPlanDeFace, "avif")}
                  sizes={TAILLES_NOTICE}
                />
                <source
                  type="image/webp"
                  srcSet={jeuSources(narrateurPlanDeFace, "webp")}
                  sizes={TAILLES_NOTICE}
                />
                {/* CETTE IMAGE EST DANS LE PREMIER ÉCRAN, DONC ELLE N'EST PAS
                    DIFFÉRÉE. Relevé au navigateur : son bord haut tombe à
                    512 px sur une fenêtre de 900, et à 410 px sur une fenêtre
                    de 844 — elle est visible sans défiler sur les deux
                    gabarits, et c'est elle qui porte le LCP de cette page.
                    `loading="lazy"` sur un élément du premier écran le fait
                    attendre la première mise en page et le range en priorité
                    basse. Le § 7.13.5 réserve `lazy` à tout SAUF l'image du
                    héros ; sur cette page, l'image de la notice EST le héros. */}
                <img
                  src={chemin(narrateurPlanDeFace, secours(narrateurPlanDeFace), "jpg")}
                  srcSet={jeuSources(narrateurPlanDeFace, "jpg")}
                  sizes={TAILLES_NOTICE}
                  width={repli(narrateurPlanDeFace).l}
                  height={repli(narrateurPlanDeFace).h}
                  alt={narrateurPlanDeFace.alt}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
              <p className="legende legende--bg">
                {module01.numero} · {module01.titre}
              </p>
            </div>
          </div>

          <h3 className="h3 sous" id="sommaire" data-rv>
            Le sommaire du module
          </h3>
          <p className="corps" data-rv>
            {module01.duree}
          </p>

          <SommaireModule />

          {/* Les écarts de bloc sont de la mise en page locale, donc Tailwind
              (socle §0.21) — mais ils lisent le pas d'espacement de la charte
              au lieu d'écrire une distance : `mt-[13px]` serait le défaut que
              la configuration proscrit, `mt-[var(--sp-8)]` ne l'est pas. */}
          <div className="encart mt-[var(--sp-8)]" data-rv>
            <div className="encart__t">{formation.encartSuite.titre}</div>
            <p className="mb-0">{formation.encartSuite.texte}</p>
          </div>
        </div>
      </section>

      {/* ══════════════ 2 · TROIS NIVEAUX D'ACCÈS ══════════════ */}
      <section className="bande bande--teinte" aria-labelledby="titre-paliers">
        <div className="wrap">
          <div className="tete" data-rv>
            <PictoSection nom={blocPaliers.pictogramme} />
            <p className="eyebrow">{blocPaliers.surtitre}</p>
            {/* Le titre de la bande vient de la maquette validée, qui ouvre
                cette section de `/formation` sur « Trois niveaux d'accès ».
                `site.ts` ne porte pour l'instant qu'un seul titre de bloc de
                paliers, celui des cartes. Voir « À signaler ». */}
            <h2 className="h2" id="titre-paliers">
              Trois niveaux d’accès
            </h2>
            <p className="lede">{blocPaliers.lede}</p>
          </div>

          <h3 className="h3 sous" data-rv>
            {blocPaliers.titre}
          </h3>

          <div className="paliers" data-rv>
            {paliersPayants.map((cle) => (
              <CartePalier key={cle} palier={paliers[cle]} />
            ))}
          </div>

          {/* « Sans engagement », en toutes lettres sous les trois montants
              (Amendement 1 §A1.1). */}
          <p className="meta mt-[var(--sp-4)]" data-rv>
            {patreon.mentionEngagement}
          </p>

          <h3 className="h3 sous" data-rv>
            {blocPaliers.titreComparatif}
          </h3>

          <ComparatifPaliers />

          {/* L'aveu, dit avant l'abonnement et pas après. */}
          <div className="encart mt-[var(--sp-8)]" data-rv>
            <div className="encart__t">{encartProduction.paliers.titre}</div>
            {encartProduction.paliers.paragraphes.map((paragraphe, rang, tous) => (
              <p key={paragraphe} className={rang === tous.length - 1 ? "mb-0" : undefined}>
                {paragraphe}
              </p>
            ))}
          </div>

          {/* La FAQ, avant le bouton. Les cinq réponses viennent de `faq`
              dans `site.ts` ; aucune n'est réécrite ici, et aucune n'est
              écartée — voir l'en-tête de `Faq.tsx` pour le relevé des
              vérifications. */}
          <h3 className="h3 sous" data-rv>
            Les questions fréquentes
          </h3>

          <div data-rv>
            <Faq />
          </div>

          <div className="hero__b mt-[var(--sp-8)]" data-rv>
            <a className="btn" href={patreon.url} target="_blank" rel="noopener">
              {formation.ctaPaliers}
              <span className="btn__f" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
