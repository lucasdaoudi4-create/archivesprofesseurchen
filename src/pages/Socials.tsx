import { socials } from "../data/site";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import SocialIcon from "../components/ui/SocialIcon";

export default function Socials() {
  return (
    <>
      <section className="container-narrow pt-20 pb-12 text-center">
        <TypeBadge variant="psychic">Toutes nos plateformes</TypeBadge>
        <h1 className="heading-display mt-4 text-white">Suis-nous où tu préfères</h1>
        <p className="text-lg text-lab-200 max-w-2xl mx-auto mt-4">
          Chaque réseau a sa ligne éditoriale et ses contenus exclusifs. Choisis ton terrain de jeu.
        </p>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.keys(socials) as Array<keyof typeof socials>).map((k) => (
              <a
                key={k}
                href={socials[k].url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group !p-8 relative overflow-hidden hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${socials[k].bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-start gap-5">
                  <div className={`${socials[k].color} group-hover:scale-110 transition-transform`}>
                    <SocialIcon type={k} className="w-12 h-12" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-2xl text-white">{socials[k].label}</div>
                    <div className="text-sm text-lab-400 font-mono mb-3">{socials[k].handle}</div>
                    <p className="text-lab-200">{socials[k].description}</p>
                    <div className="flex items-center text-pikachu-yellow font-semibold mt-4">
                      Suivre
                      <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="À chaque plateforme son style"
            title="Comment on publie"
            align="center"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { p: "YouTube", t: "Vidéos longues, séries pédagogiques, lives", f: "~1 par semaine" },
              { p: "TikTok", t: "Formats courts, moments cultes, astuces", f: "Quotidien" },
              { p: "Instagram", t: "Photos, stories, behind-the-scenes", f: "Plusieurs par semaine" },
              { p: "Facebook", t: "Annonces, communauté élargie", f: "Hebdomadaire" },
            ].map((p) => (
              <div key={p.p} className="card flex items-center justify-between">
                <div>
                  <div className="font-display text-white">{p.p}</div>
                  <div className="text-sm text-lab-300">{p.t}</div>
                </div>
                <div className="text-xs uppercase tracking-wider text-pikachu-yellow font-semibold whitespace-nowrap ml-4">
                  {p.f}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
