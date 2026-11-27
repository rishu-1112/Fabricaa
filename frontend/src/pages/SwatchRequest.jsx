import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FabricImage from "../components/FabricImage";
import ScrollReveal from "../components/ScrollRevealAbout";
import { useCart } from "../context/CartContext";
import { apiUrl } from "../services/api";
import { isDemoMode } from "../services/catalog";
import { saveQuoteDraft } from "../services/quoteHistory";

export default function SwatchRequest() {
  const { saved, cart, comparison } = useCart();
  const candidates = useMemo(() => {
    const map = new Map();
    [...saved, ...comparison, ...cart].forEach((item) => {
      if (item?._id) map.set(item._id, item);
    });
    return [...map.values()];
  }, [saved, comparison, cart]);

  const [selected, setSelected] = useState(() => new Set());
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setSelected((current) => {
      const valid = new Set(candidates.map((item) => item._id));
      const kept = [...current].filter((id) => valid.has(id));
      if (kept.length) return new Set(kept);
      return new Set(candidates.slice(0, 3).map((item) => item._id));
    });
  }, [candidates]);

  function toggle(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const fabrics = candidates.filter((item) => selected.has(item._id));
    if (!fabrics.length) {
      setFeedback({ error: true, text: "Select at least one fabric for swatches." });
      return;
    }

    const notes = [
      "Swatch inquiry",
      fields.get("colours") && `Preferred colours: ${fields.get("colours")}`,
      fields.get("notes"),
      "",
      "Requested fabrics:",
      ...fabrics.map((item) => `- ${item.name}${item.colour ? ` (${item.colour})` : ""}`),
    ]
      .filter(Boolean)
      .join("\n");

    setSending(true);
    setFeedback(null);

    const draft = saveQuoteDraft({
      type: "swatch-request",
      items: fabrics.map((item) => ({ ...item, quantity: 1 })),
      notes,
      contact: { name: fields.get("name"), email: fields.get("email") },
    });

    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setFeedback({
        error: false,
        text: `Demo swatch request saved locally (${draft.id}). Connect the live backend to email it.`,
      });
      setSending(false);
      form.reset();
      return;
    }

    try {
      const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: notes,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFeedback({ error: true, text: result.error || "Could not send your swatch request." });
        return;
      }
      setFeedback({ error: false, text: "Swatch request sent. We’ll reply by email." });
      form.reset();
    } catch {
      setFeedback({ error: true, text: "Could not reach the contact service. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="paper px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Swatches</p>
          <h1 className="display-title theme-text text-5xl">Swatch request</h1>
          <p className="theme-muted mt-3 max-w-2xl">
            Pull fabrics from your saved list, comparison, or cart into one inquiry.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal className="surface rounded-3xl border p-6 shadow-sm">
            <h2 className="text-xl font-semibold theme-text">Select fabrics</h2>
            {!candidates.length ? (
              <div className="mt-6 space-y-4 theme-muted">
                <p>No saved, compared, or cart fabrics yet.</p>
                <Link to="/products" className="btn-primary inline-flex">
                  Browse catalog
                </Link>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {candidates.map((item) => (
                  <li key={item._id}>
                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[color:var(--fb-border)] p-3 transition hover:border-emerald-700/30">
                      <input
                        type="checkbox"
                        checked={selected.has(item._id)}
                        onChange={() => toggle(item._id)}
                        className="h-4 w-4 accent-emerald-800"
                      />
                      <FabricImage
                        src={item.imageUrl}
                        category={item.category}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block font-semibold theme-text">{item.name}</span>
                        <span className="text-sm theme-muted">
                          {[item.category, item.colour, item.finish].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <form onSubmit={submit} className="surface space-y-4 rounded-3xl border p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold theme-text">Inquiry details</h2>
              <label className="block text-sm font-medium">
                Name
                <input className="field-input" name="name" autoComplete="name" maxLength={100} required />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input className="field-input" name="email" type="email" autoComplete="email" maxLength={254} required />
              </label>
              <label className="block text-sm font-medium">
                Preferred colours (optional)
                <input className="field-input" name="colours" maxLength={200} placeholder="e.g. ivory, indigo, natural" />
              </label>
              <label className="block text-sm font-medium">
                Notes
                <textarea
                  className="field-input"
                  name="notes"
                  rows={4}
                  maxLength={1200}
                  placeholder="Timeline, end use, or shipping destination"
                />
              </label>
              <button type="submit" disabled={sending || !candidates.length} className="btn-primary disabled:opacity-50">
                {sending ? "Sending…" : "Submit swatch request"}
              </button>
              {feedback && (
                <p role={feedback.error ? "alert" : "status"} className={feedback.error ? "text-red-700" : "theme-brand"}>
                  {feedback.text}{" "}
                  {!feedback.error && (
                    <Link to="/quotes" className="underline">
                      View quote history
                    </Link>
                  )}
                </p>
              )}
              {isDemoMode && (
                <p className="rounded-2xl border border-amber-200 theme-soft px-4 py-3 text-sm text-amber-950">
                  Demo mode saves the request locally and does not email it.
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
