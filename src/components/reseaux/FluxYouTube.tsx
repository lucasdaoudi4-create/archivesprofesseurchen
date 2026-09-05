import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { reseaux, routes, sas, site } from "../../data/site";
import {
  TAILLES_AFFICHE,
  chemin,
  jeuSources,
  plateauLarge,
  repli,
  secours,
} from "../../data/visuels";

/* ═══════════════════════════════════════════════════════════════════════════
   LE FIL DE LA CHAÎNE — `.player` · ARC · CMP — 46 · addendum 08 § B-25
   Les Archives du Professeur Chen — charte v1.0.0

   Ce composant portait déjà une façade de consentement, composée faute de
   mieux avec `.carte` et deux réglages Tailwind locaux : `src/styles/` ne
   déclarait alors ni `.player` ni aucune classe `.pl-*`. Elles existent
   désormais (30-composants.css §22) et la façade bascule sur l'anatomie
   normative. La note « ce n'est pas `.player` » de l'ancienne version est
   caduque : c'est `.player`.

   ── CE QUI EST PRÉSERVÉ, À LA LIGNE PRÈS ──────────────────────────────────

   1. RIEN NE PART AVANT LE CLIC (socle §0.32, B-25). L'`iframe` n'existe
      pas dans l'arbre tant que personne ne l'a demandée. L'affiche est
      servie DEPUIS NOTRE DOMAINE — jamais `i.ytimg.com`, qui rendrait la
      façade décorative et lui ferait perdre sa seule raison d'être.
   2. LE DOMAINE RESTE `youtube-nocookie.com` : c'est le seul `frame-src`
      que la politique de sécurité du §0.32 autorisera.
   3. LA PLAYLIST « ENVOIS » se déduit du `channelId` en remplaçant le
      préfixe `UC` par `UU`. C'est la seule mécanique du composant, elle
      ne change pas.
   4. `cc_load_policy=1&hl=fr` — sous-titres français à l'ouverture.
   5. PAS D'`autoplay`. B-25 l'autorise parce que « le clic sur la façade
      EST la demande de lecture » — mais ici le clic demande LE FIL, pas
      une vidéo précise. Ouvrir la playlist en lançant d'autorité sa
      première entrée serait une lecture que personne n'a demandée.
   6. LE FOCUS SUIT LE CADRE (B-25, ligne « Chargé ») : sans ce
      déplacement, la personne au clavier se retrouve AVANT le lecteur
      qu'elle vient d'ouvrir. L'`iframe` reste tabulable — le
      `tabindex="-1"` du patron la sortirait de l'ordre de tabulation une
      fois le focus reparti.

   ── L'ANATOMIE, ET LES DEUX ÉCARTS QU'ELLE IMPOSE ─────────────────────────

     figure.player
       .pl-facade   img.pl-poster · .pl-veil · button.pl-play · .pl-meta
                    · .pl-consent          → remplacée par l'iframe au clic
       figcaption.pl-caption

   `.pl-transcript` n'est pas rendu : il n'y a pas de transcription d'une
   playlist, et un accordéon vide serait la promesse d'un texte absent.

   `.pl-meta` est déclaré « titre + durée » par B-25. La durée n'est pas
   rendue : un fil de playlist n'en a pas, et aucune n'est relevée dans
   `site.ts`. Rien n'est inventé pour remplir un emplacement — §0.36. La
   feuille sert un `.pl-meta` à un seul enfant sans réglage particulier.

   L'`iframe` prend la PREMIÈRE des deux places que B-25 décrit : elle
   remplace `.pl-facade` et devient enfant direct de `.player`, où le
   sélecteur `.player > iframe` lui donne le ratio, le rayon et le fond de
   la scène. Aucun conteneur intermédiaire, donc aucun réglage local.

   ── LE NOM DU BOUTON DIT CE QU'IL FAIT ET CE QU'IL CHARGE ─────────────────

   « Lire », seul, ne dit rien de ce qu'un clic déclenche chez un tiers.
   Le nom accessible nomme les deux : l'action (charger le fil) et sa
   conséquence (le lecteur de YouTube, appelé depuis youtube-nocookie.com).
   Le triangle est `aria-hidden` — il ne porte aucun nom, il est le dessin
   du bouton.

   ── DEUX MANQUES DÉCLARÉS, PAS CONTOURNÉS ─────────────────────────────────

   · L'état « Chargement » de B-25 remplace le triangle par un `.skel`
     circulaire. `.skel` n'existe pas dans `src/styles/`, et le
     remplacement est de toute façon synchrone ici : il n'y a pas de
     fenêtre à habiller. La règle `.pl-play[aria-busy="true"]` de la
     feuille reste donc sans emploi dans ce composant.
   · Le triangle de lecture n'est pas dans la famille d'icônes : `NomIcone`
     de `components/ui/Icones.tsx` ne connaît que `coche`, `copier` et
     `lien-externe`. Le tracé est posé ici, sur la grille 24 et sous les
     classes `.ico .ico--32`, pour que l'épaisseur et la taille servies
     restent celles du chapitre 06 et non des valeurs locales.
     Voir « À signaler ».
   ═══════════════════════════════════════════════════════════════════════════ */

