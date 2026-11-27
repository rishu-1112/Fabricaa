const STORAGE_KEY = "fabricaa-quote-history";
const LIMIT = 40;

export function readQuoteHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function saveQuoteDraft({ type, items, notes = "", contact = {} }) {
  const entry = {
    id: `quote-${Date.now()}`,
    createdAt: new Date().toISOString(),
    type,
    notes,
    contact,
    items: items.map(({ _id, name, quantity, priceUnit, sample, colour }) => ({
      _id,
      name,
      quantity,
      priceUnit,
      sample: Boolean(sample),
      colour,
    })),
  };

  const next = [entry, ...readQuoteHistory()].slice(0, LIMIT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the current session usable even if storage is full.
  }
  return entry;
}

export function clearQuoteHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function removeQuoteDraft(id) {
  const next = readQuoteHistory().filter((entry) => entry.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }
  return next;
}

export function metresNeeded(garments, metresPerGarment, wastagePercent) {
  const g = Math.max(0, Number(garments) || 0);
  const m = Math.max(0, Number(metresPerGarment) || 0);
  const w = Math.max(0, Number(wastagePercent) || 0);
  return Number((g * m * (1 + w / 100)).toFixed(2));
}
