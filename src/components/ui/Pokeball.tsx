type Props = {
  size?: number;
  className?: string;
  spin?: boolean;
};

export default function Pokeball({ size = 48, className = "", spin = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className} ${spin ? "animate-spin_slow" : ""}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="pb-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff3a3a" />
          <stop offset="1" stopColor="#c00000" />
        </linearGradient>
        <linearGradient id="pb-white" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dddddd" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#pb-white)" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M2 32 a30 30 0 0 1 60 0z" fill="url(#pb-red)" stroke="#1a1a1a" strokeWidth="3" />
      <rect x="2" y="29" width="60" height="6" fill="#1a1a1a" />
      <circle cx="32" cy="32" r="8" fill="#fafafa" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="32" cy="32" r="3" fill="#fafafa" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );
}
