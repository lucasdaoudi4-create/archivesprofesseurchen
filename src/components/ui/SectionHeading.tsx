type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass} mb-12`}>
      {eyebrow && (
        <div
          className={`uppercase tracking-[0.2em] text-xs font-bold text-pikachu-yellow mb-3 ${
            align === "center" ? "flex justify-center" : ""
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-pikachu-yellow" />
            {eyebrow}
            <span className="h-px w-6 bg-pikachu-yellow" />
          </span>
        </div>
      )}
      <h2 className="heading-display text-white">{title}</h2>
      {subtitle && <p className="mt-4 text-lab-300 text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
