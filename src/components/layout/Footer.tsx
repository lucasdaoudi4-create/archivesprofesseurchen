import { Link } from "react-router-dom";
import Marque from "../brand/Marque";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC · CMP — 43 · PIED DE PAGE DU SITE — `.sitefoot`
   Les Archives du Professeur Chen — charte v1.0.0

   Portage du balisage de la maquette validée (l. 1245-1288), avec deux
   corrections que la charte impose.

   ── COMPOSITION ───────────────────────────────────────────────────────────

   `class="sitefoot acier mat-acier"`, comme la barre : la géométrie, le
   contexte de tokens, la matière. Les quatre redéfinitions locales de token
   de la maquette (`--texte-tertiaire`, `--accent`, `--focus`, `color`) sont
   supprimées — c'est le contexte qui fait le travail (§ 0.3, interdit 3).

   Les deux `style=""` en dur de la maquette disparaissent aussi :
     · `margin-bottom:var(--sp-4)` sur la marque      → `mb-4` (mise en page)
     · `color:…;font-size:14.5px;max-width:38ch`      → `.corps-s .t-tertiaire`

   ── CORRECTION 1 · LES QUATRE LIENS « INFORMATIONS » ─────────────────────

   Dans la maquette, les quatre pointent tous sur `#contact` : ce sont des
   marque-places d'une maquette à vues. Les destinations réelles viennent du
   plan de site du socle § 0.27. Les LIBELLÉS, eux, sont ceux de la maquette
   — « Conditions de vente », et non le « CGV / CGU » de l'ancien pied.

   ── CORRECTION 2 · LES TROIS MENTIONS DU BAS ─────────────────────────────

   Le pied porte les trois mentions obligatoires, et il est le seul endroit
   du site où elles vivent :

     1. AFFILIATION — reprise littérale de la maquette. Le chapitre 02
        § 12.7 et le socle § 0.36 la veulent sur toute page qui porte un
        lien affilié ;
     2. GÉNÉRATION PAR IA — chapitre 07 § 7.14 : « Toute page qui présente
        le décor ou le narrateur porte une mention explicite. Elle vit dans
        le pied de page, avec les mentions d'affiliation. » Formulation
        type reprise telle quelle, comme le chapitre l'exige ;
     3. NON-AFFILIATION — chapitre 02 § 13.3, « obligatoire sur toute page
        où l'emblème apparaît, et sur tout support commercial ». La
        formulation retenue est celle du § 13.3, mot pour mot ; elle
        remplace le « Nintendo, Game Freak ou The Pokémon Company » de la
        maquette, que le chapitre ne connaît pas.

   Puis la ligne de signature du § 13.2, séparateur ` · `.

   ── CE QUE LE PIED NE PORTE PLUS ──────────────────────────────────────────

   Les six icônes de réseaux de l'ancien pied : la maquette ne les a pas, et
   le pied renvoie déjà vers `/reseaux`, qui les tient toutes avec leurs
   pseudonymes. Le `sameAs` des cinq réseaux vit en JSON-LD (§ 0.29), pas
   dans le chrome.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Colonne « Le lieu » — les cinq destinations du site. */
const LE_LIEU = [
  { to: "/formation", libelle: "La formation" },
  { to: "/laboratoire/paliers", libelle: "Les paliers" },
  { to: "/minecraft", libelle: "L'Académie" },
  { to: "/discord", libelle: "Le Discord" },
  { to: "/reseaux", libelle: "Les réseaux" },
];

/** Colonne « Informations ». Libellés de la maquette, cibles du § 0.27. */
const INFORMATIONS = [
  { to: "/contact", libelle: "Contact" },
  { to: "/mentions-legales", libelle: "Mentions légales" },
  { to: "/cgv", libelle: "Conditions de vente" },
  { to: "/confidentialite", libelle: "Confidentialité" },
];

export default function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="sitefoot acier mat-acier">
      <div className="wrap">
        <div className="sitefoot__g">
          <div>
            <Marque className="mb-4" />
            <p className="corps-s t-tertiaire">
              Une formation, un serveur, une communauté. Édité par LHM Studio.
            </p>
          </div>

          <div>
            <h4>Le lieu</h4>
            <ul>
              {LE_LIEU.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.libelle}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Informations</h4>
            <ul>
              {INFORMATIONS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.libelle}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* `.legal` porte la mesure de 74ch, l'interligne et la couleur ;
            `.sitefoot__legal` ne pose que le filet et le rythme. La
            gouttière entre les quatre mentions est de la mise en page. */}
        <div className="sitefoot__legal grid gap-4">
          <p className="legal">
            Communication commerciale — certains liens de ce site sont des liens
            affiliés. Leur utilisation peut me permettre de percevoir une
            commission, sans coût supplémentaire pour vous. Les appréciations de
            qualité et de modération correspondent à mon expérience personnelle
            au moment de la publication&nbsp;; les modèles et leurs règles
            évoluent vite. Dernière mise à jour&nbsp;: septembre 2026.
          </p>
          <p className="legal">
            Les visuels de ce site — le laboratoire, le narrateur, les planches
            de décor — sont générés par intelligence artificielle avec les
            outils présentés dans la formation. Aucun décor construit, aucune
            équipe, aucun studio loué.
          </p>
          <p className="legal">
            Site non affilié à The Pokémon Company. Pokémon™ et les noms
            associés sont des marques de leurs ayants droit.
          </p>
          <p className="legal">
            ©&nbsp;{annee} Les Archives du Professeur Chen&nbsp;·&nbsp;LHM Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
