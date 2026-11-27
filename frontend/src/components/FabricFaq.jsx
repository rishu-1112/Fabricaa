import { fabricFaq } from "../data/sampleCatalog";
import ScrollReveal from "./ScrollRevealAbout";

export default function FabricFaq() {
  return (
    <section className="paper px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <ScrollReveal>
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">FAQ</p>
          <h2 className="display-title theme-text text-4xl sm:text-5xl">Fabric and quote questions</h2>
          <p className="theme-muted mt-4 max-w-sm">Quick answers before you shortlist fabrics or send a quote request.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <div className="divide-y border-y" style={{ borderColor: "var(--fb-border)" }}>
            {fabricFaq.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="theme-text cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {question}
                    <span className="theme-brand transition group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </span>
                </summary>
                <p className="theme-muted mt-3 max-w-2xl leading-relaxed">{answer}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
