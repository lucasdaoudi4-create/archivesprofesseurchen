import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { reseaux, routes, sas, site } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LE FIL DE LA CHAÎNE — façade de consentement
   Les Archives du Professeur Chen — charte v1.0.0, lot L4

   Reprise de `src/components/home/YouTubeFeed.tsx`. Ce qui est PRÉSERVÉ,
   à l'identique : la déduction de la playlist « envois » à partir du
   `channelId` — chaque chaîne en a une, dont l'identifiant se lit en
   remplaçant le préfixe `UC` par `UU`. C'est la seule mécanique du
   composant d'origine, et elle ne change pas.

   ── CE QUI CHANGE, ET POURQUOI ────────────────────────────────────────────

   1. LE CADRE NE SE CHARGE PLUS TOUT SEUL.
      Le socle § 0.32 range YouTube parmi les tiers à consentement
      (« YouTube en `nocookie` et chargé après consentement ») et le
      08-composants-addendum B-25 en donne le principe : « tant que
      personne n'a cliqué, aucun octet ne part chez YouTube ». Le composant
      d'origine posait l'`iframe` au premier rendu : l'adresse IP du
      visiteur partait chez Google avant qu'il ait rien demandé. Ici,
      l'`iframe` n'est créée qu'au clic.

   2. LE DOMAINE PASSE EN `youtube-nocookie.com`.
      C'est le seul `frame-src` que la politique de sécurité du § 0.32
      autorise. `www.youtube.com` y serait bloqué le jour où l'en-tête
      sera posé.

   3. `cc_load_policy=1&hl=fr` s'ajoutent aux paramètres.
      B-25 : les sous-titres français sont activés à l'ouverture. Pas
      d'`autoplay` en revanche — le clic ici demande le fil, pas la lecture
      immédiate d'une vidéo précise.

   4. LE FOCUS SUIT LE CADRE.
      B-25, tableau des états, ligne « Chargé » : sans ce déplacement, la
      personne au clavier se retrouve AVANT le lecteur qu'elle vient
      d'ouvrir. L'`iframe` reste tabulable — le `tabindex="-1"` du patron
      la sortirait de l'ordre de tabulation une fois le focus reparti.

   ── CE QUE CE COMPOSANT N'EST PAS ─────────────────────────────────────────

   Ce n'est pas `.player` (B-25) : ce composant-là suppose une affiche
   servie depuis notre domaine, et `src/styles/` ne déclare aujourd'hui ni
   `.player` ni aucune classe `.pl-*`. La façade est donc composée avec les
   composants qui existent — `.carte`, `.carte__d`, `.hero__b`, `.btn` — et
   deux réglages de mise en page locaux qui ne lisent que des jetons
   (`--ar-scene`, la scène 16:9 ; `--encre-950`, que 01-tokens-couleur.css
   nomme littéralement « LA SCÈNE : visionneuses 16:9 »).
   ═══════════════════════════════════════════════════════════════════════════ */

export default function FluxYouTube() {
  const chaine = reseaux.youtube;
  const [charge, setCharge] = useState(false);
  const cadre = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (charge) cadre.current?.focus();
  }, [charge]);

  // Aucun `channelId` relevé : pas de fil, et surtout pas de cadre vide.
  // L'addendum 08 § 8.11.2 est explicite — « jamais un cadre 16:9 noir sans
  // explication ». La page garde ses quatre cartes, qui suffisent.
  if (!chaine.channelId) return null;

  const listeEnvois = "UU" + chaine.channelId.slice(2);
  const source =
    "https://www.youtube-nocookie.com/embed/videoseries" +
    `?list=${listeEnvois}&rel=0&modestbranding=1&cc_load_policy=1&hl=fr`;
  const titreCadre = `Les dernières vidéos de la chaîne ${chaine.label} — ${site.name}`;

  if (charge) {
    return (
      <div className="carte">
        <div className="relative overflow-hidden rounded-[var(--r-2)] aspect-[var(--ar-scene)] bg-[var(--encre-950)]">
          <iframe
            ref={cadre}
            src={source}
            title={titreCadre}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="carte__d mt-[var(--sp-4)]">
          Le fil est servi par YouTube, sur youtube-nocookie.com.{" "}
          <a href={chaine.url} target="_blank" rel="noopener">
            Ouvrir la chaîne
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="carte">
      <p className="carte__d">
        Le fil des dernières vidéos est servi par YouTube. Le charger ouvre le lecteur de
        Google et lui transmet votre adresse IP{" "}: rien n’est appelé tant que
        vous ne l’avez pas demandé.
      </p>
      <p className="carte__d mt-[var(--sp-3)]">
        <Link to={routes.confidentialite}>{sas.lienDonnees}</Link>
      </p>
      <div className="hero__b">
        <button className="btn" type="button" onClick={() => setCharge(true)}>
          Charger le fil{" "}
          <span className="btn__f" aria-hidden="true">
            →
          </span>
        </button>
        <a className="btn btn--fantome" href={chaine.url} target="_blank" rel="noopener">
          Ouvrir la chaîne
          <span className="sr-only"> (nouvel onglet)</span>{" "}
          <span className="btn__f" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
