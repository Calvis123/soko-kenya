import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
  categories: Category[];
  products: Product[];
};

export function HeroSection({ categories, products }: Props) {
  const spotlightProducts = products.slice(0, 3);
  const featureProduct = products[0];
  const quickSearches = [
    "Laptops",
    "Wireless mouse",
    "USB-C hubs",
    "Laptop stands",
    "Travel chargers",
  ];
  const featureBadges = [
    { icon: Truck, title: "Express delivery", text: "Nairobi and nationwide" },
    { icon: ShieldCheck, title: "Secure checkout", text: "M-Pesa and pickup payment" },
    { icon: Sparkles, title: "Curated tech picks", text: "Top laptop and accessory essentials" },
  ];
  const spotlightCategory = categories.slice(0, 4);

  return (
    <section className="page-shell py-8 lg:py-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="glass-card rise-in relative overflow-hidden rounded-[2.6rem] p-6 before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_34%,rgba(37,99,235,0.12)_100%)] before:content-[''] sm:p-8 lg:p-10">
          <Image
            src="https://images.pexels.com/photos/32755775/pexels-photo-32755775.jpeg"
            alt="Laptop workspace hero background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(94deg,rgba(8,20,34,0.8)_0%,rgba(11,31,52,0.7)_24%,rgba(16,54,79,0.44)_48%,rgba(27,86,117,0.2)_70%,rgba(255,255,255,0.06)_100%)] dark:bg-[linear-gradient(92deg,rgba(8,18,30,0.92)_0%,rgba(9,29,49,0.84)_26%,rgba(13,51,77,0.6)_52%,rgba(20,91,124,0.3)_72%,rgba(255,255,255,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,223,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(83,194,255,0.22),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(90,167,255,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(34,193,214,0.18),transparent_28%)]" />
          <div className="absolute right-[-3rem] top-[-3rem] h-56 w-56 rounded-full bg-[var(--hero-orb-a)] blur-3xl" />
          <div className="absolute bottom-[-4rem] left-[-2rem] h-64 w-64 rounded-full bg-[var(--hero-orb-b)] blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <span className="eyebrow border-white/20 bg-white/14 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-white/18 dark:bg-white/12">
                Tech edit
              </span>
              <h1 className="section-title mt-5 max-w-3xl text-white">
                Premium laptops, accessories, and desk-ready tech curated for
                work, travel, and everyday performance.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/84 sm:text-base">
                Discover bestselling laptop gear, productivity accessories, and
                reliable everyday devices in one refined storefront.
              </p>

              <div className="mt-6 rounded-[2rem] border border-white/14 bg-[rgba(255,248,244,0.18)] p-3 shadow-[0_24px_54px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-white/12 dark:bg-[rgba(255,250,246,0.16)]">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex flex-1 items-center gap-3 rounded-[1.5rem] border border-white/16 bg-[rgba(255,255,255,0.92)] px-4 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--search-icon-bg)] text-[var(--brand)]">
                      <Search size={18} />
                    </div>
                    <span className="text-sm font-medium text-[var(--muted)]">
                      Search laptops, chargers, keyboards, storage, and more
                    </span>
                  </div>
                  <Link
                    href="#catalog"
                    className="inline-flex items-center justify-center rounded-[1.4rem] bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.32)] transition hover:brightness-105"
                  >
                    Shop now
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <Link
                    key={item}
                    href="#catalog"
                    className="rounded-full border border-white/18 bg-white/14 px-4 py-2 text-sm text-white/88 shadow-[0_8px_18px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:bg-white/2 dark:bg-white/12 dark:hover:bg-white/18"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {featureBadges.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[1.7rem] border border-white/14 bg-[rgba(24,17,22,0.54)] p-5 text-white shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-md dark:border-white/12 dark:bg-[rgba(16,11,15,0.58)]"
                  >
                    <feature.icon size={18} className="text-[var(--brand-dark)]" />
                    <p className="mt-3 text-sm font-semibold">{feature.title}</p>
                    <p className="mt-1 text-sm text-white/78">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {featureProduct ? (
                <Link
                  href={`/product/${featureProduct.slug}`}
                  className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--card-strong)] shadow-[var(--shadow)] transition hover:-translate-y-1"
                >
                  <div className="relative h-72">
                    <Image
                      src={featureProduct.images[0]}
                      alt={featureProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/75">
                        Featured today
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {featureProduct.name}
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        {formatCurrency(featureProduct.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Shop by category
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {spotlightCategory.map((category) => (
                    <Link
                      key={category.id}
                      href="#catalog"
                      className="flex items-center justify-between rounded-[1.3rem] bg-[var(--card-strong)] px-4 py-3 text-sm font-medium transition hover:translate-x-1"
                    >
                      <span>{category.name}</span>
                      <ArrowRight size={15} className="text-[var(--muted)]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="relative overflow-hidden rounded-[2.2rem] bg-[image:var(--accent-strong)] p-6 text-white shadow-[var(--shadow)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.08))]" />
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">
              Trending now
            </p>
            <div className="relative mt-4 space-y-3">
              {spotlightProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/12 px-4 py-3 backdrop-blur-sm transition hover:bg-white/18"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-white/75">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2.2rem] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Why shoppers love us
            </p>
            <div className="mt-5 grid gap-3">
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
                <Truck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Fast dispatch</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Same-day Nairobi delivery for quick device and accessory restocks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
                <ShieldCheck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Trusted checkout</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Secure payment flow for devices, accessories, and pickup orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
