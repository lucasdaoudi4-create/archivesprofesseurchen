import { useEffect, useState } from "react";
import { minecraft } from "../../data/site";
import { useMinecraftStatus } from "../../hooks/useMinecraftStatus";

/* ═══════════════════════════════════════════════════════════════════════════
   LE RELEVÉ D'ÉTAT DU SERVEUR — socle § 0.25 · `.etat` · 30-composants.css § 6
   Les Archives du Professeur Chen — charte v1.0.0

   Le relevé vient de `useMinecraftStatus` (api.mcsrvstat.us/3), qui existe
   déjà et n'est pas modifié ici. Ce composant l'HABILLE selon les deux
   règles du § 0.25 que la maquette ne rendait pas :

   1. L'ÉTAT EST ÉCRIT, JAMAIS SEULEMENT COLORÉ. « En ligne », « Hors ligne »
      sont des mots ; `.etat--enligne` / `.etat--horsligne` ne font que les
      doubler d'une couleur (SC 1.4.1). L'ancienne `LiveDot` — une pastille
      colorée sans texte — disparaît avec l'ancienne charte.

   2. MOTIF D'ATTENTE `ARC · MOT — 11` : rien ne s'affiche avant 600 ms, pour
      qu'un relevé rapide ne fasse pas clignoter la barre ; au-delà de 8 s on
      renonce. `useMinecraftStatus` n'a ni l'un ni l'autre — il n'a qu'un
      rafraîchissement de 60 s — donc les deux seuils sont tenus ici, sans
      toucher au hook, qui appartient à un autre lot.

   3. AUCUN CHIFFRE SANS SOURCE. Le compteur de joueurs vient de l'API, il
      est donc affichable ; quand l'API ne répond pas, RIEN ne s'affiche —
      on n'écrit pas un état qu'on n'a pas relevé. C'est la même règle qui
      retire le compteur Discord de cette page.

   Le composant est monté dans la fiche `.serveur` du bloc 02, en contexte
   `.acier` : `--succes` y vaut déjà le vert clair et `--verrouille` l'acier
   400. Rien à écrire pour cela.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Rien avant ce délai : un relevé plus rapide ne doit rien faire clignoter. */
const SEUIL_ATTENTE_MS = 600;
/** Au-delà, on renonce : mieux vaut aucun état qu'un état qu'on n'a pas lu. */
const SEUIL_ABANDON_MS = 8_000;

export default function EtatServeur() {
  const releve = useMinecraftStatus(minecraft.ip);
  const [attente, setAttente] = useState<"muette" | "affichee" | "abandonnee">("muette");

  useEffect(() => {
    if (releve.status !== "loading") return;

    setAttente("muette");
    const montre = window.setTimeout(() => setAttente("affichee"), SEUIL_ATTENTE_MS);
    const renonce = window.setTimeout(() => setAttente("abandonnee"), SEUIL_ABANDON_MS);

    return () => {
      window.clearTimeout(montre);
      window.clearTimeout(renonce);
    };
  }, [releve.status]);

  // L'appel a échoué : le serveur n'est pas pour autant hors ligne, et le
  // dire serait une affirmation invérifiable. On n'affiche rien.
  if (releve.status === "error") return null;

  if (releve.status === "loading") {
    if (attente !== "affichee") return null;
    return <span className="etat">Relevé en cours</span>;
  }

  if (!releve.data.online) {
    return <span className="etat etat--horsligne">Hors ligne</span>;
  }

  const joueurs = releve.data.players;

  return (
    <span className="etat etat--enligne">
      {joueurs
        ? `En ligne · ${joueurs.online} / ${joueurs.max} joueurs`
        : "En ligne"}
    </span>
  );
}
