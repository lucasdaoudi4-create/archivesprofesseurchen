import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RÉVÉLATION AU DÉFILEMENT — `.rv`, pilotée par IntersectionObserver
   Les Archives du Professeur Chen — charte v1.0.0

   `04-tokens-motion.css` déclare la mécanique et pose la règle qui gouverne
   ce fichier :

     « Le contenu est visible sans JavaScript : c'est la classe .rv qui
       masque, et elle n'est posée que si l'observateur existe. »

   D'où le sens de lecture, à l'envers de la maquette : le JSX n'écrit
   JAMAIS `class="rv"`. Il marque ses blocs d'un `data-rv`, et c'est ce
   crochet-ci qui pose `.rv` — donc qui masque — après s'être assuré que
   l'observateur est là pour la retirer. Si l'API manque, rien n'est masqué.

   TROIS POINTS DE MÉCANIQUE

   1. CE QUI EST DÉJÀ DANS LE CADRE EST RÉVÉLÉ TOUT DE SUITE. Une page
      courte, ou une arrivée de route à mi-hauteur, ne laisse aucun bloc
      invisible en attente d'un défilement qui ne viendra pas. `.rv` et
      `.on` sont alors posées dans le même tour de boucle : aucune peinture
      ne s'intercale, donc aucune transition ne se joue et aucun clignotement
      n'est possible.

   2. LE SOMMAIRE SE REMPLIT EN MÊME TEMPS QU'IL SE RÉVÈLE. `.sommaire`
      attend `.rempli` pour lancer le filet d'émail de son `::before`
      (30-composants.css §12). C'est le même événement : le relevé entre
      dans le cadre, il se construit.

   3. AUCUNE COMPENSATION DE MOUVEMENT RÉDUIT ICI. `99-preferences.css`
      pose déjà l'état final de `.rv` sous `prefers-reduced-motion` et ramène
      toutes les durées à 1 ms. En rajouter en JavaScript ferait une seconde
      source de vérité pour la même préférence (socle §0.16).
   ═══════════════════════════════════════════════════════════════════════════ */

const SEUIL = 0.12;

export default function useRevelation() {
  const racine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hote = racine.current;
    if (!hote) return;

    const cibles = Array.from(hote.querySelectorAll<HTMLElement>("[data-rv]"));
    if (cibles.length === 0) return;

    const reveler = (cible: HTMLElement) => {
      cible.classList.add("on");
      if (cible.classList.contains("sommaire")) cible.classList.add("rempli");
    };

    // Pas d'observateur : on ne masque rien. Le contenu reste lisible.
    if (typeof IntersectionObserver === "undefined") {
      cibles.forEach(reveler);
      return;
    }

    cibles.forEach((cible) => cible.classList.add("rv"));

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;
          reveler(entree.target as HTMLElement);
          observateur.unobserve(entree.target);
        });
      },
      { threshold: SEUIL },
    );

    cibles.forEach((cible) => {
      const cadre = cible.getBoundingClientRect();
      const dansLeCadre = cadre.top < window.innerHeight && cadre.bottom > 0;
      if (dansLeCadre) reveler(cible);
      else observateur.observe(cible);
    });

    return () => observateur.disconnect();
  }, []);

  return racine;
}
