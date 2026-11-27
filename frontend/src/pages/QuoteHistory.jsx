import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollRevealAbout";
import { formatFabricQuantity } from "../services/catalog";
import { clearQuoteHistory, readQuoteHistory, removeQuoteDraft } from "../services/quoteHistory";

function typeLabel(type) {
  if (type === "swatch-request") return "Swatch request";
  if (type === "sample-download") return "Sample quote download";
  if (type === "live-quote") return "Live quote request";
  return type;
}

export default function QuoteHistory() {
  const [entries, setEntries] = useState(() => readQuoteHistory());

  function refresh(next) {
    setEntries(next ?? readQuoteHistory());
  }

  return (
    <section className="paper px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">History</p>
            <h1 className="display-title theme-text text-5xl">Quote history</h1>
            <p className="theme-muted mt-3 max-w-xl">
              Drafts saved in this browser from checkout downloads, live quote sends, and swatch requests.
            </p>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                clearQuoteHistory();
                refresh([]);
              }}
            >
              Clear history
            </button>
          )}
        </ScrollReveal>

        {!entries.length ? (
          <ScrollReveal className="surface mt-10 rounded-3xl border p-8 text-center shadow-sm">
            <p className="theme-muted">No saved quote drafts yet.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/products" className="btn-primary">
                Browse fabrics
              </Link>
              <Link to="/checkout" className="btn-secondary">
                Go to checkout
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <ul className="mt-10 space-y-4">
            {entries.map((entry) => (
              <li key={entry.id}>
                <ScrollReveal className="surface rounded-3xl border p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] theme-brand">
                        {typeLabel(entry.type)}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold theme-text">
                        {new Date(entry.createdAt).toLocaleString()}
                      </h2>
                      {entry.contact?.email && (
                        <p className="mt-1 text-sm theme-muted">
                          {entry.contact.name ? `${entry.contact.name} · ` : ""}
                          {entry.contact.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold theme-muted underline"
                      onClick={() => refresh(removeQuoteDraft(entry.id))}
                    >
                      Remove
                    </button>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm theme-muted">
                    {entry.items.map((item) => (
                      <li key={`${entry.id}-${item._id}`}>
                        {item.name}
                        {item.colour ? ` · ${item.colour}` : ""} ·{" "}
                        {formatFabricQuantity(item.quantity, item.priceUnit)}
                        {item.sample ? " · sample" : ""}
                      </li>
                    ))}
                  </ul>
                  {entry.notes && (
                    <p className="surface-muted mt-4 whitespace-pre-wrap rounded-2xl p-3 text-sm theme-muted">
                      {entry.notes}
                    </p>
                  )}
                </ScrollReveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
