import { useCallback, useEffect, useState } from "react";
import { faq } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FOIRE AUX QUESTIONS — `.accordion` · ARC · CMP — 39 · 08-composants B-20
   Les Archives du Professeur Chen — charte v1.0.0

   ── POURQUOI CE FICHIER EXISTE ────────────────────────────────────────────

   `faq` est déclaré dans `src/data/site.ts` depuis l'origine et n'était
   rendu NULLE PART : cinq réponses écrites, relues, mises au vouvoiement,
   et jamais servies. Ce composant les rend, sans en réécrire une seule.

   ── LES CINQ RÉPONSES SONT TOUTES RENDUES ─────────────────────────────────

   Le §0.36 a purgé de ce site le catalogue des sept modules, les trois
   témoignages et les quatre compteurs sans source. Aucune des cinq
   réponses de `faq` n'en relève : chacune se vérifie ligne à ligne dans
   `site.ts`, et le composant n'en écarte donc aucune.

     · « huit chapitres »            → `module01.chapitres` en compte huit ;
     · « dès le Jeune Dresseur »     → `comparatif[0]` : ouvert aux trois ;
     · « en production »             → `comparatif[4]` : `production` ;
     · « Maître de la Ligue »        → `comparatif[6]` et `[7]` : `ouvert`
                                        au seul palier `maitre` ;
     · « je ne promets pas de résultat » → 10-addendum §10.17, à la lettre.

   Une seule nuance est relevée sans être corrigée ici, parce qu'elle
   appartient à la copie et non au rendu : la quatrième réponse dit le
   Discord ouvert « à tous les paliers », là où le comparatif ne parle que
   des trois paliers PAYANTS. Voir « À signaler ».

   ── LE BOUTON, PAS `<details>` ────────────────────────────────────────────

   B-20 accepte les deux. Ce système tranche pour le bouton, parce que
   `30-composants.css` §23 est écrit sur `aria-expanded` :

       .acc-q[aria-expanded="true"] .sign::after { scale: 1 0; }
       .acc:has(.acc-q[aria-expanded="true"]) > .acc-a { … }

   Un `<summary>` ne porte pas `aria-expanded` — l'état est sur le
   `<details>` parent, en attribut `open`. Le composant ne serait donc ni
   ouvert ni dessiné. Le balisage suit la feuille, la feuille ne suit pas
   le balisage (§0.21).

   L'ÉTAT NE DÉPEND PAS DE LA COULEUR. Le signe est un « + » dessiné dont
   la barre verticale se rétracte : c'est une FORME qui change, elle tient
   sous `forced-colors` et pour qui ne distingue pas le bordeaux du gris.
   `aria-expanded` la double pour les lecteurs d'écran. La couleur du titre
   n'est que le troisième porteur du même état.

   OUVERTURE MULTIPLE — « on ne referme pas une réponse pour en lire une
   autre » (B-20). L'état est donc un ENSEMBLE d'ancres ouvertes, jamais un
   index unique.

   ── L'ANCRE OUVRE LA RÉPONSE ──────────────────────────────────────────────

   « Chaque question doit rester atteignable par ancre (`#faq-tarifs`) et
   s'ouvrir si l'ancre la cible. » La feuille de styles le dit relever du
   script : c'est ici. L'ancre est dérivée de la question, pas de son rang —
   un rang change à la première question insérée, une ancre partagée ne
   doit pas changer sous les pieds de qui l'a copiée.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * L'ancre stable d'une question : accents dépliés puis retirés, tout ce qui
 * n'est ni lettre ni chiffre replié en tiret. Les espaces insécables et
 * fines de la copie (` `, ` `) tombent dans le même filet.
 */
function ancre(question: string): string {
  const racine = question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 44)
    .replace(/^-+|-+$/g, "");

  return `faq-${racine}`;
}

/* Les entrées sont calculées UNE fois, au chargement du module : `faq` est
   une constante, et l'effet d'ancrage ci-dessous ne doit pas se réabonner
   à chaque rendu. */
const ENTREES = faq.map((entree) => {
  const id = ancre(entree.q);
  return { ...entree, id, idQuestion: `${id}-q` };
});

export default function Faq() {
  const [ouvertes, setOuvertes] = useState<ReadonlySet<string>>(() => new Set());

  const basculer = useCallback((id: string) => {
    setOuvertes((precedentes) => {
      const suivantes = new Set(precedentes);
      if (!suivantes.delete(id)) suivantes.add(id);
      return suivantes;
    });
  }, []);

  useEffect(() => {
    function viser() {
      const cible = decodeURIComponent(window.location.hash.slice(1));
      if (!cible) return;

      // L'ancre du panneau comme celle du bouton ouvrent la même réponse :
      // `aria-controls` publie la première, la seconde est ce que copie un
      // navigateur quand le focus est sur la question.
      const entree = ENTREES.find((e) => e.id === cible || e.idQuestion === cible);
      if (!entree) return;

      setOuvertes((precedentes) => {
        if (precedentes.has(entree.id)) return precedentes;
        const suivantes = new Set(precedentes);
        suivantes.add(entree.id);
        return suivantes;
      });

      // On amène la QUESTION à l'écran, pas la réponse : c'est elle qui
      // porte le focus et le titre de la section ouverte.
      document.getElementById(entree.idQuestion)?.scrollIntoView({ block: "center" });
    }

    viser();
    window.addEventListener("hashchange", viser);
    return () => window.removeEventListener("hashchange", viser);
  }, []);

  return (
    <div className="accordion">
      {ENTREES.map((entree) => {
        const ouverte = ouvertes.has(entree.id);

        return (
          <div className="acc" key={entree.id}>
            {/* `h4` et non `h3` : la bande porte un `h2`, le titre de ce
                bloc porte un `h3`. Le niveau descend sans saut, et `.acc`
                remet la marge du titre à zéro — tout le type est sur le
                bouton, seul élément interactif (30-composants.css §23). */}
            <h4>
              <button
                type="button"
                className="acc-q"
                id={entree.idQuestion}
                aria-expanded={ouverte}
                aria-controls={entree.id}
                onClick={() => basculer(entree.id)}
              >
                {entree.q}
                {/* Vide : le signe est DESSINÉ par la feuille en deux
                    pseudo-éléments. `font-size: 0` sur `.sign` neutralise
                    de toute façon un « + » littéral. */}
                <span className="sign" aria-hidden="true" />
              </button>
            </h4>

            {/* Pas d'attribut `hidden` : `display: none` supprimerait la
                transition de `grid-template-rows`. Le repli est assuré par
                la `visibility: hidden` de `.acc-a`, qui sort le panneau du
                parcours de tabulation aussi complètement.

                UN SEUL ENFANT, impérativement : `.acc-a > *` porte le
                débordement et le rembourrage de pied. Un second enfant
                tomberait dans une piste implicite en `auto` et ne se
                replierait jamais. */}
            <div
              className="acc-a"
              id={entree.id}
              role="region"
              aria-labelledby={entree.idQuestion}
            >
              <div>
                <p className="mb-0">{entree.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
