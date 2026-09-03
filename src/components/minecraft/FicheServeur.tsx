import { useEffect, useState } from "react";
import { minecraft } from "../../data/site";
import { useMinecraftStatus } from "../../hooks/useMinecraftStatus";
import type { Reveler } from "./useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC · CMP — 46 · FICHE DE SERVEUR — socle § 0.25
   Les Archives du Professeur Chen — charte v1.0.0

   Le § 0.25 donne le corps de la fiche : « Adresse du serveur dans un champ
   en lecture seule + bouton “Copier l'adresse” (retour “Adresse copiée” en
   role="status") · version requise · relevé d'état ».

   Et trois règles, qui ne sont pas du CSS mais du balisage et du temps :

   1. L'ÉTAT EST ÉCRIT, jamais seulement coloré. `.etat--enligne` porte le
      mot « En ligne », `.etat--horsligne` le mot « Hors ligne » (SC 1.4.1).
      La pastille de couleur seule de l'ancienne charte — `LiveDot` — est
      retirée : elle disait l'état par la teinte et rien d'autre.

   2. L'APPEL RÉSEAU SUIT `ARC · MOT — 11` : rien avant 600 ms, mention
      d'attente entre 600 ms et 8 s, échec au-delà de 8 s avec un bouton
      « Réessayer » et le code court `MBR-503`.

   3. AUCUN CHIFFRE SANS SOURCE BRANCHÉE. Tout ce qui est chiffré ici sort
      du relevé `api.mcsrvstat.us` : le compteur de joueurs, la version
      relevée, l'heure de vérification. Rien n'est écrit à la main.

   ── L'ADRESSE EST UN CONTRÔLE, PAS UN `<code>` ───────────────────────────
   La maquette écrivait `<code>`. Le § 0.25 et le commentaire de
   `.serveur__adresse` en 30-composants.css disent tous deux « champ en
   lecture seule, donc un contrôle » — le socle § 0.9 le nomme dans la liste
   des contours en couleur pleine. C'est donc un `<input readonly>`, ce qui
   donne en prime le repli du presse-papiers : l'adresse reste sélectionnable
   et copiable à la main si `navigator.clipboard` est refusé.

   ── LE MOTIF D'ATTENTE, ET CE QUI LUI MANQUE ─────────────────────────────
   `ARC · MOT — 11` prévoit une barre `.attente` en plus de la mention.
   `src/styles/` ne déclare pas `.attente` : seuls existent le `@keyframes
   balayage` (04-tokens-motion.css) et la compensation `prefers-reduced-
   motion` (99-preferences.css). Poser la classe ici donnerait un élément
   inerte, invisible sauf en mouvement réduit. La mention écrite — qui est
   la part accessible du motif — est donc rendue seule, et la barre attend
   sa déclaration. Voir le rapport du lot.

   ── LE HOOK N'EST PAS TOUCHÉ ─────────────────────────────────────────────
   `useMinecraftStatus` reste tel quel : il n'expose ni seuil, ni délai, ni
   fonction de reprise. Les trois seuils du § 0.25 sont donc tenus ICI, par
   dessus son état, et la reprise se fait par remontage — la page passe une
   `key` qui change, ce qui redéclenche l'effet du hook sur `[ip]`.
   ═══════════════════════════════════════════════════════════════════════════ */

/** MOT — 11 : en dessous, un indicateur ferait plus de bruit que l'attente. */
const SEUIL_ATTENTE_MS = 600;

/** MOT — 11 : au-delà, l'attente s'arrête et l'échec s'affiche. */
const SEUIL_ECHEC_MS = 8_000;

/** Le message de copie s'efface tout seul : il n'est pas un état de la page. */
const DUREE_MESSAGE_MS = 4_000;

type Phase = "muet" | "attente" | "echec";

interface Props {
  /** Rappel de révélation au défilement, fourni par la page. */
  reveler: Reveler;
  /** Remonte la fiche, donc relance le relevé. */
  onReessayer: () => void;
}

