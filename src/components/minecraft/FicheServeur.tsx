import { useEffect, useRef, useState } from "react";
import { minecraft } from "../../data/site";
import { Icone } from "../ui/Icones";
import { useMinecraftStatus } from "../../hooks/useMinecraftStatus";

/* ═══════════════════════════════════════════════════════════════════════════
   FICHE DE SERVEUR — `.serveur` (ARC · CMP — 46) qui porte désormais
   `.copyline` (ARC · CMP — 56) et `.livebox` (ARC · CMP — 55)
   Les Archives du Professeur Chen — charte v1.0.0

   ── CE QUI CHANGE, ET POURQUOI ────────────────────────────────────────────

   1. L’ADRESSE ÉTAIT DU TEXTE INERTE. Un `<input readonly>` habillé en
      `.serveur__adresse` : on pouvait la sélectionner, pas la copier d’un
      clic — ou plutôt, le bouton existait mais il vivait à côté du champ,
      hors de toute anatomie déclarée. `.copyline` (section 20 de
      30-composants.css) est le composant prévu pour exactement cela :
      « un champ qu’on ne remplit pas : on le copie ». Son anatomie est
      tenue au mot — `.copyline` > `.copyline__val` + `.btn.copyline__btn`.

   2. LE RELEVÉ D’ÉTAT ÉTAIT UNE LIGNE DE JETONS. `.etat` + `.meta` +
      `<time>` alignés, et un `.encart` séparé pour l’échec. L’anatomie
      normative est `.livebox` (section 21) : `.lb-head` (point + libellé) ·
      `.lb-figure` (le chiffre) · `.lb-sub` (la précision) · `.lb-act` (le
      bouton). Quatre états, et le MOT porte chacun d’eux — le point est
      `aria-hidden`, il n’informe jamais (SC 1.4.1).

   ── LES QUATRE ÉTATS, ET LEUR LECTURE HONNÊTE ─────────────────────────────

     `--attente`    la requête court depuis plus de 600 ms · « — »
     `--enligne`    le relevé répond et le serveur est debout · le chiffre
     `--horsligne`  le relevé répond et dit le serveur éteint · « — »
     `--muet`       LE RELEVÉ ne répond pas · « — »

   La distinction entre `--horsligne` et `--muet` est le point important, et
   c’est une règle d’honnêteté, pas de style : un service tiers qui ne
   répond pas ne prouve rien sur l’état du serveur. `--muet` dit donc que
   c’est LE COMPTEUR qui est muet, et l’adresse reste utilisable. Écrire
   « Hors ligne » sur un échec réseau serait une affirmation invérifiable
   (01-fondations § 6.1, règle 5).

   ── LE MOTIF D’ATTENTE ARC · MOT — 11 ─────────────────────────────────────
   Rien avant 600 ms — la `.livebox` n’est pas rendue du tout, un bloc vide
   qui clignote coûte plus qu’il ne dit. Mention d’attente entre 600 ms et
   8 s. Au-delà, échec déclaré avec le code court `MBR-503` et un bouton
   « Réessayer ». Le hook n’expose ni seuil ni reprise : les trois seuils
   sont tenus ici, et la reprise se fait par remontage (`key` côté page).

   ── LE HOOK N’EST PAS TOUCHÉ DANS SON CONTRAT ─────────────────────────────
   `useMinecraftStatus` garde sa signature, ses types et son point de
   terminaison. Ce qui a changé chez lui — suspension du sondage en onglet
   caché, annulation de la requête en vol au démontage — est interne et
   documenté dans le fichier du hook.

   ── CE QUI EST ANNONCÉ, ET CE QUI SE TAIT ─────────────────────────────────
   Le relevé se rafraîchit seul toutes les 60 s. La `.livebox` porte donc
   `aria-live="off"` : un bloc qui parle toutes les minutes est
   insupportable. Seul le CHANGEMENT d’état part dans la région `polite` que
   la PAGE tient (hors de la `key`, sinon elle serait recréée à chaque
   reprise et une région vive n’est annoncée de façon fiable que si elle
   était déjà dans le document). Le premier relevé d’une page fraîchement
   ouverte ne dit rien : il n’y a pas de changement, et on ne vole pas la
   parole à qui vient d’arriver.

   Le retour de copie a SA PROPRE région `role="status"`, distincte : les
   deux annonces ne doivent jamais s’écraser l’une l’autre.
   ═══════════════════════════════════════════════════════════════════════════ */

