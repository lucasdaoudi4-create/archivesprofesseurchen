import { useDiscordWidget } from "../../hooks/useDiscordWidget";
import { discord } from "../../data/site";
import LiveDot from "./LiveDot";

type Props = {
  variant?: "inline" | "card";
};

export default function DiscordLiveStats({ variant = "card" }: Props) {
  const state = useDiscordWidget(discord.guildId);

  if (state.status === "idle") {
    if (variant === "inline") return null;
    return (
      <div className="text-xs text-lab-400">
        <span className="font-mono">{discord.memberCountApprox}</span>{" "}
        <span className="opacity-60">membres (estimation)</span>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-lab-300">
        <LiveDot status="loading" label="Connexion…" />
      </div>
    );
  }

  if (state.status === "error") {
    if (variant === "inline") return null;
    return (
      <div className="text-xs text-lab-400">
        <span className="font-mono">{discord.memberCountApprox}</span>{" "}
        <span className="opacity-60">membres</span>
      </div>
    );
  }

  // status === "ok"
  const count = state.data.presenceCount;

  if (variant === "inline") {
    return (
      <div className="inline-flex items-center gap-2">
        <LiveDot status="online" label={`${count} en ligne`} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <LiveDot status="online" />
      <div>
        <div className="font-display text-2xl text-white leading-none">{count}</div>
        <div className="text-xs uppercase tracking-wider text-lab-400 mt-0.5">
          membres en ligne
        </div>
      </div>
    </div>
  );
}
