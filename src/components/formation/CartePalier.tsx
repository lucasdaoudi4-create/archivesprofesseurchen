import { blocPaliers, patreon, type Palier } from "../../data/site";
import { Ecusson, Icone } from "../ui/Icones";

/* ═══════════════════════════════════════════════════════════════════════════
   CARTE DE PALIER — ARC · CMP — 27 · chapitre 10, socle §0.26, Amendement A1.1
   Les Archives du Professeur Chen — charte v1.0.0

   ── LE CONTRAT DE BALISAGE DE `32-membre.css`, TENU À LA LETTRE ───────────

   Le fichier de styles ne peut ni redéfinir un jeton, ni réécrire un dégradé.
   Trois compositions sont donc OBLIGATOIRES ici, et ce sont les seules
   manières conformes d'obtenir la matière et le contexte de chaque rang :

     rang 01   <div class="palier__plaque">                 acier clair, écrit en CSS
     rang 02   <div class="palier__plaque mat-email">       émail bordeaux
     rang 03   <div class="palier__plaque mat-acier acier"> acier sombre + néon

   Le rang 03 porte `acier` EN PLUS de `mat-acier` : c'est `acier` qui
   rebascule `--accent` sur le néon, d'où la couleur de libellé exigée par le
   §0.26. Sans elle, `--accent` resterait le bordeaux, qui vaut 1,62 sur
   l'acier — un échec de contraste silencieux.

   ── CE QUE LA CARTE AFFICHE, ET POURQUOI ──────────────────────────────────

   LE PRIX EST OBLIGATOIRE. L'Amendement 1 §A1.1 restreint la règle « pas de
   prix affiché » au contenu éditorial : sur une carte de palier, dans le hero
   et dans le comparatif, le montant s'affiche, avec sa périodicité. Le cacher
   reviendrait à dissimuler au visiteur ce qu'on attend de lui.

   LA MISE EN AVANT NE SE FAIT QU'EN DEUX POINTS. `data-mise="recommande"`
   épaissit le filet — il ne déplace pas la carte, ne l'agrandit pas,
   n'ajoute pas de couleur — et l'étiquette `.mention` l'écrit en toutes
   lettres, parce qu'un filet plus épais n'est pas une information (SC 1.4.1).

   LES NOMS SONT CEUX DE L'AUTEUR. Amendement 1 §A1.4 : « ce sont les noms
   réels de l'auteur, la charte ne les renomme pas ». Jeune Dresseur,
   Champion d'Arène, Maître de la Ligue viennent de `site.ts`, et de nulle
   part ailleurs.

   ── L'ÉCUSSON ────────────────────────────────────────────────────────────

   Un blason par rang, sur la grille 100 × 120 de `.ecu` (31-icones.css), qui
   pose seule la hauteur servie et l'épaisseur de trait qui va avec. Le
   nombre de barres dit le rang, et le disque monte d'autant.

   Le tracé était recopié ici ET dans les glyphes de l'accueil — deux copies
   du même blason, qui n'attendaient qu'une retouche pour diverger. Il vit
   maintenant une seule fois, dans `components/ui/Icones`, et cette carte ne
   fait plus que le demander. Aucun `titre` n'est passé : le signe reste
   donc `aria-hidden`, et c'est voulu — le nom du palier est écrit à deux
   centimètres de là, le redire en libellé d'image ferait doubler l'annonce.
   ═══════════════════════════════════════════════════════════════════════════ */

/* La matière de la plaque, par rang. Voir le contrat de balisage ci-dessus. */
const MATIERE_PLAQUE: Record<number, string> = {
  1: "",
  2: "mat-email",
  3: "mat-acier acier",
};

export default function CartePalier({ palier }: { palier: Palier }) {
  const plaque = ["palier__plaque", MATIERE_PLAQUE[palier.rang]].filter(Boolean).join(" ");

  return (
    <article
      className={`palier palier--0${palier.rang}`}
      data-mise={palier.phare ? "recommande" : undefined}
    >
      <div className={plaque}>
        <Ecusson rang={palier.rang} />
        <div>
          <div className="palier__code">{palier.code}</div>
          <div className="palier__n">{palier.nom}</div>
        </div>
      </div>

      <div className="palier__corps">
        {palier.phare && <span className="mention self-start">Recommandé</span>}

        {palier.prix && (
          <div className="palier__prix">
            {palier.prix}
            {palier.periodicite && <span>{palier.periodicite}</span>}
          </div>
        )}

        {palier.accroche && <p className="palier__acc">{palier.accroche}</p>}

        {palier.ouvre.length > 0 && (
          <ul className="palier__l">
            {palier.ouvre.map((ouverture) => (
              <li key={ouverture.titre}>
                <Icone nom="coche" taille={20} />
                <span>
                  <b>{ouverture.titre}</b>
                  {ouverture.texte}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="palier__pied">
          {/* Trois boutons portent le même libellé visible : le nom du palier
              est ajouté au nom accessible, sinon un relevé de liens donne
              trois fois « Rejoindre ce palier » sans dire lequel. */}
          <a className="btn btn--bloc" href={patreon.url} target="_blank" rel="noopener">
            {blocPaliers.ctaCarte}
            <span className="sr-only"> — {palier.nom}</span>
            <span className="btn__f" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