/* L'affiche occupe toute la largeur du `.wrap`. La phrase vit avec les
   dérivées qu'elle sert, dans `src/data/visuels.ts`. */

export default function FluxYouTube() {
  const chaine = reseaux.youtube;
  const [charge, setCharge] = useState(false);
  const cadre = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (charge) cadre.current?.focus();
  }, [charge]);

  // Aucun `channelId` relevé : pas de fil, et surtout pas de cadre vide.
  // L'addendum 08 §8.11.2 est explicite — « jamais un cadre 16:9 noir sans
  // explication ». La page garde ses quatre cartes, qui suffisent.
  if (!chaine.channelId) return null;

  const listeEnvois = "UU" + chaine.channelId.slice(2);
  const source =
    "https://www.youtube-nocookie.com/embed/videoseries" +
    `?list=${listeEnvois}&rel=0&modestbranding=1&cc_load_policy=1&hl=fr`;

  const titreFil = `Les dernières vidéos de la chaîne ${chaine.label}`;
  const titreCadre = `${titreFil} — ${site.name}`;
  const nomBouton =
    "Charger le fil des dernières vidéos — le lecteur de " +
    `${chaine.label} est alors appelé sur youtube-nocookie.com et reçoit ` +
    "votre adresse IP";

  return (
    <figure className="player">
      {charge ? (
        <iframe
          ref={cadre}
          src={source}
          title={titreCadre}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        // `--aplat` : la façade porte le plateau, elle attend donc sur l'aplat
        // du plateau (§ 7.13.5) et non sur le noir de scène.
        <div
          className="pl-facade"
          style={{ "--aplat": plateauLarge.aplat } as CSSProperties}
        >
          {/* `alt=""` : l'affiche est décorative, `.pl-meta` nomme le fil
              juste à côté. Le chemin n'est pas composé à la main —
              `src/data/visuels.ts` est le seul accès aux dérivées.

              `contents` sur le `<picture>` : la feuille écrit
              `.pl-poster{block-size:100%}`, et ce pourcentage se résout
              contre le PARENT DE BOÎTE. Un `<picture>` en ligne, de hauteur
              automatique, couperait la chaîne et l'affiche retomberait à sa
              hauteur intrinsèque. `display: contents` retire le wrapper de
              l'arbre de boîtes : l'image redevient enfant direct de
              `.pl-facade`, exactement ce que la feuille suppose. Mise en
              page locale, donc Tailwind (§0.21). */}
          <picture className="contents">
            <source
              type="image/avif"
              srcSet={jeuSources(plateauLarge, "avif")}
              sizes={TAILLES_AFFICHE}
            />
            <source
              type="image/webp"
              srcSet={jeuSources(plateauLarge, "webp")}
              sizes={TAILLES_AFFICHE}
            />
            <img
              className="pl-poster"
              src={chemin(plateauLarge, secours(plateauLarge), "jpg")}
              srcSet={jeuSources(plateauLarge, "jpg")}
              sizes={TAILLES_AFFICHE}
              width={repli(plateauLarge).l}
              height={repli(plateauLarge).h}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </picture>

          {/* Le voile. Il ne prend pas le pointeur : le bouton est dessous
              dans l'ordre du document, mais au-dessus dans la pile. */}
          <div className="pl-veil" />

          <button
            type="button"
            className="pl-play"
            aria-label={nomBouton}
            onClick={() => setCharge(true)}
          >
            {/* Le triangle, sur la grille 24 du chapitre 06. Fermé par un
                `Z` pour que les trois sommets prennent la jointure ronde
                de `.ico`. */}
            <svg className="ico ico--32" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 6.8 18 12l-9 5.2Z" />
            </svg>
          </button>

          <div className="pl-meta">
            <b>{titreFil}</b>
          </div>

          {/* Une phrase, et pas deux : la ligne de consentement est posée en
              bas de la scène, en mono, et doit tenir sans repousser le
              bouton de lecture sur une façade étroite. */}
          <p className="pl-consent">
            Rien n’est appelé avant votre clic&nbsp;: charger le fil ouvre le
            lecteur de {chaine.label} et lui transmet votre adresse IP.{" "}
            <Link to={routes.confidentialite}>{sas.lienDonnees}</Link>
          </p>
        </div>
      )}

      {/* La légende reste dans les deux états : c'est elle qui garde la
          sortie vers la chaîne une fois la façade remplacée, et qui dit
          d'où le fil est servi. Compose `.meta` — la fonte, la taille et
          la couleur du relevé viennent du chapitre 04. */}
      <figcaption className="pl-caption meta">
        Fil servi par {chaine.label}, sur youtube-nocookie.com.{" "}
        <a href={chaine.url} target="_blank" rel="noopener">
          Ouvrir la chaîne
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
      </figcaption>
    </figure>
  );
}
