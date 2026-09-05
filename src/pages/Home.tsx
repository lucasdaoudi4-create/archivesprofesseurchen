import { Fragment, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  accueil,
  blocPaliers,
  blocReseaux,
  contact,
  discord,
  encartProduction,
  formation,
  heroPhoto,
  meta,
  minecraft,
  module01,
  paliers,
  paliersPayants,
  patreon,
  portraitPhoto,
  reseaux,
  reseauxOrdre,
  routes,
  site,
} from "../data/site";
import {
  CADRAGE_COLONNE,
  TAILLES_NOTICE,
  TAILLES_PORTRAIT,
  TAILLES_SCENE,
  chemin,
  jeuSources,
  narrateurPlanDeFace,
  narrateurPortrait,
  plateauHaut,
  plateauLarge,
  ratio,
  repli,
  secours,
} from "../data/visuels";
import PlanAuSol from "../components/accueil/PlanAuSol";
import PanneauMatiere from "../components/accueil/PanneauMatiere";
import EtatServeur from "../components/accueil/EtatServeur";
import { Ecusson, Icone, LogoReseau } from "../components/ui/Icones";
import { useRevelation } from "../hooks/useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ACCUEIL — route `/` · la page la plus normée du site
   Les Archives du Professeur Chen — charte v1.0.0

   Portage de la vue `#v-accueil` de la maquette validée (l. 593-893), sur les
   composants de la charte. Six blocs, dans cet ordre, et pas un de plus :

     1. `.hero`        le split — Amendement 1 § A1.2 et § A1.1
     2. `.plan-bande`  le plan au sol — Amendement 1 § A1.3
     3. `#b-formation` 01 — la formation, la notice, l'atelier, les paliers
     4. `#b-minecraft` 02 — le serveur, en bande d'acier
     5. `#b-reseaux`   03 — les réseaux, en bande teintée
     6. `#b-contact`   04 — me joindre

   ── LE HERO EST UN SPLIT, ET SES TROIS INTERDITS SONT VÉRIFIABLES ─────────

   A1.2 : « panneau clair à gauche avec son montant d'émail, photo à droite à
   pleine lumière ». Ce qui en découle, et qui se lit dans le JSX ci-dessous :

     · JAMAIS DE TEXTE LONG SUR LA PHOTO. Le seul élément posé sur `.hero__v`
       est `.legende` — une plaque mono d'une cinquantaine de signes. Aucun
       titre, aucun paragraphe, aucun bouton n'y entre.
     · JAMAIS D'ASSOMBRISSEMENT. L'image reste à `opacity:1` ; le seul voile
       est le `::after` latéral du composant, qui raccorde la photo au
       panneau et devient transparent à 32 %. Aucun filtre n'est écrit ici.
     · UNE SEULE ENSEIGNE PAR ÉCRAN. Elle est DANS la photo. L'accueil
       précédent posait par-dessus un `<Seal size={340}>`, deux halos en
       `blur-[120px]` et un `SparkField` : les quatre disparaissent, sans
       remplacement.

   Le hero est sur fond CLAIR — `.hero` lit `--surface`. L'inversion par
   rapport au `bg-encre` de la page précédente est la plus visible de toute
   la migration, et elle est voulue.

   ── LA PHOTO EST LÀ, ET LA PAGE GARDE SON CHEMIN SANS PHOTO ───────────────

   `heroPhoto` et `portraitPhoto` sont renseignés dans `src/data/site.ts` :
   l'auteur a levé la réserve de 07-imagerie § 7.14, qui lui appartient. Les
   trois branches `heroPhoto ? … : …` / `portraitPhoto ? … : …` NE SONT PAS
   supprimées pour autant — la réserve est révocable d'un mot, les deux
   constantes redeviennent `null`, et la page doit alors retomber sans une
   erreur sur `PanneauMatiere` et sur l'atelier à une colonne. Les deux
   chemins sont donc servis, et aucun n'est le brouillon de l'autre.

   Ce que la page lit dans `src/data/visuels.ts`, et nulle part ailleurs :
   les dérivées (`jeuSources`), la dérivée de tête (`repli`), le rapport de
   forme (`ratio`), l'aplat de chargement et le texte de remplacement. Aucun
   chemin de fichier n'est composé ici — c'est la règle du § 0.19, et c'est
   ce qui fait qu'une image repassée en -v02 ne demande aucune retouche de
   page.

   ── CE QUE § 0.36 RETIRE DE CETTE PAGE, ET NE REMPLACE PAS ────────────────

   Les trois compteurs du hero (« 360+ membres », « 7 modules », « 24/7 »),
   le manifeste à pictogrammes, le carnet de nouvelles, la newsletter et le
   flux YouTube. Aucun n'a de source branchée, aucun n'existe dans la
   maquette validée, et le § 0.25 interdit d'afficher un effectif sans source.
   Le compteur Discord suit la même règle : `discord.guildId` vaut `null`,
   donc le widget ne monte plus ici — il vit sur `/discord`, et là seulement.

   Ce qui survit, en revanche : le relevé d'état Minecraft, reformulé en état
   ÉCRIT dans la fiche `.serveur` du bloc 02 (voir `EtatServeur`).

   ── LES QUATRE ANCRES ─────────────────────────────────────────────────────

   `#b-formation` `#b-minecraft` `#b-reseaux` `#b-contact` sont visées par le
   plan au sol, et `#b-paliers` par le bouton du hero. Ce sont de vraies
   ancres de page : elles restent des `<a href="#…">`, jamais des `<Link>`.
   `[id]{scroll-margin-top}` (§ 0.20) les décale déjà sous la barre collante.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Métadonnées de page — socle § 0.29 ───────────────────────────────────
   Le site n'a aucun mécanisme de titre par page : `index.html` en porte un
   seul. Or `Layout.tsx` ANNONCE `document.title` à chaque changement de
   route (§ 0.28) — sans titre par page, revenir sur l'accueil annoncerait le
   titre de la page qu'on quitte. La page pose donc le sien, en amont, comme
   le § 0.28 le suppose.

   Aucune dépendance ajoutée pour cela : quatre lignes de DOM suffisent, et
   `react-helmet-async` pèserait plus que la fonction qu'il rendrait.        */

