import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatFabricQuantity, minimumQuantity } from "../services/catalog";
import { apiUrl } from "../services/api";

const fieldClass = "w-full rounded-lg border border-gray-300 px-4 py-3";
const buttonClass = "rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white disabled:opacity-50";

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const belowMinimum = cart.some((item) => item.quantity < minimumQuantity(item));
  const hasSamples = cart.some((item) => item.sample);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState([]);

  function downloadSample() {
    const selection = cart.map(({ name, quantity, sample, priceUnit }) => `- ${name} × ${priceUnit ? formatFabricQuantity(quantity, priceUnit) : quantity}${sample ? " (sample fabric)" : ""}`).join("\n");
    const text = `Fabricaa sample quote request\nIllustrative only. This request has not been sent.\n\n${selection}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "fabricaa-sample-quote.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
          name: form.get("name"), email: form.get("email"), notes: form.get("notes"), items,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setError(result.error || "Could not send your request. Please try again.");
        if (response.status === 409 && Array.isArray(result.issues)) setIssues(result.issues);
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent || cart.length === 0) {
    return (
      <section className="space-y-5 px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">{sent ? "Quote request sent" : "Your cart is empty"}</h1>
        {sent && <p>We’ll reply to your email with pricing and availability.</p>}
        <Link to="/products" className={buttonClass}>Browse Products</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-2">
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold">{hasSamples ? "Preview Sample Quote" : "Request a Quote"}</h1>
        {hasSamples ? (
          <div className="space-y-4">
            <p>Your selection includes sample fabrics. Download it as a draft, or remove the samples from your cart to request a live quote.</p>
            <button type="button" disabled={belowMinimum} className={buttonClass} onClick={downloadSample}>Download Sample Quote</button>
            {belowMinimum && <p role="alert">Adjust your cart to meet the minimum quantities before downloading.</p>}
            <Link to="/cart" className="block text-emerald-700 underline">Edit cart</Link>
          </div>
        ) : <form onSubmit={submitQuote} className="space-y-5">
          <label className="block">
            Name
            <input className={fieldClass} name="name" autoComplete="name" maxLength={100} required />
          </label>
          <label className="block">
            Email
            <input className={fieldClass} name="email" type="email" autoComplete="email" maxLength={254} required />
          </label>
          <label className="block">
            Notes (optional)
            <textarea className={fieldClass} name="notes" maxLength={1000} rows={4} />
          </label>
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {issues.length > 0 && (
            <ul className="space-y-3 rounded-lg bg-amber-50 p-4">
              {issues.map(({ id, name, available, minimum = 1 }) => {
                const item = cart.find((fabric) => fabric._id === id);
                const canAdjust = available >= minimum;
                const quantity = Math.max(minimum, Math.min(available, item?.quantity ?? minimum));
                return (
                  <li key={id} className="flex flex-wrap items-center justify-between gap-2">
                    <span>{name || item?.name} · {available ? `${available} available, minimum ${minimum}` : "Unavailable"}</span>
                    <button type="button" className="text-emerald-700 underline" onClick={() => {
                      if (canAdjust) updateQuantity(id, quantity, { stockCount: available, minimumOrderQuantity: minimum });
                      else removeFromCart(id);
                      setIssues((current) => current.filter((issue) => issue.id !== id));
                      if (issues.length === 1) setError("");
                    }}>
                      {canAdjust ? `Change quantity to ${quantity}` : "Remove from cart"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button type="submit" disabled={sending} className={buttonClass}>
            {sending ? "Sending…" : "Send Quote Request"}
          </button>
        </form>}
      </div>
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Selected Fabrics</h2>
        <ul className="divide-y">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between gap-4 py-4">
              <span>{item.name}{item.sample ? " · Sample" : ""}</span>
              <span>Qty {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
