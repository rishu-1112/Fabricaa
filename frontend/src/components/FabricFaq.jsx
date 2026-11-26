import { fabricFaq } from "../data/sampleCatalog";

export default function FabricFaq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-left">
      <h2 className="mb-5 display-title text-3xl">Fabric and Quote Questions</h2>
      <div className="divide-y rounded-xl border border-gray-200 bg-white px-5">
        {fabricFaq.map(({ question, answer }) => (
          <details key={question} className="py-4">
            <summary className="cursor-pointer font-semibold">{question}</summary>
            <p className="mt-3 text-gray-600">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
