import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RÉVÉLATION AU DÉFILEMENT — LE CROCHET UNIQUE
   Les Archives du Professeur Chen — charte v1.0.0

   `04-tokens-motion.css` déclare la mécanique et, dans la même respiration,
   la règle qui gouverne ce fichier :

     « Le contenu est visible sans JavaScript : c'est la classe .rv qui
       masque, et elle n'est posée que si l'observateur existe. »

   D'où le SENS DE LECTURE, à l'envers de la maquette : le JSX n'écrit JAMAIS
   `class="rv"`. Il marque ses blocs d'un `data-rv` — un marqueur, pas un
   style — et c'est ce crochet-ci qui pose `.rv`, donc qui masque, après
   s'être assuré que l'observateur est là pour la retirer. Un `.rv` écrit en
   dur dans le JSX laisse le bloc à `opacity: 0` pour toujours dès que
   personne ne vient poser `.on` : une page blanche, sans erreur, sans trace.
   C'était le défaut du formulaire de `/contact`.

   ── CE QUE CE FICHIER REMPLACE ────────────────────────────────────────────
   Six implémentations du même mécanisme vivaient en parallèle : deux copies
   identiques au caractère près (accueil, contact), une version à conteneur
   (formation), une version à rappel de ref (minecraft), et deux
   réimplémentations en ligne dans `Discord.tsx` et `Socials.tsx`. Elles ne
   divergeaient pas seulement de forme : trois d'entre elles écrivaient `.rv`
   depuis le JSX, ce que la feuille de mouvement interdit. Une seule règle,
   un seul endroit.

   ── QUATRE POINTS DE MÉCANIQUE ────────────────────────────────────────────

   1. LE REMONTAGE EST PRIS EN CHARGE. Un `useEffect([])` ne balaie le
      document qu'une fois : tout bloc qui naît PLUS TARD — un formulaire
      qui revient après son message de confirmation, une fiche que sa `key`
      remonte — lui échappe. Un `MutationObserver` posé sur `document.body`
      voit ces arrivées et leur applique le même traitement. C'est la seule
      façon d'être indépendant de QUI a déclenché le rendu.

      Et le repli est sûr dans les deux sens : un bloc que personne ne prend
      en charge n'a pas `.rv`, donc il est simplement VISIBLE. L'oubli coûte
      une animation, jamais un contenu.

   2. CE QUI EST DÉJÀ DANS LE CADRE SE RÉVÈLE TOUT DE SUITE. Une page courte,
      une arrivée de route à mi-hauteur, un bloc remonté sous les yeux du
      lecteur : aucun ne doit attendre un défilement qui ne viendra pas.
      `.rv` et `.on` sont alors posées dans le même tour de boucle — aucune
      peinture ne s'intercale, donc aucune transition ne se joue et aucun
      clignotement n'est possible.

   3. LE SOMMAIRE SE REMPLIT EN MÊME TEMPS QU'IL SE RÉVÈLE. `.sommaire`
      attend `.rempli` pour lancer le filet d'émail de son `::before`
      (30-composants.css § 12). C'est le même événement : le relevé entre
      dans le cadre, il se construit.

   4. ON N'OBSERVE PLUS CE QUI EST RÉGLÉ. `unobserve` par élément dès qu'il
      est révélé, `unobserve` aussi sur ce que le DOM retire, et `disconnect`
      des deux observateurs au démontage de la route.

   ── CE QU'IL N'Y A PAS ICI ────────────────────────────────────────────────
   Aucun traitement de `prefers-reduced-motion` : `99-preferences.css` pose
   déjà l'état final de `.rv` et ramène les durées à 1 ms. En rajouter en
   JavaScript ferait une seconde source de vérité pour une seule règle
   (socle § 0.16).
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le seuil de la maquette validée : un bloc se révèle dès qu'il entre à 12 %. */
const SEUIL = 0.12;

/** Le marqueur que le JSX pose, et le seul contrat de balisage du mécanisme. */
const MARQUEUR = "[data-rv]";

