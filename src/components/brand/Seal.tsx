import { useId } from "react";

type Tone = "rouge" | "ink" | "cream" | "vert";
type Props = {
  size?: number;
  tone?: Tone;
  variant?: "full" | "simple";
  /** Version « avatar » : disque plein + emblème contrasté. */
  filled?: boolean;
  className?: string;
  title?: string;
};

const TONE: Record<Tone, string> = {
  rouge: "#C73B2B",
  ink: "#16130D",
  cream: "#FAF4E7",
  vert: "#5E7A48",
};

// Le sceau d'archiviste — étincelle + livre ouvert, anneaux et texte circulaire.
export default function Seal({
  size = 120,
  tone = "rouge",
  variant = "full",
  filled = false,
  className = "",
  title = "Les Archives du Professeur Chen",
}: Props) {
  const id = useId();
  const base = TONE[tone];
  const emblem = filled ? (tone === "cream" ? "#16130D" : "#FAF4E7") : base;
  const r = 79;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      {filled && <circle cx="100" cy="100" r="100" fill={base} />}

      {/* Anneaux */}
      <circle cx="100" cy="100" r={filled ? 90 : 96} fill="none" stroke={emblem} strokeWidth="2" />
      {variant === "full" && (
        <>
          <circle cx="100" cy="100" r="88" fill="none" stroke={emblem} strokeWidth="1" opacity="0.7" />
          <circle cx="100" cy="100" r="70" fill="none" stroke={emblem} strokeWidth="1" opacity="0.7" />
        </>
      )}
      <circle cx="100" cy="100" r="60" fill="none" stroke={emblem} strokeWidth="2" />

      {/* Texte circulaire */}
      {variant === "full" && (
        <>
          <defs>
            <path id={`${id}-top`} d={`M100,100 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0`} fill="none" />
            <path id={`${id}-bot`} d={`M100,100 m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0`} fill="none" />
          </defs>
          <text
            fill={emblem}
            style={{ fontFamily: '"DM Mono", monospace', fontSize: "10px", letterSpacing: "1.5px" }}
          >
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
              LES ARCHIVES DU PROFESSEUR CHEN
            </textPath>
          </text>
          <text
            fill={emblem}
            style={{ fontFamily: '"DM Mono", monospace', fontSize: "10px", letterSpacing: "2px" }}
          >
            <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
              SAVOIR · PARTAGE · PASSION
            </textPath>
          </text>
          {/* Séparateurs latéraux */}
          <circle cx={100 - r} cy="100" r="2.4" fill={emblem} />
          <circle cx={100 + r} cy="100" r="2.4" fill={emblem} />
        </>
      )}

      {/* Emblème : étincelle + livre ouvert */}
      <path
        d="M100 67 Q102.3 79.7 115 82 Q102.3 84.3 100 97 Q97.7 84.3 85 82 Q97.7 79.7 100 67 Z"
        fill={emblem}
      />
      <path
        d="M98 110 C 90 107, 81 107, 75 110 L 75 127 C 81 124.5, 90 124.5, 98 127 Z"
        fill={emblem}
      />
      <path
        d="M102 110 C 110 107, 119 107, 125 110 L 125 127 C 119 124.5, 110 124.5, 102 127 Z"
        fill={emblem}
      />
    </svg>
  );
}
