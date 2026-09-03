import type { ReseauKey } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LES TROIS TRACÉS DE L'ACCUEIL — chapitre 06 · `31-icones.css`
   Les Archives du Professeur Chen — charte v1.0.0

   Trois familles distinctes, et le chapitre 06 interdit de les confondre :

     · `.ico`  — le TRAIT des Archives. Grille 24, `fill:none`,
                 `stroke:currentColor`, bouts ronds. C'est `Coche`.
     · `.ecu`  — le BLASON. Grille 100 × 120, sa propre épaisseur. C'est
                 `Ecusson`. Le servir avec `.ico--16` rendrait un trait de
                 0,29 px : l'écusson disparaîtrait sans erreur levée.
     · `.ico--marque` — les GLYPHES DE PLATEFORME. Ils appartiennent à un
                 autre système graphique : silhouette PLEINE, `stroke:none`.
                 Le § 6.4 est explicite, « on ne les redessine pas au style
                 maison — ce serait une déformation de marque ». Les quatre
                 tracés ci-dessous sont les marques officielles monochromes,
                 normalisées en `viewBox 0 0 24 24` ; ce sont donc les seuls
                 tracés du site à ne pas suivre le trait de la charte, et
                 c'est voulu. La maquette les dessinait au filet 1,5 : c'est
                 l'écart que la charte tranche.

   Les trois sont DÉCORATIFS partout où ils servent sur l'accueil — la coche
   double un item de liste déjà écrit, l'écusson double le nom du palier,
   le glyphe double le nom du réseau. Ils portent donc `aria-hidden`, et
   aucun ne double l'annonce du lecteur d'écran.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── La coche des listes de motifs ──────────────────────────────────────── */

export function Coche() {
  return (
    <svg className="ico ico--20 ico--action" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12 5 5L19 7" />
    </svg>
  );
}

/* ── L'écusson de palier ────────────────────────────────────────────────────
   Le blason est commun aux trois rangs ; seul le nombre de barres change,
   comme le rang. Le tracé est celui de la maquette validée, débarrassé de
   son `<g stroke-width>` : `.ecu` porte déjà le trait, et le réécrire ici
   sortirait de la compensation optique du chapitre 06.                     */

const BARRES: Record<number, { cy: number; y: number[] }> = {
  1: { cy: 48, y: [76] },
  2: { cy: 46, y: [72, 84] },
  3: { cy: 44, y: [68, 80, 92] },
};

export function Ecusson({ rang }: { rang: number }) {
  const trace = BARRES[rang] ?? BARRES[1];

  return (
    <svg className="ecu" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
      <path d="M50 6 88 20v40c0 28-18 44-38 52C30 104 12 88 12 60V20z" />
      <circle cx="50" cy={trace.cy} r="11" />
      {trace.y.map((y) => (
        <path key={y} d={`M36 ${y}h28`} />
      ))}
    </svg>
  );
}

/* ── Les quatre glyphes de plateforme ───────────────────────────────────── */

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

export function LogoReseau({ reseau }: { reseau: ReseauKey }) {
  return (
    <svg
      className="ico ico--32 ico--marque"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={GLYPHES[reseau]} />
    </svg>
  );
}
