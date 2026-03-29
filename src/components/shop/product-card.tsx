"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const categoryLabel = product.category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <article className="glass-card group flex h-full flex-col overflow-hidden rounded-[2rem] border border-transparent bg-[var(--product-card-bg)] transition duration-300 hover:-translate-y-1 hover:border-[var(--line)]">
      <div className="relative h-52 overflow-hidden sm:h-56">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border bg-[var(--product-tag-bg)] px-3 py-1 text-xs font-semibold text-[var(--product-tag-text)] shadow-[var(--product-tag-shadow)] backdrop-blur-md"
              style={{ borderColor: "var(--product-tag-border)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-dark)]">
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-sm text-[var(--muted)]">
            <Star size={14} className="fill-current text-amber-500" />
            {product.rating}
          </span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="font-mono text-xl font-semibold tracking-tight"
        >
          {product.name}
        </Link>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--muted)]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
          <p>{product.reviewCount} reviews</p>
          <p>{product.stock} in stock</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Price
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
              }

              addItem(product);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--cta-solid)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--cta-solid-hover)] hover:text-white"
          >
            <ShoppingBag size={16} />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
