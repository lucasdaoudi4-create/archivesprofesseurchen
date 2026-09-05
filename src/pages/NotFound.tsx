import { useEffect } from "react";
import { Link } from "react-router-dom";
import { discord, meta, planAuSol, routes, site } from "../data/site";
import {
  TAILLES_PLANCHE_404,
  chemin,
  jeuSources,
  narrateurPlanDeFace,
  repli,
  secours,
} from "../data/visuels";
import Embleme from "../components/brand/Embleme";

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE INTROUVABLE — `/404` et `path="*"` · gabarit `.syspage`
   ARC · CMP — 48 · 08-composants-addendum § B-27
   Les Archives du Professeur Chen — charte v1.0.0

   La page bascule sur le gabarit de page système, variante `.e404` : fond
   clair, panneau à gauche, planche de décor à droite. C'est le gabarit que
   B-27 écrit pour « les pages qu'on ne conçoit jamais et qui sont vues tous
   les jours ».

   ── L'ANATOMIE, DANS SON ORDRE ────────────────────────────────────────────

     .syspage.e404
       .sp-panel.pilier-email   emblème · .code-arc · .sp-code · h1 · p
                                · .sp-acts · .sp-help
       .sp-aside                la planche de décor

   Trois recalages, tous actés par `30-composants.css` §25 et repris ici :
   `.cat` de B-27 EST `.code-arc` ; l'emblème de 56 px n'appartient à aucune
   échelle et devient `.emb--52` (le pas voisin de la série 20 · 28 · 36 ·
   44 · 52 · 62 · 80) ; le `h1` en `clamp(28px, 3.6vw, 40px)` devient
   `<h1 class="h2">`, le palier typographique qui le contient.

   ── CE QUE LE GABARIT REMPLACE ────────────────────────────────────────────

   L'ancienne page composait `.bande` `.wrap--etroit` `.tete` faute de
   gabarit déclaré. `.syspage` existe désormais, avec sa hauteur
   (`calc(100vh - var(--h-nav))`) : la page n'a plus à emprunter un rythme
   de bande pour empêcher le pied de remonter au milieu de l'écran.

   La liste des quatre zones en `.liste` disparaît avec elle. Le gabarit
   n'a pas d'emplacement pour une liste, et il a raison : une page d'erreur
   explique et propose UNE sortie, elle ne redessine pas la navigation.
   Les quatre zones survivent là où B-27 les attend — dans `.sp-help`, en
   une ligne, lues depuis `planAuSol` et jamais recopiées.

   ── LES DEUX ACTIONS, ET LEUR COLLISION ───────────────────────────────────

   B-27 : « Deux actions maximum. La première est toujours la sortie la plus
   probable. » L'Amendement 1 §A1.3 pose par ailleurs que « le plan au sol
   EST la navigation de l'accueil ». Retour à l'accueil et plan au sol sont
   donc UNE seule destination, `routes.accueil` : deux boutons de même
   `href` seraient un doublon, et un `#plan` serait un lien mort — la
   coquille rappelle `window.scrollTo({top: 0})` à chaque changement de
   chemin (§0.28), ce qui annule l'ancre. La première action nomme donc les
   deux, la seconde ouvre l'autre sortie réelle du site, le Discord.
   Voir « À signaler ».

   ── LA PLANCHE EST DÉCORATIVE, ET ELLE LE DIT ─────────────────────────────

   `narrateurPlanDeFace`, en `<picture>`, `loading="lazy"`, `alt=""`, et
   `aria-hidden` sur le conteneur : elle ne porte aucune information que la
   phrase ne porte déjà. C'est ce qui autorise `30-composants.css` §27 à la
   masquer entièrement sous paillasse(980) sans rien retirer à la page —
   et ce qui fait que son chargement paresseux ne coûte rien sur téléphone,
   où `display: none` empêche la requête.

   Le chemin du fichier n'est pas composé ici : `chemin()`, `jeuSources()`
   et `repli()` de `src/data/visuels.ts` sont le seul accès aux dérivées.

   ── LE FOCUS ET LE TITRE ──────────────────────────────────────────────────

   B-27 veut un `h1` en `tabindex="-1"` recevant le focus au montage. Il
   porte bien `tabIndex={-1}` — le gabarit l'exige et la feuille le
   documente —, mais la page ne le SAISIT pas : `Layout` déplace déjà le
   focus sur `<main>` à chaque changement de route (§0.28) et annonce le
   titre. Deux saisies de focus dans le même rendu se voleraient l'une
   l'autre, et celle de la coquille est la meilleure : elle place le lecteur
   au-dessus du contenu entier, pas au milieu.

   Titre et `noindex` restent posés par la page, EN AMONT de la coquille :
   les effets d'un enfant s'exécutent avant ceux de son parent, donc quand
   `Layout` lit `document.title` pour l'annoncer, la ligne est déjà passée.
   `/404` est la seule page publique non indexée du site.

   RESTE OUVERT, HORS DE CE FICHIER : `netlify.toml` sert `/* → /index.html`
   en `status = 200`. Toute URL inconnue répond donc HTTP 200 avec cette
   page — un « soft 404 » qui fait indexer des pages fantômes malgré le
   `noindex` ci-dessous. La correction est une règle de redirection, pas une
   ligne de React (B-27, « CORRECTION technique »).
   ═══════════════════════════════════════════════════════════════════════════ */

