import { ShieldCheck, Headphones, LaptopMinimalCheck, Truck } from "lucide-react";

const trustPoints = [
  {
    icon: LaptopMinimalCheck,
    title: "Verified device picks",
    text: "Well-presented laptops, accessories, and everyday tech essentials in one storefront.",
  },
  {
    icon: Truck,
    title: "Fast fulfilment",
    text: "Same-day Nairobi dispatch and reliable nationwide delivery planning.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Clear payment options, order tracking, and a safer buying flow for customers.",
  },
  {
    icon: Headphones,
    title: "Support that helps",
    text: "Customer care built for questions around accessories, orders, and product selection.",
  },
];

const stats = [
  { label: "Catalog categories", value: "4+" },
  { label: "Checkout options", value: "2" },
  { label: "Order visibility", value: "Live" },
];

export function SocialProof() {
  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[2.2rem] p-6 sm:p-8">
          <span className="eyebrow">Store confidence</span>
          <h2 className="section-title mt-4">
            Built to feel like a real retail storefront
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Strong presentation, clear product discovery, and structured support
            details make the storefront feel more credible from the first visit.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <article
              key={point.title}
              className="glass-card rounded-[2rem] bg-[var(--surface-elevated)] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[var(--product-chip-bg)] text-[var(--brand)]">
                <point.icon size={20} />
              </div>
              <p className="mt-4 text-lg font-semibold">{point.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {point.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
