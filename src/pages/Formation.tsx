import { formation } from "../data/site";
import Seal from "../components/brand/Seal";
import Spark from "../components/brand/Spark";
import SparkField from "../components/brand/SparkField";
import Pictogram from "../components/brand/Pictogram";
import type { PictoName } from "../components/brand/Pictogram";
import SectionHeading from "../components/ui/SectionHeading";

const HIGHLIGHT_PICTOS: PictoName[] = [
  "curiosite",
  "decouverte",
  "chroniques",
  "nature",
  "collection",
  "savoir",
];

export default function Formation() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-creme-veil">
        <div className="container-narrow relative pt-20 pb-16 text-center">
          <div className="flex justify-center mb-6">
            <Seal size={84} variant="simple" tone="rouge" />
          </div>
          <span className="eyebrow justify-center">Programme phare</span>
          <h1 className="display text-encre mt-4">{formation.title}.</h1>
          <p className="font-display text-xl sm:text-2xl font-bold text-rouge mt-3">{formation.subtitle}</p>
          <p className="text-lg text-encre-500 max-w-2xl mx-auto mt-5 leading-relaxed">{formation.pitch}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a href={formation.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-7 py-3.5">
              Rejoindre sur Patreon
              <Spark size="0.8em" />
            </a>
            <a href="#programme" className="btn-outline">Voir le programme détaillé</a>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-14">
            {[
              { v: "7+", l: "Modules" },
              { v: "50h+", l: "De contenu" },
              { v: "Privé", l: "Discord élèves" },
              { v: "1:1", l: "Suivi inclus" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <dd className="font-display font-extrabold text-3xl sm:text-4xl text-encre">{s.v}</dd>
                <dt className="mono-meta text-encre-400 mt-1.5">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CE QUE TU APPRENDS */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Ce que tu apprends"
            title="Tout ce qu'il te faut pour réussir."
            subtitle="De la stratégie à la production, de la croissance à la monétisation."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formation.highlights.map((h, i) => (
              <div key={h.title} className="card card-hover">
                <div className="h-12 w-12 rounded-xl border border-parchemin-600 bg-parchemin/60 flex items-center justify-center text-rouge mb-4">
                  <Pictogram name={HIGHLIGHT_PICTOS[i % HIGHLIGHT_PICTOS.length]} size={24} />
                </div>
                <div className="font-display font-bold text-encre text-lg mb-1.5">{h.title}</div>
                <p className="text-sm text-encre-500 leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section id="programme" className="section pt-0">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Le programme"
            title="Module par module."
            subtitle="Une progression claire, du positionnement à la monétisation. Tu avances à ton rythme."
          />
          <ol className="divide-y divide-encre/10 border-y border-encre/10">
            {formation.modules.map((m, i) => (
              <li key={m} className="flex items-center gap-5 py-4 group">
                <span className="font-mono text-lg text-laiton-700 w-9 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-encre-700">{m.replace(/^Module \d+ — /, "").replace(/^Bonus — /, "")}</span>
                <Spark size="0.7em" className="text-parchemin-700 group-hover:text-rouge transition-colors shrink-0" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section pt-0">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Ils l'ont fait"
            title="Témoignages d'élèves."
            subtitle="Des créateurs passés par la formation, qui en parlent mieux que nous."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {formation.testimonials.map((t) => (
              <figure key={t.name} className="card flex flex-col">
                <Spark size={18} className="text-rouge" />
                <blockquote className="text-encre-700 mt-4 mb-6 leading-relaxed flex-1">« {t.quote} »</blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-encre/10">
                  <div className="h-10 w-10 rounded-full bg-rouge-50 text-rouge-700 flex items-center justify-center font-display font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-encre text-sm">{t.name}</div>
                    <div className="caption">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section pt-0">
        <div className="container-narrow">
          <SectionHeading eyebrow="FAQ" title="Les questions fréquentes." />
          <dl className="divide-y divide-encre/10 border-y border-encre/10">
            {formation.faq.map((f, i) => (
              <div key={f.q} className="py-6 grid sm:grid-cols-[auto_1fr] gap-x-5 gap-y-2">
                <dt className="font-mono text-sm text-laiton-700 sm:pt-0.5">Q.{String(i + 1).padStart(2, "0")}</dt>
                <div>
                  <p className="font-display font-bold text-encre">{f.q}</p>
                  <dd className="text-encre-500 mt-2 leading-relaxed">{f.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section pt-0">
        <div className="container-narrow">
          <div className="relative rounded-2xl bg-encre text-creme overflow-hidden">
            <SparkField color="#5E7A48" opacity={0.13} />
            <div className="relative px-6 py-14 sm:px-12 text-center">
              <div className="flex justify-center mb-5">
                <Seal size={64} variant="simple" tone="cream" />
              </div>
              <span className="eyebrow justify-center text-laiton-400">Rejoindre</span>
              <h3 className="display text-creme mt-4 text-[2rem] sm:text-4xl">Prêt à lancer ta chaîne ?</h3>
              <p className="text-encre-300 max-w-xl mx-auto mt-4 leading-relaxed">
                Accède à la formation et à la communauté privée directement sur Patreon, sans engagement.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <a href={formation.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-7 py-3.5">
                  Accéder via Patreon
                </a>
                <a href="/contact" className="btn-ghost-dark">Poser une question d'abord</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
