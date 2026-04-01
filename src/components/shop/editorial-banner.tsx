import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function EditorialBanner({ spotlight }: { spotlight: Product }) {
  return (
    <section className="page-shell py-10">
      <div className="relative grid overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[image:var(--editorial-bg)] text-[var(--foreground)] shadow-[0_24px_70px_rgba(17,42,72,0.12)] dark:border-white/10 dark:shadow-[0_26px_80px_rgba(0,0,0,0.38)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_42%,rgba(37,99,235,0.08)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%,rgba(90,167,255,0.12)_100%)]" />
        <div className="relative p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-x-6 inset-y-6 rounded-[2rem] border border-white/26 bg-[linear-gradient(145deg,rgba(255,255,255,0.28),rgba(255,246,241,0.16))] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-[3px] dark:border-white/8 dark:bg-[rgba(12,8,12,0.34)] dark:shadow-none dark:backdrop-blur-md" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-dark)] shadow-[0_8px_18px_rgba(42,24,28,0.08)] dark:border-white/14 dark:bg-white/12 dark:text-white dark:shadow-none">
              Editor&apos;s pick
            </span>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold tracking-tight text-[#2c201b] dark:text-white sm:text-5xl">
              A polished tech storefront deserves one signature hero product.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] dark:text-white/76">
              Spotlight a standout laptop or accessory with clear pricing,
              refined presentation, and a direct route to purchase.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/product/${spotlight.slug}`}
              className="rounded-full bg-[var(--brand)] px-6 py-4 text-center font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.22)] dark:shadow-[0_18px_34px_rgba(90,167,255,0.18)]"
              >
                Shop {spotlight.name}
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-[rgba(42,24,28,0.08)] bg-[rgba(255,255,255,0.62)] px-6 py-4 text-center font-semibold text-[var(--foreground)] shadow-[0_10px_24px_rgba(42,24,28,0.06)] dark:border-white/12 dark:bg-white/8 dark:text-white dark:shadow-none"
              >
                Open cart
              </Link>
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 border-t border-[var(--line)] p-8 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:grid-cols-1 lg:p-12">
          <div className="rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.42)] p-4 shadow-[0_10px_24px_rgba(42,24,28,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] dark:text-white/62">
              Spotlight item
            </p>
            <p className="mt-2 text-2xl font-semibold dark:text-white">{spotlight.name}</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.42)] p-4 shadow-[0_10px_24px_rgba(42,24,28,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] dark:text-white/62">
              Price
            </p>
            <p className="mt-2 text-2xl font-semibold dark:text-white">
              {formatCurrency(spotlight.price)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.42)] p-4 shadow-[0_10px_24px_rgba(42,24,28,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] dark:text-white/62">
              Social proof
            </p>
            <p className="mt-2 text-2xl font-semibold dark:text-white">
              {spotlight.reviewCount}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
