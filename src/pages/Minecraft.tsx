import { useCallback, useEffect, useState } from "react";
import { discord, meta, minecraft, site } from "../data/site";
import FicheServeur from "../components/minecraft/FicheServeur";
import { reglesAcces } from "../components/minecraft/reglesAcces";
import { Icone } from "../components/ui/Icones";
import { useRevelation } from "../hooks/useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE MINECRAFT — route `/minecraft` · maquette `#v-minecraft` (l. 1144-1168)
   Les Archives du Professeur Chen — charte v1.0.0 · lot L4

   ── CE QUE LA MAQUETTE DONNE, ET CE QUE LA CHARTE CORRIGE ─────────────────

   La vue de la maquette tient en une section : une tête de bloc, la barre
   d'adresse `.ip`, quatre cartes. Trois écarts, tous tranchés par la charte :

   1. `.ip` / `.ip__l` / `.affilie` n'existent pas dans `src/styles/`. La
      fiche s'appelle `.serveur` (`ARC · CMP — 46`, socle § 0.25), son
      intitulé `.serveur__libelle`, et l'adresse elle-même est désormais une
      `.copyline` (`ARC · CMP — 56`) — voir `FicheServeur`.

   2. La maquette n'affiche aucun état de serveur. Le § 0.25 en fait une
      obligation, écrite et horodatée. C'est `FicheServeur` qui la porte,
      sur l'anatomie `.livebox` (`ARC · CMP — 55`).

   3. La maquette n'a aucun appel à l'action sur cette page. Le § 0.25 pose
      `ARC · CMP — 47 · Bandeau d'invitation` : bande pleine largeur, matière
      acier, sur-titre, titre, deux phrases, un bouton, et les règles du
      serveur en trois lignes au plus. Pas de compteur, pas d'urgence, pas
      de « rejoins-nous ».

   ── CE QUE LE BANDEAU RÉPARE ──────────────────────────────────────────────
   L'audit a relevé que cette page ne disait plus NI comment se connecter,
   NI que le mod Cobblemon est requis. C'est précisément la place que le
   § 0.25 réserve aux trois lignes de `.invitation__r`, et elles sont donc
   là — lues dans `src/data/site.ts` par `reglesAcces`, jamais recopiées.

   Le bouton, lui, mène au Discord : un serveur Minecraft ne se rejoint pas
   par un lien, il se rejoint par une adresse — celle qui est copiable plus
   haut. Ce qui se rejoint par un lien, c'est l'endroit où le serveur
   s'annonce et s'organise.

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

   ── CE QUI EST PRÉSERVÉ ───────────────────────────────────────────────────
   `useMinecraftStatus` — son contrat, sa signature et son point de
   terminaison — et la région vive `role="status"` tenue ICI, hors de la
   `key` de la fiche.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── La copie du bandeau ───────────────────────────────────────────────────
   Elle devrait vivre dans `src/data/site.ts`, comme toute copie du site.
   Le champ n'y existe pas et ce lot n'a pas la main sur ce fichier : les
   quatre chaînes sont donc ici, groupées et nommées, pour être déplacées
   d'un bloc. Voir « À signaler » du lot.

   Les deux phrases se tiennent aux règles du § 6.1 : vouvoiement, aucun
   chiffre, aucune affirmation invérifiable, aucune urgence. Le mot
   « rejoins-nous » est proscrit par le § 0.25 — le titre est une consigne
   d'accès, pas un appel.                                                  */
const INVITATION_SURTITRE = "L’accès";
const INVITATION_TITRE = "Avant de vous connecter";
const INVITATION_PHRASES =
  "L’Académie tourne sur l’édition Java de Minecraft, avec le mod Cobblemon. " +
  "Les cours, les événements et les interruptions de service sont annoncés sur le Discord.";

