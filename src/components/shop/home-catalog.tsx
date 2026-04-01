"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  products: Product[];
  featuredProducts: Product[];
};

export function HomeCatalog({
  categories,
  products,
  featuredProducts,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.description} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [deferredQuery, products, selectedCategory]);

  const dealProducts = featuredProducts.slice(0, 4);
  const recommendedProducts = filteredProducts.slice(0, 8);
  const latestProducts = products.slice(0, 4);

  return (
    <section id="catalog" className="page-shell py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Curated shelves</span>
          <h2 className="section-title mt-4">Shop the collection</h2>
        </div>
        <div className="glass-card rounded-[1.8rem] p-4 lg:min-w-[340px]">
          <label className="block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Search products
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-[1.35rem] border border-[var(--search-border)] bg-[var(--search-input)] px-4 py-3 shadow-[0_12px_28px_var(--search-ring)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--search-icon-bg)] text-[var(--brand)]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[18px] w-[18px] fill-none stroke-current stroke-2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, tag, or description"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            selectedCategory === "all"
              ? "bg-[var(--brand)] text-white"
              : "border border-[var(--line)]"
          }`}
        >
          All categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selectedCategory === category.slug
                ? "bg-[var(--brand)] text-white"
                : "border border-[var(--line)]"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                New arrivals
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Fresh tech picks chosen to keep the storefront current, useful,
                and easy to browse.
              </p>
            </div>
            <p className="rounded-full bg-[rgba(37,99,235,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]">
              Just landed
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
        <div className="glass-card rounded-[2rem] p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Catalog overview
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {filteredProducts.length} products
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-[1.4rem] bg-[var(--surface-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Best category
              </p>
              <p className="mt-2 text-base font-semibold">
                {selectedCategory === "all"
                  ? "Everything in store"
                  : categories.find((category) => category.slug === selectedCategory)?.name}
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-[var(--surface-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Search status
              </p>
              <p className="mt-2 text-base font-semibold">
                {deferredQuery.trim() ? `Showing results for "${deferredQuery}"` : "Browse top inventory"}
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-[var(--surface-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Shopper note
              </p>
              <p className="mt-2 text-base font-semibold">
                Tap any product card for more images, details, and checkout
                options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {dealProducts.length > 0 ? (
        <div className="relative mt-8 overflow-hidden rounded-[2.2rem] border border-[var(--line)] bg-[image:var(--promo-panel)] p-6 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%,rgba(37,99,235,0.08)_100%)]" />
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">
                Best sellers
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                A polished shelf of the laptop and accessory picks customers reach for most.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Recommended for you
          </p>
          <p className="text-sm text-[var(--muted)]">
            Click any card to view more details
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            All products
          </p>
          <p className="text-sm text-[var(--muted)]">
            Showing {filteredProducts.length} of {products.length}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="glass-card mt-6 rounded-[1.5rem] p-8 text-center text-[var(--muted)]">
            No products match this filter yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
