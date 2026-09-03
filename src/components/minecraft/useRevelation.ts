import { useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RÉVÉLATION AU DÉFILEMENT — pilote de `.rv` · 04-tokens-motion.css
   Les Archives du Professeur Chen — charte v1.0.0

   La feuille de mouvement pose la contrainte en une phrase :

     « Le contenu est visible sans JavaScript : c'est la classe .rv qui
       masque, et elle n'est posée que si l'observateur existe. »

   Conséquence directe sur le balisage : AUCUN composant n'écrit `class="rv"`
   dans son JSX. Un `.rv` posé en dur sans observateur laisse le bloc à
   `opacity: 0` pour toujours — c'est-à-dire une page blanche, sans erreur.
   C'est ce module qui pose la classe, et il ne la pose qu'après avoir
   vérifié que `IntersectionObserver` répond.

   ── EMPLOI ────────────────────────────────────────────────────────────────
       const reveler = useRevelation();
       …
       <div className="tete" ref={reveler}>

   Le rappel est stable (`useCallback` à dépendances vides) : React ne le
   détache donc pas à chaque rendu, et un bloc n'est observé qu'une fois.

   ── CE QUI EST DÉJÀ DANS LE CADRE À L'ARRIVÉE ────────────────────────────
   La maquette révèle immédiatement ce qui est visible au chargement
   (l. 1430-1435). Sans cela, une page courte — celle-ci en est une —
   resterait invisible : l'observateur ne notifie qu'au franchissement d'un
   seuil, et un bloc déjà entièrement visible n'en franchit aucun. Le test
   de cadre est donc fait à l'attache, et `.rv` + `.on` sont posées dans la
   même image : le bloc naît visible, sans transition, ce qui est le
   comportement voulu au-dessus de la ligne de flottaison.

   ── CE QU'IL N'Y A PAS ICI ────────────────────────────────────────────────
   Aucun traitement de `prefers-reduced-motion` : `99-preferences.css`
   neutralise déjà `.rv` sous mouvement réduit. Le dupliquer en JavaScript
   ferait deux vérités pour une seule règle.

   ── À DÉPLACER ────────────────────────────────────────────────────────────
   Ce module a vocation à vivre dans `src/hooks/useRevelation.ts` : les huit
   pages en ont besoin. Il est ici parce que le lot L4 « page Minecraft »
   n'est propriétaire que de `src/pages/Minecraft.tsx` et de ce répertoire.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le seuil de la maquette : un bloc se révèle dès qu'il entre à 12 %. */
const SEUIL = 0.12;

export type Reveler = (element: HTMLElement | null) => void;

export function useRevelation(): Reveler {
  const observateur = useRef<IntersectionObserver | null>(null);

  useEffect(
    () => () => {
      observateur.current?.disconnect();
      observateur.current = null;
    },
    [],
  );

  return useCallback<Reveler>((element) => {
    // React rappelle la fonction avec `null` au démontage.
    if (element === null) return;

    // Pas d'observateur : on ne masque rien. Le bloc reste visible.
    if (typeof IntersectionObserver === "undefined") return;

    let obs = observateur.current;
    if (obs === null) {
      obs = new IntersectionObserver(
        (entrees, instance) => {
          for (const entree of entrees) {
            if (!entree.isIntersecting) continue;
            entree.target.classList.add("on");
            instance.unobserve(entree.target);
          }
        },
        { threshold: SEUIL },
      );
      observateur.current = obs;
    }

    element.classList.add("rv");

    const cadre = element.getBoundingClientRect();
    if (cadre.top < window.innerHeight && cadre.bottom > 0) {
      element.classList.add("on");
      return;
    }

    obs.observe(element);
  }, []);
}
