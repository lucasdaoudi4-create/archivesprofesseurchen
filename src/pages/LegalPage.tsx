import { site } from "../data/site";

type Kind = "mentions" | "cgv" | "confidentialite";

const CONTENT: Record<Kind, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  mentions: {
    title: "Mentions légales",
    intro:
      "Conformément à la loi pour la confiance dans l'économie numérique, voici les informations légales de l'éditeur du site.",
    sections: [
      { h: "Éditeur", p: "À compléter : nom, statut juridique, adresse, SIRET, capital social." },
      { h: "Directeur de la publication", p: "À compléter." },
      { h: "Hébergeur", p: "À compléter (ex. Netlify, Inc. — 44 Montgomery St, San Francisco, CA 94104, USA)." },
      { h: "Propriété intellectuelle", p: "L'ensemble des contenus est protégé. Toute reproduction non autorisée est interdite." },
    ],
  },
  cgv: {
    title: "Conditions générales",
    intro: "Conditions générales d'utilisation du site et de vente de la formation.",
    sections: [
      { h: "Objet", p: "À compléter : description de la formation, du contenu, des services." },
      { h: "Tarifs", p: "À compléter : prix, modalités de paiement, durée d'accès." },
      { h: "Droit de rétractation", p: "À compléter selon le cadre légal applicable (formation en ligne, B2C)." },
      { h: "Litiges", p: "Médiation puis juridictions françaises compétentes." },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    intro: "Comment nous traitons tes données personnelles, dans le respect du RGPD.",
    sections: [
      { h: "Données collectées", p: "Nom, email, messages envoyés via le formulaire de contact, données de navigation anonymisées." },
      { h: "Finalités", p: "Te recontacter, t'envoyer la newsletter si tu y consens, améliorer le site." },
      { h: "Durée de conservation", p: "À compléter selon les traitements (3 ans pour les contacts commerciaux par défaut)." },
      { h: "Tes droits", p: "Accès, rectification, suppression, opposition — écris à l'adresse contact du site." },
    ],
  },
};

export default function LegalPage({ kind }: { kind: Kind }) {
  const data = CONTENT[kind];
  return (
    <section className="container-narrow pt-20 pb-20">
      <div className="text-xs uppercase tracking-widest text-pikachu-yellow font-semibold">
        {site.name}
      </div>
      <h1 className="heading-display text-white mt-2 mb-4">{data.title}</h1>
      <p className="text-lab-200 leading-relaxed">{data.intro}</p>
      <div className="mt-10 space-y-8">
        {data.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-xl text-white mb-2">{s.h}</h2>
            <p className="text-lab-300 leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>
      <div className="mt-12 p-5 rounded-xl bg-pikachu-yellow/10 border border-pikachu-yellow/30 text-sm text-pikachu-yellow">
        ⚠ Page à compléter avec ton avocat / les informations réelles avant la mise en ligne publique.
      </div>
    </section>
  );
}
