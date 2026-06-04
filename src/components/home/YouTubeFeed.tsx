import { socials } from "../../data/site";
import SectionHeading from "../ui/SectionHeading";
import SocialIcon from "../ui/SocialIcon";
import TypeBadge from "../ui/TypeBadge";

export default function YouTubeFeed() {
  const channelId = socials.youtube.channelId;
  if (!channelId) return null;

  // Chaque chaîne YouTube a une playlist « uploads » automatique dont l'ID se
  // déduit en remplaçant le préfixe "UC" du channelId par "UU".
  const uploadsPlaylistId = "UU" + channelId.slice(2);
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&rel=0&modestbranding=1`;

  return (
    <section className="section">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Sur YouTube"
          title="Les dernières chroniques."
          subtitle="Analyses, séries et lives Pokémon — le fil se met à jour automatiquement à chaque publication."
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-parchemin-600 bg-encre aspect-video">
            <iframe
              src={embedUrl}
              title="Dernières vidéos YouTube — Les Archives du Professeur Chen"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <aside className="card flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-rouge">
                <SocialIcon type="youtube" className="w-9 h-9" />
              </span>
              <div>
                <div className="font-display font-bold text-encre">{socials.youtube.label}</div>
                <div className="caption">{socials.youtube.handle}</div>
              </div>
            </div>
            <p className="text-encre-500 mb-5 flex-1 leading-relaxed">{socials.youtube.description}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              <TypeBadge variant="rouge">Analyses</TypeBadge>
              <TypeBadge variant="vert">Séries</TypeBadge>
              <TypeBadge variant="laiton">Lives</TypeBadge>
            </div>
            <a
              href={socials.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full mt-auto"
            >
              S'abonner à la chaîne
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
