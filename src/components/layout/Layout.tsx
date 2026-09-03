import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

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

export default function Layout() {
  const { pathname } = useLocation();
  const principal = useRef<HTMLElement>(null);
  const dernierChemin = useRef(pathname);
  const [annonce, setAnnonce] = useState("");

  useEffect(() => {
    // Le garde compare les chemins plutôt que de compter les passages :
    // `StrictMode` déclenche deux fois l'effet de montage en développement,
    // et un simple drapeau « premier passage » laisserait donc filer le
    // second. Ici, tant que le chemin n'a pas changé, il ne se passe rien.
    if (dernierChemin.current === pathname) return;
    dernierChemin.current = pathname;

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    principal.current?.focus({ preventScroll: true });
    setAnnonce(document.title);
  }, [pathname]);

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
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