/** MOT — 11 : en dessous, un indicateur ferait plus de bruit que l’attente. */
const SEUIL_ATTENTE_MS = 600;

/** MOT — 11 : au-delà, l’attente s’arrête et l’échec s’affiche. */
const SEUIL_ECHEC_MS = 8_000;

/** Section 20 de 30-composants.css : « Le retour dure 2 s ». */
const DUREE_COPIEE_MS = 2_000;

/** Un message d’échec doit être lu, donc rester plus longtemps qu’un succès. */
const DUREE_ECHEC_COPIE_MS = 6_000;

/* ── Les mots ──────────────────────────────────────────────────────────────
   Ils servent à l’écran ET à l’annonce : la région vive ne dit rien d’autre
   que ce que le lecteur voit. Les espaces insécables sont échappées, jamais
   écrites en octet nu (04-typographie § 4.7).                            */
const MOT_ATTENTE = "Vérification";
const MOT_ENLIGNE = "En ligne";
const MOT_HORSLIGNE = "Hors ligne";
const MOT_MUET = "Relevé indisponible · MBR-503";

const SUB_ATTENTE = "Vérification de l’état du serveur en cours…";
/** Le relevé répond, mais sans compteur de joueurs : on ne dit que ce qu’on sait. */
const SUB_ENLIGNE_SANS_CHIFFRE = "Le serveur répond.";
const SUB_HORSLIGNE =
  "Le serveur ne répond pas. L’adresse ci-dessus reste la bonne\u00A0: réessayez dans quelques minutes.";
const SUB_MUET =
  "Le relevé d’état ne répond pas pour l’instant. Ce n’est pas vous, et cela ne dit rien de l’état du serveur\u00A0: l’adresse ci-dessus reste valable.";

const COPIE_LIBELLE = "Copier";
const COPIE_LIBELLE_FAIT = "Copié";
const COPIE_PRECISION = " l’adresse du serveur";
const MSG_COPIEE = "Adresse copiée.";
const MSG_COPIE_REFUSEE =
  "Copie impossible\u00A0: sélectionnez l’adresse pour la copier à la main.";
const MSG_SANS_PRESSE_PAPIERS =
  "Ce navigateur ne donne pas accès au presse-papiers\u00A0: sélectionnez l’adresse pour la copier.";

/** Les quatre états de `.livebox`. `null` = rien n’est rendu (avant 600 ms). */
type EtatDirect = "attente" | "enligne" | "horsligne" | "muet";

/** Ce que la copie a donné. `null` = rien à dire pour l’instant. */
type RetourCopie = { ton: "ok" | "echec"; texte: string } | null;

interface Props {
  /**
   * Le rang de la tentative. `0` au premier montage de la page, puis un de
   * plus à chaque « Réessayer ». Il ne pilote rien du relevé — la `key` s’en
   * charge — mais il dit à la fiche si son montage est une REPRISE, donc
   * s’il y a un focus à rattraper et quelque chose à annoncer.
   */
  reprise: number;
  /**
   * Donne à la région vive de la page le texte à annoncer. Doit être une
   * référence STABLE : la fiche la garde en dépendance d’effet.
   */
  onAnnonce: (texte: string) => void;
  /** Remonte la fiche, donc relance le relevé. */
  onReessayer: () => void;
}

