export type PictoName =
  | "decouverte"
  | "savoir"
  | "nature"
  | "curiosite"
  | "chroniques"
  | "collection";

type Props = {
  name: PictoName;
  size?: number | string;
  className?: string;
  title?: string;
};

// Pictogrammes en ligne — le langage graphique des Archives (style régulier, contour).
export default function Pictogram({ name, size = 24, className = "", title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}

const PATHS: Record<PictoName, JSX.Element> = {
  // Étincelle (contour)
  decouverte: (
    <path d="M12 2.5 Q13.2 10.8 21.5 12 Q13.2 13.2 12 21.5 Q10.8 13.2 2.5 12 Q10.8 10.8 12 2.5 Z" />
  ),
  // Livre ouvert
  savoir: (
    <>
      <path d="M12 6.5C9.8 5.2 7 5 4.5 5.4V18c2.5-.4 5.3-.2 7.5 1.1 2.2-1.3 5-1.5 7.5-1.1V5.4C17 5 14.2 5.2 12 6.5Z" />
      <path d="M12 6.5v12.6" />
    </>
  ),
  // Feuille (nature)
  nature: (
    <>
      <path d="M5 19c-1.5-6 2.5-12 14-13 .8 7-3 13-9 13-1.8 0-3.6-.4-5-1Z" />
      <path d="M5 19c3-3.5 6.5-6 11-7.5" />
    </>
  ),
  // Loupe (curiosité)
  curiosite: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  // Plume / chronique
  chroniques: (
    <>
      <path d="M19.5 4.5C14 4 6 7 5 16c5-1 11-3 13.5-7.5" />
      <path d="M4 20l6-6" />
      <path d="M9 13h4" />
    </>
  ),
  // Pastille (collection) — clin d'œil discret
  collection: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h6.2" />
      <path d="M14.3 12h6.2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
};
