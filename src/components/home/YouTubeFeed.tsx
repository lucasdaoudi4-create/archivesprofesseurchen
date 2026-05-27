import { socials } from "../../data/site";
import SectionHeading from "../ui/SectionHeading";
import SocialIcon from "../ui/SocialIcon";
import TypeBadge from "../ui/TypeBadge";

export default function YouTubeFeed() {
  const channelId = socials.youtube.channelId;
  if (!channelId) return null;

  // Truc YouTube : chaque chaîne a une playlist "uploads" automatique
  // dont l'ID se déduit en remplaçant le préfixe "UC" du channelId par "UU".
  // Cette playlist contient toutes les vidéos publiées, dans l'ordre chronologique.
  const uploadsPlaylistId = "UU" + channelId.slice(2);
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&rel=0&modestbranding=1`;

  return (
    <section className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Sur YouTube"
          title="Dernières vidéos"
          subtitle="Nos analyses, séries et lives Pokémon — toujours frais, mis à jour automatiquement."
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-white/10 bg-lab-900 aspect-video">
            <iframe
              src={embedUrl}
              title="Dernières vidéos YouTube"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <aside className="card !p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-400">
                <SocialIcon type="youtube" className="w-10 h-10" />
              </span>
              <div>
                <div className="font-display text-white">{socials.youtube.label}</div>
                <div className="text-xs font-mono text-lab-400">{socials.youtube.handle}</div>
              </div>
            </div>
            <p className="text-sm text-lab-300 mb-4 flex-1">
              {socials.youtube.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <TypeBadge variant="fire">Analyses</TypeBadge>
              <TypeBadge variant="water">Lives</TypeBadge>
              <TypeBadge variant="grass">Séries</TypeBadge>
            </div>
            <a
              href={socials.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-yellow w-full"
            >
              S'abonner à la chaîne
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
