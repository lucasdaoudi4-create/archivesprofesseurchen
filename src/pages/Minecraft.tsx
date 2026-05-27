import { useState } from "react";
import { minecraft } from "../data/site";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import LiveDot from "../components/ui/LiveDot";
import { useMinecraftStatus } from "../hooks/useMinecraftStatus";

export default function Minecraft() {
  const [copied, setCopied] = useState(false);
  const status = useMinecraftStatus(minecraft.ip);
  const isOnline = status.status === "ok" && status.data.online;
  const players = status.status === "ok" ? status.data.players : undefined;
  const liveVersion = status.status === "ok" ? status.data.version : undefined;
  const dotStatus = status.status === "loading" ? "loading" : isOnline ? "online" : "offline";

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(minecraft.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-accent-grass/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-accent-water/20 blur-3xl" />

        <div className="container-wide relative pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <TypeBadge variant="grass">Serveur officiel</TypeBadge>
            <h1 className="heading-display text-white">
              {minecraft.name}
            </h1>
            <p className="text-lg text-lab-200 leading-relaxed">{minecraft.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              <div className="card !p-3 text-center">
                <div className="text-xs uppercase tracking-wider text-lab-400">Statut</div>
                <div className="mt-1 flex justify-center">
                  <LiveDot status={dotStatus} />
                </div>
              </div>
              <div className="card !p-3 text-center">
                <div className="text-xs uppercase tracking-wider text-lab-400">Joueurs</div>
                <div className="font-display text-white">
                  {status.status === "loading" && "…"}
                  {status.status === "ok" && isOnline && players
                    ? `${players.online}/${players.max}`
                    : status.status === "ok"
                    ? "—"
                    : status.status === "error"
                    ? "?"
                    : null}
                </div>
              </div>
              <div className="card !p-3 text-center">
                <div className="text-xs uppercase tracking-wider text-lab-400">Version</div>
                <div className="font-display text-white text-sm">
                  {liveVersion ?? minecraft.version}
                </div>
              </div>
              <div className="card !p-3 text-center">
                <div className="text-xs uppercase tracking-wider text-lab-400">Mode</div>
                <div className="font-display text-white text-sm">Cobblemon</div>
              </div>
            </div>
          </div>

          <div className="card !p-8 space-y-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-grass/10 to-transparent" />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow mb-2">
                Connexion serveur
              </div>
              <div className="text-sm text-lab-300 mb-4">
                Lance Minecraft, va dans <span className="text-white font-mono">Multijoueur</span> →{" "}
                <span className="text-white font-mono">Ajouter un serveur</span>, puis colle l'IP ci-dessous.
              </div>

              <div className="flex items-center gap-2 p-4 rounded-xl bg-lab-950 border border-white/10">
                <div className="flex-1">
                  <div className="text-xs text-lab-400 uppercase tracking-wider mb-0.5">IP du serveur</div>
                  <div className="font-mono text-lg text-pikachu-yellow break-all">{minecraft.ip}</div>
                </div>
                <button
                  onClick={copyIp}
                  className={`btn shrink-0 text-sm py-2 px-4 ${
                    copied ? "bg-accent-grass text-lab-950" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {copied ? "Copié ✓" : "Copier"}
                </button>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-pikachu-yellow/10 border border-pikachu-yellow/30 text-sm text-pikachu-yellow">
                ⚡ Cobblemon est requis pour rejoindre. Installation via CurseForge ou Modrinth en quelques clics.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="L'expérience"
            title="Ce qui rend l'Académie unique"
            subtitle="Plus qu'un serveur Cobblemon — un véritable univers structuré, pédagogique et social."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {minecraft.features.map((f) => (
              <div key={f} className="card hover:-translate-y-1">
                <div className="h-10 w-10 rounded-lg bg-accent-grass/20 border border-accent-grass/40 flex items-center justify-center text-accent-grass text-xl mb-3">
                  ⚔
                </div>
                <p className="text-lab-100">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <SectionHeading eyebrow="Premier pas" title="Comment rejoindre en 3 étapes" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Installe Cobblemon", d: "Via CurseForge ou Modrinth, version 1.20.x recommandée." },
              { n: "02", t: "Ajoute le serveur", d: `Dans Multijoueur, ajoute l'IP : ${minecraft.ip}` },
              { n: "03", t: "Rejoins l'Académie", d: "Suis les instructions du spawn pour t'inscrire à un cours." },
            ].map((s) => (
              <div key={s.n} className="card">
                <div className="text-4xl font-display text-pokeball-red mb-2">{s.n}</div>
                <div className="font-semibold text-white mb-1">{s.t}</div>
                <div className="text-sm text-lab-300">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
