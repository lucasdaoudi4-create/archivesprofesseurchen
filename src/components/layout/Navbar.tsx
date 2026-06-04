import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../../data/site";
import Seal from "../brand/Seal";
import Spark from "../brand/Spark";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-creme/90 backdrop-blur-md border-b border-encre/10 shadow-[0_8px_30px_-24px_rgba(22,19,13,0.5)]"
          : "bg-creme/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Accueil — Les Archives du Professeur Chen">
          <Seal size={34} variant="simple" tone="rouge" className="transition-transform duration-500 group-hover:rotate-[18deg]" />
          <span className="flex flex-col leading-none">
            <span className="font-display font-extrabold tracking-tight text-encre text-[0.95rem] inline-flex items-center gap-1">
              Prof. Chen
              <Spark size="0.55em" className="text-rouge" />
            </span>
            <span className="mono-meta text-encre-400 mt-0.5">Les Archives · FR</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-rouge" : "text-encre-600 hover:text-encre"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/formation" className="btn-primary text-sm py-2 px-4">
            Rejoindre la formation
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md text-encre hover:bg-encre/5"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-encre/10 bg-creme/95 backdrop-blur-md">
          <nav className="container-wide py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive ? "text-rouge bg-rouge-50" : "text-encre-700 hover:bg-encre/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/formation" className="btn-primary mt-2 w-full">
              Rejoindre la formation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
