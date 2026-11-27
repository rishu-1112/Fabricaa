import ScrollReveal, { Stagger, StaggerItem } from "./ScrollRevealAbout";

const points = [
  { title: "Premium fibres", detail: "Curated cloth with clear specs for GSM, width, and minimums." },
  { title: "Responsible dye", detail: "Eco-minded colour processes for cleaner production choices." },
  { title: "Reliable delivery", detail: "On-time global shipping windows for production calendars." },
  { title: "Custom direction", detail: "Design support when you need a blend, finish, or special weave." },
];

export default function WhyUs() {
  return (
    <section className="surface-muted border-y px-6 py-24 sm:px-10" style={{ borderColor: "var(--fb-border)" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <ScrollReveal>
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Why Fabricaa</p>
          <h2 className="display-title theme-text text-4xl sm:text-5xl">Built for serious textile projects</h2>
        </ScrollReveal>
        <Stagger className="grid gap-8 sm:grid-cols-2" delay={0.05}>
          {points.map(({ title, detail }, index) => (
            <StaggerItem key={title}>
              <p className="theme-brand text-xs font-bold tracking-[0.14em]">0{index + 1}</p>
              <h3 className="theme-text mt-2 text-xl font-semibold">{title}</h3>
              <p className="theme-muted mt-2 text-sm leading-relaxed">{detail}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