function poserMeta(attribut: "name" | "property", cle: string, contenu: string): void {
  const selecteur = `meta[${attribut}="${cle}"]`;
  let balise = document.head.querySelector<HTMLMetaElement>(selecteur);
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, cle);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", contenu);
}

function poserCanonique(href: string): void {
  let lien = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!lien) {
    lien = document.createElement("link");
    lien.setAttribute("rel", "canonical");
    document.head.appendChild(lien);
  }
  lien.setAttribute("href", href);
}

function useMetadonneesAccueil(): void {
  useEffect(() => {
    const { titre, description } = meta.accueil;

    document.title = titre;
    poserMeta("name", "description", description);
    poserMeta("property", "og:title", titre);
    poserMeta("property", "og:description", description);
    poserMeta("property", "og:url", `${site.url}/`);
    poserCanonique(`${site.url}/`);

    // Une seule donnée structurée par page (§ 0.29). Sur l'accueil c'est
    // `Organization` : le nom, l'adresse, la marque, et les comptes tenus
    // ailleurs. Aucun chiffre, aucune note, aucun avis — rien qui ne soit
    // vérifiable depuis le site lui-même.
    const donnees = document.createElement("script");
    donnees.type = "application/ld+json";
    donnees.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/favicon.svg`,
      description: meta.accueil.description,
      sameAs: [
        ...reseauxOrdre.map((cle) => reseaux[cle].url),
        patreon.url,
      ],
      parentOrganization: { "@type": "Organization", name: site.editeur },
    });
    document.head.appendChild(donnees);

    return () => donnees.remove();
  }, []);
}

/* Les trois plaques de palier — socle § 0.26 et contrat de balisage de
   `32-membre.css`. Le rang 01 prend sa couleur du CSS ; les rangs 02 et 03
   prennent leur MATIÈRE par composition, parce que la couche `composants`
   n'a pas le droit de réécrire un dégradé. Le rang 03 porte `acier` EN PLUS
   de `mat-acier` : c'est `acier` qui rebascule `--accent` sur le néon, d'où
   vient la couleur du libellé exigée par le § 0.26. */
const PLAQUE: Record<number, string> = {
  1: "palier__plaque",
  2: "palier__plaque mat-email",
  3: "palier__plaque mat-acier acier",
};

/* ── LES LARGEURS SERVIES VIENNENT DE `visuels.ts` ────────────────────────
   Un `sizes` faux coûte plus cher qu'un `srcset` absent : le navigateur
   choisit sa dérivée AVANT de connaître la mise en page. Les quatre phrases
   que cette page emploie — la condition de cadrage et les trois `sizes` —
   ne sont donc PAS écrites ici : elles vivent dans `src/data/visuels.ts`,
   à côté des dérivées qu'elles servent, avec le calcul de grille qui les
   justifie. Deux raisons de les y avoir déplacées :

     · `TAILLES_NOTICE` était recopié à l'identique dans `Formation.tsx`,
       sous le nom `TAILLES_PLANCHE`, avec un commentaire de chaque côté
       disant qu'ils ne devaient pas diverger. Un commentaire ne tient pas
       deux fichiers d'accord ; un export, si.
     · `vite.config.ts` fabrique le lien de préchargement du héros et a
       besoin EXACTEMENT du même `media` et du même `sizes`. S'ils
       divergeaient d'un caractère, le navigateur téléchargerait deux
       dérivées au lieu d'une.                                            */

/* ── L'APLAT DE CHARGEMENT ────────────────────────────────────────────────
   Il n'y a plus de crochet ici, et c'est le § 7.13.5 qui l'enlève :
   « Placeholder : aplat de couleur pris dans la table LQIP des tokens, pas
   de flou progressif, pas d'effet de balayage. »

   La page portait un `useSceneChargee` qui écoutait `load`, rattrapait le
   cas de l'image déjà en cache, et posait une classe `.chargee` pour éteindre
   une vignette floutée. Un aplat de couleur n'a rien de tout cela à faire :
   il est déclaré en `background-color` sur le cadre, la photo se peint
   par-dessus, et il n'existe aucun état intermédiaire à observer. Le seul
   token que le balisage pose encore est `--aplat`, lu de `visuels.ts`.   */

export default function Home() {
  useMetadonneesAccueil();
  useRevelation();

  return (
    <>
      {/* ══════════════════ 1 · LE HERO — A1.2 ══════════════════ */}
      <header className="hero">
        {/* Le panneau clair. `mat-panneau` donne la matière, `pilier-email`
            le montant : le montant n'est PAS un élément, c'est un
            pseudo-élément de la matière. On n'ajoute aucun <div> décoratif. */}
        <div className="hero__g mat-panneau pilier-email">
          <h1 className="h1">
            {accueil.hero.titre}
            <em>{accueil.hero.sousTitre}</em>
          </h1>

          <p className="hero__p lede">{accueil.hero.texte}</p>

          {/* A1.1 : le montant exact, la périodicité et « sans engagement »
              sont dans le texte ci-dessus, et le prix est porté par le CTA.
              Restent interdits : compte à rebours, prix barré, promotion. */}
          <div className="hero__b">
            <a className="btn" href={accueil.hero.ctaPrimaire.ancre}>
              {accueil.hero.ctaPrimaire.label}{" "}
              <span className="btn__f" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--fantome" href={accueil.hero.ctaSecondaire.ancre}>
              {accueil.hero.ctaSecondaire.label}{" "}
              <span className="btn__f" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* La scène. Rien d'autre que l'image et sa plaque n'entre ici.
            AUCUN emblème, AUCUN halo, AUCUNE étincelle : l'enseigne est DANS
            la photo, troisième interdit d'A1.2 — une seule enseigne par
            écran. On ne redessine pas en HTML ce que l'image contient déjà.

            ── L'EMPILEMENT SOUS `planche` (620) ──────────────────────────
            `30-composants.css` fait passer la scène AVANT le panneau dès
            979,98 px (`.hero__v{order:-1}`) : « on voit le lieu avant de
            lire ce qu'on y fait ». La règle tient tant que la scène EST le
            lieu, et tant qu'elle laisse de la place au titre. Elle ne tient
            plus sur un écran de 390 px, où la scène occuperait le premier
            écran ENTIER avant le moindre mot : le visiteur ouvrirait la page
            sur une image sans une ligne de texte, et sans savoir où il est.

            Les trois utilitaires ci-dessous ne s'appliquent QUE sous 620 px.
            Au-dessus, aucune classe n'est émise : l'ordre du composant reste
            intact, et A1.2 — panneau clair à gauche, scène à droite —
            continue de gouverner la planche, la paillasse et le poste de
            travail. C'est de la mise en page locale, donc en utilitaires
            (socle § 0.21), et c'est l'`order` du flux, jamais un
            positionnement absolu.

              · `order-last`      la scène passe APRÈS le panneau : le titre,
                                  le chapô et les deux boutons sont au-dessus
                                  de la ligne de flottaison, la photo suit ;
              · `min-h-0`         libère le plancher de `52vw` du composant,
                                  sans quoi le ratio ci-dessous ne pourrait
                                  pas descendre ;
              · `aspect-planche`  le plus plat des ratios du système — le
                                  jeton `planche` du thème Tailwind, jumeau
                                  déclaré de `--ar-planche` (21/9). La scène
                                  devient une bande de pied de 167 px sur un
                                  écran de 390, exactement comme `.notice__v`
                                  prend `--ar-scene` au même repli. C'est
                                  cette borne, et elle seule, qui garantit
                                  que la photo ne repousse rien.

            ── LES DEUX TOKENS QUE LE BALISAGE DÉCLARE ────────────────────
            `--ratio` et `--aplat` sont lus par `.hero__v`. Ils ne sont posés
            QUE sur le chemin avec photo : sans elle, `aspect-ratio` retombe
            sur `auto`, le fond reprend le noir de scène, et la composition
            de matières retrouve son plancher de hauteur au pixel près. Une
            déclaration de token sur l'élément est la seule forme de style
            local que le § 0.21 admette.

            `--aplat` ne porte PAS une couleur : il porte le NOM du jeton
            (`var(--lqip-dec01)`). La table LQIP du § 7.13.5 vit dans
            `01-tokens-couleur.css`, et une page n'écrit jamais une couleur
            du système en dur — pas même par la main de `visuels.ts`.      */}
        <div
          className="hero__v max-planche:order-last max-planche:min-h-0 max-planche:aspect-planche"
          style={
            heroPhoto
              ? ({
                  "--ratio": String(ratio(plateauHaut)),
                  "--aplat": plateauHaut.aplat,
                } as CSSProperties)
              : undefined
          }
        >
          {heroPhoto ? (
            <>
              {/* `<picture>` : `.hero__v picture { display: contents }` le
                  sort de la mise en page, l'élément `img` reste l'enfant direct de
                  la scène et son `block-size: 100%` mesure encore quelque
                  chose. Ordre de lecture du navigateur : la PREMIÈRE source
                  dont le `media` ET le `type` conviennent gagne — d'où les
                  trois sources de la colonne AVANT les deux de la bande, et
                  l'élément `img` en dernier recours.

                  L'image reste à `opacity: 1` — deuxième interdit d'A1.2. Ni
                  filtre, ni voile, ni surcouche ne sont écrits ici : le seul
                  voile du hero est le `::after` latéral du composant, qui
                  s'éteint à 32 % et ne sert qu'à porter `.legende--bg`. */}
              <picture>
                {/* La colonne haute (4:3), au-dessus de `planche`. */}
                <source
                  media={CADRAGE_COLONNE}
                  type="image/avif"
                  srcSet={jeuSources(plateauHaut, "avif")}
                  sizes={TAILLES_SCENE}
                />
                <source
                  media={CADRAGE_COLONNE}
                  type="image/webp"
                  srcSet={jeuSources(plateauHaut, "webp")}
                  sizes={TAILLES_SCENE}
                />
                <source
                  media={CADRAGE_COLONNE}
                  type="image/jpeg"
                  srcSet={jeuSources(plateauHaut, "jpg")}
                  sizes={TAILLES_SCENE}
                />

                {/* La bande large (16:9), en dessous. Sans `media` : c'est
                    la source attrape-tout, celle qui reste quand la colonne
                    ne s'applique pas. */}
                <source
                  type="image/avif"
                  srcSet={jeuSources(plateauLarge, "avif")}
                  sizes={TAILLES_SCENE}
                />
                <source
                  type="image/webp"
                  srcSet={jeuSources(plateauLarge, "webp")}
                  sizes={TAILLES_SCENE}
                />

                {/* Le JPEG de la bande large ferme la chaîne : aucun
                    navigateur ne reste sans image. `width`/`height` sont
                    ceux de sa plus grande dérivée — ils posent le rapport de
                    forme intrinsèque avant le décodage, et `--ratio` pose
                    celui de la boîte : à aucun moment la page ne saute.

                    C'est l'image LCP de l'accueil : `fetchpriority="high"`
                    la sort de la file d'attente basse où le navigateur range
                    les images, et `loading="eager"` interdit tout report.
                    `decoding="async"` rend la main au fil principal pendant
                    le décodage — il ne retarde pas la peinture, il évite de
                    bloquer le reste.

                    L'alt vient de `visuels.ts` par `heroPhoto` : il n'est ni
                    réécrit, ni complété, ni traduit ici. */}
                <img
                  src={heroPhoto.src}
                  srcSet={jeuSources(plateauLarge, "jpg")}
                  sizes={TAILLES_SCENE}
                  alt={heroPhoto.alt}
                  width={repli(plateauLarge).l}
                  height={repli(plateauLarge).h}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </picture>

              {/* La seule chose posée sur la photo : une plaque mono d'une
                  cinquantaine de signes, sur la lisière que le voile latéral
                  raccorde au panneau. Aucun titre, aucun paragraphe, aucun
                  bouton — premier interdit d'A1.2. */}
              <p className="legende legende--bg">{accueil.hero.legendePhoto}</p>
            </>
          ) : (
            <PanneauMatiere variante="plateau" />
          )}
        </div>
      </header>

      {/* ══════════════════ 2 · LE PLAN AU SOL — A1.3 ══════════════════ */}
      <PlanAuSol />

      {/* ══════════════════ 3 · 01 — LA FORMATION ══════════════════ */}
      <section className="bande" id="b-formation">
        <div className="wrap">
          <div className="tete" data-rv>
            <p className="eyebrow">{formation.surtitre}</p>
            <h2 className="h2">{formation.titre}</h2>
            <p className="lede">{formation.lede}</p>
          </div>

          {/* ── Le module ouvert aujourd'hui ── */}
          <h3 className="h3 sous" data-rv>{formation.sousTitreModules}</h3>
          <p className="corps-s t-secondaire" data-rv>{formation.introModules}</p>

          {/* `mt-[var(--sp-8)]` et non `mt-8` : l'échelle numérique de
              Tailwind diverge de celle de la charte à partir du rang 7 —
              Tailwind 8 rend 32 px, `--sp-8` en vaut 40. La trame de 4 du
              § 0.13 ne se lit que dans les jetons. */}
          <div className="notice mt-[var(--sp-8)]" data-rv>
            <div className="notice__g pilier-email">
              <p className="code-arc">{module01.chapo}</p>
              <h3 className="notice__t h3">
                {module01.titre}
                <em>{module01.sousTitre}</em>
              </h3>
              <p className="notice__d">{module01.resume}</p>

              {/* Les outils du module : chaque puce est un `.jeton`, une
                  entrée de nomenclature. La notice de `/formation` porte, elle,
                  les DISPOSITIFS — c'est intentionnel, on n'uniformise pas. */}
              <div className="notice__m">
                {module01.outils.map((outil) => (
                  <span className="jeton" key={outil}>
                    {outil}
                  </span>
                ))}
              </div>

              <div className="hero__b">
                <Link className="btn" to={routes.module01}>
                  {formation.ctaModule}{" "}
                  <span className="btn__f" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* La scène de la notice est une BANDE dans les deux états :
                colonne .95fr au-dessus de paillasse, `--ar-scene` (16:9) en
                dessous. Un seul cadrage suffit donc ici — `plateauLarge` —
                et il n'y a rien à arbitrer entre deux formes.

                `contents` sur le `<picture>` : `.notice__v` n'a pas la règle
                que `.hero__v` porte, et sans elle la boîte en ligne du
                `<picture>` s'intercalerait entre la scène et son image, qui
                perdrait son `block-size: 100%`. C'est de la mise en page
                locale d'une page, donc un utilitaire (§ 0.21).

                `loading="lazy"` : la notice est sous la ligne de flottaison
                sur tous les gabarits. */}
            {/* ── LA NOTICE NE SERT PAS LA MÊME PHOTO QUE LE HÉROS ────────
                Elle le faisait, et c'était le défaut le plus visible de la
                page : le plateau paraissait DEUX FOIS sur l'accueil, à un
                écran d'intervalle, avec le même texte de remplacement mot
                pour mot. Un lecteur d'écran annonçait deux fois la même
                phrase de 106 signes pour deux images qui n'en sont qu'une,
                et l'œil lisait du remplissage là où il devait lire une
                notice.

                La notice porte le MODULE 01. L'image qui le montre est le
                plan de face — le narrateur derrière la paillasse, un carnet
                ouvert devant lui — et c'est exactement celle que
                `/formation` sert déjà dans SA notice, pour ce même module.
                Les deux pages disent donc la même chose avec la même image,
                ce qui est la définition d'une notice.

                Le plateau reste ce qu'il est : le héros de la page, servi
                une fois, et l'affiche du lecteur vidéo trois blocs plus bas.

                `--cadrage` : le narrateur, `30% 34%` (§ 7.13.1, « cale le
                visage, pas le buste »), et non le défaut de `.notice__v img`
                qui vise le plateau. */}
            <div
              className="notice__v"
              style={
                {
                  "--cadrage": "30% 34%",
                  "--aplat": narrateurPlanDeFace.aplat,
                } as CSSProperties
              }
            >
              {heroPhoto ? (
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
                  <img
                    src={chemin(narrateurPlanDeFace, secours(narrateurPlanDeFace), "jpg")}
                    srcSet={jeuSources(narrateurPlanDeFace, "jpg")}
                    sizes={TAILLES_NOTICE}
                    alt={narrateurPlanDeFace.alt}
                    width={repli(narrateurPlanDeFace).l}
                    height={repli(narrateurPlanDeFace).h}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              ) : (
                <PanneauMatiere variante="scene" />
              )}
            </div>
          </div>

          {/* ── La preuve, avant la promesse ──
              Le bloc `.atelier` est fait pour accueillir le portrait : la
              colonne d'image (`.atelier__p`), sa signature en pied
              (`.legende--pied`, que la section 17 de `30-composants.css`
              nomme explicitement), et le texte à côté.

              § 0.38 — LE STATUT DU NARRATEUR N'EST PAS TRANCHÉ. Est-il le
              Professeur Chen, ou l'archiviste qui tient ses Archives ? Tant
              que la question n'est pas arbitrée, l'alt de `visuels.ts` dit
              ce qu'on voit et rien de plus : il ne nomme PERSONNE, et il
              n'est pas réécrit ici pour le faire. La signature en pied dit
              « Le narrateur · Les Archives », ce qui est exactement le
              statut ouvert, et pas un nom.

              Sans portrait publiable, le split n'a plus qu'une colonne : on
              retire la colonne d'image plutôt que d'y poser une plaque et la
              signature « Le narrateur », qui nommerait un absent. */}
          <h3 className="h3 sous" data-rv>{formation.atelier.titre}</h3>
          {portraitPhoto ? (
            <div className="atelier split" data-rv>
              <div
                className="atelier__p"
                style={{ "--aplat": narrateurPortrait.aplat } as CSSProperties}
              >
                {/* Carré (`--ar-portrait`), quatre dérivées de 320 à 960.
                    `contents` pour la même raison que la notice :
                    `.atelier__p img` attend l'image en enfant direct.
                    `loading="lazy"` — le bloc est loin sous la ligne de
                    flottaison, il ne dispute rien au LCP du hero. */}
                <picture className="contents">
                  <source
                    type="image/avif"
                    srcSet={jeuSources(narrateurPortrait, "avif")}
                    sizes={TAILLES_PORTRAIT}
                  />
                  <source
                    type="image/webp"
                    srcSet={jeuSources(narrateurPortrait, "webp")}
                    sizes={TAILLES_PORTRAIT}
                  />
                  <img
                    src={portraitPhoto.src}
                    srcSet={jeuSources(narrateurPortrait, "jpg")}
                    sizes={TAILLES_PORTRAIT}
                    alt={portraitPhoto.alt}
                    width={repli(narrateurPortrait).l}
                    height={repli(narrateurPortrait).h}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <p className="legende legende--pied">{formation.atelier.signature}</p>
              </div>
              <div>
                {formation.atelier.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="atelier" data-rv>
              {formation.atelier.paragraphes.map((paragraphe) => (
                <p key={paragraphe}>{paragraphe}</p>
              ))}
            </div>
          )}

          {/* ── Trois paliers, une progression ──
              L'ancre `#b-paliers` est portée par le titre, pas par une
              section : c'est là que mène le premier bouton du hero. */}
          <h3 className="h3 sous" data-rv id="b-paliers">
            {blocPaliers.titre}
          </h3>
          <p className="corps-s t-secondaire" data-rv>{blocPaliers.ledeAccueil}</p>

          {/* L'aveu, dit AVANT l'abonnement et pas après. */}
          <div className="encart mt-6" data-rv>
            <div className="encart__t">{encartProduction.accueil.titre}</div>
            <p className="corps-s">{encartProduction.accueil.texte}</p>
          </div>

          <div className="paliers paliers--home" data-rv>
            {paliersPayants.map((cle) => {
              const palier = paliers[cle];
              return (
                <article
                  key={palier.code}
                  className={`palier palier--0${palier.rang}`}
                  data-mise={palier.phare ? "recommande" : undefined}
                >
                  <div className={PLAQUE[palier.rang]}>
                    <Ecusson rang={palier.rang} />
                    <div>
                      <div className="palier__code">{palier.code}</div>
                      {/* Le nom du palier est un TITRE de rang 4 : sous le
                          `h3` « Trois paliers », il donne à chaque carte une
                          entrée dans le plan de titres du lecteur d'écran.
                          La maquette en faisait un `div`, et les trois cartes
                          n'étaient alors atteignables que ligne à ligne. */}
                      <h4 className="palier__n">{palier.nom}</h4>
                    </div>
                  </div>

                  <div className="palier__corps">
                    {/* SC 1.4.1 — LA COULEUR NE PEUT PAS ÊTRE LE SEUL
                        SIGNALEMENT. `data-mise="recommande"` n'épaissit et ne
                        recolore que le filet ; 32-membre.css § « le seul
                        signalement autorisé » déclare l'étiquette `.mention`
                        OBLIGATOIRE à côté de lui, et `CartePalier` — l'autre
                        rendu du même composant, sur /formation — la rend
                        déjà. Deux cartes du même composant ne peuvent pas
                        diverger : le mot est écrit ici aussi. */}
                    {palier.phare && <span className="mention self-start">Recommandé</span>}

                    <div className="palier__prix">
                      {palier.prix}
                      <span>{palier.periodicite}</span>
                    </div>
                    <p className="palier__acc">{palier.accroche}</p>
                    {/* L'accueil emploie le résumé court ; la version longue
                        est réservée à la page des paliers. */}
                    <p className="palier__court">{palier.court_texte}</p>

                    <div className="palier__pied">
                      <a
                        className={
                          palier.phare ? "btn btn--bloc" : "btn btn--fantome btn--bloc"
                        }
                        href={patreon.url}
                        target="_blank"
                        rel="noopener"
                      >
                        {blocPaliers.ctaCarte}
                        <span className="sr-only"> (nouvel onglet)</span>{" "}
                        <span className="btn__f" aria-hidden="true">→</span>
                      </a>
                      <Link className="meta text-center" to={routes.paliers}>
                        {blocPaliers.ctaComparer}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hero__b" data-rv>
            <Link className="btn" to={routes.paliers}>
              {blocPaliers.ctaComparer}{" "}
              <span className="btn__f" aria-hidden="true">→</span>
            </Link>
            <span className="meta self-center">{patreon.mentionEngagement}</span>
          </div>
        </div>
      </section>

      {/* ══════════════════ 4 · 02 — LE SERVEUR ══════════════════
          `.acier` est la classe de CONTEXTE : elle bascule `--texte`,
          `--accent`, `--bordure`, `--focus` et `--surface-carte` d'un seul
          coup. Les onze `style=""` que la maquette écrivait dans ce bloc
          étaient des rustines pour compenser son absence : aucun ne survit,
          et les composants basculent seuls. */}
      <section className="bande acier mat-acier" id="b-minecraft">
        <div className="wrap">
          <div className="tete" data-rv>
            <p className="eyebrow">{minecraft.surtitre}</p>
            <h2 className="h2">{minecraft.titre}</h2>
            <p className="lede">{minecraft.lede}</p>
          </div>

          <div className="serveur" data-rv>
            <span className="serveur__libelle">{minecraft.labelAdresse}</span>
            <code className="serveur__adresse">{minecraft.ip}</code>
            <span className="meta">{minecraft.releve}</span>
            <EtatServeur />
          </div>

          {/* Même correction qu'au bloc 01 : `--sp-8` vaut 40 px, `mt-8` 32. */}
          <div className="cartes mt-[var(--sp-8)]" data-rv>
            {minecraft.cartes.map((carte) => (
              <div className="carte" key={carte.titre}>
                <h3 className="carte-titre">{carte.titre}</h3>
                <p className="carte__d mt-2">{carte.texte}</p>
              </div>
            ))}
          </div>

          <div className="hero__b" data-rv>
            <Link className="btn" to={routes.minecraft}>
              Voir l’adresse du serveur{" "}
              <span className="btn__f" aria-hidden="true">→</span>
            </Link>
            <a
              className="btn btn--fantome"
              href={discord.inviteUrl}
              target="_blank"
              rel="noopener"
            >
              Ouvrir l’invitation Discord
              <span className="sr-only"> (nouvel onglet)</span>{" "}
              <span className="btn__f" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════ 5 · 03 — LES RÉSEAUX ══════════════════ */}
      <section className="bande bande--teinte" id="b-reseaux">
        <div className="wrap">
          <div className="tete" data-rv>
            <p className="eyebrow">{blocReseaux.surtitre}</p>
            <h2 className="h2">{blocReseaux.titre}</h2>
            <p className="lede">{blocReseaux.lede}</p>
          </div>

          <div className="reseaux" data-rv>
            {reseauxOrdre.map((cle) => {
              const reseau = reseaux[cle];
              return (
                <a
                  className="reseau"
                  key={cle}
                  href={reseau.url}
                  target="_blank"
                  rel="noopener"
                >
                  <LogoReseau reseau={cle} />
                  <div>
                    <div className="reseau__n">{reseau.label}</div>
                    <div className="reseau__h">{reseau.handle}</div>
                    <div className="reseau__d">{reseau.description}</div>
                    <span className="sr-only"> (nouvel onglet)</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ 6 · 04 — ME JOINDRE ══════════════════ */}
      <section className="bande" id="b-contact">
        <div className="wrap split">
          <div data-rv>
            <p className="eyebrow">{accueil.contact.surtitre}</p>
            <h2 className="h2">{accueil.contact.titre}</h2>
            <p className="lede">{accueil.contact.lede}</p>

            <ul className="liste mt-6">
              {contact.motifs.map((motif) => (
                <li key={motif}>
                  <Icone nom="coche" taille={20} ton="action" />
                  <span>{motif}</span>
                </li>
              ))}
            </ul>

            <div className="hero__b">
              <Link className="btn" to={routes.contact}>
                {contact.ctaEcrire}{" "}
                <span className="btn__f" aria-hidden="true">→</span>
              </Link>
              <a
                className="btn btn--fantome"
                href={discord.inviteUrl}
                target="_blank"
                rel="noopener"
              >
                {contact.ctaDiscord}
                <span className="sr-only"> (nouvel onglet)</span>{" "}
                <span className="btn__f" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div data-rv>
            <div className="carte">
              {contact.cartes.map((carte, rang) => (
                <Fragment key={carte.titre}>
                  {rang > 0 && (
                    <hr className="my-5 h-px border-0 bg-[var(--bordure)]" />
                  )}
                  <h3 className="carte-titre">{carte.titre}</h3>
                  <p className="carte__d mt-2">{carte.texte}</p>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
