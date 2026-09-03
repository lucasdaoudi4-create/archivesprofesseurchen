import { useId } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC · LOG — 01 · L'EMBLÈME
   Les Archives du Professeur Chen — charte v1.0.0

   ── CE QUE CE FICHIER DESSINE, ET POURQUOI IL DIVERGE DU § 4 ─────────────

   Le chapitre 02 § 4 livre un emblème « cercle ouvert + fente médiane +
   lentille centrale ». Le chapitre 07 § 7.14, point 1 des « À DÉCIDER »,
   pose que cette forme — « un emblème circulaire à bande médiane et bouton
   central » — tombe dans la catégorie « emblèmes » que la marque dit de ne
   jamais reprendre à un univers sous licence, et qu'il faut « soit les
   redessiner en formes propres à la marque, soit assumer et documenter le
   risque ». Le chapitre 02 § 16 ajoute que la validation juridique des cinq
   écarts de construction n'est pas rendue.

   L'AUTEUR A TRANCHÉ : on redessine. Le cercle, sa bande médiane et son
   bouton central sortent de l'identité. Ils ne sont donc PAS dans ce
   fichier, ni dans `public/favicon.svg`.

   ── LA FORME RETENUE — « L'ARCHIVE » ──────────────────────────────────────

   L'A d'ARCHIVES — qui est aussi l'A du préfixe `ARC · …` de tous les codes
   de référence de la charte — tracé au tube de néon, et traversé de part en
   part par la fente d'archive.

   Ce qui est repris du chapitre 02, à la lettre :

     · § 1.1  l'emblème est un TRACÉ, pas une forme pleine : épaisseur
              constante, `fill:none`, aucun aplat, aucun dégradé, aucune
              ombre dans le dessin ;
     · § 1.3  il est D'APLOMB : aucune rotation, aucune inclinaison ;
     · É2     la fente médiane est VIDE — deux traits parallèles, écart
              d'axe 2h, vide visible 2h − e (§ 2.2). C'est, dit le
              chapitre, « une fente de tiroir d'archive » ;
     · É4     la fente TRAVERSE TOUT L'EMBLÈME d'un bord à l'autre :
              « c'est la signature ». Ici elle coupe les deux jambages et
              ressort de chaque côté ;
     · É5     aucun remplissage bicolore : le tracé est 100 % linéaire, et
              les cinq versions du § 9 restent des versions de COULEUR DE
              TRAIT (le composant n'en écrit aucune : voir plus bas) ;
     · § 3.1  la grille maîtresse 200 × 200, centre (100,100), et D = 166,
              l'encombrement optique encre-à-encre qui sert d'unité à tous
              les verrous et à toutes les déclinaisons ;
     · § 3.3  les TROIS COUPES OPTIQUES, avec le viewBox recadré de la
              coupe Micro qui garantit le même encombrement apparent.

   Ce qui devient sans objet : É1 (cercle extérieur ouvert) et É3 (lentille
   creuse) — il n'y a plus ni cercle ni centre à ouvrir.

   ── GÉOMÉTRIE — DEUX PARAMÈTRES SUFFISENT ────────────────────────────────

   Tout se dessine dans le carré 200 × 200, centre (100,100). Il ne faut que
   `e`, l'épaisseur de trait, et `h`, le demi-écart de la fente.

   La BOÎTE D'AXE est le carré [b, 200−b]², où `b = 17 + e/2` : elle est
   rentrée d'une demi-épaisseur pour que l'encre, caps compris, tombe
   exactement sur D. Et de cette boîte se déduisent trois points :

     apex   = (100, b)                        — au milieu du côté haut
     pieds  = (b, 200−b) et (200−b, 200−b)    — aux deux coins du bas
     fente  = y = 100 ± h, de x = b à x = 200−b

   Conséquence remarquable, et c'est le verrou de construction du dessin :
   la demi-largeur vaut 100 − b et la hauteur 2 (100 − b). **La pente du
   jambage est donc exactement 1:2, dans les trois coupes**, quelle que
   soit `e`. D'où une formule unique pour la coupe du jambage par la
   fente :

     x(y) = 100 − (y − b) / 2          (jambage gauche ; miroir à droite)

   | Coupe    | viewBox         |  e | h    | b  | boîte    | D   | vide |
   |----------|-----------------|----|------|----|----------|-----|------|
   | Enseigne | `0 0 200 200`   |  6 |  7,5 | 20 | 20 → 180 | 166 |    9 |
   | Courant  | `0 0 200 200`   |  8 |  9   | 21 | 21 → 179 | 166 |   10 |
   | Micro    | `31 31 138 138` | 14 | 16   | 38 | 38 → 162 | 138 |   18 |

   Le vide visible (2h − e) vaut 5,4 % · 6,0 % · 13,0 % de D. Le seuil du
   § 15 est de 5 % : il est tenu par les trois coupes. Le viewBox recadré
   de la coupe Micro donne D = 138 sur 138 unités affichées, donc le même
   encombrement apparent que les deux autres — c'est le § 3.3.

   Points de coupe, tous exacts, aucun arrondi :

     Enseigne : haut 63,75 / 136,25 (y = 92,5) · bas 56,25 / 143,75 (y = 107,5)
     Courant  : haut 65    / 135    (y = 91)   · bas 56    / 144    (y = 109)
     Micro    : haut 77    / 123    (y = 84)   · bas 61    / 139    (y = 116)

   Les caps ronds font joindre le jambage à la fente exactement sur son axe,
   et le raccord rond de l'apex ferme le sommet sur la ligne haute de la
   boîte : c'est calculé, ne les changez pas.

   ── CE QUE CE FICHIER N'ÉCRIT PAS ─────────────────────────────────────────

   Aucune couleur, aucune taille, aucune épaisseur de trait (socle § 0.21).
   `31-icones.css` est le propriétaire du trait : `.emb` pose `fill:none`,
   `stroke:currentColor`, les caps, la taille servie ET le `stroke-width`
   qui va avec la coupe — 6 · 8 · 14. Le composant ne choisit que le TRACÉ,
   et fait concorder les deux : c'est la règle du § 14.1, « les règles sont
   portées par le composant, pas par l'appelant ».

   La couleur vient du contexte : `.emb { color: inherit }`. Sur la barre et
   le pied — tous deux en `.acier` — le balisage pose `.t-accent`, et
   `--accent` y vaut le néon (9,72:1 sur `#2A2F32`, § 9, variante d'accent
   autorisée en V1). Sur fond clair, sans classe, l'emblème hérite de
   `--texte` : c'est la version V2, monochrome encre, 16,02:1.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Les sept tailles servies de l'échelle des logos (socle § 0.13). */
export type TailleEmbleme = 28 | 36 | 44 | 52 | 62 | 80 | "enseigne";

type Coupe = "micro" | "courant" | "enseigne";

type Props = {
  /** Taille servie. 28 bascule seule sur la coupe Micro ; « enseigne »
   *  prend la largeur de son conteneur et la coupe Enseigne. */
  taille?: TailleEmbleme;
  /** Halo néon. Ignoré hors coupe Enseigne : `--halo-emb` a un rayon de
   *  40 px, qui exige D ≥ 167 px (chapitre 02 § 10.2, budget 0,24 D).
   *  Sous 40 px le halo est interdit — § 11, interdit n° 6. */
  halo?: boolean;
  /** Présent → `role="img"` + `<title>`. Absent → `aria-hidden` : c'est le
   *  cas dès que le nom de la marque est déjà écrit à côté (§ 14.1). */
  titre?: string;
  className?: string;
};

/* Les trois tracés. Chacun est une liste de `d` : la fente d'abord — elle
   est la signature —, puis le sommet de l'A, puis ses deux pieds. */
const TRACES: Record<Coupe, { viewBox: string; d: string[] }> = {
  enseigne: {
    viewBox: "0 0 200 200",
    d: [
      // La fente d'archive, d'un bord à l'autre (É2 · É4)
      "M20 92.5 H180",
      "M20 107.5 H180",
      // Le sommet, coupé net par la fente
      "M63.75 92.5 L100 20 L136.25 92.5",
      // Les deux pieds, repris sous la fente
      "M56.25 107.5 L20 180",
      "M143.75 107.5 L180 180",
    ],
  },
  courant: {
    viewBox: "0 0 200 200",
    d: [
      "M21 91 H179",
      "M21 109 H179",
      "M65 91 L100 21 L135 91",
      "M56 109 L21 179",
      "M144 109 L179 179",
    ],
  },
  micro: {
    viewBox: "31 31 138 138",
    d: [
      "M38 84 H162",
      "M38 116 H162",
      "M77 84 L100 38 L123 84",
      "M61 116 L38 162",
      "M139 116 L162 162",
    ],
  },
};

/** La classe de taille de `31-icones.css`. `.emb` seul EST le pas 36. */
const CLASSE: Record<string, string> = {
  28: "emb emb--28",
  36: "emb",
  44: "emb emb--44",
  52: "emb emb--52",
  62: "emb emb--62",
  80: "emb emb--80",
  enseigne: "emb emb--enseigne",
};

export default function Embleme({
  taille = 36,
  halo = false,
  titre,
  className = "",
}: Props) {
  const id = useId();

  // Règles portées par le composant, pas par l'appelant (§ 14.1) :
  // seul le pas 28 descend sous la charnière des 29 px, et il est le seul
  // à recevoir le tracé Micro ; seule la coupe Enseigne peut porter le halo.
  const coupe: Coupe =
    taille === 28 ? "micro" : taille === "enseigne" ? "enseigne" : "courant";
  const avecHalo = halo && coupe === "enseigne";

  const trace = TRACES[coupe];
  const classes = [CLASSE[String(taille)], avecHalo && "emb--halo", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      viewBox={trace.viewBox}
      shapeRendering="geometricPrecision"
      {...(titre
        ? { role: "img", "aria-labelledby": `${id}-t` }
        : { "aria-hidden": true, focusable: "false" as const })}
    >
      {titre && <title id={`${id}-t`}>{titre}</title>}
      {trace.d.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
