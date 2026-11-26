import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiUrl } from "../services/api";

const fieldClass = "w-full rounded-lg border border-gray-300 px-4 py-3";
const buttonClass = "rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-50";

export default function Checkout() {
  const { cart } = useCart();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submitQuote(event) {
    event.preventDefault();
    if (sending) return;

    const form = new FormData(event.currentTarget);
    const selection = cart.map(({ name, quantity }) => `- ${name} × ${quantity}`).join("\n");
    const message = ["Quote request", selection, form.get("notes").trim()]
      .filter(Boolean)
      .join("\n\n");

    if (message.length > 2000) {
      setError("Shorten your notes or remove items to keep the request under 2,000 characters.");
      return;
    }

    setError("");
    setSending(true);
    try {
      const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(result.error || "Could not send your request. Please try again.");
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
        <h1 className="mb-6 text-2xl font-semibold">Request a Quote</h1>
        <form onSubmit={submitQuote} className="space-y-5">
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
          <button type="submit" disabled={sending} className={buttonClass}>
            {sending ? "Sending…" : "Send Quote Request"}
          </button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Selected Fabrics</h2>
        <ul className="divide-y">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between gap-4 py-4">
              <span>{item.name}</span>
              <span>Qty {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
