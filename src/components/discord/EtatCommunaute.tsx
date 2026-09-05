import { useEffect, useRef, useState } from "react";
import { useDiscordWidget } from "../../hooks/useDiscordWidget";
import { discord } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   RELEVÉ DU SERVEUR DISCORD — `.livebox` · ARC · CMP — 55 · addendum § B-33
   Les Archives du Professeur Chen — charte v1.0.0

   ── CE QUI CHANGE ─────────────────────────────────────────────────────────

   Ce composant rendait une ligne de jetons dans une `.serveur`, et surtout
   il ne rendait RIEN du tout tant que `discord.guildId` valait `null` :
   la page ne disait alors pas qu’un compteur existe, ni pourquoi il est
   absent. Le silence total n’est pas l’état « muet » de la charte — c’est
   son absence.

   L’anatomie normative est désormais tenue au mot (section 21 de
   30-composants.css) : `.lb-head` (point + libellé) · `.lb-figure` (le
   chiffre) · `.lb-sub` (la précision) · `.lb-act` (le bouton).

   ── L’ÉTAT MUET, QUI EST L’ÉTAT RÉEL DU SITE AUJOURD’HUI ──────────────────

   `discord.guildId` vaut `null` (CONTRAT_OUVERT, src/data/site.ts) : le
   compteur n’a AUCUNE source. `.livebox--muet` est fait pour cela — point
   `--alerte`, chiffre « — », la phrase, et « le lien d’invitation RESTE ».
   Ce qui n’est JAMAIS rendu : un chiffre. Pas de « 360+ », pas de repli,
   pas d’estimation (principe n° 3 des fondations, § 0.25).

   Le même état sert l’échec du relevé, et c’est délibéré : dans les deux
   cas c’est LE COMPTEUR qui est muet, jamais la communauté. Un widget qui
   ne répond pas ne prouve rien sur un serveur Discord — d’où l’absence
   totale de `.livebox--horsligne` ici, qui affirmerait ce qu’on ignore.

   ── LE CHIFFRE NE PARLE PAS, LE CHANGEMENT D’ÉTAT SI ──────────────────────

   Le relevé se rafraîchit seul toutes les 60 s et un lecteur d’écran n’en
   savait rien (constat d’audit). Deux régions, et deux comportements :

     · la `.livebox` porte `aria-live="off"` — un compteur qui s’annonce
       toutes les minutes est insupportable ;
     · une région `aria-live="polite"` en `.sr-only`, rendue en permanence,
       reçoit le MOT d’état, et seulement quand il change. Le premier relevé
       d’une page fraîchement ouverte ne dit rien : il n’y a pas de
       changement, et le bloc est là, lisible.

   ── LE MOTIF D’ATTENTE ARC · MOT — 11 ─────────────────────────────────────
   Rien pendant les 600 premières millisecondes — un relevé qui revient en
   200 ms ne doit pas faire clignoter un « chargement… ». Échec déclaré à
   8 s, même si la requête, elle, n’a pas encore rendu la main. Une réponse
   tardive reste une réponse et reprend la main sur le message.

   ── LE HOOK N’EST PAS TOUCHÉ DANS SON CONTRAT ─────────────────────────────
   `useDiscordWidget` garde sa signature, ses types et son point de
   terminaison, et `/discord` reste la seule surface du site où il est monté.
   Ce qui a changé chez lui — suspension du sondage en onglet caché,
   annulation de la requête en vol au démontage — est interne.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Rien ne s’affiche avant ce seuil (ARC · MOT — 11). */
const SEUIL_ATTENTE_MS = 600;

/** Au-delà, le relevé est déclaré indisponible (ARC · MOT — 11). */
const DELAI_ECHEC_MS = 8_000;

const MOT_ATTENTE = "Vérification";
const MOT_ENLIGNE = "En ligne";
const MOT_MUET = "Compteur indisponible";

const SUB_ATTENTE = "Relevé du serveur Discord en cours…";
const SUB_ENLIGNE = "membres connectés";
const SUB_MUET =
  "Le compteur ne répond pas pour l’instant. L’invitation ci-dessous, elle, reste valable.";

/** Trois états seulement : `--horsligne` affirmerait ce qu’on ne sait pas. */
type EtatDirect = "attente" | "enligne" | "muet";

