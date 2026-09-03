import type { Pictogramme } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   PICTOGRAMME DE SECTION — ARC · CHT — 06 §6.6
   Les Archives du Professeur Chen — charte v1.0.0

   « Un pictogramme OUVRE une section. Il donne son climat avant que le
     premier mot soit lu. Il ne se clique pas, il ne signale rien, il ne
     remplace pas un titre. Un seul par section, posé au-dessus du surtitre
     `.eyebrow`, aligné à gauche sur la marge du contenu. »

   Les cinq tracés sont RECOPIÉS du chapitre 06, sans retouche : les cinq
   objets sont relevés sur les images de référence — le microscope et le
   carnet sur la station de travail, le cylindre à œufs sur la salle
   d'incubation, les vitrines sur la galerie d'archives, la paillasse ovale
   à chant bordeaux sur le plateau. Aucun n'est inventé, et aucun ne se
   redessine ici.

   L'enveloppe est celle du §6.6, à la lettre : grille `0 0 48 48`, zone vive
   44 × 44, `role="img"` et son libellé. La taille servie et l'épaisseur de
   trait qui va avec appartiennent à `.pic` (31-icones.css) — ce composant
   n'écrit ni l'une ni l'autre, et n'écrit aucune couleur : `.pic` lit
   `--accent`, qui vaut le bordeaux sur clair et le néon sous `.acier`.
   ═══════════════════════════════════════════════════════════════════════════ */

const TRACES: Record<Pictogramme, JSX.Element> = {
  "pic-microscope": (
    <>
      <path d="M6 44h36" />
      <path d="M17 43h14l-2.6-5h-8.8z" />
      <path d="M24 38v-4.4" />
      <path d="M13.6 33.6h20.8" />
      <path d="M24 33.6v-4" />
      <path d="M21.6 29.6h4.8v-3.4h-4.8z" />
      <path d="M24 26.2V15.6" />
      <path d="M20.6 15.6h6.8v-4.4h-6.8z" />
      <path d="M31.8 33.6V21.4" />
      <path d="M24.4 21.4h7.4" />
      <circle cx="31.8" cy="27.4" r="2.6" />
    </>
  ),

  "pic-incubation": (
    <>
      <path d="M11 44h26" />
      <path d="M14 44v-4h20v4" />
      <path d="M14 40V10" />
      <path d="M34 40V10" />
      <path d="M11.4 10h25.2" />
      <path d="M19 6.4h10v3.6H19z" />
      <path d="M24 17.6c-4.4 4.8-6.6 8.4-6.6 11.6a6.6 6.6 0 0 0 13.2 0c0-3.2-2.2-6.8-6.6-11.6z" />
      <path d="M17.4 35.6h13.2" />
    </>
  ),

  "pic-vitrine": (
    <>
      <rect x="7" y="5" width="34" height="38" rx="2" />
      <path d="M7 17.4h34" />
      <path d="M7 29.8h34" />
      <path d="M24 5v38" />
      <circle cx="15.4" cy="13.4" r="2.8" />
      <path d="M29.4 15.6h7.2" />
      <path d="M11.6 27.4l3-4.2 2.6 3.2 1.8-2.2 2.4 3.2z" />
      <circle cx="32.6" cy="25.2" r="3.4" />
      <path d="M11.6 39.8h8.8" />
      <path d="M28.2 39.8h8.8" />
    </>
  ),

  "pic-paillasse": (
    <>
      <ellipse cx="24" cy="26" rx="18" ry="6.8" />
      <path d="M6 26v3.2c0 3.8 8.1 6.8 18 6.8s18-3 18-6.8V26" />
      <path d="M18.4 25.6l1.6-2.8h8l-1.6 2.8z" />
      <path d="M22.4 22.8l1.6 2.8" />
      <path d="M31.8 24.2V15.6h-4.4" />
      <path d="M24.6 12.4h5.8l-1.8 3.2h-5.8z" />
      <path d="M13.4 24.6v-4.2h3.4v4.2" />
    </>
  ),

  "pic-carnet": (
    <>
      <path d="M24 13.6c-4.8-3-10.8-3.4-16.2-2.6v23.4c5.4-.8 11.4-.4 16.2 2.6 4.8-3 10.8-3.4 16.2-2.6V11c-5.4-.8-11.4-.4-16.2 2.6z" />
      <path d="M24 13.6v23.4" />
      <path d="M11.8 18.6h7.6" />
      <path d="M11.8 23h7.6" />
      <path d="M11.8 27.4h5.2" />
      <path d="M28.6 18.6h7.6" />
      <path d="M28.6 23h4.8" />
    </>
  ),
};

/* Les libellés du tableau du §6.6, mot pour mot. */
const LIBELLES: Record<Pictogramme, string> = {
  "pic-microscope": "Le microscope",
  "pic-incubation": "L’œuf en incubation",
  "pic-vitrine": "La vitrine",
  "pic-paillasse": "La paillasse",
  "pic-carnet": "Le carnet",
};

export default function PictoSection({ nom }: { nom: Pictogramme }) {
  return (
    <svg className="pic" viewBox="0 0 48 48" role="img" aria-label={LIBELLES[nom]} focusable="false">
      {TRACES[nom]}
    </svg>
  );
}
