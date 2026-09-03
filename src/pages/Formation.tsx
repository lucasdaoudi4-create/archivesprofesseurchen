import { Link } from "react-router-dom";
import {
  blocPaliers,
  encartProduction,
  formation,
  heroPhoto,
  libelleAcces,
  module01,
  paliers,
  paliersPayants,
  patreon,
  routes,
} from "../data/site";
import CartePalier from "../components/formation/CartePalier";
import ComparatifPaliers from "../components/formation/ComparatifPaliers";
import PictoSection from "../components/formation/PictoSection";
import SommaireModule from "../components/formation/SommaireModule";
import useMetaPage from "../components/formation/useMetaPage";
import useRevelation from "../components/formation/useRevelation";

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
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Formation() {
  const racine = useRevelation();
  useMetaPage("formation");

  return (
    <div ref={racine}>
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

              La photo du plateau est suspendue à sa validation juridique :
              `heroPhoto` vaut `null` et « aucune page ne doit inventer de
              repli ». La notice passe alors à une colonne — mise en page
              locale, donc Tailwind, jamais une variante de composant. */}
          <div className={heroPhoto ? "notice" : "notice grid-cols-1"} data-rv>
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

            {heroPhoto && (
              <div className="notice__v">
                <img src={heroPhoto.src} alt={heroPhoto.alt} loading="lazy" decoding="async" />
                <p className="legende legende--bg">
                  {module01.numero} · {module01.titre}
                </p>
              </div>
            )}
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

          <div className="hero__b" data-rv>
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
