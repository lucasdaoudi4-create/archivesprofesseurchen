import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RELEVÉ D’ÉTAT DU SERVEUR MINECRAFT — `api.mcsrvstat.us/3`

   CE QUI N’A PAS BOUGÉ, et ne doit pas bouger : la signature, les types
   exportés, le point de terminaison, la forme de l’objet renvoyé et le pas
   de rafraîchissement de 60 s. Trois surfaces en dépendent — `FicheServeur`
   (/minecraft), `EtatServeur` (accueil) — et aucune n’a été touchée.

   CE QUI A ÉTÉ CORRIGÉ, et pourquoi (constat d’audit) :

   1. LE SONDAGE TOURNAIT SANS FIN, Y COMPRIS EN ONGLET CACHÉ. Un visiteur
      qui laisse l’onglet ouvert une journée appelait le service tiers
      1 440 fois pour un relevé que personne ne regardait. La replanification
      ne se fait donc plus que si `document.visibilityState` vaut `visible`,
      et l’onglet qui revient au premier plan relève immédiatement — le
      chiffre affiché a vieilli pendant l’absence, il serait faux de le
      laisser en place en attendant la minute suivante.

   2. AUCUNE REQUÊTE N’ÉTAIT ANNULÉE. Au démontage, le drapeau `cancelled`
      empêchait bien l’écriture d’état, mais la requête, elle, continuait de
      courir. Un `AbortController` la coupe pour de bon. Il est ouvert une
      fois pour la durée de l’effet : on n’annule qu’au démontage, jamais
      entre deux relevés — une réponse tardive reste une réponse.

   L’annulation lève une `AbortError` dans le `catch`. Elle n’est PAS un
   échec de relevé : elle est reconnue par `signal.aborted` et ne pose donc
   jamais `status: "error"`, sans quoi un simple changement de page ferait
   afficher « Relevé indisponible » à la page suivante.
   ═══════════════════════════════════════════════════════════════════════════ */

export type MinecraftStatus = {
  online: boolean;
  players?: { online: number; max: number; list?: { name: string; uuid?: string }[] };
  version?: string;
  motd?: string[];
  icon?: string;
  hostname?: string;
};

type State =
  | { status: "loading" }
  | { status: "ok"; data: MinecraftStatus }
  | { status: "error"; message: string };

const REFRESH_MS = 60_000;

export function useMinecraftStatus(ip: string): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let demonte = false;
    let minuteur: ReturnType<typeof setTimeout> | undefined;
    // Empêche deux relevés simultanés : le retour au premier plan et une
    // minuterie déjà armée pourraient sinon se croiser.
    let enVol = false;

    const controleur = new AbortController();

    /** Replanifie, mais seulement si la page est regardée. */
    const planifier = () => {
      if (demonte) return;
      if (document.visibilityState !== "visible") return;
      minuteur = setTimeout(relever, REFRESH_MS);
    };

    const relever = async () => {
      minuteur = undefined;
      if (demonte || enVol) return;
      enVol = true;
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`, {
          signal: controleur.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (demonte) return;
        setState({
          status: "ok",
          data: {
            online: !!json.online,
            players: json.players,
            version: json.version,
            motd: json.motd?.clean,
            icon: json.icon,
            hostname: json.hostname,
          },
        });
      } catch (e) {
        // Une requête coupée au démontage n’est pas un échec de relevé.
        if (demonte || controleur.signal.aborted) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown" });
      } finally {
        enVol = false;
        planifier();
      }
    };

    const surVisibilite = () => {
      if (document.visibilityState === "visible") {
        // Retour au premier plan : le relevé a vieilli, on le refait.
        if (!enVol && minuteur === undefined) void relever();
      } else if (minuteur !== undefined) {
        // Onglet caché : la minuterie s’arrête là. Une requête déjà partie
        // va au bout — elle rafraîchit l’affichage pour le retour.
        clearTimeout(minuteur);
        minuteur = undefined;
      }
    };

    document.addEventListener("visibilitychange", surVisibilite);
    void relever();

    return () => {
      demonte = true;
      if (minuteur !== undefined) clearTimeout(minuteur);
      controleur.abort();
      document.removeEventListener("visibilitychange", surVisibilite);
    };
  }, [ip]);

  return state;
}
