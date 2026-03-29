const testimonials = [
  {
    quote:
      "The store already feels like a brand, not just a template. Browsing on mobile is smooth and clear.",
    name: "Mercy W.",
    role: "Nairobi customer",
  },
  {
    quote:
      "The product presentation makes it easier to trust the offer. It feels premium and organized.",
    name: "Daniel O.",
    role: "Kisumu shopper",
  },
  {
    quote:
      "This kind of layout is much better for launch because the products feel curated instead of dumped into one grid.",
    name: "Linet K.",
    role: "Retail founder",
  },
];

export function SocialProof() {
  return (
    <section className="page-shell py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Customer confidence</span>
          <h2 className="section-title mt-4">A storefront that feels trusted</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          Strong visual design matters because it signals quality before the
          first checkout click.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="glass-card rounded-[2rem] p-6">
            <p className="text-base leading-8 text-[var(--foreground)]">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="mt-6 font-semibold">{testimonial.name}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{testimonial.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
