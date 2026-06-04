import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

function encodeForm(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = { "form-name": "newsletter" };
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
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  if (status === "ok") {
    return (
      <div className="mt-6 max-w-md mx-auto rounded-xl bg-vert-50 border border-vert/30 px-5 py-4 text-left">
        <div className="font-display font-bold text-vert-700">Inscription confirmée.</div>
        <p className="text-sm mt-1 text-encre-600">
          Ton adresse est enregistrée dans les Archives. À très vite dans ta boîte de réception.
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        name="newsletter"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input type="hidden" name="form-name" value="newsletter" />
        <p className="hidden">
          <label>
            Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="ton@email.com"
          disabled={status === "sending"}
          className="flex-1 px-4 py-3 rounded-lg bg-creme border border-encre/20 text-encre placeholder-encre-400 focus:outline-none focus:border-rouge disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Envoi…" : "S'inscrire"}
        </button>
      </form>
      {status === "error" && (
        <p className="caption text-rouge-700 pt-2">
          L'envoi a échoué ({errorMsg}). Réessaie, ou écris à contact@archivesprofesseurchen.com.
        </p>
      )}
      <p className="caption pt-2">Un courrier par mois. Désinscription en un clic.</p>
    </>
  );
}
