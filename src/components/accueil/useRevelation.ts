import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RÉVÉLATION AU DÉFILEMENT — `.rv` · 04-tokens-motion.css
   Les Archives du Professeur Chen — charte v1.0.0

   La feuille pose l'état masqué (`.rv`) et l'état révélé (`.rv.on`) ; c'est
   au JavaScript de faire passer de l'un à l'autre. Trois points, tous tenus
   par le patron de la maquette validée (l. 1425-1435) :

     1. SEUIL 0,12 — un bloc se révèle quand un huitième de sa hauteur est
        entré dans le cadre, pas quand son premier pixel affleure.
     2. CE QUI EST DÉJÀ DANS LE CADRE SE RÉVÈLE TOUT DE SUITE. C'est gratuit :
        `IntersectionObserver` déclenche son rappel une première fois dès
        `observe()`, pour l'état courant. Sans ce comportement, une page plus
        courte que la fenêtre resterait invisible.
     3. ON N'OBSERVE PLUS CE QUI EST RÉVÉLÉ — `unobserve` par élément, et
        `disconnect` au démontage de la route.

   Le repli sans `IntersectionObserver` révèle tout immédiatement : le socle
   veut que le contenu soit lisible, l'animation n'est qu'un supplément.
   Rien à écrire ici pour `prefers-reduced-motion` : `99-preferences.css`
   remet déjà `.rv` à `opacity:1`.
   ═══════════════════════════════════════════════════════════════════════════ */

const SEUIL = 0.12;

export function useRevelation(): void {
  useEffect(() => {
    const cibles = Array.from(
      document.querySelectorAll<HTMLElement>(".rv:not(.on)"),
    );
    if (cibles.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      for (const cible of cibles) cible.classList.add("on");
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          entree.target.classList.add("on");
          observateur.unobserve(entree.target);
        }
      },
      { threshold: SEUIL },
    );

    for (const cible of cibles) observateur.observe(cible);
    return () => observateur.disconnect();
  }, []);
}
