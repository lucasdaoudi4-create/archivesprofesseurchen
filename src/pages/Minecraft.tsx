import { useState } from "react";
import { minecraft } from "../data/site";
import Seal from "../components/brand/Seal";
import Spark from "../components/brand/Spark";
import Pictogram from "../components/brand/Pictogram";
import type { PictoName } from "../components/brand/Pictogram";
import SectionHeading from "../components/ui/SectionHeading";
import TypeBadge from "../components/ui/TypeBadge";
import LiveDot from "../components/ui/LiveDot";
import { useMinecraftStatus } from "../hooks/useMinecraftStatus";

const FEATURE_PICTOS: PictoName[] = ["collection", "savoir", "nature", "curiosite", "chroniques"];

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
      /* clipboard indisponible */
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-creme-veil">
        <div className="container-wide relative pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <TypeBadge variant="vert">Serveur officiel · Cobblemon</TypeBadge>
            <h1 className="display text-encre">{minecraft.name}</h1>
            <p className="text-lg text-encre-500 leading-relaxed">{minecraft.description}</p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-parchemin-600 border border-parchemin-600 rounded-xl overflow-hidden max-w-2xl">
              <div className="bg-creme p-4">
                <dt className="mono-meta text-encre-400">Statut</dt>
                <dd className="mt-1.5"><LiveDot status={dotStatus} /></dd>
              </div>
              <div className="bg-creme p-4">
                <dt className="mono-meta text-encre-400">Joueurs</dt>
                <dd className="font-display font-bold text-encre mt-1">
                  {status.status === "loading" && "…"}
                  {status.status === "ok" && isOnline && players
                    ? `${players.online}/${players.max}`
                    : status.status === "ok"
                    ? "—"
                    : status.status === "error"
                    ? "?"
                    : null}
                </dd>
              </div>
              <div className="bg-creme p-4">
                <dt className="mono-meta text-encre-400">Version</dt>
                <dd className="font-display font-bold text-encre text-sm mt-1.5">{liveVersion ?? minecraft.version}</dd>
              </div>
              <div className="bg-creme p-4">
                <dt className="mono-meta text-encre-400">Mode</dt>
                <dd className="font-display font-bold text-encre text-sm mt-1.5">Cobblemon</dd>
              </div>
            </dl>
          </div>

          <div className="card card-parch !p-8">
            <div className="flex items-center justify-between border-b border-encre/10 pb-4 mb-5">
              <span className="label text-vert-700">Connexion serveur</span>
              <Seal size={44} variant="simple" tone="rouge" />
            </div>
            <p className="text-sm text-encre-500 mb-4 leading-relaxed">
              Lance Minecraft, va dans <span className="font-mono text-encre">Multijoueur</span> →{" "}
              <span className="font-mono text-encre">Ajouter un serveur</span>, puis colle l'IP ci-dessous.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-creme border border-encre/15">
              <div className="flex-1 min-w-0">
                <div className="mono-meta text-encre-400 mb-1">IP du serveur</div>
                <div className="font-mono text-lg text-rouge break-all">{minecraft.ip}</div>
              </div>
              <button
                onClick={copyIp}
                className={`btn shrink-0 text-sm py-2 px-4 ${
                  copied ? "bg-vert text-creme" : "bg-encre text-creme hover:bg-encre-800"
                }`}
              >
                {copied ? "Copié ✓" : "Copier"}
              </button>
            </div>
            <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-laiton-50 border border-laiton/30">
              <Spark size="0.9em" className="text-laiton-700 mt-1 shrink-0" />
              <p className="text-sm text-laiton-700 leading-relaxed">
                Le mod Cobblemon est requis pour rejoindre. Installation via CurseForge ou Modrinth en quelques clics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPÉRIENCE */}
      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="L'expérience"
            title="Ce qui rend l'Académie unique."
            subtitle="Plus qu'un serveur Cobblemon — un univers structuré, pédagogique et social."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {minecraft.features.map((f, i) => (
              <div key={f} className="card card-hover flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-vert-50 border border-vert/30 flex items-center justify-center text-vert-700 shrink-0">
                  <Pictogram name={FEATURE_PICTOS[i % FEATURE_PICTOS.length]} size={20} />
                </div>
                <p className="text-encre-700 pt-1.5">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT REJOINDRE */}
      <section className="section pt-0">
        <div className="container-narrow">
          <SectionHeading eyebrow="Premiers pas" title="Rejoindre en trois étapes." />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Installe Cobblemon", d: "Via CurseForge ou Modrinth, version 1.20.x recommandée." },
              { n: "02", t: "Ajoute le serveur", d: `Dans Multijoueur, ajoute l'IP : ${minecraft.ip}` },
              { n: "03", t: "Rejoins l'Académie", d: "Suis les instructions du spawn pour t'inscrire à un cours." },
            ].map((s) => (
              <div key={s.n} className="card">
                <div className="font-display font-extrabold text-4xl text-rouge">{s.n}</div>
                <div className="font-display font-bold text-encre mt-2 mb-1">{s.t}</div>
                <p className="text-sm text-encre-500 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
