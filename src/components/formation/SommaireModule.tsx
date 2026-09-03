import { module01 } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   SOMMAIRE DE MODULE — ARC · CMP — 04 · 30-composants.css §12
   Les Archives du Professeur Chen — charte v1.0.0

   « Le relevé se remplit, il n'apparaît pas. » Un filet d'émail court de
   gauche à droite, puis les lignes basculent l'une après l'autre. Tout est
   en CSS : le rang de chaque ligne est posé par `:nth-child`, jamais par un
   `style="--i:3"` en ligne — le socle §0.21 interdit le style en ligne, et
   c'est ainsi que la maquette le faisait. Ce composant n'a donc à fournir
   qu'une chose : des `.chap` en enfants DIRECTS de `.sommaire`. La classe
   `.rempli` qui lance le remplissage est posée par `useRevelation`, au
   moment où le relevé entre dans le cadre.

   ── POURQUOI LES CHAPITRES NE SONT PAS DES LIENS, NI DES VERROUS ──────────

   Sur `/formation`, la page est publique et le visiteur n'a pas de badge.
   Deux modificateurs de `32-membre.css` sont donc volontairement absents :

     · `.chap--ouvert` et `.chap--verrou` disent l'état d'accès d'un membre
       CONNECTÉ. L'ouverture de session Patreon n'est pas tranchée (socle
       §0.38) : afficher ici un verrou ou une ouverture serait affirmer un
       état qu'aucune source ne relève.
     · Huit liens vers la même adresse ne sont pas une navigation. Le seul
       lien du bloc est le bouton « Ouvrir le module » de la notice.

   Ce que le sommaire annonce, c'est le CONTENU du module — huit chapitres,
   leur rang, leur titre, leur glose — et le comparatif dit, deux sections
   plus bas et en toutes lettres, à partir de quel palier il s'ouvre.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SommaireModule() {
  return (
    <ol className="sommaire" data-rv>
      {module01.chapitres.map((chapitre) => (
        <li className="chap" key={chapitre.rang}>
          <span className="chap__n">{chapitre.rang}</span>
          <span>
            <span className="chap__t">{chapitre.titre}</span>
            <span className="chap__s">{chapitre.glose}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
