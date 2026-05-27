import { useState } from "react";
import { formation } from "../data/site";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import Pokeball from "../components/ui/Pokeball";

export default function Formation() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-pokeball-red/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-pikachu-yellow/20 blur-3xl" />

        <div className="container-narrow relative pt-20 pb-20 text-center">
          <TypeBadge variant="fire">Programme phare</TypeBadge>
          <h1 className="heading-display mt-4">
            <span className="text-white">{formation.title}</span>
            <br />
            <span className="text-gradient-fire">{formation.subtitle}</span>
          </h1>
          <p className="text-xl text-lab-200 max-w-2xl mx-auto mt-6 leading-relaxed">
            {formation.pitch}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href={formation.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              Rejoindre sur Patreon
              <span aria-hidden>→</span>
            </a>
            <a href="#programme" className="btn-ghost">
              Voir le programme détaillé
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-14">
            {[
              { value: "7+", label: "Modules" },
              { value: "50h+", label: "De contenu" },
              { value: "Privé", label: "Discord élèves" },
              { value: "1:1", label: "Suivi inclus" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-display text-pikachu-yellow">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-lab-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Ce que tu apprends"
            title="Tout ce qu'il te faut pour réussir"
            subtitle="De la stratégie à la production, de la croissance à la monétisation."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formation.highlights.map((h) => (
              <div key={h.title} className="card group hover:-translate-y-1">
                <div className="text-4xl mb-3">{h.icon}</div>
                <div className="font-display text-white text-lg mb-2">{h.title}</div>
                <p className="text-sm text-lab-300">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section id="programme" className="section bg-gradient-to-b from-transparent via-pokeball-red/5 to-transparent">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Le programme"
            title="Module par module"
            subtitle="Une progression claire, du positionnement à la monétisation. Tu avances à ton rythme."
          />
          <div className="space-y-3">
            {formation.modules.map((m, i) => (
              <div
                key={m}
                className="card flex items-center gap-5 hover:border-pikachu-yellow/40"
              >
                <div className="shrink-0 h-12 w-12 rounded-xl bg-pokeball-red/15 border border-pokeball-red/30 flex items-center justify-center font-display text-pokeball-red text-lg">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 text-lab-100">{m}</div>
                <span className="text-lab-500 text-xl">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Ils l'ont fait"
            title="Témoignages d'élèves"
            subtitle="Des créateurs qui sont passés par la formation et qui en parlent mieux que nous."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {formation.testimonials.map((t) => (
              <div key={t.name} className="card relative">
                <div className="text-6xl text-pokeball-red/20 absolute top-2 right-4 font-serif">"</div>
                <p className="text-lab-100 mb-6 relative">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="h-10 w-10 rounded-full bg-pikachu-yellow/20 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-lab-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-narrow">
          <SectionHeading eyebrow="FAQ" title="Tu te poses encore des questions ?" />
          <div className="space-y-3">
            {formation.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="card !p-0 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-white">{f.q}</span>
                    <span
                      className={`text-pikachu-yellow text-2xl transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-lab-200 text-sm leading-relaxed border-t border-white/10 pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container-narrow">
          <div className="card !p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pokeball-red/30 to-pikachu-yellow/10 opacity-60" />
            <div className="absolute -top-10 -right-10 opacity-30">
              <Pokeball size={180} spin />
            </div>
            <div className="relative space-y-4">
              <TypeBadge variant="fire">Rejoindre</TypeBadge>
              <h3 className="heading-display text-white">Prêt à lancer ta chaîne ?</h3>
              <p className="text-lab-100 max-w-xl mx-auto">
                Accède à la formation et à la communauté privée directement sur Patreon.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-3">
                <a
                  href={formation.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4"
                >
                  Accéder via Patreon
                </a>
                <a href="/contact" className="btn-ghost">
                  Poser une question d'abord
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
