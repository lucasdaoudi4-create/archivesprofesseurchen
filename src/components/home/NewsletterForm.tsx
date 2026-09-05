import { useState, type FormEvent } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE BANDEAU D’INSCRIPTION — `ARC · CMP` · composant porté, non monté
   Les Archives du Professeur Chen — charte v1.0.0

   ── POURQUOI CE FICHIER EXISTE ENCORE, ET POURQUOI IL N’EST NULLE PART ────

   L’accueil précédent montait ce formulaire (`Home.tsx`, l. 269-280 avant
   migration). La maquette validée n’en dessine aucun, et le § 0.36 ne le
   nomme ni dans les suppressions ni dans les conservations : le lot L4 l’a
   donc démonté avec le reste du bas de page. Il n’est PAS supprimé pour
   autant, parce que le chapitre 08 § « Pied de page » lui garde une place
   nommée — `.sitefoot > .newsletter (optionnel, B-15)`.

   Le composant reste donc disponible, et à jour. LE MONTER EST UNE DÉCISION
   D’AUTEUR, pas une décision de recette : l’emplacement (pied de page ou
   bloc d’accueil) n’est tranché nulle part.

   ── CE QUI A ÉTÉ PORTÉ ────────────────────────────────────────────────────

   Le fichier portait à lui seul TOUTES les classes mortes qui restaient dans
   `src/` après la migration : quatre utilitaires de couleur de l’ancienne
   palette (fond crème, texte d’alerte, fond et texte de succès), un
   utilitaire de couleur d’invite, l’ancien bouton primaire, et le dernier
   point d’arrêt Tailwind par défaut du dépôt — six familles que le § 0.36
   range dans les « suppressions de code de l’ancienne charte ». Toutes
   rendaient déjà du vide.

   Il est réécrit sur les composants de la charte, à l’identique de ce que
   `Contact.tsx` fait pour le formulaire de contact : `.champ`, `.encart`,
   `.btn`, `.meta`, et le point d’arrêt `planche:`. La copy passe au
   vouvoiement (lot L5).

   ── LE CONTRAT NETLIFY EST INCHANGÉ — NE PAS Y TOUCHER ────────────────────

   Netlify détecte les formulaires dans le HTML STATIQUE livré, jamais dans
   le DOM rendu par React. Le doublet est donc obligatoire :

     · `index.html` porte un `<form name="newsletter" data-netlify hidden>`
       avec les deux mêmes champs — c’est LUI que le robot de compilation
       lit ; le retirer supprime le formulaire côté Netlify ;
     · ce composant renvoie la soumission en `POST` sur `/`, encodée en
       `application/x-www-form-urlencoded`, avec `form-name` en tête.

   Les quatre pièces du contrat, telles quelles : `name="newsletter"`,
   `data-netlify="true"`, `data-netlify-honeypot="bot-field"`, le champ
   caché `form-name`, et le pot de miel `bot-field` dans un conteneur masqué.
   ═══════════════════════════════════════════════════════════════════════════ */

const NOM_FORMULAIRE = "newsletter";

type Etat = "repos" | "envoi" | "envoye" | "echec";

function encodeForm(donnees: Record<string, string>): string {
  return Object.entries(donnees)
    .map(([cle, valeur]) => encodeURIComponent(cle) + "=" + encodeURIComponent(valeur))
    .join("&");
}

export default function NewsletterForm() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [detail, setDetail] = useState("");

  const envoyer = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();

    // Capturé AVANT le premier `await` : React remet `currentTarget` à null
    // dès que le gestionnaire a rendu la main.
    const formulaire = evenement.currentTarget;

    setEtat("envoi");
    setDetail("");

    const donnees = new FormData(formulaire);
    const charge: Record<string, string> = { "form-name": NOM_FORMULAIRE };
    donnees.forEach((valeur, cle) => {
      if (typeof valeur === "string") charge[cle] = valeur;
    });

    try {
      const reponse = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(charge),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      formulaire.reset();
      setEtat("envoye");
    } catch (erreur) {
      setEtat("echec");
      setDetail(erreur instanceof Error ? erreur.message : "");
    }
  };

  /* L’état est ÉCRIT, jamais porté par la seule couleur — § 0.31. */
  if (etat === "envoye") {
    return (
      <div className="encart" role="status">
        <p className="encart__t">Inscription enregistrée</p>
        <p className="corps">
          Votre adresse est dans les Archives. Vous recevrez le prochain courrier.
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        name={NOM_FORMULAIRE}
        method="POST"
        onSubmit={envoyer}
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        aria-describedby="n-rythme"
      >
        {/* Contrat Netlify — ne pas retirer, ne pas renommer. */}
        <input type="hidden" name="form-name" value={NOM_FORMULAIRE} />
        <p className="hidden">
          <label>
            Ne pas remplir :{" "}
            <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <div className="grid gap-[var(--gap-3)] planche:grid-cols-[1fr_auto] planche:items-end">
          <div className="champ">
            <label htmlFor="n-mail">Votre adresse électronique</label>
            <input
              id="n-mail"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={etat === "envoi"}
            />
          </div>
          <button type="submit" className="btn" disabled={etat === "envoi"}>
            {etat === "envoi" ? "Envoi en cours…" : "M’inscrire"}
            <span className="btn__f" aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      {etat === "echec" && (
        <p className="meta" role="alert">
          L’envoi n’a pas abouti{detail ? ` (${detail})` : ""}. Reprenez dans un instant,
          ou écrivez directement à l’adresse de contact.
        </p>
      )}

      <p className="meta" id="n-rythme">
        Un courrier par mois. Désinscription en un clic.
      </p>
    </>
  );
}
