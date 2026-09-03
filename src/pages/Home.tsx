import { Fragment, useEffect } from "react";
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
import PlanAuSol from "../components/accueil/PlanAuSol";
import PanneauMatiere from "../components/accueil/PanneauMatiere";
import EtatServeur from "../components/accueil/EtatServeur";
import { Coche, Ecusson, LogoReseau } from "../components/accueil/Glyphes";
import { useRevelation } from "../components/accueil/useRevelation";

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

   ── LA PHOTO N'EST PAS PUBLIABLE, ET LA PAGE LE SAIT ──────────────────────

   `heroPhoto` et `portraitPhoto` valent `null` dans `src/data/site.ts` : la
   validation juridique de l'enseigne du décor n'est pas rendue (07-imagerie
   § 7.14). La page ne fabrique donc AUCUN repli d'image — elle compose la
   scène avec les matières du système (`PanneauMatiere`), sans enseigne
   redessinée et sans légende, puisqu'une légende nomme un sujet photographié.
   Le jour où la photo arrive, les deux branches `heroPhoto ? … : …` basculent
   toutes seules : rien d'autre n'est à toucher.

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

        {/* La scène. Rien d'autre que l'image et sa plaque n'entre ici. */}
        <div className="hero__v">
          {heroPhoto ? (
            <>
              <img
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fetchPriority="high"
                decoding="async"
              />
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
          <div className="tete rv">
            <p className="eyebrow">{formation.surtitre}</p>
            <h2 className="h2">{formation.titre}</h2>
            <p className="lede">{formation.lede}</p>
          </div>

          {/* ── Le module ouvert aujourd'hui ── */}
          <h3 className="h3 sous rv">{formation.sousTitreModules}</h3>
          <p className="corps-s t-secondaire rv">{formation.introModules}</p>

          <div className="notice rv mt-8">
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

            <div className="notice__v">
              {heroPhoto ? (
                <img src={heroPhoto.src} alt={heroPhoto.alt} loading="lazy" decoding="async" />
              ) : (
                <PanneauMatiere variante="scene" />
              )}
            </div>
          </div>

          {/* ── La preuve, avant la promesse ──
              Sans portrait publiable, le split n'a plus qu'une colonne : on
              retire la colonne d'image plutôt que d'y poser une plaque et la
              signature « Le narrateur », qui nommerait un absent. */}
          <h3 className="h3 sous rv">{formation.atelier.titre}</h3>
          {portraitPhoto ? (
            <div className="atelier split rv">
              <div className="atelier__p">
                <img
                  src={portraitPhoto.src}
                  alt={portraitPhoto.alt}
                  loading="lazy"
                  decoding="async"
                />
                <p className="legende legende--pied">{formation.atelier.signature}</p>
              </div>
              <div>
                {formation.atelier.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="atelier rv">
              {formation.atelier.paragraphes.map((paragraphe) => (
                <p key={paragraphe}>{paragraphe}</p>
              ))}
            </div>
          )}

          {/* ── Trois paliers, une progression ──
              L'ancre `#b-paliers` est portée par le titre, pas par une
              section : c'est là que mène le premier bouton du hero. */}
          <h3 className="h3 sous rv" id="b-paliers">
            {blocPaliers.titre}
          </h3>
          <p className="corps-s t-secondaire rv">{blocPaliers.ledeAccueil}</p>

          {/* L'aveu, dit AVANT l'abonnement et pas après. */}
          <div className="encart rv mt-6">
            <div className="encart__t">{encartProduction.accueil.titre}</div>
            <p className="corps-s">{encartProduction.accueil.texte}</p>
          </div>

          <div className="paliers paliers--home rv">
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

          <div className="hero__b rv">
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
          <div className="tete rv">
            <p className="eyebrow">{minecraft.surtitre}</p>
            <h2 className="h2">{minecraft.titre}</h2>
            <p className="lede">{minecraft.lede}</p>
          </div>

          <div className="serveur rv">
            <span className="serveur__libelle">{minecraft.labelAdresse}</span>
            <code className="serveur__adresse">{minecraft.ip}</code>
            <span className="meta">{minecraft.releve}</span>
            <EtatServeur />
          </div>

          <div className="cartes rv mt-8">
            {minecraft.cartes.map((carte) => (
              <div className="carte" key={carte.titre}>
                <h3 className="carte-titre">{carte.titre}</h3>
                <p className="carte__d mt-2">{carte.texte}</p>
              </div>
            ))}
          </div>

          <div className="hero__b rv">
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
          <div className="tete rv">
            <p className="eyebrow">{blocReseaux.surtitre}</p>
            <h2 className="h2">{blocReseaux.titre}</h2>
            <p className="lede">{blocReseaux.lede}</p>
          </div>

          <div className="reseaux rv">
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
          <div className="rv">
            <p className="eyebrow">{accueil.contact.surtitre}</p>
            <h2 className="h2">{accueil.contact.titre}</h2>
            <p className="lede">{accueil.contact.lede}</p>

            <ul className="liste mt-6">
              {contact.motifs.map((motif) => (
                <li key={motif}>
                  <Coche />
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

          <div className="rv">
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
