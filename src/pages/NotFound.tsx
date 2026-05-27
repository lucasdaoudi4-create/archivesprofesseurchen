import { Link } from "react-router-dom";
import Pokeball from "../components/ui/Pokeball";

export default function NotFound() {
  return (
    <section className="container-narrow min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-pokeball-red/30 blur-2xl rounded-full" />
        <Pokeball size={140} spin className="relative" />
      </div>
      <div className="text-7xl sm:text-8xl font-display text-gradient-fire">404</div>
      <h1 className="heading-display text-white mt-4">Ce Pokémon s'est échappé !</h1>
      <p className="text-lab-200 mt-3 max-w-md">
        La page que tu cherches n'existe pas (ou a été déplacée par un Abra téléporteur).
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
        <Link to="/discord" className="btn-ghost">
          Demander sur le Discord
        </Link>
      </div>
    </section>
  );
}
