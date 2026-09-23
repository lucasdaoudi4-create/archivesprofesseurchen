import { Link, useLocation } from "react-router-dom";
import Marque from "../brand/Marque";
import { legal, liens, routes, site } from "../../data/site";

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

   ── CORRECTION 3 · LE NIVEAU DES TITRES DE COLONNE ────────────────────────

   Les deux titres de colonne étaient des `<h4>`. Le pied est commun aux dix
   routes, et sur huit d'entre elles le titre le plus profond qui précède est
   un `h2` — sur `/discord`, c'est même le `h1` : `h2 → h4` et `h1 → h4` sont
   des sauts de niveau, et axe-core lève `heading-order`.

   Ils passent donc en `<h2>`. Le pied est un point de repère, chaque page
   n'a qu'un seul `h1`, donc `h1 → h2` ne saute jamais, quel que soit le
   contenu de la page. Vérifié sur les dix routes : aucun nouveau saut.

   Le style, lui, ne bouge pas : `.eyebrow` (chapitre 04, l'instrument
   monospace) porte la fonte, le corps de 11 px, les capitales et la couleur
   d'accent. La classe est aussi ce qui EXCLUT le titre de la règle de
   `20-base.css` qui met les titres en Fraunces — cette règle nomme
   littéralement `<h2 class="eyebrow">` comme le motif attendu. Le sélecteur
   `.sitefoot h4` de `30-composants.css` ne mord plus : c'est au propriétaire
   de ce fichier de le renommer en `.sitefoot h2`, ce qui rendra son
   interlettrage `--ls-l` et sa graisse `--fw-semi` (la couche `composants`
   passe après `tokens`, elle reprendra donc la main sans rien casser).

   ── LES COLONNES SONT DES POINTS DE REPÈRE ────────────────────────────────

   Le chapitre 08 B-24 le demande mot pour mot : « `<footer>` avec
   `<nav aria-label="…">` par colonne ». Le titre de colonne sert d'étiquette
   par `aria-labelledby` plutôt qu'un `aria-label` recopié : le nom du point
   de repère est alors exactement le libellé visible.

   ── CE QUE LE PIED NE PORTE PLUS ──────────────────────────────────────────

   Les six icônes de réseaux de l'ancien pied : la maquette ne les a pas, et
   le pied renvoie déjà vers `/reseaux`, qui les tient toutes avec leurs
   pseudonymes. Le `sameAs` des cinq réseaux vit en JSON-LD (§ 0.29), pas
   dans le chrome.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Colonne « Le lieu » — les cinq destinations du site. */
const LE_LIEU = [
  { to: "/formation", libelle: "La formation" },
  { to: liens.paliers, libelle: "Les paliers" },
  { to: "/minecraft", libelle: "L’Académie" },
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

/* ── OÙ LA MENTION LONGUE DU § 7.14 EST DUE ───────────────────────────────
   « Toute page qui présente le décor ou le narrateur porte une mention
   explicite. » Ce sont les quatre routes qui montent une photo : l'accueil
   (héros, notice, atelier), la notice de `/formation`, l'affiche du lecteur
   de `/reseaux`, et la planche de la 404. Partout ailleurs, c'est la mention
   générale — elle ne s'y AJOUTE pas, elle y remplace la longue. */
const ROUTES_A_VISUELS = new Set<string>([
  routes.accueil,
  routes.formation,
  routes.reseaux,
  routes.introuvable,
]);

export default function Footer() {
  const annee = new Date().getFullYear();
  const { pathname } = useLocation();

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

          <nav aria-labelledby="pied-lieu">
            <h2 className="eyebrow" id="pied-lieu">
              Le lieu
            </h2>
            <ul>
              {LE_LIEU.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.libelle}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="pied-infos">
            <h2 className="eyebrow" id="pied-infos">
              Informations
            </h2>
            <ul>
              {INFORMATIONS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.libelle}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* `.legal` porte la mesure de 74ch, l'interligne et la couleur ;
            `.sitefoot__legal` ne pose que le filet et le rythme. La
            gouttière entre les quatre mentions est de la mise en page. */}
        {/* ── LES MENTIONS SONT LUES, PLUS RECOPIÉES ───────────────────────
            Les trois premières étaient écrites en dur ici alors que
            `src/data/site.ts` les déclare — et, recopiées à la main, elles
            avaient dérivé de leur source. Trois écarts, dont deux comptent :

              · l'affiliation avait perdu « de facilité d'usage » dans
                l'énumération des appréciations, et posait une espace
                insécable ordinaire devant le point-virgule là où le § 4.7
                impose la fine (` `) ;
              · la non-affiliation ne nommait QUE The Pokémon Company, quand
                la source nomme « Nintendo, Game Freak ou The Pokémon
                Company » — une mention légale qui cite moins d'ayants droit
                que ce que l'éditeur a décidé de citer ;
              · la mention de génération disait « ce site » là où la source
                dit « cette page », et le § 7.14 impose sa formulation MOT
                POUR MOT.

            Ce dernier point n'est pas qu'une recopie : `site.ts` déclare DEUX
            mentions et dit laquelle sert quand — « Elle remplace
            `piedGeneration` sur ces pages-là — elle ne s'y ajoute pas ». La
            version longue appartient aux pages qui MONTRENT le décor ou le
            narrateur (§ 7.14) ; les autres portent la mention générale. Le
            pied lit donc la route pour choisir, au lieu de servir la version
            longue partout — y compris sur `/contact`, qui ne montre rien. */}
        <div className="sitefoot__legal grid gap-4">
          <p className="legal">{legal.piedAffiliation}</p>
          <p className="legal">
            {ROUTES_A_VISUELS.has(pathname) ? legal.piedGenerationDecor : legal.piedGeneration}
          </p>
          <p className="legal">{legal.piedNonAffiliation}</p>
          <p className="legal">
            ©&nbsp;{annee} {site.name}&nbsp;·&nbsp;{site.editeur}
          </p>
        </div>
      </div>
    </footer>
  );
}
