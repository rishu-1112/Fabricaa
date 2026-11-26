import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "../services/api";
import FabricFaq from "../components/FabricFaq";

const topics = {
  general: "General question",
  swatches: "Swatch inquiry",
  bulk: "Bulk fabric inquiry",
  partnership: "Partnership",
};

const field = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5";

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
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-4xl font-bold">Get in Touch</h1>
        <p className="mb-9 mt-3 text-gray-600">Ask about swatches, availability, or sourcing for your next project.</p>
        <div className="grid items-start gap-8 md:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            <div className="rounded-xl bg-indigo-50 p-5">
              <h2 className="font-semibold">Request pricing for multiple fabrics</h2>
              <p className="my-2 text-sm text-gray-700">Add your fabrics to a cart so your quote includes the right items and quantities.</p>
              <Link className="text-sm font-semibold text-indigo-700 underline" to="/products">Browse the catalog</Link>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold">Example of a swatch inquiry</h2>
              <p className="mt-2 text-sm text-gray-600">“I’m comparing cotton poplin and linen for summer shirts. Could you share swatch options and minimum quantities?”</p>
            </div>
          </aside>
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Send a Message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Name<input className={field} name="name" autoComplete="name" maxLength={100} required /></label>
              <label className="block text-sm font-medium">Email<input className={field} name="email" autoComplete="email" type="email" maxLength={254} required /></label>
            </div>
            <label className="block text-sm font-medium">
              Topic
              <select key={initialTopic} name="topic" defaultValue={initialTopic} className={field}>
                {Object.entries(topics).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium">Message</label>
              <textarea id="contact-message" className={field} name="message" key={fabric} defaultValue={fabric ? `Could you share swatch options for ${fabric}?` : ""} maxLength={1900} rows={5} required />
            </div>
            <button disabled={sending} className="rounded-lg bg-indigo-700 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{sending ? "Sending…" : "Send Message"}</button>
            {feedback && <p role={feedback.error ? "alert" : "status"} className={feedback.error ? "text-red-700" : "text-green-800"}>{feedback.text}</p>}
          </form>
        </div>
      </div>
      <FabricFaq />
    </section>
  );
}
