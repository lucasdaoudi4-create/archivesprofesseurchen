import { useEffect } from "react";
import { Link } from "react-router-dom";
import { discord, meta, minecraft, routes, site } from "../data/site";
import EtatCommunaute from "../components/discord/EtatCommunaute";
import { reglesAcces } from "../components/minecraft/reglesAcces";
import { Icone } from "../components/ui/Icones";
import { useRevelation } from "../hooks/useRevelation";

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
   l'observateur existe ». Cette page réimplémentait l'observateur en ligne,
   et posait `.rv` dans son JSX — donc masquait avant de savoir si quelqu'un
   viendrait démasquer. Les deux sont partis : les blocs portent `data-rv`, et
   `src/hooks/useRevelation.ts` est le seul endroit du site où le mécanisme
   est écrit. Le `prefers-reduced-motion` n'est pas traité ici non plus —
   `99-preferences.css` neutralise déjà `.rv`, et le doubler en JavaScript
   rouvrirait la porte à deux vérités.
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* Le signe sortant du bouton — socle § 0.25, ligne « Lien externe » : le
   pictogramme est DANS le balisage, jamais en `::after` CSS, et le libellé
   accessible dit la destination. Il prend la place de la flèche « → » de la
   maquette, en gardant `.btn__f` : la poussée au clic est conservée.
   Le tracé, lui, vient du jeu partagé — il n'appartient pas à cette page. */
function FlecheSortante() {
  return (
    <span className="btn__f" aria-hidden="true">
      <Icone nom="lien-externe" taille={16} />
    </span>
  );
}

/* ── La copie du bandeau ───────────────────────────────────────────────────
   Comme sur /minecraft : ces deux chaînes devraient vivre dans
   `src/data/site.ts`, le champ n'y existe pas et ce lot n'a pas la main sur
   ce fichier. Elles sont groupées ici pour être déplacées d'un bloc. Tout le
   reste du bandeau — titre, phrases, lignes d'accès — est LU dans `site.ts`.
   Voir « À signaler » du lot.                                             */
const INVITATION_SURTITRE = "Le serveur";
const INVITATION_CTA = "Voir le serveur";

export default function Discord() {
  useMetaPage();
  useRevelation();

  return (
    <>
      <section className="bande" aria-labelledby="titre-discord">
        <div className="wrap">
          <div className="tete" data-rv>
            <p className="eyebrow">{discord.surtitre}</p>
            <h1 className="h2" id="titre-discord">
              {discord.titre}
            </h1>
            <p className="lede">{discord.lede}</p>
          </div>

          <EtatCommunaute />

          <ul className="liste max-w-[var(--me-corps-s)]" data-rv>
            {discord.salons.map((salon) => (
              <li key={salon}>
                <Icone nom="coche" taille={20} ton="action" />
                <span>{salon}</span>
              </li>
            ))}
          </ul>

          <div className="hero__b" data-rv>
            <a className="btn" href={discord.inviteUrl} target="_blank" rel="noopener">
              {discord.cta}
              <span className="sr-only"> (nouvel onglet)</span>
              <FlecheSortante />
            </a>
          </div>
        </div>
      </section>

      {/* ARC · CMP — 47 · Bandeau d'invitation — socle § 0.25, section 24 de
          30-composants.css.

          `class="invitation acier mat-acier"` : le fond vient de la
          COMPOSITION, jamais du composant — c'est ce qui garantit l'interdit
          « jamais bordeaux » (`.invitation` n'écrit aucune couleur du tout)
          et ce qui garde opérantes les compensations `prefers-contrast` et
          `forced-colors` de 99-preferences.css, qui ne ciblent que `.mat-*`.
          `.bande` n'est pas composée : `.invitation` porte déjà son propre
          `padding-block: var(--rythme-m)`.

          POURQUOI LE SERVEUR, ET PAS UN SECOND BOUTON DISCORD. Le bouton
          d'entrée du Discord est déjà au-dessus, dans le corps de la page ;
          le redoubler ici serait une insistance, et le § 0.25 proscrit
          l'urgence. L'invitation ouvre donc sur l'autre lieu — le serveur —
          et porte les trois mêmes lignes d'accès que /minecraft, parce que
          c'est ici qu'on les cherche quand on vient d'entrer.

          Ni compteur ni effectif : le relevé vit dans la `.livebox` du corps
          de page, et une invitation dit ce qu'on trouve, pas combien on est. */}
      <section className="invitation acier mat-acier" aria-labelledby="titre-invitation">
        <div className="wrap">
          <div className="invitation__c" data-rv>
            <p className="eyebrow">{INVITATION_SURTITRE}</p>

            <h2 className="invitation__t h2" id="titre-invitation">
              {minecraft.nom}
            </h2>

            {/* Deux phrases, écrites dans `site.ts` et lues telles quelles. */}
            <p className="invitation__p">{minecraft.lede}</p>

            {/* Navigation interne : un `Link`, qui ne repart jamais sur le
                réseau. Pas de `.btn__f` sortante — on ne quitte pas le site. */}
            <Link className="btn btn--acier" to={routes.minecraft}>
              {INVITATION_CTA}
            </Link>

            {/* Les trois lignes du § 0.25. Trois, jamais quatre. */}
            <ul className="invitation__r">
              {reglesAcces.map((regle) => (
                <li key={regle}>{regle}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
