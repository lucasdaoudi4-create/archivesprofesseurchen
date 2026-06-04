import Spark from "./Spark";

type Props = {
  variant?: "principal" | "compact";
  className?: string;
  /** Couleur de l'étincelle accent (par défaut Rouge Sceau). */
  sparkClassName?: string;
};

// Verrous typographiques du logo. La couleur du texte est héritée (currentColor).
export default function Wordmark({
  variant = "principal",
  className = "",
  sparkClassName = "text-rouge",
}: Props) {
  if (variant === "compact") {
    return (
      <span className={`inline-flex flex-col leading-none ${className}`}>
        <span className="font-display font-extrabold tracking-tight text-[1.05em] inline-flex items-center gap-1.5">
          PROF. CHEN
          <Spark size="0.6em" className={sparkClassName} />
        </span>
        <span className="mono-meta mt-1 opacity-70">Archives · FR</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="label opacity-70 mb-1.5 text-current">Les Archives du</span>
      <span className="font-display font-extrabold tracking-tight leading-[0.95] text-[2em] inline-flex items-center gap-2">
        Professeur Chen
        <Spark size="0.55em" className={sparkClassName} />
      </span>
    </span>
  );
}
