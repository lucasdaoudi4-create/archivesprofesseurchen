import { useEffect, useState } from "react";

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
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
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
        if (cancelled) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown" });
      } finally {
        if (!cancelled) {
          timer = setTimeout(fetchStatus, REFRESH_MS);
        }
      }
    };

    fetchStatus();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ip]);

  return state;
}
