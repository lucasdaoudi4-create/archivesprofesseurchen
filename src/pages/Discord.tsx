import { useEffect, useRef } from "react";
import { discord, meta, routes, site } from "../data/site";
import EtatCommunaute from "../components/discord/EtatCommunaute";

/* ═══════════════════════════════════════════════════════════════════════════
   LA COMMUNAUTÉ — route `/discord` · maquette `#v-discord` (l. 1170-1191)
   Les Archives du Professeur Chen — charte v1.0.0, lot L4

   ── CE QUE CETTE PAGE EST ─────────────────────────────────────────────────

   Une seule bande, une seule idée : ce qui se passe sur le Discord, dit en
   quatre lignes, et une porte pour y entrer. La maquette validée ne met
   rien d'autre sur cette page, et le § 0.25 n'y ajoute qu'une chose — le
   relevé d'état, quand il aura une source.

   ── LE TITRE DE PREMIER NIVEAU ────────────────────────────────────────────

   La maquette est une application à vues : elle n'a qu'un seul `h1`, celui
   du hero de l'accueil, et ses huit autres vues ouvrent sur `h2`. Le site
   a huit ROUTES : chacune doit porter son propre `h1`. `.h2` est une
   classe TYPOGRAPHIQUE (`--fs-h2`), pas un niveau de titre — d'où
   `<h1 class="h2">`, qui garde le dessin de la maquette et rétablit la
   hiérarchie. Aucun saut de niveau ne suit : la page n'a pas de `h2`.

   ── LE COMPTEUR DE MEMBRES ────────────────────────────────────────────────

   L'ancienne page annonçait « 360+ membres actifs » dans son chapô et un
   repli « 360+ membres (estimation) » sous le bouton. Les deux sont partis :
   `discord.memberCountApprox` n'existe plus dans `src/data/site.ts`, et le
   § 0.25 est explicite — aucun chiffre de communauté n'est affiché sans
   source branchée. Le hook `useDiscordWidget` est conservé, monté ici et
   nulle part ailleurs (voir `EtatCommunaute`), et il ne rend rien tant que
   `discord.guildId` vaut `null`.

   ── LA RÉVÉLATION AU DÉFILEMENT ───────────────────────────────────────────

   `04-tokens-motion.css` pose la règle : « le contenu est visible sans
   JavaScript, c'est la classe `.rv` qui masque, et elle n'est posée que si
   l'observateur existe ». Sans `IntersectionObserver`, les trois blocs
   basculent donc en `.on` immédiatement : une page dont le contenu reste
   invisible est un défaut plus grave qu'une page sans animation. Le
   `prefers-reduced-motion` n'est pas traité ici — `99-preferences.css`
   neutralise déjà `.rv`, et le doubler en JavaScript rouvrirait la porte
   à deux vérités.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Révélation au défilement ─────────────────────────────────────────────
   Le seuil de 0,12 et le retrait de l'observation après le premier passage
   viennent de la maquette. Les éléments déjà dans le cadre à l'arrivée de
   route entrent par le premier lot de l'observateur, qui se déclenche au
   montage : une page courte ne reste jamais vide.                        */
function useRevelation(portee: { readonly current: HTMLElement | null }) {
  useEffect(() => {
    const racine = portee.current;
    if (!racine) return;

    const cibles = Array.from(racine.querySelectorAll<HTMLElement>(".rv"));
    if (cibles.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      cibles.forEach((cible) => cible.classList.add("on"));
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          entree.target.classList.add("on");
          observateur.unobserve(entree.target);
        }
      },
      { threshold: 0.12 }
    );

    cibles.forEach((cible) => observateur.observe(cible));
    return () => observateur.disconnect();
  }, [portee]);
}

