import { Link } from "react-router-dom";
import { discord, formation, minecraft, news, site, socials } from "../data/site";
import Pokeball from "../components/ui/Pokeball";
import SocialIcon from "../components/ui/SocialIcon";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import LiveDot from "../components/ui/LiveDot";
import DiscordLiveStats from "../components/ui/DiscordLiveStats";
import { useMinecraftStatus } from "../hooks/useMinecraftStatus";
import YouTubeFeed from "../components/home/YouTubeFeed";
import NewsletterForm from "../components/home/NewsletterForm";

export default function Home() {
  const mcStatus = useMinecraftStatus(minecraft.ip);
  const mcOnline = mcStatus.status === "ok" && mcStatus.data.online;
  const mcDotStatus = mcStatus.status === "loading" ? "loading" : mcOnline ? "online" : "offline";
  const mcPlayers =
    mcStatus.status === "ok" && mcStatus.data.online && mcStatus.data.players
      ? `${mcStatus.data.players.online} en jeu`
      : null;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-pokeball-red/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-pikachu-yellow/10 blur-3xl" />

        <div className="container-wide relative pt-20 pb-28 sm:pt-28 sm:pb-36 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <TypeBadge variant="electric">Laboratoire ouvert</TypeBadge>
            <h1 className="heading-display">
              <span className="text-white">Bienvenue dans</span>
              <br />
              <span className="text-gradient-fire">les Archives</span>
              <br />
              <span className="text-white">du Professeur Chen.</span>
            </h1>
            <p className="text-lg text-lab-200 max-w-xl leading-relaxed">
              {site.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/formation" className="btn-primary">
                Découvrir la formation
                <span aria-hidden>→</span>
              </Link>
              <a
                href={discord.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Rejoindre le Discord
              </a>
            </div>
            <div className="flex items-center gap-6 pt-6">
              <div>
                <div className="text-2xl font-display text-pikachu-yellow">{discord.memberCountApprox}</div>
                <div className="text-xs text-lab-400 uppercase tracking-wider">Membres Discord</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-display text-pikachu-yellow">7</div>
                <div className="text-xs text-lab-400 uppercase tracking-wider">Modules formation</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-display text-pikachu-yellow">24/7</div>
                <div className="text-xs text-lab-400 uppercase tracking-wider">Serveur Minecraft</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-pokeball-red/30 blur-3xl rounded-full animate-pulse" />
              <Pokeball size={320} spin className="relative drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL GRID */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Suis-nous partout"
            title="Quatre plateformes, une seule équipe"
            subtitle="Chaque plateforme a son ambiance et ses contenus exclusifs. Choisis ton terrain."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(socials) as Array<keyof typeof socials>).map((k) => (
              <a
                key={k}
                href={socials[k].url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${socials[k].bg} opacity-60 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative space-y-3">
                  <div className={`${socials[k].color} group-hover:scale-110 transition-transform`}>
                    <SocialIcon type={k} className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="font-display text-white text-lg">{socials[k].label}</div>
                    <div className="text-xs text-lab-400 font-mono">{socials[k].handle}</div>
                  </div>
                  <p className="text-sm text-lab-300">{socials[k].description}</p>
                  <div className="flex items-center text-pikachu-yellow text-sm font-semibold pt-2">
                    Suivre
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATION HIGHLIGHT */}
      <section className="section bg-gradient-to-b from-transparent via-pokeball-red/5 to-transparent">
        <div className="container-wide grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <TypeBadge variant="fire">Notre programme phare</TypeBadge>
            <h2 className="heading-display text-white">
              La <span className="text-gradient-fire">Formation</span> qui transforme les passionnés en créateurs.
            </h2>
            <p className="text-lab-200 text-lg leading-relaxed">{formation.pitch}</p>
            <ul className="space-y-2">
              {formation.highlights.slice(0, 4).map((h) => (
                <li key={h.title} className="flex gap-3 items-start">
                  <span className="text-xl">{h.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{h.title}</div>
                    <div className="text-sm text-lab-300">{h.text}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-2">
              <Link to="/formation" className="btn-primary">
                Voir le programme
              </Link>
              <Link to="/contact" className="btn-ghost">
                Poser une question
              </Link>
            </div>
          </div>
          <div className="card !p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-pokeball-red/20 flex items-center justify-center text-pokeball-red">
                <Pokeball size={28} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-pikachu-yellow">Module complet</div>
                <div className="font-display text-white">7 chapitres + bonus</div>
              </div>
            </div>
            <ol className="space-y-2">
              {formation.modules.slice(0, 6).map((m, i) => (
                <li
                  key={m}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <span className="text-pikachu-yellow font-mono font-bold w-6 text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-lab-100">{m}</span>
                </li>
              ))}
              <li className="text-center text-sm text-lab-400 italic pt-1">
                + 2 modules et bonus à découvrir
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* MINECRAFT & DISCORD ROW */}
      <section className="section">
        <div className="container-wide grid lg:grid-cols-2 gap-6">
          <Link
            to="/minecraft"
            className="card group !p-8 relative overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-grass/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between gap-3">
                <TypeBadge variant="grass">Serveur Minecraft</TypeBadge>
                <LiveDot status={mcDotStatus} label={mcPlayers ?? undefined} />
              </div>
              <h3 className="text-3xl font-display text-white">{minecraft.name}</h3>
              <p className="text-lab-200">{minecraft.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="badge bg-white/5 border border-white/10 text-lab-200">
                  IP : <span className="font-mono ml-1 text-pikachu-yellow">{minecraft.ip}</span>
                </span>
                <span className="badge bg-white/5 border border-white/10 text-lab-200">
                  v{minecraft.version}
                </span>
              </div>
              <div className="flex items-center text-pikachu-yellow font-semibold pt-2">
                Explorer l'Académie
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link
            to="/discord"
            className="card group !p-8 relative overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5865f2]/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between gap-3">
                <TypeBadge variant="water">Communauté Discord</TypeBadge>
                <DiscordLiveStats variant="inline" />
              </div>
              <h3 className="text-3xl font-display text-white">Une communauté de dresseurs t'attend</h3>
              <p className="text-lab-200">
                Discussions Pokémon, échanges, combats, événements et avant-premières. Le QG officiel.
              </p>
              <ul className="space-y-1.5 pt-2">
                {discord.features.slice(0, 3).map((f) => (
                  <li key={f} className="text-sm text-lab-300 flex items-start gap-2">
                    <span className="text-pikachu-yellow mt-1">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-pikachu-yellow font-semibold pt-2">
                Rejoindre le serveur
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* YOUTUBE FEED */}
      <YouTubeFeed />

      {/* NEWS / LATEST */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Actualités"
            title="Le carnet de bord du Professeur"
            subtitle="Annonces, sorties, événements : tout ce qui se passe dans le laboratoire."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((n) => (
              <article key={n.title} className="card group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-pikachu-yellow/15 border border-pikachu-yellow/30 text-pikachu-yellow">
                    {n.tag}
                  </span>
                  <time className="text-xs text-lab-400 font-mono">
                    {new Date(n.date).toLocaleDateString("fr-FR")}
                  </time>
                </div>
                <h3 className="text-lg font-display text-white mb-2 group-hover:text-pikachu-yellow transition-colors">
                  {n.title}
                </h3>
                <p className="text-sm text-lab-300">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA NEWSLETTER */}
      <section className="section">
        <div className="container-narrow">
          <div className="card !p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pokeball-red/20 via-transparent to-pikachu-yellow/20 opacity-50" />
            <div className="relative space-y-4">
              <TypeBadge variant="psychic">Newsletter</TypeBadge>
              <h3 className="heading-display text-white">Reste connecté au laboratoire</h3>
              <p className="text-lab-200 max-w-xl mx-auto">
                Un email par mois : nouveautés, événements, sorties de contenus exclusifs et coulisses.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
