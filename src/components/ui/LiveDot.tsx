type Status = "online" | "offline" | "loading";

const colors: Record<Status, { dot: string; bg: string; text: string; label: string }> = {
  online: { dot: "bg-vert", bg: "bg-vert-50", text: "text-vert-700", label: "En ligne" },
  offline: { dot: "bg-rouge", bg: "bg-rouge-50", text: "text-rouge-700", label: "Hors ligne" },
  loading: { dot: "bg-laiton", bg: "bg-laiton-50", text: "text-laiton-700", label: "Vérification…" },
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
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded font-mono text-[0.66rem] uppercase tracking-[0.12em] ${c.bg} ${c.text} ${className}`}
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
