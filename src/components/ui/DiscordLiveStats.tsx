import { useDiscordWidget } from "../../hooks/useDiscordWidget";
import { discord } from "../../data/site";
import LiveDot from "./LiveDot";

type Props = {
  variant?: "inline" | "card";
};

export default function DiscordLiveStats({ variant = "card" }: Props) {
  const state = useDiscordWidget(discord.guildId);

  if (state.status === "idle" || state.status === "error") {
    if (variant === "inline") return null;
    return (
      <div className="caption">
        <span className="text-encre-700">{discord.memberCountApprox}</span> membres (estimation)
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="inline-flex items-center gap-2">
        <LiveDot status="loading" label="Connexion…" />
      </div>
    );
  }

  const count = state.data.presenceCount;

  if (variant === "inline") {
    return <LiveDot status="online" label={`${count} en ligne`} />;
  }

  return (
    <div className="flex items-center gap-3">
      <LiveDot status="online" />
      <div>
        <div className="font-display text-2xl font-bold text-encre leading-none">{count}</div>
        <div className="caption mt-0.5">membres en ligne</div>
      </div>
    </div>
  );
}
