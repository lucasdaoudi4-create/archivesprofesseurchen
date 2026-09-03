import type { ReactNode } from "react";
import { planAuSol } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LE PLAN AU SOL — Amendement 1 § A1.3 · `.plan` · 30-composants.css § 18
   Les Archives du Professeur Chen — charte v1.0.0

   « Le sommaire de l'accueil EST le plan au sol des quatre zones, tracé au
     filet, en bande d'acier sous le hero. Chaque pièce est un lien ; le
     disque numéroté porte le rang, le libellé porte la destination. UNE
     RANGÉE DE PASTILLES NUMÉROTÉES NE LE REMPLACE PAS. »

   ── CE QUI EST EXÉCUTOIRE DANS CE FICHIER ────────────────────────────────

   1. C'EST UNE BANDE, PAS UNE SECTION. `.plan-bande` pose son rythme et son
      filet de fermeture ; `.bande` poserait un rythme de section et un fond.
      Composition obligatoire (30-composants.css, en-tête) :
      `class="plan-bande acier mat-acier"` — `.acier` est la classe de
      CONTEXTE, elle bascule tout le jeu de jetons d'un coup ; `.mat-acier`
      est la matière, lue et non recopiée.

   2. CHAQUE PIÈCE EST UN LIEN, et le lien est DANS le SVG : il enveloppe la
      forme, le disque, le rang et le libellé. Ce sont des ancres de page —
      les quatre destinations vivent sur l'accueil — donc des `<a href="#…">`
      et non des `<Link>` : React Router ne s'insère pas dans un `<svg>`, et
      n'aurait rien à y faire.

   3. LE NOM DE LA PIÈCE VIT DANS L'ÉTIQUETTE, LA DESTINATION DANS LE DESSIN.
      `aria-label="{pièce} — {destination}"`, exactement comme l'exige A1.3 :
      c'est le seul endroit où « Le plateau principal » est dit, et le dessin
      n'affiche, lui, que « La formation ».

   4. LE DESSIN RESTE ENTIER EN REPLI. À 979,98 px `.plan` passe en une
      colonne et la légende reprend toute la largeur — le plan ne se dégrade
      ni en pastilles, ni en carrousel (30-composants.css § 21).

   ── CE QUI VIENT D'OÙ ─────────────────────────────────────────────────────

   Le CONTENU — rangs, noms de pièce, libellés, ancres, légende — vient
   entièrement de `planAuSol` dans `src/data/site.ts`. La GÉOMÉTRIE reste
   ici : c'est un relevé du décor, pas une donnée éditoriale, et elle n'a
   aucun sens hors de ce viewBox. Les cinq classes d'un mot de la maquette
   (`.piece`, `.paillasse`, `.pt`, `.num`, `.nom`) sont préfixées par le
   socle § 0.12 ; ce sont les noms préfixés qui sont écrits ici.

   Le `data-vue=""` que la maquette laissait sur la première pièce est un
   résidu du commutateur de vues : il ne se porte pas.
   ═══════════════════════════════════════════════════════════════════════════ */

interface Geometrie {
  /** La forme de la pièce, tracée au filet. */
  forme: ReactNode;
  /** Le disque qui porte le rang. */
  pt: { cx: number; cy: number };
  /** L'ancrage du libellé de destination. */
  nom: { x: number; y: number };
}

/* Relevé du plan, viewBox 460 × 156. Le rang est la clé : il est la seule
   chose que la donnée et le dessin ont en commun. */
const GEOMETRIE: Record<string, Geometrie> = {
  "01": {
    forme: (
      <>
        <rect className="plan__piece" x="140" y="62" width="180" height="84" rx="1" />
        <ellipse className="plan__paillasse" cx="230" cy="106" rx="52" ry="22" />
      </>
    ),
    pt: { cx: 230, cy: 76 },
    nom: { x: 230, y: 140 },
  },
  "02": {
    forme: <rect className="plan__piece" x="140" y="10" width="180" height="44" rx="1" />,
    pt: { cx: 230, cy: 26 },
    nom: { x: 230, y: 46 },
  },
  "03": {
    forme: <rect className="plan__piece" x="10" y="34" width="118" height="112" rx="1" />,
    pt: { cx: 69, cy: 70 },
    nom: { x: 69, y: 106 },
  },
  "04": {
    forme: <circle className="plan__piece" cx="391" cy="90" r="56" />,
    pt: { cx: 391, cy: 72 },
    nom: { x: 391, y: 108 },
  },
};

export default function PlanAuSol() {
  return (
    <div className="plan-bande acier mat-acier">
      <div className="wrap plan">
        <svg
          className="plan__svg"
          viewBox="0 0 460 156"
          role="group"
          aria-label="Plan au sol du laboratoire — quatre zones"
          focusable="false"
        >
          {planAuSol.zones.map((zone) => {
            const geo = GEOMETRIE[zone.rang];
            if (!geo) return null;

            return (
              <a
                key={zone.rang}
                href={zone.ancre}
                aria-label={`${zone.piece} — ${zone.libelle}`}
              >
                {geo.forme}
                <circle className="plan__pt" cx={geo.pt.cx} cy={geo.pt.cy} r="10" />
                <text className="plan__num" x={geo.pt.cx} y={geo.pt.cy}>
                  {zone.rang}
                </text>
                <text className="plan__nom" x={geo.nom.x} y={geo.nom.y}>
                  {zone.libelle}
                </text>
              </a>
            );
          })}
        </svg>

        <p className="plan__lg">
          <b>{planAuSol.titre}</b>
          {planAuSol.legende}
        </p>
      </div>
    </div>
  );
}
