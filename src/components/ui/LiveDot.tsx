type Status = "online" | "offline" | "loading";

const colors: Record<Status, { dot: string; bg: string; text: string; label: string }> = {
  online: { dot: "bg-accent-grass", bg: "bg-accent-grass/15", text: "text-accent-grass", label: "Online" },
  offline: { dot: "bg-pokeball-red", bg: "bg-pokeball-red/15", text: "text-pokeball-red", label: "Offline" },
  loading: { dot: "bg-lab-400", bg: "bg-lab-700/30", text: "text-lab-300", label: "Vérification…" },
};

export default function LiveDot({
  status,
  label,
  className = "",
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const c = colors[status];
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75 animate-ping`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
      </span>
      {label ?? c.label}
    </span>
  );
}
