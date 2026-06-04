import { Link } from "react-router-dom";
import Seal from "../components/brand/Seal";

export default function NotFound() {
  return (
    <section className="container-narrow min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
      <Seal size={110} variant="simple" tone="rouge" className="animate-float-slow" />
      <div className="font-display font-extrabold text-7xl sm:text-8xl text-encre mt-8">404</div>
      <h1 className="heading-1 text-encre mt-3">Cette fiche est introuvable.</h1>
      <p className="text-encre-500 mt-3 max-w-md leading-relaxed">
        La page que tu cherches n'existe pas, ou a été déplacée dans un autre rayon des Archives.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        <Link to="/discord" className="btn-outline">Demander sur le Discord</Link>
      </div>
    </section>
  );
}
