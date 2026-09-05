import type { ReseauKey } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LE JEU D'ICÔNES PARTAGÉ — chapitre 06 · `31-icones.css`
   Les Archives du Professeur Chen — charte v1.0.0

   Point d'entrée UNIQUE de tous les signes du site. Avant ce module, la
   coche était recopiée dans quatre fichiers, l'écusson dans deux, et les
   quatre réseaux avaient DEUX jeux de tracés concurrents. Un tracé recopié
   dérive : il suffit qu'une copie soit retouchée pour que le même signe ait
   deux visages sur le même site. Le tracé vit donc ICI, une seule fois, et
   les pages ne font plus que le demander.

   ── TROIS FAMILLES, ET LE CHAPITRE 06 INTERDIT DE LES CONFONDRE ───────────

     · `Icone`      — le TRAIT des Archives. Grille 24, `fill:none`,
                      `stroke:currentColor`, bouts ronds. Classe `.ico`.
     · `Ecusson`    — le BLASON de palier. Grille 100 × 120, sa propre
                      épaisseur de trait. Classe `.ecu`. Le servir avec
                      `.ico--16` rendrait un trait de 0,29 px : l'écusson
                      disparaîtrait sans qu'aucune erreur ne soit levée.
                      D'où une famille, et des tailles, à part.
     · `LogoReseau` — les GLYPHES DE PLATEFORME. Ils appartiennent à un autre
                      système graphique : silhouette PLEINE, `stroke:none`,
                      d'où `.ico--marque`. Le § 6.4 est explicite, « on ne
                      les redessine pas au style maison — ce serait une
                      déformation de marque ». Les quatre tracés ci-dessous
                      sont les marques officielles monochromes, normalisées
                      en `viewBox 0 0 24 24` ; ce sont les seuls tracés du
                      site à ne pas suivre le trait de la charte, et c'est
                      voulu.

   ── L'API, LA MÊME POUR LES TROIS ─────────────────────────────────────────

   Chacune prend `taille`, `ton`, `titre` et `className`, et rien d'autre :

     taille   une valeur de l'échelle de SA famille, et d'aucune autre. Les
              types ci-dessous ferment la porte à la confusion des grilles :
              `taille={64}` sur une `Icone` ne compile pas.
     ton      un rôle de couleur du § 6.3, jamais une couleur. Absent, le
              signe HÉRITE — c'est le cas par défaut, et le bon.
     titre    le nom accessible. ABSENT = signe décoratif, donc `aria-hidden`
              et invisible du lecteur d'écran ; PRÉSENT = `role="img"` et le
              nom annoncé. Un signe qui double un texte déjà écrit à côté ne
              prend PAS de titre : il ferait doubler l'annonce.
     className  la mise en place locale (marges de grille), rien de plus.

   Aucune couleur, aucune taille en dur : tout passe par les classes du
   chapitre 06, qui seules connaissent la compensation optique du trait.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Vocabulaire commun ──────────────────────────────────────────────────── */

/** Les cinq tailles servies de `.ico`, plus la grille nue de 24. */
export type TailleIcone = 16 | 20 | 24 | 32 | 40 | 48;

/** Les deux tailles servies de `.ecu`, plus la plaque nue de 62. */
export type TailleEcusson = 20 | 36 | 62;

/** Les rôles de couleur du § 6.3. Absent = le signe hérite. */
export type TonIcone = "muet" | "action" | "verrou" | "succes";

/** Le nom des tracés au trait. Une entrée ici, un tracé dans `TRACES`. */
export type NomIcone = "coche" | "copier" | "lien-externe";

type Commun = {
  /** Rôle de couleur. Absent, le signe hérite de la couleur du texte. */
  ton?: TonIcone;
  /** Nom accessible. Absent, le signe est décoratif et `aria-hidden`. */
  titre?: string;
  /** Mise en place locale uniquement. */
  className?: string;
};

/* Assemble la liste de classes. La taille nue de chaque famille n'a pas de
   modificateur : `.ico` fait déjà 24, `.ecu` fait déjà 62. */
function classes(base: string, modificateurs: (string | false | undefined)[]) {
  return [base, ...modificateurs].filter(Boolean).join(" ");
}

/* Les deux attributs qui décident du sort du signe chez le lecteur d'écran.
   Ils sont écrits UNE fois, ici, pour que les trois familles ne puissent pas
   diverger sur ce point-là. */
