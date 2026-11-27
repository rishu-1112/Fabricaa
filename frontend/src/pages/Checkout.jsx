import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatFabricQuantity, itemPrice, minimumQuantity } from "../services/catalog";
import { apiUrl } from "../services/api";
import { saveQuoteDraft } from "../services/quoteHistory";

const fieldClass = "field-input";
const buttonClass = "btn-primary disabled:opacity-50";

function buildQuoteText(cart) {
  const lines = cart.map(({ name, quantity, sample, priceUnit, material, category }) => {
    const qty = priceUnit ? formatFabricQuantity(quantity, priceUnit) : `${quantity}`;
    const meta = [category, material, sample ? "sample fabric" : null].filter(Boolean).join(" · ");
    return `- ${name} × ${qty}${meta ? ` (${meta})` : ""}`;
  });
  return `Fabricaa sample quote request\nIllustrative only. This request has not been sent.\n\n${lines.join("\n")}`;
}

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const belowMinimum = cart.some((item) => item.quantity < minimumQuantity(item));
  const hasSamples = cart.some((item) => item.sample);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState([]);

  const previewLines = useMemo(
    () =>
      cart.map((item) => {
        const unit = itemPrice(item);
        const lineTotal = unit * item.quantity;
        return { ...item, unit, lineTotal };
      }),
    [cart]
  );
  const previewTotal = previewLines.reduce((sum, item) => sum + item.lineTotal, 0);
  const createdAt = useMemo(
    () =>
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  function downloadSample() {
    const text = buildQuoteText(cart);
    saveQuoteDraft({
      type: "sample-download",
      items: cart,
      notes: "Downloaded sample quote draft (not emailed).",
    });
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "fabricaa-sample-quote.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printPreview() {
    window.print();
  }

  async function submitQuote(event) {
    event.preventDefault();
    if (sending || hasSamples) return;

    const form = new FormData(event.currentTarget);
    const items = cart.map(({ _id, quantity }) => ({ id: _id, quantity }));

    setError("");
    setIssues([]);
    setSending(true);
    try {
      const response = await fetch(apiUrl("/contact/quote"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          notes: form.get("notes"),
          items,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setError(result.error || "Could not send your request. Please try again.");
        if (response.status === 409 && Array.isArray(result.issues)) setIssues(result.issues);
        return;
      }
      saveQuoteDraft({
        type: "live-quote",
        items: cart,
        notes: form.get("notes") || "",
        contact: { name: form.get("name"), email: form.get("email") },
      });
      setSent(true);
    } catch {
      setError("Could not send your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent || cart.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="display-title text-4xl theme-text">
          {sent ? "Quote request sent" : "Your cart is empty"}
        </h1>
        {sent ? (
          <p className="theme-muted max-w-md">
            We’ll reply to your email with pricing and availability.{" "}
            <Link to="/quotes" className="underline">
              View quote history
            </Link>
          </p>
        ) : (
          <p className="theme-muted max-w-md">
            Add fabrics to your cart first, then come back to request a quote.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/products" className={buttonClass}>
            Browse products
          </Link>
          <Link to="/quotes" className="btn-secondary">
            Quote history
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="paper mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:px-10 lg:grid-cols-2">
      <div className="surface rounded-3xl border border-[color:var(--fb-border)] p-8 shadow-sm print:hidden">
        <h1 className="display-title mb-6 text-3xl theme-text">
          {hasSamples ? "Preview sample quote" : "Request a quote"}
        </h1>
        {hasSamples ? (
          <div className="space-y-4">
            <p className="theme-muted">
              Your selection includes sample fabrics. Review the quote preview on the right, print or download a draft,
              or remove samples from your cart to request a live quote.
            </p>
            {belowMinimum && (
              <p role="alert" className="rounded-2xl theme-soft px-4 py-3 text-sm">
                Adjust your cart to meet the minimum quantities before downloading or printing.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={belowMinimum} className={buttonClass} onClick={printPreview}>
                Print preview
              </button>
              <button type="button" disabled={belowMinimum} className="btn-secondary" onClick={downloadSample}>
                Download sample quote
              </button>
            </div>
            <Link to="/cart" className="theme-brand block font-semibold underline">
              Edit cart
            </Link>
          </div>
        ) : (
          <form onSubmit={submitQuote} className="space-y-5">
            <label className="block text-sm font-medium">
              Name
              <input className={fieldClass} name="name" autoComplete="name" maxLength={100} required />
            </label>
            <label className="block text-sm font-medium">
              Email
              <input className={fieldClass} name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
            <label className="block text-sm font-medium">
              Notes (optional)
              <textarea className={fieldClass} name="notes" maxLength={1000} rows={4} />
            </label>
            {error && (
              <p role="alert" className="text-red-700">
                {error}
              </p>
            )}
            {issues.length > 0 && (
              <ul className="theme-soft space-y-3 rounded-2xl p-4">
                {issues.map(({ id, name, available, minimum = 1 }) => {
                  const item = cart.find((fabric) => fabric._id === id);
                  const canAdjust = available >= minimum;
                  const quantity = Math.max(minimum, Math.min(available, item?.quantity ?? minimum));
                  return (
                    <li key={id} className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        {name || item?.name} · {available ? `${available} available, minimum ${minimum}` : "Unavailable"}
                      </span>
                      <button
                        type="button"
                        className="theme-brand underline"
                        onClick={() => {
                          if (canAdjust) {
                            updateQuantity(id, quantity, {
                              stockCount: available,
                              minimumOrderQuantity: minimum,
                            });
                          } else removeFromCart(id);
                          setIssues((current) => current.filter((issue) => issue.id !== id));
                          if (issues.length === 1) setError("");
                        }}
                      >
                        {canAdjust ? `Change quantity to ${quantity}` : "Remove from cart"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={sending} className={buttonClass}>
                {sending ? "Sending…" : "Send quote request"}
              </button>
              <button type="button" className="btn-secondary" onClick={printPreview}>
                Print preview
              </button>
            </div>
          </form>
        )}
      </div>

      <article
        id="quote-preview"
        className="surface rounded-3xl border border-[color:var(--fb-border)] p-8 shadow-sm print:border-0 print:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--fb-border)] pb-5">
          <div>
            <p className="theme-brand text-xs font-semibold uppercase tracking-[0.14em]">Fabricaa</p>
            <h2 className="display-title mt-1 text-3xl theme-text">Quote preview</h2>
            <p className="theme-muted mt-1 text-sm">{createdAt}</p>
          </div>
          {hasSamples && (
            <span className="theme-soft rounded-full px-3 py-1 text-xs font-semibold">
              Illustrative sample
            </span>
          )}
        </div>

        <p className="theme-muted mt-5 text-sm">
          {hasSamples
            ? "Prices below are illustrative for sample fabrics and are not a live quote."
            : "Review quantities below before sending your request."}
        </p>

        <ul className="mt-6 divide-y divide-[color:var(--fb-border)]">
          {previewLines.map((item) => (
            <li key={item._id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-semibold theme-text">
                  {item.name}
                  {item.sample ? " · Sample" : ""}
                </p>
                <p className="theme-muted mt-1 text-sm">
                  {[item.category, item.material, item.colour, item.finish].filter(Boolean).join(" · ")}
                </p>
                <p className="theme-muted mt-1 text-sm">
                  {formatFabricQuantity(item.quantity, item.priceUnit)}
                  {item.priceUnit ? ` · ₹${item.unit.toLocaleString("en-IN")} / ${item.priceUnit}` : ""}
                </p>
              </div>
              <p className="font-semibold theme-text sm:text-right">
                ₹{item.lineTotal.toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-[color:var(--fb-border)] pt-4">
          <p className="theme-muted text-sm">Estimated total</p>
          <p className="display-title text-2xl theme-text">₹{previewTotal.toLocaleString("en-IN")}</p>
        </div>
      </article>
    </section>
  );
}
