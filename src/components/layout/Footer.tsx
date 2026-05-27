import { Link } from "react-router-dom";
import { navLinks, site, socials } from "../../data/site";
import Pokeball from "../ui/Pokeball";
import SocialIcon from "../ui/SocialIcon";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-lab-950/80">
      <div className="container-wide py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <Pokeball size={36} />
            <div>
              <div className="font-display text-white text-lg">{site.name}</div>
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow/80">
                {site.tagline}
              </div>
            </div>
          </div>
          <p className="text-lab-300 max-w-md text-sm leading-relaxed">{site.description}</p>
          <div className="flex items-center gap-3 pt-2">
            {(Object.keys(socials) as Array<keyof typeof socials>).map((k) => (
              <a
                key={k}
                href={socials[k].url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socials[k].label}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-lab-200 hover:text-pikachu-yellow hover:border-pikachu-yellow/40 transition-colors"
              >
                <SocialIcon type={k} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-white font-display text-sm mb-4 uppercase tracking-wider">
            Navigation
          </div>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-lab-300 hover:text-pikachu-yellow transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-white font-display text-sm mb-4 uppercase tracking-wider">
            Légal
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/mentions-legales" className="text-lab-300 hover:text-pikachu-yellow transition-colors">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to="/cgv" className="text-lab-300 hover:text-pikachu-yellow transition-colors">
                CGV / CGU
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="text-lab-300 hover:text-pikachu-yellow transition-colors">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-lab-300 hover:text-pikachu-yellow transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-lab-400">
          <div>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</div>
          <div className="opacity-70">
            Site non affilié à The Pokémon Company. Pokémon™ et noms associés sont des marques déposées de leurs ayants droit.
          </div>
        </div>
      </div>
    </footer>
  );
}
