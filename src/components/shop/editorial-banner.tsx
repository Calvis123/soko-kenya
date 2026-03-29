import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function EditorialBanner({ spotlight }: { spotlight: Product }) {
  return (
    <section className="page-shell py-10">
      <div className="grid overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#1b1a17_0%,#8d4725_45%,#d28c42_100%)] text-white shadow-[var(--shadow)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
            Editor&apos;s pick
          </span>
          <h2 className="mt-6 max-w-lg font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
            One statement product can lift the entire storefront.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
            Use a hero offer to create focus. This section highlights a premium
            product with strong pricing, descriptive copy, and a clear route to
            purchase.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/product/${spotlight.slug}`}
              className="rounded-full bg-white px-6 py-4 text-center font-semibold text-[#1b1a17]"
            >
              Shop {spotlight.name}
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-white/20 px-6 py-4 text-center font-semibold text-white"
            >
              Open cart
            </Link>
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/10 p-8 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:grid-cols-1 lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">
              Spotlight item
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold">{spotlight.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">
              Price
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {formatCurrency(spotlight.price)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">
              Social proof
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {spotlight.reviewCount}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
