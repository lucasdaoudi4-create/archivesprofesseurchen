import Spark from "../brand/Spark";

export type TagVariant = "rouge" | "vert" | "laiton" | "ink" | "cream";

const styles: Record<TagVariant, string> = {
  rouge: "bg-rouge-50 text-rouge-700 border-rouge/25",
  vert: "bg-vert-50 text-vert-700 border-vert/25",
  laiton: "bg-laiton-50 text-laiton-700 border-laiton/30",
  ink: "bg-encre/[0.04] text-encre-700 border-encre/15",
  cream: "bg-creme/5 text-creme border-creme/30",
};

// Étiquette « fiche d'archive » : mono, capitales, étincelle en tête.
export default function TypeBadge({
  variant = "rouge",
  children,
  spark = true,
}: {
  variant?: TagVariant;
  children: React.ReactNode;
  spark?: boolean;
}) {
  return (
    <span className={`tag ${styles[variant]}`}>
      {spark && <Spark size="0.7em" />}
      {children}
    </span>
  );
}
