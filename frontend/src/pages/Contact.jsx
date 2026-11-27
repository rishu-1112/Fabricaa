import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "../services/api";
import { isDemoMode } from "../services/catalog";
import FabricFaq from "../components/FabricFaq";
import MillMap from "../components/MillMap";
import ScrollReveal from "../components/ScrollRevealAbout";

const topics = {
  general: "General question",
  swatches: "Swatch inquiry",
  bulk: "Bulk fabric inquiry",
  partnership: "Partnership",
};

export default function Contact() {
  const [params] = useSearchParams();
  const requestedTopic = params.get("topic");
  const initialTopic = Object.hasOwn(topics, requestedTopic) ? requestedTopic : "general";
  const fabric = params.get("fabric")?.trim().slice(0, 100);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const message = fields.get("message").trim();
    if (!message) {
      setFeedback({ error: true, text: "Enter a message before sending." });
      return;
    }

    setSending(true);
    setFeedback(null);

    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      form.reset();
      setFeedback({
        error: false,
        text: "Demo draft saved locally. Connect the live backend to send real messages.",
      });
      setSending(false);
      return;
    }

    try {
      const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: `Topic: ${topics[fields.get("topic")]}\n\n${message}`,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFeedback({ error: true, text: result.error || "Could not send your message. Please try again." });
        return;
      }
      form.reset();
      setFeedback({ error: false, text: "Message sent. We’ll reply by email." });
    } catch {
      setFeedback({ error: true, text: "Could not reach the contact service. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="paper">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">
        <ScrollReveal>
          <h1 className="display-title theme-text text-5xl sm:text-6xl">Get in touch</h1>
          <p className="theme-muted mb-10 mt-3 max-w-xl">
            Ask about swatches, availability, or sourcing for your next project.
          </p>
        </ScrollReveal>

        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.2fr]">
          <ScrollReveal className="space-y-4" delay={0.05}>
            <div className="rounded-3xl p-6 text-white" style={{ backgroundColor: "var(--fb-hero)" }}>
              <h2 className="text-xl font-semibold">Request pricing for multiple fabrics</h2>
              <p className="my-3 text-sm text-emerald-50/85">
                Add fabrics to your cart so your quote includes the right items and quantities.
              </p>
              <Link className="inline-flex font-semibold text-emerald-100 underline underline-offset-4" to="/products">
                Browse the catalog
              </Link>
            </div>
            <div className="surface rounded-3xl border p-6">
              <h2 className="theme-text font-semibold">Example of a swatch inquiry</h2>
              <p className="theme-muted mt-2 text-sm leading-relaxed">
                “I’m comparing cotton poplin and linen for summer shirts. Could you share swatch options and minimum
                quantities?”
              </p>
            </div>
            {isDemoMode && (
              <p className="rounded-2xl border border-amber-200 theme-soft px-4 py-3 text-sm text-amber-950">
                Demo mode: the form works for practice, but messages are not emailed.
              </p>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <form onSubmit={submit} className="surface space-y-4 rounded-3xl border p-6 shadow-sm sm:p-8">
              <h2 className="theme-text text-xl font-semibold">Send a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Name
                  <input className="field-input" name="name" autoComplete="name" maxLength={100} required />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input className="field-input" name="email" autoComplete="email" type="email" maxLength={254} required />
                </label>
              </div>
              <label className="block text-sm font-medium">
                Topic
                <select key={initialTopic} name="topic" defaultValue={initialTopic} className="field-input">
                  {Object.entries(topics).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="field-input"
                  name="message"
                  key={fabric}
                  defaultValue={fabric ? `Could you share swatch options for ${fabric}?` : ""}
                  maxLength={1900}
                  rows={5}
                  required
                />
              </div>
              <button disabled={sending} className="btn-primary disabled:opacity-50">
                {sending ? "Sending…" : "Send message"}
              </button>
              {feedback && (
                <p role={feedback.error ? "alert" : "status"} className={feedback.error ? "text-red-700" : "theme-brand"}>
                  {feedback.text}
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
      <MillMap />
      <FabricFaq />
    </section>
  );
}