/* La planche occupe la moitié de la fenêtre au-dessus de paillasse(980) et
   n'est pas servie en dessous. La phrase vit avec les dérivées qu'elle
   sert, dans `src/data/visuels.ts`, sous le nom `TAILLES_PLANCHE_404`. */

export default function NotFound() {
  useEffect(() => {
    document.title = `${meta.introuvable.titre} · ${site.name}`;

    // `meta.introuvable.indexee === false` — la seule page du site public
    // dans ce cas. La balise est posée à l'entrée et retirée à la sortie :
    // aucune autre route ne doit hériter du `noindex`.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      robots.remove();
    };
  }, []);

  return (
    <section className="syspage e404">
      <div className="sp-panel pilier-email">
        {/* Sans `titre` : l'emblème est décoratif, le nom de la marque est
            déjà écrit dans la barre de navigation et le titre porte
            l'information (§14.1). */}
        <Embleme taille={52} />

        <p className="code-arc">ARC&nbsp;·&nbsp;SYS&nbsp;—&nbsp;404</p>

        {/* Le chiffre est DÉCORATIF et posé derrière le titre. Sans
            `aria-hidden`, le lecteur d'écran annoncerait « quatre cent
            quatre » avant la phrase qui, elle, explique.

            `<div>` ET NON `<p>`, pour deux raisons qui vont dans le même
            sens. La première est sémantique : un glyphe retiré de l'arbre
            d'accessibilité n'est pas un paragraphe de prose. La seconde est
            mesurée dans le navigateur — `30-composants.css` déclare

                .syspage p { color: var(--texte-secondaire) }   (0,1,1)
                .sp-code   { color: var(--surface-3) }          (0,1,0)

            et la première l'emporte à spécificité égale de couche. Sur un
            `<p>`, le filigrane sort à #3A4145 au lieu de #DCE0E2 : un 404
            de 88 px en gris d'encre, par-dessus l'emblème, là où le gabarit
            veut une ombre pâle. Le `<div>` échappe au sélecteur d'élément
            et rend la couleur que `.sp-code` demande. Voir « À signaler » —
            la collision touche aussi `.sp-help`, et elle se corrige dans la
            feuille, pas ici. */}
        <div className="sp-code" aria-hidden="true">
          404
        </div>

        <h1 className="h2" tabIndex={-1}>
          Cette fiche n’est pas au catalogue.
        </h1>

        <p>
          L’adresse ne correspond à aucune page. Elle a peut-être été
          renommée.
        </p>

        <div className="sp-acts">
          <Link className="btn" to={routes.accueil}>
            Revenir au plan au sol{" "}
            <span className="btn__f" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            className="btn btn--fantome"
            href={discord.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Passer par le Discord
            <span className="sr-only"> (nouvel onglet)</span>{" "}
            <span className="btn__f" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        {/* Les quatre zones, lues depuis `planAuSol` : si une zone change de
            libellé ou si une cinquième apparaît, cette ligne suit. */}
        <p className="sp-help">
          {planAuSol.titre} —{" "}
          {planAuSol.zones.map((zone) => zone.libelle).join(" · ")}
        </p>
      </div>

      <div className="sp-aside" aria-hidden="true">
        {/* `contents` : la feuille écrit `.sp-aside img{block-size:100%}`, et
            ce pourcentage se résout contre le parent de BOÎTE. Un
            `<picture>` en ligne, de hauteur automatique, couperait la chaîne
            et la planche retomberait à sa hauteur intrinsèque.
            `display: contents` le retire de l'arbre de boîtes : l'image
            redevient enfant direct de `.sp-aside`. */}
        <picture className="contents">
          <source
            type="image/avif"
            srcSet={jeuSources(narrateurPlanDeFace, "avif")}
            sizes={TAILLES_PLANCHE_404}
          />
          <source
            type="image/webp"
            srcSet={jeuSources(narrateurPlanDeFace, "webp")}
            sizes={TAILLES_PLANCHE_404}
          />
          <img
            src={chemin(narrateurPlanDeFace, secours(narrateurPlanDeFace), "jpg")}
            srcSet={jeuSources(narrateurPlanDeFace, "jpg")}
            sizes={TAILLES_PLANCHE_404}
            width={repli(narrateurPlanDeFace).l}
            height={repli(narrateurPlanDeFace).h}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
