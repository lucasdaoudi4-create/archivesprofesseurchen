type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "ink" | "cream";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "ink",
}: Props) {
  const center = align === "center";
  const titleColor = tone === "cream" ? "text-creme" : "text-encre";
  const subColor = tone === "cream" ? "text-encre-300" : "text-encre-500";
  return (
    <div className={`max-w-2xl mb-12 ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>}
      <h2 className={`heading-1 mt-4 ${titleColor}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-lg leading-relaxed ${subColor}`}>{subtitle}</p>}
    </div>
  );
}