/** Forme horaire de la charte (10-membre § 10.16) : « 14 h 32 », jamais « 14:32 ». */
function heureCourte(date: Date): string {
  return `${date.getHours()} h ${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function EtatCommunaute() {
  const releve = useDiscordWidget(discord.guildId);
  const [attenteAffichee, setAttenteAffichee] = useState(false);
  const [echeanceDepassee, setEcheanceDepassee] = useState(false);
  const [verifieA, setVerifieA] = useState<string | null>(null);
  const [annonce, setAnnonce] = useState("");

  // Motif d’attente : les deux minuteries ne courent que pendant la requête,
  // et les deux drapeaux sont remis à plat dès qu’elle a rendu la main. Sans
  // cette remise à plat, une première réponse arrivée à neuf secondes
  // laisserait « Compteur indisponible » posé pour toute la session, alors
  // que le compteur, lui, se rafraîchit toutes les soixante secondes.
  useEffect(() => {
    if (releve.status !== "loading") {
      setAttenteAffichee(false);
      setEcheanceDepassee(false);
      return;
    }
    const amorce = setTimeout(() => setAttenteAffichee(true), SEUIL_ATTENTE_MS);
    const echeance = setTimeout(() => setEcheanceDepassee(true), DELAI_ECHEC_MS);
    return () => {
      clearTimeout(amorce);
      clearTimeout(echeance);
    };
  }, [releve.status]);

  // L’heure du relevé est celle où la réponse est arrivée, pas celle du rendu.
  useEffect(() => {
    if (releve.status === "ok") setVerifieA(heureCourte(new Date()));
  }, [releve]);

  /* ── L’état du direct ────────────────────────────────────────────────────
     `idle` est l’état du hook quand aucun identifiant ne lui est passé : il
     ne lance alors aucun appel. C’est exactement le cas d’aujourd’hui, et
     il tombe dans `--muet` comme un échec — dans les deux cas, il n’y a pas
     de chiffre à montrer, et c’est tout ce que le visiteur a besoin de
     savoir. L’échéance dépassée ne vaut échec que TANT QUE la requête
     court : une réponse tardive reprend la main. */
  const direct: EtatDirect =
    releve.status === "ok"
      ? "enligne"
      : releve.status === "error" ||
          releve.status === "idle" ||
          (releve.status === "loading" && echeanceDepassee)
        ? "muet"
        : releve.status === "loading" && attenteAffichee
          ? "attente"
          : "muet";

  /* Avant 600 ms, il n’y a encore rien à dire : la `.livebox` ne s’affiche
     pas du tout plutôt que de clignoter (MOT — 11). Ce cas ne concerne que
     `loading` — l’absence de source, elle, est immédiate et définitive. */
  const rendu = !(releve.status === "loading" && !attenteAffichee && !echeanceDepassee);

  const mot =
    direct === "enligne" ? MOT_ENLIGNE : direct === "attente" ? MOT_ATTENTE : MOT_MUET;

  const chiffre =
    releve.status === "ok" && direct === "enligne"
      ? String(releve.data.presenceCount)
      : "—";

  /* ── L’annonce du changement d’état ──────────────────────────────────────
     `precedent` est une référence, pas un état : la comparaison ne doit pas
     provoquer de rendu. Le premier état observé n’est pas annoncé — il n’y
     a pas eu de changement, et on ne vole pas la parole à qui arrive. */
  const precedent = useRef<string | null>(null);
  useEffect(() => {
    if (!rendu || direct === "attente") return;
    const ancien = precedent.current;
    precedent.current = mot;
    if (ancien === null || ancien === mot) return;
    setAnnonce(mot);
  }, [rendu, direct, mot]);

  return (
    <>
      {/* Rendue en permanence et vide au départ — y compris pendant les
          600 ms où la `.livebox`, elle, n’est pas encore là : une région
          vive n’est annoncée de façon fiable que si elle était déjà dans le
          document avant de recevoir son texte. */}
      <p className="sr-only" aria-live="polite">
        {annonce}
      </p>

      {!rendu ? null : (
        <div
          className={`livebox livebox--${direct} mt-[var(--sp-5)]`}
          data-rv
          aria-live="off"
        >
          <p className="lb-head">
            <span className="dot" aria-hidden="true" />
            {mot}
          </p>

          {/* « — » ne se lit pas : quand il n’y a pas de chiffre, le chiffre
              se tait et c’est `.lb-sub` qui porte l’information. */}
          <p className="lb-figure" aria-hidden={chiffre === "—" ? "true" : undefined}>
            {chiffre}
          </p>

          <p className="lb-sub">
            {direct === "enligne"
              ? SUB_ENLIGNE
              : direct === "attente"
                ? SUB_ATTENTE
                : SUB_MUET}

            {direct === "enligne" && verifieA !== null ? ` · Vérifié à ${verifieA}` : null}
          </p>
        </div>
      )}
    </>
  );
}
