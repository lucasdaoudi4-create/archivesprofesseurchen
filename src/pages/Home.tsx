import { Link } from "react-router-dom";
import { discord, formation, minecraft, news, site, socials } from "../data/site";
import Seal from "../components/brand/Seal";
import Spark from "../components/brand/Spark";
import SparkField from "../components/brand/SparkField";
import Pictogram from "../components/brand/Pictogram";
import type { PictoName } from "../components/brand/Pictogram";
import SocialIcon from "../components/ui/SocialIcon";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import LiveDot from "../components/ui/LiveDot";
import DiscordLiveStats from "../components/ui/DiscordLiveStats";
import { useMinecraftStatus } from "../hooks/useMinecraftStatus";
import YouTubeFeed from "../components/home/YouTubeFeed";
import NewsletterForm from "../components/home/NewsletterForm";

const VALUES: { picto: PictoName; title: string; text: string }[] = [
  { picto: "curiosite", title: "Explorer", text: "Plonger dans chaque recoin de l'univers Pokémon, jeux, anime et au-delà." },
  { picto: "savoir", title: "Archiver", text: "Consigner les découvertes, les mythes et les analyses dans un fonds vivant." },
  { picto: "collection", title: "Partager", text: "Transmettre cette passion en vidéos, en jeu et en communauté." },
];

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
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative bg-encre text-creme overflow-hidden">
        <SparkField color="#5E7A48" opacity={0.14} />
        <div className="absolute -top-24 right-0 w-[36rem] h-[36rem] rounded-full bg-rouge/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-laiton/10 blur-[120px] pointer-events-none" />

        <div className="container-wide relative pt-20 pb-24 sm:pt-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="space-y-7 min-w-0">
            <span className="eyebrow text-laiton-400">Édition 2026 · Le laboratoire est ouvert</span>
            <h1 className="display text-creme">
              Le monde Pokémon,
              <span className="text-rouge-400"> archivé.</span>
            </h1>
            <p className="text-lg text-encre-300 max-w-xl leading-relaxed">
              {site.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/formation" className="btn-primary">
                Découvrir la formation
                <Spark size="0.8em" />
              </Link>
              <a href={discord.inviteUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark">
                Rejoindre le Discord
              </a>
            </div>
            <dl className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-6">
              {[
                { v: discord.memberCountApprox, l: "Membres Discord" },
                { v: "7", l: "Modules de formation" },
                { v: "24/7", l: "Serveur Cobblemon" },
              ].map((s) => (
                <div key={s.l}>
                  <dd className="font-display font-extrabold text-3xl text-laiton-400 leading-none">{s.v}</dd>
                  <dt className="mono-meta text-encre-300 mt-1.5">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex justify-center lg:justify-end min-w-0">
            <div className="absolute inset-0 m-auto w-64 h-64 rounded-full bg-rouge/15 blur-3xl" />
            <Seal size={340} variant="full" tone="cream" className="relative animate-float-slow drop-shadow-2xl w-[min(78vw,340px)] h-auto" />
          </div>
        </div>

        {/* bandeau mono façon en-tête de charte */}
        <div className="relative border-t border-creme/10">
          <div className="container-wide py-3 flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-1 mono-meta text-encre-300 text-center">
            <span>Les Archives du Professeur Chen</span>
            <span className="hidden sm:inline">Savoir · Partage · Passion</span>
            <span className="hidden sm:inline">archivesprofesseurchen.com</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- MANIFESTE */}
      <section className="section">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-x-10 gap-y-10">
            {VALUES.map((v, i) => (
              <div key={v.title} className="flex gap-5">
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-xl border border-parchemin-600 bg-parchemin/60 flex items-center justify-center text-rouge">
                    <Pictogram name={v.picto} size={24} />
                  </div>
                </div>
                <div>
                  <div className="caption text-laiton-700">RÉF. 0{i + 1}</div>
                  <h3 className="heading-2 mt-1 text-encre">{v.title}.</h3>
                  <p className="mt-2 text-encre-500 leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- GRILLE RÉSEAUX */}
      <section className="section pt-0">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Suivre les Archives"
            title="Quatre plateformes, un même fil."
            subtitle="Chaque réseau a sa ligne éditoriale. La marque vit avant tout sur YouTube et TikTok."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(socials) as Array<keyof typeof socials>).map((k, i) => (
              <a
                key={k}
                href={socials[k].url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="text-encre-700 group-hover:text-rouge transition-colors">
                    <SocialIcon type={k} className="w-8 h-8" />
                  </span>
                  <span className="caption text-encre-400">RÉF. 0{i + 1}</span>
                </div>
                <div className="mt-5">
                  <div className="font-display font-bold text-encre text-lg">{socials[k].label}</div>
                  <div className="caption">{socials[k].handle}</div>
                </div>
                <p className="mt-2 text-sm text-encre-500 leading-relaxed flex-1">{socials[k].description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rouge">
                  Suivre
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- FORMATION */}
      <section className="section pt-0">
        <div className="container-wide grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="eyebrow">Programme phare</span>
            <h2 className="heading-1 text-encre">
              La formation qui transforme les passionnés en <span className="text-rouge underline-laiton">créateurs</span>.
            </h2>
            <p className="text-encre-500 text-lg leading-relaxed">{formation.pitch}</p>
            <ul className="space-y-3">
              {formation.highlights.slice(0, 4).map((h) => (
                <li key={h.title} className="flex gap-3 items-baseline">
                  <Spark size="0.7em" className="text-laiton translate-y-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-encre">{h.title}</span>
                    <span className="text-encre-500"> — {h.text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/formation" className="btn-primary">Voir le programme</Link>
              <Link to="/contact" className="btn-outline">Poser une question</Link>
            </div>
          </div>

          <div className="card card-parch !p-8">
            <div className="flex items-center justify-between border-b border-encre/10 pb-4 mb-4">
              <div>
                <div className="label text-rouge">Sommaire des modules</div>
                <div className="font-display font-bold text-encre text-lg mt-1">7 chapitres + bonus</div>
              </div>
              <Seal size={48} variant="simple" tone="rouge" />
            </div>
            <ol className="space-y-1">
              {formation.modules.slice(0, 6).map((m, i) => (
                <li key={m} className="flex items-baseline gap-3 py-2 border-b border-encre/5 last:border-0">
                  <span className="font-mono text-sm text-laiton-700 w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-encre-700">{m.replace(/^Module \d+ — /, "")}</span>
                </li>
              ))}
            </ol>
            <div className="caption text-center pt-4">+ 2 modules et une bibliothèque de bonus à découvrir</div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- MINECRAFT + DISCORD */}
      <section className="section pt-0">
        <div className="container-wide grid lg:grid-cols-2 gap-5">
          <Link to="/minecraft" className="card card-hover group !p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <TypeBadge variant="vert">Serveur Minecraft</TypeBadge>
              <LiveDot status={mcDotStatus} label={mcPlayers ?? undefined} />
            </div>
            <h3 className="heading-2 text-encre mt-5">{minecraft.name}</h3>
            <p className="text-encre-500 mt-2 leading-relaxed">{minecraft.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="tag border-encre/15 text-encre-700 bg-encre/[0.03]">Cobblemon</span>
              <span className="tag border-encre/15 text-encre-700 bg-encre/[0.03]">v{minecraft.version}</span>
              <span className="tag border-encre/15 text-encre-700 bg-encre/[0.03]">Système de Ligue</span>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-rouge">
              Explorer l'Académie
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          <Link to="/discord" className="card card-hover group !p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <TypeBadge variant="laiton">Communauté Discord</TypeBadge>
              <DiscordLiveStats variant="inline" />
            </div>
            <h3 className="heading-2 text-encre mt-5">Une communauté de dresseurs t'attend.</h3>
            <p className="text-encre-500 mt-2 leading-relaxed">
              Discussions Pokémon, échanges, combats, événements et avant-premières. Le quartier général officiel.
            </p>
            <ul className="space-y-1.5 mt-4">
              {discord.features.slice(0, 3).map((f) => (
                <li key={f} className="text-sm text-encre-500 flex items-baseline gap-2">
                  <Spark size="0.6em" className="text-laiton shrink-0 translate-y-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-rouge">
              Rejoindre le serveur
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------- YOUTUBE */}
      <YouTubeFeed />

      {/* ----------------------------------------------------------- NEWS */}
      <section className="section pt-0">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Notes d'archive"
            title="Le carnet du Professeur."
            subtitle="Annonces, sorties, événements : ce qui s'écrit en ce moment dans le laboratoire."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((n, i) => (
              <article key={n.title} className="card card-hover group flex flex-col">
                <div className="flex items-center justify-between">
                  <TypeBadge variant={i === 0 ? "rouge" : i === 1 ? "vert" : "laiton"}>{n.tag}</TypeBadge>
                  <span className="caption">RÉF. {String(i + 1).padStart(3, "0")}</span>
                </div>
                <time className="caption mt-4 block">{new Date(n.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</time>
                <h3 className="font-display font-bold text-encre text-lg mt-1 group-hover:text-rouge transition-colors">{n.title}</h3>
                <p className="text-sm text-encre-500 mt-2 leading-relaxed">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- NEWSLETTER */}
      <section className="section pt-0">
        <div className="container-narrow">
          <div className="relative rounded-2xl bg-encre text-creme overflow-hidden">
            <SparkField color="#C2922F" opacity={0.1} />
            <div className="relative px-6 py-14 sm:px-12 text-center">
              <span className="eyebrow justify-center text-laiton-400">Newsletter</span>
              <h3 className="display text-creme mt-4 text-[2rem] sm:text-4xl">Reste dans la boucle des Archives.</h3>
              <p className="text-encre-300 max-w-xl mx-auto mt-4 leading-relaxed">
                Un courrier par mois : nouveautés, événements, sorties de contenus et coulisses du laboratoire.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
