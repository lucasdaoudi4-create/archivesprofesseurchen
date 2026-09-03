/* ═══════════════════════════════════════════════════════════════════════════
   LE PANNEAU DE MATIÈRES — le côté droit du split quand la photo n'existe pas
   Les Archives du Professeur Chen — charte v1.0.0

   `heroPhoto` et `portraitPhoto` valent `null` dans `src/data/site.ts` : la
   validation juridique de l'enseigne du décor n'est pas rendue (07-imagerie
   § 7.14), donc on ne publie pas les images. Le split du hero, lui, reste un
   split : l'Amendement 1 § A1.2 décrit une composition à deux panneaux, pas
   un panneau et un trou.

   Ce composant remplit donc la scène avec les MATIÈRES CODÉES du système —
   `.mat-acier` (le mur brossé), `.mat-email` (le montant et le socle),
   `.mat-verre` (la vitrine). Trois règles le gouvernent :

     · AUCUNE IMAGE, aucun dégradé écrit ici. Les cinq matières vivent dans
       `03-tokens-grille.css`, et elles seules : ce sont elles que ciblent les
       compensations `prefers-contrast` et `forced-colors` de
       `99-preferences.css`. Une matière recopiée en local sortirait de ces
       compensations sans qu'aucune erreur ne soit levée.
     · AUCUNE ENSEIGNE REDESSINÉE — troisième interdit d'A1.2, « une seule
       enseigne par écran ». L'enseigne vit dans la photo ; en son absence,
       elle ne vit nulle part. Pas d'emblème, pas de halo, pas d'étincelles.
     · AUCUNE LÉGENDE. `.legende` nomme un SUJET photographié ; posée sur une
       composition de matières, elle décrirait une image qui n'est pas là.

   La géométrie est de la mise en page locale, donc en utilitaires Tailwind
   (socle § 0.21) : des fractions de la boîte, jamais une valeur arbitraire.
   Les proportions changent avec la variante pour que les deux surfaces de
   l'accueil ne soient pas la même image répétée.

   Le composant est DÉCORATIF : il ne porte aucune information que le texte
   voisin ne porte déjà, donc `aria-hidden`.
   ═══════════════════════════════════════════════════════════════════════════ */

type Variante = "plateau" | "scene";

interface Props {
  /** `plateau` : la scène haute du hero. `scene` : la scène large d'une notice. */
  variante: Variante;
}

export default function PanneauMatiere({ variante }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Le mur du fond : acier inoxydable brossé. */}
      <div className="mat-acier absolute inset-0" />

      {variante === "plateau" ? (
        <>
          {/* La vitrine : une tranche de verre en travers du mur, arrêtée
              avant le montant pour que l'émail reste franc. */}
          <div className="mat-verre absolute left-0 right-1/4 top-1/4 h-2/5" />
          {/* La paillasse : le socle d'émail bordeaux. */}
          <div className="mat-email absolute inset-x-0 bottom-0 h-1/3" />
        </>
      ) : (
        <>
          {/* Le montant d'émail prend le tiers gauche : la notice est large,
              elle se tient debout sur une verticale, pas sur un socle. */}
          <div className="mat-email absolute inset-y-0 left-0 w-1/3" />
          <div className="mat-verre absolute bottom-1/4 right-0 top-1/4 w-1/2" />
        </>
      )}

      {/* Le montant d'émail du bord extérieur — l'arête qui ferme la scène,
          à l'aplomb de celle qui ouvre le panneau clair. `--trait-pilier`
          vaut 10px, soit `w-2.5` sur la trame de 4. */}
      <div className="mat-email absolute inset-y-0 right-0 w-2.5" />
    </div>
  );
}
