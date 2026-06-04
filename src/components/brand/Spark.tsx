type Props = {
  size?: number | string;
  className?: string;
  title?: string;
};

// L'étincelle à quatre branches — motif signature des Archives.
// Couleur héritée via `currentColor` (text-rouge, text-creme, …).
export default function Spark({ size = 24, className = "", title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path d="M12 0.5 Q13.45 10.55 23.5 12 Q13.45 13.45 12 23.5 Q10.55 13.45 0.5 12 Q10.55 10.55 12 0.5 Z" />
    </svg>
  );
}
