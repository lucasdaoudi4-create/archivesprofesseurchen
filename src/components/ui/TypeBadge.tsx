type Variant = "fire" | "water" | "grass" | "electric" | "psychic" | "dark";

const styles: Record<Variant, string> = {
  fire: "bg-accent-fire/15 text-accent-fire border-accent-fire/30",
  water: "bg-accent-water/15 text-accent-water border-accent-water/30",
  grass: "bg-accent-grass/15 text-accent-grass border-accent-grass/30",
  electric: "bg-accent-electric/15 text-accent-electric border-accent-electric/30",
  psychic: "bg-accent-psychic/15 text-accent-psychic border-accent-psychic/30",
  dark: "bg-lab-800 text-lab-200 border-lab-700",
};

export default function TypeBadge({
  variant = "electric",
  children,
}: {
  variant?: Variant;
  children: React.ReactNode;
}) {
  return (
    <span className={`badge border ${styles[variant]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