export default function Minecraft() {
  useRevelation();

  // Un compteur de tentatives, rien de plus : il sert de `key` à la fiche.
  // Le remontage relance l'effet de `useMinecraftStatus`, qui n'expose pas
  // de fonction de reprise et qu'on ne modifie pas pour si peu.
  //
  // Ce remontage détruit le bouton « Réessayer » — donc le focus de qui vient
  // de l'actionner. Le même compteur est donc passé EN PROPRIÉTÉ, et pas
  // seulement en `key` : c'est ce qui permet à la fiche de distinguer une
  // reprise d'un premier montage, de reprendre le focus et de l'annoncer,
  // sans jamais voler le focus à l'arrivée sur la page (§ 0.28).
  const [tentative, setTentative] = useState(0);

  /* Ce que la région vive doit dire. Le texte vient de la fiche — elle seule
     connaît le relevé — mais il est TENU ICI, au-dessus de la `key` : une
     région rendue à l'intérieur de la fiche serait recréée à chaque reprise,
     et une région vive n'est annoncée de façon fiable que si elle était déjà
     dans le document avant de recevoir son texte.

     C'est aussi elle qui porte, désormais, le changement d'état du relevé
     automatique de 60 s — jusqu'ici muet pour un lecteur d'écran. */
  const [annonce, setAnnonce] = useState("");

  // Référence stable : la fiche la garde en dépendance d'effet sans que
  // chaque rendu de cette page ne relance l'annonce.
  const annoncer = useCallback((texte: string) => setAnnonce(texte), []);

  useEffect(() => {
    // § 0.29 · « {Titre de page} · Les Archives du Professeur Chen ».
    document.title = `${meta.minecraft.titre} · ${site.name}`;
  }, []);

  return (
    <>
      <section className="bande" aria-labelledby="titre-academie">
        <div className="wrap">
          <div className="tete" data-rv>
            <p className="eyebrow">{minecraft.surtitre}</p>
            <h1 className="h2" id="titre-academie">
              {minecraft.titre}
            </h1>
            <p className="lede">{minecraft.lede}</p>
          </div>

          {/* Rendue en permanence et VIDE : hors de la `key`, elle survit à
              toutes les reprises et n'est jamais insérée en même temps que
              son texte. */}
          <p className="sr-only" role="status">
            {annonce}
          </p>

          <FicheServeur
            key={tentative}
            reprise={tentative}
            onAnnonce={annoncer}
            onReessayer={() => setTentative((rang) => rang + 1)}
          />

          <div className="cartes mt-[var(--sp-8)]" data-rv>
            {minecraft.cartes.map((carte) => (
              <article className="carte" key={carte.titre}>
                <h2 className="carte-titre">{carte.titre}</h2>
                <p className="carte__d">{carte.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARC · CMP — 47 · Bandeau d'invitation — socle § 0.25, section 24 de
          30-composants.css.

          `class="invitation acier mat-acier"` : le fond vient de la
          COMPOSITION, pas du composant — c'est ce qui garantit l'interdit
          « jamais bordeaux », puisque `.invitation` n'écrit aucune couleur
          du tout, et ce qui garde opérantes les compensations
          `prefers-contrast` et `forced-colors` de 99-preferences.css, qui
          ne ciblent que les classes `.mat-*`.

          `.bande` n'est PAS composée ici : `.invitation` porte déjà son
          propre `padding-block: var(--rythme-m)`, et cumuler les deux
          doublerait le rythme.

          Le bouton porte `.btn--acier`, que le § 0.25 exige nommément. La
          variante est idempotente — posée dans un contexte `.acier` elle
          réécrit ce que le contexte a déjà écrit — mais elle est là parce
          que la charte la nomme, et parce qu'elle rend le bandeau
          transportable tel quel sur une page restée claire. */}
      <section className="invitation acier mat-acier" aria-labelledby="titre-invitation">
        <div className="wrap">
          <div className="invitation__c" data-rv>
            <p className="eyebrow">{INVITATION_SURTITRE}</p>

            <h2 className="invitation__t h2" id="titre-invitation">
              {INVITATION_TITRE}
            </h2>

            <p className="invitation__p">{INVITATION_PHRASES}</p>

            <a
              className="btn btn--acier"
              href={discord.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {discord.cta}
              <span className="sr-only"> (nouvel onglet)</span>
              {/* Le signe sortant est DANS le balisage, jamais en `::after`
                  CSS — § 0.25, ligne « Lien externe ». */}
              <span className="btn__f" aria-hidden="true">
                <Icone nom="lien-externe" taille={16} />
              </span>
            </a>

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