/* Les blocs qui restent à prendre en charge. Le filtre porte sur `.on`, PAS
   sur `.rv` : c'est `.on` qui dit « ce bloc est réglé, il est visible pour de
   bon ». Un bloc masqué mais pas encore révélé (`.rv` seul) doit au contraire
   pouvoir être repris — c'est ce qui arrive à chaque second passage de
   `StrictMode`, qui démonte puis remonte l'effet en développement : le premier
   passage a posé `.rv` et coupé son observateur, le second doit ré-observer,
   sans quoi la page resterait masquée jusqu'au rechargement. */
const A_PRENDRE = `${MARQUEUR}:not(.on)`;

/**
 * Révèle au défilement les blocs marqués `data-rv` de la page montée.
 *
 * S'appelle une fois, sans argument, en tête du composant de page. Le JSX
 * n'a rien d'autre à faire que marquer ses blocs :
 *
 *     export default function MaPage() {
 *       useRevelation();
 *       return <section className="bande"><div className="tete" data-rv>…</div></section>;
 *     }
 */
export function useRevelation(): void {
  useEffect(() => {
    /* Révéler, c'est poser `.on` — et, sur un sommaire, lancer son
       remplissage : le relevé se remplit, il n'apparaît pas. */
    const reveler = (cible: Element) => {
      cible.classList.add("on");
      if (cible.classList.contains("sommaire")) cible.classList.add("rempli");
    };

    /* Pas d'`IntersectionObserver` : on ne masque rien, on révèle tout. Le
       socle veut le contenu lisible ; l'animation n'est qu'un supplément. */
    const observateur =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entrees, instance) => {
              for (const entree of entrees) {
                if (!entree.isIntersecting) continue;
                reveler(entree.target);
                instance.unobserve(entree.target);
              }
            },
            { threshold: SEUIL },
          );

    const prendre = (cible: HTMLElement) => {
      if (observateur === null) {
        reveler(cible);
        return;
      }

      cible.classList.add("rv");

      // Déjà sous les yeux du lecteur : `.rv` et `.on` dans le même tour de
      // boucle, donc aucune transition et aucun clignotement.
      const cadre = cible.getBoundingClientRect();
      if (cadre.top < window.innerHeight && cadre.bottom > 0) {
        reveler(cible);
        return;
      }

      observateur.observe(cible);
    };

    /** Prend en charge un nœud marqué, et toute sa descendance marquée. */
    const balayer = (noeud: Element) => {
      if (noeud.matches(A_PRENDRE)) prendre(noeud as HTMLElement);
      noeud.querySelectorAll<HTMLElement>(A_PRENDRE).forEach(prendre);
    };

    /** Le DOM a retiré ce nœud : plus rien à observer sous lui. */
    const oublier = (noeud: Element) => {
      if (observateur === null) return;
      if (noeud.matches(MARQUEUR)) observateur.unobserve(noeud);
      noeud.querySelectorAll(MARQUEUR).forEach((cible) => observateur.unobserve(cible));
    };

    // Le premier balayage. Les effets d'un enfant s'exécutent avant ceux de
    // son parent : quand celui-ci passe, la page entière est dans le document.
    document.querySelectorAll<HTMLElement>(A_PRENDRE).forEach(prendre);

    /* Les arrivées et les départs postérieurs. `childList` + `subtree`
       seulement : on ne surveille aucun attribut, donc le `classList.add`
       ci-dessus ne peut pas se rappeler lui-même. */
    const remontages =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver((lots) => {
            for (const lot of lots) {
              for (const parti of lot.removedNodes) {
                if (parti instanceof Element) oublier(parti);
              }
              for (const venu of lot.addedNodes) {
                if (venu instanceof Element) balayer(venu);
              }
            }
          });

    remontages?.observe(document.body, { childList: true, subtree: true });

    return () => {
      remontages?.disconnect();
      observateur?.disconnect();
    };
  }, []);
}
