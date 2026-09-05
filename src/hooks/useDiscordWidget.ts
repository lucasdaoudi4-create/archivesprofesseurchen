import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RELEVÉ DU WIDGET DISCORD — `discord.com/api/guilds/{id}/widget.json`

   CE QUI N’A PAS BOUGÉ : la signature, les types exportés, le point de
   terminaison, l’état `idle` quand aucun identifiant n’est fourni, le
   message particulier du 403 (widget désactivé côté serveur) et le pas de
   rafraîchissement de 60 s. `EtatCommunaute` (/discord) est la seule
   surface qui monte ce relevé, et son contrat est inchangé.

   CE QUI A ÉTÉ CORRIGÉ, aux mêmes deux titres que `useMinecraftStatus` et
   pour les mêmes raisons (constat d’audit) :

   1. Le sondage ne se replanifie plus quand `document.visibilityState` vaut
      `hidden` ; il repart au retour au premier plan, tout de suite, parce
      qu’un effectif relevé il y a deux heures n’est pas un effectif.

   2. Un `AbortController`, ouvert pour la durée de l’effet, coupe la
      requête en vol au démontage. L’`AbortError` qu’il lève est reconnue
      par `signal.aborted` : elle ne devient jamais `status: "error"`, sans
      quoi quitter la page afficherait « Compteur indisponible » ailleurs.
   ═══════════════════════════════════════════════════════════════════════════ */

export type DiscordWidget = {
  name: string;
  presenceCount: number;
  instantInvite: string | null;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; data: DiscordWidget }
  | { status: "error"; message: string };

const REFRESH_MS = 60_000;

export function useDiscordWidget(guildId: string | undefined | null): State {
  const [state, setState] = useState<State>(() =>
    guildId ? { status: "loading" } : { status: "idle" }
  );

  useEffect(() => {
    // Aucune source branchée : aucun appel, et l’état le dit.
    if (!guildId) {
      setState({ status: "idle" });
      return;
    }

    let demonte = false;
    let minuteur: ReturnType<typeof setTimeout> | undefined;
    let enVol = false;

    const controleur = new AbortController();

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
        const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
          signal: controleur.signal,
        });
        if (!res.ok) {
          throw new Error(
            res.status === 403
              ? "Widget désactivé sur le serveur Discord"
              : `HTTP ${res.status}`
          );
        }
        const json = await res.json();
        if (demonte) return;
        setState({
          status: "ok",
          data: {
            name: json.name,
            presenceCount: json.presence_count ?? 0,
            instantInvite: json.instant_invite ?? null,
          },
        });
      } catch (e) {
        if (demonte || controleur.signal.aborted) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown" });
      } finally {
        enVol = false;
        planifier();
      }
    };

    const surVisibilite = () => {
      if (document.visibilityState === "visible") {
        if (!enVol && minuteur === undefined) void relever();
      } else if (minuteur !== undefined) {
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
  }, [guildId]);

  return state;
}