export default function FicheServeur({ reprise, onAnnonce, onReessayer }: Props) {
  const etat = useMinecraftStatus(minecraft.ip);

  const [phase, setPhase] = useState<"muet" | "attente" | "echec">("muet");
  const [releveA, setReleveA] = useState<Date | null>(null);
  const [retourCopie, setRetourCopie] = useState<RetourCopie>(null);

  /* Le presse-papiers est sondé UNE FOIS, au premier rendu, et jamais
     redemandé : la réponse ne change pas en cours de session. S’il manque,
     le bouton n’est pas rendu du tout — la section 20 l’impose, et c’est la
     seule forme honnête : mieux vaut aucun bouton qu’un bouton inerte. Une
     phrase visible prend sa place et dit quoi faire à la main. */
  const [pressePapiersDispo] = useState(
    () =>
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard?.writeText === "function"
  );

  /** La cible du focus au retour d’une reprise. */
  const fiche = useRef<HTMLDivElement>(null);

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

  /* L’heure de vérification. Le hook renvoie un objet neuf à chaque relevé,
     y compris identique : l’horodatage suit donc le rafraîchissement de 60 s.

     Seul un relevé RÉUSSI l’avance. Un échec ne vérifie rien — écrire
     « Vérifié à 20 h 30 » sous un compteur muet daterait une vérification
     qui n’a pas eu lieu. Sur échec, l’horodatage reste donc celui du dernier
     relevé abouti, et l’affichage ne le montre pas (voir `.lb-sub`). */
  useEffect(() => {
    if (etat.status !== "ok") return;
    setReleveA(new Date());
  }, [etat]);

  // Le retour de copie s’efface tout seul : ce n’est pas un état de la page.
  useEffect(() => {
    if (retourCopie === null) return;
    const duree = retourCopie.ton === "ok" ? DUREE_COPIEE_MS : DUREE_ECHEC_COPIE_MS;
    const minuteur = setTimeout(() => setRetourCopie(null), duree);
    return () => clearTimeout(minuteur);
  }, [retourCopie]);

  /* ── L’état du direct ────────────────────────────────────────────────────
     `--muet` couvre les deux façons dont le RELEVÉ fait défaut : l’erreur
     rendue par le hook, et l’échéance de 8 s dépassée alors que la requête
     court encore. `--horsligne` est réservé au cas où le relevé a répondu
     et dit le serveur éteint. */
  const releveMuet = phase === "echec" || etat.status === "error";
  const direct: EtatDirect | null = releveMuet
    ? "muet"
    : etat.status === "loading"
      ? phase === "attente"
        ? "attente"
        : null
      : etat.data.online
        ? "enligne"
        : "horsligne";

  const joueurs = etat.status === "ok" ? etat.data.players : undefined;
  const versionRelevee = etat.status === "ok" ? etat.data.version : undefined;

  const mot =
    direct === "enligne"
      ? MOT_ENLIGNE
      : direct === "horsligne"
        ? MOT_HORSLIGNE
        : direct === "muet"
          ? MOT_MUET
          : MOT_ATTENTE;

  const chiffre = direct === "enligne" && joueurs ? String(joueurs.online) : "—";

  // Reprise : le focus revient sur la fiche, et l’attente est annoncée. Le
  // composant est remonté à chaque tentative, donc cet effet passe une fois
  // par montage — et ne fait rien du tout au premier.
  useEffect(() => {
    if (reprise === 0) return;
    fiche.current?.focus();
    onAnnonce(SUB_ATTENTE);
  }, [reprise, onAnnonce]);

  /* ── L’annonce du changement d’état ──────────────────────────────────────
     Le relevé se rafraîchit seul toutes les 60 s ; jusqu’ici, un lecteur
     d’écran n’en savait rien (constat d’audit). Ce qui part dans la région
     vive est donc le MOT, et seulement quand il CHANGE : deux relevés
     identiques à une minute d’intervalle ne disent rien.

     `precedent` est une référence, pas un état : la comparaison ne doit pas
     provoquer de rendu. Elle repart à `null` à chaque remontage — donc à
     chaque « Réessayer » — ce qui est exactement voulu : une reprise
     annonce toujours son dénouement. */
  const precedent = useRef<string | null>(null);
  useEffect(() => {
    if (direct === null || direct === "attente") return;
    const ancien = precedent.current;
    precedent.current = mot;
    if (ancien === mot) return;
    // Premier relevé d’une page fraîchement ouverte : il n’y a pas de
    // changement, et le bloc est là, lisible. On se tait.
    if (ancien === null && reprise === 0) return;
    onAnnonce(mot);
  }, [direct, mot, reprise, onAnnonce]);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(minecraft.ip);
      setRetourCopie({ ton: "ok", texte: MSG_COPIEE });
    } catch {
      // Permission refusée, contexte non sécurisé, presse-papiers verrouillé
      // par le système : dans tous les cas on dit quoi faire à la place.
      setRetourCopie({ ton: "echec", texte: MSG_COPIE_REFUSEE });
    }
  };

  const copiee = retourCopie?.ton === "ok";

  return (
    <>
      {/* `tabIndex={-1}` : la fiche n’entre pas dans l’ordre de tabulation,
          elle est seulement une cible de focus — le patron du § 0.28. */}
      <div className="serveur" data-rv ref={fiche} tabIndex={-1}>
        <span className="serveur__libelle">{minecraft.labelAdresse}</span>

        {/* ARC · CMP — 56 · `.copyline`. La valeur porte `user-select: all`
            (section 20) : un clic la sélectionne en entier, ce qui garde la
            copie manuelle possible même sans le bouton. */}
        <div className="copyline">
          <span className="copyline__val">{minecraft.ip}</span>

          {pressePapiersDispo ? (
            <button
              type="button"
              className={copiee ? "btn copyline__btn copiee" : "btn copyline__btn"}
              onClick={copier}
            >
              {/* Le signe double le libellé écrit juste à côté : décoratif. */}
              <Icone nom="copier" taille={16} />
              {copiee ? COPIE_LIBELLE_FAIT : COPIE_LIBELLE}
              {/* Le libellé accessible dit CE QUE le bouton copie. */}
              <span className="sr-only">{COPIE_PRECISION}</span>
            </button>
          ) : null}
        </div>

        {/* La ligne technique du § 0.25, telle qu’elle est écrite dans
            `site.ts` — jamais recomposée ici. */}
        <span className="meta">{minecraft.releve}</span>

        {pressePapiersDispo ? null : (
          <span className="meta">{MSG_SANS_PRESSE_PAPIERS}</span>
        )}

        {/* Le retour de copie : VISIBLE et annoncé. La région est rendue en
            permanence — un `role="status"` ajouté au DOM en même temps que
            son texte n’est pas annoncé de façon fiable. Elle est distincte
            de la région d’état tenue par la page : deux annonces qui
            partagent une région s’écrasent l’une l’autre. */}
        <span className="meta" role="status">
          {retourCopie?.texte ?? ""}
        </span>
      </div>

      {/* ARC · CMP — 55 · `.livebox`. Rien n’est rendu avant 600 ms
          (MOT — 11). `aria-live="off"` : le rafraîchissement de 60 s ne
          parle pas — seul le changement d’état part dans la région vive de
          la page. */}
      {direct === null ? null : (
        <div
          className={`livebox livebox--${direct} mt-[var(--sp-4)]`}
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
              ? joueurs
                ? `joueurs connectés sur ${joueurs.max}`
                : SUB_ENLIGNE_SANS_CHIFFRE
              : direct === "attente"
                ? SUB_ATTENTE
                : direct === "horsligne"
                  ? SUB_HORSLIGNE
                  : SUB_MUET}

            {versionRelevee && direct === "enligne" ? ` · version ${versionRelevee}` : null}

            {releveA && (direct === "enligne" || direct === "horsligne") ? (
              <>
                {" · "}
                <time dateTime={horodatage(releveA)}>Vérifié à {heureEcrite(releveA)}</time>
              </>
            ) : null}
          </p>

          {direct === "muet" || direct === "horsligne" ? (
            <div className="lb-act">
              <button type="button" className="btn btn--fantome" onClick={onReessayer}>
                Réessayer
                <span className="btn__f" aria-hidden="true">
                  ↺
                </span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

/* ── L’heure, écrite comme la charte l’écrit ────────────────────────────────
   Forme « 20 h 30 » (04-typographie § 4.7, reprise en tête de site.ts), et
   non « 20:30 ». Les deux espaces sont insécables. `toLocaleTimeString`
   rendrait « 20:30 » : elle n’est donc pas employée.                      */
function heureEcrite(date: Date): string {
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getHours()}\u00A0h\u00A0${minutes}`;
}

/* L’attribut `datetime` d’un `<time>`, en heure locale — `toISOString()`
   basculerait en UTC et afficherait une heure qui n’est pas celle écrite. */
function horodatage(date: Date): string {
  const deuxChiffres = (valeur: number) => String(valeur).padStart(2, "0");
  return (
    `${date.getFullYear()}-${deuxChiffres(date.getMonth() + 1)}-${deuxChiffres(date.getDate())}` +
    `T${deuxChiffres(date.getHours())}:${deuxChiffres(date.getMinutes())}`
  );
}
