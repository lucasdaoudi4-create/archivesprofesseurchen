import { useEffect, useRef, useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Attente from "./Attente";
import FrontiereErreur from "./FrontiereErreur";
import { cleDeRoute, titrePage } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LA COQUILLE — socle § 0.28 · Navigation applicative
   Les Archives du Professeur Chen — charte v1.0.0

   Le chapitre 09 traite le défilement au changement de route et ignore le
   focus. Le § 0.28 complète, et il est exécutoire. Il donne le patron ; ce
   fichier l'applique sans en dévier.

   ── LES QUATRE RÈGLES DU § 0.28 ───────────────────────────────────────────

   1. LE FOCUS PART SUR `<main tabindex="-1">`, jamais sur le `h1` — un
      lecteur d'écran relirait alors le titre deux fois : une fois parce
      qu'il vient de le recevoir en annonce, une fois parce qu'il a le
      focus.
   2. L'ANNONCE EST LE `document.title` de la page d'arrivée, en `polite`,
      jamais `assertive`. Le titre est posé par la page, EN AMONT : les
      effets d'un enfant s'exécutent avant ceux de son parent, donc quand
      cet effet-ci lit `document.title`, la page l'a déjà écrit.
   3. LE LIEN D'ÉVITEMENT reste le premier élément focusable de l'ordre de
      tabulation, et ne change jamais de cible. Il est donc écrit avant la
      barre, et pas dedans.
   4. LE RETOUR EN HAUT EST INSTANTANÉ, jamais en défilement doux — le
      `scroll-behavior:smooth` de `20-base.css` sert les ancres internes,
      pas les changements de route.

   ── TROIS POINTS DE MÉCANIQUE ─────────────────────────────────────────────

   LE PREMIER RENDU EST EXCLU. Le patron du § 0.28 accroche son effet à
   `[pathname]`, qui se déclenche aussi au MONTAGE. Deux défauts mesurables
   en découlent, et aucun des deux n'est ce que le § 0.28 décrit :

     · le focus part sur `<main>` dès l'arrivée sur le site. La tabulation
       suivante entre donc DANS le contenu, en sautant le lien d'évitement
       et toute la barre — soit exactement l'inverse de la règle 3 ;
     · `scrollTo(0)` annule l'ancre d'une URL profonde. Arriver sur
       `…/#b-formation` — les quatre ancres de l'accueil, que le hero et le
       plan au sol visent — ramènerait en haut de page.

   Le § 0.28 régit la navigation APPLICATIVE : le passage d'une route à une
   autre. À l'arrivée, le navigateur fait déjà le travail, et mieux. Les
   quatre règles sont donc tenues à la lettre sur les changements de route,
   et le montage est laissé tranquille.

   ── ET DEUX POINTS DE RENDU ───────────────────────────────────────────────

   `key={pathname}` remonte le `<main>` à chaque route : c'est ce qui
   redéclenche `.entree-page`, dont l'état final sous `prefers-reduced-motion`
   est déjà posé par `99-preferences.css`. Rien à traiter en JavaScript.

   `focus({ preventScroll: true })` : sans lui, le navigateur ferait défiler
   vers le `<main>` juste après qu'on soit remonté en haut, et le retour en
   haut serait annulé une image sur deux.

   ── CE QUI N'EST PAS ICI ──────────────────────────────────────────────────

   Aucun conteneur de mise en page — pas de `min-h-screen flex flex-col`.
   Le patron du § 0.28 est un fragment, et la maquette n'a pas davantage de
   conteneur : la barre est collante, la page pose son rythme, le pied
   ferme. Si une page courte devait laisser le pied au milieu de l'écran,
   c'est à la PAGE de porter sa hauteur — un socle vide de page introuvable
   en est un (§ 0.27), pas une correction de la coquille.

   Aucune gestion de `<title>` non plus : le titre appartient à la page
   (§ 0.29). La coquille ne fait que le LIRE pour l'annoncer.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Au-delà, on renonce à viser l'ancre : le visiteur a commencé à lire, et
 *  un défilement surprise serait pire que pas de défilement. */
const ECHEANCE_ANCRE = 2000;

export default function Layout() {
  const { pathname, hash, key } = useLocation();
  const principal = useRef<HTMLElement>(null);
  const dernierChemin = useRef(pathname);
  const [annonce, setAnnonce] = useState("");

  useEffect(() => {
    const changeDeRoute = dernierChemin.current !== pathname;
    dernierChemin.current = pathname;

    /* ── ANCRE CIBLÉE (`/formation#sommaire`) ────────────────────────────
       Sur une navigation applicative, le navigateur ne défile pas tout seul :
       le routeur pousse l'URL sans charger de document. On vise donc la cible
       nous-mêmes. Au montage (arrivée directe par l'URL), le navigateur a
       déjà fait ce travail.

       IL A FALLU ATTENDRE PLUS D'UNE IMAGE. Ce code ne regardait qu'une fois,
       à l'image suivante, et cela suffisait tant que la page d'arrivée était
       montée en même temps que l'URL changeait. Depuis que les routes sont
       paresseuses, elle ne l'est plus : le morceau arrive par une promesse,
       donc APRÈS l'image. `getElementById` rendait `null`, la fonction
       repartait, et le visiteur restait en haut d'une page dont il avait
       demandé le milieu — mesuré au navigateur : cible à 1158 px, défilement
       à 0. Le focus ne partait nulle part non plus, ce qui casse le § 0.28
       pour qui navigue au clavier.

       On regarde donc à chaque image jusqu'à ce que la cible existe, avec une
       échéance. `ECHEANCE_ANCRE` n'est pas une durée de chargement : c'est le
       moment où l'on renonce, parce qu'au-delà le visiteur a commencé à lire
       et qu'un défilement surprise serait pire que pas de défilement du tout.
       Une ancre qui n'existe pas (`#nimporte-quoi`) tombe dans le même cas et
       ne coûte que quelques images.                                          */
    if (hash && key !== "default") {
      const id = decodeURIComponent(hash.slice(1));
      const echeance = performance.now() + ECHEANCE_ANCRE;
      let image = 0;

      const viser = () => {
        const cible = document.getElementById(id);
        if (!cible) {
          if (performance.now() < echeance) image = requestAnimationFrame(viser);
          return;
        }
        cible.scrollIntoView({ block: "start" });
        if (!cible.hasAttribute("tabindex")) cible.setAttribute("tabindex", "-1");
        cible.focus({ preventScroll: true });
      };

      image = requestAnimationFrame(viser);
      if (changeDeRoute) setAnnonce(titrePage(cleDeRoute(pathname)));
      return () => cancelAnimationFrame(image);
    }

    if (!changeDeRoute) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    principal.current?.focus({ preventScroll: true });
    /* ── CE QUI EST ANNONCÉ, ET POURQUOI PAS `document.title` ────────────
       Cette ligne lisait `document.title`, en comptant sur une règle
       d'ordonnancement de React : les effets d'un enfant s'exécutent avant
       ceux de son parent, donc la page avait posé son titre quand la
       coquille venait le lire (§ 0.28, règle 2).

       CETTE RÈGLE NE TIENT PLUS DEPUIS QUE LES ROUTES SONT PARESSEUSES. Le
       temps que le morceau de la page arrive, c'est la surface d'attente qui
       est montée, pas la page : `document.title` porte encore le titre de la
       page qu'on QUITTE, et c'est lui qui serait annoncé au lecteur d'écran.

       Le titre est donc déduit du chemin, par la même table que le reste du
       site. Il ne dépend plus de ce qui est monté, ni de quand.               */
    setAnnonce(titrePage(cleDeRoute(pathname)));
  }, [pathname, hash, key]);

  return (
    <>
      <a className="evitement" href="#principal">
        Aller au contenu
      </a>

      <Navbar />

      <p className="sr-only" role="status" aria-live="polite">
        {annonce}
      </p>

      <main
        id="principal"
        ref={principal}
        tabIndex={-1}
        key={pathname}
        className="entree-page"
      >
        {/* La frontière d'attente est ICI, et pas plus haut : la barre de
            navigation, la région d'annonce et le pied de page restent montés
            pendant qu'arrive le morceau d'une page paresseuse. Les englober
            ferait clignoter tout le document à chaque navigation.

            `key={pathname}` est sur `<main>`, donc l'animation d'entrée
            rejoue quand la page arrive, pas quand l'attente se monte. */}
        {/* LA FRONTIÈRE ENVELOPPE L'ATTENTE, et pas l'inverse : c'est le
            chargement du morceau qui peut échouer, donc l'échec naît SOUS
            le `Suspense`. Une frontière posée à l'intérieur ne le verrait
            jamais passer.

            `key={pathname}` la réinitialise à chaque changement de route :
            une frontière n'oublie pas son erreur toute seule, et sans cette
            clé l'échec d'une page resterait affiché sur la suivante. */}
        <FrontiereErreur key={pathname}>
          <Suspense fallback={<Attente />}>
            <Outlet />
          </Suspense>
        </FrontiereErreur>
      </main>

      <Footer />
    </>
  );
}
