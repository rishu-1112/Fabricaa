export default function ThemeLoader({
  label = "Loading…",
  fullPage = false,
  className = "",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-5 text-center ${
        fullPage ? "min-h-[55vh] px-6 py-20" : "px-6 py-12"
      } ${className}`}
    >
      <div className="relative h-14 w-14" aria-hidden="true">
        <span
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: "color-mix(in srgb, var(--fb-brand) 15%, transparent)" }}
        />
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--fb-brand)", borderRightColor: "color-mix(in srgb, var(--fb-brand) 70%, transparent)" }}
        />
        <span
          className="absolute inset-2 animate-pulse rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--fb-brand) 12%, transparent)" }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: "var(--fb-brand)" }}
        />
      </div>
      <div>
        <p className="display-title text-2xl" style={{ color: "var(--fb-ink)" }}>{label}</p>
        <p className="mt-1 text-sm" style={{ color: "var(--fb-muted)" }}>Fabricaa textile catalog</p>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
