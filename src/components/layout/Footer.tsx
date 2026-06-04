import { Link } from "react-router-dom";
import { navLinks, site, socials } from "../../data/site";
import Seal from "../brand/Seal";
import SparkField from "../brand/SparkField";
import SocialIcon from "../ui/SocialIcon";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 bg-encre text-creme overflow-hidden">
      <SparkField color="#5E7A48" opacity={0.13} />
      <div className="relative">
        <div className="container-wide py-16 grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-4">
              <Seal size={52} variant="simple" tone="cream" />
              <div className="leading-tight">
                <div className="font-display font-extrabold text-creme text-lg">{site.name}</div>
                <div className="mono-meta text-laiton-400 mt-1">Savoir · Partage · Passion</div>
              </div>
            </div>
            <p className="text-encre-300 max-w-md leading-relaxed">{site.description}</p>
            <div className="flex items-center gap-2.5 pt-1">
              {(Object.keys(socials) as Array<keyof typeof socials>).map((k) => (
                <a
                  key={k}
                  href={socials[k].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socials[k].label}
                  className="p-2.5 rounded-lg border border-creme/15 text-creme/80 hover:text-creme hover:border-laiton/60 hover:bg-creme/5 transition-colors"
                >
                  <SocialIcon type={k} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="label text-laiton-400 mb-4">Navigation</div>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-encre-300 hover:text-creme transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="label text-laiton-400 mb-4">Légal</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/mentions-legales" className="text-encre-300 hover:text-creme transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-encre-300 hover:text-creme transition-colors">
                  CGV / CGU
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-encre-300 hover:text-creme transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-encre-300 hover:text-creme transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-creme/10">
          <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="mono-meta text-encre-300">
              © {year} {site.name} — Tous droits réservés
            </div>
            <div className="mono-meta text-encre-400 text-center sm:text-right max-w-md">
              Site non affilié à The Pokémon Company. Pokémon™ et les noms associés sont des marques de leurs ayants droit.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
