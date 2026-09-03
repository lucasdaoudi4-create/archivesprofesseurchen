import { useEffect, useState } from "react";
import { useDiscordWidget } from "../../hooks/useDiscordWidget";
import { discord } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   RELEVÉ DU SERVEUR DISCORD — socle § 0.25 · ARC · CMP — 46
   Les Archives du Professeur Chen — charte v1.0.0

   Le § 0.25 pose trois règles pour ce composant, et les trois sont ici :

   1. AUCUN CHIFFRE DE COMMUNAUTÉ SANS SOURCE BRANCHÉE.
      `discord.guildId` vaut `null` tant que l'identifiant du serveur n'a
      pas été relevé (`CONTRAT_OUVERT`, src/data/site.ts). Tant qu'il vaut
      `null`, ce composant ne rend RIEN — pas un compteur d'estimation, pas
      un « 360+ », pas un repli. C'est ce que remplaçait l'ancien
      `DiscordLiveStats` en variante « card », et c'est précisément ce que
      le principe n° 3 des fondations interdit.

   2. L'ÉTAT EST ÉCRIT, JAMAIS SEULEMENT COLORÉ.
      `.etat--enligne` / `.etat--horsligne` portent une couleur, mais le mot
      « En ligne » est là et reste lisible en couleurs forcées (SC 1.4.1).
      C'est pour cette raison que `99-preferences.css` compense `forced-colors`
      sur `.etat` et sur aucun nom réécrit localement.

   3. L'APPEL RÉSEAU SUIT LE MOTIF D'ATTENTE ARC · MOT — 11.
      Rien pendant les 600 premières millisecondes — un relevé qui revient
      en 200 ms ne doit pas faire clignoter un « chargement… ». Échec
      déclaré à 8 s, même si la requête, elle, n'a pas encore rendu la main.

   ── CE QUE CE COMPOSANT NE FAIT PAS ───────────────────────────────────────

   Il ne touche pas à `useDiscordWidget` : le hook et son rafraîchissement
   de 60 s sont conservés tels quels. `/discord` est la seule surface du
   site où il est monté (l'accueil ne l'affiche plus), parce que c'est la
   seule page où un effectif de communauté a un sens.

   Il n'annonce pas « Hors ligne » quand le relevé échoue : un widget qui
   ne répond pas ne prouve pas qu'un serveur est éteint. L'échec se dit
   pour ce qu'il est — le relevé est indisponible, l'invitation reste
   valable.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Rien ne s'affiche avant ce seuil (ARC · MOT — 11). */
const SEUIL_ATTENTE_MS = 600;

/** Au-delà, le relevé est déclaré indisponible (ARC · MOT — 11). */
const DELAI_ECHEC_MS = 8_000;

/** Forme horaire de la charte (10-membre § 10.16) : « 14 h 32 », jamais « 14:32 ». */
function heureCourte(date: Date): string {
  return `${date.getHours()} h ${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function EtatCommunaute() {
  const releve = useDiscordWidget(discord.guildId);
  const [attenteAffichee, setAttenteAffichee] = useState(false);
  const [echeanceDepassee, setEcheanceDepassee] = useState(false);
  const [verifieA, setVerifieA] = useState<string | null>(null);

  // Motif d'attente : les deux minuteries ne courent que pendant la requête,
  // et les deux drapeaux sont remis à plat dès qu'elle a rendu la main. Sans
  // cette remise à plat, une première réponse arrivée à neuf secondes
  // laisserait « Relevé indisponible » posé pour toute la session, alors que
  // le compteur, lui, se rafraîchit toutes les soixante secondes.
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

  // L'heure du relevé est celle où la réponse est arrivée, pas celle du rendu.
  useEffect(() => {
    if (releve.status === "ok") setVerifieA(heureCourte(new Date()));
  }, [releve]);

  // Aucune source branchée : aucune fiche. Le silence est la bonne réponse.
  if (discord.guildId === null) return null;

  // L'échéance dépassée ne vaut échec que TANT QUE la requête court : une
  // réponse tardive reste une réponse, et elle reprend la main sur le message.
  const echec =
    releve.status === "error" || (releve.status === "loading" && echeanceDepassee);
  const enAttente = releve.status === "loading" && attenteAffichee && !echeanceDepassee;

  return (
    <div className="serveur rv">
      <span className="serveur__libelle">Relevé du serveur</span>

      {/* Une seule région vive, présente dès le montage : un `role="status"`
          qui apparaît en même temps que son texte n'est pas annoncé. */}
      <div role="status" className="flex flex-wrap items-center gap-[var(--sp-3)]">
        {releve.status === "ok" && (
          <>
            <span className="etat etat--enligne">En ligne</span>
            <span className="tabl-nombre">
              {releve.data.presenceCount} membres en ligne
            </span>
          </>
        )}

        {echec && <span className="etat etat--horsligne">Relevé indisponible</span>}

        {enAttente && <span className="etat">Relevé en cours</span>}

        {verifieA !== null && releve.status === "ok" && (
          <span className="meta">Vérifié à {verifieA}</span>
        )}
      </div>
    </div>
  );
}
