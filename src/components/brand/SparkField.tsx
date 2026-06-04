import { useId } from "react";

type Props = {
  className?: string;
  color?: string;
  opacity?: number;
  tile?: number;
};

// Motif d'étincelles tone-sur-tone pour les sections sombres « Encre ».
export default function SparkField({
  className = "",
  color = "#5E7A48",
  opacity = 0.16,
  tile = 46,
}: Props) {
  const id = useId();
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg width="100%" height="100%" style={{ opacity }}>
        <defs>
          <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
            {/* étincelle moyenne */}
            <path
              d="M11 4 Q12 10 18 11 Q12 12 11 18 Q10 12 4 11 Q10 10 11 4 Z"
              fill={color}
            />
            {/* étincelle plus petite */}
            <path
              d="M34 26 Q34.7 30 39 30.7 Q34.7 31.4 34 35.4 Q33.3 31.4 29 30.7 Q33.3 30 34 26 Z"
              fill={color}
              opacity="0.75"
            />
            {/* petites croix */}
            <path d="M33 7 v5 M30.5 9.5 h5" stroke={color} strokeWidth="1" opacity="0.6" />
            <path d="M9 33 v5 M6.5 35.5 h5" stroke={color} strokeWidth="1" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
