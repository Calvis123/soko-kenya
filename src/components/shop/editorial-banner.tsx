import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function EditorialBanner({ spotlight }: { spotlight: Product }) {
  return (
    <section className="page-shell py-10">
      <div className="relative grid overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[image:var(--editorial-bg)] text-[var(--foreground)] shadow-[0_26px_80px_rgba(17,42,72,0.14)] dark:border-white/10 dark:shadow-[0_28px_90px_rgba(0,0,0,0.4)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_28%,rgba(37,99,235,0.16)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_36%,rgba(90,167,255,0.14)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_88%_18%,rgba(73,163,255,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(14,165,198,0.14),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,193,214,0.1),transparent_22%)]" />
        <div className="relative p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-x-6 inset-y-6 rounded-[2rem] border border-white/26 bg-[linear-gradient(145deg,rgba(14,36,61,0.38),rgba(78,120,167,0.18))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_34px_rgba(17,42,72,0.08)] backdrop-blur-[3px] dark:border-white/8 dark:bg-[linear-gradient(145deg,rgba(10,18,28,0.34),rgba(15,31,46,0.22))] dark:shadow-none dark:backdrop-blur-md" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-[rgba(17,42,72,0.12)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#163a66] shadow-[0_10px_22px_rgba(17,42,72,0.12)] dark:border-white/14 dark:bg-white/12 dark:text-white dark:shadow-none">
              Editor&apos;s pick
            </span>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold tracking-tight text-[#122b46] dark:text-white sm:text-5xl">
              A polished tech storefront deserves one signature hero product.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#405a74] dark:text-white/76">
              Spotlight a standout laptop or accessory with clear pricing,
              refined presentation, and a direct route to purchase.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/product/${spotlight.slug}`}
              className="rounded-full bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] px-6 py-4 text-center font-semibold text-white shadow-[0_18px_34px_rgba(37,99,235,0.24)] dark:shadow-[0_18px_34px_rgba(90,167,255,0.18)]"
              >
                Shop {spotlight.name}
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-[rgba(17,42,72,0.12)] bg-[rgba(255,255,255,0.82)] px-6 py-4 text-center font-semibold text-[#18314d] shadow-[0_10px_24px_rgba(17,42,72,0.08)] backdrop-blur-sm dark:border-white/12 dark:bg-white/8 dark:text-white dark:shadow-none"
              >
                Open cart
              </Link>
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 border-t border-[var(--line)] p-8 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:grid-cols-1 lg:p-12">
          <div className="rounded-[1.5rem] border border-white/28 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(226,239,255,0.54))] p-4 shadow-[0_12px_28px_rgba(17,42,72,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4b6480] dark:text-white/62">
              Spotlight item
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#112845] dark:text-white">{spotlight.name}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/28 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(226,239,255,0.54))] p-4 shadow-[0_12px_28px_rgba(17,42,72,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4b6480] dark:text-white/62">
              Price
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#112845] dark:text-white">
              {formatCurrency(spotlight.price)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/28 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(226,239,255,0.54))] p-4 shadow-[0_12px_28px_rgba(17,42,72,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/7 dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4b6480] dark:text-white/62">
              Social proof
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#112845] dark:text-white">
              {spotlight.reviewCount}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
