import { useEffect, useState } from "react";

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
    if (!guildId) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const fetchWidget = async () => {
      try {
        const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
        if (!res.ok) {
          throw new Error(
            res.status === 403
              ? "Widget désactivé sur le serveur Discord"
              : `HTTP ${res.status}`
          );
        }
        const json = await res.json();
        if (cancelled) return;
        setState({
          status: "ok",
          data: {
            name: json.name,
            presenceCount: json.presence_count ?? 0,
            instantInvite: json.instant_invite ?? null,
          },
        });
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown" });
      } finally {
        if (!cancelled) {
          timer = setTimeout(fetchWidget, REFRESH_MS);
        }
      }
    };

    fetchWidget();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [guildId]);

  return state;
}
