import { discord } from "../data/site";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";

export default function Discord() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-[#5865f2]/30 blur-3xl" />

        <div className="container-narrow relative pt-20 pb-16 text-center">
          <TypeBadge variant="water">Communauté officielle</TypeBadge>
          <h1 className="heading-display mt-4">
            <span className="text-white">Le QG des</span>{" "}
            <span className="text-gradient-electric">dresseurs</span>
          </h1>
          <p className="text-xl text-lab-200 max-w-2xl mx-auto mt-6 leading-relaxed">
            {discord.memberCountApprox} membres actifs, des salons pour chaque génération, des événements
            communautaires hebdomadaires. Pose ton sac et fais-toi des amis dresseurs.
          </p>
          <a
            href={discord.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 text-base px-8 py-4 bg-[#5865f2] !shadow-none hover:brightness-110"
          >
            Rejoindre le serveur
            <span aria-hidden>→</span>
          </a>
          <div className="mt-4 text-xs text-lab-400 font-mono">{discord.inviteUrl}</div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Ce qui t'attend"
            title="Un serveur vivant, structuré, accueillant"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {discord.features.map((f, i) => (
              <div key={f} className="card flex gap-4">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-[#5865f2]/20 border border-[#5865f2]/40 flex items-center justify-center text-[#5865f2] font-display">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-lab-100 pt-1.5">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <div className="card !p-10 text-center">
            <h3 className="font-display text-2xl text-white mb-2">Règles du serveur</h3>
            <p className="text-lab-300 mb-6 max-w-xl mx-auto">
              Respect, bienveillance et pas de spoils sans balise. On accueille tous les niveaux, des
              casuals aux compétiteurs. Modération active.
            </p>
            <a
              href={discord.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-[#5865f2] !shadow-none hover:brightness-110"
            >
              J'accepte et je rejoins
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
