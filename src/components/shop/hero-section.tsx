import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Truck } from "lucide-react";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  products: Product[];
};

export function HeroSection({ categories, products }: Props) {
  const spotlightProducts = products.slice(0, 6);
  const quickSearches = [
    "Wireless earbuds",
    "Kitchen storage",
    "Beauty sets",
    "Office desk lamps",
    "Travel bags",
  ];

  return (
    <section className="page-shell py-8 lg:py-10">
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="glass-card hidden rounded-[2rem] p-5 xl:block">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            All categories
          </p>
          <div className="mt-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="#catalog"
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-[var(--surface-soft-hover)]"
              >
                <span>{category.name}</span>
                <ArrowRight size={15} className="text-[var(--muted)]" />
              </Link>
            ))}
          </div>
        </aside>

        <div className="glass-card rise-in relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-[var(--hero-orb-a)] blur-3xl" />
          <div className="absolute bottom-[-4rem] left-[-2rem] h-48 w-48 rounded-full bg-[var(--hero-orb-b)] blur-3xl" />

          <div className="relative">
            <span className="eyebrow">Marketplace style shopping</span>
            <h1 className="section-title mt-5 max-w-3xl">
              Discover trending products, everyday essentials, and fast-moving
              local picks in one place.
            </h1>

            <div className="mt-6 rounded-[1.9rem] border border-[var(--search-border)] bg-[var(--search-shell)] p-3 shadow-[0_18px_44px_var(--search-ring)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-[1.35rem] border border-[var(--search-border)] bg-[var(--search-input)] px-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--search-icon-bg)] text-[var(--brand)]">
                    <Search size={18} />
                  </div>
                  <span className="text-sm font-medium text-[var(--muted)]">
                    Search products, categories, or trending items
                  </span>
                </div>
                <Link
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-[1.35rem] bg-[var(--brand)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
                >
                  Start shopping
                </Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearches.map((item) => (
                <Link
                  key={item}
                  href="#catalog"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-soft-hover)]"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.6rem] bg-[var(--card-strong)]/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Product range
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold">
                  {products.length}+
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-[var(--card-strong)]/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Categories
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold">
                  {categories.length}
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-[var(--card-strong)]/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Payments
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold">M-Pesa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Quick benefits
            </p>
            <div className="mt-5 grid gap-3">
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
                <Truck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Fast dispatch</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Popular picks ready for quick delivery in Kenya.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
                <ShieldCheck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Secure checkout</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Smooth cart and payment flow for mobile-first shoppers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[var(--accent-strong)] p-6 text-white shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">
              Trending now
            </p>
            <div className="mt-4 space-y-3">
              {spotlightProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-between rounded-[1.35rem] bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-white/75">
                      {product.category}
                    </p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