export default function FicheServeur({ reveler, onReessayer }: Props) {
  const etat = useMinecraftStatus(minecraft.ip);

  const [phase, setPhase] = useState<Phase>("muet");
  const [releveA, setReleveA] = useState<Date | null>(null);
  const [messageCopie, setMessageCopie] = useState("");

  // MOT — 11 · les deux seuils. Ils ne courent que pendant une requête
  // réelle et sont annulés dès que le relevé répond.
  useEffect(() => {
    if (etat.status !== "loading") {
      setPhase("muet");
      return;
    }
    setPhase("muet");
    const versAttente = setTimeout(() => setPhase("attente"), SEUIL_ATTENTE_MS);
    const versEchec = setTimeout(() => setPhase("echec"), SEUIL_ECHEC_MS);
    return () => {
      clearTimeout(versAttente);
      clearTimeout(versEchec);
    };
  }, [etat.status]);

  // L'heure de vérification. Le hook renvoie un objet neuf à chaque relevé,
  // y compris identique : l'horodatage suit donc le rafraîchissement de 60 s.
  useEffect(() => {
    if (etat.status === "loading") return;
    setReleveA(new Date());
  }, [etat]);

  useEffect(() => {
    if (messageCopie === "") return;
    const minuteur = setTimeout(() => setMessageCopie(""), DUREE_MESSAGE_MS);
    return () => clearTimeout(minuteur);
  }, [messageCopie]);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(minecraft.ip);
      setMessageCopie("Adresse copiée");
    } catch {
      // Presse-papiers refusé ou indisponible : on dit quoi faire à la place.
      setMessageCopie("Copie impossible : sélectionnez l’adresse.");
    }
  };

  const enPanne = phase === "echec" || etat.status === "error";
  const enLigne = etat.status === "ok" && etat.data.online;
  const joueurs = etat.status === "ok" ? etat.data.players : undefined;
  const versionRelevee = etat.status === "ok" ? etat.data.version : undefined;

  return (
    <>
      <div className="serveur" ref={reveler}>
        <label className="serveur__libelle" htmlFor="adresse-serveur">
          {minecraft.labelAdresse}
        </label>

        <input
          id="adresse-serveur"
          className="serveur__adresse"
          type="text"
          readOnly
          value={minecraft.ip}
          // La largeur suit l'adresse : un champ au gabarit par défaut la
          // tronquerait, et une adresse tronquée ne se recopie pas à la main.
          size={minecraft.ip.length}
          onFocus={(evenement) => evenement.currentTarget.select()}
        />

        <button type="button" className="btn" onClick={copier}>
          <IcoCopier />
          Copier l’adresse
        </button>

        <span className="meta">{minecraft.releve}</span>

        {/* Le retour de copie du § 0.25. La région est rendue en permanence :
            un `role="status"` ajouté au DOM au moment du message n'est pas
            annoncé de façon fiable. */}
        <span className="meta" role="status">
          {messageCopie}
        </span>
      </div>

      {enPanne ? (
        <div className="encart mt-[var(--sp-4)]">
          <p className="encart__t">Relevé d’état — MBR-503</p>
          <p className="corps-s">
            Le relevé d’état ne répond pas pour l’instant. Ce n’est pas vous, et cela ne veut
            pas dire que le serveur est hors ligne. Réessayez dans quelques minutes, ou
            connectez-vous directement à l’adresse ci-dessus.
          </p>
          <button
            type="button"
            className="btn btn--fantome mt-[var(--sp-4)]"
            onClick={onReessayer}
          >
            Réessayer{" "}
            <span className="btn__f" aria-hidden="true">
              ↺
            </span>
          </button>
        </div>
      ) : etat.status === "loading" ? (
        // MOT — 11 · rien du tout avant 600 ms.
        phase === "attente" ? (
          <p className="meta mt-[var(--sp-4)]">Vérification de l’état du serveur…</p>
        ) : null
      ) : (
        <p className="mt-[var(--sp-4)] flex flex-wrap items-center gap-serre">
          <span className={enLigne ? "etat etat--enligne" : "etat etat--horsligne"}>
            {enLigne ? "En ligne" : "Hors ligne"}
          </span>

          {enLigne && joueurs ? (
            <span className="meta tabl-nombre">
              {joueurs.online} / {joueurs.max} joueurs
            </span>
          ) : null}

          {versionRelevee ? (
            <span className="meta">Version relevée{" "}: {versionRelevee}</span>
          ) : null}

          {releveA ? (
            <time className="meta" dateTime={horodatage(releveA)}>
              Vérifié à {heureEcrite(releveA)}
            </time>
          ) : null}
        </p>
      )}
    </>
  );
}

/* ── L'heure, écrite comme la charte l'écrit ────────────────────────────────
   Forme « 20 h 30 » (04-typographie § 4.7, reprise en tête de site.ts), et
   non « 20:30 ». Les deux espaces sont insécables. `toLocaleTimeString`
   rendrait « 20:30 » : elle n'est donc pas employée.                      */
function heureEcrite(date: Date): string {
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getHours()} h ${minutes}`;
}

/* L'attribut `datetime` d'un `<time>`, en heure locale — `toISOString()`
   basculerait en UTC et afficherait une heure qui n'est pas celle écrite. */
function horodatage(date: Date): string {
  const deuxChiffres = (valeur: number) => String(valeur).padStart(2, "0");
  return (
    `${date.getFullYear()}-${deuxChiffres(date.getMonth() + 1)}-${deuxChiffres(date.getDate())}` +
    `T${deuxChiffres(date.getHours())}:${deuxChiffres(date.getMinutes())}`
  );
}

/* ── `ico-action-copier` — chapitre 06 ──────────────────────────────────────
   Grille 24, `fill:none`, `stroke:currentColor`, bouts et angles ronds : les
   quatre propriétés sont posées par `.ico` en 31-icones.css, le tracé n'a
   rien à déclarer. `.ico--16` porte la compensation optique du trait.
   Le jeu d'icônes partagé n'existe pas encore dans `src/components/` ; ce
   signe est donc local, et il a vocation à le rejoindre.                  */
function IcoCopier() {
  return (
    <svg className="ico ico--16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5.5A1.5 1.5 0 0 1 4 13.5v-8A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V6" />
    </svg>
  );
}
