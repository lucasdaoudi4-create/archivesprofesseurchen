import { useState } from "react";
import TypeBadge from "../components/ui/TypeBadge";

type Subject = "formation" | "partenariat" | "minecraft" | "presse" | "autre";

const SUBJECTS: { key: Subject; label: string; icon: string }[] = [
  { key: "formation", label: "Formation", icon: "🎓" },
  { key: "partenariat", label: "Partenariat", icon: "🤝" },
  { key: "minecraft", label: "Serveur Minecraft", icon: "⛏" },
  { key: "presse", label: "Presse / Médias", icon: "📰" },
  { key: "autre", label: "Autre", icon: "✉" },
];

const SUBJECT_LABELS: Record<Subject, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.label]),
) as Record<Subject, string>;

type Status = "idle" | "sending" | "ok" | "error";

function encodeForm(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [subject, setSubject] = useState<Subject>("formation");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, string> = {
      "form-name": "contact",
      subject: SUBJECT_LABELS[subject],
    };
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      form.reset();
      setSubject("formation");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <>
      <section className="container-narrow pt-20 pb-12 text-center">
        <TypeBadge variant="electric">Contact</TypeBadge>
        <h1 className="heading-display mt-4 text-white">Écris au laboratoire</h1>
        <p className="text-lg text-lab-200 max-w-xl mx-auto mt-4">
          Une question, une proposition, une demande presse ? Le Professeur lit tout (et répond
          souvent en moins de 48h).
        </p>
      </section>

      <section className="section pt-0">
        <div className="container-narrow grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card !p-8">
            {status === "ok" ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">📬</div>
                <h3 className="font-display text-2xl text-white">Message envoyé !</h3>
                <p className="text-lab-200">
                  Merci, on revient vers toi dès que possible. En attendant, fais un tour sur le
                  Discord ou découvre la formation.
                </p>
                <button onClick={() => setStatus("idle")} className="btn-ghost mt-4">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                className="space-y-5"
              >
                {/* Champs cachés requis par Netlify Forms */}
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                {/* Le sujet est géré via state mais on l'expose dans la soumission */}
                <input type="hidden" name="subject" value={SUBJECT_LABELS[subject]} />

                <div>
                  <label className="block text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold">
                    Sujet
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s.key}
                        onClick={() => setSubject(s.key)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                          subject === s.key
                            ? "bg-pokeball-red/15 border-pokeball-red text-white"
                            : "bg-white/5 border-white/10 text-lab-200 hover:border-white/20"
                        }`}
                      >
                        <div className="text-xl mb-1">{s.icon}</div>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nom / Pseudo" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>

                <Field label="Objet (résumé court)" name="object" required />

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-lab-500 focus:outline-none focus:border-pikachu-yellow"
                    placeholder="Raconte-nous tout..."
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-lab-300">
                  <input type="checkbox" required className="mt-1 accent-pikachu-yellow" />
                  <span>
                    J'accepte que mes données soient utilisées pour me recontacter, conformément à
                    la politique de confidentialité.
                  </span>
                </label>

                {status === "error" && (
                  <div className="rounded-xl bg-pokeball-red/15 border border-pokeball-red/40 text-pokeball-red text-sm px-4 py-3">
                    Impossible d'envoyer le message ({errorMsg}). Réessaie ou écris directement à{" "}
                    <a
                      href="mailto:contact@archivesprofesseurchen.com"
                      className="underline font-semibold"
                    >
                      contact@archivesprofesseurchen.com
                    </a>
                    .
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
                  {status !== "sending" && <span aria-hidden>→</span>}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold">
                Email direct
              </div>
              <a
                href="mailto:contact@archivesprofesseurchen.com"
                className="font-mono text-sm text-white hover:text-pikachu-yellow break-all"
              >
                contact@archivesprofesseurchen.com
              </a>
            </div>
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold">
                Réponse
              </div>
              <div className="font-display text-2xl text-white">~ 48h</div>
              <p className="text-sm text-lab-300 mt-1">
                Hors week-ends et événements communautaires.
              </p>
            </div>
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold">
                Le plus rapide ?
              </div>
              <p className="text-sm text-lab-200">
                Pose ta question sur le{" "}
                <a href="/discord" className="text-pikachu-yellow underline">
                  Discord
                </a>{" "}
                — souvent un membre te répond avant nous.
              </p>
            </div>
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold">
                Presse / partenariats
              </div>
              <p className="text-sm text-lab-200">
                Précise <span className="text-white">"Presse"</span> ou{" "}
                <span className="text-white">"Partenariat"</span> dans le sujet pour être prioritaire.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest text-pikachu-yellow mb-2 font-semibold"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-lab-500 focus:outline-none focus:border-pikachu-yellow"
      />
    </div>
  );
}
