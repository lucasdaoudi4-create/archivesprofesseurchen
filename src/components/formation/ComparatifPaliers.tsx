import {
  blocPaliers,
  comparatif,
  libelleAcces,
  paliers,
  paliersPayants,
  type PalierKey,
  type PalierPayantKey,
} from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LE COMPARATIF DES PALIERS — ARC · CMP — 28 · 32-membre.css §5
   Les Archives du Professeur Chen — charte v1.0.0

   Une ligne = une chose que le membre peut faire, jamais un argument de
   vente (chapitre 10 §10.2). Les huit lignes et leurs trois états viennent
   de `site.ts`, et rien n'est calculé ici.

   L'ÉTAT EST ÉCRIT EN TOUTES LETTRES dans chaque cellule — « Ouvert »,
   « Fermé », « En production ». C'est ce qui satisfait SC 1.4.1 : le mot
   porte l'information, `.tableau__oui` / `.tableau__non` ne font que la
   doubler d'une couleur. Jamais de coche, jamais de croix rouge.

   LES PRIX SONT DANS LES EN-TÊTES DE COLONNE. Amendement 1 §A1.1 : le
   comparatif est l'une des trois surfaces où le montant est OBLIGATOIRE, sa
   périodicité comprise.

   La colonne d'intitulés n'a pas de titre visible — il n'y a rien à écrire
   au-dessus d'une colonne de questions — mais elle en porte un pour les
   technologies d'assistance, sans quoi la première cellule d'en-tête est
   muette.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Les trois colonnes sont les trois paliers PAYANTS : le Visiteur n'a rien à
   comparer. Le filtre est un prédicat de type, pas une assertion — c'est lui
   qui autorise `ligne.etats[cle]` sans détour. */
const estPayant = (cle: PalierKey): cle is PalierPayantKey => cle !== "visiteur";
const colonnes = paliersPayants.filter(estPayant);

export default function ComparatifPaliers() {
  return (
    <div className="tableau tableau--paliers" data-rv>
      <table>
        <caption className="sr-only">{blocPaliers.legendeComparatif}</caption>

        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Ce que le palier ouvre</span>
            </th>
            {colonnes.map((cle) => (
              <th scope="col" key={cle}>
                {paliers[cle].nom}
                <br />
                <span className="meta">
                  {paliers[cle].prix} {paliers[cle].periodicite}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {comparatif.map((ligne) => (
            <tr key={ligne.ligne}>
              <th scope="row">
                {ligne.ligne}
                {ligne.precision && <span className="meta"> {ligne.precision}</span>}
              </th>
              {colonnes.map((cle) => {
                const etat = ligne.etats[cle];
                return (
                  <td key={cle} className={etat === "ouvert" ? "tableau__oui" : "tableau__non"}>
                    {libelleAcces[etat]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
