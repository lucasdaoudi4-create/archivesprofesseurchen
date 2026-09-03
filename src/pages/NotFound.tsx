import { useEffect } from "react";
import { Link } from "react-router-dom";
import { discord, meta, planAuSol, routes, site } from "../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE INTROUVABLE — `/404` et `path="*"` · socle § 0.27
   Les Archives du Professeur Chen — charte v1.0.0

   Gabarit « Introuvable » : `ARC · DEC — 03`, socle vide. C'est la galerie
   d'archives — la même pièce que la zone 03 du plan au sol — et le socle y
   est vide. La page dit exactement cela, et rien de plus : elle est courte,
   et elle rend au visiteur la seule chose qui lui manque, une carte.

   ── LA MAQUETTE NE LA DESSINE PAS ─────────────────────────────────────────

   Aucune `.vue` de `maquette-body.html` ne correspond. Le balisage est donc
   composé des composants déjà déclarés, sans en inventer un :
   `.bande` `.wrap--etroit` `.tete` `.eyebrow` `.h2` `.lede` `.hero__b`
   `.btn` `.btn--fantome` `.btn__f` `.sous` `.h3` `.liste` `.code-arc`.

   ── PAS DE PHOTO ──────────────────────────────────────────────────────────

   Le « socle vide » du § 0.27 est une indication de DÉCOR photographique
   (chapitre 07 § 7.4.3, cadrage `ARC · CAM — 03`, `object-position:50% 48%`).
   Aucun fichier n'existe : `heroPhoto` et `portraitPhoto` valent `null` dans
   `site.ts`, et le registre `CONTRAT_OUVERT` tient les visuels du décor pour
   suspendus à la validation juridique. Une page ne fabrique pas de repli
   d'image. Le socle vide reste donc littéral : de l'air, et un plan.

   ── LE PLAN AU SOL, EN TEXTE ──────────────────────────────────────────────

   L'A1.3 réserve le tracé au filet à l'accueil : « le plan au sol est la
   navigation de l'ACCUEIL ». On ne le redessine pas ici — ce serait un second
   plan, sur une page qui n'a pas les quatre blocs qu'il désigne. La page
   renvoie au plan (bouton principal) et liste les quatre zones en toutes
   lettres, rang compris.

   Les quatre entrées pointent sur les ROUTES, pas sur les ancres `#b-*` de
   l'accueil que porte `planAuSol.zones[].ancre` : React Router ne défile pas
   vers un fragment de lui-même, et le retour en haut du § 0.28 annulerait
   l'ancre au changement de route. Une ancre qui ne bouge pas est un lien
   mort silencieux ; la route, elle, arrive à destination.

   ── CE QUI DISPARAÎT DE L'ANCIENNE PAGE ───────────────────────────────────

   `<Seal size={110} className="animate-float-slow" />` : `Seal.tsx` est
   supprimé au lot L2, et `animation["float-slow"]` avec son keyframe ne
   figure plus dans `tailwind.config.js`. Aucun remplacement — l'A1.2 §3 vaut
   ici aussi : on ne redessine pas l'emblème pour meubler.
   Le grand « 404 » en Fraunces 900 disparaît également : le rang de l'erreur
   est une métadonnée, il vit dans le surtitre `.eyebrow`, en Space Mono.
   Le tutoiement de l'ancienne copie est réécrit au vouvoiement (§ 6.1).

   ── MÉTADONNÉES (§ 0.29) ──────────────────────────────────────────────────

   Titre `Page introuvable · Les Archives du Professeur Chen` (50 signes) et
   `noindex, nofollow` : c'est la seule page publique non indexée du site.
   Les deux sont posés ici, par la page — le § 0.28 veut que le titre soit
   écrit EN AMONT de l'effet de la coquille, et les effets d'un enfant
   s'exécutent avant ceux de son parent. La coquille ne fait que le lire.

   RESTE OUVERT, HORS DE CE FICHIER : `netlify.toml` sert `/* → /index.html`
   en `status = 200`. Toute URL inconnue répond donc HTTP 200 avec cette
   page — un « soft 404 » qui fait indexer des pages fantômes malgré le
   `noindex` ci-dessous. La correction est une règle de redirection, pas une
   ligne de React.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Les quatre zones du plan au sol, rendues en destinations réelles.
 * La clé est l'ancre déclarée dans `site.ts` : si une zone y change de rang
 * ou de libellé, elle suit ; si son ancre change, elle sort de la liste
 * plutôt que de pointer au hasard.
 */
const DESTINATION: Record<string, string> = {
  "#b-formation": routes.formation,
  "#b-minecraft": routes.minecraft,
  "#b-reseaux": routes.reseaux,
  "#b-contact": routes.contact,
};

export default function NotFound() {
  useEffect(() => {
    document.title = `${meta.introuvable.titre} · ${site.name}`;

    // `meta.introuvable.indexee === false` — la seule page du site public
    // dans ce cas. La balise est posée à l'entrée et retirée à la sortie :
    // aucune autre route ne doit hériter du `noindex`.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      robots.remove();
    };
  }, []);

  const zones = planAuSol.zones.filter((z) => DESTINATION[z.ancre]);

  return (
    // Le rythme long, et non le `--rythme-m` de `.bande` : la coquille ne
    // porte aucune hauteur (§ 0.28), c'est à une page courte de tenir son
    // socle vide ouvert pour que le pied ne remonte pas au milieu de l'écran.
    <section className="bande py-rythme-l">
      <div className="wrap wrap--etroit">
        <div className="tete">
          <p className="eyebrow">Erreur 404</p>
          <h1 className="h2">Cette fiche est introuvable.</h1>
          <p className="lede">
            La page que vous cherchez n’existe pas, ou elle a changé d’adresse.
            Rien n’est perdu pour autant&nbsp;: le plan au sol de l’accueil
            ramène aux quatre zones du laboratoire.
          </p>
        </div>

        <div className="hero__b">
          <Link className="btn" to={routes.accueil}>
            Revenir au plan au sol{" "}
            <span className="btn__f" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            className="btn btn--fantome"
            href={discord.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Passer par le Discord{" "}
            <span className="btn__f" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <h2 className="h3 sous">Les quatre zones</h2>

        {/* `.corps` n'est là que pour son descendant : c'est lui qui porte
            le lien de CMP — 44, filet compris (§ 0.15, SC 1.4.1 — un lien
            n'est jamais signalé par la seule couleur). `.liste` garde sa
            propre taille de texte, la couche `composants` passant devant
            la couche `tokens`. */}
        <div className="corps">
          <ul className="liste">
            {zones.map((zone) => (
              <li key={zone.ancre}>
                {/* Le pas d'alignement optique est celui de `.liste .ico` :
                    le rang s'assied sur la première ligne de texte. */}
                <span className="code-arc mt-1">{zone.rang}</span>
                <span>
                  <Link to={DESTINATION[zone.ancre]}>{zone.libelle}</Link>
                  <span className="t-tertiaire"> · {zone.piece}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
