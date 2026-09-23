import { Component, type ErrorInfo, type ReactNode } from "react";
import Embleme from "../brand/Embleme";
import { site } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FRONTIÈRE D'ERREUR DES ROUTES — `.syspage.e500`
   Les Archives du Professeur Chen — charte v1.0.0

   ── POURQUOI ELLE EXISTE MAINTENANT ───────────────────────────────────────

   Tant que les neuf pages étaient dans le même morceau, il n'y avait rien à
   rattraper : si le paquet arrivait, elles arrivaient toutes. Depuis qu'elles
   sont chargées à la demande, chaque navigation est une requête réseau de
   plus, et une requête réseau échoue.

   LE CAS QUI ARRIVE VRAIMENT n'est pas le réseau coupé, c'est le DÉPLOIEMENT
   PENDANT LA VISITE. Les noms de fichiers portent une empreinte : après une
   mise en ligne, `Formation-BHWR7wB4.js` n'existe plus, il s'appelle
   autrement. Un visiteur qui avait la page ouverte avant le déploiement et
   qui clique après demande un fichier disparu. Sans frontière, React remonte
   l'erreur jusqu'à la racine et DÉMONTE TOUT : page blanche, sans un mot.

   D'où le bouton. Pour ce cas-là — le plus fréquent — la seule réparation
   est de recharger : il faut que le navigateur redemande `index.html`, qui
   nomme les morceaux actuels. Réinitialiser la frontière sans recharger
   redemanderait le même fichier absent.

   ── CE QUE LA CHARTE IMPOSE ICI ───────────────────────────────────────────

   C'est le troisième seuil du motif d'attente `ARC · MOT — 11`, énoncé dans
   `30-composants.css` : « un message d'échec et un bouton Réessayer au-delà ».
   Le § 0.31 ajoute que l'état est ÉCRIT, jamais porté par la seule couleur —
   d'où une phrase, et pas un pictogramme d'alerte.

   La surface est celle que la charte prévoit pour une erreur serveur,
   `.syspage.e500`, avec la composition qu'exige le contrat de balisage de
   `30-composants.css` : `class="syspage e500 acier mat-acier"`. Sans
   `mat-acier`, les compensations `prefers-contrast` et `forced-colors` de
   `99-preferences.css` ne la voient pas — elles ne ciblent que les `.mat-*`.

   ── CE QU'ELLE NE FAIT PAS ────────────────────────────────────────────────

   Elle ne remonte rien nulle part. Le site n'a aucun service de collecte, et
   en ajouter un serait une décision de traitement de données, pas de recette
   — la politique de confidentialité vient précisément d'être réécrite pour
   ne décrire QUE ce qui existe. L'erreur va dans la console, et c'est tout.

   Elle ne se réinitialise pas toute seule non plus : `Layout` lui donne le
   chemin pour clé, donc elle repart à neuf dès que le visiteur navigue
   ailleurs. Une frontière qui reste en erreur après un changement de route
   afficherait l'échec de la page précédente sur la suivante.
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  children: ReactNode;
}

interface Etat {
  enErreur: boolean;
}

export default class FrontiereErreur extends Component<Props, Etat> {
  state: Etat = { enErreur: false };

  static getDerivedStateFromError(): Etat {
    return { enErreur: true };
  }

  componentDidCatch(erreur: Error, infos: ErrorInfo) {
    /* LE TITRE, SANS QUOI L'ONGLET MENT. Chaque page pose le sien depuis
       `useMetaPage`, au montage. Une page qui échoue ne se monte jamais :
       le titre reste donc celui de la page PRÉCÉDENTE, et l'onglet annonce
       « L'Académie » pendant qu'on lit un message d'erreur sur /formation.
       Mesuré au navigateur. C'est ici, et seulement ici, qu'on peut le
       savoir. */
    document.title = `Page indisponible · ${site.name}`;

    // La console, et rien d'autre : voir le pavé ci-dessus.
    console.error("Une page n'a pas pu être affichée.", erreur, infos.componentStack);
  }

  render() {
    if (!this.state.enErreur) return this.props.children;

    return (
      <section className="syspage e500 acier mat-acier">
        <div className="sp-panel pilier-email">
          {/* Le contrat de balisage de `30-composants.css` veut un emblème
              sur `.sp-panel` : `class="emb emb--52"`. Sans lui, cette page
              système n'aurait pas la même tête que la 404, qui suit le même
              gabarit — une dérive sans raison entre deux surfaces jumelles.
              Sans `titre` : il est décoratif, le nom de la marque est déjà
              dans la barre et c'est le titre qui porte l'information (§14.1).
              `Embleme` n'importe que `useId` : rien qui puisse échouer à son
              tour sur une surface dont le métier est de rattraper un échec. */}
          <Embleme taille={52} />

          <p className="code-arc">ARC&nbsp;·&nbsp;SYS&nbsp;—&nbsp;500</p>

          {/* Décoratif, et retiré de l'arbre d'accessibilité : le titre
              porte déjà l'information. Un `<div>` et non un `<p>`, pour la
              même collision de spécificité que documente `NotFound`. */}
          <div className="sp-code" aria-hidden="true">
            500
          </div>

          <h1 className="h2">Cette page ne s’est pas ouverte.</h1>

          <p>
            Le contenu de la page n’a pas pu être chargé. Cela arrive quand le
            site a été mis à jour pendant votre visite&nbsp;: recharger suffit
            presque toujours.
          </p>

          <div className="sp-acts">
            <button type="button" className="btn" onClick={() => window.location.reload()}>
              Recharger la page
              <span className="btn__f" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <p className="sp-help">
            Si cela se reproduit, le reste du site fonctionne&nbsp;: les liens de
            la barre de navigation et du pied de page restent ouverts.
          </p>
        </div>
      </section>
    );
  }
}
