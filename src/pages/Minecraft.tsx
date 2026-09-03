import { useEffect, useState } from "react";
import { discord, meta, minecraft, site } from "../data/site";
import FicheServeur from "../components/minecraft/FicheServeur";
import { useRevelation } from "../components/minecraft/useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE MINECRAFT — route `/minecraft` · maquette `#v-minecraft` (l. 1144-1168)
   Les Archives du Professeur Chen — charte v1.0.0 · lot L4

   ── CE QUE LA MAQUETTE DONNE, ET CE QUE LA CHARTE CORRIGE ─────────────────

   La vue de la maquette tient en une section : une tête de bloc, la barre
   d'adresse `.ip`, quatre cartes. Trois écarts, tous tranchés par la charte :

   1. `.ip` / `.ip__l` / `.affilie` n'existent pas dans `src/styles/`. Le
      composant s'appelle `.serveur` (`ARC · CMP — 46`, socle § 0.25) et son
      intitulé `.serveur__libelle` ; la ligne technique est un `.meta`. Le
      § 0.12 impose un nom par composant : ce sont ces noms-là.

   2. La maquette n'affiche aucun état de serveur. Le § 0.25 en fait une
      obligation, écrite et horodatée. C'est `FicheServeur` qui la porte.

   3. La maquette n'a aucun appel à l'action sur cette page. Le § 0.25 pose
      `ARC · CMP — 47 · Bandeau d'invitation` : bande pleine largeur, matière
      acier, sur-titre, titre, deux phrases, un bouton. Pas de compteur, pas
      d'urgence, pas de « rejoins-nous ».

   ── UN `h1` PAR PAGE ──────────────────────────────────────────────────────
   La maquette est un SPA à vues : elle n'a qu'un `h1`, celui du hero de
   l'accueil, et ouvre ses autres vues sur `<h2 class="h2">`. Avec un routeur,
   chaque page porte le sien. `.h2` est une classe TYPOGRAPHIQUE
   (02-tokens-typo.css), pas un niveau : le titre est donc un `h1` habillé
   en `.h2`, et la hiérarchie descend ensuite sans saut — `h2` sur les
   quatre cartes, `h2` sur le bandeau d'invitation.

   ── LE TITRE DE DOCUMENT ──────────────────────────────────────────────────
   `Layout.tsx` (§ 0.28) annonce le changement de route en lisant
   `document.title` : il compte donc sur la page pour l'avoir posé AVANT —
   les effets d'un enfant s'exécutent avant ceux de son parent. Le gabarit
   du § 0.29 est appliqué à `meta.minecraft.titre`, qui vit dans `site.ts`.
   Le reste de l'en-tête (description, canonique, `og:*`, JSON-LD) demande un
   gestionnaire partagé qui n'existe pas encore : voir le rapport du lot.

   ── CE QUI DISPARAÎT DE L'ANCIENNE PAGE ───────────────────────────────────
   `Seal`, `Spark`, `Pictogram`, `SectionHeading`, `TypeBadge` et `LiveDot`
   appartiennent à l'ancienne charte. `LiveDot` en particulier disait l'état
   par la seule couleur, ce que le § 0.25 interdit. Les trois « premiers pas »
   écrits en dur dans le composant (« Installe Cobblemon… », au tutoiement)
   sortent aussi : aucune copie ne vit ailleurs que dans `src/data/site.ts`.

   ── CE QUI EST PRÉSERVÉ ───────────────────────────────────────────────────
   `useMinecraftStatus` — inchangé, monté par `FicheServeur` — et la copie de
   l'adresse, qui gagne le retour `role="status"` exigé par le § 0.25.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Minecraft() {
  const reveler = useRevelation();

  // Un compteur de tentatives, rien de plus : il sert de `key` à la fiche.
  // Le remontage relance l'effet de `useMinecraftStatus`, qui n'expose pas
  // de fonction de reprise et qu'on ne modifie pas pour si peu.
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    // § 0.29 · « {Titre de page} · Les Archives du Professeur Chen ».
    document.title = `${meta.minecraft.titre} · ${site.name}`;
  }, []);

  return (
    <>
      <section className="bande" aria-labelledby="titre-academie">
        <div className="wrap">
          <div className="tete" ref={reveler}>
            <p className="eyebrow">{minecraft.surtitre}</p>
            <h1 className="h2" id="titre-academie">
              {minecraft.titre}
            </h1>
            <p className="lede">{minecraft.lede}</p>
          </div>

          <FicheServeur
            key={tentative}
            reveler={reveler}
            onReessayer={() => setTentative((rang) => rang + 1)}
          />

          <div className="cartes mt-[var(--sp-8)]" ref={reveler}>
            {minecraft.cartes.map((carte) => (
              <article className="carte" key={carte.titre}>
                <h2 className="carte-titre">{carte.titre}</h2>
                <p className="carte__d">{carte.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARC · CMP — 47 · Bandeau d'invitation — socle § 0.25.
          Acier, jamais bordeaux : la seule bande bordeaux d'une page est le
          kit affilié. Sur acier, `.acier` bascule `--accent` vers le néon,
          donc `.btn` EST déjà le bouton d'acier du § 0.25 — aucun `.btn--acier`
          n'est écrit, et aucun `style` local ne repeint quoi que ce soit.
          Le serveur s'annonce et s'organise sur le Discord : c'est là que
          mène l'invitation, et toute sa copie vient de `site.ts`. */}
      <section className="bande acier mat-acier" aria-labelledby="titre-invitation">
        <div className="wrap">
          <div className="tete" ref={reveler}>
            <p className="eyebrow">{discord.surtitre}</p>
            <h2 className="h2" id="titre-invitation">
              {discord.nom}
            </h2>
            <p className="lede">{discord.lede}</p>
          </div>

          <div className="hero__b">
            <a
              className="btn lien-externe"
              href={discord.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {discord.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
