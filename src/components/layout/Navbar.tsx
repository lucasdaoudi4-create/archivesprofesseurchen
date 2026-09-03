import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Marque from "../brand/Marque";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC · CMP — 20 · BARRE DE NAVIGATION DU SITE — `.sitenav`
   Les Archives du Professeur Chen — charte v1.0.0

   Portage du balisage de la maquette validée (l. 553-578), sans la barre
   `.demo`, qui est un outil de démonstration hors site.

   ── CE QUE LE BALISAGE DOIT PORTER, ET POURQUOI ──────────────────────────

   `class="sitenav acier mat-acier"` — les trois, et dans cet ordre
   (30-composants.css, « Composition : ce que le balisage doit porter ») :

     · `.sitenav`   la géométrie du composant : hauteur `--h-nav`, position
                    collante, filet de fermeture ;
     · `.acier`     la classe de CONTEXTE (socle § 0.11). Elle bascule tout
                    le jeu de tokens d'un coup : `--texte` passe au blanc,
                    `--accent` au néon, `--focus` au néon, `--bordure` au
                    filet clair. Aucune redéfinition locale de token n'est
                    écrite ici — c'est l'interdit n° 3 du § 0.3 ;
     · `.mat-acier` la MATIÈRE, lue et non recopiée. C'est elle, et elle
                    seule, que ciblent les compensations `prefers-contrast`
                    et `forced-colors` de `99-preferences.css`.

   `.sitenav__in` compose `.wrap` : la gouttière et la largeur de conteneur
   viennent du système de grille, jamais d'une copie locale.

   ── LES HUIT ENTRÉES ──────────────────────────────────────────────────────

   La maquette en porte huit : sept liens de page plus le bouton
   « Rejoindre ». `src/data/site.ts` n'en déclarait que six — il manquait
   « Paliers ». Les libellés et l'ordre sont ceux de la maquette ; les
   destinations sont celles du plan de site du socle § 0.27.

   Elles ne sont pas lues dans `site.ts` : ce fichier n'appartient pas à ce
   lot, et la barre du chrome a sa propre liste — l'ordre et les libellés du
   chrome sont un fait de charte, pas une donnée éditoriale.

   ── L'ÉTAT COURANT EST DIT DEUX FOIS ─────────────────────────────────────

   `NavLink` pose `aria-current="page"`, et le CSS y accroche À LA FOIS la
   couleur d'accent ET le filet de 2 px sous le libellé — jamais la couleur
   seule (SC 1.4.1). Le bouton `.sitenav__cta` est un `Link` et non un
   `NavLink` : il ne doit pas prendre l'état courant, sans quoi la règle
   d'état écraserait son fond d'accent. C'est exactement ce que faisait le
   script de la maquette, qui excluait `.sitenav__cta` de sa boucle.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Les sept liens de page. `fin` marque la racine, qui ne doit pas rester
 *  active sur toutes les routes. */
const LIENS = [
  { to: "/", libelle: "Accueil", fin: true },
  { to: "/formation", libelle: "Formation" },
  { to: "/laboratoire/paliers", libelle: "Paliers" },
  { to: "/minecraft", libelle: "Minecraft" },
  { to: "/discord", libelle: "Discord" },
  { to: "/reseaux", libelle: "Réseaux" },
  { to: "/contact", libelle: "Contact" },
];

export default function Navbar() {
  const [ouvert, setOuvert] = useState(false);
  const { pathname } = useLocation();
  const burger = useRef<HTMLButtonElement>(null);

  // Le menu déroulant ne survit pas à un changement de route.
  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  // Échappement : on referme, et le focus revient sur le bouton qui a
  // ouvert — sans quoi il repart en tête de document.
  const fermer = useCallback(() => {
    setOuvert(false);
    burger.current?.focus();
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert, fermer]);

  return (
    <nav className="sitenav acier mat-acier" aria-label="Navigation principale">
      <div className="sitenav__in wrap">
        <Marque />

        {/* Visible sous 980px seulement (`30-composants.css`). Le libellé
            est un mot, pas une icône : rien à deviner, et il reste lisible
            en `forced-colors`. */}
        <button
          ref={burger}
          className="sitenav__burger"
          type="button"
          aria-expanded={ouvert}
          aria-controls="menu"
          onClick={() => setOuvert((v) => !v)}
        >
          Menu
        </button>

        <div className={ouvert ? "sitenav__l ouvert" : "sitenav__l"} id="menu">
          {LIENS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.fin}>
              {l.libelle}
            </NavLink>
          ))}
          <Link className="sitenav__cta" to="/laboratoire/paliers">
            Rejoindre
          </Link>
        </div>
      </div>
    </nav>
  );
}
