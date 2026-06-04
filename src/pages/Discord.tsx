import { discord } from "../data/site";
import Seal from "../components/brand/Seal";
import Spark from "../components/brand/Spark";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import DiscordLiveStats from "../components/ui/DiscordLiveStats";

function DiscordGlyph({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.6 5.3A17.6 17.6 0 0 0 15.3 4l-.3.6c1.5.3 2.2.8 3 1.3a12.3 12.3 0 0 0-9.4 0c.8-.5 1.7-1 3-1.3L11.3 4A17.6 17.6 0 0 0 7 5.3C4.3 9.3 3.6 13.2 4 17a17.7 17.7 0 0 0 5.4 2.7l.5-.8c-.7-.3-1.4-.6-2-1.1l.5-.3a11.7 11.7 0 0 0 10.2 0l.5.3c-.6.5-1.3.8-2 1.1l.5.8A17.7 17.7 0 0 0 23 17c.4-4.3-.6-8.2-3.4-11.7ZM9.5 14.7c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

export default function Discord() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-creme-veil">
        <div className="container-narrow relative pt-20 pb-16 text-center">
          <div className="flex justify-center mb-6">
            <Seal size={84} variant="simple" tone="rouge" />
          </div>
          <TypeBadge variant="laiton">Communauté officielle</TypeBadge>
          <h1 className="display text-encre mt-4">Le QG des dresseurs.</h1>
          <p className="text-lg text-encre-500 max-w-2xl mx-auto mt-5 leading-relaxed">
            {discord.memberCountApprox} membres actifs, des salons pour chaque génération, des événements
            communautaires chaque semaine. Pose ton sac et fais-toi des amis dresseurs.
          </p>
          <div className="flex justify-center mt-8">
            <a href={discord.inviteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-7 py-3.5">
              <DiscordGlyph className="w-5 h-5" />
              Rejoindre le serveur
            </a>
          </div>
          <div className="mt-4 flex justify-center">
            <DiscordLiveStats variant="inline" />
          </div>
          <div className="caption mt-3 break-all">{discord.inviteUrl}</div>
        </div>
      </section>

      {/* CE QUI T'ATTEND */}
      <section className="section">
        <div className="container-narrow">
          <SectionHeading eyebrow="Ce qui t'attend" title="Un serveur vivant, structuré, accueillant." />
          <div className="grid sm:grid-cols-2 gap-4">
            {discord.features.map((f, i) => (
              <div key={f} className="card flex gap-4 items-start">
                <span className="font-mono text-sm text-laiton-700 shrink-0 pt-1.5 w-7">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-encre-700 pt-1">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RÈGLES / CTA */}
      <section className="section pt-0">
        <div className="container-narrow">
          <div className="card card-parch !p-10 text-center">
            <div className="flex justify-center text-encre-700 mb-4">
              <DiscordGlyph className="w-9 h-9" />
            </div>
            <h3 className="heading-2 text-encre mb-2">Les règles du serveur</h3>
            <p className="text-encre-500 mb-6 max-w-xl mx-auto leading-relaxed">
              Respect, bienveillance et pas de spoils sans balise. On accueille tous les niveaux, des
              joueurs occasionnels aux compétiteurs. Modération active.
            </p>
            <a href={discord.inviteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Spark size="0.8em" />
              J'accepte et je rejoins
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
