import { socials } from "../data/site";
import SectionHeading from "../components/ui/SectionHeading";
import SocialIcon from "../components/ui/SocialIcon";
import TypeBadge from "../components/ui/TypeBadge";

export default function Socials() {
  return (
    <>
      <section className="container-narrow pt-20 pb-12 text-center">
        <TypeBadge variant="rouge">Toutes nos plateformes</TypeBadge>
        <h1 className="display text-encre mt-4">Suis-nous où tu préfères.</h1>
        <p className="text-lg text-encre-500 max-w-2xl mx-auto mt-4 leading-relaxed">
          Chaque réseau a sa ligne éditoriale et ses contenus exclusifs. Choisis ton terrain.
        </p>
      </section>

      <section className="section pt-4">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.keys(socials) as Array<keyof typeof socials>).map((k, i) => (
              <a
                key={k}
                href={socials[k].url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover group !p-8 flex items-start gap-5"
              >
                <span className="text-encre-700 group-hover:text-rouge shrink-0 transition-colors">
                  <SocialIcon type={k} className="w-11 h-11" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-display font-bold text-2xl text-encre">{socials[k].label}</div>
                    <span className="caption text-encre-400">RÉF. 0{i + 1}</span>
                  </div>
                  <div className="caption">{socials[k].handle}</div>
                  <p className="text-encre-500 mt-3 leading-relaxed">{socials[k].description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rouge mt-4">
                    Suivre
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow">
          <SectionHeading eyebrow="À chaque plateforme son style" title="Comment on publie." align="center" />
          <div className="divide-y divide-encre/10 border-y border-encre/10">
            {[
              { p: "YouTube", t: "Vidéos longues, séries pédagogiques, lives", f: "~1 par semaine" },
              { p: "TikTok", t: "Formats courts, moments cultes, astuces", f: "Quotidien" },
              { p: "Instagram", t: "Photos, stories, behind-the-scenes", f: "Plusieurs / semaine" },
              { p: "Facebook", t: "Annonces, communauté élargie", f: "Hebdomadaire" },
            ].map((p) => (
              <div key={p.p} className="flex items-center justify-between gap-4 py-5">
                <div>
                  <div className="font-display font-bold text-encre">{p.p}</div>
                  <div className="text-sm text-encre-500">{p.t}</div>
                </div>
                <div className="mono-meta text-laiton-700 whitespace-nowrap">{p.f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
