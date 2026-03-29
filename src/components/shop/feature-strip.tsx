const features = [
  {
    title: "Ready to ship",
    text: "Fresh products, simple checkout, and a clean browsing flow.",
  },
  {
    title: "Fast discovery",
    text: "Category-led browsing and compact product cards keep shopping easy.",
  },
  {
    title: "Trusted payments",
    text: "Built around mobile shoppers with M-Pesa-ready checkout support.",
  },
];

export function FeatureStrip() {
  return (
    <section className="page-shell py-4">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className="glass-card rounded-[1.75rem] p-5"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <p className="font-mono text-base font-semibold">{feature.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {feature.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
