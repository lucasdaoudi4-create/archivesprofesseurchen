/* ═══════════════════════════════════════════════════════════════════════════
   ARC · LOG — 02 · LE LETTRAGE
   Les Archives du Professeur Chen — charte v1.0.0

   ── OÙ VIT LE LETTRAGE, ET SOUS QUELLE FORME ─────────────────────────────

   Le chapitre 02 § 5.3 pose une règle d'auteur : « Le lettrage livré est en
   contours, pas en texte vivant. Une resaisie change la largeur, et la
   largeur de 1,87 D est un verrou de construction. »

   Puis il ouvre UNE exception, et une seule :

     « Exception unique : la barre de navigation du site, où le lettrage
       peut être du texte pour rester net à toute densité d'écran. »

   Ce composant EST cette exception. Il ne sert que le chrome du site — la
   barre `.sitenav` et le pied `.sitefoot`, qui portent le même verrou. Tout
   autre emploi (carte OG, bannière, générique, affiche, tampon) passe par
   `arc-lettrage.svg`, vectorisé, livré comme fichier et jamais recomposé
   ici : c'est le § 5.3 et l'interdit n° 10 du § 11.

   ── LE COMPOSANT N'ÉCRIT AUCUN STYLE ──────────────────────────────────────

   Les verrous typographiques du § 5.2 sont tenus par `.marque__t`, dans
   `30-composants.css` § 3 (« LA MARQUE DANS LA BARRE — `.marque` ·
   ARC · CHT — 02 »). Ce fichier ne pose que le balisage : deux lignes,
   la seconde imbriquée dans la première, comme la maquette validée.

   Écart à signaler, qui n'est pas le mien à corriger : `.marque__t` met la
   ligne 1 en `--f-display` (Fraunces) là où le § 5.1 exige la fonte de
   labeur — « Grotesque, pas de serif […] jamais Fraunces ». L'arbitrage a
   été rendu au lot L1, en faveur de la maquette, et la déclaration vit dans
   `30-composants.css`, qui n'appartient pas à ce lot.

   ── LES DEUX VERROUS QUE LE CHROME EMPLOIE ────────────────────────────────

   § 6.2 · Verrou B — Bandeau : emblème à gauche, lettrage deux lignes à
   droite. C'est le verrou de l'en-tête de site et du pied de page.

   § 6.3 · Verrou C — Réduit : emblème + `LES ARCHIVES` seul. Sa condition
   d'emploi est stricte — « n'est autorisé que là où le nom complet est déjà
   présent dans le texte de la page ». Sur ce site, le nom complet est dans
   la mention de non-affiliation du pied (§ 13.3), sur toutes les pages.
   ═══════════════════════════════════════════════════════════════════════════ */

type Props = {
  /** `bandeau` : les deux lignes (Verrou B). `reduit` : la première seule
   *  (Verrou C) — à n'employer que si le nom complet est ailleurs sur la
   *  page. */
  verrou?: "bandeau" | "reduit";
  className?: string;
};

export default function Wordmark({ verrou = "bandeau", className = "" }: Props) {
  const classes = ["marque__t", className].filter(Boolean).join(" ");

  if (verrou === "reduit") {
    return <span className={classes}>Les Archives</span>;
  }

  return (
    <span className={classes}>
      Les Archives<span>du Professeur Chen</span>
    </span>
  );
}
