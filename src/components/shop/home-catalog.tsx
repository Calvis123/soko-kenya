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

  return (
    <section id="catalog" className="page-shell py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Marketplace picks</span>
          <h2 className="section-title mt-4">Explore products</h2>
        </div>
        <div className="glass-card rounded-[1.5rem] p-4 lg:min-w-[320px]">
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
          All
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

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Filter quickly
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Switch categories or search by product name, style, and tags.
          </p>
        </div>
        <div className="glass-card rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Available now
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Popular now
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
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