function accessibilite(titre?: string) {
  return titre
    ? ({ role: "img", "aria-label": titre } as const)
    : ({ "aria-hidden": true, focusable: "false" } as const);
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 · LE TRAIT DES ARCHIVES — grille 24, classe `.ico`

   Une seule épaisseur, des bouts ronds, une grille unique. Les quatre
   propriétés de dessin (`fill:none`, `stroke:currentColor`, `linecap`,
   `linejoin`) sont posées par `.ico` en `31-icones.css` : les tracés
   ci-dessous n'ont RIEN à déclarer, et ne déclarent rien.
   ═══════════════════════════════════════════════════════════════════════════ */

const TRACES: Record<NomIcone, JSX.Element> = {
  /* `ico-action-valider` — la coche des listes de motifs et de contenus.
     C'était le tracé recopié quatre fois : accueil, Discord, Contact, carte
     de palier. */
  coche: <path d="m5 12 5 5L19 7" />,

  /* `ico-action-copier` — deux feuillets décalés. Sert au relevé de
     l'adresse du serveur. */
  copier: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5.5A1.5 1.5 0 0 1 4 13.5v-8A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V6" />
    </>
  ),

  /* `ico-action-lien-externe` — socle § 0.25, ligne « Lien externe » : le
     pictogramme est DANS le balisage, jamais en `::after` CSS, et le libellé
     accessible du lien dit la destination. */
  "lien-externe": (
    <>
      <path d="M13.6 3.8h6.6v6.6" />
      <path d="M20.2 3.8l-8.6 8.6" />
      <path d="M17.6 13.8v5a1.6 1.6 0 0 1-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6V8.2a1.6 1.6 0 0 1 1.6-1.6h5" />
    </>
  ),
};

type ProprietesIcone = Commun & {
  nom: NomIcone;
  /** Taille servie. 24 = la grille nue de `.ico`, sans modificateur. */
  taille?: TailleIcone;
};

export function Icone({ nom, taille = 24, ton, titre, className }: ProprietesIcone) {
  return (
    <svg
      className={classes("ico", [
        taille !== 24 && `ico--${taille}`,
        ton && `ico--${ton}`,
        className,
      ])}
      viewBox="0 0 24 24"
      {...accessibilite(titre)}
    >
      {TRACES[nom]}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · L'ÉCUSSON DE PALIER — grille 100 × 120, classe `.ecu`

   Le blason est commun aux trois rangs ; seul le nombre de barres change,
   comme le rang, et le disque monte d'autant. Le tracé est celui de la
   maquette validée, débarrassé de son `<g stroke-width>` : `.ecu` porte
   déjà le trait, et le réécrire ici sortirait de la compensation optique
   du chapitre 06.
   ═══════════════════════════════════════════════════════════════════════════ */

const CONTOUR_ECU = "M50 6 88 20v40c0 28-18 44-38 52C30 104 12 88 12 60V20z";

/* Par rang : la hauteur du disque, et l'ordonnée de chaque barre. */
const BARRES_ECU: Record<number, { cy: number; y: number[] }> = {
  1: { cy: 48, y: [76] },
  2: { cy: 46, y: [72, 84] },
  3: { cy: 44, y: [68, 80, 92] },
};

type ProprietesEcusson = Commun & {
  /** 1, 2 ou 3. Une valeur hors échelle retombe sur le rang 1. */
  rang: number;
  /** Hauteur servie. 62 = la plaque nue de `.ecu`, sans modificateur. */
  taille?: TailleEcusson;
};

export function Ecusson({ rang, taille = 62, ton, titre, className }: ProprietesEcusson) {
  const trace = BARRES_ECU[rang] ?? BARRES_ECU[1];

  return (
    <svg
      className={classes("ecu", [
        taille !== 62 && `ecu--${taille}`,
        ton && `ico--${ton}`,
        className,
      ])}
      viewBox="0 0 100 120"
      {...accessibilite(titre)}
    >
      <path d={CONTOUR_ECU} />
      <circle cx="50" cy={trace.cy} r="11" />
      {trace.y.map((y) => (
        <path key={y} d={`M36 ${y}h28`} />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3 · LES GLYPHES DE PLATEFORME — § 6.4, famille `marque`

   UN SEUL JEU pour les quatre réseaux. Le site en portait deux : ces
   marques officielles, et une seconde série redessinée puis teintée en
   accent. Le même réseau ne peut pas avoir deux visages sur le même site,
   et entre les deux le § 6.4 tranche seul : la marque officielle, en
   monochrome, jamais la redessinée.

   La couleur est HÉRITÉE — `.ico--marque` pose `fill:currentColor`. C'est
   le contexte qui décide : le texte du lien sur fond clair, le néon en
   contexte `.acier`, sans une seule règle descendante (§ 0.11).
   ═══════════════════════════════════════════════════════════════════════════ */

const GLYPHES: Record<ReseauKey, string> = {
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.6-1.62-.95-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
};

type ProprietesLogoReseau = Commun & {
  reseau: ReseauKey;
  /** Taille servie. 32 partout où le site le sert aujourd'hui. */
  taille?: TailleIcone;
};

export function LogoReseau({
  reseau,
  taille = 32,
  ton,
  titre,
  className,
}: ProprietesLogoReseau) {
  return (
    <svg
      className={classes("ico ico--marque", [
        taille !== 24 && `ico--${taille}`,
        ton && `ico--${ton}`,
        className,
      ])}
      viewBox="0 0 24 24"
      {...accessibilite(titre)}
    >
      <path d={GLYPHES[reseau]} />
    </svg>
  );
}
