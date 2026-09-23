import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LA SURFACE D'ATTENTE D'UNE ROUTE — `ARC · MOT — 11`
   Les Archives du Professeur Chen — charte v1.0.0

   Ce que `<Suspense>` montre pendant qu'arrive le morceau d'une page
   paresseuse. Le § 9.6 ne laisse pas le choix de la forme : « Pas de
   squelette de contenu qui scintille, pas de roue qui tourne, pas de points
   qui sautent. » La barre indéterminée `.attente` est la SEULE façon
   conforme de dire qu'une requête est en cours — deux pixels de haut, un
   segment de 32 % qui balaie en 1100 ms.

   ── LES 600 MS NE SONT PAS UN DÉTAIL ──────────────────────────────────────

   Le premier des trois seuils du motif : « rien avant 600 ms — un indicateur
   qui apparaît et disparaît fait plus de bruit que l'attente elle-même ». Et
   ici il s'applique presque toujours : ces morceaux font quelques kilooctets,
   servis depuis la même origine, souvent déjà en cache. Sur une connexion
   ordinaire la barre ne se montrera jamais ; elle existe pour le train et le
   fond de cave.

   Le troisième seuil — message d'échec et bouton « Réessayer » au-delà de
   8 s — n'est PAS écrit ici, et c'est délibéré : un import dynamique qui
   échoue rejette la promesse, ce qui relève d'une frontière d'erreur, pas
   d'une surface d'attente. Le site n'en a pas encore ; c'est le bon endroit
   pour en poser une le jour venu.

   ── CE QU'IL NE FAUT PAS Y METTRE ─────────────────────────────────────────

   Aucun `role="status"`, aucun texte annoncé. `Layout` annonce déjà le
   changement de page dans sa propre région discrète, et il le fait avec le
   titre DÉDUIT DU CHEMIN, donc sans attendre que la page arrive. Deux
   annonces pour un seul changement de route en feraient une de trop.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le premier seuil du motif ARC · MOT — 11. */
const SEUIL_MS = 600;

export default function Attente() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const minuteur = setTimeout(() => setVisible(true), SEUIL_MS);
    return () => clearTimeout(minuteur);
  }, []);

  /* Le conteneur occupe la hauteur d'un écran de contenu pour que le pied de
     page ne remonte pas sous la barre de navigation le temps du chargement :
     une page qui s'effondre puis se redéploie, c'est un décalage de mise en
     page que le § 0.30 compte comme tel. */
  return (
    <div className="page-attente" aria-hidden="true">
      {visible && <div className="attente" />}
    </div>
  );
}