/* ── Métadonnées de page — socle § 0.29 ───────────────────────────────────
   Le titre est posé PAR LA PAGE et EN AMONT : le § 0.28 fait lire
   `document.title` à la coquille pour son annonce `polite`, et les effets
   d'un enfant s'exécutent avant ceux de son parent. Cet effet-ci passe
   donc toujours avant celui de `Layout`.

   `robots` est RETIRÉ quand la page est indexée, jamais laissé en place :
   sans cela, un passage par `/404` — qui pose `noindex` — laisserait la
   balise derrière lui pour toutes les routes suivantes.                  */
function balise(nom: string): HTMLMetaElement {
  const existante = document.head.querySelector<HTMLMetaElement>(`meta[name="${nom}"]`);
  if (existante) return existante;
  const creee = document.createElement("meta");
  creee.setAttribute("name", nom);
  document.head.appendChild(creee);
  return creee;
}

function baliseOg(propriete: string): HTMLMetaElement {
  const existante = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${propriete}"]`
  );
  if (existante) return existante;
  const creee = document.createElement("meta");
  creee.setAttribute("property", propriete);
  document.head.appendChild(creee);
  return creee;
}

function useMetaPage() {
  useEffect(() => {
    const fiche = meta.discord;
    const titre = `${fiche.titre} · ${site.name}`;
    const adresse = `${site.url}${routes.discord}`;

    document.title = titre;
    balise("description").setAttribute("content", fiche.description);
    baliseOg("og:title").setAttribute("content", titre);
    baliseOg("og:description").setAttribute("content", fiche.description);
    baliseOg("og:url").setAttribute("content", adresse);

    let canonique = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonique) {
      canonique = document.createElement("link");
      canonique.setAttribute("rel", "canonical");
      document.head.appendChild(canonique);
    }
    canonique.setAttribute("href", adresse);

    if (fiche.indexee) {
      document.head.querySelector('meta[name="robots"]')?.remove();
    } else {
      balise("robots").setAttribute("content", "noindex, nofollow");
    }
  }, []);
}

/* Coche de la liste — tracé relevé sur la maquette. `.ico` porte le trait,
   `.ico--action` lit `--accent` : la même icône fonctionne sur fond clair
   et en contexte acier, sans aucune règle descendante (§ 0.11). */
function Coche() {
  return (
    <svg className="ico ico--20 ico--action" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 5 5L19 7" />
    </svg>
  );
}

/* `ico-action-lien-externe` — socle § 0.25, ligne « Lien externe » : le
   pictogramme est DANS le balisage, jamais en `::after` CSS, et le libellé
   accessible dit la destination. Il prend la place de la flèche « → » de la
   maquette, en gardant `.btn__f` : la poussée au clic est conservée. */
function FlecheSortante() {
  return (
    <span className="btn__f" aria-hidden="true">
      <svg className="ico ico--16" viewBox="0 0 24 24">
        <path d="M13.6 3.8h6.6v6.6" />
        <path d="M20.2 3.8l-8.6 8.6" />
        <path d="M17.6 13.8v5a1.6 1.6 0 0 1-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6V8.2a1.6 1.6 0 0 1 1.6-1.6h5" />
      </svg>
    </span>
  );
}

export default function Discord() {
  const page = useRef<HTMLElement>(null);
  useMetaPage();
  useRevelation(page);

  return (
    <section className="bande" ref={page}>
      <div className="wrap">
        <div className="tete rv">
          <p className="eyebrow">{discord.surtitre}</p>
          <h1 className="h2">{discord.titre}</h1>
          <p className="lede">{discord.lede}</p>
        </div>

        <EtatCommunaute />

        <ul className="liste rv max-w-[var(--me-corps-s)]">
          {discord.salons.map((salon) => (
            <li key={salon}>
              <Coche />
              <span>{salon}</span>
            </li>
          ))}
        </ul>

        <div className="hero__b rv">
          <a className="btn" href={discord.inviteUrl} target="_blank" rel="noopener">
            {discord.cta}
            <span className="sr-only"> (nouvel onglet)</span>
            <FlecheSortante />
          </a>
        </div>
      </div>
    </section>
  );
}
