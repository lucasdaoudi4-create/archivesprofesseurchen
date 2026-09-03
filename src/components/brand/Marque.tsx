import { Link } from "react-router-dom";
import Embleme, { type TailleEmbleme } from "./Embleme";
import Wordmark from "./Wordmark";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC · LOG — 03 · LE VERROU DE CHROME — `.marque`
   Les Archives du Professeur Chen — charte v1.0.0

   Le Verrou B (chapitre 02 § 6.2) rendu pour l'interface : emblème à
   gauche, lettrage deux lignes à droite. Il ouvre la barre `.sitenav` et la
   première colonne du pied `.sitefoot`.

   ── ACCESSIBILITÉ ─────────────────────────────────────────────────────────

   L'emblème est `aria-hidden` : le nom est déjà écrit à côté, et le § 14.1
   le dit — « titre absent → aria-hidden ». La maquette met un
   `aria-label` sur le `<svg>` ET affiche le lettrage : le nom serait annoncé
   deux fois.

   Le nom accessible du lien est posé sur le lien lui-même, parce que le
   lettrage est en deux boîtes et que la concaténation dépend du lecteur. Il
   CONTIENT le texte visible, mot pour mot et dans l'ordre — c'est ce
   qu'exige le SC 2.5.3 (Label in Name) — et il ajoute la destination.

   ── ZONE DE PROTECTION ────────────────────────────────────────────────────

   § 7 : X = 0,25 D, ramené à 0,15 D « en interface dense (barre de
   navigation ≤ 64 px) ». Sur la barre, la réserve est tenue par la
   gouttière `--sp-6` de `.sitenav__in` et par le rembourrage `.wrap` ;
   aucun texte, aucun filet n'entre entre l'emblème et le premier lien.
   ═══════════════════════════════════════════════════════════════════════════ */

type Props = {
  /** Destination. Toujours l'accueil sur ce site. */
  to?: string;
  /** Taille servie de l'emblème. 36 sur la barre, 52 au pied. */
  taille?: TailleEmbleme;
  /** `bandeau` = Verrou B (deux lignes) · `reduit` = Verrou C. */
  verrou?: "bandeau" | "reduit";
  className?: string;
};

export default function Marque({
  to = "/",
  taille = 36,
  verrou = "bandeau",
  className = "",
}: Props) {
  return (
    <Link
      to={to}
      className={["marque", className].filter(Boolean).join(" ")}
      aria-label="Les Archives du Professeur Chen — accueil"
    >
      {/* `.t-accent` lit --accent : le néon sur l'acier de la barre et du
          pied (§ 9, variante d'accent en V1 · 9,72:1 sur #2A2F32).
          Aucun halo : les deux tailles servies sont sous la charnière des
          40 px du § 10.2, et `Embleme` le refuserait de toute façon. */}
      <Embleme taille={taille} className="t-accent" />
      <Wordmark verrou={verrou} />
    </Link>
  );
}
